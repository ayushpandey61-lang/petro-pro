const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 32);
const iv = crypto.randomBytes(16);

// Encrypt function
function encrypt(text) {
  const cipher = crypto.createCipher(algorithm, key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Decrypt function
function decrypt(encrypted) {
  const decipher = crypto.createDecipher(algorithm, key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Hash password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Verify password
function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

module.exports = {
  encrypt,
  decrypt,
  hashPassword,
  verifyPassword
};