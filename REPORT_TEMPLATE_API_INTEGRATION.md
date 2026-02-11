# Report Template API Integration Guide

## Overview

This document provides a comprehensive guide to the integration between report templates and API endpoints in the Petrol Pump Management System.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                            │
├─────────────────────────────────────────────────────────────┤
│  Report Templates (reportTemplates.js)                       │
│  Template Integration (reportTemplateIntegration.js)         │
│  Report Components (ReportTemplate.jsx, etc.)                │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ API Calls
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Layer                             │
├─────────────────────────────────────────────────────────────┤
│  API Routes (backend/routes/reports.js)                      │
│  - 19 Report Endpoints                                       │
│  - Authentication Middleware                                 │
│  - Validation & Error Handling                               │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ Database Queries
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                   Database Layer                             │
├─────────────────────────────────────────────────────────────┤
│  report_template_api_mappings table                          │
│  - Stores template-to-API relationships                      │
│  - Maintains filter configurations                           │
│  - Tracks auth requirements                                  │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Details

### 1. Database Schema

**Table: `report_template_api_mappings`**

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key |
| `template_id` | TEXT | Unique template identifier |
| `template_name` | TEXT | Human-readable name |
| `category` | TEXT | Report category |
| `api_endpoint` | TEXT | API endpoint path |
| `api_method` | TEXT | HTTP method (default: GET) |
| `requires_auth` | BOOLEAN | Authentication requirement |
| `filters` | TEXT | JSON array of filter parameters |
| `created_at` | DATETIME | Record creation timestamp |
| `updated_at` | DATETIME | Last update timestamp |

**Setup Command:**
```bash
node database/create_report_template_api_mappings.js
```

### 2. Report Categories

The system organizes reports into 7 main categories:

1. **Business** - Daily operations and sales analysis
2. **Financial** - Purchases, expenses, and transactions
3. **Inventory** - Stock management and valuations
4. **Customer** - Customer sales and statements
5. **Employee** - Attendance and status tracking
6. **Operational** - Density, DSR, and swipe operations
7. **Transaction** - Vendor and bowser transactions

### 3. API Endpoint Structure

All endpoints follow this pattern:
```
GET /api/reports/{report-type}?{filters}
Authorization: Bearer {token}
```

**Common Response Format:**
```json
{
  "data": [...],
  "metadata": {
    "count": 100,
    "filters_applied": {...}
  }
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "errors": [
    {
      "param": "start_date",
      "msg": "Invalid date format"
    }
  ]
}
```

### 4. Frontend Integration

#### Fetching Report List
```javascript
import { api } from '../lib/api';

const { data } = await api.get('/reports/list');
// Returns: { total, reports, categories }
```

#### Fetching Specific Report
```javascript
const reportData = await api.get('/reports/sales', {
  params: {
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    fuel_product_id: '123'
  }
});
```

#### Applying Template to Report
```javascript
import { getDefaultTemplate, applyTemplateToReport } from '../lib/reportTemplateIntegration';

const templateId = getDefaultTemplate('sales-report');
const enhancedReport = applyTemplateToReport(reportData, templateId, {
  // Custom styling overrides
  showHeader: true,
  primaryColor: '#3498db'
});
```

### 5. Available Reports

#### Business Reports (3)
- Daily Business Summary
- Sales Report
- Business Flow Report

#### Financial Reports (3)
- Purchase Report
- Expenditure Report
- Interest Transaction Report

#### Inventory Reports (3)
- Stock Variation Report
- Lubricants Stock Report
- Day Wise Stock Value Report

#### Customer Reports (3)
- Credit Customer Report
- Guest Customer Sales Report
- Customer Statement

#### Employee Reports (2)
- Employee Attendance Report
- Employee Status Report

#### Operational Reports (4)
- Density Report
- DSR Format Report
- Swipe Report
- Daily Rate History

#### Transaction Reports (2)
- Vendor Transaction Report
- Bowser Transactions Report

**Total: 19 Report Templates with API Integration**

## Common Filter Parameters

| Filter | Type | Description | Format |
|--------|------|-------------|--------|
| `start_date` | Date | Start of date range | YYYY-MM-DD |
| `end_date` | Date | End of date range | YYYY-MM-DD |
| `date` | Date | Specific date | YYYY-MM-DD |
| `employee_id` | UUID | Employee identifier | UUID v4 |
| `customer_id` | UUID | Customer identifier | UUID v4 |
| `vendor_id` | UUID | Vendor identifier | UUID v4 |
| `fuel_product_id` | UUID | Fuel product identifier | UUID v4 |
| `product_id` | UUID | Product identifier | UUID v4 |
| `tank_id` | UUID | Tank identifier | UUID v4 |
| `machine_id` | UUID | Swipe machine identifier | UUID v4 |
| `bowser_id` | UUID | Bowser identifier | UUID v4 |
| `expense_type_id` | UUID | Expense type identifier | UUID v4 |
| `status` | Enum | Status filter | active/inactive/on_leave |

