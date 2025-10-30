# Campus Resilience

A production-ready, offline-capable emergency readiness and community resilience web application for campuses.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (via Supabase recommended)
- Supabase account for auth and realtime

### Setup

1. **Clone and install:**

```bash
npm install
```

2. **Set up Supabase:**

   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Enable PostgreSQL and Auth
   - Copy your project URL and anon key

3. **Configure environment:**

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials and other required variables.

4. **Set up database:**

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate

# Seed sample data
npm run db:seed
```

5. **Run development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── [locale]/          # Internationalized pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   └── pages/             # Page components
├── lib/                   # Utilities and helpers
│   ├── prisma.ts          # Prisma client
│   ├── supabase/         # Supabase clients
│   ├── auth.ts            # Auth utilities
│   ├── geospatial.ts     # Map utilities
│   └── offline.ts         # Offline storage
├── prisma/                # Database schema
│   ├── schema.prisma      # Prisma schema
│   └── seed.ts            # Seed script
├── public/                # Static assets
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service worker
└── e2e/                   # Playwright tests
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Type check with TypeScript
- `npm run test` - Run Vitest unit tests
- `npm run e2e` - Run Playwright E2E tests
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run migrations
- `npm run db:seed` - Seed database
- `npm run db:studio` - Open Prisma Studio

## 🌍 Features

### Core Functionality

- ✅ Real-time NWS alert ingestion and display
- ✅ Interactive map with alert polygons
- ✅ Building and safety resource management
- ✅ User check-ins (Safe/Need Help/Can Help)
- ✅ Help request system
- ✅ Task management (RA/Captain)
- ✅ Building-scoped bulletins
- ✅ Offline support with IndexedDB
- ✅ PWA with install banner
- ✅ Push notifications (Web Push)
- ✅ Role-based access control
- ✅ Internationalization (English/Spanish)
- ✅ Accessibility (WCAG AA)

### Offline Capabilities

- Service worker caches app shell and API responses
- IndexedDB stores alerts, resources, and check-ins
- Outbox pattern for queued actions
- Background sync when online
- Offline map tile caching

### Security

- Supabase Row Level Security (RLS) policies
- Building-scoped data access
- Precise location sharing only with explicit consent
- Encrypted SOS messages (libsodium)
- Rate limiting on API routes

## 🔐 Authentication

The app uses Supabase Auth with:

- Email/password with magic links
- Google OAuth
- JWT tokens with role claims
- RLS policies for data access

## 📊 Database Schema

See `prisma/schema.prisma` for the complete data model. Key entities:

- **User** - User accounts with roles
- **Building** - Campus buildings with polygons
- **SafetyResource** - Shelters, AEDs, exits, etc.
- **Alert** - NWS weather alerts
- **Checkin** - User status updates
- **HelpRequest** - Community help requests
- **Task** - Assigned tasks (RA/Captain)
- **Bulletin** - Building announcements

## 🗺️ Maps

Uses MapLibre GL JS with:

- Vector tiles from OpenStreetMap
- Raster fallback
- Custom layers for buildings and resources
- Alert polygon overlays
- Nearest shelter finder
- Offline tile caching

## 📱 PWA

Fully installable Progressive Web App:

- Service worker for offline support
- App manifest with icons
- Install banner
- Background sync
- Push notifications

## 🧪 Testing

- **Unit tests:** Vitest with React Testing Library
- **E2E tests:** Playwright
- Run tests: `npm run test` and `npm run e2e`

## 🚢 Deployment

### Quick Deploy (5 minutes)

**Recommended: Vercel**

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/campus-resilience.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Add environment variables (see `.env.example`)
   - Click "Deploy"

3. **Set up database**:
   ```bash
   # After first deploy, run migrations
   DATABASE_URL=your-production-url npm run db:push
   DATABASE_URL=your-production-url npm run db:seed
   ```

4. **Done!** Your app is live 🎉

For detailed deployment instructions, see:
- **`QUICK_DEPLOY.md`** - Fastest way to deploy
- **`DEPLOYMENT_COMPLETE.md`** - Complete guide with all platforms

## 📝 Environment Variables

See `.env.example` for all required variables:

- Database connection (Supabase)
- Supabase keys (anon, service role)
- VAPID keys (push notifications)
- PostHog (analytics, optional)
- Campus bounds (for offline caching)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file

## 🙏 Acknowledgments

- National Weather Service API
- OpenStreetMap
- MapLibre GL JS
- Supabase
- Next.js team

---

Built with ❤️ for campus communities
