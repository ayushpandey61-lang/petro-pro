-- Roles and Permissions System Database Schema
-- Run this script to create the required tables for the roles and permissions system

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    module VARCHAR(50) NOT NULL, -- e.g., 'dashboard', 'master', 'reports'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

-- Create user_roles table to assign roles to users
CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL, -- This should reference your users table
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by INTEGER, -- User ID of who assigned this role
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role_id)
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
    ('Super Admin', 'Full system access with all permissions'),
    ('Manager', 'Management level access with most permissions'),
    ('Supervisor', 'Supervisory access with operational permissions'),
    ('Operator', 'Basic operational access'),
    ('Accountant', 'Financial and reporting access'),
    ('Clerk', 'Limited data entry access')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (name, description, module) VALUES
    -- Dashboard permissions
    ('dashboard.view', 'View dashboard and overview', 'dashboard'),
    ('dashboard.edit', 'Modify dashboard settings', 'dashboard'),

    -- Master data permissions
    ('master.view', 'View master data (products, vendors, etc.)', 'master'),
    ('master.edit', 'Create and modify master data', 'master'),
    ('master.delete', 'Delete master data records', 'master'),

    -- Daily business permissions
    ('day_business.view', 'View daily business operations', 'day_business'),
    ('day_business.edit', 'Manage daily business entries', 'day_business'),
    ('day_business.approve', 'Approve daily business transactions', 'day_business'),

    -- Invoice permissions
    ('invoice.view', 'View and print invoices', 'invoice'),
    ('invoice.create', 'Create new invoices', 'invoice'),
    ('invoice.edit', 'Modify existing invoices', 'invoice'),
    ('invoice.delete', 'Delete invoices', 'invoice'),

    -- Report permissions
    ('reports.view', 'Access to all reports', 'reports'),
    ('reports.create', 'Generate custom reports', 'reports'),
    ('reports.export', 'Export reports to external formats', 'reports'),

    -- Settings permissions
    ('settings.view', 'Access application settings', 'settings'),
    ('settings.edit', 'Modify application settings', 'settings'),

    -- Administration permissions
    ('permissions.manage', 'Manage user roles and permissions', 'admin'),
    ('users.manage', 'Manage user accounts', 'admin'),
    ('system.configure', 'Configure system settings', 'admin'),
    ('audit.view', 'View audit logs', 'admin'),

    -- Super admin permissions
    ('super_admin.view', 'Full system administration access', 'super_admin'),
    ('backup.manage', 'Manage system backups', 'super_admin'),
    ('security.manage', 'Manage security settings', 'super_admin')
ON CONFLICT (name) DO NOTHING;

-- Insert role-permission assignments after ensuring roles and permissions exist
-- First, get role and permission IDs
-- Super Admin gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Super Admin'
AND NOT EXISTS (SELECT 1 FROM role_permissions rp WHERE rp.role_id = r.id AND rp.permission_id = p.id);

-- Manager permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name IN (
    'dashboard.view', 'dashboard.edit',
    'master.view', 'master.edit',
    'day_business.view', 'day_business.edit', 'day_business.approve',
    'invoice.view', 'invoice.create', 'invoice.edit',
    'reports.view', 'reports.create', 'reports.export',
    'settings.view', 'settings.edit',
    'audit.view'
)
WHERE r.name = 'Manager'
AND NOT EXISTS (SELECT 1 FROM role_permissions rp WHERE rp.role_id = r.id AND rp.permission_id = p.id);

-- Supervisor permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name IN (
    'dashboard.view',
    'master.view',
    'day_business.view', 'day_business.edit',
    'invoice.view', 'invoice.create',
    'reports.view'
)
WHERE r.name = 'Supervisor'
AND NOT EXISTS (SELECT 1 FROM role_permissions rp WHERE rp.role_id = r.id AND rp.permission_id = p.id);

-- Operator permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name IN (
    'dashboard.view',
    'master.view',
    'day_business.view', 'day_business.edit',
    'invoice.view', 'invoice.create'
)
WHERE r.name = 'Operator'
AND NOT EXISTS (SELECT 1 FROM role_permissions rp WHERE rp.role_id = r.id AND rp.permission_id = p.id);

-- Accountant permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name IN (
    'dashboard.view',
    'master.view',
    'day_business.view',
    'invoice.view', 'invoice.create', 'invoice.edit',
    'reports.view', 'reports.create', 'reports.export',
    'audit.view'
)
WHERE r.name = 'Accountant'
AND NOT EXISTS (SELECT 1 FROM role_permissions rp WHERE rp.role_id = r.id AND rp.permission_id = p.id);

-- Clerk permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name IN (
    'dashboard.view',
    'master.view',
    'day_business.view',
    'invoice.view'
)
WHERE r.name = 'Clerk'
AND NOT EXISTS (SELECT 1 FROM role_permissions rp WHERE rp.role_id = r.id AND rp.permission_id = p.id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_permissions_module ON permissions(module);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for roles table
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE roles IS 'User roles in the system';
COMMENT ON TABLE permissions IS 'Available permissions in the system';
COMMENT ON TABLE role_permissions IS 'Junction table linking roles to permissions';
COMMENT ON TABLE user_roles IS 'Assignment of roles to users';

-- Create a view for easy role-permission queries
CREATE OR REPLACE VIEW role_permissions_view AS
SELECT
    r.id as role_id,
    r.name as role_name,
    r.description as role_description,
    p.id as permission_id,
    p.name as permission_name,
    p.description as permission_description,
    p.module as permission_module
FROM roles r
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id;

-- Create a function to check if a user has a specific permission
CREATE OR REPLACE FUNCTION user_has_permission(user_id INTEGER, permission_name VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM user_roles ur
        JOIN role_permissions rp ON ur.role_id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = user_has_permission.user_id
        AND p.name = user_has_permission.permission_name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get user permissions
CREATE OR REPLACE FUNCTION get_user_permissions(user_id INTEGER)
RETURNS TABLE(permission_name VARCHAR, permission_description TEXT, module VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        p.name,
        p.description,
        p.module
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = get_user_permissions.user_id
    ORDER BY p.module, p.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;