# AGENTS.md — 在 DSH 对话中安装「插件安装器」

本目录是一个可移植安装包：把 `@local/dsh-plugin-installer`（DSH 插件安装器）
装到当前 DSH 部署。**默认持久化安装**（写入部署组合，重启后依然生效）；
用户拒绝重启时才使用临时热安装作为降级。

## 0. 前置侦察

1. 确定 `DSH_HOME`：优先 `$DSH_HOME`，否则 `~/.dsh`。
2. 确定 profile：
   `ls "$DSH_HOME"/profiles/*/cordis.patch.yml`
   - 只有一个 → 直接用；
   - 多个 → 询问用户当前服务使用哪个（或从运行中进程命令行判断，
     `ps aux | grep dsh`）。
3. 权限：写入 `$DSH_HOME` 属于工作区之外。若沙箱拒绝文件写入，
   按本会话允许的方式升级授权后**重试同一条命令**，不要改路径绕行。

## 路径 A（默认）：持久化安装

在**包根目录**执行（幂等，可重复运行）：

```bash
bash install.sh --profile <profile名>
```

脚本依次完成：复制插件包到 `$DSH_HOME/plugins/dsh-plugin-installer`、
在 profile 的 node_modules 建立 `@local/dsh-plugin-installer` 符号链接、
向 `cordis.patch.yml` 追加挂载行、校验 node 解析（有 dsh 命令时顺带
`--dump-config` 复核）。输出里出现「解析 OK」即安装就绪。

组合变更必须重启才生效：

- **首选**：告知用户「需要重启 dsh 服务」，由用户在终端自行重启
  （优雅退出，会话事件能完整落盘）。
- **用户同意自动重启**（把以下命令作为本回合**最后一步**执行）：
  ```bash
  bash scripts/restart-dsh.sh <端口> dsh web
  ```
  示例：`bash scripts/restart-dsh.sh 3080 dsh web`
  （若启动命令带前缀，如 `node /path/.bin/dsh web`，原样传入即可。）

  警告：该脚本会 SIGKILL 当前 dsh 进程——也就是你自身——**本轮回合会中断**
  （SIGKILL 不触发优雅退出，极少数未落盘的会话增量可能丢失，代价通常
  可忽略）。执行前明确告知用户：页面会短暂断线并自动重连，之后回复
  「继续」即可。脚本会先校验监听端口的进程确实是 dsh，防止误杀；
  脚本本身脱离进程树运行，新服务会正常拉起；日志在
  `${TMPDIR:-/tmp}/dsh-restart.log`。

### 重启后验证（新回合里做）

```bash
curl -s http://127.0.0.1:<端口>/ | grep -c "@local/dsh-plugin-installer"   # 期望 1
curl -s -o /dev/null -w "%{http_code}" \
  "http://127.0.0.1:<端口>/plugins/@local/dsh-plugin-installer/client.js"    # 期望 200
```

页面「设置 → 插件」应出现「安装插件」标签页。安装器自此每次启动自动生效。
若用户的会话里安装过插件，打开该会话时它们会自动恢复；带界面的插件在
安装页列表上出现「批准并加载」按钮，告知用户点一下即可（无需去别的面板）。

## 路径 B（用户拒绝重启时的降级）：临时热安装

用 `cordis_define` 安装本目录的 `dsh-plugin-installer.json`（JSON 清单）：

- `name` / `purpose` / `idPrefix` 取清单同名字段；
- `code.host` / `code.client` 取清单 `host` / `client` 字段的原文；
- 然后 `cordis_run` 并请用户在页面批准。

注意：此模式仅当前会话生效、重启后消失，不写任何磁盘文件；也不含
持久化、跨会话复用、页内批准等静态版功能。

## 卸载（用户要求时）

```bash
bash uninstall.sh --profile <profile名>          # 默认连持久化数据一起删除
bash uninstall.sh --profile <profile名> --keep-data   # 保留已安装插件的持久化数据
```

脚本删除组合补丁中的挂载块、`node_modules/@local` 符号链接、插件包目录与
（默认）`$DSH_HOME/plugin-installer` 数据目录；完成后重启服务生效。

## 升级（用户要求时）

重跑 `bash install.sh --profile <profile名>` 即可：插件包会被覆盖为最新
副本（幂等），随后重启服务生效。

## 依赖与边界

- 依赖目标 DSH 存在动态插件运行器 `dynamicCordisRunner`（即带
  `cordis_*` 工具的部署）。没有它时安装页会给出明确报错，而不是崩坏。
- Git 安装方式要求系统有 `git` 命令。
- 安装器持久化的数据是「通过本页安装的插件」；DSH 自身的会话/设置不受影响。
