@echo off
echo ========================================
echo Installing Authentication Dependencies
echo ========================================
echo.

echo [1/2] Installing backend dependencies...
cd careops-backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend install failed!
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed
echo.

echo [2/2] Installing frontend dependencies...
cd ..\careops-frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend install failed!
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Start backend:  cd careops-backend ^&^& npm start
echo 2. Start frontend: cd careops-frontend ^&^& npm run dev
echo 3. Visit: http://localhost:3000
echo.
pause
