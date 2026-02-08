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

// Employees
router.get('/employees', verifyToken, async (req, res) => {
  try {
    const employees = await query(
      'SELECT * FROM employees ORDER BY created_at DESC'
    );
    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/employees', verifyToken, [
  body('name').notEmpty().trim(),
  body('email').optional().isEmail(),
  body('phone').optional().isMobilePhone()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, phone, address, salary, join_date } = req.body;
    const result = await query(
      'INSERT INTO employees (name, email, phone, address, salary, join_date) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone, address, salary, join_date]
    );

    const newEmployee = await query(
      'SELECT * FROM employees WHERE id = ?',
      [result.insertId]
    );

    res.json(newEmployee[0]);
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/employees/:id', verifyToken, async (req, res) => {
  try {
    const { name, email, phone, address, salary, join_date } = req.body;
    await query(
      'UPDATE employees SET name = ?, email = ?, phone = ?, address = ?, salary = ?, join_date = ? WHERE id = ?',
      [name, email, phone, address, salary, join_date, req.params.id]
    );

    const updatedEmployee = await query(
      'SELECT * FROM employees WHERE id = ?',
      [req.params.id]
    );

    res.json(updatedEmployee[0]);
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/employees/:id', verifyToken, async (req, res) => {
  try {
    await query('DELETE FROM employees WHERE id = ?', [req.params.id]);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fuel Products
router.get('/fuel-products', verifyToken, async (req, res) => {
  try {
    const fuelProducts = await query(
      'SELECT * FROM fuel_products ORDER BY created_at DESC'
    );
    res.json(fuelProducts);
  } catch (error) {
    console.error('Get fuel products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/fuel-products', verifyToken, [
  body('name').notEmpty().trim(),
  body('price').isFloat({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, price, unit } = req.body;
    const result = await query(
      'INSERT INTO fuel_products (name, price, unit) VALUES (?, ?, ?)',
      [name, price, unit || 'liter']
    );

    const newFuelProduct = await query(
      'SELECT * FROM fuel_products WHERE id = ?',
      [result.insertId]
    );

    res.json(newFuelProduct[0]);
  } catch (error) {
    console.error('Create fuel product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add similar CRUD for other master entities: lubricants, credit_parties, vendors, tanks, nozzles, etc.
// For brevity, I'll add a generic pattern

// Generic CRUD helper
const createCrudRoutes = (tableName, validations = {}) => {
  const basePath = `/${tableName.replace('_', '-')}`;

  router.get(basePath, verifyToken, async (req, res) => {
    try {
      const items = await query(
        `SELECT * FROM ${tableName} ORDER BY created_at DESC`
      );
      res.json(items);
    } catch (error) {
      console.error(`Get ${tableName} error:`, error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post(basePath, verifyToken, validations.create || [], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Get column names dynamically (excluding id, created_at, updated_at)
      const columns = Object.keys(req.body).filter(key =>
        !['id', 'created_at', 'updated_at'].includes(key)
      );

      const placeholders = columns.map(() => '?').join(', ');
      const values = columns.map(col => req.body[col]);

      const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
      const result = await query(sql, values);

      const newItem = await query(
        `SELECT * FROM ${tableName} WHERE id = ?`,
        [result.insertId]
      );

      res.json(newItem[0]);
    } catch (error) {
      console.error(`Create ${tableName} error:`, error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.put(`${basePath}/:id`, verifyToken, async (req, res) => {
    try {
      const columns = Object.keys(req.body).filter(key =>
        !['id', 'created_at', 'updated_at'].includes(key)
      );

      if (columns.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      const setClause = columns.map(col => `${col} = ?`).join(', ');
      const values = columns.map(col => req.body[col]);
      values.push(req.params.id);

      await query(
        `UPDATE ${tableName} SET ${setClause} WHERE id = ?`,
        values
      );

      const updatedItem = await query(
        `SELECT * FROM ${tableName} WHERE id = ?`,
        [req.params.id]
      );

      res.json(updatedItem[0]);
    } catch (error) {
      console.error(`Update ${tableName} error:`, error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.delete(`${basePath}/:id`, verifyToken, async (req, res) => {
    try {
      await query(`DELETE FROM ${tableName} WHERE id = ?`, [req.params.id]);
      res.json({ message: `${tableName} deleted successfully` });
    } catch (error) {
      console.error(`Delete ${tableName} error:`, error);
      res.status(500).json({ error: 'Server error' });
    }
  });
};

// Create routes for other master tables
createCrudRoutes('liquids');
createCrudRoutes('lubricants');
createCrudRoutes('credit_parties');
createCrudRoutes('vendors');
createCrudRoutes('tanks');
createCrudRoutes('nozzles');
createCrudRoutes('expense_types');
createCrudRoutes('business_cr_dr_parties');
createCrudRoutes('swipe_machines');
createCrudRoutes('expiry_items');
createCrudRoutes('shifts');
createCrudRoutes('print_templates');
createCrudRoutes('guest_customers');
createCrudRoutes('denominations');
createCrudRoutes('tank_dips');
createCrudRoutes('tank_lorry_management');

module.exports = router;