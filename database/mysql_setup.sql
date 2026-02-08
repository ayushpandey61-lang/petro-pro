-- MySQL Database Setup for Petrol Pump Management System
-- Run this script to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS petrol_pump;
USE petrol_pump;

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Operator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT,
    permission_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (role_id, permission_id)
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    salary DECIMAL(10,2),
    join_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create fuel_products table
CREATE TABLE IF NOT EXISTS fuel_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) DEFAULT 'liter',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create liquids table
CREATE TABLE IF NOT EXISTS liquids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create lubricants table
CREATE TABLE IF NOT EXISTS lubricants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create credit_parties table
CREATE TABLE IF NOT EXISTS credit_parties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    credit_limit DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create tanks table
CREATE TABLE IF NOT EXISTS tanks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    capacity DECIMAL(10,2) NOT NULL,
    current_stock DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create nozzles table
CREATE TABLE IF NOT EXISTS nozzles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tank_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tank_id) REFERENCES tanks(id) ON DELETE SET NULL
);

-- Create expense_types table
CREATE TABLE IF NOT EXISTS expense_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create business_cr_dr_parties table
CREATE TABLE IF NOT EXISTS business_cr_dr_parties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('credit', 'debit') DEFAULT 'credit',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create swipe_machines table
CREATE TABLE IF NOT EXISTS swipe_machines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bank_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create expiry_items table
CREATE TABLE IF NOT EXISTS expiry_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create shifts table
CREATE TABLE IF NOT EXISTS shifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_time TIME,
    end_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create print_templates table
CREATE TABLE IF NOT EXISTS print_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    template TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create guest_customers table
CREATE TABLE IF NOT EXISTS guest_customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create denominations table
CREATE TABLE IF NOT EXISTS denominations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create tank_dips table
CREATE TABLE IF NOT EXISTS tank_dips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tank_id INT,
    dip_reading DECIMAL(10,2) NOT NULL,
    volume DECIMAL(10,2) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tank_id) REFERENCES tanks(id) ON DELETE CASCADE
);

-- Create tank_lorry_management table
CREATE TABLE IF NOT EXISTS tank_lorry_management (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lorry_number VARCHAR(255) NOT NULL,
    vendor_id INT,
    fuel_type VARCHAR(255),
    quantity DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('Super Admin', 'Full system access'),
('Manager', 'Management level access'),
('Supervisor', 'Supervisory access'),
('Operator', 'Basic operational access')
ON DUPLICATE KEY UPDATE name=name;

-- Insert default permissions
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
ON DUPLICATE KEY UPDATE name=name;

-- Assign permissions to Super Admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Super Admin'
ON DUPLICATE KEY UPDATE role_id=role_id;

-- Assign basic permissions to Manager role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Manager' AND p.name IN ('dashboard.view', 'master.view', 'master.edit', 'day_business.view', 'day_business.edit', 'invoice.view', 'invoice.create', 'reports.view')
ON DUPLICATE KEY UPDATE role_id=role_id;

-- Assign limited permissions to Supervisor role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Supervisor' AND p.name IN ('dashboard.view', 'day_business.view', 'day_business.edit', 'reports.view')
ON DUPLICATE KEY UPDATE role_id=role_id;

-- Assign minimal permissions to Operator role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Operator' AND p.name IN ('dashboard.view', 'day_business.view')
ON DUPLICATE KEY UPDATE role_id=role_id;

-- Insert sample data
INSERT INTO employees (name, email, phone, salary) VALUES
('John Doe', 'john@example.com', '1234567890', 50000.00),
('Jane Smith', 'jane@example.com', '0987654321', 45000.00)
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO fuel_products (name, price) VALUES
('Petrol', 100.50),
('Diesel', 95.25)
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO users (email, password_hash, role) VALUES
('admin@petrolpump.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Super Admin')
ON DUPLICATE KEY UPDATE email=email;