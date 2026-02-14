# 🚀 CareOps - Unified Operations Platform

A complete operations platform for service-based businesses that replaces disconnected tools with one unified system.

## 📋 Features

### ✅ Completed (Phases 1-8)

1. **Complete Database Schema** - All models for workspace, users, bookings, forms, inventory, integrations
2. **Onboarding Flow** - Multi-step workspace setup (workspace → integrations → services → availability → activate)
3. **Public Customer Pages** - Contact form, booking page, form submission (no login required)
4. **Automation Engine** - Event-based automation with scheduled jobs (reminders, alerts)
5. **Integration Layer** - Email (Nodemailer) and SMS (Twilio) with real message sending
6. **Staff Dashboard** - Inbox, bookings management, forms review
7. **Owner Dashboard** - Real-time metrics, alerts, inventory tracking
8. **Customer Accounts** - Registration, login, dashboard, booking history

## 🛠️ Tech Stack

- **Frontend**: Next.js, TypeScript, React
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Prisma ORM
- **Integrations**: Nodemailer (Email), Twilio (SMS)
- **Automation**: node-cron

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Backend Setup

```bash
cd careops-backend
npm install
```

Configure `.env`:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/careops"
```

Run migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

Start server:
```bash
npm start
```

Backend runs on `http://localhost:4000`

### Frontend Setup

```bash
cd careops-frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## 🎯 Usage Flow

### 1. Onboarding (Owner)

1. Visit `http://localhost:3000/onboarding`
2. **Step 1**: Create workspace (name, email, address)
3. **Step 2**: Setup integration (Email or SMS)
4. **Step 3**: Add services (name, duration, location)
5. **Step 4**: Set availability (days and time slots)
6. **Step 5**: Activate workspace

### 2. Customer Flow (With or Without Login)

**Customer Registration (Optional):**
- Visit `/customer-register`
- Create account with email/password
- Login at `/customer-login`
- View bookings at `/customer-dashboard`

**Contact Form:**
- Visit `/public-pages/contact?workspaceId=YOUR_ID`
- Submit inquiry
- Receives welcome email automatically

**Booking:**
- Visit `/public-pages/book?workspaceId=YOUR_ID`
- Login prompt shown (optional)
- Select service, date, time
- Enter contact info (auto-filled if logged in)
- Receives confirmation email + forms

**Form Submission:**
- Receive form link via email
- Visit `/public-pages/form?submissionId=SUBMISSION_ID`
- Complete and submit

### 3. Staff Daily Operations

**Dashboard:** `/staff-dashboard`
- Access inbox, bookings, forms

**Inbox:** `/inbox`
- View all conversations
- Reply to customers (pauses automation)

**Bookings:** `/staff-bookings`
- View today's appointments
- Mark as completed or no-show

**Forms:** `/staff-forms`
- Review pending submissions
- Mark as reviewed

### 4. Owner Monitoring

**Dashboard:** `/dashboard`
- Today's bookings count
- Pending forms count
- Unanswered messages count
- Active alerts with links

**Inventory:** `/inventory`
- Add items with thresholds
- Track usage
- Auto-alerts when low

**Services:** `/services`
- View all services and availability

## 🤖 Automation

### Event-Based Triggers

- `CONTACT_CREATED` → Welcome email sent
- `BOOKING_CREATED` → Confirmation email + forms sent
- `FORM_PENDING` → Reminder after 3 days
- `INVENTORY_LOW` → Alert created
- `STAFF_REPLY` → Automation paused

### Scheduled Jobs

- **9 AM daily** → Booking reminders (24h before)
- **10 AM daily** → Form reminders (>3 days pending)
- **Every 6 hours** → Inventory level checks

## 🔌 Integration Setup

### Email (Gmail Example)

1. Enable 2FA on Gmail
2. Generate App Password
3. In onboarding:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Email: `your-email@gmail.com`
   - Password: App Password

### SMS (Twilio)

1. Sign up at twilio.com
2. Get Account SID, Auth Token, Phone Number
3. In onboarding:
   - Account SID: From dashboard
   - Auth Token: From dashboard
   - From: Your Twilio number

## 📊 Database Models

- **Workspace** - Business configuration
- **User** - Owner and staff accounts
- **Customer** - Customer accounts (NEW)
- **Integration** - Email/SMS configs
- **Contact** - Customer information (linked to Customer)
- **Conversation** - Message threads
- **Message** - Individual messages
- **Service** - Offered services
- **Availability** - Time slots
- **Booking** - Appointments
- **Form** - Form templates
- **FormSubmission** - Completed forms
- **Inventory** - Stock tracking
- **Alert** - System alerts
- **AutomationRule** - Automation config

## 🧪 Testing

### Manual Automation Triggers

```bash
# Test booking reminders
POST http://localhost:4000/automation/run/bookings

# Test form reminders
POST http://localhost:4000/automation/run/forms

# Test inventory check
POST http://localhost:4000/automation/run/inventory
```

## 🚧 Remaining Work

### Phase 8: Authentication & Permissions (PARTIALLY COMPLETE)
- ✅ Customer accounts with registration/login
- ✅ Password hashing with bcryptjs
- ⏳ JWT-based auth tokens
- ⏳ Role-based access control middleware
- ⏳ Protected routes

### Phase 9: Calendar Integration
- Google Calendar sync
- Outlook Calendar sync
- Calendar invites

### Phase 10: Polish & Production
- Error handling
- Loading states
- Responsive design
- Email templates (HTML)
- Deployment setup

## 📝 API Endpoints

### Public
- POST `/public/contact` - Submit contact form
- GET `/public/:workspaceId/services` - List services
- POST `/public/booking` - Create booking (now supports customerId)
- POST `/public/form/:submissionId/submit` - Submit form

### Customer (NEW)
- POST `/auth/customer/register` - Register customer
- POST `/auth/customer/login` - Login customer
- GET `/customer/:customerId/bookings` - Get customer bookings

### Staff
- GET `/inbox` - Get conversations
- POST `/inbox/:id/reply` - Reply to customer
- GET `/staff/bookings` - Get bookings
- PATCH `/staff/booking/:id` - Update booking status
- GET `/staff/forms` - Get pending forms
- PATCH `/staff/form/:id` - Mark form reviewed

### Owner
- GET `/dashboard` - Dashboard summary
- GET `/bookings` - All bookings
- GET `/workspace/:id/inventory` - Get inventory
- PATCH `/inventory/:id/use` - Use inventory

### Onboarding
- POST `/workspace` - Create workspace
- POST `/workspace/:id/integrations` - Add integration
- POST `/workspace/:id/services` - Add service
- POST `/services/:id/availability` - Add availability
- POST `/workspace/:id/activate` - Activate workspace

## 🎓 Key Concepts

**Customer Accounts (Optional)**: Customers can register for accounts to track bookings, or book as guests.

**Automation Pausing**: When staff replies, automation stops for that conversation.

**Alert System**: Alerts link directly to where action is needed.

**Inventory Tracking**: Automatic alerts when stock drops below threshold.

**Event-Driven**: All automation triggered by specific events.

## 📚 Additional Documentation

- **CUSTOMER-ACCOUNTS-GUIDE.md** - Complete customer accounts implementation guide
- **CUSTOMER-ACCOUNTS-QUICKSTART.md** - Quick reference for customer features
- Run `setup-customer-accounts.bat` to migrate database for customer accounts

## 📞 Support

For issues or questions, refer to the Loom video for detailed walkthrough.

---

Built for CareOps Hackathon 🚀
