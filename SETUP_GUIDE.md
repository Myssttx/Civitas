# Campus Resilience - Complete Setup Guide

This guide will walk you through setting up the entire Campus Resilience application from scratch.

## 📋 Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** or **yarn**
- **Git**
- **Supabase account** - [Sign up free](https://supabase.com)
- **Vercel account** (optional, for deployment) - [Sign up free](https://vercel.com)

## 🚀 Step-by-Step Setup

### 1. Clone and Install

```bash
# If cloning from repository
git clone <your-repo-url>
cd campus-resilience

# Or if using existing files
cd "/Users/aayushpal/Downloads/Congressional App Challenge"

# Install dependencies
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for project setup to complete (2-3 minutes)
3. Go to **Settings > API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key (keep this secure!)
4. Go to **Database > Connection String** and copy your PostgreSQL connection string

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` and fill in:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# VAPID Keys (generate with: npm run generate-vapid)
VAPID_PUBLIC_KEY=your-public-key
VAPID_PRIVATE_KEY=your-private-key
VAPID_SUBJECT=mailto:admin@campus.edu
```

### 4. Generate VAPID Keys (for Push Notifications)

```bash
# Install web-push globally if needed
npm install -g web-push

# Or use the script
tsx scripts/generate-vapid-keys.ts
```

Copy the generated keys to your `.env` file.

### 5. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Or use migrations (recommended for production)
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 6. Set Up Supabase Auth

1. In Supabase dashboard, go to **Authentication > Providers**
2. Enable **Email** provider
3. Enable **Google** provider (optional, requires OAuth setup)
4. Configure email templates if desired

### 7. Enable PostGIS Extension (Optional but Recommended)

In Supabase SQL Editor, run:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

This enables advanced geospatial features.

### 8. Configure Row Level Security (RLS)

The app uses RLS policies. You'll need to create policies in Supabase:

1. Go to **Authentication > Policies**
2. Create policies for each table based on user roles
3. Example policy for `checkins` table:

```sql
-- Users can read their own checkins
CREATE POLICY "Users can read own checkins"
ON checkins FOR SELECT
USING (auth.uid()::text = (SELECT auth_id FROM users WHERE id = checkins.user_id));

-- Users can insert/update their own checkins
CREATE POLICY "Users can manage own checkins"
ON checkins FOR ALL
USING (auth.uid()::text = (SELECT auth_id FROM users WHERE id = checkins.user_id));
```

### 9. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests (requires dev server)
npm run e2e

# Type check
npm run typecheck

# Lint
npm run lint
```

## 🚢 Deployment

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will:
- Automatically build Next.js
- Set up serverless functions
- Configure cron jobs for `/api/ingest/nws`

### Option 2: Other Platforms

See `DEPLOYMENT.md` for guides on:
- Netlify
- Railway
- Render
- Self-hosted

## 📝 Post-Deployment Checklist

- [ ] Verify database connection
- [ ] Test authentication (sign up/in)
- [ ] Verify NWS alert ingestion (check cron job)
- [ ] Test PWA installation
- [ ] Verify push notifications
- [ ] Test offline mode
- [ ] Check console for errors

## 🐛 Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Verify IP allowlist (if using)

### Prisma Errors

```bash
# Regenerate Prisma client
npm run db:generate

# Reset database (WARNING: deletes all data)
npm run db:push -- --force-reset
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Check types
npm run typecheck

# Restart TypeScript server in IDE
```

## 📚 Next Steps

After setup:

1. **Create Admin User**: Sign up first user, then manually add `Admin` role in database
2. **Add Buildings**: Use Admin console or seed script
3. **Configure NWS Area**: Set `NWS_AREA` in `.env` (default: TX)
4. **Set Campus Bounds**: Update `NEXT_PUBLIC_CAMPUS_BOUNDS_*` in `.env`
5. **Customize Branding**: Update `manifest.json` and icons

## 🆘 Getting Help

- Check `PROJECT_STATUS.md` for implementation status
- Review `README.md` for feature documentation
- Check GitHub Issues (if public repo)

---

**Ready to build! 🎉**

