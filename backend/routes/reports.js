const express = require('express');
const { query, validationResult } = require('express-validator');
const { query: dbQuery } = require('../lib/database');

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

// Get all available reports with metadata
router.get('/list', verifyToken, (req, res) => {
  const reports = [
    // Business Reports
    { id: 'daily-business-summary', name: 'Daily Business Summary', category: 'Business', endpoint: '/api/reports/daily-business-summary', filters: ['start_date', 'end_date'] },
    { id: 'sales-report', name: 'Sales Report', category: 'Business', endpoint: '/api/reports/sales', filters: ['start_date', 'end_date', 'fuel_product_id'] },
    { id: 'business-flow', name: 'Business Flow Report', category: 'Business', endpoint: '/api/reports/business-flow', filters: ['start_date', 'end_date'] },
    
    // Financial Reports
    { id: 'purchase-report', name: 'Purchase Report', category: 'Financial', endpoint: '/api/reports/purchase', filters: ['start_date', 'end_date'] },
    { id: 'expenditure-report', name: 'Expenditure Report', category: 'Financial', endpoint: '/api/reports/expenditure', filters: ['start_date', 'end_date', 'expense_type_id'] },
    { id: 'interest-transaction', name: 'Interest Transaction Report', category: 'Financial', endpoint: '/api/reports/interest-transaction', filters: ['start_date', 'end_date', 'customer_id'] },
    
    // Inventory Reports
    { id: 'stock-variation', name: 'Stock Variation Report', category: 'Inventory', endpoint: '/api/reports/stock-variation', filters: ['start_date', 'end_date', 'product_id'] },
    { id: 'lubricants-stock', name: 'Lubricants Stock Report', category: 'Inventory', endpoint: '/api/reports/lubricants-stock', filters: [] },
    { id: 'day-wise-stock-value', name: 'Day Wise Stock Value Report', category: 'Inventory', endpoint: '/api/reports/day-wise-stock-value', filters: ['start_date', 'end_date'] },
    
    // Customer Reports
    { id: 'credit-customer', name: 'Credit Customer Report', category: 'Customer', endpoint: '/api/reports/all-credit-customer', filters: ['start_date', 'end_date'] },
    { id: 'guest-customer-sales', name: 'Guest Customer Sales Report', category: 'Customer', endpoint: '/api/reports/guest-customer-sales', filters: ['start_date', 'end_date'] },
    { id: 'customer-statement', name: 'Customer Statement', category: 'Customer', endpoint: '/api/reports/customer-statement/:customer_id', filters: ['customer_id', 'start_date', 'end_date'] },
    
    // Employee Reports
    { id: 'attendance', name: 'Employee Attendance Report', category: 'Employee', endpoint: '/api/reports/attendance', filters: ['start_date', 'end_date', 'employee_id'] },
    { id: 'employee-status', name: 'Employee Status Report', category: 'Employee', endpoint: '/api/reports/employee-status', filters: ['employee_id', 'status'] },
    
    // Operational Reports
    { id: 'density-report', name: 'Density Report', category: 'Operational', endpoint: '/api/reports/density', filters: ['start_date', 'end_date', 'tank_id'] },
    { id: 'dsr-format', name: 'DSR Format Report', category: 'Operational', endpoint: '/api/reports/dsr-format', filters: ['date'] },
    { id: 'swipe-report', name: 'Swipe Report', category: 'Operational', endpoint: '/api/reports/swipe', filters: ['start_date', 'end_date', 'machine_id'] },
    { id: 'daily-rate-history', name: 'Daily Rate History', category: 'Operational', endpoint: '/api/reports/daily-rate-history', filters: ['start_date', 'end_date', 'fuel_product_id'] },
    
    // Transaction Reports
    { id: 'vendor-transaction', name: 'Vendor Transaction Report', category: 'Transaction', endpoint: '/api/reports/vendor-transaction', filters: ['start_date', 'end_date', 'vendor_id'] },
    { id: 'bowser-transactions', name: 'Bowser Transactions Report', category: 'Transaction', endpoint: '/api/reports/bowser-transactions', filters: ['start_date', 'end_date', 'bowser_id'] }
  ];
  
  const categories = {};
  reports.forEach(report => {
    if (!categories[report.category]) categories[report.category] = [];
    categories[report.category].push(report);
  });
  
  res.json({ total: reports.length, reports, categories });
});

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

