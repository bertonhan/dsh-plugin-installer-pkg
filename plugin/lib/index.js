/**
 * @local/dsh-plugin-installer — host half.
 *
 * Persistent installer for dynamic Cordis plugins:
 * - serves /plugin-installer/* JSON routes for the settings-page UI,
 * - installs dsh-plugin.json manifests (file upload or Git clone) through the
 *   root `dynamicCordisRunner` service with immediate hot load,
 * - persists installed manifests to ${DSH_HOME}/plugin-installer/store.json and
 *   restores them (define + run) when the owning session's agent is created
 *   after a restart.
 */
import { mkdir, readFile, rename, writeFile } from "node:fs/promises"
import { homedir } from "node:os"
import { join } from "node:path"

const STORE_DIR = join(process.env.DSH_HOME ?? join(homedir(), ".dsh"), "plugin-installer")
const STORE_FILE = join(STORE_DIR, "store.json")
const CSRF_HEADER = "x-dsh-plugin-installer"
const BODY_LIMIT = 3 * 1024 * 1024

const messageOf = (error) =>
  error !== null && typeof error === "object" && typeof error.message === "string"
    ? error.message
    : String(error)

const cleanRow = (obj) => {
  const out = {}
  for (const key of Object.keys(obj)) {
    const value = obj[key]
    if (value !== undefined) out[key] = value
  }
  return out
}

async function readStore() {
  try {
    const text = await readFile(STORE_FILE, "utf8")
    const parsed = JSON.parse(text)
    if (parsed !== null && typeof parsed === "object" && Array.isArray(parsed.plugins)) return parsed
    return { version: 1, plugins: [] }
  } catch (error) {
    if (error !== null && typeof error === "object" && error.code === "ENOENT") return { version: 1, plugins: [] }
    return { version: 1, plugins: [] }
  }
}

async function writeStore(store) {
  await mkdir(STORE_DIR, { recursive: true })
  const tmp = `${STORE_FILE}.tmp`
  await writeFile(tmp, JSON.stringify(store, null, 2), "utf8")
  await rename(tmp, STORE_FILE)
}

export const inject = ["webServer", "shell", "agents"]

