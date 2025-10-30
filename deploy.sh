#!/bin/bash
# Quick deployment script for Campus Resilience

echo "🚀 Campus Resilience Deployment Script"
echo "======================================="
echo ""

# Check if in git repo
if [ ! -d ".git" ]; then
  echo "📦 Initializing Git repository..."
  git init
  git add .
  git commit -m "Initial commit"
  echo "✅ Git repository initialized"
  echo ""
fi

# Check Vercel CLI
if ! command -v vercel &> /dev/null; then
  echo "📥 Installing Vercel CLI..."
  npm install -g vercel
  echo "✅ Vercel CLI installed"
  echo ""
fi

echo "🌐 Starting deployment..."
echo ""

# Deploy to Vercel
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set up database (npm run db:push)"
echo "2. Seed data (npm run db:seed)"
echo "3. Configure environment variables in Vercel dashboard"
echo "4. Test your app at the deployed URL"
echo ""
