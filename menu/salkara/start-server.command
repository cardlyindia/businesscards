#!/bin/bash
# Double-click to preview the Salkara site on this Mac: http://localhost:8000
# Keep this window open while previewing; close it (or press Ctrl+C) to stop.
cd "$(dirname "$0")"
echo "Salkara preview running at http://localhost:8000  (close this window to stop)"
open "http://localhost:8000" 2>/dev/null &
python3 -m http.server 8000
