# 🔐 CareOps Authentication System

## ✅ What Changed

### Before:
- ❌ No authentication
- ❌ workspaceId in localStorage
- ❌ workspaceId in every URL
- ❌ Manual copy-paste needed

### After:
- ✅ Email/Password authentication
- ✅ Auto-linked workspace
- ✅ Clean URLs (no workspaceId needed)
- ✅ Protected routes
- ✅ Role-based access (Owner/Staff)

---

## 🚀 Installation

Run the installation script:
```bash
install-auth.bat
```

This will install:
- Backend: `bcryptjs` (password hashing)
- Frontend: No new dependencies needed

---

## 📋 New User Flows

### 1. Owner Registration Flow
```
Visit http://localhost:3000
  ↓
Click "Register as Owner"
  ↓
Fill form:
  - Your Name
  - Email
  - Password
  - Business Name
  - Business Address
  ↓
Auto-creates:
  - User account (OWNER role)
  - Workspace
  - Links user to workspace
  ↓
Redirects to /onboarding
  ↓
Setup integrations, services, etc.
  ↓
Access Owner Dashboard
```

### 2. Staff Login Flow
```
Visit http://localhost:3000
  ↓
Click "Login"
  ↓
Enter email & password
  ↓
Redirects to Staff Dashboard
```

### 3. Owner Login Flow
```
Visit http://localhost:3000
  ↓
Click "Login"
  ↓
Enter email & password
  ↓
Redirects to Owner Dashboard
```

---

## 🔌 API Endpoints

### Authentication

**Register (Owner)**
```
POST /auth/register
Body: {
  name: string,
  email: string,
  password: string,
  workspaceName: string,
  address: string,
  timezone: string
}
Response: {
  success: true,
  user: { id, email, role },
  workspace: { id, name }
}
```

**Login (Owner/Staff)**
```
POST /auth/login
Body: {
  email: string,
  password: string
}
Response: {
  success: true,
  user: {
    id, email, role,
    workspaceId, workspaceName
  }
}
```

---

## 🎯 How It Works

### Backend
1. **Registration**: 
   - Hashes password with bcrypt
   - Creates workspace
   - Creates owner user linked to workspace
   - Returns user + workspace info

2. **Login**:
   - Finds user by email
   - Verifies password with bcrypt
   - Returns user info with workspaceId

### Frontend
1. **AuthContext**:
   - Stores user in state
   - Saves to localStorage for persistence
   - Provides login/register/logout functions

2. **Protected Routes**:
   - Check if user exists
   - Redirect to /login if not authenticated
   - Role-based redirects (Owner → dashboard, Staff → staff-dashboard)

3. **Auto workspaceId**:
   - No more manual copy-paste
   - workspaceId comes from user object
   - Automatically included in API calls

---

## 📱 Pages Overview

### Public Pages (No Auth)
- `/` - Landing page with Login/Register buttons
- `/login` - Login form
- `/register` - Owner registration form
- `/public-pages/*` - Customer booking/contact (no auth needed)

### Protected Pages (Auth Required)
- `/dashboard` - Owner dashboard (OWNER only)
- `/staff-dashboard` - Staff dashboard (STAFF only)
- `/onboarding` - Setup wizard (after registration)
- `/inbox` - Messages
- `/staff-bookings` - Bookings management
- `/staff-forms` - Forms review
- `/services` - Services management
- `/inventory` - Inventory tracking
- `/integrations` - Integration setup

---

## 🔒 Security Features

1. **Password Hashing**: bcrypt with salt rounds = 10
2. **Client-side Storage**: localStorage (user info only, no sensitive data)
3. **Protected Routes**: Automatic redirect if not authenticated
4. **Role-based Access**: Owner vs Staff permissions

---

## 🧪 Testing

### Test Owner Registration
1. Visit http://localhost:3000
2. Click "Register as Owner"
3. Fill form:
   - Name: John Doe
   - Email: owner@test.com
   - Password: password123
   - Business: Test Clinic
   - Address: 123 Main St
4. Should redirect to /onboarding
5. Complete setup wizard
6. Access dashboard

### Test Staff Login
1. First, create a staff user via backend or database
2. Visit http://localhost:3000
3. Click "Login"
4. Enter staff credentials
5. Should redirect to /staff-dashboard

### Test Logout
1. Click "Logout" button in dashboard
2. Should redirect to home page
3. Try accessing /dashboard - should redirect to /login

---

## 🐛 Troubleshooting

### "Email already registered"
- Email is already in database
- Use different email or login instead

### Redirects to login immediately
- User not authenticated
- Check localStorage for 'user' key
- Try logging in again

### workspaceId undefined
- User object doesn't have workspaceId
- Check database - user should have workspaceId field
- Re-register or update database

### Password doesn't work
- Make sure password is at least 6 characters
- Check for typos
- Password is case-sensitive

---

## 📊 Database Changes

No schema changes needed! The existing User model already has:
- `email` (unique)
- `password` (will store hashed password)
- `role` (OWNER or STAFF)
- `workspaceId` (links to workspace)

---

## 🚀 Deployment Notes

### Environment Variables
Backend `.env`:
```
DATABASE_URL=your-postgres-url
NODE_ENV=production
```

### Security Recommendations for Production
1. Use HTTPS only
2. Add rate limiting to auth endpoints
3. Implement JWT tokens instead of localStorage
4. Add email verification
5. Add password reset functionality
6. Use secure session cookies

---

## ✅ Next Steps

After authentication is working:
1. Add "Forgot Password" feature
2. Add email verification
3. Add staff invitation system
4. Add 2FA (optional)
5. Deploy to production

---

**Status**: ✅ Authentication system implemented and ready to test!
