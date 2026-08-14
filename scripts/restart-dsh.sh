#!/usr/bin/env bash
# restart-dsh.sh — 脱离当前进程树重启 dsh 服务（供 AI agent 在对话中执行）。
#
# 用法:
#   scripts/restart-dsh.sh <port> <dsh启动命令...>
#   例: scripts/restart-dsh.sh 3080 dsh web
#   例: scripts/restart-dsh.sh 3080 node /path/to/.bin/dsh web
#
# 原理: 旧服务被 SIGKILL 后本脚本被 launchd 收养继续执行（旧进程来不及清理
# 子进程），因此正在对话的 agent 进程即使随旧服务一起终止，新服务也能拉起。
# 警告: 执行后当前会话会短暂断线；agent 自己的回合会中断，需用户「继续」后
# 再验证。日志: ${TMPDIR:-/tmp}/dsh-restart.log
set -euo pipefail

PORT="${1:?用法: restart-dsh.sh <port> <dsh启动命令...>}"
shift
[ $# -ge 1 ] || { echo "缺少启动命令" >&2; exit 2; }

LOG="${TMPDIR:-/tmp}/dsh-restart.log"
echo "== restart helper started $(date '+%F %T') ==" >> "$LOG"

sleep 1
PID="$(lsof -iTCP:"$PORT" -sTCP:LISTEN -t 2>/dev/null | head -1 || true)"
if [ -n "$PID" ]; then
  CMDLINE="$(ps -o command= -p "$PID" 2>/dev/null || true)"
  case "$CMDLINE" in
    *dsh*)
      echo "killing old server pid $PID ($CMDLINE)" >> "$LOG"
      kill -9 "$PID" 2>/dev/null || true
      ;;
    *)
      echo "refusing to kill pid $PID on port $PORT: command line does not look like a dsh server: $CMDLINE" >> "$LOG"
      echo "请手动确认端口占用进程后再重启。" >> "$LOG"
      exit 1
      ;;
  esac
else
  echo "no listener on port $PORT; starting anyway" >> "$LOG"
fi

for _ in $(seq 1 30); do
  if ! lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then break; fi
  sleep 0.5
done

nohup "$@" >> "$LOG" 2>&1 &
echo "new server pid: $!" >> "$LOG"

sleep 7
echo "== verify ==" >> "$LOG"
curl -s -o /dev/null -w "root: %{http_code}\n" "http://127.0.0.1:$PORT/" >> "$LOG" 2>&1 || true
curl -s "http://127.0.0.1:$PORT/" | grep -c "@local/dsh-plugin-installer" >> "$LOG" 2>&1 || true
echo "== restart helper done $(date '+%F %T') ==" >> "$LOG"
