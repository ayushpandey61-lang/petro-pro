const express = require('express');
const { query, validationResult } = require('express-validator');
const { query: dbQuery, queryOne } = require('../lib/sqlite');

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  try {
    const verified = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// All Credit Customer Report
router.get('/all-credit-customer', verifyToken, [
  query('start_date').optional().isISO8601(),
  query('end_date').optional().isISO8601()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { start_date, end_date } = req.query;

  try {
    let sql = `
      SELECT cs.*,
             c.name as customer_name,
             c.phone as customer_phone,
             c.address as customer_address
      FROM credit_sales cs
      LEFT JOIN customers c ON cs.customer_id = c.id
      WHERE 1=1
    `;

    const params = [];

    if (start_date) {
      sql += ' AND cs.date >= ?';
      params.push(start_date);
    }
    if (end_date) {
      sql += ' AND cs.date <= ?';
      params.push(end_date);
    }

    sql += ' ORDER BY cs.created_at DESC';

    const data = await dbQuery(sql, params);
    res.json(data);
  } catch (error) {
    console.error('Error fetching credit customer report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Attendance Report
router.get('/attendance', verifyToken, [
  query('start_date').optional().isISO8601(),
  query('end_date').optional().isISO8601(),
  query('employee_id').optional().isUUID()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { start_date, end_date, employee_id } = req.query;

  try {
    let sql = `
      SELECT a.*,
             e.name as employee_name,
             e.phone as employee_phone
      FROM attendance a
      LEFT JOIN employees e ON a.employee_id = e.id
      WHERE 1=1
    `;

    const params = [];

    if (start_date) {
      sql += ' AND a.date >= ?';
      params.push(start_date);
    }
    if (end_date) {
      sql += ' AND a.date <= ?';
      params.push(end_date);
    }
    if (employee_id) {
      sql += ' AND a.employee_id = ?';
      params.push(employee_id);
    }

    sql += ' ORDER BY a.date DESC';

    const data = await dbQuery(sql, params);
    res.json(data);
  } catch (error) {
    console.error('Error fetching attendance report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Business Flow Report
router.get('/business-flow', verifyToken, [
  query('start_date').optional().isISO8601(),
  query('end_date').optional().isISO8601()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { start_date, end_date } = req.query;

  try {
    let salesSql = 'SELECT date, total_sale, fuel_product_id FROM sale_entries WHERE 1=1';
    let expensesSql = 'SELECT date, amount, expense_type_id FROM expenses WHERE 1=1';
    const params = [];

    if (start_date) {
      salesSql += ' AND date >= ?';
      expensesSql += ' AND date >= ?';
      params.push(start_date);
    }
    if (end_date) {
      salesSql += ' AND date <= ?';
      expensesSql += ' AND date <= ?';
      params.push(end_date);
    }

    salesSql += ' ORDER BY date DESC';
    expensesSql += ' ORDER BY date DESC';

    const [salesData, expensesData] = await Promise.all([
      dbQuery(salesSql, params),
      dbQuery(expensesSql, params)
    ]);

    res.json({
      sales: salesData,
      expenses: expensesData
    });
  } catch (error) {
    console.error('Error fetching business flow report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Customer Statement Report
router.get('/customer-statement/:customer_id', verifyToken, [
  query('start_date').optional().isISO8601(),
  query('end_date').optional().isISO8601()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { customer_id } = req.params;
  const { start_date, end_date } = req.query;

  try {
    let sql = 'SELECT * FROM credit_sales WHERE customer_id = ?';
    const params = [customer_id];

    if (start_date) {
      sql += ' AND date >= ?';
      params.push(start_date);
    }
    if (end_date) {
      sql += ' AND date <= ?';
      params.push(end_date);
    }

    sql += ' ORDER BY date DESC';

    const data = await dbQuery(sql, params);
    res.json(data);
  } catch (error) {
    console.error('Error fetching customer statement:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Daily Rate History Report
router.get('/daily-rate-history', verifyToken, [
  query('start_date').optional().isISO8601(),
  query('end_date').optional().isISO8601(),
  query('fuel_product_id').optional().isUUID()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { start_date, end_date, fuel_product_id } = req.query;

  try {
    let sql = `
      SELECT dsr.*,
             fp.name as fuel_product_name
      FROM daily_sale_rates dsr
      LEFT JOIN fuel_products fp ON dsr.fuel_product_id = fp.id
      WHERE 1=1
    `;

    const params = [];

    if (start_date) {
      sql += ' AND dsr.date >= ?';
      params.push(start_date);
    }
    if (end_date) {
      sql += ' AND dsr.date <= ?';
      params.push(end_date);
    }
    if (fuel_product_id) {
      sql += ' AND dsr.fuel_product_id = ?';
      params.push(fuel_product_id);
    }

    sql += ' ORDER BY dsr.date DESC';

    const data = await dbQuery(sql, params);
    res.json(data);
  } catch (error) {
    console.error('Error fetching daily rate history:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Sales Report
router.get('/sales', verifyToken, [
  query('start_date').optional().isISO8601(),
  query('end_date').optional().isISO8601(),
  query('fuel_product_id').optional().isUUID()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { start_date, end_date, fuel_product_id } = req.query;

  try {
    let sql = `
      SELECT se.*,
             fp.name as fuel_product_name,
             n.nozzle_number,
             t.tank_number
      FROM sale_entries se
      LEFT JOIN fuel_products fp ON se.fuel_product_id = fp.id
      LEFT JOIN nozzles n ON se.nozzle_id = n.id
      LEFT JOIN tanks t ON n.tank_id = t.id
      WHERE 1=1
    `;

    const params = [];

    if (start_date) {
      sql += ' AND se.date >= ?';
      params.push(start_date);
    }
    if (end_date) {
      sql += ' AND se.date <= ?';
      params.push(end_date);
    }
    if (fuel_product_id) {
      sql += ' AND se.fuel_product_id = ?';
      params.push(fuel_product_id);
    }

    sql += ' ORDER BY se.date DESC';

    const data = await dbQuery(sql, params);
    res.json(data);
  } catch (error) {
    console.error('Error fetching sales report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Lubricants Stock Report
router.get('/lubricants-stock', verifyToken, async (req, res) => {
  try {
    const data = await dbQuery('SELECT * FROM lubricants ORDER BY created_at DESC');
    res.json(data);
  } catch (error) {
    console.error('Error fetching lubricants stock:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Purchase Report
router.get('/purchase', verifyToken, [
  query('start_date').optional().isISO8601(),
  query('end_date').optional().isISO8601()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { start_date, end_date } = req.query;

  try {
    let sql = `
      SELECT p.*,
             v.name as vendor_name,
             fp.name as fuel_product_name
      FROM purchases p
      LEFT JOIN vendors v ON p.vendor_id = v.id
      LEFT JOIN fuel_products fp ON p.fuel_product_id = fp.id
      WHERE 1=1
    `;

    const params = [];

    if (start_date) {
      sql += ' AND p.date >= ?';
      params.push(start_date);
    }
    if (end_date) {
      sql += ' AND p.date <= ?';
      params.push(end_date);
    }

    sql += ' ORDER BY p.date DESC';

    const data = await dbQuery(sql, params);
    res.json(data);
  } catch (error) {
    console.error('Error fetching purchase report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add more report endpoints as needed for other reports mentioned in App.jsx

module.exports = router;