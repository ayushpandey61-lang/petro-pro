Write-Host "========================================" -ForegroundColor Green
Write-Host "🚀 PETROL PUMP MANAGEMENT SYSTEM SETUP" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check if running as administrator
$currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
$isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  Please run this script as Administrator for best results" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "[1/5] Checking Node.js installation..." -ForegroundColor Cyan

try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Node.js not found"
    }
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[2/5] Installing MySQL dependencies..." -ForegroundColor Cyan

try {
    npm install mysql2 dotenv
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }
    Write-Host "✅ MySQL dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install MySQL dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[3/5] Setting up environment configuration..." -ForegroundColor Cyan

if (-not (Test-Path "backend\.env")) {
    Write-Host "Creating backend/.env file..." -ForegroundColor Yellow
    @"
# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=petrol_pump

# JWT Configuration
JWT_SECRET=petrol_pump_jwt_secret_key_2024_development_only

# Encryption
ENCRYPTION_KEY=petrol_pump_encryption_key_2024_development_only

# Server Configuration
FRONTEND_URL=http://localhost:5173
PORT=5000
"@ | Out-File -FilePath "backend\.env" -Encoding UTF8
    Write-Host "✅ Environment configuration created" -ForegroundColor Green
} else {
    Write-Host "✅ Environment configuration already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "[4/5] Setting up MySQL database..." -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  MANUAL STEP REQUIRED:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Please install MySQL Server first:" -ForegroundColor White
Write-Host "1. Download from: https://dev.mysql.com/downloads/mysql/" -ForegroundColor Blue
Write-Host "2. Run the installer" -ForegroundColor White
Write-Host "3. Set root password during installation" -ForegroundColor White
Write-Host "4. Complete the installation" -ForegroundColor White
Write-Host ""
Write-Host "After installing MySQL, press Enter to continue..." -ForegroundColor Green
Read-Host

Write-Host ""
Write-Host "Checking MySQL installation..." -ForegroundColor Cyan

try {
    $mysqlVersion = mysql --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "MySQL not found"
    }
    Write-Host "✅ MySQL is installed: $mysqlVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ MySQL is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install MySQL Server and try again" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Creating database and tables..." -ForegroundColor Cyan

try {
    # Try to create database without password first
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS petrol_pump; USE petrol_pump; SOURCE mysql_setup.sql;" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Password required for MySQL. Please enter your MySQL root password:" -ForegroundColor Yellow
        $mysqlPassword = Read-Host "MySQL Password" -AsSecureString
        $mysqlPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($mysqlPassword))

        mysql -u root -p"$mysqlPasswordPlain" -e "CREATE DATABASE IF NOT EXISTS petrol_pump; USE petrol_pump; SOURCE mysql_setup.sql;"
        if ($LASTEXITCODE -ne 0) {
            throw "Database creation failed"
        }
    }
    Write-Host "✅ Database and tables created successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create database" -ForegroundColor Red
    Write-Host "Please check your MySQL password and try again" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[5/5] Starting the application..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend will start on: http://localhost:5000" -ForegroundColor Blue
Write-Host "Frontend will start on: http://localhost:5173" -ForegroundColor Blue
Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Yellow

# Start backend in new window
Start-Process cmd -ArgumentList "/k cd backend && npm start"

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Starting frontend server..." -ForegroundColor Yellow

# Start frontend in new window
Start-Process cmd -ArgumentList "/k npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ SETUP COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access the application at: http://localhost:5173" -ForegroundColor Blue
Write-Host ""
Write-Host "👤 Default Login Credentials:" -ForegroundColor Cyan
Write-Host "   Email: admin@petrolpump.com" -ForegroundColor White
Write-Host "   Password: password123" -ForegroundColor White
Write-Host "   Role: Super Admin" -ForegroundColor White
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host "2. Login with the credentials above" -ForegroundColor White
Write-Host "3. Start using the Petrol Pump Management System!" -ForegroundColor White
Write-Host ""
Write-Host "Press Enter to exit..." -ForegroundColor Green
Read-Host