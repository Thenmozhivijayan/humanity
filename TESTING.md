# ✅ CareOps Testing Checklist

## 🚀 Quick Start (First Time)

```bash
# 1. Run system check
check-system.bat

# 2. Setup database
cd careops-backend
npx prisma migrate dev --name init
npx prisma generate

# 3. Start everything
cd ..
start.bat
```

---

## 📋 Phase-by-Phase Testing

### ✅ PHASE 1: Database Schema

**What to check:**
- [ ] Database `careops` exists
- [ ] All tables created (Workspace, User, Booking, etc.)

**How to test:**
```bash
cd careops-backend
npx prisma studio
```
- Opens GUI at http://localhost:5555
- Should see 13 tables

**Expected result:** ✓ All tables visible in Prisma Studio

---

### ✅ PHASE 2: Onboarding Backend APIs

**What to check:**
- [ ] Create workspace
- [ ] Add integration
- [ ] Add service
- [ ] Add availability
- [ ] Activate workspace

**How to test:**
1. Visit: http://localhost:3000/onboarding
2. Complete all 5 steps
3. Check Prisma Studio - should see:
   - 1 Workspace (status: ACTIVE)
   - 1 Integration
   - 1 Service
   - 1+ Availability records

**Expected result:** ✓ Redirects to dashboard after activation

---

### ✅ PHASE 3: Public Customer Pages

**What to check:**
- [ ] Contact form works
- [ ] Booking page works
- [ ] Form submission works

**How to test:**

**Contact Form:**
1. Get workspace ID from browser console:
   ```javascript
   localStorage.getItem('workspaceId')
   ```
2. Visit: `http://localhost:3000/public-pages/contact?workspaceId=YOUR_ID`
3. Fill and submit form
4. Check Prisma Studio:
   - New Contact created
   - New Conversation created
   - 2 Messages (customer + system)

**Booking Page:**
1. Visit: `http://localhost:3000/public-pages/book?workspaceId=YOUR_ID`
2. Select service, date, time
3. Fill contact info
4. Submit
5. Check Prisma Studio:
   - New Booking created
   - New Conversation with confirmation
   - FormSubmissions created (if forms exist)

**Expected result:** ✓ "Thank You" / "Booking Confirmed" messages shown

---

### ✅ PHASE 4: Automation Engine

**What to check:**
- [ ] Cron jobs scheduled
- [ ] Event triggers work
- [ ] Manual triggers work

**How to test:**

**Check Logs:**
Backend terminal should show:
```
[AUTOMATION] Starting scheduled jobs...
[AUTOMATION] Jobs scheduled successfully
```

**Manual Trigger:**
```bash
# In new terminal
curl -X POST http://localhost:4000/automation/run/bookings
curl -X POST http://localhost:4000/automation/run/forms
curl -X POST http://localhost:4000/automation/run/inventory
```

Backend should log:
```
[CRON] Running booking reminders...
[AUTOMATION] Sent 0 booking reminders
```

**Expected result:** ✓ Automation logs appear in backend terminal

---

### ✅ PHASE 5: Integration Layer

**What to check:**
- [ ] Email integration configured
- [ ] Messages sent via email
- [ ] Integration logs working

**How to test:**

**Setup Email:**
1. During onboarding, configure Gmail:
   - Host: smtp.gmail.com
   - Port: 587
   - Email: your-email@gmail.com
   - Password: your-app-password
2. Click "Test Connection"

**Test Sending:**
1. Submit contact form
2. Check backend logs:
   ```
   [INTEGRATION] EMAIL to john@example.com: ✓
   ```
3. Check your email inbox for welcome message

**Expected result:** ✓ Email received in inbox

---

### ✅ PHASE 6: Staff Dashboard

**What to check:**
- [ ] Inbox shows conversations
- [ ] Can reply to messages
- [ ] Bookings page works
- [ ] Can update booking status
- [ ] Forms page works
- [ ] Can mark forms reviewed

