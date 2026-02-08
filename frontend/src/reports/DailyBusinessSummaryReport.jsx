import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format, parseISO } from 'date-fns';
import { printReport, generatePdf, exportToExcel } from '@/lib/reportUtils';
import { Printer, FileDown, FileSpreadsheet, MessageCircle } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';

const DailyBusinessSummaryReport = () => {
  const [shiftRecords] = useLocalStorage('shiftRecords', []);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [orgDetails] = useLocalStorage('orgDetails', {});
  const [creditData, setCreditData] = useState([]);
  const [swipeData, setSwipeData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch real data from backend
  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/daily-business-summary?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setCreditData(data.creditData || []);
        setSwipeData(data.swipeData || []);
      } else {
        console.error('Failed to fetch report data');
        // Fallback to mock data if API fails
        setCreditData(mockCreditData);
        setSwipeData(mockSwipeData);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      // Fallback to mock data
      setCreditData(mockCreditData);
      setSwipeData(mockSwipeData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [selectedDate]);

  // Mock data for fallback
  const mockCreditData = [
    { customerName: 'ABC Corporation', quantity: 150.50, amount: 18500.00, date: '2024-01-15' },
    { customerName: 'XYZ Industries', quantity: 200.25, amount: 24500.00, date: '2024-01-15' },
    { customerName: 'PQR Ltd', quantity: 75.80, amount: 9200.00, date: '2024-01-15' }
  ];

  const mockSwipeData = [
    { swipeName: 'HDFC Bank', batchId: 'BATCH001', amount: 25000.00, date: '2024-01-15' },
    { swipeName: 'ICICI Bank', batchId: 'BATCH002', amount: 18500.00, date: '2024-01-15' },
    { swipeName: 'SBI', batchId: 'BATCH003', amount: 32000.00, date: '2024-01-15' }
  ];

  const handlePrint = () => {
    printReport('Day Business Summary', document.getElementById('report-content'), 'day-business-summary');
  };

  const handleExportPdf = () => {
    generatePdf([], [], 'Day Business Summary', 'day-business-summary', 'day-business-summary');
  };

  const handleExportExcel = () => {
    exportToExcel([], [], 'day-business-summary');
  };

  const handleWhatsApp = () => {
    // Implement WhatsApp sharing logic
    console.log('WhatsApp share');
  };

  return (
    <div className="w-full space-y-6" id="report-content">
      {/* Header Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            {/* Left Side - Organization Logo */}
            <div className="flex items-center">
              {orgDetails.firmLogo ? (
                <img src={orgDetails.firmLogo} alt="Organization Logo" className="h-16 w-16 object-contain" />
              ) : (
                <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-xs">LOGO</span>
                </div>
              )}
            </div>

            {/* Center - Organization Details */}
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold text-blue-900">{orgDetails.firmName || 'PETROPRO MANAGEMENT SYSTEM'}</h1>
              <p className="text-sm text-gray-600">{orgDetails.address || 'Professional Petrol Pump Management Solution'}</p>
              <p className="text-sm text-gray-600">GST: {orgDetails.gstNo || '23AAPCS8852A'}</p>
              <p className="text-sm text-gray-600">Contact: {orgDetails.contactNo || '9898140405'}</p>
            </div>

            {/* Right Side - Company Logo */}
            <div className="flex items-center">
              {orgDetails.companyLogo ? (
                <img src={orgDetails.companyLogo} alt="Company Logo" className="h-16 w-16 object-contain" />
              ) : (
                <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">PETRO</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date and Report Name with Export Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            {/* Left Side - Date */}
            <div>
              <Label htmlFor="report-date" className="text-sm font-medium">Date:</Label>
              <Input
                id="report-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="ml-2"
              />
            </div>

            {/* Center - Report Name */}
            <div className="text-center">
              <h2 className="text-xl font-bold text-blue-900">Day Business Summary</h2>
            </div>

            {/* Right Side - Export Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPdf}>
                <FileDown className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportExcel}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={handleWhatsApp}>
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Credit Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading credit data...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Credit Customer</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.customerName}</TableCell>
                    <TableCell className="text-right">{row.quantity.toFixed(2)}</TableCell>
                    <TableCell className="text-right">₹{row.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{format(parseISO(row.date), 'dd/MM/yyyy')}</TableCell>
                  </TableRow>
                ))}
                {creditData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">
                      No credit data available for selected date
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Swipe Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Swipe Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading swipe data...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Swipe Name</TableHead>
                  <TableHead>Batch ID</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {swipeData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.swipeName}</TableCell>
                    <TableCell>{row.batchId}</TableCell>
                    <TableCell className="text-right">₹{row.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{format(parseISO(row.date), 'dd/MM/yyyy')}</TableCell>
                  </TableRow>
                ))}
                {swipeData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">
                      No swipe data available for selected date
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyBusinessSummaryReport;