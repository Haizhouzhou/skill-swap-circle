# Deployment

Use Cloud Run and Firestore Native mode in `europe-west6`.

Install and authenticate the Google Cloud CLI first:

```powershell
gcloud auth login
gcloud auth application-default login
```

## PowerShell

From `D:\UZH\Activity\Skillswap\backend`:

```powershell
.\scripts\deploy.ps1 `
  -ProjectId "YOUR_PROJECT_ID" `
  -Region "europe-west6" `
  -ServiceName "skillswap-api" `
  -FrontendOrigin "https://YOUR_FRONTEND_DOMAIN" `
  -DemoAdminKey "YOUR_DEMO_ADMIN_KEY"
```

## Bash

```bash
PROJECT_ID="YOUR_PROJECT_ID" \
FRONTEND_ORIGIN="https://YOUR_FRONTEND_DOMAIN" \
DEMO_ADMIN_KEY="YOUR_DEMO_ADMIN_KEY" \
./scripts/deploy.sh
```

## Manual Commands

```powershell
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com firestore.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
gcloud firestore databases create --database="(default)" --location=europe-west6 --edition=standard --type=firestore-native
npm install
npm run build
gcloud run deploy skillswap-api --source . --region europe-west6 --allow-unauthenticated --set-env-vars NODE_ENV=production,FIRESTORE_DATABASE_ID="(default)",CORS_ORIGIN=https://YOUR_FRONTEND_DOMAIN,DEMO_ADMIN_KEY=YOUR_DEMO_ADMIN_KEY,DEMO_SEED_VERSION=1
```

## Seed And Smoke

```powershell
.\scripts\seed.ps1 -ServiceUrl "https://<cloud-run-service-url>" -DemoAdminKey "YOUR_DEMO_ADMIN_KEY"
.\scripts\smoke.ps1 -ServiceUrl "https://<cloud-run-service-url>"
```

After deployment, set in Vercel for the frontend:

```text
VITE_API_BASE_URL=https://<cloud-run-service-url>/api/v1
VITE_USE_BACKEND=true
```

Then redeploy the frontend.
