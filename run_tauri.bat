@echo off
echo Setting PATH with MinGW and Cargo...
set PATH=C:\msys64\mingw64\bin;%USERPROFILE%\.cargo\bin;%PATH%

echo.
echo Switching Rust to GNU toolchain...
rustup default stable-x86_64-pc-windows-gnu

echo.
echo Killing any process on port 1420...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :1420 2^>nul') do taskkill /PID %%a /F 2>nul

echo.
echo Launching Tauri dev...
cd /d "C:\Users\PC\OneDrive\Desktop\remind-me-tauri"
npx tauri dev