export function apply(ctx) {
  // Optional on purpose: deployments without the dynamic-plugin runner keep the
  // settings page (with a clear error) instead of parking this plugin forever.
  const runner = ctx.get("dynamicCordisRunner")
  const tracked = new Map() // install key -> { pluginId, sessionId } (live registry)
  const rehydrated = new Set() // session ids already restored in this process
  const store = { version: 1, plugins: [] }
  let storeLoaded = false

  const fail = (message) => ({ ok: false, error: message })

  async function ensureStore() {
    if (!storeLoaded) {
      const data = await readStore()
      store.version = data.version ?? 1
      store.plugins = data.plugins
      storeLoaded = true
    }
    return store
  }

  async function persistEntry(entry) {
    const data = await ensureStore()
    const existing = data.plugins.find((candidate) => candidate.key === entry.key && candidate.sessionId === entry.sessionId)
    if (existing === undefined) data.plugins.push(entry)
    else Object.assign(existing, entry)
    await writeStore(data)
  }

  async function removePersisted(key, sessionId) {
    const data = await ensureStore()
    const index = data.plugins.findIndex((candidate) => candidate.key === key && candidate.sessionId === sessionId)
    if (index !== -1) data.plugins.splice(index, 1)
    await writeStore(data)
  }

  async function resolveAgent(sessionId) {
    const live = ctx.agents.get(sessionId)
    if (live !== undefined) return live
    const typert = ctx.get("typert")
    const lookups = typert !== undefined && typert !== null ? typert.lookups : undefined
    const provider = lookups !== undefined && typeof lookups.get === "function" ? lookups.get("agent") : undefined
    if (provider !== undefined && typeof provider.resolve === "function") return await provider.resolve(sessionId)
    throw new Error("没有找到会话对应的 Agent（" + sessionId + "）")
  }

  function validateManifest(raw) {
    if (raw === null || typeof raw !== "object" || Array.isArray(raw)) throw new Error("dsh-plugin.json 必须是 JSON 对象")
    if (typeof raw.name !== "string" || raw.name.trim() === "") throw new Error("dsh-plugin.json 缺少非空的 name 字段")
    if (typeof raw.purpose !== "string" || raw.purpose.trim() === "") throw new Error("dsh-plugin.json 缺少非空的 purpose 字段")
    const host = raw.host
    const client = raw.client
    if (host === undefined && client === undefined) throw new Error("dsh-plugin.json 需要至少一个 host 或 client 字段")
    if (host !== undefined && typeof host !== "string") throw new Error("host 字段必须是字符串（插件函数体源码）")
    if (client !== undefined && typeof client !== "string") throw new Error("client 字段必须是字符串（插件函数体源码）")
    if (host !== undefined && host.length > 512 * 1024) throw new Error("host 源码超过 512KB 限制")
    if (client !== undefined && client.length > 512 * 1024) throw new Error("client 源码超过 512KB 限制")
    let idPrefix = "plgn"
    if (raw.idPrefix !== undefined) {
      if (typeof raw.idPrefix !== "string" || !/^[a-z]{3,6}$/.test(raw.idPrefix)) throw new Error("idPrefix 必须是 3–6 个小写英文字母")
      idPrefix = raw.idPrefix
    } else {
      const derived = String(raw.name).toLowerCase().replace(/[^a-z]/g, "").slice(0, 6)
      if (/^[a-z]{3,6}$/.test(derived)) idPrefix = derived
    }
    if (raw.id !== undefined && (typeof raw.id !== "string" || raw.id.trim() === "")) throw new Error("id 字段必须是非空字符串")
    return {
      key: raw.id !== undefined ? raw.id.trim() : String(raw.name).trim(),
      name: String(raw.name).trim(),
      purpose: String(raw.purpose).trim(),
      idPrefix,
      code: { ...(host !== undefined ? { host } : {}), ...(client !== undefined ? { client } : {}) }
    }
  }

  function installManifest(manifest, sessionId) {
    if (runner === undefined) throw new Error("当前进程没有动态插件运行器（dynamicCordisRunner），无法安装")
    const prior = tracked.get(manifest.key)
    let plan = { kind: "new", pluginId: undefined, mode: "run" }
    if (prior !== undefined && prior.sessionId === sessionId) {
      let row
      try {
        row = runner.inventory().find((candidate) => candidate.pluginId === prior.pluginId && candidate.agentId === sessionId)
      } catch (error) {
        row = undefined
      }
      if (row !== undefined) plan = { kind: "existing", pluginId: prior.pluginId, mode: row.currentPackageId === undefined ? "run" : "update" }
    }
    let receipt
    try {
      receipt = runner.define({
        plugin: plan.kind === "new" ? { kind: "new", idPrefix: manifest.idPrefix } : { kind: "existing", pluginId: plan.pluginId },
        name: manifest.name,
        purpose: manifest.purpose,
        code: manifest.code,
        sessionId
      })
    } catch (error) {
      if (plan.kind === "new") throw error
      receipt = runner.define({
        plugin: { kind: "new", idPrefix: manifest.idPrefix },
        name: manifest.name,
        purpose: manifest.purpose,
        code: manifest.code,
        sessionId
      })
      plan = { kind: "new", pluginId: undefined, mode: "run" }
    }
    tracked.set(manifest.key, { pluginId: receipt.pluginId, sessionId })
    return {
      ok: true,
      updated: plan.mode === "update",
      mode: plan.mode,
      pluginId: receipt.pluginId,
      packageId: receipt.packageId,
      name: receipt.name,
      purpose: receipt.purpose,
      hasHostHalf: receipt.hasHostHalf,
      hasClientHalf: receipt.hasClientHalf
    }
  }

  async function manifestFromGit(args) {
    const url = args.url
    if (typeof url !== "string" || url.trim() === "") throw new Error("请输入 Git 仓库地址")
    const clean = url.trim()
    const remoteOk = /^(https?:\/\/|ssh:\/\/|git:\/\/|git@)/.test(clean)
    const localOk = /^\/[A-Za-z0-9._/+-]+$/.test(clean)
    if (!remoteOk && !localOk) throw new Error("Git 地址格式不支持：支持 http(s)/ssh/git 协议、git@ 形式或本地绝对路径")
    if (/[\s;&|`$<>'"]/.test(clean)) throw new Error("Git 地址包含非法字符")
    let ref = args.ref
    if (ref === undefined || ref === null) ref = ""
    if (typeof ref !== "string" || ref.length > 200) throw new Error("分支/标签名不合法")
    ref = ref.trim()
    if (ref !== "" && (!/^[A-Za-z0-9._/-]+$/.test(ref) || ref.startsWith("-") || ref.startsWith("/"))) throw new Error("分支/标签名包含非法字符")
    const dir = "/tmp/dsh-plugin-install-" + Date.now() + "-" + Math.floor(Math.random() * 1000000)
    const branchPart = ref === "" ? "" : " --branch " + ref
    try {
      const spec = ctx.shell.resolve({ command: 'mkdir -p "' + dir + '" && git clone --depth 1' + branchPart + " -- " + clean + ' "' + dir + '/repo"', timeoutMs: 180000, stdoutMaxBytes: 65536 })
      const result = await ctx.shell.run(spec)
      if (result.exitCode !== 0) {
        const detail = String(result.stderr !== undefined && result.stderr !== null && typeof result.stderr.text === "string" ? result.stderr.text : "").trim().slice(0, 800)
        throw new Error("git clone 失败（exit " + String(result.exitCode) + "）" + (detail === "" ? "" : "：" + detail))
      }
      const fs = ctx.get("fs")
      if (fs === undefined) throw new Error("缺少文件系统服务（fs），无法读取仓库清单")
      const target = await fs.resolve(dir + "/repo/dsh-plugin.json")
      let text
      try {
        text = await fs.readText(target)
      } catch (error) {
        throw new Error("仓库根目录没有 dsh-plugin.json 清单文件")
      }
      try {
        return JSON.parse(text)
      } catch (error) {
        throw new Error("dsh-plugin.json 不是合法 JSON：" + messageOf(error))
      }
    } finally {
      try {
        const cleanup = ctx.shell.resolve({ command: 'rm -rf "' + dir + '"', timeoutMs: 15000 })
        await ctx.shell.run(cleanup)
      } catch (error) {
        // best-effort cleanup
      }
    }
  }

  async function installedRows(sessionId) {
    if (runner === undefined) return []
    const agent = await resolveAgent(sessionId)
    const rows = runner.snapshot(agent)
    const pluginIdToKey = new Map()
    for (const [key, value] of tracked) pluginIdToKey.set(value.pluginId, key)
    return rows.map((row) => {
      const current = row.currentPackageId
      const found = current !== undefined ? row.packages.find((p) => p.packageId === current) : undefined
      const picked = found !== undefined ? found : row.packages[0]
      const latest = row.latestRun
      const key = pluginIdToKey.get(row.pluginId)
      return cleanRow({
        pluginId: row.pluginId,
        key,
        persisted: key !== undefined,
        name: picked === undefined ? row.pluginId : picked.name,
        purpose: picked === undefined ? "" : picked.purpose,
        packageId: picked === undefined ? undefined : picked.packageId,
        packageCount: row.packages.length,
        hasHostHalf: picked === undefined ? false : picked.hasHostHalf === true,
        hasClientHalf: picked === undefined ? false : picked.hasClientHalf === true,
        currentPackageId: row.currentPackageId,
        active: row.activeRun !== undefined,
        status: latest === undefined ? "none" : latest.status,
        mode: latest === undefined ? undefined : latest.mode,
        hostStatus: latest === undefined || latest.host === undefined ? undefined : latest.host.status,
        clientStatus: latest === undefined || latest.client === undefined ? undefined : latest.client.status,
        error: latest === undefined || latest.error === undefined ? undefined : latest.error.message
      })
    })
  }

  // Restore persisted plugins for a session when its agent comes back to life.
  ctx.on("agent/created", ({ agent }) => {
    if (runner === undefined) return
    if (agent === undefined || typeof agent.id !== "string") return
    if (rehydrated.has(agent.id)) return
    rehydrated.add(agent.id)
    void (async () => {
      try {
        const data = await ensureStore()
        const entries = data.plugins.filter((entry) => entry.sessionId === agent.id)
        for (const entry of entries) {
          try {
            const manifest = validateManifest(entry)
            const receipt = runner.define({
              plugin: { kind: "new", idPrefix: manifest.idPrefix },
              name: manifest.name,
              purpose: manifest.purpose,
              code: manifest.code,
              sessionId: agent.id
            })
            tracked.set(manifest.key, { pluginId: receipt.pluginId, sessionId: agent.id })
            const ran = await runner.run(agent, receipt.pluginId, receipt.packageId, "run", undefined)
            if (!ran.ok) ctx.logger.warn(`plugin-installer: restore run of ${receipt.pluginId} not started: ${ran.message ?? ""}`)
          } catch (error) {
            ctx.logger.warn(`plugin-installer: restore failed for ${entry.key ?? "?"}: ${messageOf(error)}`)
          }
        }
      } catch (error) {
        ctx.logger.warn("plugin-installer: restore pass failed: " + messageOf(error))
      }
    })().catch((error) => ctx.logger.warn("plugin-installer: restore error: " + messageOf(error)))
  })

  function readBody(req, limit) {
    return new Promise((resolve, reject) => {
      let size = 0
      const chunks = []
      req.on("data", (chunk) => {
        size += chunk.length
        if (size > limit) {
          reject(new Error("请求体过大"))
          req.destroy()
          return
        }
        chunks.push(chunk)
      })
      req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
      req.on("error", reject)
    })
  }

  function sendJson(res, status, data) {
    const body = JSON.stringify(data === undefined ? null : data)
    res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" })
    res.end(body)
  }

  async function handleRequest(req, res) {
    if (req.method === "OPTIONS") {
      res.writeHead(204)
      res.end()
      return
    }
    if (req.method !== "POST") {
      res.writeHead(405)
      res.end()
      return
    }
    if (req.headers[CSRF_HEADER] !== "1") {
      sendJson(res, 403, { error: "缺少请求头 " + CSRF_HEADER + ": 1" })
      return
    }
    const pathname = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname)
    let args
    try {
      const text = await readBody(req, BODY_LIMIT)
      args = JSON.parse(text)
    } catch (error) {
      sendJson(res, 400, { error: "请求体不是合法 JSON（或超过 3MB）：" + messageOf(error) })
      return
    }
    if (args === null || typeof args !== "object") {
      sendJson(res, 400, { error: "请求参数必须是 JSON 对象" })
      return
    }
    try {
      let result
      if (pathname.endsWith("/install")) {
        const sessionId = args.sessionId
        if (typeof sessionId !== "string" || sessionId === "") throw new Error("缺少会话 id（sessionId）")
        let raw
        if (args.source === "file") {
          const content = args.content
          if (typeof content !== "string" || content.trim() === "") throw new Error("插件包内容为空")
          if (content.length > 2 * 1024 * 1024) throw new Error("插件包超过 2MB 限制")
          raw = JSON.parse(content)
        } else if (args.source === "git") {
          raw = await manifestFromGit(args)
        } else {
          throw new Error("未知安装来源：" + String(args.source))
        }
        const manifest = validateManifest(raw)
        const receipt = installManifest(manifest, sessionId)
        await persistEntry({
          key: manifest.key,
          sessionId,
          name: manifest.name,
          purpose: manifest.purpose,
          idPrefix: manifest.idPrefix,
          ...(manifest.code.host !== undefined ? { host: manifest.code.host } : {}),
          ...(manifest.code.client !== undefined ? { client: manifest.code.client } : {})
        })
        result = receipt
      } else if (pathname.endsWith("/installed-list")) {
        const sessionId = args.sessionId
        if (typeof sessionId !== "string" || sessionId === "") throw new Error("缺少会话 id（sessionId）")
        result = { ok: true, rows: await installedRows(sessionId) }
      } else if (pathname.endsWith("/remove")) {
        const sessionId = args.sessionId
        const key = args.key
        if (typeof sessionId !== "string" || sessionId === "") throw new Error("缺少会话 id（sessionId）")
        if (typeof key !== "string" || key === "") throw new Error("缺少插件标识（key）")
        const agent = await resolveAgent(sessionId)
        const prior = tracked.get(key)
        let removed = false
        if (runner !== undefined && prior !== undefined && prior.sessionId === sessionId) {
          const outcome = await runner.undefine(agent, prior.pluginId)
          if (outcome.ok) {
            tracked.delete(key)
            removed = true
          }
        }
        await removePersisted(key, sessionId)
        result = { ok: true, removed }
      } else {
        sendJson(res, 404, { error: "未知路径 " + pathname })
        return
      }
      sendJson(res, 200, result)
    } catch (error) {
      sendJson(res, 500, { error: messageOf(error) })
    }
  }

  ctx.effect(() => ctx.webServer.register({ kind: "prefix", path: "/plugin-installer", handler: handleRequest }), "plugin-installer: api route")
}
