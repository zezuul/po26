@echo off
cd /d "%~dp0"

set "DOCKER=%ProgramFiles%\Docker\Docker\resources\bin\docker.exe"
if not exist "%DOCKER%" set "DOCKER=%ProgramFiles%\Docker\Docker\resources\docker.exe"

if not exist "%DOCKER%" (
  echo [BLAD] Nie znaleziono docker.exe.
  echo Oczekiwana sciezka: %ProgramFiles%\Docker\Docker\resources\bin\docker.exe
  echo Zainstaluj Docker Desktop i uruchom go ponownie.
  pause
  exit /b 1
)

echo Czekam na Docker Desktop...
set /a tries=0
:wait_docker
"%DOCKER%" info >nul 2>&1
if not errorlevel 1 goto docker_ok
set /a tries+=1
if %tries% geq 30 (
  echo.
  echo [BLAD] Docker Desktop nie odpowiada po 60 sekundach.
  echo Otworz Docker Desktop, poczekaj na "Running", uruchom skrypt ponownie.
  pause
  exit /b 1
)
timeout /t 2 /nobreak >nul
goto wait_docker

:docker_ok
if not exist .env copy .env.example .env

echo Budowanie i uruchamianie kontenerow (pierwszy raz moze trwac kilka minut)...
"%DOCKER%" compose up --build -d
if errorlevel 1 (
  echo.
  echo [BLAD] Nie udalo sie uruchomic docker compose.
  pause
  exit /b 1
)

echo.
"%DOCKER%" compose ps
echo.
echo OK:
echo   Frontend: http://localhost:3010
echo   API:      http://localhost:3011/api/health
pause
