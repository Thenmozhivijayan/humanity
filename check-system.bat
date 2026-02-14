@echo off
echo ========================================
echo CareOps System Check
echo ========================================
echo.

echo [1/5] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    exit /b 1
)
echo ✓ Node.js installed
echo.

echo [2/5] Checking PostgreSQL...
psql --version
if %errorlevel% neq 0 (
    echo ERROR: PostgreSQL not found!
    exit /b 1
)
echo ✓ PostgreSQL installed
echo.

echo [3/5] Checking Backend...
cd careops-backend
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)
echo ✓ Backend dependencies ready
echo.

echo [4/5] Checking Frontend...
cd ..\careops-frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)
echo ✓ Frontend dependencies ready
echo.

echo [5/5] Checking Database...
cd ..\careops-backend
npx prisma db push --skip-generate 2>nul
if %errorlevel% neq 0 (
    echo WARNING: Database might need setup
    echo Run: npx prisma migrate dev
) else (
    echo ✓ Database connected
)
echo.

echo ========================================
echo System Check Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Start backend:  cd careops-backend ^&^& npm start
echo 2. Start frontend: cd careops-frontend ^&^& npm run dev
echo 3. Visit: http://localhost:3000/onboarding
echo.
pause
