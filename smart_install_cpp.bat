@echo off
REM Check vswhere location
set VSWHERE="C:\Program Files (x86)\Microsoft Visual Studio\Installer\vswhere.exe"
if not exist %VSWHERE% (
  echo vswhere not found!
  pause
  exit /b 1
)

REM Get install path
for /f "usebackq tokens=*" %%i in (`%VSWHERE% -latest -property installationPath`) do set VS_PATH=%%i
echo VS Path: %VS_PATH%

REM Check if C++ tools already there
if exist "%VS_PATH%\VC\Tools\MSVC" (
  echo C++ tools ALREADY installed:
  dir /b "%VS_PATH%\VC\Tools\MSVC"
  pause
  exit /b 0
)

echo C++ tools NOT installed. Adding workload now...
set INSTALLER="C:\Program Files (x86)\Microsoft Visual Studio\Installer\vs_installer.exe"
%INSTALLER% modify --installPath "%VS_PATH%" --add Microsoft.VisualStudio.Workload.NativeDesktop --includeRecommended --quiet --norestart
echo Done. Exit: %ERRORLEVEL%
pause
