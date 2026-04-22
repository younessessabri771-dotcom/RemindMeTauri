@echo off
dir /s /b "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Tools\MSVC" 2>nul | findstr /i "link.exe" | head
if %ERRORLEVEL% EQU 0 (echo LINK_FOUND) else (echo LINK_NOT_FOUND)
