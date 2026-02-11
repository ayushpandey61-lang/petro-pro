# 🚀 Deploy with GitHub Pages + Netlify

Simple guide to deploy your Petrol Pump Management System using GitHub Pages for frontend and Netlify for full-stack support.

---

## 📋 What You'll Deploy

**Option A: Full-Stack on Netlify** (RECOMMENDED)
- Frontend + Backend on Netlify
- Easiest setup
- All-in-one platform

**Option B: GitHub Pages + Netlify Functions**
- Frontend on GitHub Pages
- Backend on Netlify Functions
- More technical

**We'll use Option A (Easiest)** ✨

---

## 🎯 Deploy Full-Stack on Netlify (10 Minutes)

### Step 1: Sign Up for Netlify

1. Go to **https://netlify.com/**
2. Click **"Sign Up"**
3. Choose **"Sign up with GitHub"**
4. Authorize Netlify to access your GitHub
5. Done! You're logged in

### Step 2: Deploy Frontend

#### Create netlify.toml Configuration

First, let me create the config file for you (already done in your project)

Check if you have [`netlify.toml`](netlify.toml) in your root directory.

If not, I'll create it for you!

### Step 3: Deploy on Netlify

1. **In Netlify Dashboard:**
   - Click **"Add new site"** → **"Import an existing project"**

2. **Connect to GitHub:**
   - Click **"GitHub"**
   - Find and select: `ayushpandey61-lang/petro-pro`
   - Click **"Authorize"** if asked

3. **Configure Build Settings:**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

