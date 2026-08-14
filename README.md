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
| 💾 **Persistent by default** | The installer mounts as a static plugin in the deployment composition (`cordis.patch.yml`) and loads on every boot; installed plugin manifests are written to `store.json` and restored automatically when their session reopens |
| ⚡ **Install = hot load** | Click **Install & hot load** and it is live immediately: the host half starts at once and the browser UI appears on the current page — no restart |
| 🔄 **Hot updates by reinstall** | Reinstalling a package with the same `name`/`id` switches to `update` mode and replaces the running version |
| 🗂️ **Two install sources** | A local `dsh-plugin.json` manifest file (≤2MB), or a Git repository (http(s)/ssh/git protocols, `git@` form, optional branch/tag) |
| 🎨 **Native design language** | The page is built to DSH's official settings design system (cards, fields, buttons, and badges match the "Configurable" tab), with light/dark theme support |
| 🔌 **Portable** | Idempotent install script that auto-detects the profile and `node_modules` location; works on any DSH with the dynamic-Cordis plugin stack, and degrades gracefully with a clear error elsewhere |
| 🧹 **One-click full removal** | The **Remove** button = stop the run + delete the persisted manifest + cancel persistence, so the plugin stays gone after restarts |

## 🚀 Quick start (conversational install, recommended)

1. Hand this directory (or an archive of it) to a DSH conversation and say:
   **"install this plugin"**;
2. The AI follows `AGENTS.md`: locates `DSH_HOME` and the profile → runs
   `install.sh` (idempotent, safe to re-run) → asks about restarting the
   service (and does it for you, with verification, once you agree);
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
temporary, writes nothing to disk).

## 📦 Package layout

```
dsh-plugin-installer-pkg/
├── AGENTS.md                     # Agent-facing install guide (the playbook for conversational installs)
├── README.md                     # English documentation (this page)
├── README.zh.md                  # Chinese documentation
├── install.sh                    # Persistent install script (idempotent)
├── scripts/restart-dsh.sh        # Detached restart helper (lets the agent restart the service for you)
├── dsh-plugin-installer.json     # Temporary-mode manifest (for cordis_define)
└── plugin/                       # Static plugin package @local/dsh-plugin-installer
    ├── package.json
    └── lib/
        ├── index.js              # Host half: install logic + persistence + session restore
        └── client.js             # Browser half: the Settings → Plugins install page UI
```

## 🛠️ Usage

### Installing plugins (two ways)

- **Upload a package file**: pick a `dsh-plugin.json` manifest file (≤2MB);
- **Git repository URL**: enter a repo URL (http(s)/ssh/git protocols and
  `git@` form, optional branch/tag); the repo root must contain
  `dsh-plugin.json`.

Manifest format:

```json
{
  "name": "My Plugin",
  "purpose": "One-line description",
  "idPrefix": "demo",
  "host": "return { apply(ctx) { ... } }",
  "client": "return { inject: ['slots'], apply(ctx) { ... } }"
}
```

- `name` / `purpose` are required; provide at least one of `host` / `client`
  (function-body source in the same format as `cordis_define`); `id`
  (optional) identifies updates and defaults to `name`; `idPrefix` (optional,
  3–6 lowercase letters).
- Reinstalling a package with the same `name`/`id` hot-updates it
  (`update` mode).
- Installed plugins hot-load immediately — no restart needed.

### Persistence semantics

- Every install writes its manifest to `$DSH_HOME/plugin-installer/store.json`;
- After a DSH restart, plugins are re-registered and run automatically when
  **their owning session is opened**:
  - host-only plugins start immediately;
  - plugins with a browser UI appear in the plugins panel and load once you
    confirm one authorization (DSH's security gate for browser code — it must
    be confirmed again after each restart);
- The installed list on the install page shows a **persisted** badge and a
  **Remove** button: removal = stop the run + delete the on-disk manifest +
  cancel persistence (the plugin stays gone after restarts).

## 🗑️ Uninstall

```bash
# 1. Delete the plugin-installer insert block from the profile's cordis.patch.yml
# 2. Remove the symlink
rm -f "$DSH_HOME/profiles/node_modules/@local/dsh-plugin-installer"
# 3. Remove the plugin package
rm -rf "$DSH_HOME/plugins/dsh-plugin-installer"
# 4. (Optional) Remove persisted manifests of installed plugins
rm -rf "$DSH_HOME/plugin-installer"
# 5. Restart the service
```

## ❓ FAQ

| Question | Answer |
| --- | --- |
| The page says "no dynamic plugin runner in this process" | This deployment has no dynamic-Cordis plugin stack; the installer cannot work there |
| `git clone` fails | Check that `git` exists on the machine, the repo URL is reachable, and the repo root has `dsh-plugin.json` |
| Installed plugins are missing after a restart | Restore only triggers when the **owning session** is opened; plugins with a browser UI need one confirmation in the plugins panel |
| A plugin removed from the "Configurable" tab comes back after restart | Panel removal does not cancel persistence; use the **Remove** button on this install page for permanent deletion |
| I edited the installer code and want it live | Edit `$DSH_HOME/plugins/dsh-plugin-installer/lib/*`, then restart the service |

## Requirements

- A DSH deployment with the dynamic-Cordis plugin tools (i.e. a
  `dynamicCordisRunner` service is present);
- `git` on the machine for Git-based installs;
- Write access to `$DSH_HOME` (default `~/.dsh`) for the install script.
