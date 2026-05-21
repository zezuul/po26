#!/bin/bash
set -e

BASE_URL="${BASE_URL:-http://localhost:8080}"
API="$BASE_URL/api/categories"

echo "=== GET lista kategorii ==="
curl -s -X GET "$API" -H "Accept: application/json" | jq .

echo ""
echo "=== POST nowa kategoria ==="
RESP=$(curl -s -X POST "$API" \
  -H "Content-Type: application/json" \
  -d '{"name":"Elektronika","description":"Urządzenia elektroniczne"}')
echo "$RESP" | jq .
ID=$(echo "$RESP" | jq -r '.id')

echo ""
echo "=== GET kategoria id=$ID ==="
curl -s -X GET "$API/$ID" | jq .

echo ""
echo "=== PUT aktualizacja ==="
curl -s -X PUT "$API/$ID" \
  -H "Content-Type: application/json" \
  -d '{"name":"Elektronika i AGD","description":"Zaktualizowany opis"}' | jq .

echo ""
echo "=== DELETE kategoria ==="
curl -s -X DELETE "$API/$ID" | jq .

echo ""
echo "=== Test kategorii zakończony ==="
