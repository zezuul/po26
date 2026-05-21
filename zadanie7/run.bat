@echo off
cd /d "%~dp0"
echo Uruchamianie Vapor Shop (Docker) — pierwszy build moze trwac 15-25 min
echo Po starcie: http://localhost:8080
docker compose up --build
