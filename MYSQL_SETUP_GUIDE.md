# MySQL Database Setup Guide for Petrol Pump Management System

## Overview
This guide will help you set up MySQL database for your Petrol Pump Management System. The application now supports MySQL as the primary database.

## Prerequisites
- MySQL Server 8.0 or higher installed on your system
- Node.js and npm installed
- Basic knowledge of command line

## Setup Options

### Option 1: Local MySQL Setup (Development)

#### Step 1: Install MySQL
If you don't have MySQL installed, download and install it from:
- **Windows**: https://dev.mysql.com/downloads/mysql/
- **MacOS**: `brew install mysql`
- **Linux**: `sudo apt-get install mysql-server`

#### Step 2: Start MySQL Service
- **Windows**: MySQL service should start automatically or use Services app
- **MacOS**: `brew services start mysql`
- **Linux**: `sudo systemctl start mysql`

#### Step 3: Secure MySQL Installation
```bash
mysql_secure_installation
```

#### Step 4: Create Database and User
Login to MySQL as root:
```bash
mysql -u root -p
```

Run the following SQL commands:
```sql
CREATE DATABASE petrol_pump;
CREATE USER 'petrol_user'@'localhost' IDENTIFIED BY 'petrol_password';
GRANT ALL PRIVILEGES ON petrol_pump.* TO 'petrol_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Step 5: Configure Environment Variables
The `.env` file has been created in the root directory with MySQL configuration:
```env
DB_HOST=localhost
DB_USER=petrol_user
DB_PASSWORD=petrol_password
DB_NAME=petrol_pump
```

**⚠️ IMPORTANT**: Change these credentials in production!

#### Step 6: Initialize Database
Run the initialization script to create tables and seed data:
```bash
node database/init-mysql.js
```

This will:
- Create all required tables
- Insert default roles and permissions
- Create default admin user
- Add sample data

#### Step 7: Start the Application
```bash
cd backend
npm start
```

The backend will automatically connect to MySQL database.

---

### Option 2: Docker Setup (Production)

#### Step 1: Install Docker
Download and install Docker Desktop from https://www.docker.com/products/docker-desktop

#### Step 2: Configure Environment
Edit the `.env` file to set production credentials:
```env
DB_ROOT_PASSWORD=your_secure_root_password
DB_USER=petrol_user
DB_PASSWORD=your_secure_password
DB_NAME=petrol_pump
JWT_SECRET=your_secure_jwt_secret
ENCRYPTION_KEY=your_secure_encryption_key
```

#### Step 3: Start Services with Docker Compose
```bash
docker-compose up -d
```

This will:
- Start MySQL container
- Initialize database with tables and data
- Start backend container
- Start frontend container

#### Step 4: Check Service Status
```bash
docker-compose ps
```

#### Step 5: View Logs
```bash
docker-compose logs -f
```

#### Step 6: Stop Services
```bash
docker-compose down
```

To stop and remove all data:
```bash
docker-compose down -v
```

---

## Default Credentials

After initialization, you can login with:
- **Email**: admin@petrolpump.com
- **Password**: admin123

**⚠️ IMPORTANT**: Change this password immediately after first login!

---

## Database Structure

The MySQL database includes the following tables:

### Core Tables
- `users` - User authentication and management
- `roles` - User roles (Super Admin, Manager, Supervisor, Operator)
- `permissions` - System permissions
- `role_permissions` - Role-permission mapping

### Master Data Tables
- `employees` - Employee information
- `fuel_products` - Fuel types and prices
- `liquids` - Liquid products
- `lubricants` - Lubricant products
- `vendors` - Vendor information
- `credit_parties` - Credit party management
- `tanks` - Storage tank information
- `nozzles` - Fuel nozzle configuration
- `swipe_machines` - Payment machine details
- `shifts` - Shift timing configuration
- `expense_types` - Expense categories
- `business_cr_dr_parties` - Business credit/debit parties
- `denominations` - Currency denominations
- `guest_customers` - Guest customer records
- `print_templates` - Print template configurations
- `expiry_items` - Items with expiry tracking

### Operational Tables
- `tank_dips` - Tank dip reading records
- `tank_lorry_management` - Lorry delivery management

---

## Backup and Restore

### Backup Database
```bash
mysqldump -u petrol_user -p petrol_pump > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
mysql -u petrol_user -p petrol_pump < backup_20260208.sql
```

### Docker Backup
```bash
docker exec petrol-pump-mysql mysqldump -u petrol_user -p petrol_pump > backup.sql
```

---

## Troubleshooting

### Connection Refused
- Check if MySQL service is running
- Verify credentials in `.env` file
- Check firewall settings

### Access Denied
- Verify user permissions in MySQL
- Check username and password in `.env`

### Table Not Found
- Run initialization script: `node database/init-mysql.js`
- Check if database exists: `SHOW DATABASES;`

### Port Already in Use
- Change MySQL port in `docker-compose.yml`
- Stop other MySQL instances

---

## Performance Optimization

### Recommended MySQL Configuration
Add to MySQL configuration file (`my.cnf` or `my.ini`):
```ini
[mysqld]
max_connections = 200
innodb_buffer_pool_size = 256M
query_cache_size = 64M
```

### Index Optimization
Major tables already have primary keys and foreign keys indexed. For large datasets, consider adding indexes on frequently queried columns.

---

## Security Best Practices

1. **Change Default Credentials**: Always change default passwords
2. **Use Strong Passwords**: Minimum 12 characters with mixed case, numbers, and symbols
3. **Regular Backups**: Schedule daily automated backups
4. **Update Regularly**: Keep MySQL updated to latest stable version
5. **Limit Access**: Only allow connections from trusted IPs
6. **Use SSL**: Enable SSL for production environments

---

## Migration from SQLite

If you were using SQLite before, you can migrate data:

1. Export data from SQLite
2. Transform data format if needed
3. Import into MySQL using `LOAD DATA INFILE` or INSERT statements

Contact support for migration assistance.

---

## Support

For issues or questions:
- Check logs: `docker-compose logs backend`
- Review MySQL error log
- Ensure all environment variables are set correctly

---

## Why MySQL for This Application?

MySQL is **the best choice** for this Petrol Pump Management System because:

1. **ACID Compliance**: Ensures data integrity for financial transactions
2. **Performance**: Handles concurrent users and transactions efficiently
3. **Scalability**: Grows with your business
4. **Reliability**: Battle-tested in production environments
5. **Rich Features**: Triggers, stored procedures, views for complex operations
6. **Community Support**: Extensive documentation and community
7. **Backup & Recovery**: Robust tools for data protection
8. **Replication**: Easy to set up master-slave for high availability

The application is pre-configured with MySQL support and includes all necessary tables, relationships, and initial data.
