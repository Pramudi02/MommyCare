# 🚀 Quick Vercel Deployment Checklist

## ✅ **Pre-Deployment Checklist**

### **1. Environment Variables (IMPORTANT!)**
In Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_API_URL = https://your-backend-domain.com/api
```

**OR for local backend testing:**
```
VITE_API_URL = http://localhost:5000/api
```

### **2. Vercel Project Settings**
- ✅ **Framework Preset**: `Vite`
- ✅ **Root Directory**: `./`
- ✅ **Build Command**: `npm run build`
- ✅ **Output Directory**: `dist`
- ✅ **Install Command**: `npm install`

### **3. Test Routes After Deployment**
- ✅ Homepage: `/`
- ✅ Admin Login: `/admin/login`
- ✅ Admin Dashboard: `/admin`
- ✅ Mothers: `/admin/users/mothers`
- ✅ Healthcare Providers: `/admin/users/providers`

### **4. Admin Login Credentials**
- **Email**: `newadmin@mommycare.com`
- **Password**: `123456`

## 🚨 **Common Issues**

### **Build Fails**
- Check Vercel build logs
- Ensure all dependencies are in `package.json`

### **API Calls Fail**
- Verify `VITE_API_URL` environment variable
- Check CORS settings on backend

### **Routing Issues**
- All routes should work with React Router
- Check browser console for errors

## 📞 **Need Help?**
1. Check Vercel build logs
2. Test locally first: `npm run build && npm run preview`
3. Verify environment variables
4. Check browser console for errors

---

**Your app will be live at**: `https://mommy-care.vercel.app`
