# Zadanie 5 — Wzorce behawioralne (React + TypeScript)

Sklep: **Produkty** (GET z API), **Koszyk** (osobny widok), **Płatności** (POST do API). Stan w **React Context** + hooks. **axios** + **CORS**. Uruchomienie w **Docker Compose**.

## Wymagania

| Punkty | Opis | Implementacja |
|--------|------|---------------|
| 3.0 | Komponenty Produkty + Płatności | `Products.tsx`, `Payments.tsx` + axios |
| 3.5 | Koszyk + routing | `Cart.tsx`, `react-router-dom` |
| 4.0 | Dane między komponentami | `CartContext` — `useState`, `useContext`, `useEffect` |
| 4.5 | Docker Compose | `docker-compose.yml` — client + server |
| 5.0 | axios + CORS | `api.ts`, `cors` w Express |

## Uruchomienie (Docker)

```bash
cd zadanie5
docker compose up --build
```

- Frontend: http://localhost:3000  
- API: http://localhost:3001/api/products  

**Pierwszy build** trwa zwykle 3–8 min (`npm ci` w obu kontenerach). Kolejne buildy są szybsze dzięki cache Dockera.

**Szybciej na co dzień (bez Docker):** uruchom serwer i `npm run dev` w `client/` — patrz sekcja poniżej.

## Uruchomienie lokalne (bez Docker)

Terminal 1 — serwer:

```bash
cd server && npm install && npm start
```

Terminal 2 — klient:

```bash
cd client && npm install && npm run dev
```

## Struktura

- `client/src/components/` — Produkty, Koszyk, Płatności
- `client/src/context/CartContext.tsx` — współdzielony stan koszyka
- `server/src/index.js` — API + CORS

## Flow demo

1. **Produkty** — lista z serwera, „Do koszyka”
2. **Koszyk** — zmiana ilości, suma
3. **Płatności** — formularz, wysyłka POST, komunikat sukcesu
