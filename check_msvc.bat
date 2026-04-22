@echo off
echo === Checking VS Build Tools ===
dir /b "C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Tools\MSVC" 2>nul && echo BUILDTOOLS_FOUND || echo BUILDTOOLS_NOT_FOUND
echo.
echo === Checking VS Community ===
dir /b "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Tools\MSVC" 2>nul && echo COMMUNITY_FOUND || echo COMMUNITY_NOT_FOUND
echo.
echo === Searching anywhere for link.exe ===
for /r "C:\Program Files\Microsoft Visual Studio" %%f in (link.exe) do echo FOUND: %%f
