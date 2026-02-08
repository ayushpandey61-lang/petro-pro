const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'petrol_pump.db');
const sqlFilePath = path.join(__dirname, '../database/sqlite_setup.sql');

console.log('Setting up database tables...');
console.log('Database path:', dbPath);
console.log('SQL file path:', sqlFilePath);

const db = new sqlite3.Database(dbPath);

console.log('Creating roles table...');
db.run(`CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
  if (err) console.error('Error creating roles table:', err);
  else console.log('✅ Roles table created');

  console.log('Creating permissions table...');
  db.run(`CREATE TABLE IF NOT EXISTS permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) console.error('Error creating permissions table:', err);
    else console.log('✅ Permissions table created');

    console.log('Creating role_permissions table...');
    db.run(`CREATE TABLE IF NOT EXISTS role_permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role_id INTEGER,
      permission_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
      FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
      UNIQUE(role_id, permission_id)
    )`, (err) => {
      if (err) console.error('Error creating role_permissions table:', err);
      else console.log('✅ Role_permissions table created');

      console.log('Inserting default roles...');
      db.run(`INSERT OR IGNORE INTO roles (name, description) VALUES
        ('Super Admin', 'Full system access'),
        ('Manager', 'Management level access'),
        ('Supervisor', 'Supervisory access'),
        ('Operator', 'Basic operational access')`, (err) => {
        if (err) console.error('Error inserting roles:', err);
        else console.log('✅ Default roles inserted');

        console.log('Inserting default permissions...');
        db.run(`INSERT OR IGNORE INTO permissions (name, description) VALUES
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
          ('super_admin.view', 'Super admin access')`, (err) => {
          if (err) console.error('Error inserting permissions:', err);
          else console.log('✅ Default permissions inserted');

          console.log('Creating lube_sales table...');
          db.run(`CREATE TABLE IF NOT EXISTS lube_sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            txn_no VARCHAR(50) UNIQUE,
            sale_date DATE NOT NULL,
            product_id VARCHAR(36) NOT NULL,
            quantity DECIMAL(10,2) NOT NULL,
            rate DECIMAL(10,2) NOT NULL,
            amount DECIMAL(10,2),
            discount DECIMAL(10,2) DEFAULT 0,
            shift_id VARCHAR(36),
            employee_id VARCHAR(36),
            description TEXT,
            sale_type VARCHAR(20) DEFAULT 'Cash',
            gst_no VARCHAR(50),
            bill_no VARCHAR(50),
            indent VARCHAR(100),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )`, (err) => {
            if (err) console.error('Error creating lube_sales table:', err);
            else console.log('✅ Lube_sales table created');

            console.log('Creating indexes for lube_sales...');
            db.run('CREATE INDEX IF NOT EXISTS idx_lube_sales_date ON lube_sales(sale_date)', (err) => {
              if (err) console.error('Error creating index:', err);
              else console.log('✅ Index idx_lube_sales_date created');

              console.log('✅ Database setup completed successfully!');
              db.close();
            });
          });
        });
      });
    });
  });
});