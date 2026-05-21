#!/bin/bash
set -e

BASE_URL="${BASE_URL:-http://localhost:8081}"

echo "=== GET /api/items (JSON) ==="
curl -s "$BASE_URL/api/items" | jq .

echo ""
echo "=== POST /api/auth — poprawne dane (eager) ==="
curl -s -X POST "$BASE_URL/api/auth" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq .

echo ""
echo "=== POST /api/auth — błędne hasło ==="
curl -s -X POST "$BASE_URL/api/auth" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrong"}' | jq .

echo ""
echo "=== Test zakończony ==="
