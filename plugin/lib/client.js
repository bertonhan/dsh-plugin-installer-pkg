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
.dspi-item-meta { margin:0; color:var(--dsw-alias-label-tertiary); font-size:11px; line-height:1.5; display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.dspi-chip { white-space:nowrap; background:var(--dsw-alias-bg-module-platform); color:var(--dsw-alias-label-secondary); border-radius:999px; padding:1px 8px; font-size:11px; font-weight:500; line-height:17px; }
.dspi-chip-ok { background:var(--dsw-alias-bg-module-platform); color:var(--dsw-alias-state-success-primary); }
.dspi-chip-err { background:var(--dsw-alias-bg-module-platform); color:var(--dsw-alias-label-error); }
.dspi-chip-warn { background:var(--dsw-alias-bg-module-platform); color:var(--dsw-alias-state-warn-primary); }
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

    const ZH = {
      tabLabel: "安装插件",
      noSession: "当前没有打开的会话，无法安装插件（动态插件按会话归属）。",
      uploadTitle: "上传插件包文件",
      uploadDesc: "选择本地 dsh-plugin.json 清单文件（不超过 2MB），安装成功后立即热加载，并持久化到磁盘，重启 DSH 后自动恢复。",
      fileField: "插件包文件",
      chooseFile: "选择文件",
      noFile: "未选择文件",
      clear: "清除",
      fileTooBig: "文件超过 2MB 限制",
      readFileFailed: "读取文件失败",
      formatHelp: "插件包格式说明（dsh-plugin.json）",
      formatNote: "name / purpose 必填；host 与 client 至少提供一个，均为返回 Cordis 插件的函数体源码；id 用于更新识别（可选，缺省用 name）；version 版本号（可选）；idPrefix 为 3–6 个小写字母（可选）。",
      gitTitle: "从 Git 仓库安装",
      gitDesc: "克隆仓库并读取其清单文件，同样支持持久化与重启自动恢复。支持 http(s) / ssh / git 协议与 git@ 地址。",
      repoUrl: "仓库地址",
      branchTag: "分支 / 标签",
      branchPlaceholder: "可选，默认使用仓库默认分支",
      manifestPathLabel: "清单文件路径",
      manifestPathPlaceholder: "可选，默认仓库根目录的 dsh-plugin.json（monorepo 可填子目录路径）",
      installBtn: "安装并热加载",
      installing: "安装中…",
      busyText: "正在安装…",
      noSessionErr: "当前没有打开的会话，无法安装",
      pickFileFirst: "请先选择插件包文件（dsh-plugin.json）",
      gitUrlFirst: "请输入 Git 仓库地址",
      installFailed: "安装失败",
      installOk: "已安装并热加载：已持久化，重启后自动恢复。",
      updatedOk: "已更新并热加载：已持久化，重启后自动恢复。",
      installWarn: "已安装并持久化：{name}（Host 已启动，Client 加载状态未确认）",
      runFailed: "安装完成但运行失败：已持久化，重启后仍会尝试恢复。",
      noRunner: "插件包已定义并持久化（{id}），但当前页面缺少动态插件运行时，未热加载",
      installedTitle: "本会话已安装的插件",
      installedDesc: "带「持久化」徽标的插件在重启 DSH 后会自动恢复（打开本会话时生效）。带界面的插件可直接在本页批准加载；移除请使用本页按钮，可一并取消持久化。",
      othersTitle: "其他会话已安装（可复用）",
      copyBtn: "安装到当前会话",
      refresh: "刷新",
      refreshing: "刷新中…",
      loadFailed: "读取已安装插件列表失败",
      emptyList: "还没有通过本页安装的插件。",
      loading: "加载中…",
      chipPersisted: "持久化",
      chipRunning: "运行中",
      chipFailed: "运行失败",
      chipStopped: "已停止",
      chipLoadedHere: "本页已加载",
      chipPending: "待批准",
      chipRejected: "已拒绝",
      chipCancelled: "已取消",
      chipWaiting: "等待服务",
      chipNotRestored: "未恢复",
      chipRestoreFailed: "恢复失败",
      stopBtn: "停止",
      approveBtn: "批准并加载",
      removeBtn: "移除",
      removeConfirm: "确定移除「{name}」并取消其持久化吗？移除后会停止运行并彻底删除，重启后也不会再恢复。",
      removedNotice: "已移除「{name}」并取消持久化。",
      storeErrorPrefix: "持久化数据异常：",
      sourceFile: "文件",
      sourceGit: "Git",
      sourceCopy: "复制"
    }

    const EN = {
      tabLabel: "Install Plugin",
      noSession: "No open session — dynamic plugins belong to sessions, so there is nowhere to install yet.",
      uploadTitle: "Upload a plugin package",
      uploadDesc: "Pick a local dsh-plugin.json manifest (≤2MB). Installs hot-load immediately and persist to disk, with automatic restore after DSH restarts.",
      fileField: "Package file",
      chooseFile: "Choose file",
      noFile: "No file selected",
      clear: "Clear",
      fileTooBig: "File exceeds the 2MB limit",
      readFileFailed: "Failed to read the file",
      formatHelp: "Package format help (dsh-plugin.json)",
      formatNote: "name / purpose are required; provide at least one of host / client (function-body source, same format as cordis_define); id identifies updates (optional, defaults to name); version (optional); idPrefix is 3–6 lowercase letters (optional).",
      gitTitle: "Install from a Git repository",
      gitDesc: "Clones the repository and reads its manifest; persistence and restore work the same. Supports http(s)/ssh/git protocols and git@ addresses.",
      repoUrl: "Repository URL",
      branchTag: "Branch / tag",
      branchPlaceholder: "Optional; defaults to the default branch",
      manifestPathLabel: "Manifest path",
      manifestPathPlaceholder: "Optional; defaults to dsh-plugin.json at the repo root (use a subdirectory path for monorepos)",
      installBtn: "Install & hot load",
      installing: "Installing…",
      busyText: "Installing…",
      noSessionErr: "No open session to install into",
      pickFileFirst: "Pick a package file first (dsh-plugin.json)",
      gitUrlFirst: "Enter a repository URL first",
      installFailed: "Install failed",
      installOk: "Installed & hot-loaded: persisted, and auto-restored after restarts.",
      updatedOk: "Updated & hot-loaded: persisted, and auto-restored after restarts.",
      installWarn: "Installed & persisted: {name} (host started; browser-half load unconfirmed)",
      runFailed: "Installed but the run failed: persisted, and restore will be retried after restart.",
      noRunner: "Package defined & persisted ({id}), but this page lacks the dynamic plugin runtime, so it was not hot-loaded",
      installedTitle: "Plugins installed in this session",
      installedDesc: "Plugins with the \"persisted\" badge are restored automatically after DSH restarts (when this session opens). Browser-UI plugins can be approved to load right here; use the remove button to delete a plugin permanently.",
      othersTitle: "Installed in other sessions (reusable)",
      copyBtn: "Install into this session",
      refresh: "Refresh",
      refreshing: "Refreshing…",
      loadFailed: "Failed to load the installed list",
      emptyList: "No plugins installed from this page yet.",
      loading: "Loading…",
      chipPersisted: "Persisted",
      chipRunning: "Running",
      chipFailed: "Failed",
      chipStopped: "Stopped",
      chipLoadedHere: "Loaded on this page",
      chipPending: "Pending approval",
      chipRejected: "Rejected",
      chipCancelled: "Cancelled",
      chipWaiting: "Waiting",
      chipNotRestored: "Not restored",
      chipRestoreFailed: "Restore failed",
      stopBtn: "Stop",
      approveBtn: "Approve & load",
      removeBtn: "Remove",
      removeConfirm: "Remove \"{name}\" and cancel its persistence? This stops the run, deletes it permanently, and it will not come back after restarts.",
      removedNotice: "Removed \"{name}\" and cancelled persistence.",
      storeErrorPrefix: "Persistence data issue: ",
      sourceFile: "File",
      sourceGit: "Git",
      sourceCopy: "Copy"
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

    const MANIFEST_EXAMPLE = JSON.stringify({
      name: "我的插件",
      purpose: "一个示例插件",
      version: "1.0.0",
      idPrefix: "demo",
      host: "return { apply(ctx) { console.log('host half up') } }",
      client: "return { inject: ['slots'], apply(ctx) { ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({ name: 'settings.plugins.tab', id: 'demo-tab', label: 'Demo' }, () => React.createElement('div', null, 'Hello'))) } }"
    }, null, 2)

    function statusKey(row) {
      if (row.status === "awaiting-approval") return "chipPending"
      if (row.status === "rejected") return "chipRejected"
      if (row.status === "cancelled") return "chipCancelled"
      if (row.status === "waiting") return "chipWaiting"
      if (row.status === "running") return "chipRunning"
      return ""
    }

    function sourceLabel(t, row) {
      if (row.source === "git") return t("sourceGit")
      if (row.source === "copy") return t("sourceCopy")
      return t("sourceFile")
    }

    function formatTime(iso) {
      if (typeof iso !== "string") return ""
      const date = new Date(iso)
      if (Number.isNaN(date.getTime())) return ""
      const pad = (n) => String(n).padStart(2, "0")
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
    }

    function InstallTab(props) {
      const sessionId = props.useSessions === undefined ? undefined : props.useSessions((state) => state.current)
      const ui = props.ui
      const t = ui.t
      const cr = ui.cr
      const loadedStore = ui.loadedStore
      const activeRunsStore = ui.activeRunsStore
      const subscribeReset = ui.subscribeReset
      const [file, setFile] = react.useState(null)
      const [gitUrl, setGitUrl] = react.useState("")
      const [gitRef, setGitRef] = react.useState("")
      const [manifestPath, setManifestPath] = react.useState("")
      const [fileBusy, setFileBusy] = react.useState(false)
      const [fileStatus, setFileStatus] = react.useState(null)
      const [gitBusy, setGitBusy] = react.useState(false)
      const [gitStatus, setGitStatus] = react.useState(null)
      const [installed, setInstalled] = react.useState(undefined)
      const [others, setOthers] = react.useState([])
      const [storeError, setStoreError] = react.useState("")
      const [listError, setListError] = react.useState("")
      const [listNotice, setListNotice] = react.useState("")
      const [refreshing, setRefreshing] = react.useState(false)

      const loadedRows = useExternal(loadedStore)
      const loadedIds = new Set(loadedRows === undefined ? [] : loadedRows.map((r) => r.pluginId))
      const activeRuns = useExternal(activeRunsStore)

      function refreshNow() {
        if (typeof sessionId !== "string") { setInstalled([]); setOthers([]); setListError(""); return }
        setRefreshing(true)
        rpc("installed-list", { sessionId }).then((res) => {
          if (res !== null && typeof res === "object" && Array.isArray(res.rows)) {
            setInstalled(res.rows)
            setOthers(Array.isArray(res.others) ? res.others : [])
            setStoreError(typeof res.storeError === "string" ? res.storeError : "")
            setListError("")
          } else {
            setInstalled([])
            setOthers([])
            setListError(t("loadFailed"))
          }
        }, () => { setInstalled([]); setOthers([]); setListError(t("loadFailed")) }).then(() => setRefreshing(false), () => setRefreshing(false))
      }

      react.useEffect(() => { refreshNow() }, [sessionId])
      react.useEffect(() => {
        if (subscribeReset === undefined) return undefined
        return subscribeReset(() => refreshNow())
      }, [sessionId])

      async function defineAndRun(method, args, setBusy, setStatus) {
        if (typeof sessionId !== "string") { const status = { kind: "err", text: t("noSessionErr") }; setStatus(status); return status }
        setBusy(true)
        const busyStatus = { kind: "busy", text: t("busyText") }
        setStatus(busyStatus)
        try {
          const res = await rpc(method, args)
          if (res === null || typeof res !== "object" || res.ok !== true) {
            const status = { kind: "err", text: res !== null && typeof res === "object" && typeof res.error === "string" ? res.error : t("installFailed") }
            setStatus(status)
            return status
          }
          if (cr === undefined) {
            const status = { kind: "warn", text: t("noRunner", res.pluginId) }
            setStatus(status)
            return status
          }
          try {
            await cr.startUserRun({ agentId: sessionId, pluginId: res.pluginId, packageId: res.packageId, mode: res.mode, hasClientHalf: res.hasClientHalf === true })
          } catch (error) {
            // failure lands in lastRunError below
          }
          const errRow = cr.lastRunError.getSnapshot().get(res.pluginId)
          const row = cr.getSnapshot().find((candidate) => candidate.pluginId === res.pluginId)
          let status
          if (errRow !== undefined) {
            status = { kind: "err", text: t("runFailed") }
          } else if (res.hasClientHalf !== true || row !== undefined) {
            status = { kind: "ok", text: t(res.updated ? "updatedOk" : "installOk") }
          } else {
            status = { kind: "warn", text: t("installWarn", res.name) }
          }
          setStatus(status)
          refreshNow()
          return status
        } catch (error) {
          const status = { kind: "err", text: error !== null && typeof error === "object" && typeof error.message === "string" ? error.message : String(error) }
          setStatus(status)
          return status
        } finally {
          setBusy(false)
        }
      }

      function installFile() {
        if (file === null) { setFileStatus({ kind: "err", text: t("pickFileFirst") }); return }
        defineAndRun("install", { source: "file", content: file.content, filename: file.name, sessionId }, setFileBusy, setFileStatus)
      }

      function installGit() {
        if (gitUrl.trim() === "") { setGitStatus({ kind: "err", text: t("gitUrlFirst") }); return }
        defineAndRun("install", { source: "git", url: gitUrl, ref: gitRef.trim() === "" ? null : gitRef.trim(), manifestPath: manifestPath.trim() === "" ? null : manifestPath.trim(), sessionId }, setGitBusy, setGitStatus)
      }

      function copyRow(entry) {
        if (typeof entry.key !== "string") return
        setListNotice("")
        setListError("")
        defineAndRun("copy", { key: entry.key, sessionId }, setGitBusy, setGitStatus).then((finalStatus) => {
          if (finalStatus === null || finalStatus === undefined) return
          if (finalStatus.kind === "ok") setListNotice(finalStatus.text)
          else setListError(finalStatus.text)
        })
      }

      function stopRow(row) {
        if (typeof row.key !== "string" || typeof sessionId !== "string") return
        setListNotice("")
        setListError("")
        rpc("stop", { key: row.key, sessionId }).then(() => refreshNow(), (error) => {
          setListError(error !== null && typeof error === "object" && typeof error.message === "string" ? error.message : String(error))
        })
      }

      function approveRow(row) {
        if (cr === undefined) return
        const activity = activeRuns instanceof Map ? activeRuns.get(row.pluginId) : undefined
        if (activity === undefined || activity.phase !== "awaiting-approval") return
        setListNotice("")
        setListError("")
        cr.approve(activity.requestId, false).then(() => refreshNow(), () => refreshNow())
      }

      function removeRow(row) {
        if (typeof row.key !== "string" || typeof sessionId !== "string") return
        if (!window.confirm(t("removeConfirm", row.name))) return
        setListNotice("")
        setListError("")
        rpc("remove", { key: row.key, sessionId }).then(() => {
          setListNotice(t("removedNotice", row.name))
          refreshNow()
        }, (error) => {
          setListError(error !== null && typeof error === "object" && typeof error.message === "string" ? error.message : String(error))
        })
      }

      const busy = fileBusy || gitBusy

      function statusChip(row) {
        if (row.restored === false) {
          return row.restoreError === undefined
            ? react.createElement("span", { className: "dspi-chip dspi-chip-warn" }, t("chipNotRestored"))
            : react.createElement("span", { className: "dspi-chip dspi-chip-err" }, t("chipRestoreFailed"))
        }
        if (row.active) return react.createElement("span", { className: "dspi-chip dspi-chip-ok" }, t("chipRunning"))
        if (row.status === "failed") return react.createElement("span", { className: "dspi-chip dspi-chip-err" }, t("chipFailed"))
        if (row.status === "stopped") return react.createElement("span", { className: "dspi-chip dspi-chip-muted" }, t("chipStopped"))
        const key = statusKey(row)
        if (key !== "") return react.createElement("span", { className: "dspi-chip dspi-chip-muted" }, t(key))
        return null
      }

      function rowMeta(row) {
        const parts = []
        if (typeof row.version === "string" && row.version !== "") parts.push("v" + row.version)
        if (typeof row.updatedAt === "string") {
          const time = formatTime(row.updatedAt)
          if (time !== "") parts.push(time)
        }
        if (row.source !== undefined) parts.push(sourceLabel(t, row))
        if (row.sourceUrl !== undefined && typeof row.sourceUrl === "string" && row.sourceUrl !== "") parts.push(row.sourceUrl)
        return parts.length === 0 ? null : react.createElement("p", { className: "dspi-item-meta" }, parts.join(" · "))
      }

      function rowActions(row) {
        const actions = []
        if (row.restored === true) {
          const activity = activeRuns instanceof Map ? activeRuns.get(row.pluginId) : undefined
          if (activity !== undefined && activity.phase === "awaiting-approval" && cr !== undefined) {
            actions.push(react.createElement("button", { key: "approve", type: "button", className: "dspi-btn", onClick: () => approveRow(row) }, t("approveBtn")))
          } else if (row.active) {
            actions.push(react.createElement("button", { key: "stop", type: "button", className: "dspi-btn dspi-btn-ghost", onClick: () => stopRow(row) }, t("stopBtn")))
          }
        }
        if (typeof row.key === "string") {
          actions.push(react.createElement("button", { key: "remove", type: "button", className: "dspi-btn dspi-btn-ghost dspi-btn-danger", onClick: () => removeRow(row) }, t("removeBtn")))
        }
        return actions
      }

      return react.createElement("div", { className: "dspi-root" },
        sessionId === undefined ? react.createElement("p", { className: "dspi-empty" }, t("noSession")) : null,

        react.createElement("section", { className: "dspi-card" },
          react.createElement("div", { className: "dspi-card-head" },
            react.createElement("h3", { className: "dspi-card-title" }, t("uploadTitle")),
            react.createElement("p", { className: "dspi-card-desc" }, t("uploadDesc"))
          ),
          react.createElement("div", { className: "dspi-card-body" },
            react.createElement("div", { className: "dspi-field" },
              react.createElement("span", { className: "dspi-label" }, t("fileField")),
              react.createElement("div", { className: "dspi-row-actions" },
                react.createElement("label", { className: "dspi-btn dspi-btn-ghost", htmlFor: "dspi-file-input" }, t("chooseFile")),
                file === null
                  ? react.createElement("span", { className: "dspi-file-name" }, t("noFile"))
                  : react.createElement("span", { className: "dspi-file-name" }, file.name + "（" + String(Math.round(file.content.length / 1024)) + " KB）"),
                file === null ? null : react.createElement("button", { type: "button", className: "dspi-btn dspi-btn-ghost", disabled: busy, onClick: () => { setFile(null); setFileStatus(null) } }, t("clear"))
              ),
              react.createElement("input", {
                id: "dspi-file-input",
                type: "file",
                accept: ".json,application/json",
                style: { display: "none" },
                onChange: (event) => {
                  const picked = event.target !== null && event.target !== undefined && event.target.files !== null && event.target.files !== undefined ? event.target.files[0] : undefined
                  if (picked === undefined) return
                  if (picked.size > 2 * 1024 * 1024) { setFileStatus({ kind: "err", text: t("fileTooBig") }); return }
                  picked.text().then((text) => { setFile({ name: picked.name, content: text }); setFileStatus(null) }, () => setFileStatus({ kind: "err", text: t("readFileFailed") }))
                }
              })
            ),
            react.createElement("details", { className: "dspi-details" },
              react.createElement("summary", null, t("formatHelp")),
              react.createElement("pre", { className: "dspi-code" }, MANIFEST_EXAMPLE),
              react.createElement("p", { className: "dspi-hint", style: { marginTop: 6 } }, t("formatNote"))
            )
          ),
          react.createElement("div", { className: "dspi-card-foot" },
            fileStatus === null ? null : react.createElement("p", { className: "dspi-foot-text dspi-foot-text-" + fileStatus.kind }, fileStatus.text),
            react.createElement("button", { type: "button", className: "dspi-btn", disabled: busy || sessionId === undefined, onClick: installFile }, fileBusy ? t("installing") : t("installBtn"))
          )
        ),

        react.createElement("section", { className: "dspi-card" },
          react.createElement("div", { className: "dspi-card-head" },
            react.createElement("h3", { className: "dspi-card-title" }, t("gitTitle")),
            react.createElement("p", { className: "dspi-card-desc" }, t("gitDesc"))
          ),
          react.createElement("div", { className: "dspi-card-body" },
            react.createElement("div", { className: "dspi-field" },
              react.createElement("label", { className: "dspi-label", htmlFor: "dspi-git-url" }, t("repoUrl")),
              react.createElement("input", { id: "dspi-git-url", className: "dspi-input", placeholder: "https://github.com/user/repo.git", value: gitUrl, onChange: (event) => setGitUrl(event.target.value) })
            ),
            react.createElement("div", { className: "dspi-field" },
              react.createElement("label", { className: "dspi-label", htmlFor: "dspi-git-ref" }, t("branchTag")),
              react.createElement("input", { id: "dspi-git-ref", className: "dspi-input", placeholder: t("branchPlaceholder"), value: gitRef, onChange: (event) => setGitRef(event.target.value) })
            ),
            react.createElement("div", { className: "dspi-field" },
              react.createElement("label", { className: "dspi-label", htmlFor: "dspi-git-manifest" }, t("manifestPathLabel")),
              react.createElement("input", { id: "dspi-git-manifest", className: "dspi-input", placeholder: t("manifestPathPlaceholder"), value: manifestPath, onChange: (event) => setManifestPath(event.target.value) })
            )
          ),
          react.createElement("div", { className: "dspi-card-foot" },
            gitStatus === null ? null : react.createElement("p", { className: "dspi-foot-text dspi-foot-text-" + gitStatus.kind }, gitStatus.text),
            react.createElement("button", { type: "button", className: "dspi-btn", disabled: busy || sessionId === undefined, onClick: installGit }, gitBusy ? t("installing") : t("installBtn"))
          )
        ),

        react.createElement("section", { className: "dspi-card" },
          react.createElement("div", { className: "dspi-card-head dspi-head-row" },
            react.createElement("div", { className: "dspi-head-main" },
              react.createElement("h3", { className: "dspi-card-title" }, t("installedTitle")),
              react.createElement("p", { className: "dspi-card-desc" }, t("installedDesc"))
            ),
            react.createElement("button", { type: "button", className: "dspi-btn dspi-btn-ghost", disabled: refreshing, onClick: refreshNow }, refreshing ? t("refreshing") : t("refresh"))
          ),
          react.createElement("div", { className: "dspi-card-body" },
            storeError !== "" ? react.createElement("p", { className: "dspi-hint-err" }, t("storeErrorPrefix") + storeError) : null,
            listError !== "" ? react.createElement("p", { className: "dspi-hint-err" }, listError) : null,
            listNotice !== "" ? react.createElement("p", { className: "dspi-hint-ok" }, listNotice) : null,
            installed === undefined
              ? react.createElement("p", { className: "dspi-empty" }, t("loading"))
              : installed.length === 0
                ? react.createElement("p", { className: "dspi-empty" }, t("emptyList"))
                : react.createElement("div", { className: "dspi-list" }, installed.map((row) => react.createElement("div", { className: "dspi-item", key: row.pluginId ?? row.key },
                    react.createElement("div", { className: "dspi-item-main" },
                      react.createElement("div", { className: "dspi-item-head" },
                        react.createElement("span", { className: "dspi-item-name" }, row.name),
                        row.pluginId === undefined ? null : react.createElement("span", { className: "dspi-item-id" }, row.pluginId)
                      ),
                      row.purpose === "" || row.purpose === undefined ? null : react.createElement("p", { className: "dspi-item-desc" }, row.purpose),
                      rowMeta(row),
                      row.error !== undefined && typeof row.error === "string" && row.error !== "" ? react.createElement("p", { className: "dspi-hint-err" }, row.error) : null,
                      row.restoreError !== undefined && typeof row.restoreError === "string" && row.restoreError !== "" ? react.createElement("p", { className: "dspi-hint-err" }, row.restoreError) : null
                    ),
                    row.persisted === true ? react.createElement("span", { className: "dspi-chip" }, t("chipPersisted")) : null,
                    statusChip(row),
                    loadedIds.has(row.pluginId) ? react.createElement("span", { className: "dspi-chip dspi-chip-muted" }, t("chipLoadedHere")) : null,
                    rowActions(row)
                  )))
          ),
          others.length === 0 ? null : react.createElement("div", { className: "dspi-card-body", style: { borderTop: "1px solid var(--dsw-alias-border-l2)" } },
            react.createElement("p", { className: "dspi-hint", style: { padding: "12px 0 2px" } }, t("othersTitle")),
            react.createElement("div", { className: "dspi-list" }, others.map((entry) => react.createElement("div", { className: "dspi-item", key: entry.sessionId + ":" + entry.key },
              react.createElement("div", { className: "dspi-item-main" },
                react.createElement("div", { className: "dspi-item-head" },
                  react.createElement("span", { className: "dspi-item-name" }, entry.name),
                  react.createElement("span", { className: "dspi-item-id" }, entry.sessionId)
                ),
                rowMeta(entry)
              ),
              react.createElement("button", { type: "button", className: "dspi-btn dspi-btn-ghost", disabled: busy || sessionId === undefined, onClick: () => copyRow(entry) }, t("copyBtn"))
            )))
          )
        )
      )
    }

    const inject = ["slots"]
    function apply(ctx) {
      const slots = ctx.slots
      const cr = ctx.get("dynamicCordisRunner")
      const locale = ctx.get("locale")
      let t = (key, arg) => {
        const template = ZH[key] ?? key
        return arg === undefined ? template : String(template).replace("{name}", String(arg)).replace("{id}", String(arg))
      }
      if (locale !== undefined) {
        try {
          ctx.effect(() => locale.register("plugin-installer", { zh: ZH, en: EN }), "plugin-installer: dictionaries")
          const translate = locale.bind("plugin-installer")
          t = (key, arg) => {
            const value = translate(key)
            const template = typeof value === "string" && value !== "" && value !== key ? value : (ZH[key] ?? key)
            return arg === undefined ? template : String(template).replace("{name}", String(arg)).replace("{id}", String(arg))
          }
        } catch (error) {
          // keep the zh fallback translator
        }
      }
      const ui = {
        cr,
        t,
        loadedStore: cr === undefined ? undefined : { getSnapshot: () => cr.getSnapshot(), subscribe: (fn) => cr.subscribe(fn) },
        activeRunsStore: cr === undefined ? undefined : cr.activeRuns,
        subscribeReset: (fn) => ctx.on("connection/reset", fn)
      }
      slots.inject("settings.plugins.tab", () => slots.register(
        { name: "settings.plugins.tab", id: "install", order: 5, label: () => t("tabLabel") },
        (props) => react.createElement(InstallTab, { useSessions: props.useSessions, ui })
      ))
    }

    exports.apply = apply
    exports.inject = inject
    return module.exports
  }
})
