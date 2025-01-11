# System zarządzania zamówieniami
Aplikacja do zarządzania klientami i zamówieniami.

## 📌 Wymagania
- Node.js
- MySQL

## 🚀 Instalacja
1. Skopiuj repozytorium
2. Utwórz bazę danych i uruchom `users.sql`
3. Uruchom backend: `node server.js`
4. Uruchom frontend w przeglądarce (`index.html`)

## 🔑 Role użytkowników
| Rola | Uprawnienia |
|------|------------|
| Admin | Pełny dostęp |
| Employee | Może edytować klientów, ale nie zarządzać użytkownikami |

## 📜 API
### 🔐 Logowanie
`POST /login`
**Body:**
```json
{ "email": "admin@sklep.pl", "password": "admin123" }
