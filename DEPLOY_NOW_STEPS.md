# 🚀 Deploy Right Now - Step by Step

## Step 1: Push Code to GitHub

```bash
cd "/Users/aayushpal/Downloads/Congressional App Challenge"
git add .
git commit -m "Add all features - Community, Tasks, Bulletins, Navigation"
git push origin main
```

## Step 2: Deploy on Vercel

1. **Go to:** https://vercel.com
2. **Sign in** with GitHub (or create account)
3. **Click:** "Add New Project"
4. **Import:** Select your `Civitas` repository
5. **Framework:** Next.js (auto-detected)

## Step 3: Add Environment Variables

**Before clicking "Deploy", click "Environment Variables" and add:**

```
DATABASE_URL=your-supabase-database-url
DIRECT_URL=your-supabase-direct-url
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=(leave empty, Vercel will set it)
NODE_ENV=production
NWS_AREA=TX
```

**Get these from:** Supabase Dashboard → Settings → Database & API

## Step 4: Deploy

Click **"Deploy"** and wait 2-3 minutes.

## Step 5: Set Up Database

After deployment, create database tables:

**Option A: Via Supabase SQL Editor** (easiest)
1. Go to Supabase Dashboard
2. SQL Editor
3. Run Prisma migrations or create tables manually

**Option B: Via local terminal**
```bash
DATABASE_URL=your-production-url npm run db:push
DATABASE_URL=your-production-url npm run db:seed
```

## ✅ Done!

Your app is live at: `https://civitas-xxx.vercel.app`

---

## 🆘 Don't Have Supabase Yet?

1. Go to https://supabase.com
2. Create account (free)
3. New project
4. Wait 2 minutes
5. Get credentials
6. Add to Vercel

---

**Total time: ~10 minutes!**

