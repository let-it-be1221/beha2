@echo off
title Beha Marketing PLC - Database Migration & Seeder
color 0E

echo ===================================================
echo   BEHA MARKETING PLC - DATABASE SETUP & SEED
echo ===================================================
echo.

cd /d "%~dp0"

set PHP_BIN=php
if exist "C:\xampp\php\php.exe" (
    set PHP_BIN=C:\xampp\php\php.exe
)

echo [INFO] Running Migrations and Seeding default accounts...
"%PHP_BIN%" artisan migrate:fresh --seed

echo.
echo [DONE] Database successfully refreshed and seeded!
echo.
pause
