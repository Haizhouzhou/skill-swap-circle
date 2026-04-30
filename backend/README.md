# Skillswap Backend

TypeScript Express API for the Skillswap demo. It persists demo users, listings, saved listings, sessions, chats, medals, feedback, impact chains, and visual city connections in Firestore.

All API routes are under `/api/v1`. Success responses use `{ "data": ... }`; errors use `{ "error": { "code": "...", "message": "...", "details": ... } }`.

## Local Development

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

The default local API base URL is `http://localhost:8080/api/v1`.

Use Application Default Credentials, `GOOGLE_APPLICATION_CREDENTIALS`, or a running Firestore emulator via `FIRESTORE_EMULATOR_HOST`.

## Seed

```powershell
$env:API_BASE_URL="http://localhost:8080/api/v1"
$env:DEMO_ADMIN_KEY="change-me"
npm run seed
```

Or against Cloud Run:

```powershell
.\scripts\seed.ps1 -ServiceUrl "https://YOUR_SERVICE_URL" -DemoAdminKey "YOUR_KEY"
```

## Build And Smoke

```powershell
npm run build
$env:API_BASE_URL="http://localhost:8080/api/v1"
npm run smoke
```

The full smoke check expects Firestore to be available and seeded.

## Deploy

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

Frontend env vars:

```text
VITE_API_BASE_URL=https://<cloud-run-service-url>/api/v1
VITE_USE_BACKEND=true
```

## Demo Limits

No real auth, Firebase Auth, OAuth, payments, WebSockets, real email, heavy search, or external AI calls. Demo headers are context only.
