# ⚡ DEPLOY FROM GITHUB - 3 CLICKS

## 🎯 Use Vercel (Fastest)

### Step 1: Make sure your code is on GitHub

```bash
# Check if you have a remote:
git remote -v

# If no remote, add one:
# 1. Create repo on github.com
# 2. Then run:
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

### Step 2: Go to Vercel

1. **Open:** https://vercel.com
2. **Click:** "Sign Up" → Use GitHub
3. **Click:** "Add New Project"
4. **Select:** Your repository from list
5. **Click:** "Import"

### Step 3: Add Environment Variables & Deploy

1. **Click:** "Environment Variables"
2. **Add these** (from Supabase):
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NWS_AREA` = `TX`
   - `NODE_ENV` = `production`
3. **Click:** "Deploy"

**DONE!** Takes 2 minutes. Your app is live!

---

## 🔄 Auto-Deploy Setup

After first deploy:
- **Every `git push`** = **Automatic deploy**
- No manual steps needed!

---

## 📍 Your App URLs

After deployment:
- **Vercel:** `https://your-project.vercel.app`
- **Netlify:** `https://your-project.netlify.app`
- **Railway:** `https://your-project.railway.app`

---

## 🆘 Don't Have GitHub Repo?

**Quick setup:**

1. Go to github.com → Sign in
2. Click "+" → "New repository"
3. Name: `campus-resilience`
4. Create repository
5. Copy the commands shown
6. Run in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/campus-resilience.git
git branch -M main
git push -u origin main
```

**Then follow Step 2 above!**

---

**That's it! Just connect GitHub to Vercel and deploy!** 🚀

