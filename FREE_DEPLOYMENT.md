# 🆓 Free Deployment Guide - Campus Resilience

Deploy your app completely **FREE** using these services (all have generous free tiers).

---

## ✅ Option 1: Vercel (Recommended - 100% Free)

**Free Tier Includes:**
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Custom domains (free)
- ✅ Serverless functions
- ✅ Cron jobs
- ✅ Edge network (global CDN)
- ✅ 100GB bandwidth/month

**Perfect for:** Production-ready deployment

### Step-by-Step (5 minutes):

#### 1. Push to GitHub (Free)

```bash
# If not already done:
git add .
git commit -m "Ready for deployment"
git push origin main
```

If you don't have GitHub:
1. Go to [github.com](https://github.com) → Sign up (free)
2. Create new repository: "campus-resilience"
3. Push your code

#### 2. Deploy to Vercel (Free)

1. **Sign up**: Go to [vercel.com](https://vercel.com)
   - Click "Sign Up" → Use GitHub (fastest)
   - Authorize Vercel to access your repos

2. **Import Project**:
   - Click "Add New" → "Project"
   - Select your `campus-resilience` repository
   - Vercel auto-detects Next.js ✅

3. **Add Environment Variables**:
   - Before clicking "Deploy", click "Environment Variables"
   - Add these from your Supabase project:
   
   ```
   DATABASE_URL
   DIRECT_URL
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   VAPID_PUBLIC_KEY
   VAPID_PRIVATE_KEY
   VAPID_SUBJECT
   NWS_AREA
   NEXT_PUBLIC_APP_URL (leave empty, Vercel will set it)
   NODE_ENV=production
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

5. **Your URL**: `https://campus-resilience-xxx.vercel.app`

#### 3. Set Up Database (Free with Supabase)

After deployment:

```bash
# Option A: Run migrations locally pointing to production DB
DATABASE_URL=your-supabase-url npm run db:push
DATABASE_URL=your-supabase-url npm run db:seed

# Option B: Use Vercel CLI
npm install -g vercel
vercel link
vercel env pull .env.production
npm run db:push
```

**Cost: $0** - Everything free!

---

## ✅ Option 2: Netlify (Free)

**Free Tier Includes:**
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic HTTPS
- ✅ Form handling

### Deploy:

1. Go to [netlify.com](https://netlify.com) → Sign up (free)
2. "Add new site" → "Import from Git"
3. Connect GitHub → Select repo
4. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Add environment variables (same as Vercel)
6. Deploy!

**Note:** Netlify doesn't have built-in cron jobs, but you can use:
- [cron-job.org](https://cron-job.org) (free) to ping your `/api/ingest/nws` endpoint

**Cost: $0**

---

## ✅ Option 3: Railway (Free Trial)

**Free Trial:**
- ✅ $5 credit free
- ✅ Enough for small apps
- ✅ Easy deployment

### Deploy:

1. Go to [railway.app](https://railway.app) → Sign up
2. "New Project" → "Deploy from GitHub"
3. Select repository
4. Add environment variables
5. Deploy!

**After free trial:** Switch to Vercel (always free) or pay ~$5/month

---

## ✅ Option 4: Render (Free Tier)

**Free Tier:**
- ✅ Free web services (with limitations)
- ✅ Sleeps after 15 min inactivity (wakes on request)

### Deploy:

1. Go to [render.com](https://render.com) → Sign up
2. "New" → "Web Service"
3. Connect GitHub repo
4. Build command: `npm install && npm run build`
5. Start command: `npm start`
6. Add environment variables
7. Deploy!

**Cost: $0** (with limitations)

---

## 🗄️ Database: Supabase (Free Tier)

**Free Tier Includes:**
- ✅ 500MB database
- ✅ 2GB file storage
- ✅ 50,000 monthly active users
- ✅ 2GB bandwidth

**Perfect for:** Your app needs!

### Set Up:

1. Go to [supabase.com](https://supabase.com)
2. Create new project (free)
3. Get credentials from Settings
4. Use those in your environment variables

**Cost: $0** - More than enough for your app!

---

## 📊 Free Tier Limits Summary

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Vercel** | ✅ Unlimited | 100GB bandwidth, 100 serverless functions |
| **Netlify** | ✅ Generous | 100GB bandwidth, 300 build minutes |
| **Supabase** | ✅ Very generous | 500MB DB, 50K users/month |
| **GitHub** | ✅ Unlimited | Public repos unlimited |

**Total Cost: $0/month** 💰

---

## 🚀 Recommended: Vercel + Supabase (100% Free)

**Why Vercel:**
- ✅ Best Next.js support
- ✅ Zero configuration
- ✅ Auto-deploy on Git push
- ✅ Free SSL certificates
- ✅ Global CDN
- ✅ Built-in cron jobs

**Setup Time: 5 minutes**

1. Push code to GitHub (free)
2. Deploy to Vercel (free)
3. Use Supabase for database (free)
4. Done!

---

## 📝 Quick Deploy Checklist

- [ ] GitHub account (free)
- [ ] Supabase account (free)
- [ ] Vercel account (free)
- [ ] Push code to GitHub
- [ ] Deploy to Vercel
- [ ] Add environment variables
- [ ] Run database migrations
- [ ] Test your app!

**Total setup time: ~10 minutes**

---

## 🆘 Need Help?

1. **Vercel Issues**: Check [vercel.com/docs](https://vercel.com/docs)
2. **Supabase Issues**: Check [supabase.com/docs](https://supabase.com/docs)
3. **See**: `QUICK_DEPLOY.md` for step-by-step

---

## 💡 Pro Tips

1. **Use Vercel** - It's the easiest and most reliable free option
2. **Keep Supabase free** - 500MB is plenty for your app
3. **Monitor usage** - Vercel shows you bandwidth usage (you likely won't hit limits)
4. **Custom domain** - Add your own domain for free on Vercel

---

## ✅ You're All Set!

Your app will be:
- ✅ Fully functional
- ✅ Production-ready
- ✅ HTTPS enabled
- ✅ Free forever (within limits)
- ✅ Auto-updating on Git push

**Start with Vercel + Supabase - both free and perfect for your needs!** 🎉

