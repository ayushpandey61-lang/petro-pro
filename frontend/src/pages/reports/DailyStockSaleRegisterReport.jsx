import React, { useState } from 'react';
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
import ReportGenerator from '@/components/reports/ReportGenerator';
import useLocalStorage from '@/hooks/useLocalStorage';

const DailyStockSaleRegisterReport = () => {
  // Local storage data
  const [fuelProducts] = useLocalStorage('fuelProducts', []);
  const [tanks] = useLocalStorage('tanks', []);
  const [lubricants] = useLocalStorage('lubricants', []);

  // Product options
  const liquidProducts = fuelProducts.filter(p => p.productType === 'liquid' || !p.productType).map(p => ({ value: p.id, label: p.productName }));
  const lubricantProducts = lubricants.map(l => ({ value: l.id, label: l.productName }));
  const allProducts = [...liquidProducts, ...lubricantProducts];
  const tankOptions = tanks.map(t => ({ value: t.id, label: t.tankName }));

  // Section 1: DSR States
  const [dsrDateRange, setDsrDateRange] = useState({ from: null, to: null });
  const [dsrReportType, setDsrReportType] = useState('');
  const [dsrSelectedItem, setDsrSelectedItem] = useState('');
  const [dsrReportData, setDsrReportData] = useState(null);

  // Section 2: Density Report States
  const [densityDateRange, setDensityDateRange] = useState({ from: null, to: null });
  const [densitySelectedTank, setDensitySelectedTank] = useState('');
  const [densityReportData, setDensityReportData] = useState(null);

  // Section 3: DSR Format Report States
  const [dsrFormatDateRange, setDsrFormatDateRange] = useState({ from: null, to: null });
  const [dsrFormatSelectedProduct, setDsrFormatSelectedProduct] = useState('');
  const [dsrFormatReportData, setDsrFormatReportData] = useState(null);

  // Section 4: Day Wise Stock Value States
  const [stockValueDateRange, setStockValueDateRange] = useState({ from: null, to: null });
  const [stockValueType, setStockValueType] = useState('');
  const [stockValueSelectedProduct, setStockValueSelectedProduct] = useState('');
  const [stockValueReportData, setStockValueReportData] = useState(null);

  // Mock data for demonstration
  const mockData = {
    dsr: [
      { date: '2025-01-15', product: 'Petrol', openingStock: '10000', closingStock: '8500', sale: '1500', amount: '₹75,000.00' },
      { date: '2025-01-15', product: 'Diesel', openingStock: '8000', closingStock: '6500', sale: '1500', amount: '₹67,500.00' }
    ],
    density: [
      { date: '2025-01-15', tank: 'Tank 1', product: 'Petrol', density: '0.75', temperature: '25°C' },
      { date: '2025-01-15', tank: 'Tank 2', product: 'Diesel', density: '0.85', temperature: '25°C' }
    ],
    dsrFormat: [
      { 
        date: '2025-01-15', 
        invoiceNo: 'INV001',
        openingStock: '10000',
        receipt: '5000',
        totalStock: '15000',
        totalMeterSales: '12000',
        actualSales: '11800',
        pumpTesting: '200',
        closingStock: '3000',
        dipReading: '2950',
        actualDipStock: '2950',
        variation: '-50',
        meterReading1: '25000',
        sales1: '6000',
        meterReading2: '31000',
        sales2: '6000',
        cumulativeMeterSales: '12000',
        cumulativeActualSales: '11800',
        cumulativeTesting: '200',
        cumulativeVariation: '-50',
        waterDip: '0',
        remarks: 'Normal operations'
      },
      { 
        date: '2025-01-15', 
        invoiceNo: 'INV002',
        openingStock: '8000',
        receipt: '3000',
        totalStock: '11000',
        totalMeterSales: '9000',
        actualSales: '8850',
        pumpTesting: '150',
        closingStock: '2000',
        dipReading: '1980',
        actualDipStock: '1980',
        variation: '-20',
        meterReading1: '45000',
        sales1: '4500',
        meterReading2: '49500',
        sales2: '4500',
        cumulativeMeterSales: '9000',
        cumulativeActualSales: '8850',
        cumulativeTesting: '150',
        cumulativeVariation: '-20',
        waterDip: '0',
        remarks: 'All OK'
      }
    ],
    stockValue: [
      { date: '2025-01-15', product: 'Petrol', stock: '5000 L', rate: '₹95.00', value: '₹475,000.00' },
      { date: '2025-01-15', product: 'Diesel', stock: '3000 L', rate: '₹90.00', value: '₹270,000.00' }
    ]
  };

  // Section 1: DSR Submit Handler
  const handleDsrSubmit = () => {
    if (!dsrDateRange.from || !dsrDateRange.to || !dsrReportType || !dsrSelectedItem) return;

    const headers = [
      { key: 'date', label: 'Date' },
      { key: 'product', label: 'Product' },
      { key: 'openingStock', label: 'Opening Stock' },
      { key: 'closingStock', label: 'Closing Stock' },
      { key: 'sale', label: 'Sale' },
      { key: 'amount', label: 'Amount' }
    ];

    const data = mockData.dsr.map(item => ({
      ...item,
      date: format(dsrDateRange.from, 'yyyy-MM-dd')
    }));

    setDsrReportData({ headers, data });
  };

  // Section 2: Density Report Submit Handler
  const handleDensitySubmit = () => {
    if (!densityDateRange.from || !densityDateRange.to || !densitySelectedTank) return;

    const headers = [
      { key: 'date', label: 'Date' },
      { key: 'tank', label: 'Tank' },
      { key: 'product', label: 'Product' },
      { key: 'density', label: 'Density' },
      { key: 'temperature', label: 'Temperature' }
    ];

    const data = mockData.density.map(item => ({
      ...item,
      date: format(densityDateRange.from, 'yyyy-MM-dd')
    }));

    setDensityReportData({ headers, data });
  };

  // Section 3: DSR Format Report Submit Handler
  const handleDsrFormatSubmit = () => {
    if (!dsrFormatDateRange.from || !dsrFormatDateRange.to || !dsrFormatSelectedProduct) return;

    const headers = [
      { key: 'date', label: 'Date' },
      { key: 'invoiceNo', label: 'Invoice No.' },
      { key: 'openingStock', label: 'Opening Stock' },
      { key: 'receipt', label: 'Receipt' },
      { key: 'totalStock', label: 'Total Stock' },
      { key: 'totalMeterSales', label: 'Total Meter Sales' },
      { key: 'actualSales', label: 'Actual Sales' },
      { key: 'pumpTesting', label: 'Pump Testing' },
      { key: 'closingStock', label: 'Closing Stock' },
      { key: 'dipReading', label: 'Dip Reading' },
      { key: 'actualDipStock', label: 'Actual Dip Stock' },
      { key: 'variation', label: 'Variation +/-' },
      { key: 'meterReading1', label: 'Meter Reading 1' },
      { key: 'sales1', label: 'Sales 1' },
      { key: 'meterReading2', label: 'Meter Reading 2' },
      { key: 'sales2', label: 'Sales 2' },
      { key: 'cumulativeMeterSales', label: 'Cumulative Meter Sales' },
      { key: 'cumulativeActualSales', label: 'Cumulative Actual Sales' },
      { key: 'cumulativeTesting', label: 'Cumulative Testing' },
      { key: 'cumulativeVariation', label: 'Cumulative Variation' },
      { key: 'waterDip', label: 'Water Dip' },
      { key: 'remarks', label: 'Remarks' }
    ];

    const data = mockData.dsrFormat.map(item => ({
      ...item,
      date: format(dsrFormatDateRange.from, 'yyyy-MM-dd')
    }));

    setDsrFormatReportData({ headers, data });
  };

  // Section 4: Day Wise Stock Value Submit Handler
  const handleStockValueSubmit = () => {
    if (!stockValueDateRange.from || !stockValueDateRange.to || !stockValueType || !stockValueSelectedProduct) return;

    const headers = [
      { key: 'date', label: 'Date' },
      { key: 'product', label: 'Product' },
      { key: 'stock', label: 'Stock' },
      { key: 'rate', label: 'Rate' },
      { key: 'value', label: 'Value' }
    ];

    const data = mockData.stockValue.map(item => ({
      ...item,
      date: format(stockValueDateRange.from, 'yyyy-MM-dd')
    }));

    setStockValueReportData({ headers, data });
  };

  return (
    <div className="space-y-6">
      {/* Section 1: DSR */}
      <Card>
        <CardHeader>
          <CardTitle>DSR (Daily Stock/Sale Register)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="space-y-1">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !dsrDateRange.from && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dsrDateRange.from ? (
                      dsrDateRange.to ? (
                        `${format(dsrDateRange.from, "LLL dd, y")} - ${format(dsrDateRange.to, "LLL dd, y")}`
                      ) : (
                        format(dsrDateRange.from, "LLL dd, y")
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
                    defaultMonth={dsrDateRange.from}
                    selected={dsrDateRange}
                    onSelect={setDsrDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Report Type</Label>
              <RadioGroup value={dsrReportType} onValueChange={setDsrReportType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="product" id="dsr-product" />
                  <Label htmlFor="dsr-product">Product</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tank" id="dsr-tank" />
                  <Label htmlFor="dsr-tank">Tank</Label>
                </div>
              </RadioGroup>
            </div>

            {dsrReportType && (
              <div className="space-y-1">
                <Label>{dsrReportType === 'product' ? 'Select Product' : 'Select Tank'}</Label>
                <Select value={dsrSelectedItem} onValueChange={setDsrSelectedItem}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={`Choose ${dsrReportType}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {(dsrReportType === 'product' ? allProducts : tankOptions).map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button onClick={handleDsrSubmit}>Submit</Button>
          </div>

          {dsrReportData && (
            <ReportGenerator
              title="DSR Report"
              headers={dsrReportData.headers}
              data={dsrReportData.data}
            />
          )}
        </CardContent>
      </Card>

      {/* Section 2: Density Report */}
      <Card>
        <CardHeader>
          <CardTitle>Density Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="space-y-1">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !densityDateRange.from && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {densityDateRange.from ? (
                      densityDateRange.to ? (
                        `${format(densityDateRange.from, "LLL dd, y")} - ${format(densityDateRange.to, "LLL dd, y")}`
                      ) : (
                        format(densityDateRange.from, "LLL dd, y")
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
                    defaultMonth={densityDateRange.from}
                    selected={densityDateRange}
                    onSelect={setDensityDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1">
              <Label>Select Tank</Label>
              <Select value={densitySelectedTank} onValueChange={setDensitySelectedTank}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Choose tank" />
                </SelectTrigger>
                <SelectContent>
                  {tankOptions.map((tank) => (
                    <SelectItem key={tank.value} value={tank.value}>
                      {tank.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleDensitySubmit}>Submit</Button>
          </div>

          {densityReportData && (
            <ReportGenerator
              title="Density Report"
              headers={densityReportData.headers}
              data={densityReportData.data}
            />
          )}
        </CardContent>
      </Card>

      {/* Section 3: DSR Format Report */}
      <Card>
        <CardHeader>
          <CardTitle>DSR Format Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="space-y-1">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !dsrFormatDateRange.from && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dsrFormatDateRange.from ? (
                      dsrFormatDateRange.to ? (
                        `${format(dsrFormatDateRange.from, "LLL dd, y")} - ${format(dsrFormatDateRange.to, "LLL dd, y")}`
                      ) : (
                        format(dsrFormatDateRange.from, "LLL dd, y")
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
                    defaultMonth={dsrFormatDateRange.from}
                    selected={dsrFormatDateRange}
                    onSelect={setDsrFormatDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1">
              <Label>Select Product</Label>
              <Select value={dsrFormatSelectedProduct} onValueChange={setDsrFormatSelectedProduct}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Choose product" />
                </SelectTrigger>
                <SelectContent>
                  {allProducts.map((product) => (
                    <SelectItem key={product.value} value={product.value}>
                      {product.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleDsrFormatSubmit}>Submit</Button>
          </div>

          {dsrFormatReportData && (
            <ReportGenerator
              title="DSR Format Report"
              headers={dsrFormatReportData.headers}
              data={dsrFormatReportData.data}
            />
          )}
        </CardContent>
      </Card>

      {/* Section 4: Day Wise Stock Value */}
      <Card>
        <CardHeader>
          <CardTitle>Day Wise Stock Value</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="space-y-1">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !stockValueDateRange.from && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {stockValueDateRange.from ? (
                      stockValueDateRange.to ? (
                        `${format(stockValueDateRange.from, "LLL dd, y")} - ${format(stockValueDateRange.to, "LLL dd, y")}`
                      ) : (
                        format(stockValueDateRange.from, "LLL dd, y")
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
                    defaultMonth={stockValueDateRange.from}
                    selected={stockValueDateRange}
                    onSelect={setStockValueDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <RadioGroup value={stockValueType} onValueChange={(value) => {
                setStockValueType(value);
                setStockValueSelectedProduct(''); // Reset product selection
              }}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="liquid" id="liquid" />
                  <Label htmlFor="liquid">Liquid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lubricants" id="lubricants" />
                  <Label htmlFor="lubricants">Lubricants</Label>
                </div>
              </RadioGroup>
            </div>

            {stockValueType && (
              <div className="space-y-1">
                <Label>Select {stockValueType === 'liquid' ? 'Liquid Product' : 'Lubricant Item'}</Label>
                <Select value={stockValueSelectedProduct} onValueChange={setStockValueSelectedProduct}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={`Choose ${stockValueType === 'liquid' ? 'liquid product' : 'lubricant'}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {(stockValueType === 'liquid' ? liquidProducts : lubricantProducts).map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button onClick={handleStockValueSubmit}>Submit</Button>
          </div>

          {stockValueReportData && (
            <ReportGenerator
              title="Day Wise Stock Value Report"
              headers={stockValueReportData.headers}
              data={stockValueReportData.data}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyStockSaleRegisterReport;