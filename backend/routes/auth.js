const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { query, queryOne, execute } = require('../lib/sqlite');

// Rate limiters for auth routes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per window
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 signup attempts per hour
  message: 'Too many signup attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Login
router.post('/login', loginLimiter, [
  body('username')
    .isLength({ min: 1, max: 100 })
    .matches(/^[a-zA-Z0-9@._-]+$/)
    .withMessage('Username can contain letters, numbers, @, ., _, and -'),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // Get user from database - check if username is email or username
    let users;
    if (username.includes('@')) {
      // If contains @, treat as email
      users = await query(
        'SELECT id, email, password_hash, role FROM users WHERE email = ?',
        [username]
      );
    } else {
      // Otherwise, treat as username
      users = await query(
        'SELECT id, email, password_hash, role FROM users WHERE username = ? OR email = ?',
        [username, username]
      );
    }

    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Signup
router.post('/signup', signupLimiter, [
  body('username')
    .isLength({ min: 1, max: 100 })
    .matches(/^[a-zA-Z0-9@._-]+$/)
    .withMessage('Username can contain letters, numbers, @, ., _, and -'),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['Super Admin', 'Manager', 'Supervisor', 'Operator'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, role = 'Operator' } = req.body;

  try {
    // Check if user already exists - check both email and username
    let existingUsers;
    if (username.includes('@')) {
      // If contains @, treat as email
      existingUsers = await query(
        'SELECT id FROM users WHERE email = ?',
        [username]
      );
    } else {
      // Otherwise, check both username and email fields
      existingUsers = await query(
        'SELECT id FROM users WHERE username = ? OR email = ?',
        [username, username]
      );
    }

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Determine if username is email or regular username
    let email, username;
    if (username.includes('@')) {
      email = username;
      username = null; // Will be set to null in database
    } else {
      username = username;
      email = null; // Will be set to null in database
    }

    // Insert new user
    const result = await query(
      'INSERT INTO users (email, username, password_hash, role) VALUES (?, ?, ?, ?)',
      [email, username, passwordHash, role]
    );

    // Generate JWT
    const token = jwt.sign(
      { id: result.insertId, email: email || username, role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: result.insertId,
        email: email || username,
        role
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.post('/logout', verifyToken, async (req, res) => {
  try {
    // In a JWT-based system, logout is typically handled on the client side
    // by removing the token. No server-side action needed.
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const users = await query(
      'SELECT id, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Refresh token
router.post('/refresh', verifyToken, async (req, res) => {
  try {
    // Get fresh user data from database
    const users = await query(
      'SELECT id, email, role FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // Generate new JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      user,
      token
    });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user permissions
router.get('/permissions/:roleName', verifyToken, async (req, res) => {
  const { roleName } = req.params;

  if (roleName === 'Super Admin') {
    return res.json(['*']);
  }

  try {
    // Get role permissions from database
    const permissions = await query(`
      SELECT p.name
      FROM permissions p
      INNER JOIN role_permissions rp ON p.id = rp.permission_id
      INNER JOIN roles r ON rp.role_id = r.id
      WHERE r.name = ?
    `, [roleName]);

    if (permissions.length === 0) {
      // Fallback: Return default permissions based on role
      if (roleName === 'Manager') {
        return res.json(['dashboard.view', 'master.view', 'master.edit', 'day_business.view', 'day_business.edit', 'invoice.view', 'invoice.create', 'reports.view']);
      } else if (roleName === 'Supervisor') {
        return res.json(['dashboard.view', 'day_business.view', 'day_business.edit', 'reports.view']);
      } else {
        return res.json(['dashboard.view', 'day_business.view']);
      }
    }

    res.json(permissions.map(p => p.name));
  } catch (error) {
    console.error('Permissions error:', error);
    // Fallback: Return default permissions based on role
    if (roleName === 'Manager') {
      return res.json(['dashboard.view', 'master.view', 'master.edit', 'day_business.view', 'day_business.edit', 'invoice.view', 'invoice.create', 'reports.view']);
    } else if (roleName === 'Supervisor') {
      return res.json(['dashboard.view', 'day_business.view', 'day_business.edit', 'reports.view']);
    } else {
      return res.json(['dashboard.view', 'day_business.view']);
    }
  }
});

module.exports = router;