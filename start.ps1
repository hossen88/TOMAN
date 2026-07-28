Set-Location "C:\Users\maike\OneDrive\Desktop\web\streamer-tools"

Write-Host "Starting TOMAN..." -ForegroundColor Red

# Start tiktok-signature server (port 8080)
Write-Host "[1/3] Starting tiktok-signature server on port 8080..." -ForegroundColor Yellow
$sigProcess = Start-Process -FilePath "cmd.exe" `
    -ArgumentList '/c "cd /d C:\Users\maike\OneDrive\Desktop\web\streamer-tools && set PUPPETEER_CACHE_DIR=C:\Users\maike\.cache\puppeteer && node --env-file-if-exists=.env node_modules\tiktok-signature\server.mjs"' `
    -WindowStyle Hidden -PassThru

Write-Host "Waiting for signature server to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 25

# Start EulerStream proxy (port 3099)
Write-Host "[2/3] Starting EulerStream proxy on port 3099..." -ForegroundColor Yellow
$proxyProcess = Start-Process -FilePath "node" `
    -ArgumentList "sign-server.mjs" `
    -WorkingDirectory "C:\Users\maike\OneDrive\Desktop\web\streamer-tools" `
    -WindowStyle Hidden -PassThru

Start-Sleep -Seconds 3

# Start Next.js dev server
Write-Host "[3/3] Starting Next.js dev server on port 3000..." -ForegroundColor Yellow
$env:SIGN_API_URL = "http://localhost:3099"
npx next dev --port 3000

# Cleanup
Write-Host "`nShutting down..." -ForegroundColor Red
if ($sigProcess) { $sigProcess.Kill() }
if ($proxyProcess) { $proxyProcess.Kill() }
