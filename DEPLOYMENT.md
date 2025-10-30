# Deployment Guide - Campus Resilience

## 🚀 Quick Deploy (Static Frontend - No Backend)

Your `index.html` file can be deployed to any static hosting service instantly!

### Option 1: Netlify (Recommended - 30 seconds)

**Easiest Method:**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop your project folder
3. Done! You get a URL like `https://random-name-123.netlify.app`

**Via Git (Auto-deploy):**
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign in
3. Click "Add new site" > "Import an existing project"
4. Select your GitHub repo
5. Build settings:
   - Build command: (leave empty)
   - Publish directory: `.` (root)
6. Deploy!

The `netlify.toml` file is already configured.

### Option 2: Vercel (Also Great)

**Via CLI:**
```bash
npm install -g vercel
vercel
```

**Via Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Vercel auto-detects and deploys!

### Option 3: GitHub Pages (Free Forever)

1. Create a GitHub repository
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/campus-resilience.git
   git push -u origin main
   ```
3. Go to repository Settings > Pages
4. Source: Deploy from a branch
5. Branch: `main` / `/` (root)
6. Save
7. Your site: `https://yourusername.github.io/campus-resilience`

### Option 4: Cloudflare Pages

1. Sign up at [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect GitHub repository
3. Build settings:
   - Framework preset: None
   - Build command: (empty)
   - Output directory: `/`
4. Deploy!

---

## 🔧 Backend Deployment

### Prerequisites
```bash
cd backend
npm install
```

### Option 1: Heroku (Free Tier Available)

1. **Install Heroku CLI:**
   ```bash
   # macOS
   brew install heroku/brew/heroku
   
   # Or download from heroku.com
   ```

2. **Login and Deploy:**
   ```bash
   heroku login
   heroku create campus-resilience-api
   git push heroku main
   ```

3. **Set Environment Variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set ALLOWED_ORIGINS=https://your-frontend-url.netlify.app
   ```

4. **Get Your Backend URL:**
   ```bash
   heroku info
   # Your API will be at: https://campus-resilience-api.herokuapp.com
   ```

### Option 2: Railway (Super Easy - Free Trial)

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Node.js!
6. Set Root Directory: `backend`
7. Deploy!
8. Get your URL from the deployment dashboard

### Option 3: Render (Free Tier Available)

1. Sign up at [render.com](https://render.com)
2. New > Web Service
3. Connect GitHub repository
4. Settings:
   - Name: `campus-resilience-api`
   - Environment: Node
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Root Directory: `backend`
5. Deploy!
6. Get your URL (e.g., `https://campus-resilience-api.onrender.com`)

### Option 4: DigitalOcean App Platform

1. Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. Create > App > GitHub
3. Select repository
4. Configure:
   - Type: Web Service
   - Source Directory: `backend`
   - Build Command: `npm install`
   - Run Command: `npm start`
5. Deploy!

---

## 🔗 Connect Frontend to Backend

Once your backend is deployed, update your frontend:

### If using `index-backend.html`:

Edit the CONFIG section:
```javascript
const CONFIG = {
    // ... other config
    API_BASE_URL: 'https://your-backend-url.herokuapp.com', // Your backend URL
    USE_BACKEND: true
};
```

### Or update `index.html` to use backend:

1. Copy `index-backend.html` to `index.html`
2. Update `API_BASE_URL` to your backend URL
3. Redeploy frontend

---

## 📱 Testing Your Deployment

### Test Frontend:
1. Open your deployed URL
2. Check that map loads
3. Try setting status
4. Check checklist
5. Verify alerts load

### Test Backend:
```bash
# Health check
curl https://your-backend-url.com/api/health

# Test status endpoint
curl -X POST https://your-backend-url.com/api/status \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user" \
  -d '{"status": "safe"}'
```

---

## 🔐 Production Checklist

- [ ] Set `ALLOWED_ORIGINS` in backend to your frontend URL
- [ ] Use HTTPS (most platforms provide this automatically)
- [ ] Consider adding authentication (JWT tokens)
- [ ] Add database (MongoDB Atlas, Supabase, etc.) instead of in-memory storage
- [ ] Add rate limiting to prevent abuse
- [ ] Set up monitoring/logging
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets

---

## 🆘 Troubleshooting

### Backend not connecting?
- Check CORS settings in `server.js`
- Verify `ALLOWED_ORIGINS` includes your frontend URL
- Check backend logs for errors

### Frontend not loading?
- Verify `index.html` is in root directory
- Check browser console for errors
- Ensure all CDN links (Leaflet) are accessible

### API calls failing?
- Check network tab in browser DevTools
- Verify backend URL is correct
- Check backend is running and accessible

---

## 📚 Additional Resources

- [Netlify Docs](https://docs.netlify.com)
- [Vercel Docs](https://vercel.com/docs)
- [Heroku Node.js Guide](https://devcenter.heroku.com/articles/nodejs-support)
- [Railway Docs](https://docs.railway.app)

---

## 🎉 Success!

Once deployed, share your URLs:
- Frontend: `https://your-app.netlify.app`
- Backend: `https://your-api.herokuapp.com`

Your campus community can now access the app!

