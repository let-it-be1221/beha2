@echo off
title Beha Marketing PLC - Full System Launcher
color 0B

echo ===================================================
echo   BEHA MARKETING PLC - FULL SYSTEM LAUNCHER
echo ===================================================
echo.

cd /d "%~dp0"

:: Start Backend in new window
echo [1/2] Launching Backend Server on port 8000...
start "Beha Backend API" cmd /k "start-backend.bat"

:: Start Frontend in new window
echo [2/2] Launching Frontend Development Server...
start "Beha Frontend UI" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo  System is starting!
echo  Backend:  http://127.0.0.1:8000/api
echo  Frontend: http://localhost:5173 or http://localhost:5174
echo ===================================================
echo.
timeout /t 3 >nul
start http://localhost:5173
