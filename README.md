> 🌐 Language / 语言：English（this page）· [中文](README.zh.md)

# DSH Plugin Installer (`dsh-plugin-installer`)

Add a plugin-install capability to any DSH (DeepSeek Harness) deployment: a new
**Install Plugin** page under **Settings → Plugins** that installs dynamic
Cordis plugins from an uploaded package file or a Git repository URL —
**installed and hot-loaded instantly**. Both the installer itself and the
plugins it installs **persist across restarts**. Best of all, **you never touch
a CLI**: hand this package to a DSH conversation and say *"install this
plugin"* — the AI follows `AGENTS.md` to patch the deployment, restart, and
verify everything for you.

---

## ✨ Highlights

| Highlight | What it means |
| --- | --- |
| 🗣️ **Conversational install, zero CLI** | No terminal needed: the AI locates the profile, patches the composition, links the package, and restarts the service (with your consent) — you type no commands at all |
| 💾 **Persistent by default, restore is visible** | The installer mounts as a static plugin in the deployment composition (`cordis.patch.yml`) and loads on every boot; installed manifests are written to `store.json` and restored when their session reopens. Restore failures show up on the page as "restore failed" with the reason — nothing vanishes silently |
| ⚡ **Install = hot load** | Click **Install & hot load** and it is live immediately: the host half starts at once and the browser UI appears on the current page — no restart |
| 🔄 **Versioned hot updates** | Manifests support a `version` field; reinstalling the same `name`/`id` switches to `update` mode and replaces the running version. The list shows version, install time, and source |
| 🗂️ **Two install sources, monorepo-friendly** | A local `dsh-plugin.json` manifest (≤2MB), or a Git repository (http(s)/ssh/git protocols, `git@` form, optional branch/tag, and a `manifestPath` for manifests in subdirectories) |
| 🧩 **In-page approval + cross-session reuse** | After a restart, browser-UI plugins get an **Approve & load** button right in the install page — no hunting through other panels. Plugins installed in other sessions can be copied into the current session with one click |
| 🎨 **Native design language, bilingual UI** | The page follows DSH's official settings design system (cards, fields, buttons, and badges match the "Configurable" tab), supports light/dark themes, and ships zh/en translations that follow the system language |
| 🔌 **Portable** | Idempotent install script that auto-detects the profile and `node_modules` location; works on any DSH with the dynamic-Cordis plugin stack, and degrades gracefully with a clear error elsewhere |
| 🧹 **Full removal, complete kit** | **Stop/Remove** buttons on every row (remove = stop + delete the persisted manifest + cancel persistence), plus an `uninstall.sh` for the installer itself, an example plugin package, and an MIT license |

## 🚀 Quick start (conversational install, recommended)

1. Hand this directory (or an archive of it) to a DSH conversation and say:
   **"install this plugin"**;
2. The AI follows `AGENTS.md`: locates `DSH_HOME` and the profile → runs
   `install.sh` (idempotent, safe to re-run) → asks about restarting the
   service (and does it for you, with verification, once you agree; the
   automatic restart force-stops the current process, so the page briefly
   disconnects and then reconnects on its own);
3. After the restart, open **Settings → Plugins** — the **Install Plugin** tab
   is there, and the installer now loads on every boot.

Equivalent manual commands (optional — same effect as step 2):

```bash
bash install.sh                    # auto-detect the only profile
bash install.sh --profile web      # pick a profile explicitly
bash install.sh --dsh-home /path   # point at a specific DSH_HOME
```

The script copies the plugin package → creates the
`@local/dsh-plugin-installer` symlink → appends the composition row (skipped
when already present) → verifies Node resolution (plus a `--dump-config` check
when the `dsh` command is available). Verify after restarting:

```bash
curl -s http://127.0.0.1:3080/ | grep -c "@local/dsh-plugin-installer"   # expect 1
curl -s -o /dev/null -w "%{http_code}" \
  "http://127.0.0.1:3080/plugins/@local/dsh-plugin-installer/client.js"   # expect 200
```

**Just want a restart-free trial?** Hand `dsh-plugin-installer.json` to the DSH
agent and install it with `cordis_define` + `cordis_run` (session-scoped,
temporary, writes nothing to disk; no persistence, in-page approval, or other
static-version features).

## 📦 Package layout

