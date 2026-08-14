window.__ModuleLoader__.load({
  id: "@local/dsh-plugin-installer",
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" })
    const react = require("react")

    const CSS = `
.dspi-root { min-width:0; flex-direction:column; gap:10px; display:flex; }
.dspi-card { border:1px solid var(--dsw-alias-border-l2); background:var(--dsw-alias-bg-layer-3); border-radius:12px; transition:border-color .16s; flex-direction:column; display:flex; }
.dspi-card:hover { border-color:var(--dsw-alias-label-dimmed); }
.dspi-card-head { padding:14px 16px; flex-direction:column; gap:4px; display:flex; }
.dspi-card-title { margin:0; color:var(--dsw-alias-label-primary); font-size:15px; font-weight:600; line-height:1.4; }
.dspi-card-desc { margin:0; color:var(--dsw-alias-label-tertiary); font-size:13px; line-height:1.5; }
.dspi-card-body { border-top:1px solid var(--dsw-alias-border-l2); margin:14px 16px 0; padding-bottom:8px; flex-direction:column; display:flex; }
.dspi-card-foot { border-top:1px solid var(--dsw-alias-border-l2); margin:0 16px; justify-content:flex-end; align-items:center; gap:8px; padding:12px 0; display:flex; }
.dspi-head-row { align-items:center; gap:10px; display:flex; }
.dspi-head-main { flex-direction:column; gap:4px; flex:1; min-width:0; display:flex; }
.dspi-field { flex-direction:column; gap:6px; padding:12px 0; display:flex; }
.dspi-field + .dspi-field { border-top:1px solid var(--dsw-alias-border-l2); }
.dspi-label { color:var(--dsw-alias-label-primary); font-size:13px; font-weight:500; line-height:1.5; }
.dspi-input { width:100%; box-sizing:border-box; border:1px solid var(--dsw-alias-border-l2); background:var(--dsw-alias-bg-layer-3); height:34px; font:inherit; color:var(--dsw-alias-label-primary); border-radius:8px; padding:0 12px; font-size:13px; line-height:1.5; }
.dspi-input:focus-visible { border-color:var(--dsw-alias-brand-primary); outline:none; }
.dspi-input::placeholder { color:var(--dsw-alias-label-tertiary); }
.dspi-hint { margin:0; color:var(--dsw-alias-label-tertiary); font-size:12px; line-height:1.5; }
.dspi-hint-err { margin:0; color:var(--dsw-alias-label-error); font-size:12px; line-height:1.5; }
.dspi-hint-ok { margin:0; color:var(--dsw-alias-state-success-primary); font-size:12px; line-height:1.5; }
.dspi-row-actions { align-items:center; gap:8px; display:flex; flex-wrap:wrap; }
.dspi-file-name { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--dsw-alias-label-secondary); font-size:12px; line-height:1.5; }
.dspi-btn { appearance:none; font:inherit; cursor:pointer; border:1px solid #0000; border-radius:8px; padding:5px 14px; font-size:13px; line-height:1.5; background:var(--dsw-alias-label-primary); color:var(--dsw-alias-bg-layer-3); }
.dspi-btn:focus-visible { outline:2px solid var(--dsw-alias-brand-primary); outline-offset:1px; }
.dspi-btn:disabled { opacity:.4; cursor:default; }
.dspi-btn-ghost { appearance:none; font:inherit; cursor:pointer; border:1px solid var(--dsw-alias-border-l2); border-radius:8px; padding:5px 14px; font-size:13px; line-height:1.5; background:0 0; color:var(--dsw-alias-label-secondary); }
.dspi-btn-ghost:hover:not(:disabled) { color:var(--dsw-alias-label-primary); border-color:var(--dsw-alias-label-dimmed); }
.dspi-btn-ghost:focus-visible { outline:2px solid var(--dsw-alias-brand-primary); outline-offset:1px; }
.dspi-btn-ghost:disabled { opacity:.4; cursor:default; }
.dspi-btn-danger { border-color:var(--dsw-alias-border-l2); color:var(--dsw-alias-label-error); }
.dspi-btn-danger:hover:not(:disabled) { border-color:var(--dsw-alias-label-error); color:var(--dsw-alias-label-error); }
.dspi-foot-text { min-width:0; flex:1; margin:0; color:var(--dsw-alias-label-tertiary); font-size:12px; line-height:1.5; }
.dspi-foot-text-ok { color:var(--dsw-alias-state-success-primary); }
.dspi-foot-text-err { color:var(--dsw-alias-label-error); }
.dspi-foot-text-warn { color:var(--dsw-alias-state-warn-primary); }
.dspi-details { color:var(--dsw-alias-label-tertiary); font-size:12px; line-height:1.5; padding-top:4px; }
.dspi-details summary { cursor:pointer; color:var(--dsw-alias-label-secondary); }
.dspi-details summary:hover { color:var(--dsw-alias-label-primary); }
.dspi-code { margin:8px 0 0; padding:10px 12px; border:1px solid var(--dsw-alias-border-l1); border-radius:8px; background:var(--dsw-alias-bg-layer-2); font-family:var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace); font-size:12px; line-height:1.6; color:var(--dsw-alias-label-secondary); white-space:pre-wrap; word-break:break-all; max-height:220px; overflow:auto; }
.dspi-list { flex-direction:column; display:flex; }
.dspi-item { align-items:center; gap:10px; padding:10px 0; display:flex; }
.dspi-item + .dspi-item { border-top:1px solid var(--dsw-alias-border-l2); }
.dspi-item-main { flex-direction:column; gap:2px; flex:1; min-width:0; display:flex; }
.dspi-item-head { align-items:center; gap:8px; display:flex; flex-wrap:wrap; }
.dspi-item-name { color:var(--dsw-alias-label-primary); font-size:13px; font-weight:500; line-height:1.5; }
.dspi-item-id { color:var(--dsw-alias-label-tertiary); font-family:var(--dsw-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace); font-size:11px; line-height:17px; }
.dspi-item-desc { margin:0; color:var(--dsw-alias-label-tertiary); font-size:12px; line-height:1.5; }
.dspi-chip { white-space:nowrap; background:var(--dsw-alias-bg-module-platform); color:var(--dsw-alias-label-secondary); border-radius:999px; padding:1px 8px; font-size:11px; font-weight:500; line-height:17px; }
.dspi-chip-ok { background:var(--dsw-alias-bg-module-platform); color:var(--dsw-alias-state-success-primary); }
.dspi-chip-err { background:var(--dsw-alias-bg-module-platform); color:var(--dsw-alias-label-error); }
.dspi-chip-muted { background:0 0; color:var(--dsw-alias-label-tertiary); }
.dspi-empty { margin:12px 0 4px; color:var(--dsw-alias-label-tertiary); font-size:13px; line-height:1.5; }
`

    const tagId = "@local/dsh-plugin-installer/client.css"
    if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
      const tag = document.createElement("style")
      tag.dataset.plugin = "@local/dsh-plugin-installer"
      tag.dataset.pluginCss = tagId
      tag.textContent = CSS
      document.head.appendChild(tag)
    }

    async function rpc(method, args) {
      const res = await fetch("/plugin-installer/" + method, {
        method: "POST",
        headers: { "content-type": "application/json", "x-dsh-plugin-installer": "1" },
        body: JSON.stringify(args === undefined ? {} : args)
      })
      let data = null
      try {
        data = await res.json()
      } catch (error) {
        // fall through to the generic error below
      }
      if (!res.ok || data === null) {
        const message = data !== null && typeof data === "object" && typeof data.error === "string" ? data.error : "HTTP " + String(res.status)
        throw new Error(message)
      }
      return data
    }

    function useExternal(store) {
      const [, force] = react.useState(0)
      react.useEffect(() => {
        if (store === undefined) return undefined
        return store.subscribe(() => force((n) => n + 1))
      }, [store])
      return store === undefined ? undefined : store.getSnapshot()
    }

    function statusText(row) {
      if (row.status === "awaiting-approval") return "待批准"
      if (row.status === "rejected") return "已拒绝"
      if (row.status === "cancelled") return "已取消"
      if (row.status === "waiting") return "等待服务"
      if (row.status === "running") return "运行中"
      return "未运行"
    }

    const MANIFEST_EXAMPLE = JSON.stringify({
      name: "我的插件",
      purpose: "一个示例插件",
      idPrefix: "demo",
      host: "return { apply(ctx) { console.log('host half up') } }",
      client: "return { inject: ['slots'], apply(ctx) { ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({ name: 'settings.plugins.tab', id: 'demo-tab', label: 'Demo' }, () => React.createElement('div', null, 'Hello'))) } }"
    }, null, 2)

    function InstallTab(props) {
      const sessionId = props.useSessions === undefined ? undefined : props.useSessions((state) => state.current)
      const ui = props.ui
      const cr = ui === undefined ? undefined : ui.cr
      const loadedStore = ui === undefined ? undefined : ui.loadedStore
      const [file, setFile] = react.useState(null)
      const [gitUrl, setGitUrl] = react.useState("")
      const [gitRef, setGitRef] = react.useState("")
      const [fileBusy, setFileBusy] = react.useState(false)
      const [fileStatus, setFileStatus] = react.useState(null)
      const [gitBusy, setGitBusy] = react.useState(false)
      const [gitStatus, setGitStatus] = react.useState(null)
      const [installed, setInstalled] = react.useState(undefined)
      const [listError, setListError] = react.useState("")
      const [listNotice, setListNotice] = react.useState("")
      const [refreshing, setRefreshing] = react.useState(false)

      const loadedRows = useExternal(loadedStore)
      const loadedIds = new Set(loadedRows === undefined ? [] : loadedRows.map((r) => r.pluginId))

      function refreshNow() {
        if (typeof sessionId !== "string") { setInstalled([]); setListError(""); return }
        setRefreshing(true)
        rpc("installed-list", { sessionId }).then((res) => {
          if (res !== null && typeof res === "object" && Array.isArray(res.rows)) {
            setInstalled(res.rows)
            setListError("")
          } else {
            setInstalled([])
            setListError("读取已安装插件列表失败")
          }
        }, () => { setInstalled([]); setListError("读取已安装插件列表失败") }).then(() => setRefreshing(false), () => setRefreshing(false))
      }

      react.useEffect(() => { refreshNow() }, [sessionId])

      async function installPayload(payload, setBusy, setStatus) {
        if (typeof sessionId !== "string") { setStatus({ kind: "err", text: "当前没有打开的会话，无法安装" }); return }
        setBusy(true)
        setStatus({ kind: "busy", text: "正在安装…" })
        try {
          const res = await rpc("install", payload)
          if (res === null || typeof res !== "object" || res.ok !== true) {
            setStatus({ kind: "err", text: res !== null && typeof res === "object" && typeof res.error === "string" ? res.error : "安装失败" })
            return
          }
          if (cr === undefined) {
            setStatus({ kind: "warn", text: "插件包已定义并持久化（" + res.pluginId + "），但当前页面缺少动态插件运行时，未热加载" })
            return
          }
          try {
            await cr.startUserRun({ agentId: sessionId, pluginId: res.pluginId, packageId: res.packageId, mode: res.mode, hasClientHalf: res.hasClientHalf === true })
          } catch (error) {
            // failure lands in lastRunError below
          }
          const errRow = cr.lastRunError.getSnapshot().get(res.pluginId)
          const row = cr.getSnapshot().find((candidate) => candidate.pluginId === res.pluginId)
          if (errRow !== undefined) {
            setStatus({ kind: "err", text: "安装完成但运行失败：已持久化，重启后仍会尝试恢复。" })
          } else if (res.hasClientHalf !== true || row !== undefined) {
            setStatus({ kind: "ok", text: (res.updated ? "已更新" : "已安装") + "并热加载：已持久化，重启后自动恢复。" })
          } else {
            setStatus({ kind: "warn", text: "已安装并持久化：" + res.name + "（Host 已启动，Client 加载状态未确认）" })
          }
          refreshNow()
        } catch (error) {
          setStatus({ kind: "err", text: error !== null && typeof error === "object" && typeof error.message === "string" ? error.message : String(error) })
        } finally {
          setBusy(false)
        }
      }

      function installFile() {
        if (file === null) { setFileStatus({ kind: "err", text: "请先选择插件包文件（dsh-plugin.json）" }); return }
        installPayload({ source: "file", content: file.content, filename: file.name, sessionId }, setFileBusy, setFileStatus)
      }

      function installGit() {
        if (gitUrl.trim() === "") { setGitStatus({ kind: "err", text: "请输入 Git 仓库地址" }); return }
        installPayload({ source: "git", url: gitUrl, ref: gitRef.trim() === "" ? null : gitRef.trim(), sessionId }, setGitBusy, setGitStatus)
      }

      function removeRow(row) {
        if (typeof row.key !== "string" || typeof sessionId !== "string") return
        if (!window.confirm("确定移除「" + row.name + "」并取消其持久化吗？移除后会停止运行并彻底删除，重启后也不会再恢复。")) return
        setListNotice("")
        setListError("")
        rpc("remove", { key: row.key, sessionId }).then(() => {
          setListNotice("已移除「" + row.name + "」并取消持久化。")
          refreshNow()
        }, (error) => {
          setListError(error !== null && typeof error === "object" && typeof error.message === "string" ? error.message : String(error))
        })
      }

      const busy = fileBusy || gitBusy

      return react.createElement("div", { className: "dspi-root" },
        sessionId === undefined ? react.createElement("p", { className: "dspi-empty" }, "当前没有打开的会话，无法安装插件（动态插件按会话归属）。") : null,

        react.createElement("section", { className: "dspi-card" },
          react.createElement("div", { className: "dspi-card-head" },
            react.createElement("h3", { className: "dspi-card-title" }, "上传插件包文件"),
            react.createElement("p", { className: "dspi-card-desc" }, "选择本地 dsh-plugin.json 清单文件（不超过 2MB）。安装成功后立即热加载，并持久化到磁盘，重启 DSH 后自动恢复。" )
          ),
          react.createElement("div", { className: "dspi-card-body" },
            react.createElement("div", { className: "dspi-field" },
              react.createElement("span", { className: "dspi-label" }, "插件包文件"),
              react.createElement("div", { className: "dspi-row-actions" },
                react.createElement("label", { className: "dspi-btn dspi-btn-ghost", htmlFor: "dspi-file-input" }, "选择文件"),
                file === null
                  ? react.createElement("span", { className: "dspi-file-name" }, "未选择文件")
                  : react.createElement("span", { className: "dspi-file-name" }, file.name + "（" + String(Math.round(file.content.length / 1024)) + " KB）"),
                file === null ? null : react.createElement("button", { type: "button", className: "dspi-btn dspi-btn-ghost", disabled: busy, onClick: () => { setFile(null); setFileStatus(null) } }, "清除")
              ),
              react.createElement("input", {
                id: "dspi-file-input",
                type: "file",
                accept: ".json,application/json",
                style: { display: "none" },
                onChange: (event) => {
                  const picked = event.target !== null && event.target !== undefined && event.target.files !== null && event.target.files !== undefined ? event.target.files[0] : undefined
                  if (picked === undefined) return
                  if (picked.size > 2 * 1024 * 1024) { setFileStatus({ kind: "err", text: "文件超过 2MB 限制" }); return }
                  picked.text().then((text) => { setFile({ name: picked.name, content: text }); setFileStatus(null) }, () => setFileStatus({ kind: "err", text: "读取文件失败" }))
                }
              })
            ),
            react.createElement("details", { className: "dspi-details" },
              react.createElement("summary", null, "插件包格式说明（dsh-plugin.json）"),
              react.createElement("pre", { className: "dspi-code" }, MANIFEST_EXAMPLE),
              react.createElement("p", { className: "dspi-hint", style: { marginTop: 6 } }, "name / purpose 必填；host 与 client 至少提供一个，均为返回 Cordis 插件的函数体源码；id 用于更新识别（可选，缺省用 name）；idPrefix 为 3–6 个小写字母（可选）。")
            )
          ),
          react.createElement("div", { className: "dspi-card-foot" },
            fileStatus === null ? null : react.createElement("p", { className: "dspi-foot-text dspi-foot-text-" + fileStatus.kind }, fileStatus.text),
            react.createElement("button", { type: "button", className: "dspi-btn", disabled: busy || sessionId === undefined, onClick: installFile }, fileBusy ? "安装中…" : "安装并热加载")
          )
        ),

        react.createElement("section", { className: "dspi-card" },
          react.createElement("div", { className: "dspi-card-head" },
            react.createElement("h3", { className: "dspi-card-title" }, "从 Git 仓库安装"),
            react.createElement("p", { className: "dspi-card-desc" }, "克隆仓库并读取其根目录的 dsh-plugin.json，同样支持持久化与重启自动恢复。支持 http(s) / ssh / git 协议与 git@ 地址。" )
          ),
          react.createElement("div", { className: "dspi-card-body" },
            react.createElement("div", { className: "dspi-field" },
              react.createElement("label", { className: "dspi-label", htmlFor: "dspi-git-url" }, "仓库地址"),
              react.createElement("input", { id: "dspi-git-url", className: "dspi-input", placeholder: "https://github.com/user/repo.git", value: gitUrl, onChange: (event) => setGitUrl(event.target.value) })
            ),
            react.createElement("div", { className: "dspi-field" },
              react.createElement("label", { className: "dspi-label", htmlFor: "dspi-git-ref" }, "分支 / 标签"),
              react.createElement("input", { id: "dspi-git-ref", className: "dspi-input", placeholder: "可选，默认使用仓库默认分支", value: gitRef, onChange: (event) => setGitRef(event.target.value) })
            )
          ),
          react.createElement("div", { className: "dspi-card-foot" },
            gitStatus === null ? null : react.createElement("p", { className: "dspi-foot-text dspi-foot-text-" + gitStatus.kind }, gitStatus.text),
            react.createElement("button", { type: "button", className: "dspi-btn", disabled: busy || sessionId === undefined, onClick: installGit }, gitBusy ? "安装中…" : "安装并热加载")
          )
        ),

        react.createElement("section", { className: "dspi-card" },
          react.createElement("div", { className: "dspi-card-head dspi-head-row" },
            react.createElement("div", { className: "dspi-head-main" },
              react.createElement("h3", { className: "dspi-card-title" }, "本会话已安装的插件"),
              react.createElement("p", { className: "dspi-card-desc" }, "带「持久化」徽标的插件在重启 DSH 后会自动恢复（打开本会话时生效；带界面的插件需在插件面板确认一次授权）。移除请使用本页按钮，可一并取消持久化。" )
            ),
            react.createElement("button", { type: "button", className: "dspi-btn dspi-btn-ghost", disabled: refreshing, onClick: refreshNow }, refreshing ? "刷新中…" : "刷新")
          ),
          react.createElement("div", { className: "dspi-card-body" },
            listError !== "" ? react.createElement("p", { className: "dspi-hint-err" }, listError) : null,
            listNotice !== "" ? react.createElement("p", { className: "dspi-hint-ok" }, listNotice) : null,
            installed === undefined
              ? react.createElement("p", { className: "dspi-empty" }, "加载中…")
              : installed.length === 0
                ? react.createElement("p", { className: "dspi-empty" }, "还没有通过本页安装的插件。")
                : react.createElement("div", { className: "dspi-list" }, installed.map((row) => react.createElement("div", { className: "dspi-item", key: row.pluginId },
                    react.createElement("div", { className: "dspi-item-main" },
                      react.createElement("div", { className: "dspi-item-head" },
                        react.createElement("span", { className: "dspi-item-name" }, row.name),
                        react.createElement("span", { className: "dspi-item-id" }, row.pluginId)
                      ),
                      row.purpose === "" ? null : react.createElement("p", { className: "dspi-item-desc" }, row.purpose)
                    ),
                    row.persisted === true ? react.createElement("span", { className: "dspi-chip" }, "持久化") : null,
                    row.active ? react.createElement("span", { className: "dspi-chip dspi-chip-ok" }, "运行中") : null,
                    !row.active && row.status === "failed" ? react.createElement("span", { className: "dspi-chip dspi-chip-err" }, "运行失败") : null,
                    !row.active && row.status === "stopped" ? react.createElement("span", { className: "dspi-chip dspi-chip-muted" }, "已停止") : null,
                    !row.active && row.status !== "failed" && row.status !== "stopped" && row.status !== "none" ? react.createElement("span", { className: "dspi-chip dspi-chip-muted" }, statusText(row)) : null,
                    loadedIds.has(row.pluginId) ? react.createElement("span", { className: "dspi-chip dspi-chip-muted" }, "本页已加载") : null,
                    typeof row.key === "string" ? react.createElement("button", { type: "button", className: "dspi-btn dspi-btn-ghost dspi-btn-danger", onClick: () => removeRow(row) }, "移除") : null
                  )))
          )
        )
      )
    }

    const inject = ["slots"]
    function apply(ctx) {
      const slots = ctx.slots
      const cr = ctx.get("dynamicCordisRunner")
      const ui = {
        cr,
        loadedStore: cr === undefined ? undefined : { getSnapshot: () => cr.getSnapshot(), subscribe: (fn) => cr.subscribe(fn) }
      }
      slots.inject("settings.plugins.tab", () => slots.register(
        { name: "settings.plugins.tab", id: "install", order: 5, label: "安装插件" },
        (props) => react.createElement(InstallTab, { useSessions: props.useSessions, ui })
      ))
    }

    exports.apply = apply
    exports.inject = inject
    return module.exports
  }
})
