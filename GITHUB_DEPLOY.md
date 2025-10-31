# 🚀 Deploy from GitHub - Complete Guide

Deploy your app directly from GitHub using GitHub Pages or GitHub Actions.

---

## ✅ Option 1: GitHub Pages (Static Site)

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Ready for GitHub Pages"
git push origin main
```

### Step 2: Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** tab
3. Scroll to **Pages** (left sidebar)
4. Under **Source**, select: **GitHub Actions**
5. Save

### Step 3: GitHub Will Auto-Deploy

The workflow I created (`.github/workflows/deploy.yml`) will automatically:
- Build your app
- Deploy to GitHub Pages

**Your app will be at:** `https://YOUR_USERNAME.github.io/REPO_NAME`

---

## ✅ Option 2: Vercel from GitHub (Recommended)

**This is the EASIEST and BEST option!**

### Step 1: Make Sure Code is on GitHub

```bash
# Push if not already:
git push origin main
```

### Step 2: Connect to Vercel (Via GitHub)

1. Go to **https://vercel.com**
2. Click **"Sign Up"** → **Use GitHub**
3. Authorize Vercel to access your repos
4. Click **"Add New Project"**
5. **Select your repository**
6. Click **"Import"**

### Step 3: Configure (Vercel Auto-Detects)

- Framework: **Next.js** (auto-detected ✅)
- Build Command: `npm run build` (auto)
- Output Directory: `.next` (auto)

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

```
DATABASE_URL=your-supabase-url
DIRECT_URL=your-supabase-direct-url
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
VAPID_PUBLIC_KEY=your-vapid-key
VAPID_PRIVATE_KEY=your-vapid-key
VAPID_SUBJECT=mailto:admin@campus.edu
NWS_AREA=TX
NODE_ENV=production
```

### Step 5: Deploy

Click **"Deploy"**

**Done!** Your app is live at: `https://your-project.vercel.app`

**Auto-deploys:** Every time you push to GitHub, Vercel automatically deploys!

---

## ✅ Option 3: Netlify from GitHub

### Step 1: Push Code to GitHub

```bash
git push origin main
```

### Step 2: Connect to Netlify

1. Go to **https://netlify.com**
2. Click **"Sign up"** → **Use GitHub**
3. Click **"Add new site"** → **"Import from Git"**
4. Select your repository

### Step 3: Configure

- Build command: `npm run build`
- Publish directory: `.next`
- Add environment variables (same as Vercel)

### Step 4: Deploy

Click **"Deploy site"**

**Done!** Your app is live at: `https://your-project.netlify.app`

---

## ✅ Option 4: Railway from GitHub

### Step 1: Push Code to GitHub

```bash
git push origin main
```

### Step 2: Connect to Railway

1. Go to **https://railway.app**
2. Click **"Login"** → **Use GitHub**
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your repository

### Step 3: Railway Auto-Detects Everything

Railway automatically:
- Detects Next.js
- Sets up build
- You just add environment variables

### Step 4: Add Environment Variables

Click **"Variables"** tab and add all your Supabase keys.

### Step 5: Deploy

Railway automatically deploys when you connect!

**Done!** Your app is live at: `https://your-project.railway.app`

---

## 📊 Comparison

| Platform | Ease | Auto-Deploy | Free Tier |
|----------|------|-------------|-----------|
| **Vercel** | ⭐⭐⭐⭐⭐ | ✅ Yes | ✅ Generous |
| **Netlify** | ⭐⭐⭐⭐ | ✅ Yes | ✅ Generous |
| **Railway** | ⭐⭐⭐⭐⭐ | ✅ Yes | ⭐ $5 credit |
| **GitHub Pages** | ⭐⭐⭐ | ✅ Yes | ✅ Free |

---

## 🎯 RECOMMENDED: Vercel from GitHub

**Why:**
- ✅ Easiest setup
- ✅ Best Next.js support
- ✅ Auto-deploys on every push
- ✅ Free tier is excellent
- ✅ Takes 2 minutes

**Steps:**
1. Push code to GitHub ✅ (you already have this)
2. Go to vercel.com
3. Import repo from GitHub
4. Add env vars
5. Deploy

**That's it!**

---

## 🔄 Auto-Deploy Setup

Once connected, every time you:

```bash
git add .
git commit -m "Update"
git push
```

Your app **automatically deploys**! No manual steps needed.

---

## 📝 Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Platform account created (Vercel/Netlify/Railway)
- [ ] Repository connected
- [ ] Environment variables added
- [ ] Deployed!

**Total time: 5 minutes**

---

## 🆘 Need Help?

**If you don't have GitHub repo yet:**

```bash
# Create repo on GitHub.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

**Then follow the platform steps above!**

---

**Vercel from GitHub is the fastest way - just connect and deploy!** 🚀

