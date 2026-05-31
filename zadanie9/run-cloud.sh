#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

DOCKER="/c/Program Files/Docker/Docker/resources/bin/docker.exe"
if [ ! -f "$DOCKER" ]; then
  DOCKER="/c/Program Files/Docker/Docker/resources/docker.exe"
fi
if [ ! -f "$DOCKER" ]; then
  echo "[BLAD] Nie znaleziono docker.exe. Uruchom Docker Desktop."
  exit 1
fi

echo "Czekam na Docker Desktop..."
for i in $(seq 1 30); do
  if "$DOCKER" info >/dev/null 2>&1; then
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "[BLAD] Docker nie odpowiada. Otworz Docker Desktop i sprobuj ponownie."
    exit 1
  fi
  sleep 2
done

[ -f .env ] || cp .env.example .env

echo "Budowanie i uruchamianie kontenerow..."
"$DOCKER" compose up --build -d
"$DOCKER" compose ps

echo ""
echo "OK:"
echo "  Frontend: http://localhost:3010"
echo "  API:      http://localhost:3011/api/health"
