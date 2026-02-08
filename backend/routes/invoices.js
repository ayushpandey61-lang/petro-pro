const express = require('express');
const { body, validationResult } = require('express-validator');
const { query: dbQuery, queryOne, execute } = require('../lib/sqlite');

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

// Liquid Purchase Invoice
router.get('/liquid-purchase', verifyToken, async (req, res) => {
  try {
    const sql = `
      SELECT lp.*,
             v.name as vendor_name,
             v.address as vendor_address,
             fp.name as fuel_product_name
      FROM liquid_purchases lp
      LEFT JOIN vendors v ON lp.vendor_id = v.id
      LEFT JOIN fuel_products fp ON lp.fuel_product_id = fp.id
      ORDER BY lp.created_at DESC
    `;
    const data = await dbQuery(sql);
    res.json(data);
  } catch (error) {
    console.error('Error fetching liquid purchases:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/liquid-purchase', verifyToken, [
  body('date').isISO8601(),
  body('vendor_id').isUUID(),
  body('fuel_product_id').isUUID(),
  body('quantity').isFloat({ min: 0 }),
  body('rate').isFloat({ min: 0 }),
  body('total_amount').isFloat({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { date, vendor_id, fuel_product_id, quantity, rate, total_amount } = req.body;
    const sql = `
      INSERT INTO liquid_purchases (date, vendor_id, fuel_product_id, quantity, rate, total_amount, created_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `;
    const result = await execute(sql, [date, vendor_id, fuel_product_id, quantity, rate, total_amount]);

    // Get the inserted record
    const insertedData = await queryOne('SELECT * FROM liquid_purchases WHERE id = ?', [result.lastID]);
    res.json(insertedData);
  } catch (error) {
    console.error('Error creating liquid purchase:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Lube Purchase Invoice
router.get('/lube-purchase', verifyToken, async (req, res) => {
  try {
    const sql = `
      SELECT lp.*,
             v.name as vendor_name,
             v.address as vendor_address,
             l.name as lubricant_name
      FROM lube_purchases lp
      LEFT JOIN vendors v ON lp.vendor_id = v.id
      LEFT JOIN lubricants l ON lp.lubricant_id = l.id
      ORDER BY lp.created_at DESC
    `;
    const data = await dbQuery(sql);
    res.json(data);
  } catch (error) {
    console.error('Error fetching lube purchases:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/lube-purchase', verifyToken, [
  body('date').isISO8601(),
  body('vendor_id').isUUID(),
  body('lubricant_id').isUUID(),
  body('quantity').isFloat({ min: 0 }),
  body('rate').isFloat({ min: 0 }),
  body('total_amount').isFloat({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { date, vendor_id, lubricant_id, quantity, rate, total_amount } = req.body;
    const sql = `
      INSERT INTO lube_purchases (date, vendor_id, lubricant_id, quantity, rate, total_amount, created_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `;
    const result = await execute(sql, [date, vendor_id, lubricant_id, quantity, rate, total_amount]);

    // Get the inserted record
    const insertedData = await queryOne('SELECT * FROM lube_purchases WHERE id = ?', [result.lastID]);
    res.json(insertedData);
  } catch (error) {
    console.error('Error creating lube purchase:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Sales Invoice
router.get('/sales', verifyToken, async (req, res) => {
  try {
    const sql = `
      SELECT si.*,
             c.name as customer_name,
             c.address as customer_address,
             c.phone as customer_phone
      FROM sales_invoices si
      LEFT JOIN customers c ON si.customer_id = c.id
      ORDER BY si.created_at DESC
    `;
    const data = await dbQuery(sql);
    res.json(data);
  } catch (error) {
    console.error('Error fetching sales invoices:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/sales', verifyToken, [
  body('date').isISO8601(),
  body('customer_id').optional().isUUID(),
  body('items').isArray({ min: 1 }),
  body('items.*.product_id').isUUID(),
  body('items.*.quantity').isFloat({ min: 0 }),
  body('items.*.rate').isFloat({ min: 0 }),
  body('total_amount').isFloat({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { date, customer_id, items, total_amount } = req.body;
    const sql = `
      INSERT INTO sales_invoices (date, customer_id, total_amount, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `;
    const result = await execute(sql, [date, customer_id, total_amount]);

    // Insert invoice items
    for (const item of items) {
      const itemSql = `
        INSERT INTO sales_invoice_items (invoice_id, product_id, quantity, rate, amount)
        VALUES (?, ?, ?, ?, ?)
      `;
      await execute(itemSql, [result.lastID, item.product_id, item.quantity, item.rate, item.quantity * item.rate]);
    }

    // Get the inserted record with items
    const insertedData = await queryOne('SELECT * FROM sales_invoices WHERE id = ?', [result.lastID]);
    res.json(insertedData);
  } catch (error) {
    console.error('Error creating sales invoice:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Generate Invoice PDF (placeholder - would need PDF generation library)
router.get('/generate-pdf/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query; // 'sales', 'purchase'

    let table, select;
    if (type === 'sales') {
      table = 'sales_invoices';
      select = `
        *,
        customers:customer_id (
          name,
          address,
          phone
        )
      `;
    } else {
      table = 'liquid_purchases';
      select = `
        *,
        vendors:vendor_id (
          name,
          address
        ),
        fuel_products:fuel_product_id (
          name
        )
      `;
    }

    let sql;
    if (type === 'sales') {
      sql = `
        SELECT si.*,
               c.name as customer_name,
               c.address as customer_address,
               c.phone as customer_phone
        FROM sales_invoices si
        LEFT JOIN customers c ON si.customer_id = c.id
        WHERE si.id = ?
      `;
    } else {
      sql = `
        SELECT lp.*,
               v.name as vendor_name,
               v.address as vendor_address,
               fp.name as fuel_product_name
        FROM liquid_purchases lp
        LEFT JOIN vendors v ON lp.vendor_id = v.id
        LEFT JOIN fuel_products fp ON lp.fuel_product_id = fp.id
        WHERE lp.id = ?
      `;
    }

    const data = await queryOne(sql, [id]);
    if (!data) return res.status(404).json({ error: 'Invoice not found' });

    // Here you would generate PDF using a library like pdfkit or puppeteer
    // For now, return the data
    res.json({
      message: 'PDF generation not implemented yet',
      data
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;