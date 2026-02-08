const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'petrol_pump.db');
const db = new sqlite3.Database(dbPath);

const password = 'password123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    db.close();
    return;
  }

  console.log('Updating user password...');
  db.run('UPDATE users SET password_hash = ? WHERE email = ?', [hash, 'admin@petrolpump.com'], function(err) {
    if (err) {
      console.error('Error updating password:', err);
    } else {
      console.log('Password updated successfully. Rows affected:', this.changes);
    }
    db.close();
  });
});