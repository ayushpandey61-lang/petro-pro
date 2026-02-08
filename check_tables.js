const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'petrol_pump.db');
const db = new sqlite3.Database(dbPath);

console.log('Checking database tables...');

db.all('SELECT * FROM lubricants LIMIT 5', (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Lubricants:', rows);
  }
});

db.all('SELECT * FROM shifts LIMIT 5', (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Shifts:', rows);
  }
});

db.all('SELECT * FROM employees LIMIT 5', (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Employees:', rows);
  }
  db.close();
});