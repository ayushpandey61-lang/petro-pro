const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'petrol_pump.db');
const db = new sqlite3.Database(dbPath);

console.log('Checking lube_sales table structure...');

db.all('PRAGMA table_info(lube_sales)', (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('lube_sales table structure:');
    rows.forEach(row => {
      console.log(`  ${row.name}: ${row.type} ${row.pk ? '(PRIMARY KEY)' : ''} ${row.notnull ? 'NOT NULL' : ''} ${row.dflt_value ? `DEFAULT ${row.dflt_value}` : ''}`);
    });
  }
});

db.all('SELECT * FROM lube_sales LIMIT 5', (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('\nSample lube_sales data:');
    console.log(rows);
  }
  db.close();
});