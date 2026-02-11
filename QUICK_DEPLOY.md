# 🚀 Quick Deploy - 5 Minutes to Live!

Get your app online in 5 minutes - completely **FREE**!

## 🎯 Quick Links

- [Full Free Deployment Guide](FREE_DEPLOYMENT_GUIDE.md) ← Complete step-by-step
- [Docker Deployment](HOW_TO_DEPLOY_DOCKER.md) ← Local deployment
- [Production Guide](DEPLOYMENT.md) ← Advanced deployment

---

## ⚡ Super Quick Deploy

### Step 1: Deploy Backend (2 minutes)

1. Go to **Render**: https://render.com/
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Select your repo: `ayushpandey61-lang/petro-pro`
5. **Configure:**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Choose **FREE** plan
6. **Add Environment Variables:**
   ```
   NODE_ENV=production
   JWT_SECRET=<generate-random-32-chars>
   ENCRYPTION_KEY=<generate-random-32-chars>
   DATABASE_TYPE=sqlite
   ```
7. Click **"Create Web Service"**
8. **Copy your backend URL** (e.g., `https://petro-pro-backend.onrender.com`)

### Step 2: Deploy Frontend (2 minutes)

1. Go to **Vercel**: https://vercel.com/
2. Sign up with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import: `ayushpandey61-lang/petro-pro`
5. **Configure:**
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Add Environment Variable:**
   ```
   VITE_API_URL=https://YOUR-RENDER-URL.onrender.com/api
   ```
   (Use YOUR backend URL from Step 1!)
7. Click **"Deploy"**
8. **Copy your frontend URL** (e.g., `https://petro-pro.vercel.app`)

### Step 3: Update CORS (1 minute)

1. Go back to **Render Dashboard**
2. Open your backend service
3. Go to **"Environment"** tab
4. Add/Update:
   ```
   FRONTEND_URL=https://YOUR-VERCEL-URL.vercel.app
   ```
   (Use YOUR frontend URL from Step 2!)
5. Save → Auto-redeploys

---

## ✅ DONE! 

Your app is live! 🎉

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

---

## 🔐 Generate Secure Keys

**Need JWT_SECRET and ENCRYPTION_KEY?**

**Option 1:** Online Generator
- Visit: https://passwordsgenerator.net/
- Length: 32 characters
- Copy and paste

**Option 2:** Command Line
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🐛 Common Issues

### "Repository not found"
- Make sure you've pushed to GitHub
- Repository must be public or Vercel/Render has access

### "CORS Error"
- Check `FRONTEND_URL` in Render matches your Vercel URL
- No trailing slashes
- Wait 1-2 minutes after updating

### "Backend not responding"
- Free tier sleeps after 15 min inactivity
- First request takes 1-2 minutes (then instant)
- Use UptimeRobot to keep awake

### "Build Failed"
- Check build logs
- Usually missing environment variables
- Try rebuilding

---

## 🎯 Next Steps

- [ ] ✅ Test login at your Vercel URL
- [ ] 🔐 Change default passwords
- [ ] 👥 Add users/employees
- [ ] 📊 Start using the system
- [ ] 🔄 Set up [UptimeRobot](https://uptimerobot.com) (keeps backend awake)
- [ ] 🌐 Add custom domain (optional)

---

## 📚 More Info

- **Troubleshooting**: See [FREE_DEPLOYMENT_GUIDE.md](FREE_DEPLOYMENT_GUIDE.md)
- **Monitoring**: Set up UptimeRobot (free)
- **Backups**: Database resets on free tier (upgrade to persistent disk)
- **Performance**: Both services auto-scale

---

## 💡 Pro Tips

1. **Keep Backend Awake**
   ```javascript
   // Add to frontend
   setInterval(() => {
     fetch('https://your-backend.onrender.com/api/health')
   }, 10 * 60 * 1000);
   ```

2. **Auto-Deploy**
   - Just push to GitHub
   - Both deploy automatically!
   ```bash
   git add .
   git commit -m "Update"
   git push
   ```

3. **Preview Deployments**
   - Every branch gets preview URL (Vercel)
   - Test before merging

---

## 🆘 Need Help?

1. Read [FREE_DEPLOYMENT_GUIDE.md](FREE_DEPLOYMENT_GUIDE.md)
2. Check Vercel/Render logs
3. Open GitHub issue

---

**🎊 Congratulations! Your app is deployed!**

Share your URL and start managing your petrol pump online! 🚀
