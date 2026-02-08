# MySQL Setup Guide for Petrol Pump Management System

This guide will help you set up the Petrol Pump Management System with MySQL instead of Supabase.

## Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn

## Quick Setup

### 1. Install MySQL Dependencies

```bash
cd backend
npm install mysql2 bcryptjs
```

### 2. Set up MySQL Database

Run the automated setup script:

```bash
node setup_mysql.js
```

Or manually set up the database:

1. Create a MySQL database:
```sql
CREATE DATABASE petrol_pump;
```

2. Run the SQL setup file:
```bash
mysql -u root -p petrol_pump < mysql_setup.sql
```

### 3. Configure Environment Variables

Update your `backend/.env` file:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=petrol_pump

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_for_development

# Encryption
ENCRYPTION_KEY=your_encryption_key_for_development

# Server Configuration
FRONTEND_URL=http://localhost:5173
PORT=5000
```

### 4. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
npm run dev
```

## Database Schema

The MySQL setup creates the following tables:

### Core Tables
- `users` - User authentication and management
- `roles` - User roles (Super Admin, Manager, Supervisor, Operator)
- `permissions` - System permissions
- `role_permissions` - Role-permission relationships

### Master Data Tables
- `employees` - Employee information
- `fuel_products` - Fuel products and pricing
- `liquids` - Liquid fuel types
- `lubricants` - Lubricant products
- `credit_parties` - Credit customers
- `vendors` - Fuel vendors
- `tanks` - Storage tanks
- `nozzles` - Fuel dispensing nozzles
- `expense_types` - Expense categories

### Business Tables
- `shifts` - Work shifts
- `swipe_machines` - Card payment machines
- `expiry_items` - Items with expiry dates
- `print_templates` - Invoice templates
- `guest_customers` - Walk-in customers
- `denominations` - Currency denominations
- `tank_dips` - Tank level measurements
- `tank_lorry_management` - Fuel delivery tracking

## API Endpoints

All existing API endpoints work the same way, but now use MySQL:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/permissions/:roleName` - Get role permissions

### Master Data
- `GET /api/master/employees` - Get all employees
- `POST /api/master/employees` - Create employee
- `PUT /api/master/employees/:id` - Update employee
- `DELETE /api/master/employees/:id` - Delete employee

Similar endpoints exist for all master data tables.

## Default Users

After setup, you can log in with:

- **Email**: admin@petrolpump.com
- **Password**: password123
- **Role**: Super Admin

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure MySQL server is running
   - Check DB_HOST, DB_USER, DB_PASSWORD in .env

2. **Access Denied**
   - Verify MySQL user credentials
   - Ensure user has CREATE, INSERT, UPDATE, DELETE privileges

3. **Database Not Found**
   - Run the setup script again
   - Manually create the database

### Manual Database Setup

If the automated setup fails:

```bash
# 1. Connect to MySQL
mysql -u root -p

# 2. Create database
CREATE DATABASE petrol_pump;
USE petrol_pump;

# 3. Run the SQL file
source mysql_setup.sql;

# 4. Exit
exit;
```

## Migration from Supabase

The system has been completely migrated from Supabase to MySQL:

- ✅ All authentication uses MySQL users table
- ✅ All CRUD operations use MySQL queries
- ✅ Role-based permissions system implemented
- ✅ Database relationships properly configured
- ✅ Sample data included for testing

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- SQL injection protection
- Input validation and sanitization

## Development

### Adding New Tables

1. Add table definition to `mysql_setup.sql`
2. Update the `createCrudRoutes` calls in `backend/routes/master.js`
3. Add any specific validations needed

### Custom Queries

Use the database helper functions:

```javascript
const { query, transaction } = require('./lib/database');

// Simple query
const users = await query('SELECT * FROM users WHERE role = ?', ['admin']);

// Transaction
await transaction(async (connection) => {
  await connection.execute('INSERT INTO table1 VALUES (?)', [value1]);
  await connection.execute('INSERT INTO table2 VALUES (?)', [value2]);
});
```

## Production Deployment

For production:

1. Use strong passwords for MySQL
2. Set secure JWT_SECRET and ENCRYPTION_KEY
3. Configure proper MySQL user privileges
4. Use connection pooling (already configured)
5. Set up MySQL backups
6. Configure firewall rules

## Support

If you encounter issues:

1. Check the console logs for error messages
2. Verify MySQL connection settings
3. Ensure all required tables exist
4. Check user permissions in MySQL

The system is now fully functional with MySQL and ready for development and production use!