# Report API Quick Reference

Quick reference guide for report template API integration.

## 🚀 Quick Start

```bash
# 1. Setup database table
node database/create_report_template_api_mappings.js

# 2. Start backend server
cd backend && npm start

# 3. Test API
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/reports/list
```

## 📋 All Available Reports

| ID | Name | Category | Endpoint |
|----|------|----------|----------|
| `daily-business-summary` | Daily Business Summary | Business | `/api/reports/daily-business-summary` |
| `sales-report` | Sales Report | Business | `/api/reports/sales` |
| `business-flow` | Business Flow Report | Business | `/api/reports/business-flow` |
| `purchase-report` | Purchase Report | Financial | `/api/reports/purchase` |
| `expenditure-report` | Expenditure Report | Financial | `/api/reports/expenditure` |
| `interest-transaction` | Interest Transaction | Financial | `/api/reports/interest-transaction` |
| `stock-variation` | Stock Variation | Inventory | `/api/reports/stock-variation` |
| `lubricants-stock` | Lubricants Stock | Inventory | `/api/reports/lubricants-stock` |
| `day-wise-stock-value` | Day Wise Stock Value | Inventory | `/api/reports/day-wise-stock-value` |
| `credit-customer` | Credit Customer | Customer | `/api/reports/all-credit-customer` |
| `guest-customer-sales` | Guest Customer Sales | Customer | `/api/reports/guest-customer-sales` |
| `customer-statement` | Customer Statement | Customer | `/api/reports/customer-statement/:id` |
| `attendance` | Attendance | Employee | `/api/reports/attendance` |
| `employee-status` | Employee Status | Employee | `/api/reports/employee-status` |
| `density-report` | Density Report | Operational | `/api/reports/density` |
| `dsr-format` | DSR Format | Operational | `/api/reports/dsr-format` |
| `swipe-report` | Swipe Report | Operational | `/api/reports/swipe` |
| `vendor-transaction` | Vendor Transaction | Transaction | `/api/reports/vendor-transaction` |
| `bowser-transactions` | Bowser Transactions | Transaction | `/api/reports/bowser-transactions` |

## 🔑 Authentication

```javascript
// All requests require JWT token
const config = {
  headers: { 'Authorization': `Bearer ${token}` }
};
```

## 📊 Common Usage Examples

### Fetch Report List
```javascript
const { data } = await api.get('/reports/list');
console.log(data.categories); // All reports by category
```

### Fetch Sales Report
```javascript
const report = await api.get('/reports/sales', {
  params: {
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    fuel_product_id: 'abc-123'
  }
});
```

### Fetch Customer Statement
```javascript
const statement = await api.get('/reports/customer-statement/customer-id-123', {
  params: {
    start_date: '2024-01-01',
    end_date: '2024-12-31'
  }
});
```

### Apply Template to Report
```javascript
import { getDefaultTemplate, applyTemplateToReport } from '../lib/reportTemplateIntegration';

const templateId = getDefaultTemplate('sales-report');
const enhanced = applyTemplateToReport(reportData, templateId);
```

## 🎯 Common Filters

| Filter | Type | Example |
|--------|------|---------|
| `start_date` | ISO Date | `2024-01-01` |
| `end_date` | ISO Date | `2024-12-31` |
| `date` | ISO Date | `2024-01-01` |
| `employee_id` | UUID | `abc-123-def` |
| `customer_id` | UUID | `abc-123-def` |
| `vendor_id` | UUID | `abc-123-def` |
| `fuel_product_id` | UUID | `abc-123-def` |
| `status` | String | `active`, `inactive` |

## 🐛 Common Errors

| Code | Error | Solution |
|------|-------|----------|
| 401 | Unauthorized | Check JWT token |
| 400 | Bad Request | Verify filter format |
| 500 | Server Error | Check database connection |

## 📁 Key Files

- **Backend:** `backend/routes/reports.js`
- **Templates:** `frontend/src/lib/reportTemplates.js`
- **Integration:** `frontend/src/lib/reportTemplateIntegration.js`
- **Database:** `database/create_report_template_api_mappings.js`

## 🔗 Links

- [Full API Documentation](REPORTS_API_MAPPING.md)
- [Integration Guide](REPORT_TEMPLATE_API_INTEGRATION.md)

---

**Quick Access:** `Ctrl+F` to search for specific report
