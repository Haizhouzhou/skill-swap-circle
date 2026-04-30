#!/usr/bin/env bash
set -euo pipefail
PROJECT_ID="${PROJECT_ID:-${1:-}}"
REGION="${REGION:-europe-west6}"
SERVICE_NAME="${SERVICE_NAME:-skillswap-api}"
FRONTEND_ORIGIN="${FRONTEND_ORIGIN:-}"
DEMO_ADMIN_KEY="${DEMO_ADMIN_KEY:-}"
if [[ -z "$PROJECT_ID" || -z "$FRONTEND_ORIGIN" || -z "$DEMO_ADMIN_KEY" ]]; then
  echo "Usage: PROJECT_ID=<id> FRONTEND_ORIGIN=<origin> DEMO_ADMIN_KEY=<key> ./scripts/deploy.sh"
  exit 1
fi
command -v gcloud >/dev/null 2>&1 || { echo "gcloud CLI was not found."; exit 1; }
gcloud config set project "$PROJECT_ID"
gcloud services enable run.googleapis.com firestore.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
gcloud firestore databases create --database="(default)" --location="$REGION" --edition=standard --type=firestore-native || echo "Firestore database create skipped or already exists."
[[ -d node_modules ]] || npm install
npm run build
gcloud run deploy "$SERVICE_NAME" --source . --region "$REGION" --allow-unauthenticated --set-env-vars "NODE_ENV=production,FIRESTORE_DATABASE_ID=(default),CORS_ORIGIN=$FRONTEND_ORIGIN,DEMO_ADMIN_KEY=$DEMO_ADMIN_KEY,DEMO_SEED_VERSION=1"
SERVICE_URL="$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format 'value(status.url)')"
echo "Service URL: $SERVICE_URL"
echo "VITE_API_BASE_URL=$SERVICE_URL/api/v1"
echo "VITE_USE_BACKEND=true"
