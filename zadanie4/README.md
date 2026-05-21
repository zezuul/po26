# Zadanie 4 — Wzorce strukturalne (Echo + Go)

Aplikacja **Echo** z kontrolerem pogody, modelem **GORM**, wzorcem **Proxy** (Open-Meteo API) i zapisem do SQLite.

## Wymagania

| Punkty | Opis | Implementacja |
|--------|------|---------------|
| 3.0 | Echo + kontroler pogody | `WeatherHandler`, `GET/POST /api/weather` |
| 3.5 | Model GORM + dane przy starcie | `model.Weather`, `database.SeedLocations` |
| 4.0 | Proxy do zewnętrznego API | `proxy.WeatherProxy` → Open-Meteo |
| 4.5 | Zapis pobranych danych do bazy | `db.Save` po fetch |
| 5.0 | Wiele lokalizacji, JSON | `?cities=Warszawa,Kraków` lub POST body |

## Uruchomienie

```bash
cd zadanie4
go mod tidy
go run .
```

Windows: `run.bat`  
Serwer: http://localhost:8082

## Endpointy

| Metoda | URL | Przykład |
|--------|-----|----------|
| GET | `/api/weather?cities=Warsaw,Krakow,Gdansk` | Wiele miast w query |
| POST | `/api/weather` | `{"cities":["Warsaw","Krakow"]}` |

Miasta z bazy (seed, bez polskich znaków — wygodne na demo): **Warsaw, Krakow, Gdansk, Wroclaw, Poznan**.

## Testy

PowerShell:

```powershell
.\scripts\test_api.ps1
```

Bash:

```bash
bash scripts/test_api.sh
```

## Struktura

- `internal/model/` — model GORM
- `internal/proxy/` — Proxy pogody
- `internal/handler/` — kontroler Echo
- `internal/database/` — SQLite + seed
