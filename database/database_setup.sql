-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('Super Admin', 'Full system access'),
('Manager', 'Management level access'),
('Supervisor', 'Supervisory access'),
('Operator', 'Basic operational access')
ON CONFLICT (name) DO NOTHING;

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
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to Super Admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Super Admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign basic permissions to Manager role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Manager' AND p.name IN ('dashboard.view', 'master.view', 'master.edit', 'day_business.view', 'day_business.edit', 'invoice.view', 'invoice.create', 'reports.view')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign limited permissions to Supervisor role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Supervisor' AND p.name IN ('dashboard.view', 'day_business.view', 'day_business.edit', 'reports.view')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign minimal permissions to Operator role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Operator' AND p.name IN ('dashboard.view', 'day_business.view')
ON CONFLICT (role_id, permission_id) DO NOTHING;