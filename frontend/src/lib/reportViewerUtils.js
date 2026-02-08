/**
 * Utility functions for opening reports in new tabs with PDF-like appearance
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import ReportViewer from '@/components/reports/ReportViewer';

/**
 * Opens a report in a new tab with PDF-like styling
 * @param {Object} options - Report configuration options
 * @param {string} options.title - Report title
 * @param {Array} options.headers - Table headers configuration
 * @param {Array} options.data - Report data
 * @param {Object} options.dateRange - Date range for the report
 * @param {Object} options.organization - Organization details
 * @param {string} options.reportType - Type of report (for styling)
 * @param {JSX} options.customContent - Custom JSX content for the report
 */
export const openReportInNewTab = ({
  title,
  headers,
  data,
  dateRange = null,
  organization = null,
  reportType = 'general',
  customContent = null
}) => {
  // Create a new window
  const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');

  if (!newWindow) {
    alert('Please allow popups for this website to view reports in new tabs.');
    return;
  }

  // Write the HTML content to the new window
  newWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - PetroPro Report</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Georgia', 'Times New Roman', serif;
          background-color: white;
        }

        .report-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .report-header {
          text-align: center;
          border-bottom: 2px solid #2c3e50;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }

        .report-header h1 {
          color: #2c3e50;
          margin: 0;
          font-size: 24px;
          font-weight: bold;
        }

        .report-header .org-name {
          font-size: 18px;
          color: #34495e;
          margin: 10px 0;
        }

        .report-header .org-details {
          font-size: 12px;
          color: #7f8c8d;
          margin: 5px 0;
        }

        .report-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-radius: 8px;
          overflow: hidden;
        }

        .report-table th {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: white;
          padding: 15px 12px;
          text-align: left;
          font-weight: bold;
          border: 1px solid #34495e;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .report-table td {
          padding: 12px 10px;
          border: 1px solid #bdc3c7;
          font-size: 10px;
          transition: background-color 0.2s ease;
        }

        .report-table tr:nth-child(even) {
          background-color: #f8f9fa;
        }

        .report-table tr:nth-child(odd) {
          background-color: #ffffff;
        }

        .report-table tr:hover {
          background-color: #e8f4f8;
          transform: scale(1.001);
        }

        .report-table .total-row {
          background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
          color: white;
          font-weight: bold;
        }

        .report-table .total-row:hover {
          background: linear-gradient(135deg, #229954 0%, #27ae60 100%);
        }

        .report-title {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin: 30px 0;
          color: #2c3e50;
          border-bottom: 3px solid #3498db;
          padding-bottom: 15px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .report-summary {
          background: linear-gradient(135deg, #ecf0f1 0%, #d5dbdb 100%);
          padding: 20px;
          margin: 25px 0;
          border-radius: 10px;
          border-left: 5px solid #3498db;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          position: relative;
          overflow: hidden;
        }

        .custom-report-content {
          margin: 20px 0;
        }

        .custom-report-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
          font-size: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-radius: 8px;
          overflow: hidden;
        }

        .custom-report-content .card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin: 15px 0;
          overflow: hidden;
        }

        .custom-report-content .card-header {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: white;
          padding: 15px 20px;
          font-weight: bold;
        }

        .custom-report-content .card-content {
          padding: 20px;
        }

        .report-summary::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
        }

        .report-footer {
          margin-top: 50px;
          padding: 25px;
          border-top: 2px solid #bdc3c7;
          font-size: 11px;
          color: #7f8c8d;
          text-align: center;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 10px;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }

        .report-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 2px;
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
        }

        .close-button {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          background: #e74c3c;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .close-button:hover {
          background: #c0392b;
        }

        .print-button {
          position: fixed;
          top: 20px;
          right: 100px;
          z-index: 1000;
          background: #27ae60;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .print-button:hover {
          background: #229954;
        }

        .no-print {
          display: block;
        }

        @media print {
          .no-print {
            display: none !important;
          }

          body {
            margin: 0;
          }

          .report-container {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <button class="close-button no-print" onclick="window.close()">✕ Close</button>
      <button class="print-button no-print" onclick="window.print()">🖨️ Print</button>

      <div class="report-container">
        <div class="report-header">
          <h1>PetroPro</h1>
          <div class="org-name">Management System</div>
          <div class="org-details">
            Professional Petrol Pump Management Solution
          </div>
        </div>

        <div class="report-title">${title}</div>

        ${dateRange ? `
          <div class="report-summary">
            <strong>Report Period:</strong> ${formatDateForDisplay(dateRange.startDate)} to ${formatDateForDisplay(dateRange.endDate)}
            <br>
            <strong>Generated on:</strong> ${formatDateForDisplay(new Date())}
          </div>
        ` : ''}

        ${customContent ? `
          <div class="custom-report-content">
            ${customContent}
          </div>
        ` : (data && data.length > 0 ? `
          <table class="report-table">
            <thead>
              <tr>
                ${headers.map(header => `<th>${header.label}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${headers.map(header => `<td>${formatCellValue(row[header.key], header)}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : `
          <div style="text-align: center; padding: 40px; color: #7f8c8d;">
            <p>No data available for the selected criteria.</p>
          </div>
        `)}

        ${customContent ? '' : (data && data.length > 0 ? `
          <div class="report-summary">
            <strong>Report Summary:</strong>
            <br>
            Total Records: ${data.length}
            <br>
            Report Type: ${title}
          </div>
        ` : '')}

        <div class="report-footer">
          <p>
            This report was generated by PetroPro Management System.
            <br>
            © 2025 PetroPro. All rights reserved.
          </p>
        </div>
      </div>

      <script>
        // Helper functions for formatting
        function formatDateForDisplay(date) {
          if (!date) return '';
          const d = new Date(date);
          return d.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
        }

        function formatCellValue(value, header) {
          if (value === null || value === undefined) return '-';

          // Format currency values
          if (typeof value === 'string' && (value.includes('₹') || value.includes('Rs'))) {
            return value;
          }

          // Format date values
          if (header.key.toLowerCase().includes('date') && value) {
            return formatDateForDisplay(value);
          }

          // Format numeric values
          if (typeof value === 'number') {
            return value.toLocaleString('en-IN');
          }

          return String(value);
        }

        // Auto-print functionality (optional)
        // window.onload = function() {
        //   setTimeout(function() {
        //     window.print();
        //   }, 1000);
        // };
      </script>
    </body>
    </html>
  `);

  // Close the document to ensure all content is written
  newWindow.document.close();

  // Focus on the new window
  newWindow.focus();
};

/**
 * Opens a report using React component in a new tab
 * @param {Object} options - Report configuration options
 */
export const openReportWithReact = ({
  title,
  headers,
  data,
  dateRange = null,
  organization = null,
  reportType = 'general'
}) => {
  // Create a new window
  const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');

  if (!newWindow) {
    alert('Please allow popups for this website to view reports in new tabs.');
    return;
  }

  // Create a container div in the new window
  newWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - PetroPro Report</title>
      <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Georgia', 'Times New Roman', serif;
          background-color: white;
        }
      </style>
    </head>
    <body>
      <div id="report-root"></div>
    </body>
    </html>
  `);

  newWindow.document.close();

  // Wait for the document to be ready, then render the React component
  newWindow.onload = () => {
    const root = newWindow.document.getElementById('report-root');

    // Create a simple React component renderer
    const ReportComponent = () => {
      return newWindow.React.createElement('div', null,
        newWindow.React.createElement('h1', null, title),
        newWindow.React.createElement('p', null, 'Report loaded successfully!')
      );
    };

    // Render the component
    const reactRoot = newWindow.ReactDOM.createRoot(root);
    reactRoot.render(newWindow.React.createElement(ReportComponent));
  };
};

/**
 * Default export function for opening reports
 * Uses the HTML-based approach for better compatibility
 */
export default openReportInNewTab;