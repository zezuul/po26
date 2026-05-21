@echo off
cd /d "%~dp0playwright"
call npm install
call npx playwright install chromium
call npm test