```
dsh-plugin-installer-pkg/
├── AGENTS.md                     # Agent-facing install guide (the playbook for conversational installs)
├── README.md                     # English documentation (this page)
├── README.zh.md                  # Chinese documentation
├── LICENSE                       # MIT license
├── install.sh                    # Persistent install script (idempotent)
├── uninstall.sh                  # One-shot uninstall script (idempotent)
├── scripts/restart-dsh.sh        # Detached restart helper (lets the agent restart the service for you)
├── dsh-plugin-installer.json     # Temporary-mode manifest (for cordis_define)
├── examples/demo-plugin.json     # Example plugin package (upload to try it out)
└── plugin/                       # Static plugin package @local/dsh-plugin-installer
    ├── package.json
    └── lib/
        ├── index.js              # Host half: install logic + persistence + session restore
        └── client.js             # Browser half: the Settings → Plugins install page UI (zh/en)
```

## 🛠️ Usage

### Installing plugins (two ways)

- **Upload a package file**: pick a `dsh-plugin.json` manifest file (≤2MB);
- **Git repository URL**: enter a repo URL (http(s)/ssh/git protocols and
  `git@` form, optional branch/tag). The default manifest location is
  `dsh-plugin.json` at the repo root; for monorepos, put a subdirectory-relative
  path in **Manifest path** (e.g. `plugins/demo/dsh-plugin.json`).

Manifest format:

```json
{
  "name": "My Plugin",
  "purpose": "One-line description",
  "version": "1.0.0",
  "idPrefix": "demo",
  "host": "return { apply(ctx) { ... } }",
  "client": "return { inject: ['slots'], apply(ctx) { ... } }"
}
```

- `name` / `purpose` are required; provide at least one of `host` / `client`
  (function-body source in the same format as `cordis_define`); `id`
  (optional) identifies updates and defaults to `name`; `version` (optional,
  ≤64 chars) is shown in the list; `idPrefix` (optional, 3–6 lowercase letters).
- Reinstalling a package with the same `name`/`id` hot-updates it
  (`update` mode).
- Installed plugins hot-load immediately — no restart needed.

### Managing installed plugins

The installed list on the install page covers the full lifecycle:

- **Approve & load**: after a restart restore, browser-UI plugins show this
  button — one click grants authorization and loads them (no other panel
  needed);
- **Stop**: stops the run but keeps persistence (it restores again after the
  next restart);
- **Remove**: stops the run + deletes the on-disk manifest + cancels
  persistence, so the plugin stays gone after restarts;
- **Version / time / source**: every row shows its version, update time, and
  source (file / Git URL);
- **Failure visibility**: run failures show their error message; restore
  failures show as "restore failed" with the reason;
- **Cross-session reuse**: plugins installed in other sessions are listed at
  the bottom with a one-click **Install into this session** action.

### Persistence semantics

- Every install writes its manifest to `$DSH_HOME/plugin-installer/store.json`
  (atomic, safe under concurrent multi-session writes);
- After a DSH restart, plugins are re-registered and run automatically when
  **their owning session is opened**:
  - host-only plugins start immediately;
  - plugins with a browser UI show **Approve & load** on the install page —
    one confirmation loads them (DSH's security gate for browser code, which
    must be confirmed again after each restart);
- A corrupted store file is reported clearly on the page (the original file is
  kept — nothing is silently reset).

## 🗑️ Uninstall

```bash
bash uninstall.sh                    # auto-detect the only profile
bash uninstall.sh --profile web      # pick a profile explicitly
bash uninstall.sh --keep-data        # keep persisted manifests of installed plugins
```

The script removes the composition patch block, the `node_modules/@local`
symlink, the plugin package directory, and (by default) the
`$DSH_HOME/plugin-installer` data directory; restart the service afterwards.

## ❓ FAQ

| Question | Answer |
| --- | --- |
| The page says "no dynamic plugin runner in this process" | This deployment has no dynamic-Cordis plugin stack; the installer cannot work there |
| `git clone` fails | Check that `git` exists, the repo URL is reachable, and the manifest path is correct (use **Manifest path** for monorepos) |
| Installed plugins are missing after a restart | Restore only triggers when the **owning session** is opened; browser-UI plugins need one click on **Approve & load** in the install page |
| A plugin shows "restore failed" | Fix the reason shown on the row (usually an invalid manifest), then simply reinstall to overwrite it |
| A plugin removed from the "Configurable" tab comes back after restart | Panel removal does not cancel persistence; use the **Remove** button on this install page for permanent deletion |
| I edited the installer code and want it live | Edit `$DSH_HOME/plugins/dsh-plugin-installer/lib/*`; host changes need a service restart, client changes take effect on page refresh |
| The automatic restart interrupted my conversation | That is expected when the agent restarts for you: the page reconnects on its own — reply "continue" afterwards. Prefer a manual restart if that bothers you |

## Requirements

- A DSH deployment with the dynamic-Cordis plugin tools (i.e. a
  `dynamicCordisRunner` service is present);
- `git` on the machine for Git-based installs;
- Write access to `$DSH_HOME` (default `~/.dsh`) for the install script.
