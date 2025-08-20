#!/bin/bash

echo "🚀 Deploying MommyCare Backend to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "🔐 Logging into Railway..."
railway login

# Deploy to Railway
echo "📦 Deploying to Railway..."
railway up

echo "✅ Deployment complete!"
echo "🌐 Your backend URL: https://your-app-name.railway.app"
echo "📊 Check Railway dashboard for logs and status"
