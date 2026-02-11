# Reports API Mapping Documentation

## Overview
All reports have been mapped and are now accessible through the MySQL-backed API. Each report template has a corresponding API endpoint for data retrieval.

## Setup Complete

✅ **MySQL Database** - Configured and ready
✅ **Reports API** - Updated to use MySQL ([`backend/routes/reports.js`](backend/routes/reports.js:1))
✅ **Reports List Endpoint** - Available at `/api/reports/list`
✅ **Template Mappings Table** - Database table `report_template_api_mappings` created
✅ **All Report Endpoints** - 19 report endpoints implemented

## Database Schema

### Report Template API Mappings Table
```sql
CREATE TABLE report_template_api_mappings (
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
```

## API Endpoints

### Get All Reports Metadata
```
GET /api/reports/list
Authorization: Bearer {token}
```

**Response:**
```json
{
  "total": 19,
  "reports": [
    {
      "id": "daily-business-summary",
      "name": "Daily Business Summary",
      "category": "Business",
      "endpoint": "/api/reports/daily-business-summary",
      "filters": ["start_date", "end_date"]
    },
    ...
  ],
  "categories": {
    "Business": [...],
    "Financial": [...],
    "Inventory": [...],
    "Customer": [...],
    "Employee": [...],
    "Operational": [...],
    "Transaction": [...]
  }
}
```

### Get Template API Mappings
```
GET /api/reports/template-mappings
Authorization: Bearer {token}
```

Returns all template-to-API mappings from the database.

### Available Report Categories

1. **Business Reports**
   - Daily Business Summary
   - Sales Report
   - Business Flow Report

2. **Financial Reports**
   - Purchase Report
   - Expenditure Report
   - Interest Transaction Report

3. **Inventory Reports**
   - Stock Variation Report
   - Lubricants Stock Report
   - Day Wise Stock Value Report

4. **Customer Reports**
   - Credit Customer Report
   - Guest Customer Sales Report
   - Customer Statement

5. **Employee Reports**
   - Employee Attendance Report
   - Employee Status Report

6. **Operational Reports**
   - Density Report
   - DSR Format Report
   - Swipe Report
   - Daily Rate History

7. **Transaction Reports**
   - Vendor Transaction Report
   - Bowser Transactions Report

## Individual Report Endpoints

### Business Reports

#### 1. Daily Business Summary
```
GET /api/reports/daily-business-summary?start_date=2024-01-01&end_date=2024-12-31
Authorization: Bearer {token}
```
**Filters:** `start_date`, `end_date`  
**Returns:** Day sheets, employee sheets, and day business entries

#### 2. Sales Report
```
GET /api/reports/sales?start_date=2024-01-01&end_date=2024-12-31&fuel_product_id=456
Authorization: Bearer {token}
```
**Filters:** `start_date`, `end_date`, `fuel_product_id`  
**Returns:** Detailed sales transactions with product and nozzle information

#### 3. Business Flow Report
```
GET /api/reports/business-flow?start_date=2024-01-01&end_date=2024-12-31
Authorization: Bearer {token}
```
**Filters:** `start_date`, `end_date`  
**Returns:** Sales and expenses data for cash flow analysis

---

### Financial Reports

#### 4. Purchase Report
```
GET /api/reports/purchase?start_date=2024-01-01&end_date=2024-12-31
Authorization: Bearer {token}
```
**Filters:** `start_date`, `end_date`  
**Returns:** Purchase transactions with vendor and product details

#### 5. Expenditure Report
```
GET /api/reports/expenditure?start_date=2024-01-01&end_date=2024-12-31&expense_type_id=123
Authorization: Bearer {token}
```
**Filters:** `start_date`, `end_date`, `expense_type_id`  
**Returns:** Expense records categorized by type

#### 6. Interest Transaction Report
```
GET /api/reports/interest-transaction?start_date=2024-01-01&end_date=2024-12-31&customer_id=789
Authorization: Bearer {token}
```
**Filters:** `start_date`, `end_date`, `customer_id`  
**Returns:** Interest calculations and transactions

---

### Inventory Reports

#### 7. Stock Variation Report
```
GET /api/reports/stock-variation?start_date=2024-01-01&end_date=2024-12-31&product_id=456
Authorization: Bearer {token}
```
**Filters:** `start_date`, `end_date`, `product_id`  
**Returns:** Stock level changes and variations

