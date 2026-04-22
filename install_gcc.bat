@echo off
C:\msys64\usr\bin\bash.exe -lc "pacman -S --noconfirm mingw-w64-x86_64-gcc mingw-w64-x86_64-toolchain"
echo Exit code: %ERRORLEVEL%
