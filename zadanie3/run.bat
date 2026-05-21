@echo off
cd /d "%~dp0"
set GRADLE_OPTS=-Xms64m -Xmx384m -XX:+UseSerialGC

if "%1"=="lazy" (
  gradle --no-daemon bootRun --args="--spring.profiles.active=lazy"
) else (
  gradle --no-daemon bootRun %*
)
