# 🔧 CareOps Troubleshooting Guide

## Issues Found & Fixed

### ✅ Issue 1: Invalid DATABASE_URL Format
**Problem:** The `.env` file had an invalid PostgreSQL connection string with `psql` command prefix.

**Original:**
```
DATABASE_URL=psql 'postgresql://...'
```

**Fixed:**
```
DATABASE_URL="postgresql://neondb_owner:npg_pqxsBIklM01y@ep-shiny-heart-ai03isk7-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

**Impact:** Prisma couldn't connect to the database, preventing all database operations.

---

### ✅ Issue 2: Missing Prisma Schema Relation
**Problem:** `AutomationRule` model referenced `workspace` but `Workspace` model didn't have the reverse relation.

**Fixed:** Added `automationRules AutomationRule[]` to the `Workspace` model.

**Impact:** Prisma schema validation would fail, preventing migrations and client generation.

---

### ✅ Issue 3: Invalid Prisma Query Syntax
**Problem:** In `automation.js`, line 197 used invalid syntax:
```javascript
quantity: { lte: prisma.raw("threshold") }
```

**Fixed:** Changed to fetch all inventory and filter in JavaScript:
```javascript
const allInventory = await prisma.inventory.findMany();
const lowInventory = allInventory.filter(
  (item) => item.quantity <= item.threshold
);
```

**Impact:** The inventory check automation would crash when executed.

---

### ✅ Issue 4: TypeScript JSX Configuration
**Problem:** `tsconfig.json` had `"jsx": "react-jsx"` which is incompatible with Next.js.

**Fixed:** Changed to `"jsx": "preserve"` as required by Next.js.

**Impact:** TypeScript compilation errors in Next.js pages.

---

### ✅ Issue 5: App Router vs Pages Router Conflict
**Problem:** The frontend has both `/app` and `/pages` directories, causing routing conflicts.

**Status:** Both directories exist. The `/app` directory is used for the root layout and home page, while `/pages` contains the actual application pages.

**Note:** This is technically valid in Next.js 13+, but can be confusing. The app router takes precedence for routes defined in both places.

---

## 🚀 Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd careops-backend
   ```

2. **Run the setup script:**
   ```bash
   setup.bat
   ```
   
   This will:
   - Install npm dependencies
   - Generate Prisma Client
   - Push database schema to PostgreSQL

3. **Start the backend:**
   ```bash
   npm start
   ```
   
   Backend should run on `http://localhost:4000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd careops-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   Frontend should run on `http://localhost:3000`

---

## 🔍 Common Issues & Solutions

### Issue: "Can't reach database server"
**Solution:**
1. Verify PostgreSQL is running
2. Check DATABASE_URL in `.env` is correct
3. Ensure the database exists
4. Test connection: `npx prisma db pull`

### Issue: "Cannot find module '@prisma/client'"
**Solution:**
```bash
cd careops-backend
npx prisma generate
```

### Issue: "Module not found" errors in frontend
**Solution:**
```bash
cd careops-frontend
npm install
```

### Issue: Port already in use
**Solution:**
- Backend (4000): Kill process using port 4000
- Frontend (3000): Kill process using port 3000
- Windows: `netstat -ano | findstr :4000` then `taskkill /PID <PID> /F`

### Issue: TypeScript errors in frontend
**Solution:**
1. Delete `.next` folder
2. Run `npm run dev` again

---

## 📝 Database Schema Notes

After running `npx prisma db push`, your database will have:
- 13 tables (Workspace, User, Integration, Contact, Conversation, Message, Service, Availability, Booking, Form, FormSubmission, Inventory, Alert, AutomationRule)
- All relations properly configured
- Default values set

---

## 🧪 Testing the Application

1. **Start both servers** (use `start.bat` from root directory)

2. **Visit onboarding:** `http://localhost:3000/onboarding`

3. **Create a workspace:**
   - Enter business name, email, address
   - Click "Next: Integrations"

4. **Setup integration:**
   - Choose Email or SMS
   - Enter credentials
   - Test connection

5. **Add services and availability**

6. **Activate workspace**

---

## 🐛 Debugging Tips

### Enable Prisma Query Logging
Add to `prismaClient.js`:
```javascript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### Check Backend Logs
The backend logs all automation events and integration attempts to console.

### Verify Database State
```bash
cd careops-backend
npx prisma studio
```
This opens a GUI to browse your database.

---

## 📞 Need Help?

If you encounter issues not covered here:
1. Check the console logs (both frontend and backend)
2. Verify all dependencies are installed
3. Ensure PostgreSQL is running and accessible
4. Check that ports 3000 and 4000 are available

---

**Last Updated:** After fixing all critical issues
**Status:** ✅ Ready to run
