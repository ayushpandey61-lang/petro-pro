import React, { useState } from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';
import ReportGenerator from '@/components/reports/ReportGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const EmployeeStatusReport = () => {
  const [filters, setFilters] = useState({});
  const [reportData, setReportData] = useState(null);
  const [reportTitle, setReportTitle] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  // Mock data matching the screenshot structure
  const mockData = {
    employeeTransactions: [
      {
        no: 1,
        empName: 'RAJENDRA KUMAR S',
        companyName: 'MS SHREE HARI VALLABH PETS',
        vehicleNo: 'MH-12-AB-1234',
        billNo: 'BILL-001',
        creditSale: 'CREDIT',
        product: 'PETROL',
        quantity: 50.00,
        rate: 98.50,
        amount: 4925.00,
        billAmount: 4925.00,
        discount: 0.00,
        netAmount: 4925.00,
        paymentMode: 'CREDIT',
        cardAmount: 0.00,
        cashAmount: 0.00,
        totalAmount: 4925.00
      },
      {
        no: 2,
        empName: 'RAJENDRA KUMAR S',
        companyName: 'MS SHREE HARI VALLABH PETS',
        vehicleNo: 'MH-12-XY-5678',
        billNo: 'BILL-002',
        creditSale: 'CREDIT',
        product: 'DIESEL',
        quantity: 45.00,
        rate: 85.25,
        amount: 3836.25,
        billAmount: 3836.25,
        discount: 0.00,
        netAmount: 3836.25,
        paymentMode: 'CREDIT',
        cardAmount: 0.00,
        cashAmount: 0.00,
        totalAmount: 3836.25
      },
      {
        no: 3,
        empName: 'RAJENDRA KUMAR S',
        companyName: 'MS SHREE HARI VALLABH PETS',
        vehicleNo: 'MH-12-PQ-9999',
        billNo: 'BILL-003',
        creditSale: 'CASH',
        product: 'PETROL',
        quantity: 25.00,
        rate: 98.50,
        amount: 2462.50,
        billAmount: 2462.50,
        discount: 0.00,
        netAmount: 2462.50,
        paymentMode: 'CASH',
        cardAmount: 0.00,
        cashAmount: 2462.50,
        totalAmount: 2462.50
      },
      {
        no: 4,
        empName: 'RAJENDRA KUMAR S',
        companyName: 'MS SHREE HARI VALLABH PETS',
        vehicleNo: 'MH-12-RS-7777',
        billNo: 'BILL-004',
        creditSale: 'CREDIT',
        product: 'LUBRICANT',
        quantity: 2.00,
        rate: 450.00,
        amount: 900.00,
        billAmount: 900.00,
        discount: 0.00,
        netAmount: 900.00,
        paymentMode: 'CREDIT',
        cardAmount: 0.00,
        cashAmount: 0.00,
        totalAmount: 900.00
      }
    ],
    summaryData: [
      {
        category: 'TOTAL CREDIT SALES',
        amount: 9661.25,
        count: 3
      },
      {
        category: 'TOTAL CASH SALES',
        amount: 2462.50,
        count: 1
      },
      {
        category: 'TOTAL CARD SALES',
        amount: 0.00,
        count: 0
      },
      {
        category: 'GRAND TOTAL',
        amount: 12123.75,
        count: 4
      }
    ]
  };

  const handleSubmit = (formData) => {
    const headers = [
      { key: 'no', label: 'No.' },
      { key: 'empName', label: 'Emp Name' },
      { key: 'companyName', label: 'Company Name' },
      { key: 'vehicleNo', label: 'Vehicle No' },
      { key: 'billNo', label: 'Bill No' },
      { key: 'creditSale', label: 'Credit Sale' },
      { key: 'product', label: 'Product' },
      { key: 'quantity', label: 'Quantity' },
      { key: 'rate', label: 'Rate' },
      { key: 'amount', label: 'Amount' },
      { key: 'billAmount', label: 'Bill Amount' },
      { key: 'discount', label: 'Discount' },
      { key: 'netAmount', label: 'Net Amount' },
      { key: 'paymentMode', label: 'Payment Mode' },
      { key: 'cardAmount', label: 'Card Amount' },
      { key: 'cashAmount', label: 'Cash Amount' },
      { key: 'totalAmount', label: 'Total Amount' }
    ];

    let data = mockData.employeeTransactions;
    let title = 'Employee Sheet Report';

    // Filter by employee if selected
    if (selectedEmployee && selectedEmployee !== 'all') {
      const employeeLabel = availableEmployees.find(e => e.value === selectedEmployee)?.label || 'All Employees';
      title += ` - ${employeeLabel}`;
    }

    // Filter by date range if provided
    if (dateRange.from && dateRange.to) {
      title += ` (${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')})`;
    }

    setReportTitle(title);
    setReportData({ headers, data });
  };

  const availableEmployees = [
    { value: 'rajendra-kumar', label: 'RAJENDRA KUMAR S' },
    { value: 'john-doe', label: 'John Doe' },
    { value: 'jane-smith', label: 'Jane Smith' },
    { value: 'all', label: 'All Employees' }
  ];

  const fields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'employee', label: 'Select Employee', type: 'select', options: availableEmployees },
    { name: 'reportType', label: 'Report Type', type: 'radio', options: [
      { value: 'detailed', label: 'Detailed Report' },
      { value: 'summary', label: 'Summary Report' }
    ]}
  ];

  return (
    <div className="bg-white">
      {/* Professional Header Section */}
      <div className="flex items-center justify-between p-6 border-b">
        {/* Left: Company Logo */}
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            SHVF
          </div>
        </div>

        {/* Center: Company Details */}
        <div className="text-center flex-1 mx-8">
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            {filters.organization?.firmName || 'MS SHREE HARSH VALLABH FUELS'}
          </h1>
          <p className="text-sm text-gray-600 mb-1">
            {filters.organization?.address || 'VILLAGE DELAURA SAJANPUR BYPASS'}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            {filters.organization?.bunkDetails || 'SATNA MP'}
          </p>
          <p className="text-sm text-gray-600">
            {filters.organization?.gstNo || '23AJAPD5363N1ZA'}
          </p>
          <p className="text-sm text-gray-600">
            {filters.organization?.contactNo || '9981440065'}
          </p>
        </div>

        {/* Right: Small Logo */}
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
            <span className="text-xs font-bold">PETRO</span>
          </div>
        </div>
      </div>

      {/* Report Title and Export Section */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Employee Sheet Report</h2>
          {dateRange && (
            <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded border">
              Date Range: {format(dateRange.from, 'dd-MMM-yyyy')} To {format(dateRange.to, 'dd-MMM-yyyy')}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSubmit(filters)}
            className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            Generate Report
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex gap-4 items-end">
          {/* Employee Selection */}
          <div className="space-y-2">
            <Label>Select Employee</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Choose an employee" />
              </SelectTrigger>
              <SelectContent>
                {availableEmployees.map((employee) => (
                  <SelectItem key={employee.value} value={employee.value}>
                    {employee.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Picker */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[300px] justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Report Display */}
      {reportData && (
        <ReportGenerator
          title={reportTitle}
          headers={reportData.headers}
          data={reportData.data}
          organization={filters.organization}
          dateRange={dateRange}
        />
      )}
    </div>
  );
};

export default EmployeeStatusReport;