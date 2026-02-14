@echo off
echo ========================================
echo CareOps Backend Setup
echo ========================================
echo.

echo [1/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo [2/3] Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Prisma generate failed!
    pause
    exit /b 1
)
echo ✓ Prisma Client generated
echo.

echo [3/3] Pushing database schema...
call npx prisma db push
if %errorlevel% neq 0 (
    echo ERROR: Database push failed!
    echo.
    echo Make sure:
    echo - PostgreSQL is running
    echo - DATABASE_URL in .env is correct
    echo - Database exists and is accessible
    pause
    exit /b 1
)
echo ✓ Database schema pushed
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo You can now start the backend with: npm start
echo.
pause
