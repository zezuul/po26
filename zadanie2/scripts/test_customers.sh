#!/bin/bash
set -e

BASE_URL="${BASE_URL:-http://localhost:8080}"
API="$BASE_URL/api/customers"

echo "=== GET lista klientów ==="
curl -s -X GET "$API" -H "Accept: application/json" | jq .

echo ""
echo "=== POST nowy klient ==="
RESP=$(curl -s -X POST "$API" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jan Kowalski","email":"jan@example.com","phone":"123456789","address":"ul. Testowa 1"}')
echo "$RESP" | jq .
ID=$(echo "$RESP" | jq -r '.id')

echo ""
echo "=== GET klient id=$ID ==="
curl -s -X GET "$API/$ID" | jq .

echo ""
echo "=== PUT aktualizacja ==="
curl -s -X PUT "$API/$ID" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jan Kowalski","email":"jan.kowalski@example.com","phone":"987654321"}' | jq .

echo ""
echo "=== DELETE klient ==="
curl -s -X DELETE "$API/$ID" | jq .

echo ""
echo "=== Test klientów zakończony ==="
