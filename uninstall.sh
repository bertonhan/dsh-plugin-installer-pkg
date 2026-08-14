#!/usr/bin/env bash
# uninstall.sh — 彻底卸载 @local/dsh-plugin-installer（幂等）。
#
# 用法:
#   ./uninstall.sh                          # 自动探测唯一 profile
#   ./uninstall.sh --profile web            # 指定 profile
#   ./uninstall.sh --dsh-home /path/.dsh    # 指定 DSH_HOME
#   ./uninstall.sh --keep-data              # 保留已安装插件的持久化数据
set -euo pipefail

DSH_HOME_DIR="${DSH_HOME:-$HOME/.dsh}"
PROFILE_ARG=""
KEEP_DATA=0

while [ $# -gt 0 ]; do
  case "$1" in
    --dsh-home) DSH_HOME_DIR="${2:?--dsh-home 需要参数}"; shift 2 ;;
    --profile) PROFILE_ARG="${2:?--profile 需要参数}"; shift 2 ;;
    --keep-data) KEEP_DATA=1; shift ;;
    *) echo "未知参数: $1" >&2; exit 2 ;;
  esac
done

PROFILES_DIR="$DSH_HOME_DIR/profiles"

if [ -n "$PROFILE_ARG" ]; then
  PROFILE_DIR="$PROFILES_DIR/$PROFILE_ARG"
  [ -f "$PROFILE_DIR/cordis.patch.yml" ] || { echo "错误: profile '$PROFILE_ARG' 不存在: $PROFILE_DIR" >&2; exit 1; }
else
  CANDIDATES=()
  for dir in "$PROFILES_DIR"/*/; do
    [ -f "$dir/cordis.patch.yml" ] && CANDIDATES+=("$(basename "$dir")")
  done
  if [ "${#CANDIDATES[@]}" -eq 0 ]; then echo "错误: 未找到任何 profile" >&2; exit 1; fi
  if [ "${#CANDIDATES[@]}" -gt 1 ]; then
    echo "发现多个 profile: ${CANDIDATES[*]}，请用 --profile 指定。" >&2
    exit 1
  fi
  PROFILE_DIR="$PROFILES_DIR/${CANDIDATES[0]}"
fi
echo "目标 profile: $PROFILE_DIR"

# 1. 从 cordis.patch.yml 删除 plugin-installer 的 insert 块
PATCH_FILE="$PROFILE_DIR/cordis.patch.yml"
node - "$PATCH_FILE" <<'NODE'
const fs = require("fs")
const file = process.argv[2]
let text = fs.readFileSync(file, "utf8")
if (!text.includes("plugin-installer")) {
  console.log("组合补丁中没有 plugin-installer，跳过:", file)
  process.exit(0)
}
const block = /(^|\n)[ \t]*- insert:\n(?:[ \t]*#.*\n)*[ \t]*- id: plugin-installer\n(?:[ \t]*#.*\n)*[ \t]*name: '@local\/dsh-plugin-installer'\n?/m
if (!block.test(text)) {
  console.log("警告: 找到 plugin-installer 字样但无法识别其 insert 块，请手动检查:", file)
  process.exit(0)
}
text = text.replace(block, "$1").replace(/\n{3,}/g, "\n\n")
fs.writeFileSync(file, text)
console.log("已从组合补丁移除 plugin-installer:", file)
NODE

# 2. 删除符号链接
for candidate in "$PROFILES_DIR/node_modules" "$PROFILE_DIR/node_modules"; do
  LINK="$candidate/@local/dsh-plugin-installer"
  if [ -L "$LINK" ]; then
    rm -f "$LINK"
    echo "已删除链接: $LINK"
  fi
done

# 3. 删除插件包
if [ -d "$DSH_HOME_DIR/plugins/dsh-plugin-installer" ]; then
  rm -rf "$DSH_HOME_DIR/plugins/dsh-plugin-installer"
  echo "已删除插件包: $DSH_HOME_DIR/plugins/dsh-plugin-installer"
fi

# 4. 持久化数据（默认删除）
if [ "$KEEP_DATA" -eq 0 ] && [ -d "$DSH_HOME_DIR/plugin-installer" ]; then
  rm -rf "$DSH_HOME_DIR/plugin-installer"
  echo "已删除持久化数据: $DSH_HOME_DIR/plugin-installer"
fi

echo ""
echo "卸载完成。重启 dsh 服务后生效。"
