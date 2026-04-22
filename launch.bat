@echo off
echo Arret des processus existants...
taskkill /F /IM "remind-me-tauri.exe" >nul 2>&1
taskkill /F /IM "node.exe" >nul 2>&1
timeout /t 2 /nobreak >nul

echo Lancement de Remind Me...
set RUSTUP_TOOLCHAIN=stable-x86_64-pc-windows-msvc
npm run tauri dev
