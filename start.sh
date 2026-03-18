#!/usr/bin/env bash
# ── Kinara local dev server ───────────────────────────────────────────────
# Usage: bash start.sh [port]   (default port: 8080)
PORT=${1:-8080}

# Kill any previous instance on the same port
fuser -k "${PORT}/tcp" 2>/dev/null || true

echo ""
echo "  KINARA — local server"
echo "  → http://localhost:${PORT}"
echo "  Press Ctrl+C to stop."
echo ""

python3 -m http.server "$PORT"
