import React from 'react';
import ReportHeader from './ReportHeader';
import ReportSubHeader from './ReportSubHeader';
import { formatDate, formatCurrency } from '@/lib/reportUtils';

const ReportViewer = ({
  title,
  headers,
  data,
  dateRange = null,
  organization = null,
  onClose
}) => {
  // Format cell values based on type
  const formatCellValue = (value, header) => {
    if (value === null || value === undefined) return '-';

    // Format currency values
    if (typeof value === 'string' && (value.includes('₹') || value.includes('Rs'))) {
      return value;
    }

    // Format date values
    if (header.key.toLowerCase().includes('date') && value) {
      return formatDate(value, 'short');
    }

    // Format numeric values
    if (typeof value === 'number') {
      return value.toLocaleString('en-IN');
    }

    return String(value);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* PDF-like styling */}
      <style jsx>{`
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
          .page-break { page-break-before: always; }
        }

        .report-container {
          font-family: 'Georgia', 'Times New Roman', serif;
          line-height: 1.4;
          color: #333;
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
      `}</style>

      {/* Close button - hidden when printing */}
      <button className="close-button no-print" onClick={onClose}>
        ✕ Close
      </button>

      <div className="report-container p-8">
        {/* Report Header */}
        <ReportHeader title={title} />

        {/* Report Sub Header */}
        <ReportSubHeader
          reportTitle={title}
          headers={headers}
          data={data}
          showDateRange={false}
          showExportButtons={false}
        />

        {/* Report Title */}
        <div className="report-title">
          {title}
        </div>

        {/* Date Range Information */}
        {dateRange && (
          <div className="report-summary">
            <strong>Report Period:</strong> {formatDate(dateRange.startDate)} to {formatDate(dateRange.endDate)}
            <br />
            <strong>Generated on:</strong> {formatDate(new Date(), 'long')}
          </div>
        )}

        {/* Report Data Table */}
        {data && data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="report-table">
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th key={index}>
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {headers.map((header, colIndex) => (
                      <td key={colIndex}>
                        {formatCellValue(row[header.key], header)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No data available for the selected criteria.</p>
          </div>
        )}

        {/* Summary Information */}
        {data && data.length > 0 && (
          <div className="report-summary">
            <strong>Report Summary:</strong>
            <br />
            Total Records: {data.length}
            <br />
            Report Type: {title}
          </div>
        )}

        {/* Footer */}
        <div className="report-footer">
          <p>
            This report was generated by PetroPro Management System.
            <br />
            © 2025 PetroPro. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;