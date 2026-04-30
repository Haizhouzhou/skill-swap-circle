param([Parameter(Mandatory = $true)][string]$ServiceUrl)
$ErrorActionPreference = "Stop"
$env:API_BASE_URL = "$($ServiceUrl.TrimEnd('/'))/api/v1"
npm run smoke
