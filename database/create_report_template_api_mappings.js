const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const DB_PATH = path.join(__dirname, '../petrol_pump.db');

async function getDB() {
  return await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });
}

async function createReportTemplateApiMappings() {
  try {
    const db = await getDB();

    // Create report_template_api_mappings table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS report_template_api_mappings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        template_id TEXT UNIQUE NOT NULL,
        template_name TEXT NOT NULL,
        category TEXT NOT NULL,
        api_endpoint TEXT NOT NULL,
        api_method TEXT DEFAULT 'GET',
        requires_auth BOOLEAN DEFAULT 1,
        filters TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ report_template_api_mappings table created/verified');

    // Insert all report template API mappings
    console.log('Inserting report template API mappings...');
    
    const mappings = [
      // Business Reports
      { 
        template_id: 'daily-business-summary',
        template_name: 'Daily Business Summary',
        category: 'business',
        api_endpoint: '/api/reports/daily-business-summary',
        filters: JSON.stringify(['start_date', 'end_date'])
      },
      { 
        template_id: 'sales-report',
        template_name: 'Sales Report',
        category: 'business',
        api_endpoint: '/api/reports/sales',
        filters: JSON.stringify(['start_date', 'end_date', 'fuel_product_id'])
      },
      { 
        template_id: 'business-flow',
        template_name: 'Business Flow Report',
        category: 'business',
        api_endpoint: '/api/reports/business-flow',
        filters: JSON.stringify(['start_date', 'end_date'])
      },

      // Financial Reports
      { 
        template_id: 'purchase-report',
        template_name: 'Purchase Report',
        category: 'financial',
        api_endpoint: '/api/reports/purchase',
        filters: JSON.stringify(['start_date', 'end_date'])
      },
      { 
        template_id: 'expenditure-report',
        template_name: 'Expenditure Report',
        category: 'financial',
        api_endpoint: '/api/reports/expenditure',
        filters: JSON.stringify(['start_date', 'end_date', 'expense_type_id'])
      },
      { 
        template_id: 'interest-transaction',
        template_name: 'Interest Transaction Report',
        category: 'financial',
        api_endpoint: '/api/reports/interest-transaction',
        filters: JSON.stringify(['start_date', 'end_date', 'customer_id'])
      },

      // Inventory Reports
      { 
        template_id: 'stock-variation',
        template_name: 'Stock Variation Report',
        category: 'inventory',
        api_endpoint: '/api/reports/stock-variation',
        filters: JSON.stringify(['start_date', 'end_date', 'product_id'])
      },
      { 
        template_id: 'lubricants-stock',
        template_name: 'Lubricants Stock Report',
        category: 'inventory',
        api_endpoint: '/api/reports/lubricants-stock',
        filters: JSON.stringify([])
      },
      { 
        template_id: 'day-wise-stock-value',
        template_name: 'Day Wise Stock Value Report',
        category: 'inventory',
        api_endpoint: '/api/reports/day-wise-stock-value',
        filters: JSON.stringify(['start_date', 'end_date'])
      },

      // Customer Reports
      { 
        template_id: 'credit-customer',
        template_name: 'Credit Customer Report',
        category: 'customer',
        api_endpoint: '/api/reports/all-credit-customer',
        filters: JSON.stringify(['start_date', 'end_date'])
      },
      { 
        template_id: 'guest-customer-sales',
        template_name: 'Guest Customer Sales Report',
        category: 'customer',
        api_endpoint: '/api/reports/guest-customer-sales',
        filters: JSON.stringify(['start_date', 'end_date'])
      },
      { 
        template_id: 'customer-statement',
        template_name: 'Customer Statement',
        category: 'customer',
        api_endpoint: '/api/reports/customer-statement',
        filters: JSON.stringify(['customer_id', 'start_date', 'end_date'])
      },

      // Employee Reports
      { 
        template_id: 'attendance',
        template_name: 'Employee Attendance Report',
        category: 'employee',
        api_endpoint: '/api/reports/attendance',
        filters: JSON.stringify(['start_date', 'end_date', 'employee_id'])
      },
      { 
        template_id: 'employee-status',
        template_name: 'Employee Status Report',
        category: 'employee',
        api_endpoint: '/api/reports/employee-status',
        filters: JSON.stringify(['employee_id', 'status'])
      },

      // Operational Reports
      { 
        template_id: 'density-report',
        template_name: 'Density Report',
        category: 'operational',
        api_endpoint: '/api/reports/density',
        filters: JSON.stringify(['start_date', 'end_date', 'tank_id'])
      },
      { 
        template_id: 'dsr-format',
        template_name: 'DSR Format Report',
        category: 'operational',
        api_endpoint: '/api/reports/dsr-format',
        filters: JSON.stringify(['date'])
      },
      { 
        template_id: 'swipe-report',
        template_name: 'Swipe Report',
        category: 'operational',
        api_endpoint: '/api/reports/swipe',
        filters: JSON.stringify(['start_date', 'end_date', 'machine_id'])
      },

      // Transaction Reports
      { 
        template_id: 'vendor-transaction',
        template_name: 'Vendor Transaction Report',
        category: 'transaction',
        api_endpoint: '/api/reports/vendor-transaction',
        filters: JSON.stringify(['start_date', 'end_date', 'vendor_id'])
      },
      { 
        template_id: 'bowser-transactions',
        template_name: 'Bowser Transactions Report',
        category: 'transaction',
        api_endpoint: '/api/reports/bowser-transactions',
        filters: JSON.stringify(['start_date', 'end_date', 'bowser_id'])
      }
    ];

    for (const mapping of mappings) {
      try {
        await db.run(
          `INSERT OR REPLACE INTO report_template_api_mappings 
           (template_id, template_name, category, api_endpoint, filters) 
           VALUES (?, ?, ?, ?, ?)`,
          [mapping.template_id, mapping.template_name, mapping.category, mapping.api_endpoint, mapping.filters]
        );
        console.log('✅ Inserted/Updated mapping:', mapping.template_id);
      } catch (error) {
        console.error('❌ Error inserting mapping:', mapping.template_id, error.message);
      }
    }

    await db.close();
    console.log('🎉 Report template API mappings setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up report template API mappings:', error);
  }
}

createReportTemplateApiMappings();
