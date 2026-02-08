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
    txn_no TEXT UNIQUE,
    sale_date DATE NOT NULL,
    product_id INTEGER,
    quantity REAL NOT NULL,
    rate REAL NOT NULL,
    amount REAL,
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

-- Insert comprehensive granular permissions
INSERT OR IGNORE INTO permissions (name, description) VALUES

-- Core System Permissions
('dashboard.access', 'Access dashboard'),
('dashboard.export', 'Export dashboard data'),
('dashboard.configure', 'Configure dashboard settings'),
('settings.view', 'View settings'),
('settings.edit', 'Edit settings'),
('settings.manage', 'Manage system settings'),

-- Master Data Permissions
('fuel_product.access', 'Access fuel products'),
('fuel_product.add', 'Add fuel products'),
('fuel_product.update', 'Update fuel products'),
('fuel_product.delete', 'Delete fuel products'),
('fuel_product.view', 'View fuel products'),

('lubricants.access', 'Access lubricants'),
('lubricants.add', 'Add lubricants'),
('lubricants.update', 'Update lubricants'),
('lubricants.delete', 'Delete lubricants'),
('lubricants.view', 'View lubricants'),

('employee.access', 'Access employees'),
('employee.add', 'Add employees'),
('employee.update', 'Update employees'),
('employee.delete', 'Delete employees'),
('employee.view', 'View employees'),

('credit_party.access', 'Access credit parties'),
('credit_party.add', 'Add credit parties'),
('credit_party.update', 'Update credit parties'),
('credit_party.delete', 'Delete credit parties'),
('credit_party.view', 'View credit parties'),

('vendor.access', 'Access vendors'),
('vendor.add', 'Add vendors'),
('vendor.update', 'Update vendors'),
('vendor.delete', 'Delete vendors'),
('vendor.view', 'View vendors'),

('tank_nozzle.access', 'Access tanks and nozzles'),
('tank_nozzle.add', 'Add tanks and nozzles'),
('tank_nozzle.update', 'Update tanks and nozzles'),
('tank_nozzle.delete', 'Delete tanks and nozzles'),
('tank_nozzle.view', 'View tanks and nozzles'),

('pump_setting.access', 'Access pump settings'),
('pump_setting.add', 'Add pump settings'),
('pump_setting.update', 'Update pump settings'),
('pump_setting.delete', 'Delete pump settings'),
('pump_setting.view', 'View pump settings'),

('expenses_type.access', 'Access expense types'),
('expenses_type.add', 'Add expense types'),
('expenses_type.update', 'Update expense types'),
('expenses_type.delete', 'Delete expense types'),
('expenses_type.view', 'View expense types'),

('business_parties.access', 'Access business parties'),
('business_parties.add', 'Add business parties'),
('business_parties.update', 'Update business parties'),
('business_parties.delete', 'Delete business parties'),
('business_parties.view', 'View business parties'),

('swipe_machine.access', 'Access swipe machines'),
('swipe_machine.add', 'Add swipe machines'),
('swipe_machine.update', 'Update swipe machines'),
('swipe_machine.delete', 'Delete swipe machines'),
('swipe_machine.view', 'View swipe machines'),

('expiry_item.access', 'Access expiry items'),
('expiry_item.add', 'Add expiry items'),
('expiry_item.update', 'Update expiry items'),
('expiry_item.delete', 'Delete expiry items'),
('expiry_item.view', 'View expiry items'),

('duty_shift.access', 'Access duty shifts'),
('duty_shift.add', 'Add duty shifts'),
('duty_shift.update', 'Update duty shifts'),
('duty_shift.delete', 'Delete duty shifts'),
('duty_shift.view', 'View duty shifts'),

('print_template.access', 'Access print templates'),
('print_template.add', 'Add print templates'),
('print_template.update', 'Update print templates'),
('print_template.delete', 'Delete print templates'),
('print_template.view', 'View print templates'),

('guest_customer.access', 'Access guest customers'),
('guest_customer.add', 'Add guest customers'),
('guest_customer.update', 'Update guest customers'),
('guest_customer.delete', 'Delete guest customers'),
('guest_customer.view', 'View guest customers'),

