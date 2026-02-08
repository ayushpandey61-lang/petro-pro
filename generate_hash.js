const bcrypt = require('bcryptjs');

const password = 'password123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Generated hash for "password123":', hash);
  }
});