#!/bin/bash
# Quick local setup script

echo "🚀 Campus Resilience - Local Setup"
echo "===================================="
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found!"
    echo ""
    echo "📥 Installing Node.js is required for full features."
    echo "Option 1 (Recommended): Download from https://nodejs.org"
    echo "Option 2: Use the simple index.html file (works without Node.js!)"
    echo ""
    echo "To use simple version:"
    echo "  Just open index.html in your browser!"
    echo ""
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found"
    echo "Creating .env.example reference..."
    echo ""
    echo "Please create .env file with your Supabase credentials"
    echo "See ENV_VARIABLES_GUIDE.md for details"
    echo ""
else
    echo "✅ .env file found"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo ""
echo "🔧 Generating Prisma client..."
npm run db:generate

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Make sure .env file has your Supabase credentials"
echo "2. Run: npm run db:push (to create database tables)"
echo "3. Run: npm run dev (to start development server)"
echo "4. Open: http://localhost:3000"
echo ""
echo "Or use simple version: Just open index.html in browser!"

