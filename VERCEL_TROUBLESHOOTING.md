# 🔧 Vercel Troubleshooting Guide

Common issues and how to fix them.

---

## ❌ Common Vercel Issues & Solutions

### Issue 1: Build Fails

**Error:** "Build failed" or "Command failed"

**Solutions:**

```bash
# 1. Check build locally first
npm run build

# 2. If local build fails, fix errors
# Common issues:
# - Missing dependencies
# - TypeScript errors
# - Environment variable issues
```

**Fix:**
1. Make sure `package.json` has all dependencies
2. Run `npm install` locally
3. Fix any TypeScript errors
4. Try deploying again

---

### Issue 2: Environment Variables Missing

**Error:** "Environment variable not found"

**Solutions:**

1. **Check Vercel Dashboard:**
   - Go to your project → Settings → Environment Variables
   - Make sure all required variables are added
   - Check they're set for "Production" environment

2. **Required Variables:**
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
   NODE_ENV=production
   ```

3. **Redeploy after adding:**
   - After adding env vars, go to Deployments
   - Click "..." on latest deployment
   - Click "Redeploy"

---

### Issue 3: Database Connection Error

**Error:** "Prisma client error" or "Database connection failed"

**Solutions:**

1. **Verify DATABASE_URL:**
   ```bash
   # Test connection locally first
   DATABASE_URL=your-url npm run db:push
   ```

2. **Check Supabase:**
   - Make sure Supabase project is active
   - Check database password is correct
   - Verify connection string format

3. **Run migrations:**
   - You need to run `db:push` on production database
   - Either locally with production URL or via Vercel CLI

---

### Issue 4: "Module not found" Errors

**Error:** "Cannot find module '@/components/...'"

**Solutions:**

1. **Check tsconfig.json paths:**
   ```json
   "paths": {
     "@/*": ["./*"]
   }
   ```

2. **Rebuild:**
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

---

### Issue 5: Deployment Stuck or Timeout

**Error:** Deployment hangs or times out

**Solutions:**

1. **Check build logs** in Vercel dashboard
2. **Increase timeout** (if needed):
   - Vercel → Settings → Functions
   - Increase function timeout
3. **Optimize build:**
   - Remove unused dependencies
   - Check for large files

---

## 🔄 Alternative Free Options

If Vercel isn't working, try these **FREE** alternatives:

### Option 1: Netlify (Easiest Alternative)

**Steps:**

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub (free)
3. "Add new site" → "Import from Git"
4. Select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables
7. Deploy!

**Netlify Free Tier:**
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Auto HTTPS
- ✅ Custom domains

---

### Option 2: Railway (Very Easy)

**Steps:**

1. Go to [railway.app](https://railway.app)
2. Sign up (free trial with $5 credit)
3. "New Project" → "Deploy from GitHub"
4. Select repository
5. Railway auto-detects Next.js
6. Add environment variables
7. Deploy!

**Railway:**
- ✅ $5 free credit (lasts months for small apps)
- ✅ Very easy setup
- ✅ Auto-deploys

---

### Option 3: Render (Free with Limitations)

**Steps:**

1. Go to [render.com](https://render.com)
2. Sign up (free)
3. "New" → "Web Service"
4. Connect GitHub
5. Settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
6. Add environment variables
7. Deploy!

**Render Free:**
- ✅ Free web services
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ Slower cold starts

---

### Option 4: Fly.io (Free Tier)

**Steps:**

1. Install Fly CLI: `npm install -g flyctl`
2. Sign up: `flyctl auth signup`
3. Deploy: `flyctl launch`
4. Follow prompts

**Fly.io Free:**
- ✅ 3 shared-cpu VMs
- ✅ 3GB persistent volumes
- ✅ 160GB outbound data/month

---

## 🆘 Still Having Issues?

### Get Help:

1. **Check Build Logs:**
   - Vercel Dashboard → Your Project → Deployments
   - Click on failed deployment
   - Check "Build Logs" tab

2. **Common Build Errors:**

   **"Cannot find module"**
   ```bash
   # Solution: Make sure package.json has dependency
   npm install missing-package
   ```

   **"Type error"**
   ```bash
   # Solution: Fix TypeScript errors
   npm run typecheck
   ```

   **"Prisma Client not generated"**
   ```bash
   # Solution: Add to package.json scripts or run locally
   npm run db:generate
   ```

3. **Test Locally First:**
   ```bash
   # Always test build locally before deploying
   npm run build
   npm start
   # Visit http://localhost:3000
   ```

---

## ✅ Quick Fix Checklist

Before redeploying, make sure:

- [ ] `npm run build` works locally
- [ ] All environment variables are set in Vercel
- [ ] `DATABASE_URL` is correct
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No linting errors (`npm run lint`)
- [ ] Database migrations run (`npm run db:push`)

---

## 💡 Pro Tips

1. **Always test locally first** - Fix issues before deploying
2. **Check Vercel logs** - They show exact error messages
3. **Use Vercel CLI** - `vercel` command for testing
4. **Add `vercel.json`** - Already included in your project
5. **Monitor deployments** - Vercel shows real-time build progress

---

**What specific error are you seeing? Share the error message and I can help fix it!**

