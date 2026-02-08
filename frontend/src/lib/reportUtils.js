// Report utility functions for export and printing

/**
 * Export data to Excel format
 * @param {Array} headers - Array of header objects with key and label
 * @param {Array} data - Array of data objects
 * @param {string} filename - Name of the exported file
 */
export const exportToExcel = (headers, data, filename = 'report') => {
  try {
    // Create CSV content
    const csvContent = createCSVContent(headers, data);

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Error exporting data. Please try again.');
  }
};

/**
 * Create CSV content from headers and data
 * @param {Array} headers - Array of header objects
 * @param {Array} data - Array of data objects
 * @returns {string} CSV content
 */
const createCSVContent = (headers, data) => {
  const csvRows = [];

  // Add headers
  const headerRow = headers.map(header => `"${header.label}"`).join(',');
  csvRows.push(headerRow);

  // Add data rows
  data.forEach(row => {
    const dataRow = headers.map(header => {
      const value = row[header.key] || '';
      // Escape quotes and wrap in quotes if contains comma or quotes
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
    csvRows.push(dataRow);
  });

  return csvRows.join('\n');
};

/**
 * Print report with custom styling
 * @param {string} title - Report title
 * @param {React.ReactElement} content - Report content to print
 * @param {string} reportType - Type of report for specific header styling
 */
export const printReport = (title, content, reportType = null) => {
  try {
    const printWindow = window.open('', '_blank');
    const printContent = createPrintContent(title, content, reportType);

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  } catch (error) {
    console.error('Error printing report:', error);
    alert('Error printing report. Please try again.');
  }
};

/**
 * Get report header configuration based on report type
 * @param {string} reportType - Type of report
 * @returns {Object} Header configuration with title and subtitle
 */
const getReportHeader = (reportType) => {
  const headers = {
    'daily-business-summary': {
      title: 'Daily Business Summary Report',
      subtitle: 'Comprehensive summary of daily business operations including sales, expenses, and settlements'
    },
    'sales': {
      title: 'Sales Report',
      subtitle: 'Detailed sales transactions and revenue analysis'
    },
    'credit-customer': {
      title: 'Credit Customer Report',
      subtitle: 'Outstanding credit sales and customer balances'
    },
    'attendance': {
      title: 'Employee Attendance Report',
      subtitle: 'Staff attendance records and working hours'
    },
    'business-flow': {
      title: 'Business Flow Report',
      subtitle: 'Analysis of business operations and cash flow'
    },
    'customer-statement': {
      title: 'Customer Statement',
      subtitle: 'Individual customer transaction history'
    },
    'daily-rate-history': {
      title: 'Daily Rate History Report',
      subtitle: 'Historical fuel pricing and rate changes'
    },
    'lubricants-stock': {
      title: 'Lubricants Stock Report',
      subtitle: 'Current inventory status of lubricants'
    },
    'purchase': {
      title: 'Purchase Report',
      subtitle: 'Vendor purchases and procurement history'
    }
  };

  return headers[reportType] || {
    title: 'PetroPro Report',
    subtitle: 'Generated from PetroPro Management System'
  };
};

/**
 * Create print-friendly HTML content
 * @param {string} title - Report title
 * @param {React.ReactElement} content - Report content
 * @param {string} reportType - Type of report for specific header styling
 * @returns {string} HTML content for printing
 */
const createPrintContent = (title, content, reportType = null) => {
  const headerConfig = reportType ? getReportHeader(reportType) : { title, subtitle: 'Generated from PetroPro Management System' };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${headerConfig.title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #333;
        }
        .header .subtitle {
          margin: 10px 0;
          font-size: 14px;
          color: #666;
        }
        .header .company-info {
          margin: 5px 0;
          font-size: 12px;
          color: #888;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .print-date {
          text-align: right;
          font-size: 12px;
          color: #666;
          margin-bottom: 20px;
        }
        .report-info {
          margin-bottom: 15px;
          font-size: 12px;
          color: #666;
        }
        .report-info .label {
          font-weight: bold;
        }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="print-date">
        Printed on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
      </div>
      <div class="header">
        <h1>${headerConfig.title}</h1>
        <div class="subtitle">${headerConfig.subtitle}</div>
        <div class="company-info">Generated from PetroPro Management System</div>
      </div>
      <div id="report-content">
        ${content}
      </div>
    </body>
    </html>
  `;
};

/**
 * Convert table data to HTML for printing
 * @param {Array} headers - Array of header objects
 * @param {Array} data - Array of data objects
 * @returns {string} HTML table string
 */
export const convertTableToHTML = (headers, data) => {
  let html = '<table>';

  // Add headers
  html += '<thead><tr>';
  headers.forEach(header => {
    html += `<th>${header.label}</th>`;
  });
  html += '</tr></thead>';

  // Add data rows
  html += '<tbody>';
  data.forEach(row => {
    html += '<tr>';
    headers.forEach(header => {
      const value = row[header.key] || '';
      html += `<td>${value}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';

  return html;
};

/**
 * Format currency values for display
 * @param {string|number} value - Value to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
  if (isNaN(numValue)) return value;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(numValue);
};

/**
 * Format date values for display
 * @param {string|Date} date - Date to format
 * @param {string} formatType - Type of format ('short', 'long', 'time')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatType = 'short') => {
  if (!date) return '';

  const dateObj = new Date(date);

  switch (formatType) {
    case 'long':
      return dateObj.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'time':
      return dateObj.toLocaleTimeString('en-IN');
    default:
      return dateObj.toLocaleDateString('en-IN');
  }
};

/**
 * Generate PDF from table data
 * @param {Array} headers - Array of header objects
 * @param {Array} data - Array of data objects
 * @param {string} title - Report title
 * @param {string} filename - Output filename
 * @param {string} reportType - Type of report for specific header styling
 */
export const generatePdf = (headers, data, title = 'Report', filename = 'report', reportType = null) => {
  try {
    // Create HTML content for PDF
    const htmlContent = createPrintContent(title, convertTableToHTML(headers, data), reportType);

    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load then print (which can be saved as PDF)
    printWindow.onload = () => {
      printWindow.print();
      // Note: User can choose "Save as PDF" from print dialog
      // printWindow.close();
    };
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};

/**
 * Generate XLSX from table data
 * @param {Object} options - Options object
 * @param {Array} options.headers - Array of header objects
 * @param {Array} options.data - Array of data objects
 * @param {string} options.title - Report title
 * @param {string} options.filename - Output filename
 * @param {Object} options.orgDetails - Organization details
 */
export const generateXlsx = ({ headers, data, title = 'Report', filename = 'report', orgDetails = {} }) => {
  try {
    // Create CSV content (XLSX generation would require a library like xlsx)
    // For now, we'll create a CSV file which can be opened in Excel
    const csvContent = createCSVContent(headers, data);

    // Create and download file
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error generating XLSX:', error);
    alert('Error generating Excel file. Please try again.');
  }
};

/**
 * Generate CSV from table data
 * @param {Array} headers - Array of header objects
 * @param {Array} data - Array of data objects
 * @param {string} filename - Output filename
 */
export const generateCsv = (headers, data, filename = 'report') => {
  try {
    const csvContent = createCSVContent(headers, data);

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error generating CSV:', error);
    alert('Error generating CSV file. Please try again.');
  }
};