# 🔐 Environment Variables Guide

Complete guide on what environment variables you need and where to get them.

## 📋 Required Variables

Copy these into your `.env` file (local) or Vercel/Netlify dashboard (production):

---

## 1️⃣ Database Variables (From Supabase)

### Get from Supabase Dashboard → Settings → Database

```env
# PostgreSQL Connection String
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

**How to find:**
1. Go to Supabase Dashboard
2. Select your project
3. Go to **Settings** → **Database**
4. Find **Connection String** section
5. Copy "URI" (for `DATABASE_URL`)
6. Copy "Direct connection" (for `DIRECT_URL`)

Replace `[PASSWORD]` with your database password (set during project creation).

---

## 2️⃣ Supabase API Keys

### Get from Supabase Dashboard → Settings → API

```env
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
```

**How to find:**
1. Go to Supabase Dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

---

## 3️⃣ App Configuration

```env
# Your app URL (use localhost for dev, production URL after deploy)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
# or after deployment:
NEXT_PUBLIC_APP_URL="https://your-app.vercel.app"

# Node environment
NODE_ENV="development"
# or "production" when deployed
```

---

## 4️⃣ NWS API Configuration

```env
# National Weather Service API base URL (usually doesn't change)
NWS_API_BASE="https://api.weather.gov"

# Area code for alerts (TX = Texas, change to your state)
NWS_AREA="TX"
```

**State Codes:**
- `TX` = Texas
- `CA` = California
- `NY` = New York
- `FL` = Florida
- See [NWS documentation](https://www.weather.gov/documentation/services-web-api) for full list

---

## 5️⃣ Push Notifications (VAPID Keys)

Generate these using the provided script:

```env
VAPID_PUBLIC_KEY="your-vapid-public-key"
VAPID_PRIVATE_KEY="your-vapid-private-key"
VAPID_SUBJECT="mailto:admin@yourcampus.edu"
```

**How to generate:**
```bash
# Install web-push globally
npm install -g web-push

# Generate keys
web-push generate-vapid-keys
```

Or use the script:
```bash
tsx scripts/generate-vapid-keys.ts
```

Copy the output to your `.env` file.

---

## 6️⃣ Campus Location Configuration

Set these to your campus coordinates:

```env
# Campus center (latitude, longitude)
# Example: University of North Texas, Denton TX
NEXT_PUBLIC_CAMPUS_CENTER_LAT="33.2075"
NEXT_PUBLIC_CAMPUS_CENTER_LNG="-97.1526"

# Campus bounding box (for offline map caching)
NEXT_PUBLIC_CAMPUS_BOUNDS_MIN_LAT="33.20"
NEXT_PUBLIC_CAMPUS_BOUNDS_MAX_LAT="33.22"
NEXT_PUBLIC_CAMPUS_BOUNDS_MIN_LNG="-97.16"
NEXT_PUBLIC_CAMPUS_BOUNDS_MAX_LNG="-97.14"
```

**How to find coordinates:**
1. Go to [Google Maps](https://maps.google.com)
2. Find your campus center
3. Right-click → "What's here?"
4. Copy latitude and longitude

**For bounding box:**
- Set a box around your entire campus (about 2km x 2km is good)

---

## 7️⃣ Optional: Analytics (PostHog)

Only if you want analytics:

```env
NEXT_PUBLIC_POSTHOG_KEY="your-posthog-key"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

**To get:**
1. Sign up at [posthog.com](https://posthog.com)
2. Create project
3. Copy API key from settings

---

## 📝 Complete Example `.env` File

```env
# Database
DATABASE_URL="postgresql://postgres.abc123:your-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.abc123:your-password@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://abc123.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# NWS
NWS_API_BASE="https://api.weather.gov"
NWS_AREA="TX"

# VAPID Keys (generate with: web-push generate-vapid-keys)
VAPID_PUBLIC_KEY="BKuLx..."
VAPID_PRIVATE_KEY="yGq..."
VAPID_SUBJECT="mailto:admin@campus.edu"

# Campus Location
NEXT_PUBLIC_CAMPUS_CENTER_LAT="33.2075"
NEXT_PUBLIC_CAMPUS_CENTER_LNG="-97.1526"
NEXT_PUBLIC_CAMPUS_BOUNDS_MIN_LAT="33.20"
NEXT_PUBLIC_CAMPUS_BOUNDS_MAX_LAT="33.22"
NEXT_PUBLIC_CAMPUS_BOUNDS_MIN_LNG="-97.16"
NEXT_PUBLIC_CAMPUS_BOUNDS_MAX_LNG="-97.14"

# Optional: Analytics
# NEXT_PUBLIC_POSTHOG_KEY=""
# NEXT_PUBLIC_POSTHOG_HOST=""
```

---

## 🚀 Setting Up

### For Local Development:

1. **Copy example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env`** with your values above

3. **Save and restart** your dev server

### For Production (Vercel/Netlify):

1. Go to your deployment platform dashboard
2. Find **Environment Variables** section
3. Add each variable one by one
4. Set `NODE_ENV="production"`
5. Set `NEXT_PUBLIC_APP_URL` to your production URL
6. Redeploy after adding variables

---

## ⚠️ Important Notes

- **Never commit `.env` file** to Git (it's in `.gitignore`)
- **`SUPABASE_SERVICE_ROLE_KEY`** is sensitive - keep it secret
- **`VAPID_PRIVATE_KEY`** must stay private
- Variables starting with `NEXT_PUBLIC_*` are visible in the browser
- All other variables are server-only

---

## ✅ Verification

After setting up, verify:

1. **Database connection:**
   ```bash
   npm run db:push
   ```
   Should connect without errors.

2. **Supabase connection:**
   Start dev server and check console for errors.

3. **Environment variables:**
   ```bash
   # Check if variables are loaded (won't show values)
   node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
   ```

---

## 🆘 Common Issues

**"Database connection failed"**
- Check `DATABASE_URL` format
- Verify password is correct
- Check Supabase project is active

**"Supabase not configured"**
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set

**"VAPID keys invalid"**
- Regenerate keys
- Ensure `VAPID_SUBJECT` is a valid mailto: URL

---

**Need help?** Check the main `README.md` or `SETUP_GUIDE.md`

