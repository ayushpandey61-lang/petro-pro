import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Printer, FileSpreadsheet, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { exportToExcel, printReport, convertTableToHTML } from '@/lib/reportUtils';

const ReportSubHeader = ({
  onDateRangeChange,
  onPrint,
  onExportExcel,
  showDateRange = true,
  showExportButtons = true,
  reportTitle = 'Report',
  headers = [],
  data = []
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateRange, setDateRange] = useState('today');

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    let start, end;

    switch (range) {
      case 'today':
        start = startOfToday;
        end = endOfToday;
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        start = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
        end = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
        break;
      case 'last7days':
        start = new Date(today);
        start.setDate(start.getDate() - 7);
        end = endOfToday;
        break;
      case 'last30days':
        start = new Date(today);
        start.setDate(start.getDate() - 30);
        end = endOfToday;
        break;
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
        break;
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);
        break;
      case 'custom':
        if (startDate && endDate) {
          start = new Date(startDate);
          end = new Date(endDate);
          end.setHours(23, 59, 59);
        }
        break;
      default:
        start = startOfToday;
        end = endOfToday;
    }

    setStartDate(start ? format(start, 'yyyy-MM-dd') : '');
    setEndDate(end ? format(end, 'yyyy-MM-dd') : '');

    if (onDateRangeChange) {
      onDateRangeChange({
        startDate: start,
        endDate: end,
        range: range
      });
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      // Create table HTML for printing
      const tableHTML = convertTableToHTML(headers, data);
      printReport(reportTitle, tableHTML);
    }
  };

  const handleExportExcel = () => {
    if (onExportExcel) {
      onExportExcel();
    } else {
      // Export to Excel using utility function
      exportToExcel(headers, data, reportTitle.replace(/\s+/g, '_').toLowerCase());
    }
  };

  const handleCustomDateSubmit = () => {
    if (startDate && endDate) {
      handleDateRangeChange('custom');
    }
  };

  return (
    <div className="bg-gray-50 border-b p-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Left Side - Export Buttons */}
        {showExportButtons && (
          <div className="flex items-center space-x-2">
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </Button>

            <Button
              onClick={handleExportExcel}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 bg-green-600 text-white hover:bg-green-700 border-green-600"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Excel</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
            >
              <Download className="h-4 w-4" />
              <span>PDF</span>
            </Button>
          </div>
        )}

        {/* Right Side - Date Range Selection */}
        {showDateRange && (
          <div className="flex items-center space-x-4">
            {/* Quick Date Range Buttons */}
            <div className="flex items-center space-x-1">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={dateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Custom Date Inputs */}
            {dateRange === 'custom' && (
              <div className="flex items-center space-x-2">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-40"
                  placeholder="Start Date"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-40"
                  placeholder="End Date"
                />
                <Button
                  onClick={handleCustomDateSubmit}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Apply
                </Button>
              </div>
            )}

            {/* Current Date Range Display */}
            {(startDate || endDate) && dateRange !== 'custom' && (
              <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded border">
                {startDate && endDate ? (
                  <span>
                    {format(new Date(startDate), 'dd MMM yyyy')} - {format(new Date(endDate), 'dd MMM yyyy')}
                  </span>
                ) : (
                  <span>Select date range</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportSubHeader;