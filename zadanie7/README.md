# Zadanie 7 — Vapor + Leaf + Fluent + Redis

Sklep z trzema modelami i pełnym CRUD w szablonach Leaf.

## Wymagania

| Punkty | Opis                    | Implementacja                                      |
| ------ | ----------------------- | -------------------------------------------------- |
| 3.0    | CRUD Produktów (Fluent) | `ProductController`, model `Product`               |
| 3.5    | Szablony Leaf           | `Resources/Views/`                                 |
| 4.0    | Kategorie + relacja     | `Category` ↔ `Product` (`@Parent` / `@Children`)   |
| 4.5    | Redis                   | `RedisCacheService` — cache list (Fluent → SQLite) |
| 5.0    | Heroku                  | **Pominięte** na życzenie                          |

## Modele i relacje

- **Category** — ma wiele **Product**
- **Product** — należy do **Category**, ma wiele **Review**
- **Review** — należy do **Product**

## Uruchomienie na Windows (bez macOS/Linux) — Docker

Wystarczy **Docker Desktop**:

```bat
cd zadanie7
run.bat
```

albo:

```bash
docker compose up --build
```

Aplikacja: **http://localhost:8080**

## Uruchomienie (macOS + Swift lokalnie)

```bash
docker compose up -d redis
swift build
REDIS_HOST=localhost swift run App serve --hostname 0.0.0.0 --port 8080
```

## Struktura

- `Sources/App/Models/` — Category, Product, Review
- `Sources/App/Controllers/` — CRUD + Leaf
- `Sources/App/Services/RedisCacheService.swift` — cache Redis
- `Sources/App/Migrations/` — Fluent + seed
