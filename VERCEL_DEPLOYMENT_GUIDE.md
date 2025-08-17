# 🚀 Vercel Deployment Guide for MommyCare

## 📋 **Prerequisites**

1. **GitHub Repository**: Your code should be in `Pramudi02/MommyCare`
2. **Vercel Account**: Connected to your GitHub
3. **Backend API**: Either deployed or local development server

## 🔧 **Step 1: Environment Variables Setup**

### **In Vercel Dashboard:**

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add these variables:

```
VITE_API_URL = https://your-backend-domain.com/api
```

**If you don't have a production backend yet:**
```
VITE_API_URL = http://localhost:5000/api
```

## 🏗️ **Step 2: Vercel Configuration**

### **Project Settings:**
- **Framework Preset**: `Vite`
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 📁 **Step 3: File Structure Check**

Ensure your project structure is correct:

```
MommyCare/
├── src/
│   ├── admin/
│   ├── components/
│   ├── mom/
│   ├── doctor/
│   ├── midwife/
│   ├── service_provider/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
├── vite.config.js
└── index.html
```

## 🔄 **Step 4: Update Vite Configuration**

Make sure your `vite.config.js` is optimized for production:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
  server: {
    port: 5173,
    host: true
  }
})
```

## 🌐 **Step 5: Update API URLs**

### **For Production Backend:**
If you have a deployed backend, update the API URL in your environment variables.

### **For Local Development:**
If you're still using local backend, the current setup will work.

## 🚀 **Step 6: Deploy to Vercel**

1. **Connect Repository**: 
   - Go to Vercel Dashboard
   - Click "New Project"
   - Import from GitHub: `Pramudi02/MommyCare`
   - Select the repository

2. **Configure Project**:
   - **Project Name**: `mommy-care`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Environment Variables**:
   - Add `VITE_API_URL` with your backend URL

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete

## 🔗 **Step 7: Custom Domain (Optional)**

1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS settings

## 🧪 **Step 8: Testing After Deployment**

### **Test These Routes:**
- ✅ Homepage: `https://your-domain.vercel.app/`
- ✅ Admin Login: `https://your-domain.vercel.app/admin/login`
- ✅ Admin Dashboard: `https://your-domain.vercel.app/admin`
- ✅ Mothers Page: `https://your-domain.vercel.app/admin/users/mothers`
- ✅ Healthcare Providers: `https://your-domain.vercel.app/admin/users/providers`

### **Test Admin Login:**
- **Email**: `newadmin@mommycare.com`
- **Password**: `123456`

## 🐛 **Common Issues & Solutions**

### **Issue 1: API Calls Failing**
**Solution**: Check environment variables in Vercel dashboard

### **Issue 2: Build Errors**
**Solution**: Check console logs in Vercel build

### **Issue 3: Routing Issues**
**Solution**: Ensure all routes are properly configured

### **Issue 4: CORS Errors**
**Solution**: Configure backend CORS for Vercel domain

## 📊 **Step 9: Monitoring**

1. **Vercel Analytics**: Enable in project settings
2. **Error Tracking**: Monitor build and runtime errors
3. **Performance**: Check Core Web Vitals

## 🔄 **Step 10: Continuous Deployment**

- Every push to `master` branch will trigger automatic deployment
- Preview deployments for pull requests
- Easy rollback to previous versions

## 🎯 **Final Checklist**

- [ ] Environment variables configured
- [ ] Build command working
- [ ] All routes accessible
- [ ] Admin login working
- [ ] Real data displaying
- [ ] Responsive design working
- [ ] Performance optimized

## 📞 **Support**

If you encounter issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test locally first
4. Check browser console for errors

---

**Your MommyCare app will be live at**: `https://mommy-care.vercel.app` (or your custom domain)
