# 🚀 Deploy with Supabase - Complete Guide

Since you're using Supabase, here's exactly how to get everything set up and deploy.

---

## Step 1: Get Your Supabase Credentials

### A. Go to Supabase Dashboard

1. Go to **https://supabase.com**
2. Sign in (or create account - free)
3. Select your project (or create new one)

### B. Get Database URL

1. Click **Settings** (gear icon, bottom left)
2. Click **Database**
3. Scroll to **Connection String**
4. Copy the **"URI"** connection string
   - Format: `postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
   - This is your `DATABASE_URL`

5. Copy the **"Direct connection"** string
   - Format: `postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres`
   - This is your `DIRECT_URL`

### C. Get API Keys

1. Still in **Settings**
2. Click **API**
3. Copy these:

   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
     - Format: `https://xxxxx.supabase.co`
   
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ (Keep secret!)
     - Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## Step 2: Set Up Database

### Run Migrations on Supabase

You need to create the database tables. Do this:

**Option A: From Local Machine** (if you have Node.js)
```bash
# Point to your Supabase database
DATABASE_URL=your-supabase-url npm run db:push
DATABASE_URL=your-supabase-url npm run db:seed
```

**Option B: From Supabase SQL Editor**
1. Go to Supabase Dashboard
2. Click **SQL Editor**
3. Copy the SQL from Prisma migrations (or use Supabase migrations)
4. Run the SQL

**Option C: Use Prisma Studio (via Supabase connection)**
- Connect Prisma Studio to your Supabase database
- Manually create tables (not recommended but works)

---

## Step 3: Deploy to Vercel with Supabase

### A. Push Code to GitHub

```bash
git add .
git commit -m "Configure for Supabase deployment"
git push origin main
```

### B. Deploy on Vercel

1. Go to **https://vercel.com**
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Select your **Civitas** repository
5. Click **"Import"**

### C. Add Environment Variables

Before clicking "Deploy", click **"Environment Variables"** and add:

```env
# Database (from Supabase Settings → Database)
DATABASE_URL=postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres

# Supabase API (from Supabase Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production

# NWS API
NWS_API_BASE=https://api.weather.gov
NWS_AREA=TX

# Push Notifications (optional for now)
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:admin@campus.edu

# Campus Location
NEXT_PUBLIC_CAMPUS_CENTER_LAT=33.2075
NEXT_PUBLIC_CAMPUS_CENTER_LNG=-97.1526
```

**Important:**
- Replace `xxx` with your actual Supabase project reference
- Replace `password` with your actual database password
- Copy exact values from Supabase dashboard

### D. Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your app is live! 🎉

---

## Step 4: Configure Supabase for Production

### A. Update Allowed URLs

1. Go to Supabase Dashboard
2. **Settings** → **API**
3. Scroll to **Allowed URLs**
4. Add your Vercel URL: `https://your-app.vercel.app`
5. Save

### B. Set Up Authentication (If Using)

1. **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates if needed
4. Add redirect URLs:
   - `https://your-app.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for local dev)

---

## Step 5: Test Your Deployment

### After Deployment:

1. Visit your Vercel URL
2. Check if the app loads
3. Test authentication (if configured)
4. Verify API routes work
5. Check database connections

### Common Issues:

**"Database connection failed"**
- Verify `DATABASE_URL` is correct
- Check password is right
- Ensure Supabase project is active

**"Supabase client not configured"**
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Verify they match your Supabase dashboard

**"RLS policy violation"**
- Set up Row Level Security policies in Supabase
- Or temporarily disable RLS for testing (not recommended for production)

---

## Step 6: Set Up Database Tables

After first deploy, you need to create tables:

### Option A: Via Vercel CLI (If Installed)

```bash
# Install Vercel CLI
npm install -g vercel

# Link project
vercel link

# Pull environment variables
vercel env pull .env.production

# Run migrations
npm run db:push
```

### Option B: Direct Connection

```bash
# Use your production DATABASE_URL
DATABASE_URL="your-production-database-url" npm run db:push
DATABASE_URL="your-production-database-url" npm run db:seed
```

### Option C: Supabase SQL Editor

1. Go to Supabase Dashboard
2. **SQL Editor**
3. Run Prisma-generated SQL or use migrations

---

## ✅ Complete Checklist

- [ ] Supabase project created
- [ ] Database URL copied
- [ ] API keys copied
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Deployed
- [ ] Database tables created
- [ ] Supabase allowed URLs configured
- [ ] Tested app works

---

## 🔐 Security Notes

1. **Never commit** `.env` file
2. **Keep `SUPABASE_SERVICE_ROLE_KEY` secret** - only use in server-side code
3. **Use RLS policies** in Supabase for data security
4. **Rotate keys** if they're ever exposed

---

## 🚀 After Deployment

Your app is now:
- ✅ Hosted on Vercel (global CDN)
- ✅ Connected to Supabase database
- ✅ Using Supabase authentication
- ✅ Auto-deploying on every Git push

**App URL:** `https://your-app.vercel.app`

**Database:** Managed by Supabase (free tier: 500MB)

---

## 📞 Need Help?

**If Supabase project doesn't exist:**
1. Go to supabase.com
2. Create new project
3. Wait 2 minutes for setup
4. Get credentials
5. Follow steps above

**If tables aren't created:**
- Use `npm run db:push` pointing to Supabase URL
- Or manually create in Supabase SQL Editor

**Everything is already configured in your code - just add the credentials!** 🎉

