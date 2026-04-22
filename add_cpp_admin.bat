@echo off
echo Checking if running as admin...
net session >nul 2>&1
if %errorlevel% neq 0 (
  echo NOT admin - relaunching as admin...
  powershell -Command "Start-Process '%~f0' -Verb RunAs -Wait"
  exit /b
)
echo Running as admin. Installing C++ workload...
"C:\Program Files (x86)\Microsoft Visual Studio\Installer\vs_installer.exe" modify ^
  --installPath "C:\Program Files\Microsoft Visual Studio\2022\Community" ^
  --add Microsoft.VisualStudio.Workload.NativeDesktop ^
  --add Microsoft.VisualCpp.Tools.HostX64.TargetX64 ^
  --add Microsoft.VisualCpp.14.39.17.9.x86.x64 ^
  --includeRecommended ^
  --passive ^
  --norestart
echo Done, exit code: %ERRORLEVEL%
pause
