#!/bin/bash
# Uruchamia wszystkie testy curl dla endpointów JSON
DIR="$(cd "$(dirname "$0")" && pwd)"

bash "$DIR/test_categories.sh"
echo ""
bash "$DIR/test_customers.sh"
echo ""
bash "$DIR/test_products.sh"
