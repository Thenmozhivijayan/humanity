# 🚀 Vercel Deployment Guide

## Prerequisites
- Vercel account (sign up at vercel.com)
- GitHub/GitLab/Bitbucket account
- PostgreSQL database (use Vercel Postgres or external like Supabase/Neon)

## Step 1: Setup Database

### Option A: Vercel Postgres (Recommended)
1. Go to vercel.com → Storage → Create Database → Postgres
2. Copy the `DATABASE_URL` connection string

### Option B: External Database (Supabase/Neon)
1. Sign up at supabase.com or neon.tech
2. Create new project
3. Copy the connection string

## Step 2: Deploy Backend

### Via Vercel CLI
```bash
cd careops-backend
npm i -g vercel
vercel login
vercel
```

### Via Vercel Dashboard
1. Go to vercel.com/new
2. Import `careops-backend` folder
3. Configure:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. Add Environment Variables:
   ```
   DATABASE_URL=your_postgres_connection_string
   NODE_ENV=production
   ```

5. Deploy

6. Copy your backend URL (e.g., `https://careops-backend.vercel.app`)

## Step 3: Deploy Frontend

1. Update `careops-frontend/.env.production`:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
   ```

### Via Vercel Dashboard
1. Go to vercel.com/new
2. Import `careops-frontend` folder
3. Configure:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
   ```

5. Deploy

## Step 4: Run Database Migrations

After backend is deployed:

```bash
cd careops-backend
npx prisma migrate deploy
```

Or use Vercel CLI:
```bash
vercel env pull
npx prisma migrate deploy
```

## Step 5: Test

1. Visit your frontend URL: `https://your-frontend.vercel.app`
2. Test onboarding flow
3. Test public pages

## Environment Variables Checklist

### Backend (.env)
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Set to "production"

### Frontend (.env.production)
- `NEXT_PUBLIC_API_URL` - Your backend Vercel URL

## Troubleshooting

### Backend Issues
- Check Vercel logs: `vercel logs`
- Ensure Prisma is generated: Add to build script
- Check database connection string

### Frontend Issues
- Ensure API URL is correct
- Check CORS settings in backend
- Verify environment variables are set

### Database Issues
- Run migrations: `npx prisma migrate deploy`
- Check connection string format
- Ensure database is accessible from Vercel

## Custom Domains (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Continuous Deployment

Once connected to Git:
- Push to main branch → Auto-deploys
- Pull requests → Preview deployments

## Cost

- Vercel: Free tier includes hobby projects
- Database: Vercel Postgres free tier or external provider pricing

---

✅ Your CareOps platform is now live!