('denomination.access', 'Access denominations'),
('denomination.add', 'Add denominations'),
('denomination.update', 'Update denominations'),
('denomination.delete', 'Delete denominations'),
('denomination.view', 'View denominations'),

('tank_lorry.access', 'Access tank lorry management'),
('tank_lorry.add', 'Add tank lorry records'),
('tank_lorry.update', 'Update tank lorry records'),
('tank_lorry.delete', 'Delete tank lorry records'),
('tank_lorry.view', 'View tank lorry records'),

-- Daily Business Permissions
('day_assigning.access', 'Access day assigning'),
('day_assigning.add', 'Add day assignments'),
('day_assigning.update', 'Update day assignments'),
('day_assigning.delete', 'Delete day assignments'),
('day_assigning.view', 'View day assignments'),

('daily_sale_rate.access', 'Access daily sale rates'),
('daily_sale_rate.add', 'Add daily sale rates'),
('daily_sale_rate.update', 'Update daily sale rates'),
('daily_sale_rate.delete', 'Delete daily sale rates'),
('daily_sale_rate.view', 'View daily sale rates'),

('sale_entry.access', 'Access sale entries'),
('sale_entry.add', 'Add sale entries'),
('sale_entry.update', 'Update sale entries'),
('sale_entry.delete', 'Delete sale entries'),
('sale_entry.view', 'View sale entries'),

('lubricants_sale.access', 'Access lubricant sales'),
('lubricants_sale.add', 'Add lubricant sales'),
('lubricants_sale.update', 'Update lubricant sales'),
('lubricants_sale.delete', 'Delete lubricant sales'),
('lubricants_sale.view', 'View lubricant sales'),

('swipe.access', 'Access swipe transactions'),
('swipe.add', 'Add swipe transactions'),
('swipe.update', 'Update swipe transactions'),
('swipe.delete', 'Delete swipe transactions'),
('swipe.view', 'View swipe transactions'),

('credit_sale.access', 'Access credit sales'),
('credit_sale.add', 'Add credit sales'),
('credit_sale.update', 'Update credit sales'),
('credit_sale.delete', 'Delete credit sales'),
('credit_sale.view', 'View credit sales'),

('expenses.access', 'Access expenses'),
('expenses.add', 'Add expenses'),
('expenses.update', 'Update expenses'),
('expenses.delete', 'Delete expenses'),
('expenses.view', 'View expenses'),

('recovery.access', 'Access recoveries'),
('recovery.add', 'Add recoveries'),
('recovery.update', 'Update recoveries'),
('recovery.delete', 'Delete recoveries'),
('recovery.view', 'View recoveries'),

('employee_cash_recovery.access', 'Access employee cash recovery'),
('employee_cash_recovery.add', 'Add employee cash recovery'),
('employee_cash_recovery.update', 'Update employee cash recovery'),
('employee_cash_recovery.delete', 'Delete employee cash recovery'),
('employee_cash_recovery.view', 'View employee cash recovery'),

('day_opening_stock.access', 'Access day opening stock'),
('day_opening_stock.add', 'Add day opening stock'),
('day_opening_stock.update', 'Update day opening stock'),
('day_opening_stock.delete', 'Delete day opening stock'),
('day_opening_stock.view', 'View day opening stock'),

('day_settlement.access', 'Access day settlement'),
('day_settlement.add', 'Add day settlement'),
('day_settlement.update', 'Update day settlement'),
('day_settlement.delete', 'Delete day settlement'),
('day_settlement.view', 'View day settlement'),

-- Invoice & Transaction Permissions
('liquid_purchase.access', 'Access liquid purchases'),
('liquid_purchase.add', 'Add liquid purchases'),
('liquid_purchase.update', 'Update liquid purchases'),
('liquid_purchase.delete', 'Delete liquid purchases'),
('liquid_purchase.view', 'View liquid purchases'),

