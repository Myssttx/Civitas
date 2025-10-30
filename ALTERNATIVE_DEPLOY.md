# 🔄 Alternative Free Deployment Options

Since you've tried Vercel, here are other **100% FREE** options that work great:

---

## 🌟 Option 1: Netlify (Recommended Alternative)

**Why Netlify:**
- ✅ Same ease as Vercel
- ✅ Great Next.js support
- ✅ Free tier is very generous
- ✅ Auto-deploy from GitHub

### Quick Deploy:

1. **Sign up**: [netlify.com](https://netlify.com) → Use GitHub
2. **Import Project**: "Add new site" → "Import from Git"
3. **Select Repository**: Your `campus-resilience` repo
4. **Build Settings** (auto-detected):
   ```
   Build command: npm run build
   Publish directory: .next
   ```
5. **Environment Variables**: Add all your Supabase keys
6. **Deploy**: Click "Deploy site"

**Free Tier:**
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites
- ✅ Auto HTTPS

**Note:** For cron jobs, use [cron-job.org](https://cron-job.org) (free) to ping `/api/ingest/nws` every 5 minutes.

---

## 🌟 Option 2: Railway (Super Easy)

**Why Railway:**
- ✅ Easiest deployment
- ✅ Auto-detects everything
- ✅ Free $5 credit (lasts months)

### Quick Deploy:

1. **Sign up**: [railway.app](https://railway.app) → Use GitHub
2. **New Project** → "Deploy from GitHub"
3. **Select Repository**
4. **Add Environment Variables**
5. **Done!** Railway handles the rest

**Free Trial:**
- ✅ $5 credit (enough for months)
- ✅ Very easy setup
- ✅ No configuration needed

**After credit runs out:** Switch to Netlify (always free)

---

## 🌟 Option 3: Render (Free with Limits)

**Why Render:**
- ✅ Always free tier
- ✅ Easy setup
- ⚠️ Sleeps after 15 min (but free!)

### Quick Deploy:

1. **Sign up**: [render.com](https://render.com)
2. **New** → "Web Service"
3. **Connect GitHub**
4. **Settings:**
   ```
   Build Command: npm install && npm run build
   Start Command: npm start
   Environment: Node
   ```
5. **Environment Variables**: Add all
6. **Deploy**

**Free Tier:**
- ✅ Free web services
- ⚠️ Sleeps after 15 min (wakes on request)
- ⚠️ Slower first load after sleep

---

## 🌟 Option 4: Fly.io (Free Tier)

**Why Fly.io:**
- ✅ Good free tier
- ✅ Fast global network
- ✅ Docker support

### Quick Deploy:

```bash
# Install Fly CLI
npm install -g flyctl

# Sign up
flyctl auth signup

# In your project directory
flyctl launch

# Follow prompts
# Add environment variables via dashboard
```

**Free Tier:**
- ✅ 3 shared VMs
- ✅ 160GB data transfer/month
- ✅ Good performance

---

## 📊 Comparison

| Platform | Free Tier | Ease | Best For |
|----------|-----------|------|----------|
| **Netlify** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Most similar to Vercel |
| **Railway** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Easiest setup |
| **Render** | ⭐⭐⭐ | ⭐⭐⭐⭐ | Always free |
| **Fly.io** | ⭐⭐⭐⭐ | ⭐⭐⭐ | More control |

---

## 🎯 My Recommendation

**Try Netlify first** - It's the closest alternative to Vercel:

1. Same GitHub integration
2. Same ease of use
3. Great Next.js support
4. Generous free tier
5. Auto-deploy on push

**Setup takes 5 minutes!**

---

## 🔧 If You Had Vercel Issues

**Common problems and alternatives:**

- **Build failed?** → Test locally first (`npm run build`)
- **Env vars not working?** → Netlify has better env var UI
- **Database connection?** → Railway has built-in PostgreSQL option
- **Timeout issues?** → Fly.io has longer timeouts

---

## 🚀 Quick Netlify Deploy (Recommended)

Since you already have code on GitHub:

1. Go to [netlify.com](https://netlify.com)
2. "Add new site" → "Import from Git"
3. Connect GitHub → Select repo
4. Click "Deploy" (settings auto-detect)
5. Add environment variables
6. Done! ✅

**Takes 2 minutes!**

---

**Which one would you like to try? I can give you specific step-by-step instructions!**

