-- Complete SQLite Database Setup for Petrol Pump Management System

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_id INTEGER,
    permission_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE(role_id, permission_id)
);

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'Operator',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    salary REAL,
    join_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create fuel_products table
CREATE TABLE IF NOT EXISTS fuel_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    unit TEXT DEFAULT 'liter',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create liquids table
CREATE TABLE IF NOT EXISTS liquids (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create lubricants table
CREATE TABLE IF NOT EXISTS lubricants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create credit_parties table
CREATE TABLE IF NOT EXISTS credit_parties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    credit_limit REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create tanks table
CREATE TABLE IF NOT EXISTS tanks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    capacity REAL NOT NULL,
    current_stock REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create nozzles table
CREATE TABLE IF NOT EXISTS nozzles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    tank_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tank_id) REFERENCES tanks(id) ON DELETE SET NULL
);

-- Create expense_types table
CREATE TABLE IF NOT EXISTS expense_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create business_cr_dr_parties table
CREATE TABLE IF NOT EXISTS business_cr_dr_parties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT DEFAULT 'credit',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create swipe_machines table
CREATE TABLE IF NOT EXISTS swipe_machines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    bank_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create expiry_items table
CREATE TABLE IF NOT EXISTS expiry_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    expiry_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create shifts table
CREATE TABLE IF NOT EXISTS shifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    start_time TEXT,
    end_time TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create print_templates table
CREATE TABLE IF NOT EXISTS print_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    template TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create guest_customers table
CREATE TABLE IF NOT EXISTS guest_customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create denominations table
CREATE TABLE IF NOT EXISTS denominations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create tank_dips table
CREATE TABLE IF NOT EXISTS tank_dips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tank_id INTEGER,
    dip_reading REAL NOT NULL,
    volume REAL NOT NULL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tank_id) REFERENCES tanks(id) ON DELETE CASCADE
);

-- Create tank_lorry_management table
CREATE TABLE IF NOT EXISTS tank_lorry_management (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lorry_number TEXT NOT NULL,
    vendor_id INTEGER,
    fuel_type TEXT,
    quantity REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL
);

-- Day Business Tables
CREATE TABLE IF NOT EXISTS day_assigning (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    employee_id INTEGER,
    shift_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL,
    FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS daily_sale_rates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    fuel_product_id INTEGER,
    rate REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fuel_product_id) REFERENCES fuel_products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sale_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    nozzle_id INTEGER,
    opening_reading REAL NOT NULL,
    closing_reading REAL NOT NULL,
    total_sale REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nozzle_id) REFERENCES nozzles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS lube_sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_date DATE NOT NULL,
    product_id INTEGER,
    quantity REAL NOT NULL,
    rate REAL NOT NULL,
    amount REAL NOT NULL,
    discount REAL DEFAULT 0,
    shift_id INTEGER,
    employee_id INTEGER,
    description TEXT,
    sale_type TEXT DEFAULT 'Cash',
    gst_no TEXT,
    bill_no TEXT,
    indent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES lubricants(id) ON DELETE SET NULL,
    FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE SET NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS swipe_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    amount REAL NOT NULL,
    card_number TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS credit_sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    customer_id INTEGER,
    amount REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES credit_parties(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    expense_type_id INTEGER,
    amount REAL NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (expense_type_id) REFERENCES expense_types(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS recovery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    employee_id INTEGER,
    amount REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS day_opening_stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    tank_id INTEGER,
    opening_stock REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tank_id) REFERENCES tanks(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS day_settlement (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    total_sales REAL NOT NULL,
    total_expenses REAL NOT NULL,
    net_amount REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT OR IGNORE INTO roles (name, description) VALUES
('Super Admin', 'Full system access'),
('Manager', 'Management level access'),
('Supervisor', 'Supervisory access'),
('Operator', 'Basic operational access');

-- Insert default permissions
INSERT OR IGNORE INTO permissions (name, description) VALUES
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
('super_admin.view', 'Super admin access');

-- Assign permissions to Super Admin role
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'Super Admin';

-- Assign basic permissions to Manager role
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'Manager' AND p.name IN ('dashboard.view', 'master.view', 'master.edit', 'day_business.view', 'day_business.edit', 'invoice.view', 'invoice.create', 'reports.view');

-- Assign limited permissions to Supervisor role
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'Supervisor' AND p.name IN ('dashboard.view', 'day_business.view', 'day_business.edit', 'reports.view');

-- Assign minimal permissions to Operator role
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'Operator' AND p.name IN ('dashboard.view', 'day_business.view');

-- Insert sample data
INSERT OR IGNORE INTO employees (name, email, phone, salary) VALUES
('John Doe', 'john@example.com', '1234567890', 50000.00),
('Jane Smith', 'jane@example.com', '0987654321', 45000.00);

INSERT OR IGNORE INTO fuel_products (name, price) VALUES
('Petrol', 100.50),
('Diesel', 95.25);

INSERT OR IGNORE INTO shifts (name, start_time, end_time) VALUES
('Morning Shift', '06:00', '14:00'),
('Evening Shift', '14:00', '22:00'),
('Night Shift', '22:00', '06:00');

INSERT OR IGNORE INTO tanks (name, capacity, current_stock) VALUES
('Tank 1', 10000.00, 7500.00),
('Tank 2', 15000.00, 12000.00);

INSERT OR IGNORE INTO nozzles (name, tank_id) VALUES
('Nozzle 1', 1),
('Nozzle 2', 1),
('Nozzle 3', 2),
('Nozzle 4', 2);

-- Insert default admin user (password: password123)
INSERT OR IGNORE INTO users (email, password_hash, role) VALUES
('admin@petrolpump.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Super Admin');