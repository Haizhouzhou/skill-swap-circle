param(
  [Parameter(Mandatory = $true)][string]$ProjectId,
  [string]$Region = "europe-west6",
  [string]$ServiceName = "skillswap-api",
  [Parameter(Mandatory = $true)][string]$FrontendOrigin,
  [Parameter(Mandatory = $true)][string]$DemoAdminKey
)
$ErrorActionPreference = "Stop"
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) { throw "gcloud CLI was not found. Install and authenticate gcloud first." }
gcloud config set project $ProjectId
gcloud services enable run.googleapis.com firestore.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
try { gcloud firestore databases create --database="(default)" --location=$Region --edition=standard --type=firestore-native } catch { Write-Host "Firestore database create skipped or already exists." }
if (-not (Test-Path "node_modules")) { npm install }
npm run build
$envVars = "NODE_ENV=production,FIRESTORE_DATABASE_ID=(default),CORS_ORIGIN=$FrontendOrigin,DEMO_ADMIN_KEY=$DemoAdminKey,DEMO_SEED_VERSION=1"
gcloud run deploy $ServiceName --source . --region $Region --allow-unauthenticated --set-env-vars $envVars
$serviceUrl = gcloud run services describe $ServiceName --region $Region --format "value(status.url)"
Write-Host "Service URL: $serviceUrl"
Write-Host "VITE_API_BASE_URL=$serviceUrl/api/v1"
Write-Host "VITE_USE_BACKEND=true"
