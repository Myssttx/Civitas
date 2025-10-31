# 🔥 Firebase Deployment Guide - Campus Resilience

Deploy your Next.js app to Firebase Hosting (free tier available).

---

## 📋 Firebase Free Tier

**Firebase Hosting Free Tier:**
- ✅ 10GB storage
- ✅ 360MB/day data transfer
- ✅ Custom domain (free SSL)
- ✅ CDN included
- ✅ Perfect for your app!

---

## 🚀 Option 1: Static Export (Recommended for Firebase)

This exports your Next.js app as static files (works great for most pages).

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Firebase

```bash
firebase init
```

When prompted:

1. **Select "Hosting"** (space to select, enter to confirm)
2. **Use existing project** or create new
3. **Public directory:** `out` (for static export)
4. **Configure as single-page app:** `No`
5. **Set up automatic builds:** `No` (we'll do manual)
6. **Overwrite index.html:** `No`

### Step 4: Configure Next.js for Static Export

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', // Enable static export
  images: {
    unoptimized: true, // Required for static export
  },
  // ... rest of config
};

module.exports = withNextIntl(nextConfig);
```

**Note:** Static export has limitations:
- No API routes (you'll need to use Firebase Cloud Functions)
- No server-side rendering
- No dynamic routes (unless you pre-generate)

### Step 5: Build and Deploy

```bash
# Build static export
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

**Your app will be at:** `https://your-project-id.web.app`

---

## 🚀 Option 2: Full Next.js with Cloud Run (Better for API Routes)

This keeps all Next.js features including API routes.

### Step 1: Install Dependencies

```bash
npm install -g firebase-tools
npm install firebase-tools firebase-functions
```

### Step 2: Initialize Firebase

```bash
firebase init
```

Select:
- ✅ **Hosting**
- ✅ **Functions** (for API routes)
- ✅ **Firestore** (optional, if you want to use it instead of Supabase)

### Step 3: Configure Functions for Next.js

Update `firebase.json`:

```json
{
  "hosting": {
    "public": "public",
    "rewrites": [
      {
        "source": "**",
        "function": "nextjs"
      }
    ]
  },
  "functions": {
    "source": "functions"
  }
}
```

### Step 4: Create Next.js Function

Create `functions/package.json`:

```json
{
  "name": "functions",
  "engines": {
    "node": "18"
  },
  "dependencies": {
    "next": "^14.0.4",
    "firebase-functions": "^4.5.0"
  }
}
```

### Step 5: Deploy

```bash
firebase deploy
```

---

## 🌟 Option 3: Firebase Hosting + Cloud Functions for API (Hybrid)

Keep frontend static, move API routes to Cloud Functions.

### Step 1: Setup

```bash
firebase init hosting
firebase init functions
```

### Step 2: Move API Routes

Create Cloud Functions for your API routes (e.g., `/api/alerts`, `/api/checkins`).

### Step 3: Update Frontend

Change API calls to point to Firebase Functions URLs.

### Step 4: Deploy

```bash
firebase deploy
```

---

## 📝 Recommended Setup (Static Export)

For your app, I recommend **Static Export** because:

✅ Free tier covers it
✅ Fastest deployment
✅ Works with your current setup
✅ Move API routes to Cloud Functions if needed

### Complete Steps:

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login:**
   ```bash
   firebase login
   ```

3. **Initialize:**
   ```bash
   firebase init hosting
   ```
   - Select existing/create project
   - Public directory: `out`
   - Single-page app: No
   - Auto-builds: No

4. **Update next.config.js** (I'll create this)

5. **Build:**
   ```bash
   npm run build
   ```

6. **Deploy:**
   ```bash
   firebase deploy --only hosting
   ```

---

## 🔐 Environment Variables on Firebase

For Cloud Functions, set in Firebase Console:
1. Go to Functions → Your function → Configuration
2. Add environment variables

Or use `.env` file in functions directory.

---

## ✅ After Deployment

1. **Set up custom domain** (optional, free):
   - Firebase Console → Hosting → Add custom domain
   - Follow DNS setup instructions

2. **Configure redirects** (if needed):
   - Edit `firebase.json` hosting section

3. **Set up Cloud Functions** (for API routes if using):
   - Functions deploy separately
   - Update API calls in frontend

---

## 💰 Firebase Pricing

**Free Tier (Spark Plan):**
- Hosting: 10GB storage, 360MB/day transfer
- Functions: 2M invocations/month
- More than enough for your app!

**Paid (Blaze Plan):**
- Pay-as-you-go
- More generous limits
- Only pay if you exceed free tier

---

## 🆘 Troubleshooting

**Build fails:**
- Check `next.config.js` has `output: 'export'`
- Remove API routes or move to Cloud Functions

**Functions timeout:**
- Increase timeout in `firebase.json`

**CORS issues:**
- Configure CORS in Cloud Functions

---

**Let me know which option you prefer and I'll create the exact configuration files!**

