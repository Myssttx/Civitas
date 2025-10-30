# ⚡ Quick Deploy - Campus Resilience

## Fastest Way to Deploy (5 minutes)

### Prerequisites
- GitHub account
- Supabase account (free tier works)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/campus-resilience.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Sign Up" → Use GitHub
3. "Add New Project"
4. Import your repository
5. **Add Environment Variables** (see below)
6. Click "Deploy"

### Step 3: Environment Variables

In Vercel, add these (get from Supabase):

```env
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
VAPID_PUBLIC_KEY=your-vapid-key
VAPID_PRIVATE_KEY=your-vapid-key
VAPID_SUBJECT=mailto:admin@campus.edu
NWS_AREA=TX
```

### Step 4: Set Up Database

After first deploy, run locally:

```bash
# Get production env vars
vercel env pull .env.production

# Push schema
npm run db:push

# Seed data
npm run db:seed
```

Or use production DATABASE_URL directly:
```bash
DATABASE_URL=your-prod-url npm run db:push
DATABASE_URL=your-prod-url npm run db:seed
```

### Step 5: Done! 🎉

Your app is live at: `https://your-app.vercel.app`

---

## Alternative: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Click button above
2. Connect GitHub
3. Select repository
4. Add environment variables
5. Deploy!

---

## Need Help?

See `DEPLOYMENT_COMPLETE.md` for detailed instructions.

