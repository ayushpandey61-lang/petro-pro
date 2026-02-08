import React, { useState } from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';
import ReportGenerator from '@/components/reports/ReportGenerator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Custom component for Employee Day Business Report
const EmployeeDayBusinessReport = ({ data, organization, dateRange }) => {
    if (!data) return null;

    const renderSection = (sectionData, sectionKey) => {
        if (!sectionData || !sectionData.headers || !sectionData.data) return null;

        return (
            <div key={sectionKey} className="mb-8">
                <div className="bg-white">
                    {/* Section Header */}
                    <div className="bg-gray-100 p-2 border-b">
                        <h3 className="font-semibold text-gray-800 text-center">{sectionData.title}</h3>
                    </div>

                    {/* Section Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-purple-100">
                                    {sectionData.headers.map((header, index) => (
                                        <th
                                            key={index}
                                            className="p-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200"
                                            style={{ minWidth: '80px' }}
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sectionData.data.map((row, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                    >
                                        {row.map((cell, cellIndex) => (
                                            <td
                                                key={cellIndex}
                                                className="p-2 text-xs text-gray-800 border-b border-gray-100"
                                            >
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

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
                        {organization?.firmName || 'MS SHREE HARSH VALLABH FUELS'}
                    </h1>
                    <p className="text-sm text-gray-600 mb-1">
                        {organization?.address || 'VILLAGE DELAURA SAJANPUR BYPASS'}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                        {organization?.bunkDetails || 'SATNA MP'}
                    </p>
                    <p className="text-sm text-gray-600">
                        {organization?.gstNo || '23AJAPD5363N1ZA'}
                    </p>
                    <p className="text-sm text-gray-600">
                        {organization?.contactNo || '9981440065'}
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
                    <h2 className="text-lg font-semibold text-gray-800">Employee Day Business Report</h2>
                    <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded border">
                        Date: {data.reportInfo.date} | Employee: {data.reportInfo.employee}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    >
                        <span className="mr-2">📊</span>
                        Excel
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                    >
                        <span className="mr-2">📄</span>
                        PDF
                    </Button>
                </div>
            </div>

            {/* Report Content */}
            <div className="p-6">
                {renderSection(data.liquidSales, 'liquidSales')}
                {renderSection(data.lubricantSales, 'lubricantSales')}
                {renderSection(data.creditSales, 'creditSales')}
                {renderSection(data.cumulativeCreditSales, 'cumulativeCreditSales')}
                {renderSection(data.swipeModeSales, 'swipeModeSales')}
                {renderSection(data.cardWiseTotal, 'cardWiseTotal')}
                {renderSection(data.recovery, 'recovery')}
                {renderSection(data.expenses, 'expenses')}
                {renderSection(data.cashCollections, 'cashCollections')}
                {renderSection(data.summary, 'summary')}
            </div>
        </div>
    );
};

const DailyBusinessSummaryReport = () => {
    // State for all sections
    const [section1Filters, setSection1Filters] = useState({});
    const [section1ReportData, setSection1ReportData] = useState(null);
    const [section1ReportTitle, setSection1ReportTitle] = useState('');

    // Shift and date range states for section 1
    const [section1ShiftWise, setSection1ShiftWise] = useState(false);
    const [section1SelectedShift, setSection1SelectedShift] = useState('');
    const [section1DateRange, setSection1DateRange] = useState({ from: null, to: null });

    // Employee selector state for section 1
    const [section1SelectedEmployee, setSection1SelectedEmployee] = useState('');

    const [section2DateRange, setSection2DateRange] = useState({ from: null, to: null });
    const [section2ReportData, setSection2ReportData] = useState(null);

    const [section3DateRange, setSection3DateRange] = useState({ from: null, to: null });
    const [section3ReportData, setSection3ReportData] = useState(null);

    const [section4DateRange, setSection4DateRange] = useState({ from: null, to: null });
    const [section4ReportData, setSection4ReportData] = useState(null);

    const [section5DateRange, setSection5DateRange] = useState({ from: null, to: null });
    const [section5ReportType, setSection5ReportType] = useState('liquid');
    const [section5GroupWise, setSection5GroupWise] = useState(false);
    const [section5ReportData, setSection5ReportData] = useState(null);

    const [section6DateRange, setSection6DateRange] = useState({ from: null, to: null });
    const [section6ReportData, setSection6ReportData] = useState(null);

    const [section7DayDate, setSection7DayDate] = useState(null);
    const [section7MonthlyDateRange, setSection7MonthlyDateRange] = useState({ from: null, to: null });
    const [section7ReportData, setSection7ReportData] = useState(null);
    const [section7ReportType, setSection7ReportType] = useState('day');

    // Mock data for demonstration
    const mockData = {
        summary: [
            { metric: 'Total Liquid Sale', amount: '₹125,000.00' },
            { metric: 'Total Lube Sale', amount: '₹25,000.00' },
            { metric: 'Total Credit Sale', amount: '₹85,000.00' },
            { metric: 'Total Recovery', amount: '₹15,000.00' },
            { metric: 'Total Swipe', amount: '₹35,000.00' },
            { metric: 'Total Expense', amount: '₹12,000.00' },
            { metric: 'Total Cash Handover', amount: '₹8,000.00' },
            { metric: 'Total Shortage', amount: '₹5,000.00' }
        ],
        daySheet: [
            { date: '2025-01-15', employee: 'John Doe', totalSale: '₹15,000.00', totalCollection: '₹14,500.00', shortage: '₹500.00' },
            { date: '2025-01-15', employee: 'Jane Smith', totalSale: '₹18,000.00', totalCollection: '₹18,200.00', shortage: '-₹200.00' }
        ],
        employeeSheet: [
            { employee: 'John Doe', date: '2025-01-15', totalSale: '₹15,000.00', totalCollection: '₹14,500.00', shortage: '₹500.00' },
            { employee: 'Jane Smith', date: '2025-01-15', totalSale: '₹18,000.00', totalCollection: '₹18,200.00', shortage: '-₹200.00' }
        ],
        dayBusiness: [
            { nozzle: 'Nozzle 1', opening: '10000', closing: '12500', sale: '2500', amount: '₹125,000.00' },
            { nozzle: 'Nozzle 2', opening: '8000', closing: '10000', sale: '2000', amount: '₹100,000.00' }
        ]
    };

    // Section 1: 4 Type Reports Handler
    const handleSection1Submit = (filters) => {
        const { reportType = 'summary', date } = filters;

        let title = '';
        let headers = [];
        let data = [];

        // Add employee info to title if employeeSheet is selected
        if (reportType === 'employeeSheet' && section1SelectedEmployee) {
            const employeeLabel = availableEmployees.find(e => e.value === section1SelectedEmployee)?.label || 'All Employees';
            title += ` - ${employeeLabel}`;
        }

        // Add shift and date range info to title if shiftWise is enabled
        if (section1ShiftWise) {
            const shiftLabel = availableShifts.find(s => s.value === section1SelectedShift)?.label || 'All Shifts';
            const dateRangeText = section1DateRange.from && section1DateRange.to
                ? ` (${format(section1DateRange.from, 'dd/MM/yyyy')} - ${format(section1DateRange.to, 'dd/MM/yyyy')})`
                : section1DateRange.from
                ? ` (${format(section1DateRange.from, 'dd/MM/yyyy')})`
                : '';
            title += ` - ${shiftLabel}${dateRangeText}`;
        }

        switch (reportType) {
            case 'summary':
                title = 'Day Business Summary' + (section1ShiftWise ? title : '');
                headers = [{ key: 'metric', label: 'Metric' }, { key: 'amount', label: 'Amount' }];
                data = mockData.summary;
                break;
            case 'daySheet':
                title = 'Day Sheet' + (section1ShiftWise ? title : '');
                headers = [
                    { key: 'date', label: 'Date' },
                    { key: 'employee', label: 'Employee' },
                    { key: 'totalSale', label: 'Total Sale' },
                    { key: 'totalCollection', label: 'Total Collection' },
                    { key: 'shortage', label: 'Shortage/Excess' }
                ];
                data = mockData.daySheet;
                break;
            case 'employeeSheet':
                title = 'Employee Day Business Report' + (section1SelectedEmployee ? title : '') + (section1ShiftWise ? title : '');

                // Create comprehensive employee day business report data
                const employeeData = {
                    reportInfo: {
                        date: section1Filters.date ? format(section1Filters.date, 'dd-MMM-yyyy') : format(new Date(), 'dd-MMM-yyyy'),
                        employee: section1SelectedEmployee ? availableEmployees.find(e => e.value === section1SelectedEmployee)?.label : 'RAJENDRA KUMAR S'
                    },
                    liquidSales: {
                        title: 'Liquid Sales',
                        headers: ['S.No', 'Emp Name', 'Nozzle Name', 'Product', 'O-Reading', 'C-Reading', 'Testing', 'Litre', 'Sales', 'Price', 'S.Amount'],
                        data: [
                            ['1', 'RAJENDRA KUMAR S', 'Nozzle 1', 'MS', '10000', '12500', '0', '2500', '2500', '98.50', '246250.00'],
                            ['2', 'RAJENDRA KUMAR S', 'Nozzle 2', 'HSD', '8000', '10000', '0', '2000', '2000', '85.25', '170500.00']
                        ]
                    },
                    lubricantSales: {
                        title: 'Lubricant Sales',
                        headers: ['S.No', 'Emp Name', 'Lube Name', 'Sales', 'Price', 'Sales Amount'],
                        data: [
                            ['1', 'RAJENDRA KUMAR S', 'Engine Oil', '2', '450.00', '900.00']
                        ]
                    },
                    creditSales: {
                        title: 'Credit Sales',
                        headers: ['S.No', 'Emp Name', 'Company Name', 'Vehicle No', 'Bill No', 'Product', 'Quantity', 'Cost', 'Rate', 'Discount', 'Bill Amount'],
                        data: [
                            ['1', 'RAJENDRA KUMAR S', 'MS SHREE HARI VALLABH PETS', 'MH-12-AB-1234', 'BILL-001', 'PETROL', '50.00', '98.50', '98.50', '0.00', '4925.00'],
                            ['2', 'RAJENDRA KUMAR S', 'MS SHREE HARI VALLABH PETS', 'MH-12-XY-5678', 'BILL-002', 'DIESEL', '45.00', '85.25', '85.25', '0.00', '3836.25']
                        ]
                    },
                    cumulativeCreditSales: {
                        title: 'Cumulative Credit Sales',
                        headers: ['S.No', 'Company Name', 'Total Credit'],
                        data: [
                            ['1', 'MS SHREE HARI VALLABH PETS', '8761.25']
                        ]
                    },
                    swipeModeSales: {
                        title: 'Swipe Mode Sales',
                        headers: ['S.No', 'Emp Name', 'Swipe', 'Note', 'Card Amount'],
                        data: [
                            ['1', 'RAJENDRA KUMAR S', 'CASH', 'Card Payment', '0.00']
                        ]
                    },
                    cardWiseTotal: {
                        title: 'Card Wise Total',
                        headers: ['S.No', 'Bank Name', 'Card Wise Total', 'Card Amount'],
                        data: [
                            ['1', 'SBI', '0.00', '0.00']
                        ]
                    },
                    recovery: {
                        title: 'Recovery',
                        headers: ['S.No', 'Emp Name', 'Company Name', 'Txn Type', 'Txn Mode', 'Details', 'Receipt Amount'],
                        data: [
                            ['1', 'RAJENDRA KUMAR S', 'MS SHREE HARI VALLABH PETS', 'Recovery', 'Cash', 'Credit Recovery', '0.00']
                        ]
                    },
                    expenses: {
                        title: 'Expenses',
                        headers: ['S.No', 'Emp Name', 'Expense', 'Category', 'Narration', 'Expense Amount'],
                        data: [
                            ['1', 'RAJENDRA KUMAR S', 'OUTFLOW - 0', 'INFLOW - 0', 'No expenses', '0.00']
                        ]
                    },
                    cashCollections: {
                        title: 'Cash Collections',
                        headers: ['S.No', 'Emp Name', 'Shift', 'Collection'],
                        data: [
                            ['1', 'RAJENDRA KUMAR S', 'Day Shift', '0.00']
                        ]
                    },
                    summary: {
                        title: 'Summary',
                        headers: ['S.No', 'Emp Name', 'Sale', 'Lube Sale', 'Crd Recovery', 'Cash In', 'Swipe', 'Employee Shortage', 'Credit', 'Expense', 'Sale Discount', 'Emp Cash Recovery', 'Shortage'],
                        data: [
                            ['1', 'RAJENDRA KUMAR S', '416750.00', '900.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00']
                        ]
                    }
                };

                // Filter data based on selected employee
                if (section1SelectedEmployee && section1SelectedEmployee !== 'all') {
                    const selectedEmployeeLabel = availableEmployees.find(e => e.value === section1SelectedEmployee)?.label;
                    // Update employee name in all sections
                    Object.keys(employeeData).forEach(section => {
                        if (employeeData[section].data) {
                            employeeData[section].data = employeeData[section].data.map(row => {
                                if (row[1] && typeof row[1] === 'string') {
                                    row[1] = selectedEmployeeLabel;
                                }
                                return row;
                            });
                        }
                    });
                }

                setSection1ReportTitle(title);
                setSection1ReportData(employeeData);
                break;
            case 'dayBusiness':
                title = 'Day Business' + (section1ShiftWise ? title : '');
                headers = [
                    { key: 'nozzle', label: 'Nozzle' },
                    { key: 'opening', label: 'Opening' },
                    { key: 'closing', label: 'Closing' },
                    { key: 'sale', label: 'Sale' },
                    { key: 'amount', label: 'Amount' }
                ];
                data = mockData.dayBusiness;
                break;
        }

        setSection1ReportTitle(title);
        setSection1ReportData({ headers, data });
    };

    // Section 2: Daily Business Sheet Handler
    const handleSection2Submit = () => {
        if (!section2DateRange.from || !section2DateRange.to) return;

        const headers = [
            { key: 'date', label: 'Date' },
            { key: 'nozzle', label: 'Nozzle' },
            { key: 'opening', label: 'Opening Reading' },
            { key: 'closing', label: 'Closing Reading' },
            { key: 'sale', label: 'Sale (L)' },
            { key: 'amount', label: 'Amount' }
        ];
        const data = mockData.dayBusiness.map(item => ({
            ...item,
            date: format(section2DateRange.from, 'yyyy-MM-dd')
        }));

        setSection2ReportData({ headers, data });
    };

    // Section 3: Day Settlement Handler
    const handleSection3Submit = () => {
        if (!section3DateRange.from || !section3DateRange.to) return;

        const headers = [
            { key: 'date', label: 'Date' },
            { key: 'totalSale', label: 'Total Sale' },
            { key: 'totalCollection', label: 'Total Collection' },
            { key: 'settlement', label: 'Settlement Amount' },
            { key: 'status', label: 'Status' }
        ];
        const data = [
            {
                date: format(section3DateRange.from, 'yyyy-MM-dd'),
                totalSale: '₹150,000.00',
                totalCollection: '₹148,000.00',
                settlement: '₹148,000.00',
                status: 'Completed'
            }
        ];

        setSection3ReportData({ headers, data });
    };

    // Section 4: Monthly Business Group Report Handler
    const handleSection4Submit = () => {
        if (!section4DateRange.from || !section4DateRange.to) return;

        const headers = [
            { key: 'month', label: 'Month' },
            { key: 'group', label: 'Group' },
            { key: 'totalSale', label: 'Total Sale' },
            { key: 'profit', label: 'Profit' },
            { key: 'percentage', label: 'Percentage' }
        ];
        const data = [
            {
                month: format(section4DateRange.from, 'MMM yyyy'),
                group: 'Premium',
                totalSale: '₹2,500,000.00',
                profit: '₹250,000.00',
                percentage: '10%'
            }
        ];

        setSection4ReportData({ headers, data });
    };

    // Section 5: Gross Gain Handler
    const handleSection5Submit = () => {
        if (!section5DateRange.from || !section5DateRange.to) return;

        const headers = [
            { key: 'date', label: 'Date' },
            { key: 'type', label: 'Type' },
            { key: 'sale', label: 'Sale' },
            { key: 'cost', label: 'Cost' },
            { key: 'grossGain', label: 'Gross Gain' }
        ];

        const typeLabel = section5ReportType === 'liquid' ? 'Liquid Sales' :
                         section5ReportType === 'lubricant' ? 'Lubricant Sales' : 'All Sales';

        const data = [
            {
                date: format(section5DateRange.from, 'yyyy-MM-dd'),
                type: typeLabel,
                sale: '₹150,000.00',
                cost: '₹120,000.00',
                grossGain: '₹30,000.00'
            }
        ];

        setSection5ReportData({ headers, data });
    };

    // Section 6: Balance Sheet Handler
    const handleSection6Submit = () => {
        if (!section6DateRange.from || !section6DateRange.to) return;

        const headers = [
            { key: 'account', label: 'Account' },
            { key: 'debit', label: 'Debit' },
            { key: 'credit', label: 'Credit' },
            { key: 'balance', label: 'Balance' }
        ];
        const data = [
            { account: 'Cash', debit: '₹500,000.00', credit: '₹0.00', balance: '₹500,000.00' },
            { account: 'Inventory', debit: '₹200,000.00', credit: '₹0.00', balance: '₹200,000.00' },
            { account: 'Accounts Payable', debit: '₹0.00', credit: '₹150,000.00', balance: '₹150,000.00' }
        ];

        setSection6ReportData({ headers, data });
    };

    // Section 7: Working Capital Handler
    const handleSection7Submit = () => {
        const headers = [
            { key: 'item', label: 'Item' },
            { key: 'amount', label: 'Amount' },
            { key: 'percentage', label: 'Percentage' }
        ];

        let data = [];
        let title = '';

        if (section7ReportType === 'day' && section7DayDate) {
            title = `Working Capital Report - ${format(section7DayDate, 'dd MMM yyyy')}`;
            data = [
                { item: 'Current Assets', amount: '₹700,000.00', percentage: '70%' },
                { item: 'Current Liabilities', amount: '₹150,000.00', percentage: '15%' },
                { item: 'Working Capital', amount: '₹550,000.00', percentage: '55%' }
            ];
        } else if (section7ReportType === 'monthly' && section7MonthlyDateRange.from && section7MonthlyDateRange.to) {
            title = `Monthly Working Capital Report - ${format(section7MonthlyDateRange.from, 'MMM yyyy')}`;
            data = [
                { item: 'Average Current Assets', amount: '₹21,000,000.00', percentage: '70%' },
                { item: 'Average Current Liabilities', amount: '₹4,500,000.00', percentage: '15%' },
                { item: 'Average Working Capital', amount: '₹16,500,000.00', percentage: '55%' }
            ];
        }

        setSection7ReportData({ headers, data, title });
    };

    const section1Fields = [
        { name: 'reportType', label: 'Report Type', type: 'radio', options: [
            { value: 'summary', label: 'Day Business Summary' },
            { value: 'daySheet', label: 'Day Sheet' },
            { value: 'employeeSheet', label: 'Employee Sheet' },
            { value: 'dayBusiness', label: 'Day Business' }
        ]},
        { name: 'date', label: 'Date', type: 'date' }
    ];

    // Available shifts
    const availableShifts = [
        { value: 'morning', label: 'Morning Shift (6:00 AM - 2:00 PM)' },
        { value: 'evening', label: 'Evening Shift (2:00 PM - 10:00 PM)' },
        { value: 'night', label: 'Night Shift (10:00 PM - 6:00 AM)' },
        { value: 'all', label: 'All Shifts' }
    ];

    // Available employees
    const availableEmployees = [
        { value: 'rajendra-kumar', label: 'RAJENDRA KUMAR S' },
        { value: 'john-doe', label: 'John Doe' },
        { value: 'jane-smith', label: 'Jane Smith' },
        { value: 'mike-johnson', label: 'Mike Johnson' },
        { value: 'sarah-wilson', label: 'Sarah Wilson' },
        { value: 'david-brown', label: 'David Brown' },
        { value: 'lisa-davis', label: 'Lisa Davis' },
        { value: 'all', label: 'All Employees' }
    ];

    return (
        <div className="space-y-6">
            {/* Section 1: 4 Type Reports */}
            <Card>
                <CardHeader>
                    <CardTitle>Business Reports</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Report Type Selection */}
                    <div className="space-y-2">
                        <Label className="text-base font-medium">Report Type</Label>
                        <RadioGroup
                            value={section1Filters.reportType || 'summary'}
                            onValueChange={(value) => {
                                setSection1Filters(prev => ({ ...prev, reportType: value }));
                                // Reset employee selection when changing report type
                                if (value !== 'employeeSheet') {
                                    setSection1SelectedEmployee('');
                                }
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="summary" id="summary" />
                                    <Label htmlFor="summary">Day Business Summary</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="daySheet" id="daySheet" />
                                    <Label htmlFor="daySheet">Day Sheet</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="employeeSheet" id="employeeSheet" />
                                    <Label htmlFor="employeeSheet">Employee Sheet</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="dayBusiness" id="dayBusiness" />
                                    <Label htmlFor="dayBusiness">Day Business</Label>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Date Selection */}
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !section1Filters.date && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {section1Filters.date ? format(section1Filters.date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={section1Filters.date}
                                    onSelect={(date) => setSection1Filters(prev => ({ ...prev, date }))}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Employee Selector - Only show when employeeSheet is selected */}
                    {section1Filters.reportType === 'employeeSheet' && (
                        <div className="space-y-2">
                            <Label>Select Employee</Label>
                            <Select value={section1SelectedEmployee} onValueChange={setSection1SelectedEmployee}>
                                <SelectTrigger className="w-[280px]">
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
                    )}

                    {/* Shift Wise Checkbox */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="shiftWise"
                            checked={section1ShiftWise}
                            onCheckedChange={(checked) => {
                                setSection1ShiftWise(checked);
                                if (!checked) {
                                    setSection1SelectedShift('');
                                    setSection1DateRange({ from: null, to: null });
                                }
                            }}
                        />
                        <Label htmlFor="shiftWise" className="text-base font-medium">Shift Wise</Label>
                    </div>

                    {/* Shift Selector and Date Range - Only show when shiftWise is checked */}
                    {section1ShiftWise && (
                        <div className="space-y-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                            {/* Shift Selection */}
                            <div className="space-y-2">
                                <Label>Select Shift</Label>
                                <Select value={section1SelectedShift} onValueChange={setSection1SelectedShift}>
                                    <SelectTrigger className="w-[300px]">
                                        <SelectValue placeholder="Choose a shift" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableShifts.map((shift) => (
                                            <SelectItem key={shift.value} value={shift.value}>
                                                {shift.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date Range Picker */}
                            <div className="space-y-2">
                                <Label>Date Range (From - To)</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={cn("w-[300px] justify-start text-left font-normal", !section1DateRange.from && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {section1DateRange.from ? (
                                                section1DateRange.to ? (
                                                    `${format(section1DateRange.from, "LLL dd, y")} - ${format(section1DateRange.to, "LLL dd, y")}`
                                                ) : (
                                                    format(section1DateRange.from, "LLL dd, y")
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
                                            defaultMonth={section1DateRange.from}
                                            selected={section1DateRange}
                                            onSelect={setSection1DateRange}
                                            numberOfMonths={2}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button onClick={() => handleSection1Submit(section1Filters)} className="w-full md:w-auto">
                        Generate Report
                    </Button>

                    {/* Report Display */}
                    {section1ReportData && section1Filters.reportType === 'employeeSheet' ? (
                        <EmployeeDayBusinessReport
                            data={section1ReportData}
                            organization={section1Filters.organization}
                            dateRange={section1DateRange}
                        />
                    ) : section1ReportData ? (
                        <ReportGenerator
                            title={section1ReportTitle}
                            headers={section1ReportData.headers}
                            data={section1ReportData.data}
                            organization={section1Filters.organization}
                            dateRange={section1DateRange}
                        />
                    ) : null}
                </CardContent>
            </Card>

            {/* Section 2: Daily Business Sheet */}
            <Card>
                <CardHeader>
                    <CardTitle>Daily Business Sheet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4 items-end">
                        <div className="space-y-1">
                            <Label>Date Range</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !section2DateRange.from && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {section2DateRange.from ? (
                                            section2DateRange.to ? (
                                                `${format(section2DateRange.from, "LLL dd, y")} - ${format(section2DateRange.to, "LLL dd, y")}`
                                            ) : (
                                                format(section2DateRange.from, "LLL dd, y")
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
                                        defaultMonth={section2DateRange.from}
                                        selected={section2DateRange}
                                        onSelect={setSection2DateRange}
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Button onClick={handleSection2Submit}>Submit</Button>
                    </div>
                    {section2ReportData && (
                        <ReportGenerator
                            title="Daily Business Sheet Report"
                            headers={section2ReportData.headers}
                            data={section2ReportData.data}
                            organization={section1Filters.organization}
                            dateRange={section2DateRange}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Section 3: Day Settlement */}
            <Card>
                <CardHeader>
                    <CardTitle>Day Settlement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4 items-end">
                        <div className="space-y-1">
                            <Label>Date Range</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !section3DateRange.from && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {section3DateRange.from ? (
                                            section3DateRange.to ? (
                                                `${format(section3DateRange.from, "LLL dd, y")} - ${format(section3DateRange.to, "LLL dd, y")}`
                                            ) : (
                                                format(section3DateRange.from, "LLL dd, y")
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
                                        defaultMonth={section3DateRange.from}
                                        selected={section3DateRange}
                                        onSelect={setSection3DateRange}
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Button onClick={handleSection3Submit}>Submit</Button>
                    </div>
                    {section3ReportData && (
                        <ReportGenerator
                            title="Day Settlement Report"
                            headers={section3ReportData.headers}
                            data={section3ReportData.data}
                            organization={section1Filters.organization}
                            dateRange={section3DateRange}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Section 4: Monthly Business Group Report */}
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Business Group Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4 items-end">
                        <div className="space-y-1">
                            <Label>Date Range</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !section4DateRange.from && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {section4DateRange.from ? (
                                            section4DateRange.to ? (
                                                `${format(section4DateRange.from, "LLL dd, y")} - ${format(section4DateRange.to, "LLL dd, y")}`
                                            ) : (
                                                format(section4DateRange.from, "LLL dd, y")
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
                                        defaultMonth={section4DateRange.from}
                                        selected={section4DateRange}
                                        onSelect={setSection4DateRange}
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Button onClick={handleSection4Submit}>Submit</Button>
                    </div>
                    {section4ReportData && (
                        <ReportGenerator
                            title="Monthly Business Group Report"
                            headers={section4ReportData.headers}
                            data={section4ReportData.data}
                            organization={section1Filters.organization}
                            dateRange={section4DateRange}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Section 5: Gross Gain */}
            <Card>
                <CardHeader>
                    <CardTitle>Gross Gain</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4 items-end">
                        <div className="space-y-1">
                            <Label>Date Range</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !section5DateRange.from && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {section5DateRange.from ? (
                                            section5DateRange.to ? (
                                                `${format(section5DateRange.from, "LLL dd, y")} - ${format(section5DateRange.to, "LLL dd, y")}`
                                            ) : (
                                                format(section5DateRange.from, "LLL dd, y")
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
                                        defaultMonth={section5DateRange.from}
                                        selected={section5DateRange}
                                        onSelect={setSection5DateRange}
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label>Sales Type</Label>
                            <RadioGroup value={section5ReportType} onValueChange={setSection5ReportType}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="liquid" id="liquid" />
                                    <Label htmlFor="liquid">Liquid Sales</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="lubricant" id="lubricant" />
                                    <Label htmlFor="lubricant">Lubricant Sales</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {section5ReportType === 'lubricant' && (
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="groupWise"
                                    checked={section5GroupWise}
                                    onCheckedChange={setSection5GroupWise}
                                />
                                <Label htmlFor="groupWise">Group Wise</Label>
                            </div>
                        )}
                        <Button onClick={handleSection5Submit}>Submit</Button>
                    </div>
                    {section5ReportData && (
                        <ReportGenerator
                            title="Gross Gain Report"
                            headers={section5ReportData.headers}
                            data={section5ReportData.data}
                            organization={section1Filters.organization}
                            dateRange={section5DateRange}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Section 6: Balance Sheet */}
            <Card>
                <CardHeader>
                    <CardTitle>Balance Sheet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4 items-end">
                        <div className="space-y-1">
                            <Label>Date Range</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !section6DateRange.from && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {section6DateRange.from ? (
                                            section6DateRange.to ? (
                                                `${format(section6DateRange.from, "LLL dd, y")} - ${format(section6DateRange.to, "LLL dd, y")}`
                                            ) : (
                                                format(section6DateRange.from, "LLL dd, y")
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
                                        defaultMonth={section6DateRange.from}
                                        selected={section6DateRange}
                                        onSelect={setSection6DateRange}
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Button onClick={handleSection6Submit}>Submit</Button>
                    </div>
                    {section6ReportData && (
                        <ReportGenerator
                            title="Balance Sheet Report"
                            headers={section6ReportData.headers}
                            data={section6ReportData.data}
                            organization={section1Filters.organization}
                            dateRange={section6DateRange}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Section 7: Working Capital */}
            <Card>
                <CardHeader>
                    <CardTitle>Working Capital</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-4">
                        <div className="flex gap-4 items-end">
                            <div className="space-y-1">
                                <Label>Report Type</Label>
                                <Select value={section7ReportType} onValueChange={setSection7ReportType}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="day">Day Report</SelectItem>
                                        <SelectItem value="monthly">Monthly Report</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {section7ReportType === 'day' && (
                                <div className="space-y-1">
                                    <Label>Select Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !section7DayDate && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {section7DayDate ? format(section7DayDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={section7DayDate}
                                                onSelect={setSection7DayDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            )}

                            {section7ReportType === 'monthly' && (
                                <div className="space-y-1">
                                    <Label>Date Range</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !section7MonthlyDateRange.from && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {section7MonthlyDateRange.from ? (
                                                    section7MonthlyDateRange.to ? (
                                                        `${format(section7MonthlyDateRange.from, "LLL dd, y")} - ${format(section7MonthlyDateRange.to, "LLL dd, y")}`
                                                    ) : (
                                                        format(section7MonthlyDateRange.from, "LLL dd, y")
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
                                                defaultMonth={section7MonthlyDateRange.from}
                                                selected={section7MonthlyDateRange}
                                                onSelect={setSection7MonthlyDateRange}
                                                numberOfMonths={2}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            )}

                            <Button onClick={handleSection7Submit}>Submit</Button>
                        </div>
                    </div>
                    {section7ReportData && (
                        <ReportGenerator
                            title={section7ReportData.title || "Working Capital Report"}
                            headers={section7ReportData.headers}
                            data={section7ReportData.data}
                            organization={section1Filters.organization}
                            dateRange={section7ReportType === 'day' ? { from: section7DayDate, to: section7DayDate } : section7MonthlyDateRange}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DailyBusinessSummaryReport;