# CodeQL — przykład open source (zadanie 6 / 4.0)

Minimalna biblioteka `safe-merge` — wcześniejsza wersja używała niebezpiecznego merge
(obiektowy spread z nieznanego źródła → ryzyko prototype pollution).

## Znalezisko CodeQL

Zapytanie (JavaScript): niebezpieczne scalanie obiektów z danymi użytkownika.

## Poprawka

Plik `index.js` — merge tylko własnych kluczy (`hasOwnProperty`).

## Skan lokalnie

W repozytorium uruchom workflow **CodeQL** (GitHub Actions) lub CLI CodeQL zgodnie z
[codeql.github.com](https://codeql.github.com/).