## Security & Authentication

All report endpoints require JWT authentication:

```javascript
// Add token to request
const config = {
  headers: {
    'Authorization': `Bearer ${token}`
  }
};
```

**Token Validation:**
- Validates JWT signature
- Checks token expiration
- Extracts user information
- Enforces role-based access

## Error Handling

The system implements comprehensive error handling:

1. **Validation Errors** (400) - Invalid parameters
2. **Authentication Errors** (401) - Missing/invalid token
3. **Server Errors** (500) - Database or processing errors

**Example Error Handler:**
```javascript
try {
  const data = await api.get('/reports/sales', { params });
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
    redirectToLogin();
  } else if (error.response?.status === 400) {
    // Handle validation errors
    showValidationErrors(error.response.data.errors);
  } else {
    // Handle server errors
    showErrorMessage('An error occurred');
  }
}
```

## Testing

### Manual Testing
```bash
# Test reports list
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/reports/list

# Test specific report
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:5000/api/reports/sales?start_date=2024-01-01&end_date=2024-12-31"

# Test template mappings
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/reports/template-mappings
```

### Automated Tests
```javascript
describe('Reports API', () => {
  it('should fetch reports list', async () => {
    const response = await api.get('/reports/list');
    expect(response.data).toHaveProperty('reports');
    expect(response.data).toHaveProperty('categories');
  });

  it('should fetch sales report with filters', async () => {
    const response = await api.get('/reports/sales', {
      params: { start_date: '2024-01-01', end_date: '2024-12-31' }
    });
    expect(response.data).toBeInstanceOf(Array);
  });
});
```

## Performance Considerations

1. **Database Indexing** - Ensure date columns are indexed
2. **Query Optimization** - Use appropriate WHERE clauses
3. **Pagination** - Implement for large datasets
4. **Caching** - Consider caching frequently accessed reports
5. **Lazy Loading** - Load report data on demand

## Maintenance

### Adding New Report Types
1. Define template in [`reportTemplates.js`](frontend/src/lib/reportTemplates.js:1)
2. Add mapping in [`reportTemplateIntegration.js`](frontend/src/lib/reportTemplateIntegration.js:1)
3. Insert database mapping
4. Implement backend endpoint in [`reports.js`](backend/routes/reports.js:1)
5. Update documentation

### Updating Existing Reports
1. Modify template definition if needed
2. Update API endpoint logic
3. Update database mapping if filters changed
4. Test thoroughly
5. Update documentation

## Troubleshooting

### Common Issues

**Issue: 401 Unauthorized**
- Solution: Check token validity and expiration

**Issue: 400 Bad Request**
- Solution: Verify filter parameters format

**Issue: Empty Data**
- Solution: Check date range and ensure data exists

**Issue: Slow Performance**
- Solution: Add database indexes, optimize queries

**Issue: Template Not Found**
- Solution: Verify template ID exists in reportTemplates.js

## Best Practices

1. ✅ Always validate input parameters
2. ✅ Use parameterized queries to prevent SQL injection
3. ✅ Implement proper error handling
4. ✅ Log errors for debugging
5. ✅ Cache template definitions
6. ✅ Use TypeScript for type safety (future enhancement)
7. ✅ Implement rate limiting for API endpoints
8. ✅ Monitor API performance
9. ✅ Keep documentation up to date
10. ✅ Write tests for new endpoints

## Future Enhancements

- [ ] Add pagination support
- [ ] Implement report caching
- [ ] Add export functionality (PDF, Excel)
- [ ] Real-time report updates via WebSocket
- [ ] Advanced filtering and sorting
- [ ] Report scheduling and email delivery
- [ ] Custom report builder UI
- [ ] Report access audit logging

## Resources

- [Full API Documentation](REPORTS_API_MAPPING.md)
- [Report Templates Documentation](frontend/src/lib/reportTemplates.js)
- [Template Integration Guide](frontend/src/lib/reportTemplateIntegration.js)
- [Database Setup Guide](MYSQL_SETUP_GUIDE.md)

## Support

For issues or questions:
1. Check this documentation
2. Review console logs
3. Check database connectivity
4. Verify authentication tokens
5. Contact the development team

---

**Last Updated:** 2026-02-11  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
