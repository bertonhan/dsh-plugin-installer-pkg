> 🌐 Language / 语言：[English](README.md) · 中文（本页）

# DSH 插件安装器（dsh-plugin-installer）

给任意 DSH 部署加一个「插件安装」能力：在 **设置 → 插件** 中新增「**安装插件**」页，
上传插件包文件或填一个 Git 仓库地址就能安装动态插件，**安装即热加载**；
安装器与已安装的插件都**跨重启持久化**。
最大的亮点是：**全程无需你敲任何 CLI 命令**——把本包交给 DSH 对话说一句
「安装这个插件」，AI 会按 `AGENTS.md` 完成部署改造、重启与验证。

---

## ✨ 核心亮点

| 亮点 | 说明 |
| --- | --- |
| 🗣️ **对话即安装，零 CLI** | 不需要终端：把安装包交给 DSH 会话，AI 自动完成 profile 探测、组合补丁、符号链接与（征得同意后的）服务重启，全程不需要你输入任何命令 |
| 💾 **默认持久化** | 安装器以静态插件挂入部署组合（`cordis.patch.yml`），每次启动自动生效；通过它安装的插件清单落盘 `store.json`，重启后打开所属会话自动恢复 |
| ⚡ **安装即热加载** | 点击「安装并热加载」后立即生效：宿主半面马上启动，浏览器界面立刻出现在当前页面，无需重启 |
| 🔄 **同名热更新** | 重新安装同名/同 `id` 的插件包自动进入 `update` 模式，替换当前运行版本 |
| 🗂️ **双安装源** | 本地 `dsh-plugin.json` 清单文件（≤2MB），或 Git 仓库（http(s)/ssh/git 协议、`git@` 形式，可选分支/标签） |
| 🎨 **原生设计语言** | 页面完全按 DSH 官方设置页规范构建（卡片、字段、按钮、徽标与「可配置」页一致），明暗主题自适应 |
| 🔌 **可移植** | 安装脚本幂等，自动探测 profile 与 node_modules 位置；适用于任意带 cordis 动态插件体系的 DSH 部署，缺失时优雅报错而非崩坏 |
| 🧹 **一键彻底移除** | 安装页「移除」按钮 = 停止运行 + 删除磁盘清单 + 取消持久化，重启后不再出现 |

## 🚀 快速开始（对话安装，推荐）

1. 把本目录（或压缩包）交给 DSH 会话，说一句：**「安装这个插件」**；
2. AI 会按 `AGENTS.md` 执行：定位 `DSH_HOME` 与 profile → 运行 `install.sh`
   （幂等，可重复执行）→ 询问并重启服务（同意时自动代劳并验证）；
3. 重启后打开 **设置 → 插件**，出现「安装插件」标签页即成功。

等价的手动安装命令（可选，效果与第 2 步相同）：

```bash
bash install.sh                    # 自动探测唯一 profile
bash install.sh --profile web      # 多 profile 时显式指定
bash install.sh --dsh-home /path   # 指定 DSH_HOME
```

脚本会依次完成并输出：复制插件包 → 建立 `@local/dsh-plugin-installer` 符号链接 →
追加组合挂载行（已存在则跳过）→ node 解析校验（有 `dsh` 命令时顺带
`--dump-config` 复核）。重启后验证：

```bash
curl -s http://127.0.0.1:3080/ | grep -c "@local/dsh-plugin-installer"   # 期望 1
curl -s -o /dev/null -w "%{http_code}" \
  "http://127.0.0.1:3080/plugins/@local/dsh-plugin-installer/client.js"   # 期望 200
```

**只想免重启试用？** 把 `dsh-plugin-installer.json` 交给 DSH 代理，用
`cordis_define` + `cordis_run` 安装即可（会话级、临时，不写磁盘）。

## 📦 目录结构

```
dsh-plugin-installer-pkg/
├── AGENTS.md                     # 给 AI 代理的安装指南（对话安装的执行规范）
├── README.md                     # 英文文档
├── README.zh.md                  # 本文档（中文）
├── install.sh                    # 持久化安装脚本（幂等）
├── scripts/restart-dsh.sh        # 脱离进程树的重启辅助脚本（供代理代劳重启）
├── dsh-plugin-installer.json     # 临时模式安装清单（cordis_define 用）
└── plugin/                       # 静态插件包 @local/dsh-plugin-installer
    ├── package.json
    └── lib/
        ├── index.js              # 宿主半面：安装逻辑 + 持久化 + 会话恢复
        └── client.js             # 页面半面：设置 → 插件 的安装页 UI
```

## 🛠️ 使用

### 安装插件（两种方式）

- **上传插件包文件**：选择 `dsh-plugin.json` 清单文件（≤2MB）；
- **Git 仓库地址**：填仓库 URL（支持 http(s)/ssh/git 协议与 `git@`），
  可选分支/标签；仓库根目录需包含 `dsh-plugin.json`。

清单格式：

```json
{
  "name": "我的插件",
  "purpose": "一句话说明",
  "idPrefix": "demo",
  "host": "return { apply(ctx) { ... } }",
  "client": "return { inject: ['slots'], apply(ctx) { ... } }"
}
```

- `name` / `purpose` 必填；`host` 与 `client` 至少一个（与 `cordis_define`
  相同的函数体源码格式）；`id`（可选）用于更新识别，缺省用 `name`；
  `idPrefix`（可选，3–6 位小写字母）。
- 同名/同 `id` 重新安装 → 热更新（`update` 模式）。
- 安装后立即热加载，无需重启。

### 持久化语义

- 每次安装会把清单写入 `$DSH_HOME/plugin-installer/store.json`；
- DSH 重启后，**打开所属会话**时自动恢复注册并运行：
  - 纯宿主插件立即运行；
  - 带浏览器界面的插件会出现在插件面板，确认一次授权后自动加载
    （DSH 对浏览器代码的安全机制，每次重启需重新确认一次）；
- 安装页的插件列表有「持久化」徽标与「移除」按钮：移除 = 停止运行 +
  删除磁盘清单 + 取消持久化（重启后不会再出现）。

## 🗑️ 卸载

```bash
# 1. 从 profile 的 cordis.patch.yml 中删除 plugin-installer 的 insert 块
# 2. 删除符号链接
rm -f "$DSH_HOME/profiles/node_modules/@local/dsh-plugin-installer"
# 3. 删除插件包
rm -rf "$DSH_HOME/plugins/dsh-plugin-installer"
# 4.（可选）删除已安装插件的持久化数据
rm -rf "$DSH_HOME/plugin-installer"
# 5. 重启服务
```

## ❓ 常见问题

| 问题 | 处理 |
| --- | --- |
| 安装页显示「当前进程没有动态插件运行器」 | 该部署没有 cordis 动态插件体系，无法使用本插件 |
| git clone 失败 | 确认机器有 `git`、仓库地址可访问、仓库根目录有 `dsh-plugin.json` |
| 重启后安装的插件没出现 | 打开**所属会话**才会触发恢复；带界面的插件需在插件面板批准一次 |
| 在「可配置」页移除了插件，重启后又回来了 | 面板移除不取消持久化；请在本安装页用「移除」按钮彻底删除 |
| 修改了安装器代码想生效 | 编辑 `$DSH_HOME/plugins/dsh-plugin-installer/lib/*` 后重启服务 |

## 系统要求

- DSH 部署（带 `cordis_*` 动态插件工具的版本，即存在 `dynamicCordisRunner` 服务）；
- Git 安装方式需要系统有 `git` 命令；
- 安装脚本需要写权限到 `$DSH_HOME`（默认 `~/.dsh`）。
