# 💻 Run Campus Resilience Locally

You have TWO options to run locally:

---

## ✅ Option 1: Simple HTML Version (NO Installation Needed!)

**This works RIGHT NOW - just open the file!**

### Step 1: Open in Browser

1. Navigate to your project folder
2. Find `index.html`
3. **Double-click it** or right-click → "Open with" → Your browser

**That's it!** The app runs in your browser.

**Note:** This is the standalone version that works offline with localStorage.

---

## ✅ Option 2: Full Next.js App (Requires Node.js)

**This has all features: Supabase, database, API routes, etc.**

### Step 1: Install Node.js

**Easiest way:**
1. Go to **https://nodejs.org**
2. Download **LTS version** (v20.x.x)
3. Install the `.pkg` file
4. Restart Terminal

**Verify:**
```bash
node --version
npm --version
```

### Step 2: Install Dependencies

```bash
cd "/Users/aayushpal/Downloads/Congressional App Challenge"
npm install
```

### Step 3: Set Up Environment Variables

Create `.env` file:

```bash
# Copy example (if it exists) or create new
cp .env.example .env
# Then edit .env with your Supabase credentials
```

Add these to `.env`:

```env
DATABASE_URL=your-supabase-database-url
DIRECT_URL=your-supabase-direct-url
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
NWS_AREA=TX
```

### Step 4: Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed sample data (optional)
npm run db:seed
```

### Step 5: Run Development Server

```bash
npm run dev
```

**Open:** http://localhost:3000

**Done!** Your app is running locally! 🎉

---

## 🔄 Development Workflow

### Start Server:
```bash
npm run dev
```

### Stop Server:
Press `Ctrl + C` in terminal

### View Logs:
Logs appear in terminal where you ran `npm run dev`

### Make Changes:
- Edit any file
- Browser auto-refreshes (Hot Reload)
- No restart needed!

---

## 📝 Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm run test

# Check types
npm run typecheck

# Lint code
npm run lint

# Database commands
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:seed        # Seed sample data
npm run db:studio      # Open Prisma Studio (database GUI)
```

---

## 🆘 Troubleshooting

### "Command not found: npm"
- Install Node.js first (see Step 1 above)
- Restart Terminal after installing

### "Port 3000 already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Or use different port
PORT=3001 npm run dev
```

### "Database connection failed"
- Check `.env` file exists and has correct `DATABASE_URL`
- Verify Supabase project is active
- Test connection: `npm run db:push`

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Prisma client not generated"
```bash
npm run db:generate
```

---

## ✅ Quick Start Checklist

For **Simple HTML version:**
- [ ] Just open `index.html` in browser ✅

For **Full Next.js version:**
- [ ] Node.js installed (`node --version` works)
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with Supabase credentials
- [ ] Database set up (`npm run db:push`)
- [ ] Dev server running (`npm run dev`)
- [ ] App opens at http://localhost:3000

---

## 🎯 Recommendation

**For quick testing:** Use `index.html` - just open it!

**For full features:** Use Next.js version - requires Node.js setup but gives you everything.

---

**The HTML version works immediately - just double-click `index.html`!** 🚀

