# 🚀 Railway Backend Deployment Guide

## 📋 Prerequisites
- GitHub account with your MommyCare repository
- Railway account (free tier)
- MongoDB Atlas account (free tier)

## 🎯 Step-by-Step Deployment

### **Step 1: Set Up MongoDB Atlas (Free Database)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user with password
5. Get your connection string
6. **Save this connection string** - you'll need it for Railway

### **Step 2: Deploy to Railway**
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `MommyCare` repository
6. Set the **Root Directory** to: `backend`
7. Click "Deploy"

### **Step 3: Configure Environment Variables**
In Railway dashboard, go to your project → Variables tab and add:

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://mommy-care-2b480emp7-pramudi02s-projects.vercel.app
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
CORS_ORIGIN=https://mommy-care-2b480emp7-pramudi02s-projects.vercel.app
SOCKET_CORS_ORIGIN=https://mommy-care-2b480emp7-pramudi02s-projects.vercel.app
```

### **Step 4: Update Frontend API URL**
Once deployed, Railway will give you a URL like:
`https://your-app-name.railway.app`

Update your frontend environment variable:
```env
VITE_API_URL=https://your-app-name.railway.app
```

### **Step 5: Test Your Backend**
Test these endpoints:
- Health check: `https://your-app-name.railway.app/api/health`
- API docs: `https://your-app-name.railway.app/api-docs`

## 🔧 Troubleshooting

### **Common Issues:**
1. **Build fails**: Check Railway logs
2. **Database connection error**: Verify MongoDB URI
3. **CORS errors**: Check CORS_ORIGIN setting
4. **Port issues**: Railway sets PORT automatically

### **Railway Commands:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy from local
railway up

# View logs
railway logs

# Open in browser
railway open
```

## 📊 Railway Free Tier Limits
- **Monthly usage**: $5 credit
- **Build minutes**: 500 minutes/month
- **Deployments**: Unlimited
- **Custom domains**: Supported
- **SSL**: Automatic HTTPS

## 🎉 Success Checklist
- [ ] MongoDB Atlas database created
- [ ] Railway project deployed
- [ ] Environment variables set
- [ ] Frontend API URL updated
- [ ] Health check endpoint working
- [ ] CORS configured correctly

## 🔗 Useful Links
- [Railway Documentation](https://docs.railway.app/)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/getting-started/)
- [Your Frontend](https://mommy-care-2b480emp7-pramudi02s-projects.vercel.app)

## 💡 Pro Tips
1. **Use Railway CLI** for faster deployments
2. **Set up automatic deployments** from GitHub
3. **Monitor your usage** to stay within free tier
4. **Use environment variables** for sensitive data
5. **Test locally first** before deploying
