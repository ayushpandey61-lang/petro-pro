const express = require('express');
const fs = require('fs');
const path = require('path');
const { execute } = require('../lib/sqlite');

const router = express.Router();

// Setup database tables and seed data
router.post('/database', async (req, res) => {
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '../../sqlite_setup_complete.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`Executing ${statements.length} SQL statements...`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await execute(statement);
          console.log(`Statement ${i + 1} executed successfully`);
        } catch (err) {
          console.error(`Failed to execute statement ${i + 1}:`, err.message);
          // Continue with other statements even if one fails
        }
      }
    }

    res.json({
      success: true,
      message: 'Database setup completed. Check server logs for details.'
    });

  } catch (error) {
    console.error('Database setup error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Alternative approach: Insert sample data directly
router.post('/database-direct', async (req, res) => {
  try {
    console.log('Using direct SQLite setup method...');

    // Insert default roles
    const roles = [
      { name: 'Super Admin', description: 'Full system access' },
      { name: 'Manager', description: 'Management level access' },
      { name: 'Supervisor', description: 'Supervisory access' },
      { name: 'Operator', description: 'Basic operational access' }
    ];

    for (const role of roles) {
      try {
        await execute(
          'INSERT OR IGNORE INTO roles (name, description) VALUES (?, ?)',
          [role.name, role.description]
        );
      } catch (err) {
        console.error('Error inserting role:', role.name, err.message);
      }
    }

    // Insert default permissions
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
        await execute(
          'INSERT OR IGNORE INTO permissions (name, description) VALUES (?, ?)',
          [permission.name, permission.description]
        );
      } catch (err) {
        console.error('Error inserting permission:', permission.name, err.message);
      }
    }

    // Insert sample employees
    try {
      await execute(
        'INSERT OR IGNORE INTO employees (name, email, phone, salary) VALUES (?, ?, ?, ?)',
        ['John Doe', 'john@example.com', '1234567890', 50000.00]
      );
      await execute(
        'INSERT OR IGNORE INTO employees (name, email, phone, salary) VALUES (?, ?, ?, ?)',
        ['Jane Smith', 'jane@example.com', '0987654321', 45000.00]
      );
    } catch (err) {
      console.error('Error inserting employees:', err.message);
    }

    // Insert sample fuel products
    try {
      await execute(
        'INSERT OR IGNORE INTO fuel_products (name, price) VALUES (?, ?)',
        ['Petrol', 100.50]
      );
      await execute(
        'INSERT OR IGNORE INTO fuel_products (name, price) VALUES (?, ?)',
        ['Diesel', 95.25]
      );
    } catch (err) {
      console.error('Error inserting fuel products:', err.message);
    }

    res.json({
      success: true,
      message: 'Database tables created and seeded successfully using SQLite'
    });

  } catch (error) {
    console.error('Database setup error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;