**How to test:**

**Inbox:**
1. Visit: http://localhost:3000/inbox
2. Should see conversations from contact/booking
3. Click a conversation
4. Type reply and send
5. Check Prisma Studio:
   - New Message with sender: STAFF
   - Conversation.automated = false

**Bookings:**
1. Visit: http://localhost:3000/staff-bookings
2. Should see today's bookings
3. Click "Mark Completed"
4. Check Prisma Studio:
   - Booking.status = COMPLETED

**Forms:**
1. Visit: http://localhost:3000/staff-forms
2. Should see pending forms
3. Click "Mark Reviewed"
4. Check Prisma Studio:
   - FormSubmission.status = COMPLETED

**Expected result:** ✓ All staff operations work

---

### ✅ PHASE 7: Owner Dashboard & Inventory

**What to check:**
- [ ] Dashboard shows metrics
- [ ] Alerts appear
- [ ] Inventory tracking works
- [ ] Low stock alerts trigger

**How to test:**

**Dashboard:**
1. Visit: http://localhost:3000/dashboard
2. Should show:
   - Workspace name
   - Today's Bookings: 1+
   - Pending Forms: 0+
   - Unanswered Messages: 0+
   - Alerts section

**Inventory:**
1. Visit: http://localhost:3000/inventory
2. Add item:
   - Name: Gloves
   - Quantity: 100
   - Threshold: 20
   - Unit: pieces
3. Click "Use 1" button 81 times (to reach 19)
4. Check dashboard - should see alert:
   - Type: INVENTORY_LOW
   - Message: "Gloves is low (19 remaining)"

**Expected result:** ✓ Dashboard updates in real-time, alerts appear

---

## 🎯 Complete System Test (5 Minutes)

**Full workflow test:**

1. **Onboard** (2 min)
   - Create workspace
   - Setup email
   - Add service
   - Set availability
   - Activate

2. **Customer Books** (1 min)
   - Visit booking page
   - Make booking
   - Check email for confirmation

3. **Staff Manages** (1 min)
   - Open inbox
   - Reply to customer
   - Mark booking completed

4. **Owner Monitors** (1 min)
   - Check dashboard metrics
   - Add inventory item
   - Use inventory
   - See alert

**Expected result:** ✓ Complete flow works end-to-end

---

## 🐛 Common Issues

**Backend won't start:**
```bash
# Check port
netstat -ano | findstr :4000
# Kill if needed
taskkill /PID <PID> /F
```

**Database errors:**
```bash
# Reset and recreate
cd careops-backend
npx prisma migrate reset
npx prisma migrate dev
npx prisma generate
```

**Frontend errors:**
```bash
# Clear and reinstall
cd careops-frontend
rmdir /s /q node_modules
del package-lock.json
npm install
```

**Email not sending:**
- Check Gmail App Password (not regular password)
- Enable "Less secure app access" in Gmail
- Check backend logs for error messages

---

## 📊 Success Criteria

### All Phases Working:
- ✅ 13 database tables created
- ✅ Onboarding completes successfully
- ✅ Public pages accessible
- ✅ Automation logs showing
- ✅ Emails being sent
- ✅ Staff can manage operations
- ✅ Owner sees real-time data
- ✅ Alerts triggering correctly

### Performance:
- Backend responds < 500ms
- Frontend loads < 2s
- Database queries < 100ms

### Data Integrity:
- No orphaned records
- All relationships working
- Timestamps accurate

---

## 🎓 What Each Phase Does

| Phase | Purpose | Key Feature |
|-------|---------|-------------|
| 1 | Foundation | Database schema |
| 2 | Setup | Onboarding APIs |
| 3 | Customer | Public pages (no login) |
| 4 | Intelligence | Automation engine |
| 5 | Communication | Email/SMS sending |
| 6 | Operations | Staff daily work |
| 7 | Monitoring | Owner oversight |

---

**All phases complete = Fully functional CareOps platform! 🚀**
