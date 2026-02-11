const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
  console.log('🔄 Starting MySQL database initialization...');
  
  try {
    // Create connection without database selection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'petrol_user',
      password: process.env.DB_PASSWORD || 'petrol_password'
    });

    console.log('✅ Connected to MySQL server');

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'petrol_pump'}`);
    console.log(`✅ Database '${process.env.DB_NAME || 'petrol_pump'}' created or already exists`);

    // Use the database
    await connection.query(`USE ${process.env.DB_NAME || 'petrol_pump'}`);

    // Create all tables
    const tables = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'Operator',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Roles table
      `CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Permissions table
      `CREATE TABLE IF NOT EXISTS permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Role permissions junction table
      `CREATE TABLE IF NOT EXISTS role_permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role_id INT,
        permission_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
        UNIQUE KEY unique_role_permission (role_id, permission_id)
      )`,

      // Employees table
      `CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        address TEXT,
        salary DECIMAL(10,2),
        join_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Fuel products table
      `CREATE TABLE IF NOT EXISTS fuel_products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        unit VARCHAR(50) DEFAULT 'liter',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Liquids table
      `CREATE TABLE IF NOT EXISTS liquids (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Lubricants table
      `CREATE TABLE IF NOT EXISTS lubricants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Credit parties table
      `CREATE TABLE IF NOT EXISTS credit_parties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        credit_limit DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Vendors table
      `CREATE TABLE IF NOT EXISTS vendors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Tanks table
      `CREATE TABLE IF NOT EXISTS tanks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        capacity DECIMAL(10,2) NOT NULL,
        current_stock DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Nozzles table
      `CREATE TABLE IF NOT EXISTS nozzles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        tank_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (tank_id) REFERENCES tanks(id) ON DELETE SET NULL
      )`,

      // Expense types table
      `CREATE TABLE IF NOT EXISTS expense_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Business CR/DR parties table
      `CREATE TABLE IF NOT EXISTS business_cr_dr_parties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type ENUM('credit', 'debit') DEFAULT 'credit',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Swipe machines table
      `CREATE TABLE IF NOT EXISTS swipe_machines (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        bank_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Expiry items table
      `CREATE TABLE IF NOT EXISTS expiry_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        expiry_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Shifts table
      `CREATE TABLE IF NOT EXISTS shifts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        start_time TIME,
        end_time TIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Print templates table
      `CREATE TABLE IF NOT EXISTS print_templates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        template TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Guest customers table
      `CREATE TABLE IF NOT EXISTS guest_customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Denominations table
      `CREATE TABLE IF NOT EXISTS denominations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        value DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Tank dips table
      `CREATE TABLE IF NOT EXISTS tank_dips (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tank_id INT,
        dip_reading DECIMAL(10,2) NOT NULL,
        volume DECIMAL(10,2) NOT NULL,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tank_id) REFERENCES tanks(id) ON DELETE CASCADE
      )`,

      // Tank lorry management table
      `CREATE TABLE IF NOT EXISTS tank_lorry_management (
        id INT AUTO_INCREMENT PRIMARY KEY,
        lorry_number VARCHAR(255) NOT NULL,
        vendor_id INT,
        fuel_type VARCHAR(255),
        quantity DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL
      )`
    ];

    console.log('🔄 Creating tables...');
    for (const table of tables) {
      await connection.query(table);
    }
    console.log('✅ All tables created successfully');

    // Insert default roles
    await connection.query(`
      INSERT INTO roles (name, description) VALUES
      ('Super Admin', 'Full system access'),
      ('Manager', 'Management level access'),
      ('Supervisor', 'Supervisory access'),
      ('Operator', 'Basic operational access')
      ON DUPLICATE KEY UPDATE name=name
    `);
    console.log('✅ Default roles inserted');

    // Insert default permissions
    await connection.query(`
      INSERT INTO permissions (name, description) VALUES
      ('dashboard.view', 'View dashboard'),
      ('master.view', 'View master data'),
      ('master.edit', 'Edit master data'),
      ('day_business.view', 'View day business'),
      ('day_business.edit', 'Edit day business'),
      ('invoice.view', 'View invoices'),
      ('invoice.create', 'Create invoices'),
      ('reports.view', 'View reports'),
      ('permissions.manage', 'Manage permissions'),
      ('settings.view', 'View settings'),
      ('super_admin.view', 'Super admin access')
      ON DUPLICATE KEY UPDATE name=name
    `);
    console.log('✅ Default permissions inserted');

    // Assign all permissions to Super Admin
    await connection.query(`
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT r.id, p.id
      FROM roles r, permissions p
      WHERE r.name = 'Super Admin'
      ON DUPLICATE KEY UPDATE role_id=role_id
    `);
    console.log('✅ Permissions assigned to Super Admin');

    // Insert default admin user (password: admin123)
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.query(`
      INSERT INTO users (email, password_hash, role) VALUES
      ('admin@petrolpump.com', ?, 'Super Admin')
      ON DUPLICATE KEY UPDATE email=email
    `, [hashedPassword]);
    console.log('✅ Default admin user created (email: admin@petrolpump.com, password: admin123)');

    // Insert sample data
    await connection.query(`
      INSERT INTO fuel_products (name, price) VALUES
      ('Petrol', 100.50),
      ('Diesel', 95.25),
      ('Premium Petrol', 110.00)
      ON DUPLICATE KEY UPDATE name=name
    `);
    console.log('✅ Sample fuel products inserted');

    await connection.close();
    console.log('✅ MySQL database initialization completed successfully!');
    console.log('\n📋 Default credentials:');
    console.log('   Email: admin@petrolpump.com');
    console.log('   Password: admin123');
    console.log('\n⚠️  Please change the default password after first login!\n');

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();
