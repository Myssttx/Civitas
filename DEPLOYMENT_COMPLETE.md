# 🚀 Complete Deployment Guide - Campus Resilience

This guide covers deploying your Campus Resilience app to production.

## 📋 Pre-Deployment Checklist

- [ ] Database set up (Supabase)
- [ ] Environment variables ready
- [ ] Domain name (optional)
- [ ] VAPID keys generated
- [ ] Supabase project configured

---

## Option 1: Vercel (Recommended - Easiest)

Vercel is perfect for Next.js apps with automatic deployments, serverless functions, and cron jobs.

### Step 1: Prepare Your Code

```bash
# Make sure your code is in a Git repository
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/campus-resilience.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Sign up/Login**: Go to [vercel.com](https://vercel.com) and sign in with GitHub

2. **Import Project**:
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Vercel auto-detects Next.js

3. **Configure Build Settings**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (auto)
   - Output Directory: `.next` (auto)
   - Install Command: `npm install` (auto)

4. **Add Environment Variables**:
   Click "Environment Variables" and add:

   ```env
   # Database
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # App
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NODE_ENV=production

   # NWS API
   NWS_API_BASE=https://api.weather.gov
   NWS_AREA=TX

   # VAPID Keys
   VAPID_PUBLIC_KEY=your-vapid-public-key
   VAPID_PRIVATE_KEY=your-vapid-private-key
   VAPID_SUBJECT=mailto:admin@campus.edu

   # Optional: PostHog
   NEXT_PUBLIC_POSTHOG_KEY=your-key
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

   # Campus Bounds
   NEXT_PUBLIC_CAMPUS_BOUNDS_MIN_LAT=33.20
   NEXT_PUBLIC_CAMPUS_BOUNDS_MAX_LAT=33.22
   NEXT_PUBLIC_CAMPUS_BOUNDS_MIN_LNG=-97.16
   NEXT_PUBLIC_CAMPUS_BOUNDS_MAX_LNG=-97.14
   NEXT_PUBLIC_CAMPUS_CENTER_LAT=33.2075
   NEXT_PUBLIC_CAMPUS_CENTER_LNG=-97.1526
   ```

5. **Deploy**: Click "Deploy"

### Step 3: Set Up Database

After first deployment:

1. **SSH into Vercel** (or use local CLI):
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Link project
   vercel link

   # Run migrations
   vercel env pull .env.production
   npm run db:push
   npm run db:seed
   ```

   Or run locally and point to production database:
   ```bash
   DATABASE_URL=your-production-url npm run db:push
   DATABASE_URL=your-production-url npm run db:seed
   ```

### Step 4: Configure Cron Job for NWS Alerts

Vercel supports cron jobs via `vercel.json` (already configured):

The cron job runs every 5 minutes at `/api/ingest/nws`

To secure it, add a `CRON_SECRET`:

1. Add to Vercel environment variables:
   ```env
   CRON_SECRET=your-random-secret-string
   ```

2. Update `vercel.json`:
   ```json
   {
     "crons": [
       {
         "path": "/api/ingest/nws",
         "schedule": "*/5 * * * *"
       }
     ]
   }
   ```

3. The API route already checks for `CRON_SECRET` in authorization header.

### Step 5: Verify Deployment

1. Visit your deployed URL: `https://your-app.vercel.app`
2. Check that the app loads
3. Test authentication
4. Verify alerts are ingesting (check logs)

---

## Option 2: Netlify

### Step 1: Build Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
```

### Step 2: Deploy

1. Go to [netlify.com](https://netlify.com)
2. "Add new site" → "Import from Git"
3. Select repository
4. Build settings auto-detect
5. Add environment variables (same as Vercel)
6. Deploy!

**Note**: Netlify doesn't support cron jobs natively. You'll need to use:
- External cron service (cron-job.org, EasyCron)
- Or a separate serverless function service

---

## Option 3: Railway

### Step 1: Deploy

1. Go to [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub"
3. Select repository
4. Railway auto-detects Next.js
5. Add environment variables
6. Deploy!

### Step 2: Database

Railway can host PostgreSQL too:

1. "New" → "Database" → "PostgreSQL"
2. Copy connection string
3. Use in `DATABASE_URL`

---

## Option 4: Self-Hosted (VPS/Docker)

### Using Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
```

Deploy:
```bash
docker build -t campus-resilience .
docker run -p 3000:3000 --env-file .env campus-resilience
```

### Using PM2

```bash
npm install -g pm2
npm run build
pm2 start npm --name "campus-resilience" -- start
pm2 save
pm2 startup
```

---

## 🔧 Post-Deployment Steps

### 1. Database Migrations

Run on production database:
```bash
DATABASE_URL=your-production-url npm run db:push
DATABASE_URL=your-production-url npm run db:seed
```

### 2. Update Supabase Settings

1. Go to Supabase Dashboard
2. **Authentication → URL Configuration**:
   - Add your production URL to "Site URL"
   - Add to "Redirect URLs"
3. **API Settings**: Verify CORS if needed

### 3. Test Push Notifications

1. Visit `/push-notifications` on your deployed app
2. Enable notifications
3. Send a test notification from server

### 4. Set Up Monitoring

- **Vercel**: Built-in analytics
- **Sentry**: Error tracking
- **PostHog**: Analytics (if configured)

### 5. Configure Custom Domain (Optional)

**Vercel**:
1. Project Settings → Domains
2. Add your domain
3. Follow DNS instructions

**Netlify**:
1. Domain Settings
2. Add custom domain
3. Configure DNS

---

## 🔐 Security Checklist

- [ ] Environment variables set (never commit `.env`)
- [ ] Database credentials secure
- [ ] VAPID keys kept secret
- [ ] CORS configured in Supabase
- [ ] Rate limiting enabled (if using)
- [ ] HTTPS enabled (automatic on Vercel/Netlify)
- [ ] Service worker registered correctly

---

## 📊 Monitoring & Logs

### Vercel
- View logs in dashboard
- Check function logs for API routes
- Monitor cron job executions

### Netlify
- Functions tab for serverless logs
- Deploy logs in dashboard

### Railway
- Logs tab shows real-time output

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. Check IP allowlist in Supabase
3. Ensure database is active

### Environment Variables Not Working

- Restart deployment after adding env vars
- Check variable names match exactly
- Verify `NEXT_PUBLIC_*` prefix for client-side vars

### Cron Job Not Running

- Check Vercel cron configuration
- Verify `CRON_SECRET` matches
- Check function logs for errors

---

## 🚀 Quick Deploy Commands

### Vercel CLI

```bash
# Install
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod

# Set environment variables
vercel env add DATABASE_URL
```

### Netlify CLI

```bash
# Install
npm i -g netlify-cli

# Deploy
netlify deploy

# Production
netlify deploy --prod
```

---

## ✅ Deployment Success!

Once deployed, your app will be available at:
- **Vercel**: `https://your-app.vercel.app`
- **Netlify**: `https://your-app.netlify.app`
- **Railway**: `https://your-app.railway.app`
- **Custom Domain**: `https://yourdomain.com`

**Next Steps**:
1. Share the URL with your campus community
2. Monitor logs for any issues
3. Set up alerts for critical errors
4. Regular backups of database

---

## 📞 Need Help?

- Check `README.md` for setup details
- Review `PROJECT_STATUS.md` for implementation status
- Check platform documentation:
  - [Vercel Docs](https://vercel.com/docs)
  - [Netlify Docs](https://docs.netlify.com)
  - [Railway Docs](https://docs.railway.app)

**Happy Deploying! 🎉**

