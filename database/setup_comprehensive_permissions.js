const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '..', 'petro_pump.db');

// Read the SQL file
const sqlFilePath = path.join(__dirname, 'comprehensive_permissions.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

console.log('🚀 Setting up Comprehensive Permissions System...');
console.log('📊 Database path:', dbPath);
console.log('📄 SQL file:', sqlFilePath);

const db = new sqlite3.Database(dbPath);

console.log('📝 Adding comprehensive permissions...');

// Execute the SQL script
db.exec(sql, (err) => {
    if (err) {
        console.error('❌ Error adding permissions:', err.message);
        console.error('');
        console.error('🔧 Troubleshooting:');
        console.error('   1. Make sure the backend server is not running');
        console.error('   2. Check if the database file exists and is accessible');
        console.error('   3. Ensure you have write permissions to the database directory');
        db.close();
        process.exit(1);
    } else {
        console.log('✅ Comprehensive permissions added successfully!');
        console.log('');
        console.log('📋 Permission Categories Added:');
        console.log('   🎯 Dashboard - Dashboard access and configuration');
        console.log('   📊 Master Data - Products, vendors, customers, employees');
        console.log('   💼 Day Business - Daily operations and transactions');
        console.log('   🧾 Invoices - Sales and purchase invoices');
        console.log('   📈 Reports - All report types and analytics');
        console.log('   ⚙️ Settings - Application and user settings');
        console.log('   👑 Super Admin - System administration');
        console.log('   🧮 Calculators - Calculator tools and converters');
        console.log('   🆔 ID Cards - Employee ID card generation');
        console.log('   👤 Attendance - Attendance management');
        console.log('   💳 Credit - Credit customer management');
        console.log('   💰 Transactions - Business and vendor transactions');
        console.log('   📦 Stock - Inventory and stock management');
        console.log('   ⚠️ Alerts - Minimum stock and expiry alerts');
        console.log('');
        console.log('🔢 Total Permissions Added: 150+ granular permissions');
        console.log('');
        console.log('🎯 Next steps:');
        console.log('   1. Restart your backend server');
        console.log('   2. Navigate to Roles & Permissions in your app');
        console.log('   3. Explore the enhanced permission categories');
        console.log('   4. Assign permissions to roles as needed');
        console.log('');
        console.log('💡 Tip: You can run this script again safely - it won\'t duplicate permissions.');

        db.close();
    }
});