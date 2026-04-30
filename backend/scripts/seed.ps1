param([Parameter(Mandatory = $true)][string]$ServiceUrl, [Parameter(Mandatory = $true)][string]$DemoAdminKey, [bool]$ResetBeforeSeed = $true)
$ErrorActionPreference = "Stop"
$base = $ServiceUrl.TrimEnd("/")
$body = @{ resetBeforeSeed = $ResetBeforeSeed } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "$base/api/v1/admin/seed" -Headers @{ "X-Demo-Admin-Key" = $DemoAdminKey } -ContentType "application/json" -Body $body
