@echo off
title Beha Marketing PLC - Backend API Server
color 0A

echo ===================================================
echo   BEHA MARKETING PLC - BACKEND SERVER (Laravel)
echo ===================================================
echo.

cd /d "%~dp0"

:: Detect PHP
set PHP_BIN=php
if exist "C:\xampp\php\php.exe" (
    set PHP_BIN=C:\xampp\php\php.exe
)

echo [INFO] Using PHP: %PHP_BIN%
echo [INFO] Starting Laravel backend on http://127.0.0.1:8000 ...
echo [INFO] Press Ctrl+C to stop the server.
echo.

"%PHP_BIN%" artisan serve --host=127.0.0.1 --port=8000

pause
