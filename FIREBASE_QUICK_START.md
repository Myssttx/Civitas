# ⚡ Firebase Quick Deploy - 5 Minutes

## Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

## Step 2: Login

```bash
firebase login
```

Opens browser → Sign in with Google → Authorize

## Step 3: Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `campus-resilience`
4. Enable Google Analytics (optional)
5. Create project

## Step 4: Initialize Firebase

```bash
cd "/Users/aayushpal/Downloads/Congressional App Challenge"
firebase init
```

**When prompted:**

1. **Which Firebase features?**
   - Use arrow keys
   - Select: **Hosting** (space to select, enter to continue)
   - Select: **Functions** (optional, for API routes)

2. **Select a default Firebase project**
   - Choose your project (campus-resilience)

3. **What do you want to use as your public directory?**
   - Type: `out` (for static export)
   - Enter

4. **Configure as a single-page app?**
   - Type: `No`
   - Enter

5. **Set up automatic builds?**
   - Type: `No`
   - Enter

6. **File public/index.html already exists. Overwrite?**
   - Type: `No`
   - Enter

7. **If Functions selected:**
   - Language: TypeScript
   - ESLint: No
   - Install dependencies: Yes

## Step 5: Configure Next.js for Static Export

**Option A: Use static export (easier, but no API routes)**

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', // Add this
  images: {
    unoptimized: true, // Add this
  },
  experimental: {
    serverActions: false, // Add this
  },
};

module.exports = withNextIntl(nextConfig);
```

**OR rename the config file I created:**

```bash
mv next.config.firebase.js next.config.js
```

## Step 6: Build

```bash
npm run build
```

This creates an `out` folder with static files.

## Step 7: Deploy

```bash
firebase deploy --only hosting
```

## Step 8: Your App is Live! 🎉

Visit: `https://your-project-id.web.app`

---

## 🔧 Using API Routes? Use Cloud Functions

If you need API routes, create Cloud Functions:

1. **API routes won't work with static export**
2. **Move API routes to Cloud Functions**

Example: Create `functions/src/api/alerts.ts`:

```typescript
import { onRequest } from 'firebase-functions/v2/https';

export const alerts = onRequest((req, res) => {
  // Your API logic here
  res.json({ alerts: [] });
});
```

Then deploy functions:

```bash
firebase deploy --only functions
```

---

## 📝 Environment Variables

### For Hosting (Static):
- Set in `next.config.js` using `process.env` at build time
- Use `NEXT_PUBLIC_*` prefix for client-side variables

### For Functions:
```bash
firebase functions:config:set supabase.url="your-url"
firebase functions:config:set supabase.key="your-key"
```

Or in `firebase.json`:
```json
{
  "functions": {
    "env": {
      "SUPABASE_URL": "your-url"
    }
  }
}
```

---

## ✅ Quick Checklist

- [ ] Firebase CLI installed
- [ ] Logged in (`firebase login`)
- [ ] Project created in Firebase Console
- [ ] Initialized (`firebase init`)
- [ ] `next.config.js` updated for static export
- [ ] Built (`npm run build`)
- [ ] Deployed (`firebase deploy`)

---

## 🆘 Common Issues

**"out directory not found"**
- Run `npm run build` first

**"No project selected"**
- Run `firebase use --add` to select project
- Or edit `.firebaserc` with your project ID

**"Build fails"**
- Check `next.config.js` has `output: 'export'`
- Remove API routes or move to Functions

**"Functions timeout"**
- Increase timeout in `functions/src/index.ts`

---

## 🎯 Next Steps

1. **Set up custom domain** (free):
   - Firebase Console → Hosting → Add custom domain

2. **Move API routes to Functions** (if needed):
   - Create functions for `/api/*` endpoints

3. **Set up environment variables**:
   - For static: Use `NEXT_PUBLIC_*` in build
   - For functions: Use Firebase config

4. **Enable automatic deployments**:
   - Connect GitHub repo
   - Auto-deploy on push

---

**Your app is now on Firebase! 🔥**

