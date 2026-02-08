# 🚀 Quick Start Guide - Petrol Pump Management System

## Choose Your Setup Method

### Option 1: MySQL Setup (Recommended for Production)
```bash
# Run the automated setup script
.\complete_setup.bat
```

### Option 2: SQLite Setup (Quick Development)
```bash
# Install SQLite dependencies
npm install sqlite3

# Run SQLite setup
node setup_sqlite.js
```

### Option 3: Manual Setup
1. Install MySQL Server from https://dev.mysql.com/downloads/mysql/
2. Run the SQL commands in mysql_setup.sql
3. Update backend/.env with your MySQL credentials
4. Start the servers

## Default Login Credentials

- **Email:** admin@petrolpump.com
- **Password:** password123
- **Role:** Super Admin

## Access URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## What's Included

✅ Complete database setup with all tables
✅ User authentication and authorization
✅ Role-based permissions system
✅ Master data management
✅ Sample data for testing
✅ Production-ready configuration

## Need Help?

1. Check the console for error messages
2. Verify database connection settings
3. Ensure all dependencies are installed
4. Check the troubleshooting section in README_MYSQL.md

## Next Steps

1. Open http://localhost:5173 in your browser
2. Login with the credentials above
3. Explore the Petrol Pump Management System features
4. Start adding your own data

Happy coding! 🎉