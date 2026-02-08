const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, execute } = require('../lib/sqlite');

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

// Day Assigning
router.get('/assigning', verifyToken, async (req, res) => {
  try {
    const data = await query(
      'SELECT * FROM day_assigning ORDER BY created_at DESC'
    );
    res.json(data);
  } catch (error) {
    console.error('Get day assigning error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/assigning', verifyToken, [
  body('date').isISO8601(),
  body('employee_id').isInt(),
  body('shift_id').isInt()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { date, employee_id, shift_id } = req.body;
    const result = await execute(
      'INSERT INTO day_assigning (date, employee_id, shift_id) VALUES (?, ?, ?)',
      [date, employee_id, shift_id]
    );

    const newRecord = await query(
      'SELECT * FROM day_assigning WHERE id = ?',
      [result.lastID]
    );

    res.json(newRecord[0]);
  } catch (error) {
    console.error('Create day assigning error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Daily Sale Rates
router.get('/sale-rates', verifyToken, async (req, res) => {
  try {
    const data = await query(
      'SELECT * FROM daily_sale_rates ORDER BY date DESC'
    );
    res.json(data);
  } catch (error) {
    console.error('Get sale rates error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/sale-rates', verifyToken, [
  body('date').isISO8601(),
  body('fuel_product_id').isUUID(),
  body('rate').isFloat({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { date, fuel_product_id, rate } = req.body;
    const result = await execute(
      'INSERT INTO daily_sale_rates (date, fuel_product_id, rate) VALUES (?, ?, ?)',
      [date, fuel_product_id, rate]
    );

    const newRecord = await query(
      'SELECT * FROM daily_sale_rates WHERE id = ?',
      [result.lastID]
    );

    res.json(newRecord[0]);
  } catch (error) {
    console.error('Create sale rate error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Sale Entries
router.get('/sale-entries', verifyToken, async (req, res) => {
  try {
    const data = await query(
      'SELECT * FROM sale_entries ORDER BY created_at DESC'
    );
    res.json(data);
  } catch (error) {
    console.error('Get sale entries error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/sale-entries', verifyToken, [
  body('date').isISO8601(),
  body('nozzle_id').isUUID(),
  body('opening_reading').isFloat({ min: 0 }),
  body('closing_reading').isFloat({ min: 0 }),
  body('total_sale').isFloat({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { date, nozzle_id, opening_reading, closing_reading, total_sale } = req.body;
    const result = await execute(
      'INSERT INTO sale_entries (date, nozzle_id, opening_reading, closing_reading, total_sale) VALUES (?, ?, ?, ?, ?)',
      [date, nozzle_id, opening_reading, closing_reading, total_sale]
    );

    const newRecord = await query(
      'SELECT * FROM sale_entries WHERE id = ?',
      [result.lastID]
    );

    res.json(newRecord[0]);
  } catch (error) {
    console.error('Create sale entry error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Lubricants Sale
router.get('/lubricants-sale', verifyToken, async (req, res) => {
  try {
    const data = await query(
      'SELECT * FROM lube_sales ORDER BY created_at DESC'
    );
    res.json(data);
  } catch (error) {
    console.error('Get lubricants sale error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/lubricants-sale', verifyToken, [
  body('sale_date').isISO8601(),
  body('product_id').isInt({ min: 1 }),
  body('quantity').isFloat({ min: 0 }),
  body('rate').isFloat({ min: 0 }),
  body('amount').optional().isFloat({ min: 0 }),
  body('discount').optional().isFloat({ min: 0 }),
  body('shift_id').optional().isInt({ min: 1 }),
  body('employee_id').optional().isInt({ min: 1 }),
  body('description').optional().trim(),
  body('sale_type').optional().isIn(['Cash', 'Credit']),
  body('gst_no').optional().trim(),
  body('bill_no').optional().trim(),
  body('indent').optional().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Calculate amount if not provided
    const dataToInsert = { ...req.body };
    if (!dataToInsert.amount && dataToInsert.quantity && dataToInsert.rate) {
      dataToInsert.amount = dataToInsert.quantity * dataToInsert.rate;
    }

    // Generate transaction number
    const existingSales = await query('SELECT COUNT(*) as count FROM lube_sales');
    const nextId = (existingSales[0].count || 0) + 1;
    dataToInsert.txn_no = `LUBE-${String(nextId).padStart(4, '0')}`;

    const { sale_date, product_id, quantity, rate, amount, discount, shift_id, employee_id, description, sale_type, gst_no, bill_no, indent, txn_no } = dataToInsert;
    const result = await execute(
      'INSERT INTO lube_sales (sale_date, product_id, quantity, rate, amount, discount, shift_id, employee_id, description, sale_type, gst_no, bill_no, indent, txn_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [sale_date, product_id, quantity, rate, amount, discount, shift_id, employee_id, description, sale_type, gst_no, bill_no, indent, txn_no]
    );

    const newRecord = await query(
      'SELECT * FROM lube_sales WHERE id = ?',
      [result.lastID]
    );

    res.json(newRecord[0]);
  } catch (error) {
    console.error('Create lubricants sale error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT route for updating lubricants sale
router.put('/lubricants-sale/:id', verifyToken, [
  body('sale_date').optional().isISO8601(),
  body('product_id').optional().isInt({ min: 1 }),
  body('quantity').optional().isFloat({ min: 0 }),
  body('rate').optional().isFloat({ min: 0 }),
  body('amount').optional().isFloat({ min: 0 }),
  body('discount').optional().isFloat({ min: 0 }),
  body('shift_id').optional().isInt({ min: 1 }),
  body('employee_id').optional().isInt({ min: 1 }),
  body('description').optional().trim(),
  body('sale_type').optional().isIn(['Cash', 'Credit']),
  body('gst_no').optional().trim(),
  body('bill_no').optional().trim(),
  body('indent').optional().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const dataToUpdate = { ...req.body };

    // Recalculate amount if quantity or rate changed
    if ((dataToUpdate.quantity || dataToUpdate.rate) && !dataToUpdate.amount) {
      const currentData = await query('SELECT quantity, rate FROM lube_sales WHERE id = ?', [id]);
      if (currentData.length > 0) {
        const quantity = dataToUpdate.quantity || currentData[0].quantity;
        const rate = dataToUpdate.rate || currentData[0].rate;
        dataToUpdate.amount = quantity * rate;
      }
    }

    const updateFields = [];
    const updateValues = [];
    Object.keys(dataToUpdate).forEach(key => {
      if (dataToUpdate[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(dataToUpdate[key]);
      }
    });
    updateValues.push(id);

    await execute(
      `UPDATE lube_sales SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    const updatedRecord = await query(
      'SELECT * FROM lube_sales WHERE id = ?',
      [id]
    );

    res.json(updatedRecord[0]);
  } catch (error) {
    console.error('Update lubricants sale error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE route for lubricants sale
router.delete('/lubricants-sale/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await execute('DELETE FROM lube_sales WHERE id = ?', [id]);
    res.json({ message: 'Lubricants sale deleted successfully' });
  } catch (error) {
    console.error('Delete lubricants sale error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Swipe transactions
router.get('/swipe', verifyToken, async (req, res) => {
  try {
    const data = await query(
      'SELECT * FROM swipe_transactions ORDER BY created_at DESC'
    );
    res.json(data);
  } catch (error) {
    console.error('Get swipe transactions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/swipe', verifyToken, [
  body('date').isISO8601(),
  body('amount').isFloat({ min: 0 }),
  body('card_number').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { date, amount, card_number } = req.body;
    const result = await execute(
      'INSERT INTO swipe_transactions (date, amount, card_number) VALUES (?, ?, ?)',
      [date, amount, card_number]
    );

    const newRecord = await query(
      'SELECT * FROM swipe_transactions WHERE id = ?',
      [result.lastID]
    );

    res.json(newRecord[0]);
  } catch (error) {
    console.error('Create swipe transaction error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Credit Sale
router.get('/credit-sale', verifyToken, async (req, res) => {
  try {
    const data = await query(
      'SELECT * FROM credit_sales ORDER BY created_at DESC'
    );
    res.json(data);
  } catch (error) {
    console.error('Get credit sales error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/credit-sale', verifyToken, [
  body('date').isISO8601(),
  body('customer_id').isUUID(),
  body('amount').isFloat({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { date, customer_id, amount } = req.body;
    const result = await execute(
      'INSERT INTO credit_sales (date, customer_id, amount) VALUES (?, ?, ?)',
      [date, customer_id, amount]
    );

    const newRecord = await query(
      'SELECT * FROM credit_sales WHERE id = ?',
      [result.lastID]
    );

    res.json(newRecord[0]);
  } catch (error) {
    console.error('Create credit sale error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Expenses
router.get('/expenses', verifyToken, async (req, res) => {
  try {
    const data = await query(
      'SELECT * FROM expenses ORDER BY created_at DESC'
    );
    res.json(data);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/expenses', verifyToken, [
  body('date').isISO8601(),
  body('expense_type_id').isUUID(),
  body('amount').isFloat({ min: 0 }),
  body('description').optional().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { date, expense_type_id, amount, description } = req.body;
    const result = await execute(
      'INSERT INTO expenses (date, expense_type_id, amount, description) VALUES (?, ?, ?, ?)',
      [date, expense_type_id, amount, description]
    );

    const newRecord = await query(
      'SELECT * FROM expenses WHERE id = ?',
      [result.lastID]
    );

    res.json(newRecord[0]);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Recovery
router.get('/recovery', verifyToken, async (req, res) => {
  try {
    const data = await query(
      'SELECT * FROM recovery ORDER BY created_at DESC'
    );
    res.json(data);
  } catch (error) {
    console.error('Get recovery error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/recovery', verifyToken, [
  body('date').isISO8601(),
  body('employee_id').isUUID(),
  body('amount').isFloat({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { date, employee_id, amount } = req.body;
    const result = await execute(
      'INSERT INTO recovery (date, employee_id, amount) VALUES (?, ?, ?)',
      [date, employee_id, amount]
    );

    const newRecord = await query(
      'SELECT * FROM recovery WHERE id = ?',
      [result.lastID]
    );

    res.json(newRecord[0]);
  } catch (error) {
    console.error('Create recovery error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Day Opening Stock
router.get('/opening-stock', verifyToken, async (req, res) => {
  try {
    const data = await query(
      'SELECT * FROM day_opening_stock ORDER BY date DESC'
    );
    res.json(data);
  } catch (error) {
    console.error('Get opening stock error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/opening-stock', verifyToken, [
  body('date').isISO8601(),
  body('tank_id').isUUID(),
  body('opening_stock').isFloat({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { date, tank_id, opening_stock } = req.body;
    const result = await execute(
      'INSERT INTO day_opening_stock (date, tank_id, opening_stock) VALUES (?, ?, ?)',
      [date, tank_id, opening_stock]
    );

    const newRecord = await query(
      'SELECT * FROM day_opening_stock WHERE id = ?',
      [result.lastID]
    );

    res.json(newRecord[0]);
  } catch (error) {
    console.error('Create opening stock error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Day Settlement
router.get('/settlement', verifyToken, async (req, res) => {
  try {
    const data = await query(
      'SELECT * FROM day_settlement ORDER BY date DESC'
    );
    res.json(data);
  } catch (error) {
    console.error('Get settlement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/settlement', verifyToken, [
  body('date').isISO8601(),
  body('total_sales').isFloat({ min: 0 }),
  body('total_expenses').isFloat({ min: 0 }),
  body('net_amount').isFloat()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { date, total_sales, total_expenses, net_amount } = req.body;
    const result = await execute(
      'INSERT INTO day_settlement (date, total_sales, total_expenses, net_amount) VALUES (?, ?, ?, ?)',
      [date, total_sales, total_expenses, net_amount]
    );

    const newRecord = await query(
      'SELECT * FROM day_settlement WHERE id = ?',
      [result.lastID]
    );

    res.json(newRecord[0]);
  } catch (error) {
    console.error('Create settlement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;