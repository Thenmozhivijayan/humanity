# 🚀 CareOps Quick Start Guide

## Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] PostgreSQL 14+ installed and running
- [ ] Git (optional, for version control)

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Setup Backend (2 minutes)

```bash
# Navigate to backend
cd careops-backend

# Run automated setup
setup.bat
```

**What this does:**
- Installs all npm packages
- Generates Prisma Client
- Creates database tables

**Expected output:**
```
✓ Dependencies installed
✓ Prisma Client generated
✓ Database schema pushed
Setup Complete!
```

### Step 2: Start Backend (30 seconds)

```bash
# In careops-backend directory
npm start
```

**Expected output:**
```
Backend running on http://localhost:4000
[AUTOMATION] Starting scheduled jobs...
[AUTOMATION] Jobs scheduled successfully
```

### Step 3: Setup Frontend (1 minute)

Open a **new terminal window**:

```bash
# Navigate to frontend
cd careops-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected output:**
```
- ready started server on 0.0.0.0:3000
- Local: http://localhost:3000
```

### Step 4: Open Application (30 seconds)

Visit: **http://localhost:3000**

You should be automatically redirected to the onboarding page.

---

## 🎉 You're Ready!

### What to do next:

1. **Complete Onboarding:**
   - Create your workspace
   - Setup email/SMS integration
   - Add services
   - Set availability
   - Activate workspace

2. **Test Public Pages:**
   - Contact form: `/public-pages/contact?workspaceId=YOUR_ID`
   - Booking page: `/public-pages/book?workspaceId=YOUR_ID`

3. **Access Dashboards:**
   - Owner Dashboard: `/dashboard`
   - Staff Dashboard: `/staff-dashboard`
   - Inbox: `/inbox`

---

## 🆘 Troubleshooting

### Backend won't start?
1. Check if PostgreSQL is running
2. Verify DATABASE_URL in `.env` file
3. Run `setup.bat` again

### Frontend shows errors?
1. Delete `.next` folder
2. Run `npm install` again
3. Restart with `npm run dev`

### Database connection failed?
1. Open `.env` file in `careops-backend`
2. Verify DATABASE_URL is correct
3. Test with: `npx prisma db pull`

---

## 📚 Full Documentation

- **README.md** - Complete feature list and usage guide
- **TROUBLESHOOTING.md** - Detailed issue resolution
- **TESTING.md** - Testing procedures

---

## 🔗 Quick Links

- Backend API: http://localhost:4000
- Frontend App: http://localhost:3000
- Onboarding: http://localhost:3000/onboarding
- Database GUI: Run `npx prisma studio` in backend folder

---

**Need help?** Check TROUBLESHOOTING.md for detailed solutions.
