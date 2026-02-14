@echo off
echo ========================================
echo Starting CareOps Platform
echo ========================================
echo.

echo Starting Backend Server...
start "CareOps Backend" cmd /k "cd careops-backend && npm start"
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "CareOps Frontend" cmd /k "cd careops-frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo CareOps is starting...
echo ========================================
echo.
echo Backend:  http://localhost:4000
echo Frontend: http://localhost:3000
echo.
echo Press any key to open browser...
pause >nul

start http://localhost:3000/onboarding
