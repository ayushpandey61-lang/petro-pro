@echo off
REM Deployment script for Petrol Pump Management System (Windows)
REM This script helps deploy the application using Docker

echo ==========================================
echo Petrol Pump Management System Deployment
echo ==========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not installed.
    echo Please install Docker Desktop first: https://docs.docker.com/desktop/install/windows-install/
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    docker compose version >nul 2>&1
    if %errorlevel% neq 0 (
        echo Error: Docker Compose is not installed.
        echo Please install Docker Compose: https://docs.docker.com/compose/install/
        pause
        exit /b 1
    )
)

echo [OK] Docker is installed
echo [OK] Docker Compose is installed
echo.

REM Check if .env file exists
if not exist .env (
    echo Warning: .env file not found
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo [OK] Created .env file
    echo.
    echo IMPORTANT: Please edit .env file and set secure values for:
    echo    - JWT_SECRET
    echo    - ENCRYPTION_KEY
    echo.
    set /p REPLY=Have you updated the .env file with secure values? (y/n): 
    if /i not "%REPLY%"=="y" (
        echo Please update .env file and run this script again.
        pause
        exit /b 1
    )
)

echo [OK] Environment file found
echo.

REM Build and start containers
echo Building Docker images...
docker-compose build
if %errorlevel% neq 0 (
    echo Error: Failed to build Docker images
    pause
    exit /b 1
)

echo.
echo Starting containers...
docker-compose up -d
if %errorlevel% neq 0 (
    echo Error: Failed to start containers
    pause
    exit /b 1
)

echo.
echo Waiting for services to be healthy...
timeout /t 10 /nobreak >nul

REM Check if containers are running
docker-compose ps | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo.
    echo [OK] Deployment successful!
    echo.
    echo ==========================================
    echo Access your application:
    echo   Frontend: http://localhost:3000
    echo   Backend API: http://localhost:5000/api
    echo ==========================================
    echo.
    echo Useful commands:
    echo   View logs: docker-compose logs -f
    echo   Stop: docker-compose stop
    echo   Restart: docker-compose restart
    echo   Remove: docker-compose down
    echo.
) else (
    echo.
    echo Error: Deployment failed. Check logs with:
    echo    docker-compose logs
    pause
    exit /b 1
)

pause