4. **Add Environment Variables:**
   
   Click **"Show advanced"** → **"New variable"**
   
   Add these:
   ```
   VITE_API_URL=https://petro-pro-backend.onrender.com/api
   ```
   
   (We'll get the actual backend URL in next step)

5. **Deploy Site:**
   - Click **"Deploy site"**
   - Wait 2-3 minutes
   - You'll get a URL like: `https://unique-name-123.netlify.app`
   - **COPY THIS URL!**

### Step 4: Deploy Backend on Netlify Functions

**Option 1: Use Render for Backend** (Easier)
- Follow [`QUICK_DEPLOY.md`](QUICK_DEPLOY.md) Step 1
- Deploy backend on Render
- Use Render URL in VITE_API_URL above

**Option 2: Use Netlify Functions** (Advanced)
- Requires restructuring backend code
- Convert to serverless functions
- Only recommended if you know serverless

**RECOMMENDED: Use Render for backend!**

### Step 5: Update Backend CORS

Once backend is deployed (Render):

1. Go to Render Dashboard
2. Open your backend service
3. Go to **"Environment"** tab
4. Add/Update variable:
   ```
   FRONTEND_URL=https://your-site.netlify.app
   ```
5. Save → Auto-redeploys

### Step 6: Verify Deployment

1. Visit your Netlify URL: `https://your-site.netlify.app`
2. Should see login page
3. Try logging in
4. If backend sleeping: wait 1-2 minutes for first load

---

## 🎨 Custom Domain on Netlify

### Add Your Own Domain

1. **In Netlify:**
   - Go to **Site settings** → **Domain management**
   - Click **"Add custom domain"**
   - Enter your domain (e.g., `petropro.com`)

2. **Update DNS:**
   - Go to your domain registrar
   - Add these DNS records:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

3. **Enable HTTPS:**
   - Netlify automatically provisions SSL
   - Takes 1-2 minutes
   - FREE HTTPS certificate!

---

## 🔄 Auto-Deploy from GitHub

**Automatic Deployment is Already Set Up!**

Every time you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Netlify automatically:
1. Detects the push
2. Builds your app
3. Deploys new version
4. Takes 2-3 minutes

**No manual deployment needed!** 🎉

---

## 📊 Monitor Your Deployment

### View Build Logs

1. **In Netlify Dashboard:**
   - Go to **"Deploys"** tab
   - Click on latest deploy
   - View **"Deploy log"**

2. **Check for Errors:**
   - Build errors show in red
   - Usually missing dependencies or env vars

### Analytics

1. **Netlify Analytics** (Optional - $9/month)
   - Real-time visitor data
   - No cookie banners needed
   - GDPR compliant

2. **FREE Alternative:**
   - Use Google Analytics
   - Add script to [`frontend/index.html`](frontend/index.html)

---

## 🐛 Troubleshooting

### Build Fails

**Error: "Command failed with exit code 1"**

**Solution:**
1. Check build logs
2. Usually missing dependencies
3. Run locally first:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
4. Fix errors, then push again

### Environment Variables Not Working

**Error: "VITE_API_URL is undefined"**

**Solution:**
1. Go to Netlify → Site settings → Environment variables
2. Ensure all vars start with `VITE_`
3. Update and trigger new deploy

### CORS Errors

**Error: "Access-Control-Allow-Origin"**

**Solution:**
1. Verify `FRONTEND_URL` in backend matches Netlify URL
2. No trailing slashes
3. Check backend CORS config in [`backend/server.js`](backend/server.js)

### 404 on Refresh

**Error: Page not found when refreshing**

**Solution:**
Create `frontend/public/_redirects`:
```
/* /index.html 200
```

This tells Netlify to serve index.html for all routes (SPA routing)

Or add to [`netlify.toml`](netlify.toml):
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## ⚡ Performance Optimization

### Enable Asset Optimization

**In Netlify:**
1. Go to **Site settings** → **Build & deploy** → **Asset optimization**
2. Enable:
   - ✅ Bundle CSS
   - ✅ Minify CSS
   - ✅ Minify JS
   - ✅ Compress images

### Enable Cache

Netlify automatically caches:
- Static assets (1 year)
- HTML (instant updates)

---

## 🔐 Security Settings

### Add Security Headers

Create/Update [`netlify.toml`](netlify.toml):

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self' https://your-backend-url.onrender.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
```

### Enable Password Protection (Optional)

**For Staging/Demo:**
1. Go to **Site settings** → **Access control**
2. Enable **"Password protection"**
3. Set a password
4. Share with team only

---

## 💰 Netlify Free Tier Limits

| Feature | Free Tier | Paid |
|---------|-----------|------|
| **Bandwidth** | 100GB/month | Unlimited |
| **Build Minutes** | 300 min/month | 25,000 min |
| **Sites** | Unlimited | Unlimited |
| **Team Members** | 1 | Unlimited |
| **Deploy Previews** | ✅ | ✅ |
| **HTTPS** | ✅ Free | ✅ Free |
| **Custom Domain** | ✅ Free | ✅ Free |

**Your app will fit in free tier!** ✨

---

## 📱 Deploy Preview (Bonus Feature)

### Automatic Preview for PRs

When you create a Pull Request on GitHub:

1. **Netlify automatically:**
   - Builds the PR
   - Deploys to preview URL
   - Adds comment to PR with link

2. **Test changes:**
   - Before merging
   - Separate environment
   - No impact on production

3. **Example workflow:**
   ```bash
   git checkout -b new-feature
   git add .
   git commit -m "Add feature"
   git push origin new-feature
   ```
   
   Create PR on GitHub → Automatic preview URL!

---

## 🎯 Complete Setup Checklist

- [ ] ✅ Netlify account created
- [ ] ✅ Frontend deployed on Netlify
- [ ] ✅ Backend deployed on Render (or other)
- [ ] ✅ Environment variables configured
- [ ] ✅ CORS settings updated
- [ ] ✅ Custom domain added (optional)
- [ ] ✅ HTTPS enabled (automatic)
- [ ] ✅ Auto-deploy working
- [ ] ✅ Site accessible worldwide

---

## 🆘 Quick Commands Reference

### Local Testing
```bash
# Install dependencies
cd frontend
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

### Git Deployment
```bash
# Stage changes
git add .

# Commit
git commit -m "Your message"

# Push (triggers auto-deploy)
git push origin main
```

### Netlify CLI (Optional)
```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy from CLI
netlify deploy

# Deploy to production
netlify deploy --prod
```

---

## 🌟 Summary

**With Netlify + GitHub, you get:**

✅ **Free Hosting** - No credit card required
✅ **Global CDN** - Fast worldwide
✅ **Auto-Deploy** - Push to GitHub → Auto-deploy
✅ **HTTPS** - Free SSL certificate
✅ **Custom Domain** - Free to add
✅ **Deploy Previews** - Test before merge
✅ **Build Logs** - Debug easily
✅ **Rollback** - Previous versions saved

**Your App URL:** `https://your-site.netlify.app`
**Setup Time:** 10 minutes
**Cost:** FREE forever!

---

## 🚀 Next Steps

1. **Test Your Site:** Visit your Netlify URL
2. **Share It:** Send URL to users
3. **Monitor:** Check Netlify dashboard
4. **Update:** Push to GitHub → Auto-deploy!

**Congratulations! Your app is live! 🎉**

---

## 📚 Related Guides

- [`QUICK_DEPLOY.md`](QUICK_DEPLOY.md) - Quick 5-min deploy
- [`ALL_FREE_DEPLOYMENT_OPTIONS.md`](ALL_FREE_DEPLOYMENT_OPTIONS.md) - All options
- [`FREE_DEPLOYMENT_GUIDE.md`](FREE_DEPLOYMENT_GUIDE.md) - Vercel + Render

**Need help?** Open an issue on GitHub!
