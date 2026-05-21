#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "=== Instalacja zależności Composer ==="
docker compose run --rm web composer install --no-interaction

echo "=== Tworzenie bazy SQLite ==="
mkdir -p var
docker compose run --rm web php bin/console doctrine:database:create --if-not-exists 2>/dev/null || true
docker compose run --rm web php bin/console doctrine:schema:update --force

echo "=== Uruchamianie serwera na http://localhost:8080 ==="
docker compose up -d
echo "Gotowe. API: http://localhost:8080/api/products | Admin: http://localhost:8080/admin"
