# Zadanie 9 — Chmura (Docker)

Aplikacja ze **zadanie 8** (React + Express) uruchomiona jako **dwie instancje Docker** — serwer API i klient (nginx).

**Commit:** [zadanie9](https://github.com/zezuul/po26/commit/829df656fedc60a46ee3bed444a1f81873f67cd3)  
**Demo:** [demos/zadanie9.mp4](../demos/zadanie9.mp4)

| Punkty | Opis | Implementacja |
|--------|------|---------------|
| 3.0 | Instancje po stronie chmury na Dockerze | `docker-compose.yml` — kontenery `po26-server`, `po26-client` |

## Architektura

```
docker compose
  ├── server (Express)   → port 3011
  └── client (nginx)     → port 3010
```

Kod aplikacji: [../zadanie8/](../zadanie8/)  
Obrazy budowane z `zadanie8/server` i `zadanie8/client`.

## Uruchomienie

### Windows

**CMD / PowerShell:**
```bat
cd zadanie9
run-cloud.bat
```

**Git Bash:**
```bash
cd zadanie9
bash run-cloud.sh
```

Skrypt używa pełnej ścieżki do `docker.exe` (Docker Desktop) — nie wymaga `docker` w PATH.

### Ręcznie

```bash
cd zadanie9
cp .env.example .env
docker compose up --build
```

- Frontend: http://localhost:3010  
- API: http://localhost:3011/api/health  

## Weryfikacja (demo)

```bash
docker compose ps
```

Powinny działać **2 kontenery**: `po26-server`, `po26-client`.

```bash
curl http://localhost:3011/api/health
curl -I http://localhost:3010/
```

## Chmura (VPS)

Ten sam `docker-compose.yml` można uruchomić na maszynie w chmurze (Oracle Free Tier, AWS EC2 itd.) z zainstalowanym Dockerem:

```bash
git clone https://github.com/zezuul/po26.git
cd po26/zadanie9
cp .env.example .env
# w .env ustaw CLIENT_PUBLIC_URL na publiczny IP, np. http://51.x.x.x:3010
docker compose up --build -d
```

Otwórz porty **3010** i **3011** w firewallu.

## Zatrzymanie

```bash
docker compose down
```