// Daily Business Summary Report
router.get('/daily-business-summary', verifyToken, [
  query('start_date').optional().isISO8601(),
  query('end_date').optional().isISO8601()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { start_date, end_date } = req.query;

  try {
    const params = [];
    let dateFilter = '1=1';
    
    if (start_date) {
      dateFilter += ' AND date >= ?';
      params.push(start_date);
    }
    if (end_date) {
      dateFilter += ' AND date <= ?';
      params.push(end_date);
    }

    // Get day sheets
    const daySheets = await dbQuery(
      `SELECT * FROM day_sheets WHERE ${dateFilter} ORDER BY date DESC`,
      params
    );

    // Get employee sheets
    const employeeSheets = await dbQuery(
      `SELECT es.*, e.name as employee_name
       FROM employee_sheets es
       LEFT JOIN employees e ON es.employee_id = e.id
       WHERE ${dateFilter} ORDER BY date DESC`,
      params
    );

    // Get day business entries
    const dayBusiness = await dbQuery(
      `SELECT db.*, n.nozzle_number, fp.name as product_name
       FROM day_business db
       LEFT JOIN nozzles n ON db.nozzle_id = n.id
       LEFT JOIN fuel_products fp ON n.fuel_product_id = fp.id
       WHERE ${dateFilter} ORDER BY date DESC`,
      params
    );

    res.json({
      daySheets,
      employeeSheets,
      dayBusiness
    });
  } catch (error) {
    console.error('Error fetching daily business summary:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Expenditure Report
router.get('/expenditure', verifyToken, [
  query('start_date').optional().isISO8601(),
  query('end_date').optional().isISO8601(),
  query('expense_type_id').optional().isUUID()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { start_date, end_date, expense_type_id } = req.query;

  try {
    let sql = `
      SELECT e.*,
             et.name as expense_type_name
      FROM expenses e
      LEFT JOIN expense_types et ON e.expense_type_id = et.id
      WHERE 1=1
    `;

    const params = [];

    if (start_date) {
      sql += ' AND e.date >= ?';
      params.push(start_date);
    }
    if (end_date) {
      sql += ' AND e.date <= ?';
      params.push(end_date);
    }
    if (expense_type_id) {
      sql += ' AND e.expense_type_id = ?';
      params.push(expense_type_id);
    }

    sql += ' ORDER BY e.date DESC';

    const data = await dbQuery(sql, params);
    res.json(data);
  } catch (error) {
    console.error('Error fetching expenditure report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Interest Transaction Report
router.get('/interest-transaction', verifyToken, [
  query('start_date').optional().isISO8601(),
  query('end_date').optional().isISO8601(),
  query('customer_id').optional().isUUID()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { start_date, end_date, customer_id } = req.query;

  try {
    let sql = `
      SELECT it.*,
             c.name as customer_name,
             c.phone as customer_phone
      FROM interest_transactions it
      LEFT JOIN customers c ON it.customer_id = c.id
      WHERE 1=1
    `;

    const params = [];

    if (start_date) {
      sql += ' AND it.date >= ?';
      params.push(start_date);
    }
    if (end_date) {
      sql += ' AND it.date <= ?';
      params.push(end_date);
    }
    if (customer_id) {
      sql += ' AND it.customer_id = ?';
      params.push(customer_id);
    }

    sql += ' ORDER BY it.date DESC';

    const data = await dbQuery(sql, params);
    res.json(data);
  } catch (error) {
    console.error('Error fetching interest transaction report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Stock Variation Report
router.get('/stock-variation', verifyToken, [
  query('start_date').optional().isISO8601(),
  query('end_date').optional().isISO8601(),
  query('product_id').optional().isUUID()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { start_date, end_date, product_id } = req.query;

  try {
    let sql = `
      SELECT sv.*,
             fp.name as product_name
      FROM stock_variations sv
      LEFT JOIN fuel_products fp ON sv.product_id = fp.id
      WHERE 1=1
    `;

    const params = [];

    if (start_date) {
      sql += ' AND sv.date >= ?';
      params.push(start_date);
    }
    if (end_date) {
      sql += ' AND sv.date <= ?';
      params.push(end_date);
    }
    if (product_id) {
      sql += ' AND sv.product_id = ?';
      params.push(product_id);
    }

    sql += ' ORDER BY sv.date DESC';

    const data = await dbQuery(sql, params);
    res.json(data);
  } catch (error) {
    console.error('Error fetching stock variation report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Day Wise Stock Value Report
router.get('/day-wise-stock-value', verifyToken, [
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
      SELECT sv.*,
             fp.name as product_name,
             fp.current_rate
      FROM stock_values sv
      LEFT JOIN fuel_products fp ON sv.product_id = fp.id
      WHERE 1=1
    `;

    const params = [];

    if (start_date) {
      sql += ' AND sv.date >= ?';
      params.push(start_date);
    }
    if (end_date) {
      sql += ' AND sv.date <= ?';
      params.push(end_date);
    }

    sql += ' ORDER BY sv.date DESC';

    const data = await dbQuery(sql, params);
    res.json(data);
  } catch (error) {
    console.error('Error fetching day-wise stock value report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Guest Customer Sales Report
router.get('/guest-customer-sales', verifyToken, [
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
      SELECT se.*,
             fp.name as product_name
      FROM sale_entries se
      LEFT JOIN fuel_products fp ON se.fuel_product_id = fp.id
      WHERE se.customer_type = 'guest'
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

    sql += ' ORDER BY se.date DESC';

    const data = await dbQuery(sql, params);
    res.json(data);
  } catch (error) {
    console.error('Error fetching guest customer sales report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Employee Status Report
router.get('/employee-status', verifyToken, [
  query('employee_id').optional().isUUID(),
  query('status').optional().isIn(['active', 'inactive', 'on_leave'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { employee_id, status } = req.query;

  try {
    let sql = 'SELECT * FROM employees WHERE 1=1';
    const params = [];

    if (employee_id) {
      sql += ' AND id = ?';
      params.push(employee_id);
    }
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY name ASC';

    const data = await dbQuery(sql, params);
    res.json(data);
  } catch (error) {
    console.error('Error fetching employee status report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Density Report
router.get('/density', verifyToken, [
  query('start_date').optional().isISO8601(),
  query('end_date').optional().isISO8601(),
  query('tank_id').optional().isUUID()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { start_date, end_date, tank_id } = req.query;

  try {
    let sql = `
      SELECT dr.*,
             t.tank_number,
             fp.name as product_name
      FROM density_readings dr
      LEFT JOIN tanks t ON dr.tank_id = t.id
      LEFT JOIN fuel_products fp ON t.fuel_product_id = fp.id
      WHERE 1=1
    `;

    const params = [];

    if (start_date) {
      sql += ' AND dr.date >= ?';
      params.push(start_date);
    }
    if (end_date) {
      sql += ' AND dr.date <= ?';
      params.push(end_date);
    }
    if (tank_id) {
      sql += ' AND dr.tank_id = ?';
      params.push(tank_id);
    }

    sql += ' ORDER BY dr.date DESC';

    const data = await dbQuery(sql, params);
    res.json(data);
  } catch (error) {
    console.error('Error fetching density report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DSR Format Report
router.get('/dsr-format', verifyToken, [
  query('date').optional().isISO8601()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { date } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];

  try {
    // Get day business data
    const dayBusiness = await dbQuery(
      `SELECT db.*, n.nozzle_number, fp.name as product_name
       FROM day_business db
       LEFT JOIN nozzles n ON db.nozzle_id = n.id
       LEFT JOIN fuel_products fp ON n.fuel_product_id = fp.id
       WHERE db.date = ?
       ORDER BY n.nozzle_number`,
      [targetDate]
    );

    // Get sales summary
    const salesSummary = await dbQuery(
      `SELECT payment_mode, SUM(amount) as total_amount, COUNT(*) as count
       FROM sale_entries
       WHERE date = ?
       GROUP BY payment_mode`,
      [targetDate]
    );

    res.json({
      date: targetDate,
      dayBusiness,
      salesSummary
    });
  } catch (error) {
    console.error('Error fetching DSR format report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Swipe Report
router.get('/swipe', verifyToken, [
  query('start_date').optional().isISO8601(),
  query('end_date').optional().isISO8601(),
  query('machine_id').optional().isUUID()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { start_date, end_date, machine_id } = req.query;

  try {
    let sql = `
      SELECT st.*,
             sm.machine_name,
             sm.machine_type
      FROM swipe_transactions st
      LEFT JOIN swipe_machines sm ON st.machine_id = sm.id
      WHERE 1=1
    `;

    const params = [];

    if (start_date) {
      sql += ' AND st.date >= ?';
      params.push(start_date);
    }
    if (end_date) {
      sql += ' AND st.date <= ?';
      params.push(end_date);
    }
    if (machine_id) {
      sql += ' AND st.machine_id = ?';
      params.push(machine_id);
    }

    sql += ' ORDER BY st.date DESC, st.time DESC';

    const data = await dbQuery(sql, params);
    res.json(data);
  } catch (error) {
    console.error('Error fetching swipe report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Vendor Transaction Report
router.get('/vendor-transaction', verifyToken, [
  query('start_date').optional().isISO8601(),
  query('end_date').optional().isISO8601(),
  query('vendor_id').optional().isUUID()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { start_date, end_date, vendor_id } = req.query;

  try {
    let sql = `
      SELECT vt.*,
             v.name as vendor_name,
             v.phone as vendor_phone
      FROM vendor_transactions vt
      LEFT JOIN vendors v ON vt.vendor_id = v.id
      WHERE 1=1
    `;

    const params = [];

    if (start_date) {
      sql += ' AND vt.date >= ?';
      params.push(start_date);
    }
    if (end_date) {
      sql += ' AND vt.date <= ?';
      params.push(end_date);
    }
    if (vendor_id) {
      sql += ' AND vt.vendor_id = ?';
      params.push(vendor_id);
    }

    sql += ' ORDER BY vt.date DESC';

    const data = await dbQuery(sql, params);
    res.json(data);
  } catch (error) {
    console.error('Error fetching vendor transaction report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Bowser Transactions Report
router.get('/bowser-transactions', verifyToken, [
  query('start_date').optional().isISO8601(),
  query('end_date').optional().isISO8601(),
  query('bowser_id').optional().isUUID()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { start_date, end_date, bowser_id } = req.query;

  try {
    let sql = `
      SELECT bt.*,
             b.name as bowser_name,
             b.vehicle_number,
             fp.name as product_name
      FROM bowser_transactions bt
      LEFT JOIN bowsers b ON bt.bowser_id = b.id
      LEFT JOIN fuel_products fp ON bt.fuel_product_id = fp.id
      WHERE 1=1
    `;

    const params = [];

    if (start_date) {
      sql += ' AND bt.date >= ?';
      params.push(start_date);
    }
    if (end_date) {
      sql += ' AND bt.date <= ?';
      params.push(end_date);
    }
    if (bowser_id) {
      sql += ' AND bt.bowser_id = ?';
      params.push(bowser_id);
    }

    sql += ' ORDER BY bt.date DESC';

    const data = await dbQuery(sql, params);
    res.json(data);
  } catch (error) {
    console.error('Error fetching bowser transactions report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get report template API mappings
router.get('/template-mappings', verifyToken, async (req, res) => {
  try {
    const sqlite3 = require('sqlite3');
    const { open } = require('sqlite');
    const path = require('path');

    const db = await open({
      filename: path.join(__dirname, '../../petrol_pump.db'),
      driver: sqlite3.Database
    });

    const mappings = await db.all('SELECT * FROM report_template_api_mappings ORDER BY category, template_name');
    await db.close();

    res.json(mappings);
  } catch (error) {
    console.error('Error fetching template mappings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;