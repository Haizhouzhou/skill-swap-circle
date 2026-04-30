#!/usr/bin/env bash
set -euo pipefail
SERVICE_URL="${SERVICE_URL:-${1:-}}"
DEMO_ADMIN_KEY="${DEMO_ADMIN_KEY:-${2:-}}"
if [[ -z "$SERVICE_URL" || -z "$DEMO_ADMIN_KEY" ]]; then echo "Usage: SERVICE_URL=<url> DEMO_ADMIN_KEY=<key> ./scripts/seed.sh"; exit 1; fi
curl -fsS -X POST "${SERVICE_URL%/}/api/v1/admin/seed" -H "Content-Type: application/json" -H "X-Demo-Admin-Key: $DEMO_ADMIN_KEY" -d '{"resetBeforeSeed":true}'
