const bcrypt = require('bcryptjs');

const storedHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
const testPassword = 'password123';

bcrypt.compare(testPassword, storedHash, (err, result) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Password match:', result);
  }
});