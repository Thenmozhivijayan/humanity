@echo off
echo ========================================
echo CareOps - Customer Accounts Setup
echo ========================================
echo.

cd careops-backend

echo [1/3] Running database migration...
call npx prisma migrate dev --name link_customer_contact

echo.
echo [2/3] Generating Prisma client...
call npx prisma generate

echo.
echo [3/3] Migration complete!
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Start backend: cd careops-backend ^&^& npm start
echo 2. Start frontend: cd careops-frontend ^&^& npm run dev
echo 3. Visit http://localhost:3000/customer-register
echo.
pause
