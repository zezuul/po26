# Zadanie 8 — Testy (Playwright + aplikacja React)

Kopia sklepu z **zadanie 5** z rozszerzeniem o **rejestrację**, **logowanie**, **CSRF** oraz **synchronizację koszyka** (`localStorage` + zdarzenie `storage` między kartami). Testy automatyczne w **Playwright** (TypeScript).

**Commit:** [task8](https://github.com/zezuul/po26/commit/4f3aafcd5551f16baf444505590b6a16498df2be)  
**Demo:** [demos/zadanie8.mp4](../demos/zadanie8.mp4)

| Punkty | Opis                                                | Lokalizacja                              |
| ------ | --------------------------------------------------- | ---------------------------------------- |
| 3.0    | Walidacja rejestracji (pola wymagane, zły e-mail)   | `playwright/tests/registration.spec.ts`  |
| 3.5    | Testy XSS na polu wyszukiwania produktów            | `playwright/tests/xss.spec.ts`           |
| 4.0    | Koszyk w wielu kartach przeglądarki                 | `playwright/tests/cart-multitab.spec.ts` |
| 4.5    | Logowanie + CSRF (strona ataku `/csrf-attack.html`) | `playwright/tests/csrf.spec.ts`          |
| 5.0    | Scenariusz E2E — **≥50 asercji**                    | `playwright/tests/e2e-full.spec.ts`      |

**Zadanie 5** pozostaje bez zmian (bez auth) — cała logika testowa jest tutaj.

## Porty

| Usługa          | Port |
| --------------- | ---- |
| Frontend (Vite) | 3010 |
| API (Express)   | 3011 |

## Uruchomienie aplikacji

### Docker

```bash
cd zadanie8
docker compose up --build
```

### Lokalnie

```bash
cd zadanie8/server && npm install && npm start
cd zadanie8/client && npm install && npm run dev
```

Ustaw `VITE_API_URL=http://localhost:3011` w `client/.env` (opcjonalnie).

## Testy Playwright

```bash
cd zadanie8/playwright
npm install
npx playwright install chromium
npm test
```

Konfiguracja uruchamia automatycznie serwer (3011) i klienta (3010) — patrz `playwright.config.ts`.

## Struktura

- `client/` — React + auth + koszyk z `localStorage`
- `server/` — API + sesje + CSRF + statyczna strona ataku CSRF
- `playwright/tests/` — zestawy testów

## CSRF (demo)

Po zalogowaniu zmiana nazwy w **Konto** wymaga tokenu z `GET /api/csrf-token`. Strona `http://localhost:3011/csrf-attack.html` próbuje wysłać `POST /api/account/settings` **bez** tokenu — serwer zwraca **403**.
