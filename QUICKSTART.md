# 🚀 CareOps - Quick Start Guide

## Prerequisites Check

1. **PostgreSQL** - Make sure it's running
   ```bash
   # Check if PostgreSQL is running
   psql --version
   ```

2. **Node.js** - Version 18+
   ```bash
   node --version
   ```

## Step-by-Step Setup

### 1️⃣ Setup Database

Open PostgreSQL and create database:
```bash
psql -U postgres
CREATE DATABASE careops;
\q
```

### 2️⃣ Setup Backend

```bash
# Navigate to backend
cd careops-backend

# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Start backend server
npm start
```

✅ Backend should be running on `http://localhost:4000`

### 3️⃣ Setup Frontend (New Terminal)

```bash
# Navigate to frontend
cd careops-frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

✅ Frontend should be running on `http://localhost:3000`

---

## 🧪 Testing Each Phase

### ✅ PHASE 1: Database Schema

Check if database is working:
```bash
cd careops-backend
npx prisma studio
```
This opens a GUI at `http://localhost:5555` to view your database.

---

### ✅ PHASE 2 & 7: Complete Onboarding Flow

**Test the 5-step onboarding:**

1. Open browser: `http://localhost:3000/onboarding`

2. **Step 1 - Create Workspace:**
   - Business Name: `Test Clinic`
   - Email: `test@clinic.com`
   - Address: `123 Main St`
   - Click "Next: Integrations →"

3. **Step 2 - Setup Integration:**
   - Select "Email"
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Email: `your-email@gmail.com`
   - Password: `your-app-password` (Get from Gmail settings)
   - Click "Test Connection" (optional)
   - Click "Next: Services →"

4. **Step 3 - Add Services:**
   - Service Name: `Consultation`
   - Duration: `30` minutes
   - Location: `Room 101`
   - Click "Add Service"
   - Click "Next: Availability →"

5. **Step 4 - Set Availability:**
   - Day: `Monday`
   - Start: `09:00`
   - End: `17:00`
   - Click "Add Slot"
   - Click "Complete Setup →"

6. **Step 5 - Activate:**
   - Click "Activate Workspace"
   - Should redirect to dashboard

✅ **Success:** You should see the Owner Dashboard with your workspace name!

---

### ✅ PHASE 3: Public Customer Pages

**Test Contact Form:**

1. Get your workspace ID:
   - Open browser console (F12)
   - Type: `localStorage.getItem('workspaceId')`
   - Copy the ID

2. Visit: `http://localhost:3000/public-pages/contact?workspaceId=YOUR_ID`

3. Fill form:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Phone: `1234567890`
   - Message: `I need help`
   - Click "Submit"

✅ **Success:** Should show "Thank You!" message

**Test Booking:**

1. Visit: `http://localhost:3000/public-pages/book?workspaceId=YOUR_ID`

2. Fill form:
   - Select service: `Consultation`
   - Name: `Jane Smith`
   - Email: `jane@example.com`
   - Phone: `9876543210`
   - Date: Tomorrow's date
   - Time: `10:00`
   - Click "Book Now"

✅ **Success:** Should show "Booking Confirmed!" message

---

### ✅ PHASE 4: Automation Engine

**Check if automation is running:**

1. Look at backend terminal - you should see:
   ```
   [AUTOMATION] Starting scheduled jobs...
   [AUTOMATION] Jobs scheduled successfully
   ```

**Test manual automation:**

Open a new terminal:
```bash
# Test booking reminders
curl -X POST http://localhost:4000/automation/run/bookings

# Test form reminders
curl -X POST http://localhost:4000/automation/run/forms

# Test inventory check
curl -X POST http://localhost:4000/automation/run/inventory
```

✅ **Success:** Backend terminal shows automation logs

---

### ✅ PHASE 5: Integration Layer

**Test Email Integration:**

If you configured email in onboarding:
- Submit a contact form
- Check your email inbox
- You should receive a welcome email

**Check integration logs:**

Backend terminal will show:
```
[INTEGRATION] EMAIL to john@example.com: ✓
```

---

### ✅ PHASE 6: Staff Dashboard

**Test Staff Inbox:**

1. Visit: `http://localhost:3000/inbox`

2. You should see conversations from:
   - Contact form submissions
   - Booking confirmations

3. Click on a conversation

4. Type a reply and click "Send Reply"

✅ **Success:** Message appears in conversation, automation pauses

**Test Staff Bookings:**

1. Visit: `http://localhost:3000/staff-bookings`

2. You should see the booking you created

3. Click "Mark Completed"

✅ **Success:** Status changes to "COMPLETED"

**Test Staff Forms:**

1. Visit: `http://localhost:3000/staff-forms`

2. Should show pending forms (if any)

3. Click "Mark Reviewed"

✅ **Success:** Form disappears from list

---

### ✅ PHASE 7: Owner Dashboard & Inventory

**Test Owner Dashboard:**

1. Visit: `http://localhost:3000/dashboard`

2. Should show:
   - Today's Bookings: `1` (or more)
   - Pending Forms: `0` (or more)
   - Unanswered Messages: `0` (or more)
   - Alerts section

✅ **Success:** Dashboard shows real-time metrics

**Test Inventory:**

1. Visit: `http://localhost:3000/inventory`

2. Add an item:
   - Name: `Gloves`
   - Quantity: `100`
   - Threshold: `20`
   - Unit: `pieces`
   - Click "Add Item"

3. Click "Use 1" multiple times

4. When quantity drops below 20:
   - Alert should appear on dashboard
   - Item should have red border

✅ **Success:** Inventory tracking works with alerts

---

## 🎯 Complete Test Checklist

- [ ] Database created and migrations run
- [ ] Backend running on port 4000
- [ ] Frontend running on port 3000
- [ ] Completed 5-step onboarding
- [ ] Created a booking via public page
- [ ] Submitted contact form
- [ ] Viewed inbox and replied to message
- [ ] Managed bookings (mark completed)
- [ ] Added inventory item
- [ ] Saw alerts on dashboard
- [ ] Automation logs showing in backend

---

## 🐛 Troubleshooting

**Backend won't start:**
```bash
# Check if port 4000 is in use
netstat -ano | findstr :4000

# Kill the process if needed
taskkill /PID <PID> /F
```

**Database connection error:**
```bash
# Check PostgreSQL is running
# Update .env with correct credentials
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/careops"
```

**Frontend won't start:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Prisma errors:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Then regenerate
npx prisma generate
```

---

## 📊 View Database Data

**Option 1: Prisma Studio (GUI)**
```bash
cd careops-backend
npx prisma studio
```
Opens at `http://localhost:5555`

**Option 2: PostgreSQL CLI**
```bash
psql -U postgres -d careops
SELECT * FROM "Workspace";
SELECT * FROM "Booking";
\q
```

---

## 🎥 Quick Demo Flow

1. **Onboard** → Create workspace with email integration
2. **Book** → Use public booking page
3. **Check Inbox** → See booking confirmation
4. **Reply** → Send message to customer
5. **Dashboard** → View metrics and alerts
6. **Inventory** → Add item and use it
7. **Alert** → See low inventory alert

**Total time: ~5 minutes**

---

## 📞 Need Help?

- Check backend terminal for error logs
- Check browser console (F12) for frontend errors
- Verify PostgreSQL is running
- Ensure ports 3000 and 4000 are available

---

**You're all set! 🚀**
