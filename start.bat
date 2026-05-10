@echo off
title MediQueue AI - Startup Script
echo ============================================
echo        MediQueue AI - Startup Script
echo ============================================
echo.

:: ---- Start Backend ----
echo [1/2] Starting Backend (FastAPI + Virtual Env)...
echo.

:: Launch backend in a new window: activate venv, then run with uvicorn
start "MediQueue Backend" cmd /k "cd /d "%~dp0backend" && call venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"

echo       Backend server starting on http://localhost:8000
echo       Waiting 5 seconds for it to initialize...
echo.

:: Wait 5 seconds for the backend to be ready
timeout /t 5 /nobreak >nul

:: ---- Start Frontend ----
echo [2/2] Starting Frontend (Vite Dev Server)...
echo.

:: Launch frontend in a new window
start "MediQueue Frontend" cmd /k "cd /d "%~dp0" && npm run dev"

echo.
echo ============================================
echo   Both servers are now running!
echo   Backend  : http://localhost:8000
echo   Frontend : http://localhost:5173
echo ============================================
echo.
echo You can close this window.
pause
