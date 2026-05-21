# Zadanie 3 — Wzorce kreacyjne (Spring Boot + Kotlin)

Prosty serwis autoryzacji (mock) z wzorcem **Singleton** (wersja **eager** lub **lazy**), wstrzyknięty do kontrolera przez **constructor injection**.

## Wymagania

| Punkty | Opis | Implementacja |
|--------|------|---------------|
| 3.0 | Kontroler + lista w JSON | `GET /api/items` — `MainController` |
| 3.5 | Mock autoryzacji jako Singleton **eager** | `EagerAuthSingleton` (Kotlin `object`) |
| 4.0 | Obsługa danych autoryzacji od użytkownika | `POST /api/auth` + `AuthRequest` |
| 4.5 | Wstrzyknięcie singletona do kontrolera | Constructor injection w `MainController` |
| 5.0 | Do wyboru wersja **lazy** Singletona | `LazyAuthSingleton` + profil `lazy` |

## Uruchomienie

Wymaga JDK 17+ i Gradle.

```bash
cd zadanie3
gradle bootRun
```

Windows (bez literówki w nazwie zadania):

```bat
run.bat
```

### Brak pamięci RAM / „Plik stronicowania jest za mały”

Użyj lżejszego startu (jeden proces Java, bez `bootRun`):

```bat
run-light.bat
```

Albo ręcznie:

```bat
gradle --no-daemon bootJar
java -Xms64m -Xmx256m -jar build\libs\zadanie3-1.0.0.jar
```

Komunikat `DOSKEY is not recognized` można zignorować — to ostrzeżenie Gradle na Windows, nie błąd aplikacji.

Aplikacja: http://localhost:8081

### Wybór Singletona

**Eager** (domyślnie):

```bash
gradle bootRun
# lub: gradle bootRun --args='--spring.profiles.active=eager'
```

**Lazy**:

```bash
gradle bootRun --args='--spring.profiles.active=lazy'
```

## Endpointy

| Metoda | URL | Opis |
|--------|-----|------|
| GET | `/api/items` | Lista elementów (JSON) |
| POST | `/api/auth` | Autoryzacja — body: `{"username":"admin","password":"admin123"}` |

Konta testowe: `admin` / `admin123`, `user` / `password`

## Testy curl

```bash
cd scripts
bash test_api.sh
```

## Struktura

- `singleton/EagerAuthSingleton.kt` — Singleton eager
- `singleton/LazyAuthSingleton.kt` — Singleton lazy
- `service/` — adapter Spring (`@Profile eager` / `lazy`)
- `controller/MainController.kt` — jeden kontroler REST
