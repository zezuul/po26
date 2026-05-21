# Testy API pogody (PowerShell)
$base = if ($env:BASE_URL) { $env:BASE_URL } else { "http://localhost:8082" }

Write-Host "=== GET wiele miast ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$base/api/weather?cities=Warsaw,Krakow,Gdansk" | ConvertTo-Json -Depth 5

Write-Host "`n=== POST wiele miast ===" -ForegroundColor Cyan
$body = '{"cities":["Warsaw","Poznan"]}'
Invoke-RestMethod -Uri "$base/api/weather" -Method POST -ContentType "application/json" -Body $body | ConvertTo-Json -Depth 5
