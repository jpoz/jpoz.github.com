#!/usr/bin/env bash
# Render one still frame of a homepage figure to a PNG with headless Chrome.
# Requires the dev server (npm run dev) on $PORT (default 4321).
#
#   scripts/render-frame.sh <fig> <t> <e> <out.png> [width] [height] [extra query]
#
#   fig    figure index (0-based, see src/scripts/figures.ts)
#   t      figure time in seconds (drives animation + camera orbit)
#   e      event / explode phase 0..1
#   extra  extra query string, e.g. "raw" (no halftone) or "clean&raw"; default "clean"
set -euo pipefail
FIG=$1 T=$2 E=$3 OUT=$4 W=${5:-1456} H=${6:-816} EXTRA=${7:-clean}
PORT=${PORT:-4321}
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PROFILE=$(mktemp -d)
trap 'rm -rf "$PROFILE"' EXIT
"$CHROME" --headless=new --no-first-run --no-default-browser-check \
  --user-data-dir="$PROFILE" --hide-scrollbars --force-device-scale-factor=1 \
  --use-angle=swiftshader --enable-unsafe-swiftshader \
  --window-size="$W,$H" --virtual-time-budget=6000 \
  --screenshot="$OUT" \
  "http://localhost:$PORT/?fig=$FIG&t=$T&e=$E&$EXTRA" >/dev/null 2>&1
echo "$OUT"
