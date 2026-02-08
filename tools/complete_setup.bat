@echo off
echo ========================================
echo 🚀 PETROL PUMP MANAGEMENT SYSTEM SETUP
echo ========================================
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js is installed

echo.
echo [2/5] Installing MySQL dependencies...
call npm install mysql2 dotenv
if %errorlevel% neq 0 (
    echo ❌ Failed to install MySQL dependencies
    pause
    exit /b 1
)
echo ✅ MySQL dependencies installed

echo.
echo [3/5] Setting up environment configuration...
if not exist "backend\.env" (
    echo Creating backend/.env file...
    (
        echo # MySQL Database Configuration
        echo DB_HOST=localhost
        echo DB_USER=root
        echo DB_PASSWORD=
        echo DB_NAME=petrol_pump
        echo.
        echo # JWT Configuration
        echo JWT_SECRET=petrol_pump_jwt_secret_key_2024_development_only
        echo.
        echo # Encryption
        echo ENCRYPTION_KEY=petrol_pump_encryption_key_2024_development_only
        echo.
        echo # Server Configuration
        echo FRONTEND_URL=http://localhost:5173
        echo PORT=5000
    ) > backend\.env
    echo ✅ Environment configuration created
) else (
    echo ✅ Environment configuration already exists
)

echo.
echo [4/5] Setting up MySQL database...
echo.
echo ⚠️  MANUAL STEP REQUIRED:
echo.
echo Please install MySQL Server first:
echo 1. Download from: https://dev.mysql.com/downloads/mysql/
echo 2. Run the installer
echo 3. Set root password during installation
echo 4. Complete the installation
echo.
echo After installing MySQL, press any key to continue...
pause

echo.
echo Checking MySQL installation...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MySQL is not installed or not in PATH
    echo Please install MySQL Server and try again
    pause
    exit /b 1
)
echo ✅ MySQL is installed

echo.
echo Creating database and tables...
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS petrol_pump; USE petrol_pump; SOURCE mysql_setup.sql;"
if %errorlevel% neq 0 (
    echo ❌ Failed to create database
    echo Please check your MySQL password and try again
    pause
    exit /b 1
)
echo ✅ Database and tables created successfully

echo.
echo [5/5] Starting the application...
echo.
echo Backend will start on: http://localhost:5000
echo Frontend will start on: http://localhost:5173
echo.
echo Starting backend server...
start cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo.
echo Starting frontend server...
start cmd /k "npm run dev"

echo.
echo ========================================
echo ✅ SETUP COMPLETE!
echo ========================================
echo.
echo 🌐 Access the application at: http://localhost:5173
echo.
echo 👤 Default Login Credentials:
echo    Email: admin@petrolpump.com
echo    Password: password123
echo    Role: Super Admin
echo.
echo 📝 Next steps:
echo 1. Open http://localhost:5173 in your browser
echo 2. Login with the credentials above
echo 3. Start using the Petrol Pump Management System!
echo.
echo Press any key to exit...
pause