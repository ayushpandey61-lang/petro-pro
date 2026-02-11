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

// Get all available reports (metadata endpoint)
router.get('/list', verifyToken, (req, res) => {
  const reports = [
    {
      id: 'all-credit-customer',
      name: 'All Credit Customer Report',
      category: 'Credit & Sales',
      endpoint: '/api/reports/all-credit-customer',
      method: 'GET',
      filters: ['start_date', 'end_date'],
      description: 'View all credit sales customers and their transactions'
    },
    {
      id: 'attendance',
      name: 'Attendance Report',
      category: 'Employee Management',
      endpoint: '/api/reports/attendance',
      method: 'GET',
      filters: ['start_date', 'end_date', 'employee_id'],
      description: 'Track employee attendance records'
    },
    {
      id: 'business-flow',
      name: 'Business Flow Report',
      category: 'Business Analytics',
      endpoint: '/api/reports/business-flow',
      method: 'GET',
      filters: ['start_date', 'end_date'],
      description: 'Analyze daily business flow including sales and expenses'
    },
    {
      id: 'customer-statement',
      name: 'Customer Statement',
      category: 'Credit & Sales',
      endpoint: '/api/reports/customer-statement/:customer_id',
      method: 'GET',
      filters: ['start_date', 'end_date'],
      description: 'Detailed statement for specific customer'
    },
    {
      id: 'daily-rate-history',
      name: 'Daily Rate History',
      category: 'Pricing',
      endpoint: '/api/reports/daily-rate-history',
      method: 'GET',
      filters: ['start_date', 'end_date', 'fuel_product_id'],
      description: 'Historical pricing data for fuel products'
    },
    {
      id: 'sales',
      name: 'Sales Report',
      category: 'Sales',
      endpoint: '/api/reports/sales',
      method: 'GET',
      filters: ['start_date', 'end_date', 'fuel_product_id'],
      description: 'Comprehensive sales report with product details'
    },
    {
      id: 'lubricants-stock',
      name: 'Lubricants Stock Report',
      category: 'Inventory',
      endpoint: '/api/reports/lubricants-stock',
      method: 'GET',
      filters: [],
      description: 'Current lubricants inventory status'
    },
    {
      id: 'purchase',
      name: 'Purchase Report',
      category: 'Purchase',
      endpoint: '/api/reports/purchase',
      method: 'GET',
      filters: ['start_date', 'end_date'],
      description: 'Vendor purchase transactions and invoices'
    },
    {
      id: 'daily-business-summary',
      name: 'Daily Business Summary',
      category: 'Business Analytics',
      endpoint: '/api/reports/daily-business-summary',
      method: 'GET',
      filters: ['start_date', 'end_date'],
      description: 'Daily business operations summary'
    },
    {
      id: 'bunk-day',
      name: 'Bunk Day Report',
      category: 'Business Analytics',
      endpoint: '/api/reports/bunk-day',
      method: 'GET',
      filters: ['start_date', 'end_date'],
      description: 'Complete bunk day operations report'
    },
    {
      id: 'daily-stock-sale-register',
      name: 'Daily Stock & Sale Register',
      category: 'Inventory',
      endpoint: '/api/reports/daily-stock-sale-register',
      method: 'GET',
      filters: ['start_date', 'end_date'],
      description: 'Daily register of stock and sales'
    },
    {
      id: 'day-wise-stock-value',
      name: 'Day-wise Stock Value',
      category: 'Inventory',
      endpoint: '/api/reports/day-wise-stock-value',
      method: 'GET',
      filters: ['start_date', 'end_date'],
      description: 'Stock valuation on a daily basis'
    },
    {
      id: 'stock-variation',
      name: 'Stock Variation Report',
      category: 'Inventory',
      endpoint: '/api/reports/stock-variation',
      method: 'GET',
      filters: ['start_date', 'end_date', 'fuel_product_id'],
      description: 'Track stock variations and discrepancies'
    },
    {
      id: 'swipe',
      name: 'Swipe Report',
      category: 'Payments',
      endpoint: '/api/reports/swipe',
      method: 'GET',
      filters: ['start_date', 'end_date', 'machine_id'],
      description: 'Card payment transactions report'
    },
    {
      id: 'vendor-transaction',
      name: 'Vendor Transaction Report',
      category: 'Purchase',
      endpoint: '/api/reports/vendor-transaction',
      method: 'GET',
      filters: ['start_date', 'end_date', 'vendor_id'],
      description: 'Detailed vendor transaction history'
    },
    {
      id: 'expenditure',
      name: 'Expenditure Report',
      category: 'Finance',
      endpoint: '/api/reports/expenditure',
      method: 'GET',
      filters: ['start_date', 'end_date', 'expense_type_id'],
      description: 'Track all expenditures and expenses'
    },
    {
      id: 'guest-customer-sales',
      name: 'Guest Customer Sales',
      category: 'Sales',
      endpoint: '/api/reports/guest-customer-sales',
      method: 'GET',
      filters: ['start_date', 'end_date'],
      description: 'Sales to walk-in customers'
    },
    {
      id: 'taxation',
      name: 'Taxation Report',
      category: 'Finance',
      endpoint: '/api/reports/taxation',
      method: 'GET',
      filters: ['start_date', 'end_date'],
      description: 'Tax calculation and GST reporting'
    },
    {
      id: 'density',
      name: 'Density Report',
      category: 'Technical',
      endpoint: '/api/reports/density',
      method: 'GET',
      filters: ['start_date', 'end_date'],
      description: 'Fuel density measurements'
    },
    {
      id: 'discount-offered',
      name: 'Discount Offered',
      category: 'Sales',
      endpoint: '/api/reports/discount-offered',
      method: 'GET',
      filters: ['start_date', 'end_date'],
      description: 'All discounts provided to customers'
    },
    {
      id: 'dsr-format',
      name: 'DSR Format Report',
      category: 'Business Analytics',
      endpoint: '/api/reports/dsr-format',
      method: 'GET',
      filters: ['date'],
      description: 'Daily Sales Register in standard format'
    },
    {
      id: 'employee-status',
      name: 'Employee Status Report',
      category: 'Employee Management',
      endpoint: '/api/reports/employee-status',
      method: 'GET',
      filters: ['employee_id'],
      description: 'Current status of all employees'
    },
    {
      id: 'bowser-transactions',
      name: 'Bowser Transactions',
      category: 'Operations',
      endpoint: '/api/reports/bowser-transactions',
      method: 'GET',
      filters: ['start_date', 'end_date'],
      description: 'Mobile fuel delivery transactions'
    },
    {
      id: 'feedback',
      name: 'Feedback Report',
      category: 'Customer Service',
      endpoint: '/api/reports/feedback',
      method: 'GET',
      filters: ['start_date', 'end_date'],
      description: 'Customer feedback and ratings'
    },
    {
      id: 'interest-transaction',
      name: 'Interest Transaction',
      category: 'Finance',
      endpoint: '/api/reports/interest-transaction',
      method: 'GET',
      filters: ['start_date', 'end_date', 'customer_id'],
      description: 'Interest calculations on credit sales'
    }
  ];

  // Group reports by category
  const categories = {};
  reports.forEach(report => {
    if (!categories[report.category]) {
      categories[report.category] = [];
    }
    categories[report.category].push(report);
  });

  res.json({
    total: reports.length,
    reports,
    categories
  });
});

// Note: All endpoints below now use MySQL through the database.js module

// Existing report endpoints continue here...
// (The existing endpoints from reports.js can be added here)

module.exports = router;
