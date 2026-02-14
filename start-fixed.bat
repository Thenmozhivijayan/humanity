@echo off
echo ========================================
echo CareOps Platform Launcher
echo ========================================
echo.

REM Check if backend dependencies are installed
if not exist "careops-backend\node_modules\" (
    echo [!] Backend dependencies not found
    echo [*] Running backend setup...
    cd careops-backend
    call setup.bat
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Backend setup failed!
        echo Please check the error messages above.
        pause
        exit /b 1
    )
    cd ..
    echo.
)

REM Check if frontend dependencies are installed
if not exist "careops-frontend\node_modules\" (
    echo [!] Frontend dependencies not found
    echo [*] Installing frontend dependencies...
    cd careops-frontend
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Frontend setup failed!
        pause
        exit /b 1
    )
    cd ..
    echo.
)

REM Check if Prisma Client is generated
if not exist "careops-backend\node_modules\.prisma\client\" (
    echo [!] Prisma Client not found
    echo [*] Generating Prisma Client...
    cd careops-backend
    call npx prisma generate
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Prisma generate failed!
        pause
        exit /b 1
    )
    cd ..
    echo.
)

echo ========================================
echo Starting CareOps Platform
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "CareOps Backend" cmd /k "cd careops-backend && npm start"
timeout /t 5 /nobreak >nul

echo [2/2] Starting Frontend Server...
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
echo Two terminal windows should have opened.
echo Wait for both servers to fully start (10-15 seconds)
echo.
echo Press any key to open browser...
pause >nul

start http://localhost:3000/onboarding

echo.
echo ========================================
echo CareOps is running!
echo ========================================
echo.
echo To stop the servers:
echo - Close both terminal windows
echo - Or press Ctrl+C in each window
echo.
echo Troubleshooting: See TROUBLESHOOTING.md
echo.
pause
