@echo off
rem Uruchomienie JAR bez Gradle daemon — najmniejsze zużycie RAM
cd /d "%~dp0"

if not exist "build\libs\zadanie3-1.0.0.jar" (
  echo Budowanie JAR...
  gradle --no-daemon bootJar -q
  if errorlevel 1 exit /b 1
)

echo Uruchamianie na http://localhost:8081
if "%1"=="lazy" (
  java -Xms64m -Xmx256m -XX:+UseSerialGC -jar build\libs\zadanie3-1.0.0.jar --spring.profiles.active=lazy
) else (
  java -Xms64m -Xmx256m -XX:+UseSerialGC -jar build\libs\zadanie3-1.0.0.jar
)
