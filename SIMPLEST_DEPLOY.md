# 🚀 SIMPLEST DEPLOYMENT - 3 Steps

**No CLI, no Node.js installation needed!**

---

## ✅ Option 1: GitHub Pages (EASIEST - Just Push to GitHub)

### Step 1: Push Your Code to GitHub

```bash
# If you already have git set up:
git add .
git commit -m "Ready to deploy"
git push origin main
```

If not, create repo on GitHub.com and push.

### Step 2: Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** tab
3. Scroll to **Pages** (left sidebar)
4. Under "Source", select: **GitHub Actions**
5. Save

### Step 3: Create GitHub Actions Workflow

Create this file: `.github/workflows/deploy.yml`

I'll create it for you below. This automatically builds and deploys.

**Done!** Your app will be at: `https://YOUR_USERNAME.github.io/Civitas`

---

## ✅ Option 2: Vercel via Web (NO CLI)

### Step 1: Push to GitHub

```bash
git push origin main
```

### Step 2: Deploy on Vercel Website

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up** → Use GitHub
3. Click **Add New Project**
4. **Import** your GitHub repo
5. **Add Environment Variables** (see below)
6. Click **Deploy**

**Environment Variables to Add:**
- Copy from your `.env` file or Supabase dashboard
- Add each one in Vercel dashboard

**Done!** Your app will be at: `https://your-app.vercel.app`

---

## ✅ Option 3: Netlify via Web (NO CLI)

### Step 1: Push to GitHub

```bash
git push origin main
```

### Step 2: Deploy on Netlify Website

1. Go to [netlify.com](https://netlify.com)
2. Click **Sign up** → Use GitHub
3. Click **Add new site** → **Import from Git**
4. Select your repository
5. **Build settings** (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click **Add environment variables** → Add your Supabase keys
7. Click **Deploy site**

**Done!** Your app will be at: `https://your-app.netlify.app`

---

## 🎯 RECOMMENDED: Use Vercel (Web Interface)

**Why:**
- ✅ No CLI needed
- ✅ Just click buttons on website
- ✅ Free
- ✅ Takes 2 minutes

**Steps:**
1. Push code to GitHub
2. Go to vercel.com
3. Import repo
4. Add env vars
5. Deploy

**That's it!**

---

## 📝 Quick Checklist

1. **Code on GitHub?** ✅ (if not, push it)
2. **Vercel account?** (sign up free)
3. **Import repo?** (one click)
4. **Add env vars?** (copy from Supabase)
5. **Deploy?** (one click)

**Total time: 5 minutes, no CLI needed!**

