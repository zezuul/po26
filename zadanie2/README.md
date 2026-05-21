# Zadanie 2 — Wzorce architektury (Symfony)

Aplikacja webowa Symfony 6.4 z bazą **SQLite**, uruchamiana w Dockerze na obrazie `kprzystalski/projobj-php:latest`.

## Wymagania (checklista)

| Punkty | Opis |
|--------|------|
| 3.0 | Model **Product** + kontroler API z CRUD (JSON) — `/api/products` |
| 3.5 | Skrypty **curl** testujące endpointy — `scripts/` |
| 4.0 | Dwa dodatkowe modele + API JSON — **Category**, **Customer** |
| 4.5 | Widoki Twig (HTML) dla wszystkich kontrolerów |
| 5.0 | Panel administracyjny **EasyAdmin** — `/admin` |

## Uruchomienie (Docker)

```bash
cd zadanie2
bash setup.sh
```

Aplikacja: [http://localhost:8080](http://localhost:8080)

- Widoki: `/products`, `/categories`, `/customers`
- API JSON: `/api/products`, `/api/categories`, `/api/customers`
- Admin: `/admin`

## Testy curl

Wymaga `curl` i `jq`. Uruchom po starcie aplikacji:

```bash
cd scripts
bash test_all.sh
# lub pojedynczo: test_products.sh, test_categories.sh, test_customers.sh
```

Inny host:

```bash
BASE_URL=http://127.0.0.1:8080 bash test_all.sh
```

## Struktura

- `src/Entity/` — Product, Category, Customer
- `src/Controller/Api/` — CRUD JSON
- `src/Controller/` — widoki HTML
- `src/Controller/Admin/` — EasyAdmin
- `scripts/` — testy curl
