@echo off
where vswhere 2>nul
if exist "C:\Program Files (x86)\Microsoft Visual Studio\Installer\vswhere.exe" (
  "C:\Program Files (x86)\Microsoft Visual Studio\Installer\vswhere.exe" -all -property installationPath
) else (
  echo vswhere not found
)
dir /b "C:\Program Files (x86)\Microsoft Visual Studio" 2>nul || echo VS_x86_NOT_FOUND
