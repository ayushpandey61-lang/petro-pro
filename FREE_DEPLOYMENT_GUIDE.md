# Free Deployment Guide for Petrol Pump Management System

This guide will help you deploy your application completely **FREE** using Vercel (Frontend) and Render (Backend).

## 📋 What You'll Need

1. GitHub account (you already have the code there!)
2. Vercel account (free)
3. Render account (free)
4. 15 minutes of your time

## 🎯 Free Tier Limitations

### Vercel (Frontend) - FREE
- ✅ Unlimited bandwidth
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments from Git

### Render (Backend) - FREE
- ✅ 750 hours/month (enough for 24/7)
- ⚠️ Spins down after 15 minutes of inactivity (auto-restarts when accessed)
- ✅ Automatic HTTPS
- ✅ PostgreSQL database (500MB free)

## 🚀 Step-by-Step Deployment

### Part 1: Deploy Backend on Render

#### 1.1 Sign Up for Render

1. Go to https://render.com/
2. Click "Get Started" or "Sign Up"
3. Sign up with your GitHub account
4. Authorize Render to access your GitHub

#### 1.2 Create Web Service

1. Click "New +" button → Select "Web Service"
2. Connect your GitHub repository: `ayushpandey61-lang/petro-pro`
3. Configure the service:
   ```
   Name: petro-pro-backend
   Region: Singapore (or closest to India)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

#### 1.3 Set Environment Variables

Click "Advanced" and add these environment variables:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=<generate-secure-32-char-string>
ENCRYPTION_KEY=<generate-secure-32-char-string>
DATABASE_TYPE=sqlite
FRONTEND_URL=https://your-app.vercel.app
```

**How to generate secure strings:**
- Visit: https://passwordsgenerator.net/
- Length: 32 characters
- Use the generated strings

#### 1.4 Choose Free Plan

- Select "Free" plan ($0/month)
- Instance Type: Free
- Click "Create Web Service"

#### 1.5 Wait for Deployment

- Render will build and deploy your backend
- Takes 2-5 minutes
- You'll get a URL like: `https://petro-pro-backend.onrender.com`
- **COPY THIS URL** - you'll need it for the frontend!

---

### Part 2: Deploy Frontend on Vercel

#### 2.1 Sign Up for Vercel

1. Go to https://vercel.com/
2. Click "Sign Up"
3. Sign up with your GitHub account
4. Authorize Vercel to access GitHub

#### 2.2 Import Project

1. Click "Add New..." → "Project"
2. Import your repository: `ayushpandey61-lang/petro-pro`
3. Click "Import"

#### 2.3 Configure Project

```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 2.4 Set Environment Variables

Click "Environment Variables" and add:

```
VITE_API_URL=https://petro-pro-backend.onrender.com/api
```

**IMPORTANT:** Replace `petro-pro-backend.onrender.com` with YOUR actual Render backend URL!

#### 2.5 Deploy

- Click "Deploy"
- Wait 2-3 minutes
- You'll get a URL like: `https://petro-pro-xyz.vercel.app`

---

### Part 3: Update Backend CORS Settings

#### 3.1 Update Render Environment Variables

1. Go back to Render Dashboard
2. Open your backend service
3. Go to "Environment" tab
4. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://petro-pro-xyz.vercel.app
   ```
   (Use YOUR Vercel URL)
5. Click "Save Changes"
6. Service will auto-redeploy

---

## ✅ Verify Deployment

### Test Backend

Visit: `https://your-backend.onrender.com/api/health`

Should see:
```json
{"status":"ok","timestamp":"2024-..."}
```

### Test Frontend

Visit: `https://your-app.vercel.app`

Should see the login page!

---

## 🔧 Post-Deployment Configuration

### Update Backend CORS

If you get CORS errors, update [`backend/server.js`](backend/server.js):

```javascript
const corsOptions = {
  origin: [
    'https://your-app.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
```

Commit and push - both Vercel and Render will auto-deploy!

### Database Setup

Your backend uses SQLite. On first run:
1. The database will be created automatically
2. Tables will be initialized
3. Default admin user will be created

**Note:** Render's free tier has ephemeral storage. For permanent data, upgrade to persistent disk ($0.25/GB/month) or use external database.

---

## 🎯 Custom Domain (Optional)

### For Vercel (Frontend)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Free HTTPS included!

### For Render (Backend)

1. Go to Service Settings → Custom Domains
2. Add your custom domain
3. Update DNS records
4. Free HTTPS included!

---

## 🔄 Automatic Deployments

Both services support automatic deployment:

