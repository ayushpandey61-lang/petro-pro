# Quick Start - MySQL Setup

## 🚀 Two Ways to Get Started

### Option 1: Docker (Recommended - Fastest)

**No MySQL installation needed!** Docker will handle everything.

1. **Install Docker Desktop**
   - Download from: https://www.docker.com/products/docker-desktop
   - Install and start Docker Desktop

2. **Start Everything**
   ```bash
   docker-compose up -d
   ```
   
   This single command will:
   - ✅ Start MySQL database
   - ✅ Create all tables
   - ✅ Add default data
   - ✅ Start backend server
   - ✅ Start frontend

3. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MySQL: localhost:3306

4. **Login**
   - Email: `admin@petrolpump.com`
   - Password: `admin123`

5. **View Logs**
   ```bash
   docker-compose logs -f
   ```

6. **Stop Everything**
   ```bash
   docker-compose down
   ```

---

### Option 2: Local MySQL Installation

1. **Install MySQL**
   - Windows: Download from https://dev.mysql.com/downloads/mysql/
   - During installation, set root password

2. **Create Database**
   ```bash
   mysql -u root -p
   ```
   
   Then run:
   ```sql
   CREATE DATABASE petrol_pump;
   CREATE USER 'petrol_user'@'localhost' IDENTIFIED BY 'petrol_password';
   GRANT ALL PRIVILEGES ON petrol_pump.* TO 'petrol_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

3. **Initialize Database**
   ```bash
   node database/init-mysql.js
   ```

4. **Start Backend**
   ```bash
   cd backend
   npm start
   ```

5. **Start Frontend** (in new terminal)
   ```bash
   cd frontend
   npm run dev
   ```

---

## 🧪 Test Your Setup

Run the connection test:
```bash
node test-mysql-connection.js
```

This will verify:
- ✅ MySQL connection
- ✅ Database exists
- ✅ Tables created
- ✅ Credentials work

---

## 📋 What You Get

After setup, your database includes:

✅ **20+ Tables** for complete petrol pump management
✅ **Default Admin User** (admin@petrolpump.com / admin123)
✅ **Role-Based Access Control** (Super Admin, Manager, Supervisor, Operator)
✅ **Sample Data** (Fuel products, etc.)
✅ **All Relationships** properly configured

---

## 🔧 Configuration

All settings are in `.env` file:

```env
# Database
DB_HOST=localhost
DB_USER=petrol_user
DB_PASSWORD=petrol_password
DB_NAME=petrol_pump

# Security
JWT_SECRET=your_jwt_secret_key_change_in_production
ENCRYPTION_KEY=your_encryption_key_change_in_production
```

**⚠️ Change these in production!**

---

## 📚 Database Features

### Tables Included:
- **User Management**: users, roles, permissions, role_permissions
- **Master Data**: employees, fuel_products, liquids, lubricants, vendors
- **Operations**: tanks, nozzles, tank_dips, tank_lorry_management
- **Financial**: credit_parties, business_cr_dr_parties, denominations
- **Configuration**: shifts, swipe_machines, expense_types, print_templates
- **Customers**: guest_customers, expiry_items

### Relationships:
- Foreign keys properly configured
- Cascading deletes where appropriate
- Indexed for performance

---

## 🆘 Troubleshooting

### "Connection refused"
- **Docker**: Run `docker-compose up -d mysql`
- **Local**: Start MySQL service

### "Access denied"
- Check credentials in `.env`
- Verify MySQL user exists

### "Database not found"
- Run: `node database/init-mysql.js`

### Backend won't start
- Test connection: `node test-mysql-connection.js`
- Check MySQL is running
- Verify `.env` settings

---

## 🎯 Next Steps

1. ✅ Setup MySQL (Docker or Local)
2. ✅ Run initialization script
3. ✅ Test connection
4. ✅ Start application
5. ✅ Login and change password
6. 📖 Read full guide: `MYSQL_SETUP_GUIDE.md`

---

## 💡 Pro Tips

- **Use Docker** for easiest setup
- **Backup regularly**: `mysqldump -u petrol_user -p petrol_pump > backup.sql`
- **Monitor logs**: `docker-compose logs -f backend`
- **Change default passwords** immediately in production

---

## ✅ Success Checklist

- [ ] Docker installed (Option 1) OR MySQL installed (Option 2)
- [ ] Database created
- [ ] Tables initialized
- [ ] Connection test passes
- [ ] Backend starts without errors
- [ ] Can login to application
- [ ] Default password changed

---

Need help? Check `MYSQL_SETUP_GUIDE.md` for detailed instructions.
