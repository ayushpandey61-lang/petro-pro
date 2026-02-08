const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Mock data for demo
const mockUsers = [
  { id: 1, email: 'admin@example.com', password: 'password', user_metadata: { role: 'Super Admin', is_super_admin: true } },
  { id: 2, email: 'user@example.com', password: 'password', user_metadata: { role: 'Manager' } }
];

const mockEmployees = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', created_at: new Date() },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', created_at: new Date() },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '5556667777', created_at: new Date() }
];

const mockNozzles = [
  { id: 1, nozzleName: 'Nozzle 1', tank_id: 1, created_at: new Date() },
  { id: 2, nozzleName: 'Nozzle 2', tank_id: 1, created_at: new Date() },
  { id: 3, nozzleName: 'Nozzle 3', tank_id: 2, created_at: new Date() },
  { id: 4, nozzleName: 'Nozzle 4', tank_id: 2, created_at: new Date() }
];

const mockShifts = [
  { id: 1, shiftName: 'Morning Shift', start_time: '06:00', end_time: '14:00', created_at: new Date() },
  { id: 2, shiftName: 'Evening Shift', start_time: '14:00', end_time: '22:00', created_at: new Date() },
  { id: 3, shiftName: 'Night Shift', start_time: '22:00', end_time: '06:00', created_at: new Date() }
];

// Security middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// JWT middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  try {
    const verified = jwt.verify(token, 'demo-secret-key');
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    'demo-secret-key',
    { expiresIn: '24h' }
  );

  res.json({
    user: { id: user.id, email: user.email },
    session: {},
    token
  });
});

app.get('/api/auth/profile', verifyToken, (req, res) => {
  const user = mockUsers.find(u => u.id === req.user.id);
  res.json({ user });
});

app.get('/api/auth/permissions/:roleName', verifyToken, (req, res) => {
  const { roleName } = req.params;
  if (roleName === 'Super Admin') {
    res.json(['*']);
  } else {
    res.json(['dashboard.view', 'master.view', 'day_business.view', 'reports.view']);
  }
});

app.get('/api/master/employees', verifyToken, (req, res) => {
  res.json(mockEmployees);
});

app.post('/api/master/employees', verifyToken, (req, res) => {
  const newEmployee = {
    id: mockEmployees.length + 1,
    ...req.body,
    created_at: new Date()
  };
  mockEmployees.push(newEmployee);
  res.json(newEmployee);
});

app.get('/api/master/nozzles', verifyToken, (req, res) => {
  res.json(mockNozzles);
});

app.get('/api/master/shifts', verifyToken, (req, res) => {
  res.json(mockShifts);
});

// Mock other endpoints
app.get('/api/day-business/sale-entries', verifyToken, (req, res) => {
  res.json([]);
});

app.get('/api/reports/sales', verifyToken, (req, res) => {
  res.json([]);
});

app.get('/api/invoices/sales', verifyToken, (req, res) => {
  res.json([]);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), mode: 'demo' });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack, url: req.url });
  res.status(500).json({ error: 'Something went wrong!' });
});

// Security logging middleware
app.use((req, res, next) => {
  logger.security('Request received', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

app.listen(PORT, () => {
  logger.info(`Demo server running on port ${PORT}`);
  console.log(`🚀 Demo server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Demo login: admin@example.com / password`);
});

module.exports = app;