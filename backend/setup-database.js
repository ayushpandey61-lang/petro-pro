const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../petrol_pump.db');
const sqlFilePath = path.join(__dirname, '../database/sqlite_setup.sql');

console.log('Setting up database tables...');
console.log('Database path:', dbPath);
console.log('SQL file path:', sqlFilePath);

const db = new sqlite3.Database(dbPath);

// Read and execute SQL file
const sql = fs.readFileSync(sqlFilePath, 'utf8');

db.exec(sql, (err) => {
  if (err) {
    console.error('Error setting up database:', err);
    process.exit(1);
  } else {
    console.log('✅ Database setup completed successfully!');
    db.close();
  }
});