- **Push to GitHub** → Automatic deployment
- No manual steps needed
- Preview deployments for PRs (Vercel)

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Both will deploy automatically!

---

## 🐛 Troubleshooting

### Backend doesn't respond

**Problem:** Backend is sleeping (free tier limitation)

**Solution:** First request takes 1-2 minutes. Subsequent requests are instant.

**Workaround:** Use a service like https://uptimerobot.com (free) to ping your backend every 5 minutes.

### CORS Errors

Check:
1. `FRONTEND_URL` in Render matches your Vercel URL
2. CORS configuration in [`backend/server.js`](backend/server.js)
3. No trailing slashes in URLs

### Database Resets

**Problem:** Free Render tier has ephemeral storage

**Solutions:**
- Upgrade to Persistent Disk ($0.25/GB)
- Use Render PostgreSQL (free 500MB)
- Backup database regularly

### Build Fails

**Vercel:**
```bash
# Check build logs in Vercel dashboard
# Usually missing dependencies or wrong paths
```

**Render:**
```bash
# Check build logs in Render dashboard
# Usually missing environment variables
```

---

## 💰 Cost Comparison

| Service | Free Tier | Paid (if needed) |
|---------|-----------|------------------|
| **Vercel** | Unlimited | $20/month (Pro) |
| **Render** | 750 hrs/month | $7/month (Starter) |
| **Total** | **$0/month** | $27/month |

For a small petrol pump, **free tier is sufficient**!

---

## 🔐 Security Best Practices

### 1. Secure Environment Variables

Never commit:
- JWT_SECRET
- ENCRYPTION_KEY
- API keys

Always use platform environment variables (Vercel/Render dashboard)

### 2. Generate Strong Secrets

```bash
# Use online generators
https://passwordsgenerator.net/

# Or command line
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Enable HTTPS Only

Both Vercel and Render provide HTTPS automatically. Never use HTTP in production.

### 4. Regular Backups

```bash
# Backup Render database
curl https://your-backend.onrender.com/api/backup > backup.json
```

---

## 📊 Monitoring

### Vercel Analytics

1. Go to Project → Analytics
2. View traffic, performance
3. Free tier: 100k events/month

### Render Logs

1. Go to Service → Logs
2. View real-time logs
3. Download logs for debugging

### Uptime Monitoring

Use UptimeRobot (free):
1. Sign up at https://uptimerobot.com
2. Add monitor for backend URL
3. Get alerts if down
4. Keeps backend awake!

---

## 🎉 Done!

Your application is now deployed and accessible worldwide!

**Frontend:** `https://your-app.vercel.app`
**Backend:** `https://your-backend.onrender.com`

Share the frontend URL with your users and start managing your petrol pump!

---

## 📚 Next Steps

1. **Custom Domain**: Add your own domain (optional)
2. **Database Backup**: Set up regular backups
3. **Monitoring**: Set up UptimeRobot
4. **SSL**: Already included (HTTPS)
5. **Users**: Create accounts for your employees

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **GitHub Issues**: Open issue in your repository

---

## 🔄 Alternative Free Hosting Options

### Option 2: Netlify + Railway

**Frontend: Netlify**
- Similar to Vercel
- 100GB bandwidth/month
- Process: Import from GitHub, similar setup

**Backend: Railway**
- $5 free monthly credit
- ~350 hours of runtime
- More generous free tier than Render

### Option 3: GitHub Pages + Supabase

**Frontend: GitHub Pages**
- Free but limited (static only)
- Good for simple sites

**Backend: Supabase** 
- Free PostgreSQL database
- 500MB storage
- Authentication included
- More setup required

---

## 📝 Quick Reference

### Vercel Commands

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy from CLI
cd frontend
vercel

# Production deploy
vercel --prod
```

### Render Dashboard URLs

- Dashboard: https://dashboard.render.com
- Logs: https://dashboard.render.com/web/[your-service-id]/logs
- Settings: https://dashboard.render.com/web/[your-service-id]/settings

---

## ✨ Optimization Tips

### Frontend Performance

1. **Enable Vercel Analytics** (free)
2. **Use Image Optimization** (built-in)
3. **Enable Edge Caching** (automatic)

### Backend Performance

1. **Enable Render Caching**
2. **Use Connection Pooling**
3. **Optimize Database Queries**

### Keep Backend Awake

Add to frontend:

```javascript
// Ping backend every 10 minutes
setInterval(() => {
  fetch('https://your-backend.onrender.com/api/health')
}, 10 * 60 * 1000);
```

---

**Congratulations! 🎊 Your application is live on the internet for FREE!**
