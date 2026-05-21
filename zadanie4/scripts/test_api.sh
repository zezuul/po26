#!/bin/bash
set -e
BASE="${BASE_URL:-http://localhost:8082}"

echo "=== GET wiele miast ==="
curl -s "$BASE/api/weather?cities=Warsaw,Krakow,Gdansk" | jq .

echo ""
echo "=== POST wiele miast ==="
curl -s -X POST "$BASE/api/weather" \
  -H "Content-Type: application/json" \
  -d '{"cities":["Warsaw","Poznan"]}' | jq .
