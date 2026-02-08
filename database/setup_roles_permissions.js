const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '..', 'petro_pump.db');

// Read the SQL file
const sqlFilePath = path.join(__dirname, 'roles_permissions_basic.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

console.log('🚀 Setting up Roles and Permissions System...');
console.log('📊 Database path:', dbPath);
console.log('📄 SQL file:', sqlFilePath);

const db = new sqlite3.Database(dbPath);

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

console.log('📝 Executing SQL script...');

// Execute the SQL script
db.exec(sql, (err) => {
    if (err) {
        console.error('❌ Error setting up database:', err.message);
        console.error('');
        console.error('🔧 Troubleshooting:');
        console.error('   1. Make sure the backend server is not running');
        console.error('   2. Check if the database file exists and is accessible');
        console.error('   3. Ensure you have write permissions to the database directory');
        db.close();
        process.exit(1);
    } else {
        console.log('✅ Roles and Permissions tables created successfully!');
        console.log('');
        console.log('📋 Created tables:');
        console.log('   • roles - User roles in the system');
        console.log('   • permissions - Available permissions');
        console.log('   • role_permissions - Links roles to permissions');
        console.log('   • user_roles - Assignment of roles to users');
        console.log('');
        console.log('👥 Default roles created:');
        console.log('   • Super Admin - Full system access');
        console.log('   • Manager - Management level access');
        console.log('   • Supervisor - Supervisory access');
        console.log('   • Operator - Basic operational access');
        console.log('   • Accountant - Financial and reporting access');
        console.log('   • Clerk - Limited data entry access');
        console.log('');
        console.log('🔐 Default permissions created for:');
        console.log('   • Dashboard (view, edit)');
        console.log('   • Master Data (view, edit, delete)');
        console.log('   • Daily Business (view, edit, approve)');
        console.log('   • Invoices (view, create, edit, delete)');
        console.log('   • Reports (view, create, export)');
        console.log('   • Settings (view, edit)');
        console.log('   • Administration (permissions, users, system, audit)');
        console.log('   • Super Admin (view, backup, security)');
        console.log('');
        console.log('🎯 Next steps:');
        console.log('   1. Start your backend server');
        console.log('   2. Navigate to Roles & Permissions in your app');
        console.log('   3. The system is ready to use!');
        console.log('');
        console.log('💡 Tip: You can run this script again safely - it won\'t duplicate data.');

        db.close();
    }
});