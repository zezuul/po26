# Zadanie 6 — Zapaszki (jakość kodu)

Konfiguracja jakości dla projektów z zadań 3–5 (Kotlin, Go, JavaScript/TypeScript).

## Wymagania

| Punkty | Opis | Lokalizacja |
|--------|------|-------------|
| 3.0 | Husky + lint-staged przed commitem | `/package.json`, `.husky/pre-commit` |
| 3.5 | Eliminacja bugów Sonar (klient React) | `zadanie5/client/` + ESLint |
| 4.0 | CodeQL — skan i poprawka OSS | `codeql-oss/`, workflow `codeql.yml` |
| 4.5 | Code Smell + badge Sonar (kotlin, go, js) | `sonar-project.properties`, workflow `sonarcloud.yml` |
| 5.0 | GitHub Actions: linter + CodeQL | `.github/workflows/` |

## Sprawdzenie punktów w projektach

| Zadanie | 3.0 | 3.5 | 4.0 | 4.5 | 5.0 |
|---------|-----|-----|-----|-----|-----|
| JS (zadanie5 client) | husky | ESLint / Sonar | CodeQL | Sonar | Actions |
| JS (zadanie5 server) | husky | ESLint | CodeQL | Sonar | Actions |
| Kotlin (zadanie3) | — | detekt CI | CodeQL | Sonar | Actions |
| Go (zadanie4) | gofmt | golangci | CodeQL | Sonar | Actions |

## Husky (lokalnie)

```bash
npm install
git commit -m "test"   # uruchomi lint-staged
```

## ESLint

```bash
cd zadanie5/client && npm install && npm run lint
cd zadanie5/server && npm install && npm run lint
```

## SonarCloud

1. Załóż projekt na [sonarcloud.io](https://sonarcloud.io) — klucz `zezuul_po26`, organizacja `zezuul`.
2. W GitHub → Settings → Secrets → `SONAR_TOKEN`.
3. Workflow `sonarcloud.yml` uruchomi skan.

Badge w głównym `README`.

## CodeQL

Automatycznie na push/PR (`codeql.yml`). Przykład poprawki OSS: [codeql-oss/](codeql-oss/).
