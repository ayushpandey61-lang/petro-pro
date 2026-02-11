# How to Deploy This Application Using Docker

## Prerequisites

Before you start, make sure you have:

1. **Docker Desktop** installed on your computer
   - Windows: https://docs.docker.com/desktop/install/windows-install/
   - Mac: https://docs.docker.com/desktop/install/mac-install/
   - Linux: https://docs.docker.com/desktop/install/linux-install/

2. **Git** installed (if you want to clone from GitHub)

## Step-by-Step Deployment Instructions

### Step 1: Prepare Your Environment

**Option A: If you already have the code locally**  
You're already here! Skip to Step 2.

**Option B: If cloning from GitHub**
```bash
git clone https://github.com/vpscl2025/PETRO-PRO-LATETST-SOF.git
cd PETRO-PRO-LATETST-SOF
```

### Step 2: Configure Environment Variables

1. **Copy the example environment file:**
   ```bash
   copy .env.example .env
   ```
   *(On Linux/Mac use `cp` instead of `copy`)*

2. **Edit the `.env` file:**
   - Open `.env` file in a text editor
   - Change these values to secure random strings:
     ```
     JWT_SECRET=your_very_secure_secret_here
     ENCRYPTION_KEY=your_very_secure_encryption_key_here
     ```
   
   **TIP**: Generate secure values:
   - Use a password generator: https://passwordsgenerator.net/
   - Length: 32+ characters
   - Include uppercase, lowercase, numbers, and special characters

### Step 3: Deploy Using Docker

**🪟 Windows Users:**

Simply double-click the `deploy.bat` file, or run in Command Prompt:
```cmd
deploy.bat
```

**🐧 Linux/Mac Users:**

Run in terminal:
```bash
chmod +x deploy.sh
./deploy.sh
```

**📋 Manual Deployment (All Platforms):**

```bash
# Build Docker images
docker-compose build

# Start containers in background
docker-compose up -d

# Check if containers are running
docker-compose ps
```

### Step 4: Access Your Application

Once deployment is complete, open your web browser:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

That's it! Your application is now running in Docker containers.

## Managing Your Deployment

### View Application Logs

```bash
# See all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# See only backend logs
docker-compose logs backend

# See only frontend logs
docker-compose logs frontend
```

### Stop the Application

```bash
# Stop but keep containers
docker-compose stop

# Start stopped containers
docker-compose start

# Restart containers
docker-compose restart
```

### Completely Remove the Application

```bash
# Stop and remove containers
docker-compose down

# Stop, remove containers AND delete database (CAREFUL!)
docker-compose down -v
```

### Update the Application

When you make code changes:

```bash
# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

## Troubleshooting

### Problem: Containers won't start

**Solution:**
```bash
# Check the logs for errors
docker-compose logs

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Problem: Port already in use

**Error:** "Port 3000 is already allocated"

**Solution:** Stop other services using ports 3000 or 5000, or change ports in [`docker-compose.yml`](docker-compose.yml):

```yaml
services:
  backend:
    ports:
      - "8080:5000"  # Change 8080 to any available port
  
  frontend:
    ports:
      - "8081:3000"  # Change 8081 to any available port
```

### Problem: Docker not installed

**Error:** "docker: command not found"

**Solution:** Install Docker Desktop from https://docs.docker.com/get-docker/

### Problem: Permission denied

**Solution (Linux/Mac):**
```bash
sudo docker-compose up -d
# Or add your user to docker group
sudo usermod -aG docker $USER
```

## What Docker Does

Docker containers package your application with all dependencies, ensuring it runs exactly the same way everywhere:

1. **Backend Container**: 
   - Runs Node.js server
   - Includes SQLite database
   - Exposes port 5000

2. **Frontend Container**:
   - Builds React application  
   - Serves static files
   - Exposes port 3000

3. **Network**: Both containers communicate through a Docker network

4. **Volume**: Database is stored in a persistent volume (survives container restarts)

## Next Steps After Deployment

1. **Access the frontend**: http://localhost:3000
2. **Login** with your credentials
3. **Configure** master data (employees, products, etc.)
4. **Start** managing your petrol pump operations

## Need More Help?

- Read the complete guide: [`DEPLOYMENT.md`](DEPLOYMENT.md)
- Check the main README: [`README.md`](README.md)
- View Docker Compose file: [`docker-compose.yml`](docker-compose.yml)

## Production Deployment

For production (on a real server):

1. **Get a server** (DigitalOcean, AWS, Linode, etc.)
2. **Install Docker** on the server
3. **Clone your repository** on the server
4. **Set secure environment variables**
5. **Run Docker Compose**
6. **Set up domain & SSL** (using Nginx/Caddy)

Read [`DEPLOYMENT.md`](DEPLOYMENT.md) Section "Production Deployment" for details.
