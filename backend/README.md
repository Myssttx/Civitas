# Campus Resilience Backend API

RESTful API server for enhanced Campus Resilience features including shared status, resource requests, and data synchronization.

## Features

- ✅ User status sharing (Safe/Need Help/Can Help)
- ✅ Community resource requests board
- ✅ Checklist cloud sync
- ✅ Status aggregation and viewing
- ✅ Simple authentication-ready structure

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Run Locally

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

### Status Management

- `POST /api/status` - Update user status
  ```json
  { "status": "safe" | "need-help" | "can-help", "location": { "lat": 33.2, "lng": -97.1 } }
  ```

- `GET /api/status` - Get current user's status
- `GET /api/status/all` - Get all users' statuses (community view)
- `DELETE /api/status` - Clear user status

### Resource Requests

- `POST /api/requests` - Create a resource request
  ```json
  { "type": "Water", "description": "Need clean water", "urgent": true }
  ```

- `GET /api/requests` - Get all requests (query: `?status=open&limit=50`)
- `POST /api/requests/:id/respond` - Respond to a request

### Checklist Sync

- `POST /api/checklist` - Sync checklist to server
- `GET /api/checklist` - Get checklist from server

### Health Check

- `GET /api/health` - Server health status

## Deployment Options

### Option 1: Heroku (Free Tier Available)

```bash
# Install Heroku CLI
heroku login
heroku create campus-resilience-api
git push heroku main

# Set environment variables
heroku config:set NODE_ENV=production
```

### Option 2: Railway (Easy & Free Trial)

1. Go to [railway.app](https://railway.app)
2. New Project > Deploy from GitHub
3. Select your repo
4. Railway auto-detects Node.js and deploys!

### Option 3: Render (Free Tier)

1. Go to [render.com](https://render.com)
2. New > Web Service
3. Connect GitHub repo
4. Build command: `cd backend && npm install`
5. Start command: `cd backend && npm start`

### Option 4: DigitalOcean App Platform

1. Create new app
2. Connect GitHub repo
3. Select Node.js
4. Root directory: `backend`
5. Deploy!

### Option 5: AWS Elastic Beanstalk / EC2

See AWS documentation for deploying Node.js apps.

## Environment Variables

- `PORT` - Server port (default: 3000)
- `ALLOWED_ORIGINS` - CORS allowed origins (comma-separated)
- `NODE_ENV` - Environment (development/production)

## Production Considerations

1. **Database:** Replace in-memory storage with:
   - MongoDB (MongoDB Atlas - free tier)
   - PostgreSQL (Supabase - free tier)
   - Firebase Firestore

2. **Authentication:** Add JWT or OAuth:
   ```javascript
   // Example middleware
   const jwt = require('jsonwebtoken');
   function authenticate(req, res, next) {
     const token = req.headers.authorization?.split(' ')[1];
     // Verify token
   }
   ```

3. **Rate Limiting:** Add to prevent abuse:
   ```javascript
   const rateLimit = require('express-rate-limit');
   app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
   ```

4. **Error Handling:** Use proper error middleware

5. **Logging:** Add Winston or similar

## Frontend Integration

Update `index.html` (or use `index-backend.html`):

```javascript
const CONFIG = {
    // ... existing config
    API_BASE_URL: 'https://your-backend-url.com', // or http://localhost:3000 for local
    USE_BACKEND: true
};
```

## Testing

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test status endpoint
curl -X POST http://localhost:3000/api/status \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user-123" \
  -d '{"status": "safe"}'
```

## License

MIT

