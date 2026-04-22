@echo off
echo Searching for link.exe in VS Community...
dir /s /b "C:\Program Files\Microsoft Visual Studio\2022\Community\VC" 2>nul | findstr /i "link.exe"
if %ERRORLEVEL% NEQ 0 echo "link.exe NOT FOUND - C++ tools not installed"
echo.
echo Listing VC folder:
dir /b "C:\Program Files\Microsoft Visual Studio\2022\Community\VC" 2>nul || echo "VC folder not found"
