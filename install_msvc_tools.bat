@echo off
:: Download and run VS Build Tools installer separately (independent of VS Community)
curl -L -o "%TEMP%\vs_bt.exe" "https://aka.ms/vs/17/release/vs_buildtools.exe"
echo Downloaded. Running installer...
"%TEMP%\vs_bt.exe" --wait --passive --norestart ^
  --add Microsoft.VisualCpp.Tools.HostX64.TargetX64 ^
  --add Microsoft.VisualCpp.14.39.17.9.base ^
  --add Microsoft.VisualCpp.CRT.x64.Desktop
echo Exit code: %ERRORLEVEL%
pause
