#!/bin/bash
# Testy CRUD API produktów (JSON) — wymaga działającej aplikacji
set -e

BASE_URL="${BASE_URL:-http://localhost:8080}"
API="$BASE_URL/api/products"

echo "=== GET lista produktów ==="
curl -s -X GET "$API" -H "Accept: application/json" | jq .

echo ""
echo "=== POST nowy produkt ==="
RESP=$(curl -s -X POST "$API" \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop test","description":"Opis testowy","price":3499.99,"stock":5,"category_id":null}')
echo "$RESP" | jq .
ID=$(echo "$RESP" | jq -r '.id')

echo ""
echo "=== GET produkt id=$ID ==="
curl -s -X GET "$API/$ID" -H "Accept: application/json" | jq .

echo ""
echo "=== PUT aktualizacja produktu ==="
curl -s -X PUT "$API/$ID" \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop test (edycja)","price":3299.00,"stock":3}' | jq .

echo ""
echo "=== DELETE produkt ==="
curl -s -X DELETE "$API/$ID" -H "Accept: application/json" | jq .

echo ""
echo "=== Test produktów zakończony ==="
