const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const DB_PATH = path.join(__dirname, '../petrol_pump.db');

async function getDB() {
  return await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });
}

async function createTables() {
  try {
    const db = await getDB();

    // Create roles table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Roles table created/verified');

    // Create permissions table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Permissions table created/verified');

    // Create role_permissions table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS role_permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role_id INTEGER NOT NULL,
        permission_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
        FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE,
        UNIQUE(role_id, permission_id)
      )
    `);
    console.log('✅ Role_permissions table created/verified');

    // Insert sample roles
    console.log('Inserting sample roles...');
    const roles = [
      { name: 'Super Admin', description: 'Full system access' },
      { name: 'Manager', description: 'Management level access' },
      { name: 'Supervisor', description: 'Supervisory access' },
      { name: 'Operator', description: 'Basic operational access' }
    ];

    for (const role of roles) {
      try {
        await db.run('INSERT OR IGNORE INTO roles (name, description) VALUES (?, ?)', [role.name, role.description]);
        console.log('✅ Inserted role:', role.name);
      } catch (error) {
        console.error('❌ Error inserting role:', role.name, error.message);
      }
    }

    // Insert sample permissions
    console.log('Inserting sample permissions...');
    const permissions = [
      { name: 'dashboard.view', description: 'View dashboard' },
      { name: 'master.view', description: 'View master data' },
      { name: 'master.edit', description: 'Edit master data' },
      { name: 'day_business.view', description: 'View day business' },
      { name: 'day_business.edit', description: 'Edit day business' },
      { name: 'invoice.view', description: 'View invoices' },
      { name: 'invoice.create', description: 'Create invoices' },
      { name: 'reports.view', description: 'View reports' },
      { name: 'permissions.manage', description: 'Manage permissions' },
      { name: 'settings.view', description: 'View settings' },
      { name: 'super_admin.view', description: 'Super admin access' }
    ];

    for (const permission of permissions) {
      try {
        await db.run('INSERT OR IGNORE INTO permissions (name, description) VALUES (?, ?)', [permission.name, permission.description]);
        console.log('✅ Inserted permission:', permission.name);
      } catch (error) {
        console.error('❌ Error inserting permission:', permission.name, error.message);
      }
    }

    // Assign all permissions to Super Admin role
    console.log('Assigning permissions to Super Admin role...');
    const superAdminRole = await db.get('SELECT id FROM roles WHERE name = ?', ['Super Admin']);
    if (superAdminRole) {
      const allPermissions = await db.all('SELECT id FROM permissions');
      for (const perm of allPermissions) {
        try {
          await db.run('INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)', [superAdminRole.id, perm.id]);
        } catch (error) {
          console.error('❌ Error assigning permission to Super Admin:', error.message);
        }
      }
      console.log('✅ Assigned all permissions to Super Admin role');
    }

    await db.close();
    console.log('🎉 Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  }
}

createTables();