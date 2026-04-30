#!/usr/bin/env bash
set -euo pipefail
SERVICE_URL="${SERVICE_URL:-${1:-}}"
if [[ -z "$SERVICE_URL" ]]; then echo "Usage: SERVICE_URL=<url> ./scripts/smoke.sh"; exit 1; fi
API_BASE_URL="${SERVICE_URL%/}/api/v1" npm run smoke