#### 8. Lubricants Stock Report
```
GET /api/reports/lubricants-stock
Authorization: Bearer {token}
```
**Filters:** None  
**Returns:** Current lubricants inventory status

#### 9. Day Wise Stock Value Report
```
GET /api/reports/day-wise-stock-value?start_date=2024-01-01&end_date=2024-12-31
Authorization: Bearer {token}
```
**Filters:** `start_date`, `end_date`  
**Returns:** Daily stock valuations with current rates

---

### Customer Reports

#### 10. Credit Customer Report
```
GET /api/reports/all-credit-customer?start_date=2024-01-01&end_date=2024-12-31
Authorization: Bearer {token}
```
**Filters:** `start_date`, `end_date`  
**Returns:** Credit sales with customer details

#### 11. Guest Customer Sales Report
```
GET /api/reports/guest-customer-sales?start_date=2024-01-01&end_date=2024-12-31
Authorization: Bearer {token}
```
**Filters:** `start_date`, `end_date`  
**Returns:** Sales transactions for guest customers

#### 12. Customer Statement
```
GET /api/reports/customer-statement/:customer_id?start_date=2024-01-01&end_date=2024-12-31
Authorization: Bearer {token}
```
**Filters:** `customer_id` (in path), `start_date`, `end_date`  
**Returns:** Individual customer transaction history

---

### Employee Reports

#### 13. Employee Attendance Report
```
GET /api/reports/attendance?start_date=2024-01-01&end_date=2024-12-31&employee_id=123
Authorization: Bearer {token}
```
**Filters:** `start_date`, `end_date`, `employee_id`  
**Returns:** Staff attendance records with employee details

#### 14. Employee Status Report
```
GET /api/reports/employee-status?employee_id=123&status=active
Authorization: Bearer {token}
```
**Filters:** `employee_id`, `status` (active/inactive/on_leave)  
**Returns:** Employee status and information

---

### Operational Reports

#### 15. Density Report
```
GET /api/reports/density?start_date=2024-01-01&end_date=2024-12-31&tank_id=456
Authorization: Bearer {token}
```
**Filters:** `start_date`, `end_date`, `tank_id`  
**Returns:** Fuel density measurements with tank and product info

#### 16. DSR Format Report
```
GET /api/reports/dsr-format?date=2024-01-01
Authorization: Bearer {token}
```
**Filters:** `date` (defaults to current date)  
**Returns:** Daily sales report with business data and payment summaries

#### 17. Swipe Report
```
GET /api/reports/swipe?start_date=2024-01-01&end_date=2024-12-31&machine_id=789
Authorization: Bearer {token}
```
**Filters:** `start_date`, `end_date`, `machine_id`  
**Returns:** Card swipe transactions with machine details

#### 18. Daily Rate History
```
GET /api/reports/daily-rate-history?start_date=2024-01-01&end_date=2024-12-31&fuel_product_id=456
Authorization: Bearer {token}
```
**Filters:** `start_date`, `end_date`, `fuel_product_id`  
**Returns:** Daily fuel rate changes

---

### Transaction Reports

#### 19. Vendor Transaction Report
```
GET /api/reports/vendor-transaction?start_date=2024-01-01&end_date=2024-12-31&vendor_id=123
Authorization: Bearer {token}
```
**Filters:** `start_date`, `end_date`, `vendor_id`  
**Returns:** All vendor transactions with details

#### 20. Bowser Transactions Report
```
GET /api/reports/bowser-transactions?start_date=2024-01-01&end_date=2024-12-31&bowser_id=456
Authorization: Bearer {token}
```
**Filters:** `start_date`, `end_date`, `bowser_id`  
**Returns:** Bowser operations with product and destination info

## How to Use in Frontend

### Example: Fetch All Reports Metadata
```javascript
import { api } from '../lib/api';

async function fetchReportsList() {
  try {
    const response = await api.get('/reports/list');
    const { reports, categories } = response.data;
    
    // Use reports array to populate UI
    console.log(`Found ${reports.length} reports`);
    console.log('Categories:', Object.keys(categories));
    
    return { reports, categories };
  } catch (error) {
    console.error('Error fetching reports:', error);
  }
}
```

