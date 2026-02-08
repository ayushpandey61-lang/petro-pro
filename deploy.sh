#!/bin/bash

# Deployment script for Petrol Pump Management System
# This script helps deploy the application using Docker

set -e

echo "=========================================="
echo "Petrol Pump Management System Deployment"
echo "=========================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed."
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed."
    echo "Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker is installed"
echo "✅ Docker Compose is installed"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found"
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file and set secure values for:"
    echo "   - JWT_SECRET"
    echo "   - ENCRYPTION_KEY"
    echo ""
    read -p "Have you updated the .env file with secure values? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Please update .env file and run this script again."
        exit 1
    fi
fi

echo "✅ Environment file found"
echo ""

# Build and start containers
echo "🔨 Building Docker images..."
docker-compose build

echo ""
echo "🚀 Starting containers..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check if containers are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "=========================================="
    echo "Access your application:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:5000/api"
    echo "=========================================="
    echo ""
    echo "📋 Useful commands:"
    echo "  View logs: docker-compose logs -f"
    echo "  Stop: docker-compose stop"
    echo "  Restart: docker-compose restart"
    echo "  Remove: docker-compose down"
    echo ""
else
    echo ""
    echo "❌ Deployment failed. Check logs with:"
    echo "   docker-compose logs"
    exit 1
fi
