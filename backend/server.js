require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { testConnection } = require('./lib/database');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
      'http://127.0.0.1:5176',
      'http://127.0.0.1:3000'
    ];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn('Blocked CORS request from origin:', origin);
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  skipFailedRequests: false // Count failed requests
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/master', require('./routes/master'));
app.use('/api/day-business', require('./routes/dayBusiness'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/invoices', require('./routes/invoices'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/setup', require('./routes/setup'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack, url: req.url, method: req.method });
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

app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);

  // Test database connection
  try {
    await testConnection();
    logger.info('✅ MySQL database connection established successfully');
  } catch (error) {
    logger.error('❌ MySQL database connection failed:', error.message);
  }
});