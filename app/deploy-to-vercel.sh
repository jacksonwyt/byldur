#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Vercel deployment..."

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Check if logged in
if ! vercel whoami >/dev/null 2>&1; then
  echo "❌ You are not logged in to Vercel. Please run 'vercel login' first."
  exit 1
fi

# Check if the project is linked
if ! vercel project ls >/dev/null 2>&1; then
  echo "📋 Project not linked to Vercel. Running 'vercel link'..."
  vercel link --yes
fi

# Pull environment variables
echo "📥 Pulling environment variables..."
vercel env pull .env.production.local || echo "⚠️ Could not pull environment variables. You may need to set them manually in the Vercel dashboard."

# Build the project locally first to ensure it works
echo "🔨 Building project locally..."
npm run build

# Deploy the project
echo "🚢 Deploying to Vercel..."
vercel deploy --prebuilt --prod --yes

echo "✅ Deployment complete!"