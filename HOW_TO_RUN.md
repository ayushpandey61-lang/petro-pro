# 🚀 How to Run This Project from GitHub

Complete guide to clone and run the Petrol Pump Management System locally.

---

## 📋 Prerequisites

Before you start, make sure you have installed:

1. **Node.js** (v18 or higher)  
   Download: https://nodejs.org/
   
2. **Git**  
   Download: https://git-scm.com/downloads

3. **Text Editor** (VS Code recommended)  
   Download: https://code.visualstudio.com/

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Clone the Repository

Open terminal/command prompt and run:

```bash
git clone https://github.com/ayushpandey61-lang/petro-pro.git
cd petro-pro
```

### Step 2: Set Up Environment Variables

**Windows:**
```cmd
copy .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

**Edit `.env` file** and set these values:
```env
JWT_SECRET=your_very_secure_jwt_secret_key_here
ENCRYPTION_KEY=your_very_secure_encryption_key_here
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Install Dependencies

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

### Step 4: Run the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
```

You should see:
```
Server running on http://localhost:5000
Database initialized successfully
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Step 5: Open in Browser

Visit: **http://localhost:5173/**

**Default Login:**
- Username: `admin`
- Password: `admin123`

---

## 📝 Detailed Instructions

### Install Node.js

1. Go to https://nodejs.org/
2. Download LTS version (recommended)
3. Run installer
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Install Git

1. Go to https://git-scm.com/downloads
2. Download for your OS
3. Run installer (use default settings)
4. Verify installation:
   ```bash
   git --version
   ```

### Clone Repository

**Option 1: Using HTTPS (Recommended)**
```bash
git clone https://github.com/ayushpandey61-lang/petro-pro.git
```

**Option 2: Using SSH**
```bash
git clone git@github.com:ayushpandey61-lang/petro-pro.git
```

**Option 3: Download ZIP**
- Go to https://github.com/ayushpandey61-lang/petro-pro
- Click "Code" → "Download ZIP"
- Extract the ZIP file

---

## 🔧 Configuration

### Environment Variables

The `.env` file controls application settings:

```env
# Backend Settings
NODE_ENV=development
PORT=5000

# Security
JWT_SECRET=change_this_to_a_secure_random_string
ENCRYPTION_KEY=change_this_to_another_secure_string

# Database
DATABASE_TYPE=sqlite

# CORS (Frontend URL)
FRONTEND_URL=http://localhost:5173

# Frontend API URL
VITE_API_URL=http://localhost:5000/api
```

**Generate Secure Keys:**

**Option 1:** Online Generator
- Visit: https://passwordsgenerator.net/
- Length: 32 characters
- Copy and paste

**Option 2:** Node.js Command
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🏃 Running the Application

### Development Mode

This runs the app with hot-reload (changes update automatically):

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

### Production Mode

Build and run optimized version:

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## 🐳 Run with Docker (Optional)

If you have Docker installed:

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose stop

# Remove containers
docker-compose down
```

URLs after Docker deployment:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 🧪 Testing the Setup

### Test Backend

Visit in browser: http://localhost:5000/api/health

Should see:
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

### Test Frontend

Visit: http://localhost:5173/

Should see the login page.

### Test Login

- Username: `admin`
- Password: `admin123`

If successful, you'll see the dashboard!

---

## 📁 Project Structure

```
petro-pro/
├── backend/                 # Node.js backend
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth, validation
│   ├── lib/                # Database, utilities
│   ├── server.js           # Main server file
│   └── package.json        # Dependencies
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # State management
│   │   ├── lib/           # Utilities
│   │   └── App.jsx        # Main app component
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Dependencies
│
├── database/               # Database setup
│   ├── create_tables.js   # Table creation
│   └── *.sql             # SQL schemas
│
├── docs/                   # Documentation
├── .env.example            # Environment template
├── docker-compose.yml      # Docker config
├── README.md              # Main readme
└── DEPLOYMENT.md          # Deployment guide
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
1. **Find process:**
   ```cmd
   # Windows
   netstat -ano | findstr :5000
   
   # Mac/Linux
   lsof -i :5000
   ```

2. **Kill process:**
   ```cmd
   # Windows
   taskkill /PID <PID> /F
   
   # Mac/Linux
   kill -9 <PID>
   ```

3. **Or change port in `.env`:**
   ```env
   PORT=5001
   ```

### Database Error

**Error:** `Database connection failed`

**Solution:**
1. Delete database file: `petro_pump.db`
2. Restart backend (will auto-create database)

### Module Not Found

**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### CORS Error

**Error:** `Access-Control-Allow-Origin`

**Solution:**
1. Check `.env` file
2. Ensure `FRONTEND_URL=http://localhost:5173`
3. Restart backend

### Build Fails

**Error:** Build command fails

**Solution:**
```bash
# Clear cache
cd frontend
npm cache clean --force
rm -rf dist node_modules
npm install
npm run build
```

---

## 📱 Access from Other Devices

To access from phone/tablet on same network:

1. **Find your computer's IP address:**
   ```cmd
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```
   Look for IPv4 address (e.g., `192.168.1.100`)

2. **Update frontend config:**
   ```bash
   cd frontend
   npm run dev -- --host
   ```

3. **Access from device:**
   ```
   http://YOUR_IP:5173
   ```
   (e.g., `http://192.168.1.100:5173`)

---

## 🔄 Updating the Code

When new changes are pushed to GitHub:

```bash
# Save your local changes (if any)
git stash

# Pull latest changes
git pull origin main

# Reapply your changes
git stash pop

# Reinstall dependencies (if package.json changed)
cd backend && npm install
cd ../frontend && npm install

# Restart servers
```

---

## 💻 Useful Commands

### Backend Commands

```bash
# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Run tests
npm test

# Check for errors
npm run lint
```

### Frontend Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Format code
npm run format
```

---

## 📚 Next Steps

After running locally:

1. ✅ **Explore Features** - Try all pages and functions
2. 📖 **Read Documentation** - Check [`README.md`](README.md)
3. 🎨 **Customize** - Modify code to your needs
4. 🚀 **Deploy** - See [`DEPLOYMENT.md`](DEPLOYMENT.md) for deployment
5. 📱 **Share** - Invite team members

---

## 🆘 Need Help?

1. **Check documentation:**
   - [`README.md`](README.md) - Overview
   - [`DEPLOYMENT.md`](DEPLOYMENT.md) - Deployment
   - [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) - UI guidelines

2. **Common issues:**
   - Port conflicts - Change ports
   - Module errors - Reinstall dependencies
   - Database errors - Delete and restart

3. **Still stuck?**
   - Open GitHub Issue
   - Check logs in terminal
   - Verify Node.js version (v18+)

---

## 🎉 Success Checklist

- [ ] ✅ Node.js installed (v18+)
- [ ] ✅ Git installed
- [ ] ✅ Repository cloned
- [ ] ✅ Dependencies installed
- [ ] ✅ `.env` file configured
- [ ] ✅ Backend running (port 5000)
- [ ] ✅ Frontend running (port 5173)
- [ ] ✅ Can access http://localhost:5173
- [ ] ✅ Can login successfully

**Congratulations! You're running the Petrol Pump Management System! 🎊**
