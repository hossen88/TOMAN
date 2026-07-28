@echo off
title TOMAN Streamer Tools
echo Starting TOMAN...

REM Kill any existing processes on our ports first
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000.*LISTENING"') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080.*LISTENING"') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3099.*LISTENING"') do taskkill /PID %%a /F >nul 2>&1
timeout /t 2 /nobreak >nul

REM Start tiktok-signature server (port 8080)
echo [1/3] Starting tiktok-signature server on port 8080...
start "tiktok-signature" cmd /c "cd /d C:\Users\maike\OneDrive\Desktop\web\streamer-tools && set PUPPETEER_CACHE_DIR=C:\Users\maike\.cache\puppeteer && node --env-file-if-exists=.env node_modules\tiktok-signature\server.mjs"

REM Wait for signature server
echo Waiting for signature server to initialize...
timeout /t 25 /nobreak >nul

REM Start EulerStream proxy (port 3099)
echo [2/3] Starting EulerStream proxy on port 3099...
start "euler-proxy" cmd /c "cd /d C:\Users\maike\OneDrive\Desktop\web\streamer-tools && node sign-server.mjs"

REM Wait for proxy
timeout /t 3 /nobreak >nul

REM Start Next.js
echo [3/3] Starting Next.js on port 3000...
cd /d C:\Users\maike\OneDrive\Desktop\web\streamer-tools
set SIGN_API_URL=http://localhost:3099
npx next dev --port 3000
