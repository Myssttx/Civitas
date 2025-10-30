# ⚡ Quick Environment Variables Setup

## Step 1: Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project (or use existing)
3. Wait for project to finish setting up (~2 minutes)

### Database URL:
- Go to **Settings** → **Database**
- Scroll to **Connection String** section
- Copy "URI" → This is your `DATABASE_URL`
- Copy "Direct connection" → This is your `DIRECT_URL`

### API Keys:
- Go to **Settings** → **API**
- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep this secret!

---

## Step 2: Generate VAPID Keys

Run this command:

```bash
npm install -g web-push
web-push generate-vapid-keys
```

Copy the output:
- Public Key → `VAPID_PUBLIC_KEY`
- Private Key → `VAPID_PRIVATE_KEY`
- Subject → Use your email: `mailto:you@example.com`

---

## Step 3: Get Campus Coordinates

1. Go to [Google Maps](https://maps.google.com)
2. Find your campus center
3. Right-click → "What's here?"
4. Copy the coordinates (lat, lng)

Example: University of North Texas = 33.2075, -97.1526

---

## Step 4: Create `.env` File

```bash
# Copy the example
cp .env.example .env
```

Then edit `.env` and replace with your values:

```env
# Replace [PROJECT_REF] with your Supabase project reference
# Replace [PASSWORD] with your database password

DATABASE_URL="postgresql://postgres.abc123:your-password@..."
DIRECT_URL="postgresql://postgres.abc123:your-password@..."
NEXT_PUBLIC_SUPABASE_URL="https://abc123.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VAPID_PUBLIC_KEY="BKuLx..."
VAPID_PRIVATE_KEY="yGq..."
# ... etc
```

---

## Step 5: For Production (Vercel)

When deploying, add ALL these variables to Vercel:

1. Go to Vercel project → **Settings** → **Environment Variables**
2. Add each variable from your `.env` file
3. Set `NODE_ENV` to `"production"`
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel URL

---

## ✅ Minimum Required Variables

At minimum, you need these 7 variables:

1. `DATABASE_URL` (from Supabase)
2. `DIRECT_URL` (from Supabase)
3. `NEXT_PUBLIC_SUPABASE_URL` (from Supabase)
4. `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from Supabase)
5. `SUPABASE_SERVICE_ROLE_KEY` (from Supabase)
6. `VAPID_PUBLIC_KEY` (generate)
7. `VAPID_PRIVATE_KEY` (generate)

The rest have defaults or are optional.

---

**See `ENV_VARIABLES_GUIDE.md` for detailed explanations!**