### Example: Fetch Specific Report Data
```javascript
async function fetchSalesReport(startDate, endDate) {
  try {
    const response = await api.get('/reports/sales', {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching sales report:', error);
  }
}
```

### Example: Dynamic Report Dashboard
```jsx
import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

function ReportsDashboard() {
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    async function loadReports() {
      const response = await api.get('/reports/list');
      setReports(response.data.reports);
      setCategories(response.data.categories);
    }
    loadReports();
  }, []);

  return (
    <div>
      <h1>Reports Dashboard</h1>
      {Object.entries(categories).map(([category, categoryReports]) => (
        <div key={category}>
          <h2>{category}</h2>
          <ul>
            {categoryReports.map(report => (
              <li key={report.id}>
                <a href={`/reports/${report.id}`}>{report.name}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

## Common Query Parameters

### Date Filters
- `start_date` - ISO 8601 date format (YYYY-MM-DD)
- `end_date` - ISO 8601 date format (YYYY-MM-DD)

### Entity Filters
- `employee_id` - Integer employee ID
- `customer_id` - Integer customer ID
- `vendor_id` - Integer vendor ID
- `fuel_product_id` - Integer fuel product ID
- `expense_type_id` - Integer expense type ID
- `machine_id` - Integer swipe machine ID

## Authentication

All report endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Error Handling

All endpoints return standard error responses:

```json
{
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing or invalid token)
- `500` - Server Error

## Database Configuration

Reports now use MySQL through [`backend/lib/database.js`](backend/lib/database.js:1).

All MySQL configuration is in [`.env`](.env:1):
```env
DB_HOST=localhost
DB_USER=petrol_user
DB_PASSWORD=petrol_password
DB_NAME=petrol_pump
```

## Testing

Test the reports list endpoint:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/reports/list
```

Test a specific report:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" "http://localhost:5000/api/reports/sales?start_date=2024-01-01&end_date=2024-12-31"
```

## Adding New Reports

To add a new report with template integration:

### Step 1: Add Template Definition
Add template to [`frontend/src/lib/reportTemplates.js`](frontend/src/lib/reportTemplates.js:1)
```javascript
'my-new-report': {
  id: 'my-new-report',
  name: 'My New Report',
  description: 'Description here',
  type: TEMPLATE_TYPES.STANDARD,
  category: REPORT_CATEGORIES.BUSINESS,
  layout: {
    // Define layout sections
  },
  styling: {
    // Define styling
  }
}
```

### Step 2: Add Template Mapping
Add to [`frontend/src/lib/reportTemplateIntegration.js`](frontend/src/lib/reportTemplateIntegration.js:1)
```javascript
'my-new-report': {
  recommendedTemplates: ['my-new-report'],
  defaultTemplate: 'my-new-report',
  category: 'business'
}
```

### Step 3: Add Database Mapping
Run the database script to add mapping:
```javascript
node database/create_report_template_api_mappings.js
```

Or manually insert:
```sql
INSERT INTO report_template_api_mappings 
  (template_id, template_name, category, api_endpoint, filters)
VALUES 
  ('my-new-report', 'My New Report', 'business', 
   '/api/reports/my-new-report', '["start_date", "end_date"]');
```

### Step 4: Add Backend Endpoint
Add to [`backend/routes/reports.js`](backend/routes/reports.js:1)
```javascript
// In /list endpoint, add to reports array:
{
  id: 'my-new-report',
  name: 'My New Report',
  category: 'Business',
  endpoint: '/api/reports/my-new-report',
  filters: ['start_date', 'end_date']
}

// Add handler:
router.get('/my-new-report', verifyToken, [
  query('start_date').optional().isISO8601(),
  query('end_date').optional().isISO8601()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { start_date, end_date } = req.query;

  try {
    let sql = 'SELECT * FROM your_table WHERE 1=1';
    const params = [];

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
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
```

### Step 5: Update Documentation
Add the new report details to this documentation file.

## Complete Template-to-API Mapping Reference