('lube_purchase.access', 'Access lube purchases'),
('lube_purchase.add', 'Add lube purchases'),
('lube_purchase.update', 'Update lube purchases'),
('lube_purchase.delete', 'Delete lube purchases'),
('lube_purchase.view', 'View lube purchases'),

('statement_generation.access', 'Access statement generation'),
('statement_generation.add', 'Generate statements'),
('statement_generation.update', 'Update statements'),
('statement_generation.delete', 'Delete statements'),
('statement_generation.view', 'View statements'),

('business_transaction.access', 'Access business transactions'),
('business_transaction.add', 'Add business transactions'),
('business_transaction.update', 'Update business transactions'),
('business_transaction.delete', 'Delete business transactions'),
('business_transaction.view', 'View business transactions'),

('vendor_transaction.access', 'Access vendor transactions'),
('vendor_transaction.add', 'Add vendor transactions'),
('vendor_transaction.update', 'Update vendor transactions'),
('vendor_transaction.delete', 'Delete vendor transactions'),
('vendor_transaction.view', 'View vendor transactions'),

('sales_invoice.access', 'Access sales invoices'),
('sales_invoice.add', 'Generate sales invoices'),
('sales_invoice.update', 'Update sales invoices'),
('sales_invoice.delete', 'Delete sales invoices'),
('sales_invoice.view', 'View sales invoices'),

-- Reports & Analytics Permissions
('reports.access', 'Access reports'),
('reports.view', 'View reports'),
('reports.export', 'Export reports'),
('reports.generate', 'Generate reports'),

('product_stock.access', 'Access product stock'),
('product_stock.view', 'View product stock'),
('product_stock.export', 'Export stock data'),
('product_stock.analyze', 'Analyze stock data'),

('credit_limit_reports.access', 'Access credit limit reports'),
('credit_limit_reports.view', 'View credit limit reports'),
('credit_limit_reports.export', 'Export credit reports'),
('credit_limit_reports.analyze', 'Analyze credit data'),

('attendance.access', 'Access attendance'),
('attendance.view', 'View attendance'),
('attendance.export', 'Export attendance data'),
('attendance.manage', 'Manage attendance'),

('daily_collection_report.access', 'Access daily collection reports'),
('daily_collection_report.view', 'View collection reports'),
('daily_collection_report.export', 'Export collection data'),
('daily_collection_report.generate', 'Generate collection reports'),

-- System Administration Permissions
('user_management.access', 'Access user management'),
('user_management.add', 'Add users'),
('user_management.update', 'Update users'),
('user_management.delete', 'Delete users'),
('user_management.view', 'View users'),

('role_permissions.access', 'Access role permissions'),
('role_permissions.manage', 'Manage roles and permissions'),
('role_permissions.assign', 'Assign permissions'),
('role_permissions.revoke', 'Revoke permissions'),

('backup_data.access', 'Access backup data'),
('backup_data.create', 'Create backups'),
('backup_data.restore', 'Restore from backup'),
('backup_data.delete', 'Delete backups'),

('system_settings.access', 'Access system settings'),
('system_settings.configure', 'Configure system'),
('system_settings.manage', 'Manage system'),
('system_settings.audit', 'Audit system logs'),

-- Special Permissions
('miscellaneous.access', 'Access miscellaneous features'),
('id_card_generator.access', 'Access ID card generator'),
('shift_sheet_entry.access', 'Access shift sheet entry');

-- Assign ALL permissions to Super Admin role
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'Super Admin';

-- Assign comprehensive permissions to Manager role (most CRUD operations)
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'Manager' AND p.name NOT LIKE '%delete' AND p.name NOT LIKE '%manage' AND p.name NOT LIKE '%audit';

-- Assign operational permissions to Supervisor role (view, add, update but no delete)
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'Supervisor' AND (p.name LIKE '%.access' OR p.name LIKE '%.view' OR p.name LIKE '%.add' OR p.name LIKE '%.update' OR p.name LIKE '%.export' OR p.name LIKE '%.generate');

-- Assign basic view permissions to Operator role
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'Operator' AND (p.name LIKE '%.access' OR p.name LIKE '%.view');

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