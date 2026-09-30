Set-Location $PSScriptRoot
$env:VITE_API_BASE_URL = 'http://localhost:8081/api'
npm run dev -- --host 0.0.0.0