| Template ID | Template Name | Category | API Endpoint | Filters |
|------------|---------------|----------|--------------|---------|
| `daily-business-summary` | Daily Business Summary | business | `/api/reports/daily-business-summary` | start_date, end_date |
| `sales-report` | Sales Report | business | `/api/reports/sales` | start_date, end_date, fuel_product_id |
| `business-flow` | Business Flow Report | business | `/api/reports/business-flow` | start_date, end_date |
| `purchase-report` | Purchase Report | financial | `/api/reports/purchase` | start_date, end_date |
| `expenditure-report` | Expenditure Report | financial | `/api/reports/expenditure` | start_date, end_date, expense_type_id |
| `interest-transaction` | Interest Transaction Report | financial | `/api/reports/interest-transaction` | start_date, end_date, customer_id |
| `stock-variation` | Stock Variation Report | inventory | `/api/reports/stock-variation` | start_date, end_date, product_id |
| `lubricants-stock` | Lubricants Stock Report | inventory | `/api/reports/lubricants-stock` | - |
| `day-wise-stock-value` | Day Wise Stock Value Report | inventory | `/api/reports/day-wise-stock-value` | start_date, end_date |
| `credit-customer` | Credit Customer Report | customer | `/api/reports/all-credit-customer` | start_date, end_date |
| `guest-customer-sales` | Guest Customer Sales Report | customer | `/api/reports/guest-customer-sales` | start_date, end_date |
| `customer-statement` | Customer Statement | customer | `/api/reports/customer-statement/:customer_id` | customer_id, start_date, end_date |
| `attendance` | Employee Attendance Report | employee | `/api/reports/attendance` | start_date, end_date, employee_id |
| `employee-status` | Employee Status Report | employee | `/api/reports/employee-status` | employee_id, status |
| `density-report` | Density Report | operational | `/api/reports/density` | start_date, end_date, tank_id |
| `dsr-format` | DSR Format Report | operational | `/api/reports/dsr-format` | date |
| `swipe-report` | Swipe Report | operational | `/api/reports/swipe` | start_date, end_date, machine_id |
| `vendor-transaction` | Vendor Transaction Report | transaction | `/api/reports/vendor-transaction` | start_date, end_date, vendor_id |
| `bowser-transactions` | Bowser Transactions Report | transaction | `/api/reports/bowser-transactions` | start_date, end_date, bowser_id |

## Integration Example

Here's a complete example of how to fetch a report with its template:

```javascript
import { api } from '../lib/api';
import { getDefaultTemplate, applyTemplateToReport } from '../lib/reportTemplateIntegration';

async function fetchAndDisplayReport(reportId, filters = {}) {
  try {
    // Get the default template for this report
    const templateId = getDefaultTemplate(reportId);
    
    // Fetch report data from API
    const response = await api.get(`/reports/${reportId}`, {
      params: filters
    });
    
    const reportData = response.data;
    
    // Apply template to report data
    const enhancedReport = applyTemplateToReport(
      {
        data: reportData,
        title: 'Report Title',
        dateRange: { start: filters.start_date, end: filters.end_date }
      },
      templateId
    );
    
    return enhancedReport;
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
}

// Usage
const report = await fetchAndDisplayReport('sales-report', {
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  fuel_product_id: '123'
});
```

## Related Files

- [`backend/routes/reports.js`](backend/routes/reports.js:1) - Main reports router with all API endpoints
- [`frontend/src/lib/reportTemplates.js`](frontend/src/lib/reportTemplates.js:1) - Report template definitions
- [`frontend/src/lib/reportTemplateIntegration.js`](frontend/src/lib/reportTemplateIntegration.js:1) - Template integration utilities
- [`database/create_report_template_api_mappings.js`](database/create_report_template_api_mappings.js:1) - Database mapping setup
- [`backend/lib/database.js`](backend/lib/database.js:1) - MySQL connection
- [`.env`](.env:1) - Database configuration

## Support

For issues with reports API:
1. Check MySQL is running
2. Verify JWT token is valid
3. Ensure template mappings table is created (`node database/create_report_template_api_mappings.js`)
4. Check console logs for error details
5. Review MySQL query logs

For detailed MySQL setup, see [`MYSQL_SETUP_GUIDE.md`](MYSQL_SETUP_GUIDE.md:1).

## Summary

✅ **19 Report Templates** - All mapped to API endpoints  
✅ **7 Report Categories** - Business, Financial, Inventory, Customer, Employee, Operational, Transaction  
✅ **Database-Backed Mappings** - Stored in `report_template_api_mappings` table  
✅ **Fully Authenticated** - All endpoints require JWT bearer token  
✅ **Flexible Filtering** - Date ranges and entity-specific filters supported
