# Deployment Guide

This guide explains how to deploy the Petrol Pump Management System using Docker.

## Prerequisites

- Docker Engine (v20.10 or higher)
- Docker Compose (v2.0 or higher)
- At least 2GB of free RAM
- At least 5GB of free disk space

## Quick Start with Docker

### 1. Clone the Repository

```bash
git clone <repository-url>
cd PETROL-PUMP-VINIT-PETRO-PRO
```

### 2. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` file and set your own secure values:

```env
JWT_SECRET=your_very_secure_jwt_secret_key_here
ENCRYPTION_KEY=your_very_secure_encryption_key_here
FRONTEND_URL=http://localhost:3000
VITE_API_URL=http://localhost:5000/api
```

**IMPORTANT**: Never commit the `.env` file to version control. It's already in `.gitignore`.

### 3. Build and Start the Containers

```bash
docker-compose up -d
```

This command will:
- Build the backend Docker image
- Build the frontend Docker image
- Create a Docker network
- Start both containers
- Set up a persistent volume for the SQLite database

### 4. Verify Deployment

Check if containers are running:

```bash
docker-compose ps
```

You should see both `petrol-pump-backend` and `petrol-pump-frontend` containers in "Up" status.

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## Container Management

### View Logs

```bash
# View all logs
docker-compose logs

# View backend logs
docker-compose logs backend

# View frontend logs
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f
```

### Stop Containers

```bash
docker-compose stop
```

### Start Stopped Containers

```bash
docker-compose start
```

### Restart Containers

```bash
docker-compose restart
```

### Stop and Remove Containers

```bash
docker-compose down
```

### Stop and Remove Containers + Volumes

**WARNING**: This will delete your database!

```bash
docker-compose down -v
```

## Production Deployment

### Security Best Practices

1. **Generate Strong Secrets**:
   ```bash
   # Generate a strong JWT secret
   openssl rand -base64 32
   
   # Generate a strong encryption key
   openssl rand -base64 32
   ```

2. **Use HTTPS**: Set up a reverse proxy (Nginx/Traefik) with SSL certificates

3. **Set Proper CORS**: Update `FRONTEND_URL` in `.env` to your production domain

4. **Update API URL**: Set `VITE_API_URL` to your production backend URL

5. **Database Backups**: Regular backups of the SQLite database volume

### Using a Reverse Proxy (Nginx Example)

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Database Backup

```bash
# Create backup
docker exec petrol-pump-backend tar -czf /backup.tar.gz /app/data

# Copy backup to host
docker cp petrol-pump-backend:/backup.tar.gz ./backup-$(date +%Y%m%d).tar.gz

# Restore from backup
docker cp ./backup.tar.gz petrol-pump-backend:/backup.tar.gz
docker exec petrol-pump-backend tar -xzf /backup.tar.gz -C /
docker-compose restart backend
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs for errors
docker-compose logs backend
docker-compose logs frontend

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Permission Issues

```bash
# Fix permissions on SQLite database
docker exec petrol-pump-backend chown -R node:node /app/data
```

### Port Conflicts

If ports 3000 or 5000 are already in use, modify `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "8080:5000"  # Change host port (8080)
  
  frontend:
    ports:
      - "8081:3000"  # Change host port (8081)
```

### Network Issues

```bash
# Recreate network
docker-compose down
docker network prune
docker-compose up -d
```

## Monitoring

### Health Checks

The containers include health checks. View health status:

```bash
docker inspect --format='{{.State.Health.Status}}' petrol-pump-backend
docker inspect --format='{{.State.Health.Status}}' petrol-pump-frontend
```

### Resource Usage

```bash
# View resource usage
docker stats petrol-pump-backend petrol-pump-frontend
```

## Updates and Maintenance

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

### Cleaning Up Old Images

```bash
# Remove unused images
docker image prune -a

# Remove all unused Docker resources
docker system prune -a
```

## Development vs Production

### Development (Local)

Uses development servers with hot reload:
- Frontend: Vite dev server (http://localhost:5173)
- Backend: Node.js with nodemon (http://localhost:5000)

```bash
# Development mode
npm run dev
```

### Production (Docker)

Uses optimized production builds:
- Frontend: Served via `serve` (static files)
- Backend: Node.js production mode

```bash
# Production mode
docker-compose up -d
```

## Support

For issues or questions:
1. Check the logs: `docker-compose logs`
2. Review this documentation
3. Check the main [README.md](README.md)
4. Open an issue on GitHub
