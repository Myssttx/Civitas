#!/bin/bash
# Setup script for Campus Resilience

echo "🚀 Setting up Campus Resilience..."

# Check Node version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env and fill in your Supabase credentials"
echo "2. Run 'npm run db:push' to create database tables"
echo "3. Run 'npm run db:seed' to seed sample data"
echo "4. Run 'npm run dev' to start development server"
echo ""
echo "For VAPID keys: tsx scripts/generate-vapid-keys.ts"

