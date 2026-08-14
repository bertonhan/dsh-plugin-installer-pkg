#!/usr/bin/env bash
# install.sh — 将 @local/dsh-plugin-installer 持久化安装到当前 DSH 部署。
#
# 用法:
#   ./install.sh                          # 自动探测唯一 profile
#   ./install.sh --profile web            # 指定 profile
#   ./install.sh --dsh-home /path/.dsh    # 指定 DSH_HOME（默认 $DSH_HOME 或 ~/.dsh）
#
# 做了什么（全部幂等，可重复执行）:
#   1. 把插件包复制到 $DSH_HOME/plugins/dsh-plugin-installer
#   2. 在 profile 的 node_modules 里建 @local/dsh-plugin-installer 符号链接
#   3. 向 profile 的 cordis.patch.yml 追加挂载行（已存在则跳过）
#   4. 校验 node 解析与（可选）dsh --dump-config
# 注意: 组合变更需要重启 dsh 服务后生效（见 README）。
set -euo pipefail

DSH_HOME_DIR="${DSH_HOME:-$HOME/.dsh}"
PROFILE_ARG=""

while [ $# -gt 0 ]; do
  case "$1" in
    --dsh-home) DSH_HOME_DIR="${2:?--dsh-home 需要参数}"; shift 2 ;;
    --profile) PROFILE_ARG="${2:?--profile 需要参数}"; shift 2 ;;
    *) echo "未知参数: $1" >&2; exit 2 ;;
  esac
done

PACKAGE_NAME="@local/dsh-plugin-installer"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE_DIR="$SCRIPT_DIR/plugin"
PROFILES_DIR="$DSH_HOME_DIR/profiles"

if [ ! -d "$DSH_HOME_DIR" ]; then
  echo "错误: DSH_HOME 不存在: $DSH_HOME_DIR（用 --dsh-home 指定）" >&2
  exit 1
fi
if [ ! -d "$PROFILES_DIR" ]; then
  echo "错误: 未找到 profiles 目录: $PROFILES_DIR（这不是一个 dsh 部署？）" >&2
  exit 1
fi
if [ ! -f "$SOURCE_DIR/package.json" ]; then
  echo "错误: 插件包缺失: $SOURCE_DIR（请在本包根目录运行）" >&2
  exit 1
fi

# ---- 1. 选定 profile -------------------------------------------------------
if [ -n "$PROFILE_ARG" ]; then
  PROFILE_DIR="$PROFILES_DIR/$PROFILE_ARG"
  if [ ! -f "$PROFILE_DIR/cordis.patch.yml" ]; then
    echo "错误: profile '$PROFILE_ARG' 不存在或没有 cordis.patch.yml: $PROFILE_DIR" >&2
    exit 1
  fi
else
  CANDIDATES=()
  for dir in "$PROFILES_DIR"/*/; do
    [ -f "$dir/cordis.patch.yml" ] && CANDIDATES+=("$(basename "$dir")")
  done
  if [ "${#CANDIDATES[@]}" -eq 0 ]; then
    echo "错误: $PROFILES_DIR 下没有任何含 cordis.patch.yml 的 profile" >&2
    exit 1
  fi
  if [ "${#CANDIDATES[@]}" -gt 1 ]; then
    echo "发现多个 profile: ${CANDIDATES[*]}" >&2
    echo "请用 --profile <name> 指定一个（当前运行中的服务对应哪个，就选哪个）。" >&2
    exit 1
  fi
  PROFILE_DIR="$PROFILES_DIR/${CANDIDATES[0]}"
fi
echo "目标 profile: $PROFILE_DIR"

# ---- 2. 复制插件包 ----------------------------------------------------------
DEST_DIR="$DSH_HOME_DIR/plugins/dsh-plugin-installer"
mkdir -p "$(dirname "$DEST_DIR")"
rm -rf "$DEST_DIR"
cp -R "$SOURCE_DIR" "$DEST_DIR"
echo "插件包已复制到: $DEST_DIR"

# ---- 3. 符号链接到 node_modules ---------------------------------------------
LINK_DIR=""
for candidate in "$PROFILES_DIR/node_modules" "$PROFILE_DIR/node_modules"; do
  if [ -d "$candidate" ]; then LINK_DIR="$candidate"; break; fi
done
if [ -z "$LINK_DIR" ]; then
  echo "错误: 找不到 node_modules（尝试了 profiles/node_modules 与 profile/node_modules）" >&2
  echo "请先确保该 profile 已初始化（能正常启动 dsh）。" >&2
  exit 1
fi
mkdir -p "$LINK_DIR/@local"
LINK_PATH="$LINK_DIR/@local/dsh-plugin-installer"
ln -sfn "$DEST_DIR" "$LINK_PATH"
echo "已链接: $LINK_PATH -> $DEST_DIR"

# ---- 4. 补丁 cordis.patch.yml -----------------------------------------------
PATCH_FILE="$PROFILE_DIR/cordis.patch.yml"
node - "$PATCH_FILE" <<'NODE'
const fs = require("fs")
const file = process.argv[2]
let text = fs.readFileSync(file, "utf8")
if (text.includes("plugin-installer")) {
  console.log("补丁已存在，跳过:", file)
  process.exit(0)
}
const entry = "- insert:\n    - id: plugin-installer\n      name: '@local/dsh-plugin-installer'\n"
if (/^\[\]\s*$/m.test(text)) {
  text = text.replace(/^\[\]\s*$/m, entry.replace(/\n$/, ""))
} else {
  text = text.replace(/\s*$/, "\n" + entry)
}
fs.writeFileSync(file, text)
console.log("已写入补丁:", file)
NODE

# ---- 5. 校验 -----------------------------------------------------------------
echo "== 校验 =="
node -e "
const { createRequire } = require('module')
const path = require('path')
const profile = process.argv[1]
const req = createRequire(path.join(profile, 'package.json'))
const pkg = req.resolve('@local/dsh-plugin-installer/package.json')
console.log('解析 OK:', pkg)
" "$PROFILE_DIR"

DSH_BIN="$(command -v dsh 2>/dev/null || true)"
if [ -n "$DSH_BIN" ]; then
  if DSH_HOME="$DSH_HOME_DIR" "$DSH_BIN" --profile "$(basename "$PROFILE_DIR")" --dump-config 2>/dev/null | grep -q "plugin-installer"; then
    echo "组合校验 OK（--dump-config 已包含 plugin-installer 行）"
  else
    echo "提示: --dump-config 未确认新行；重启后请用同样的命令复核。"
  fi
else
  echo "提示: 未找到 dsh 命令，跳过 dump-config 校验；重启后请在「设置 → 插件」确认出现「安装插件」标签页。"
fi

echo ""
echo "安装完成。重启 dsh 服务后生效:"
echo "  重启方法见 README.md 的「重启与验证」一节（或使用 scripts/restart-dsh.sh）。"
