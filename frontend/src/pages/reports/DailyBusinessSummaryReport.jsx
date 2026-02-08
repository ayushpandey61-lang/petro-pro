import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Printer, FileDown } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import useLocalStorage from '@/hooks/useLocalStorage';
import { apiClient } from '@/lib/api';

const DailyBusinessSummaryReport = () => {
  const [orgDetails] = useLocalStorage('orgDetails', {});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('summary');
  const [shiftWise, setShiftWise] = useState(false);
  const [selectedShift, setSelectedShift] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(() => {
    if (selectedDate) {
      fetchReportData();
    }
  }, [selectedDate]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/reports/daily-business-summary?date=${format(selectedDate, 'yyyy-MM-dd')}`);
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setReportData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const getMockData = () => ({
    tanks: {
      t1: { dip: 95, volume: 7307.12 },
      t2: { dip: 141.4, volume: 15951.8 },
      t3: { dip: 0, volume: 0 }
    },
    openingStock: {
      ms: { qty: 1156.52, rate: 108.03, amount: 124938.86 },
      hsd: { qty: 1938.84, rate: 93.43, amount: 181145.82 },
      cng: { qty: 364.23, rate: 94.00, amount: 34237.62 }
    },
    products: {
      petrol: {
        nozzles: [
          { unit: 'P1 1ST A1', cm: 15412.54, test: 0, sale: 0, value: 0 },
          { unit: 'P1 1ST B1', cm: 7877.47, test: 0, sale: 0, value: 0 },
          { unit: 'P2 2ND A1', cm: 685641.75, test: 0, sale: 1008.67, value: 108966.62 },
          { unit: 'P2 2ND B1', cm: 170330.85, test: 0, sale: 147.85, value: 15972.24 }
        ],
        total: { test: 0, sale: 1156.52, value: 124938.86 }
      },
      diesel: {
        nozzles: [
          { unit: 'P1 1ST A2', cm: 704306.97, test: 0, sale: 476.15, value: 44486.70 },
          { unit: 'P1 1ST B2', cm: 994012.75, test: 0, sale: 1462.69, value: 136659.12 },
          { unit: 'P2 2ND A2', cm: 21237.28, test: 0, sale: 0, value: 0 },
          { unit: 'P2 2ND B2', cm: 8155.44, test: 0, sale: 0, value: 0 }
        ],
        total: { test: 0, sale: 1938.84, value: 181145.82 }
      },
      cng: {
        nozzles: [
          { unit: 'P3 A', cm: 14991.47, test: 0, sale: 64.06, value: 6021.64 },
          { unit: 'P3 B', cm: 30242.57, test: 0, sale: 300.17, value: 28215.98 }
        ],
        total: { test: 0, sale: 364.23, value: 34237.62 }
      }
    },
    stockSummary: [
      { product: 'MS', tank: 'T1-15KL', openStock: 8439.18, receipt: 0, totalStock: 8439.18, meterSales: 1156.52, closingStock: 7307.12, value: 124938.85, variationLtr: 24.46, variationAmount: 2642.41, rateRevision: 0 },
      { product: 'HSD', tank: 'T2-20KL', openStock: 17948.8, receipt: 0, totalStock: 17948.8, meterSales: 1938.84, closingStock: 15951.80, value: 181145.82, variationLtr: -58.12, variationAmount: -5430.15, rateRevision: 0 },
      { product: 'CNG', tank: 'T3-600KG', openStock: 0, receipt: 0, totalStock: 0, meterSales: 364.23, closingStock: 0, value: 34237.62, variationLtr: 0, variationAmount: 0, rateRevision: 0 }
    ],
    businessSummary: [
      { particular: 'Liquid Sale', amount: 340322.30 },
      { particular: 'Lubs Sale', amount: 0 },
      { particular: 'Cash In', amount: 0 },
      { particular: 'Cash Recovery', amount: 0 },
      { particular: 'Total Business', amount: 340322.30, highlight: 'blue' },
      { particular: 'Swipe', amount: 162789.00 },
      { particular: 'Lubs Credit', amount: 0 },
      { particular: 'Credit', amount: 0 },
      { particular: 'Expenses', amount: 1000.00 },
      { particular: 'Shortage', amount: 6.7 },
      { particular: 'Cash in Hand', amount: 176540.00, highlight: 'purple' }
    ],
    swipeDetails: [
      { name: 'QR PAYTM', amount: 116563.00 },
      { name: 'PHONE PE', amount: 46226.00 }
    ],
    handover: {
      openingCash: 90680.00,
      daySettlement: 176540.00,
      totalSettlement: 267220.00,
      handed: [
        { mode: 'OWNER', desc: 'TO HOME VINIT POOJA ME LIYA', cash: 2000.00 },
        { mode: 'OWNER', desc: 'TO HOME VINIT', cash: 205000.00 }
      ],
      totalHanded: 207000.00,
      closingCash: 60220.00
    }
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    alert('Export functionality will be implemented soon');
  };

  const data = reportData || getMockData();

  // Show Employee Sheet Report when selected - Opens in new tab
  if (reportType === 'employeeSheet') {
    const employeeSheetData = {
      employee: selectedEmployee ? availableEmployees.find(e => e.value === selectedEmployee)?.label : 'UMESH KUMAR SEN',
      liquidSales: [
        { slNo: 1, empName: 'UMESH KUMAR SEN', nozzle: 'HSD-P1-1ST A2', product: 'DIESEL', oReading: 706536.37, cReading: 707413.63, testing: 0, litreSales: 877.26, price: 93.43, amount: 81962.40 },
        { slNo: 2, empName: 'UMESH KUMAR SEN', nozzle: 'HSD-P1-1ST B2', product: 'DIESEL', oReading: 996981.87, cReading: 998139.13, testing: 0, litreSales: 1157.26, price: 93.43, amount: 108122.80 }
      ],
      swipeSales: [
        { slNo: 1, empName: 'UMESH KUMAR SEN', swipe: 'CASH EXCHNG DIRECT BNK TRNSFR -> INDIAN BANK CC', note: 'NEERAJ', amount: 10000 },
        { slNo: 2, empName: 'UMESH KUMAR SEN', swipe: 'CASH EXCHNG DIRECT BNK TRNSFR -> INDIAN BANK CC', note: 'DEEPAK PUMP', amount: 7415 },
        { slNo: 3, empName: 'UMESH KUMAR SEN', swipe: 'PHONE PE -> INDIAN BANK CC', note: '', amount: 35042 },
        { slNo: 4, empName: 'UMESH KUMAR SEN', swipe: 'QR PAYTM -> INDIAN BANK CC', note: '', amount: 59376 }
      ],
      expenses: [
        { slNo: 1, empName: 'UMESH KUMAR SEN', expense: 'DG SET', category: 'OUTFLOW', narration: 'DIESEL', amount: 468 }
      ],
      cashCollections: [
        { slNo: 1, empName: 'UMESH KUMAR SEN', shift: 'S-1', collection: 180090 },
        { slNo: 2, empName: 'UMESH KUMAR SEN', shift: 'S-1', collection: 9645 }
      ],
      employeeSummary: {
        sale: 302034.73,
        lubSale: 0,
        crdRecovery: 0,
        cashIn: 0,
        swipe: 111833,
        credit: 0,
        expense: 468,
        saleDisc: 0,
        empCashRecovery: 189735,
        shortage: -1.27
      },
      denominations: [
        { value: 500, count: 281, amount: 140500, color: '#22c55e' },
        { value: 200, count: 97, amount: 19400, color: '#f97316' },
        { value: 100, count: 201, amount: 20100, color: '#22c55e' },
        { value: 10, count: 8, amount: 80, color: '#f97316' },
        { value: 5, count: 2, amount: 10, color: '#f97316' }
      ],
      denominationTotal: 180090
    };

    // Open report in new tab
    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Employee Sheet Report - ${employeeSheetData.employee}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 20px; }
          .container { max-width: 1200px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #000; padding: 15px; margin-bottom: 20px; }
          .header h1 { font-size: 14px; font-weight: bold; }
          .header p { font-size: 10px; margin: 2px 0; }
          .section-title { text-align: center; font-weight: bold; font-size: 11px; margin: 15px 0 10px; background: #f3f4f6; padding: 8px; border: 1px solid #d1d5db; }
          table { width: 100%; border-collapse: collapse; font-size: 9px; margin-bottom: 20px; }
          th, td { border: 1px solid #d1d5db; padding: 6px; }
          th { background: #f3f4f6; font-weight: bold; text-align: left; }
          .text-right { text-align: right !important; }
          .total-row { background: #e9d5ff; font-weight: bold; }
          .print-btn { background: #16a34a; color: white; border: none; padding: 10px 20px; cursor: pointer; margin-bottom: 20px; border-radius: 4px; }
          @media print { .print-btn { display: none; } }
        </style>
      </head>
      <body>
        <div class="container">
          <button class="print-btn" onclick="window.print()">Print Report</button>
          
          <div class="header">
            <h1>${orgDetails.firmName || 'MS SHREE HARSH VALLABH FUELS'}</h1>
            <p>${orgDetails.address || 'VILLAGE DELAURA SAJJANPUR BYPASS'}</p>
            <p>${orgDetails.city || 'SATNA MP'}</p>
            <p>${orgDetails.gstNo || '23AJAPD5363NIZA'}</p>
            <p>${orgDetails.contactNo || '9981440655'}</p>
          </div>

          <div class="section-title">Liquid Sales</div>
          <p style="font-size: 10px; margin-bottom: 10px;">Date: ${format(selectedDate, 'dd-MM-yyyy')} | Employee: ${employeeSheetData.employee}</p>
          <h2 style="text-align: center; font-size: 13px; font-weight: bold; margin-bottom: 15px;">Employee Day Business Report</h2>

          <table>
            <thead>
              <tr>
                <th>Sl.No</th><th>Emp Name</th><th>Nozzle Name</th><th>Product</th>
                <th class="text-right">O-Reading</th><th class="text-right">C-Reading</th><th class="text-right">Testing</th>
                <th class="text-right">Litre Sales</th><th class="text-right">Price</th><th class="text-right">S.Amount</th>
              </tr>
            </thead>
            <tbody>
              ${employeeSheetData.liquidSales.map(sale => `
                <tr>
                  <td>${sale.slNo}</td>
                  <td>${sale.empName}</td>
                  <td>${sale.nozzle}</td>
                  <td>${sale.product}</td>
                  <td class="text-right">${sale.oReading.toFixed(2)}</td>
                  <td class="text-right">${sale.cReading.toFixed(2)}</td>
                  <td class="text-right">${sale.testing.toFixed(2)}</td>
                  <td class="text-right">${sale.litreSales.toFixed(2)}</td>
                  <td class="text-right">${sale.price.toFixed(2)}</td>
                  <td class="text-right">${sale.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="9" style="text-align: center;">TOTAL SALES</td>
                <td class="text-right">${employeeSheetData.liquidSales.reduce((s, l) => s + l.amount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>

          <div class="section-title">SwipeMode Sales</div>
          <table>
            <thead>
              <tr><th>Sl.No</th><th>Emp Name</th><th>Swipe</th><th>Note</th><th class="text-right">Card Amount</th></tr>
            </thead>
            <tbody>
              ${employeeSheetData.swipeSales.map(swipe => `
                <tr>
                  <td>${swipe.slNo}</td>
                  <td>${swipe.empName}</td>
                  <td>${swipe.swipe}</td>
                  <td>${swipe.note}</td>
                  <td class="text-right">${swipe.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="4">TOTAL CARD SALES</td>
                <td class="text-right">${employeeSheetData.swipeSales.reduce((s, sw) => s + sw.amount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>

          <div class="section-title">Expenses</div>
          <table>
            <thead>
              <tr><th>Sl.No</th><th>Emp Name</th><th>Expense</th><th>Category</th><th>Narration</th><th class="text-right">Expense Amount</th></tr>
            </thead>
            <tbody>
              ${employeeSheetData.expenses.map(exp => `
                <tr>
                  <td>${exp.slNo}</td>
                  <td>${exp.empName}</td>
                  <td>${exp.expense}</td>
                  <td>${exp.category}</td>
                  <td>${exp.narration}</td>
                  <td class="text-right">${exp.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="5">TOTAL OUTFLOW: ${employeeSheetData.expenses.reduce((s, e) => s + e.amount, 0).toFixed(2)} INFLOW: 0</td>
                <td class="text-right">${employeeSheetData.expenses.reduce((s, e) => s + e.amount, 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="section-title">Cash Collections</div>
          <table>
            <thead>
              <tr><th>Sl.No</th><th>Emp Name</th><th>Shift</th><th class="text-right">Collection</th></tr>
            </thead>
            <tbody>
              ${employeeSheetData.cashCollections.map(coll => `
                <tr>
                  <td>${coll.slNo}</td>
                  <td>${coll.empName}</td>
                  <td>${coll.shift}</td>
                  <td class="text-right">${coll.collection.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="3">TOTAL AMOUNT</td>
                <td class="text-right">${employeeSheetData.cashCollections.reduce((s, c) => s + c.collection, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>

          <div class="section-title">Employee Shortage</div>
          <table>
            <thead>
              <tr>
                <th>Sl.No</th><th>Emp Name</th><th class="text-right">Sale</th><th class="text-right">LubSale</th>
                <th class="text-right">Crd.Recovery</th><th class="text-right">Cash In</th><th class="text-right">Swipe</th>
                <th class="text-right">Credit</th><th class="text-right">Expense</th><th class="text-right">Sale Discount</th>
                <th class="text-right">Emp.CashRecovery</th><th class="text-right">Shortage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>${employeeSheetData.employee}</td>
                <td class="text-right">${employeeSheetData.employeeSummary.sale.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td class="text-right">${employeeSheetData.employeeSummary.lubSale.toFixed(2)}</td>
                <td class="text-right">${employeeSheetData.employeeSummary.crdRecovery.toFixed(2)}</td>
                <td class="text-right">${employeeSheetData.employeeSummary.cashIn.toFixed(2)}</td>
                <td class="text-right">${employeeSheetData.employeeSummary.swipe.toLocaleString('en-IN')}</td>
                <td class="text-right">${employeeSheetData.employeeSummary.credit.toFixed(2)}</td>
                <td class="text-right">${employeeSheetData.employeeSummary.expense.toFixed(2)}</td>
                <td class="text-right">${employeeSheetData.employeeSummary.saleDisc.toFixed(2)}</td>
                <td class="text-right">${employeeSheetData.employeeSummary.empCashRecovery.toLocaleString('en-IN')}</td>
                <td class="text-right">${employeeSheetData.employeeSummary.shortage.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="2">TOTAL</td>
                <td class="text-right">${employeeSheetData.employeeSummary.sale.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td class="text-right">${employeeSheetData.employeeSummary.lubSale.toFixed(2)}</td>
                <td class="text-right">${employeeSheetData.employeeSummary.crdRecovery.toFixed(2)}</td>
                <td class="text-right">${employeeSheetData.employeeSummary.cashIn.toFixed(2)}</td>
                <td class="text-right">${employeeSheetData.employeeSummary.swipe.toLocaleString('en-IN')}</td>
                <td class="text-right">${employeeSheetData.employeeSummary.credit.toFixed(2)}</td>
                <td class="text-right">${employeeSheetData.employeeSummary.expense.toFixed(2)}</td>
                <td class="text-right">${employeeSheetData.employeeSummary.saleDisc.toFixed(2)}</td>
                <td class="text-right">${employeeSheetData.employeeSummary.empCashRecovery.toLocaleString('en-IN')}</td>
                <td class="text-right">${employeeSheetData.employeeSummary.shortage.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 50px; border-top: 1px solid #000; padding-top: 20px; text-align: right;">
            <p style="font-size: 12px;">Signature of Employee: ___________________</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Open in new tab
    const newTab = window.open('', '_blank');
    newTab.document.write(reportHTML);
    newTab.document.close();
    
    // Return to selection after opening
    setTimeout(() => setReportType('summary'), 100);
    
    return null;
  }

  // Show Day Business Report - Opens in new tab
  if (reportType === 'dayBusiness') {
    const dayBusinessData = {
      products: {
        petrol: { tank: 'PETROL 15KL 1 PETROL', nozzles: [
          { name: '1ST A1', closing: 15412.54, opening: 15412.54, sale: 0 },
          { name: '1ST B1', closing: 7877.47, opening: 7877.47, sale: 0 },
          { name: '2ND A1', closing: 689736.93, opening: 688832.02, sale: 904.91 },
          { name: '2ND B1', closing: 171009.33, opening: 170830.47, sale: 178.86 }
        ], total: 1083.77 },
        diesel: { tank: 'DIESEL 20KL 1 DIESEL', nozzles: [
          { name: '1ST A2', closing: 709390.63, opening: 708106.00, sale: 1284.63 },
          { name: '1ST B2', closing: 1001955.09, opening: 999651.34, sale: 2303.75 },
          { name: '2ND A2', closing: 21237.28, opening: 21237.28, sale: 0 },
          { name: '2ND B2', closing: 8155.44, opening: 8155.44, sale: 0 }
        ], total: 3588.38 },
        cng: { tank: 'CNG 600KG CNG', nozzles: [
          { name: 'A', closing: 15166.15, opening: 15117.87, sale: 48.28 },
          { name: 'B', closing: 30743.36, opening: 30584.29, sale: 159.07 }
        ], total: 207.35 }
      },
      salesSummary: [
        { product: 'MS', actualSale: 1083.77, testing: 0, netSale: 1083.77, amt: 117079.68 },
        { product: 'HSD', actualSale: 3588.38, testing: 0, netSale: 3588.38, amt: 335262.35 },
        { product: 'CNG', actualSale: 207.35, testing: 0, netSale: 207.35, amt: 19490.90 },
        { product: 'LUBES', actualSale: 0, testing: 0, netSale: 0, amt: 20.00 }
      ]
    };

    const reportHTML = `<!DOCTYPE html><html><head><title>Day Business Report</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:15px;font-size:10px}.header{text-align:center;border-bottom:2px solid #000;padding:10px;margin-bottom:15px}.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:15px 0}.prod-box{border:2px solid #333;padding:8px}table{width:100%;border-collapse:collapse;margin:10px 0;font-size:9px}th,td{border:1px solid #ccc;padding:4px}th{background:#f0f0f0;font-weight:bold}.text-right{text-align:right!important}.total-row{background:#e9d5ff;font-weight:bold}@media print{button{display:none}}</style></head><body><button onclick="window.print()" style="background:#16a34a;color:white;border:none;padding:8px 16px;cursor:pointer;margin-bottom:15px;border-radius:4px">Print</button><div class="header"><h1 style="font-size:13px">${orgDetails.firmName||'MS SHREE HARSH VALLABH FUELS'}</h1><p>${orgDetails.address||'VILLAGE DELAURA SAJJANPUR BYPASS'}</p><p>${orgDetails.city||'SATNA MP'}</p><p>${orgDetails.gstNo||'23AJAPD5363NIZA'}</p><p>${orgDetails.contactNo||'9981440655'}</p></div><p style="text-align:center;font-weight:bold;margin:10px 0">Date: ${format(selectedDate,'dd-MM-yyyy')}</p><h2 style="text-align:center;font-size:12px;font-weight:bold;margin-bottom:15px">Bunk Day Report</h2><div class="grid-3">${Object.values(dayBusinessData.products).map(p=>`<div class="prod-box"><div style="font-weight:bold;font-size:9px;margin-bottom:5px">${p.tank}</div><table style="font-size:8px"><tr><th></th>${p.nozzles.map(n=>`<th class="text-right">${n.name}</th>`).join('')}</tr><tr><td>CLOSING</td>${p.nozzles.map(n=>`<td class="text-right">${n.closing.toFixed(2)}</td>`).join('')}</tr><tr><td>OPENING</td>${p.nozzles.map(n=>`<td class="text-right">${n.opening.toFixed(2)}</td>`).join('')}</tr><tr><td>SALE</td>${p.nozzles.map(n=>`<td class="text-right">${n.sale.toFixed(2)}</td>`).join('')}</tr><tr class="total-row"><td>Total</td><td class="text-right" colspan="${p.nozzles.length}">${p.total.toFixed(2)}</td></tr></table></div>`).join('')}</div><table><thead><tr><th>Product</th><th class="text-right">Actual Sale</th><th class="text-right">Testing</th><th class="text-right">Net Sale</th><th class="text-right">Amt</th></tr></thead><tbody>${dayBusinessData.salesSummary.map(s=>`<tr><td>${s.product}</td><td class="text-right">${s.actualSale.toFixed(2)}</td><td class="text-right">${s.testing.toFixed(2)}</td><td class="text-right">${s.netSale.toFixed(2)}</td><td class="text-right">${s.amt.toLocaleString('en-IN',{minimumFractionDigits:2})}</td></tr>`).join('')}<tr class="total-row"><td colspan="4">Total Sale Amount</td><td class="text-right">${dayBusinessData.salesSummary.reduce((sum,s)=>sum+s.amt,0).toLocaleString('en-IN',{minimumFractionDigits:2})}</td></tr></tbody></table></body></html>`;

    const newTab = window.open('', '_blank');
    newTab.document.write(reportHTML);
    newTab.document.close();
    setTimeout(() => setReportType('summary'), 100);
    return null;
  }

  // Show Day Sheet Report when selected
  if (reportType === 'daySheet') {
    const daySheetData = {
      liquidSales: [
        { slNo: 1, empName: 'RAVENDRA SINGH CHAUD', nozzle: 'HSD-P1-1ST A2', product: 'DIESEL', oReading: 705377.37, cReading: 706264.94, testing: 0, litreSales: 887.64, price: 93.43, amount: 82932.21 },
        { slNo: 2, empName: 'RAJENDRA DWIVEDI JI', nozzle: 'HSD-P1-1ST A2', product: 'DIESEL', oReading: 706264.94, cReading: 706536.37, testing: 0, litreSales: 271.43, price: 93.43, amount: 25359.70 },
        { slNo: 3, empName: 'RAJENDRA DWIVEDI JI', nozzle: 'HSD-P1-1ST B2', product: 'DIESEL', oReading: 996071.13, cReading: 996981.87, testing: 0, litreSales: 910.74, price: 93.43, amount: 85090.44 },
        { slNo: 4, empName: 'RAVENDRA SINGH CHAUD', nozzle: 'HSD-P1-1ST B2', product: 'DIESEL', oReading: 995361.09, cReading: 996071.13, testing: 0, litreSales: 710.04, price: 93.43, amount: 66339.04 }
      ],
      lubSales: [
        { slNo: 1, empName: 'RAVENDRA SINGH CHAUD', lubName: 'MK 2T 20ML', sales: 5, price: 10, batta: 0, discount: 0, amount: 50 }
      ],
      tankSummary: [
        { slNo: 1, product: 'MS', tank: 'T1-15KL', openStock: 6005.40, receipt: 0, totalStock: 6005.4, meterSales: 1118.38, closingStock: 4906.19, value: 120818.59, variationLtr: 19.17, variationRs: 2070.94, rateRevision: 0 },
        { slNo: 2, product: 'HSD', tank: 'T2-20KL', openStock: 13484.50, receipt: 0, totalStock: 13484.5, meterSales: 2779.85, closingStock: 10660.10, value: 259721.39, variationLtr: -44.55, variationRs: -4162.31, rateRevision: 0 },
        { slNo: 3, product: 'CNG', tank: 'T3-600KG', openStock: 0, receipt: 0, totalStock: 0, meterSales: 144.90, closingStock: 0, value: 13620.60, variationLtr: 0, variationRs: 0, rateRevision: 0 }
      ],
      swipeSales: [
        { slNo: 1, empName: 'RAVENDRA SINGH CHAUD', swipe: 'PHONE PE -> INDIAN BANK CC', amount: 44205, note: '' },
        { slNo: 2, empName: 'RAJENDRA DWIVEDI JI', swipe: 'PHONE PE -> INDIAN BANK CC', amount: 10566, note: '' },
        { slNo: 3, empName: 'RAJENDRA DWIVEDI JI', swipe: 'QR PAYTM -> INDIAN BANK CC', amount: 33772, note: '' },
        { slNo: 4, empName: 'RAVENDRA SINGH CHAUD', swipe: 'QR PAYTM -> INDIAN BANK CC', amount: 33759, note: '' }
      ],
      expenses: [
        { slNo: 1, empName: 'RAJENDRA DWIVEDI JI', expense: 'SALARY -> AMAR TIWARI', cashFlow: 'OUTFLOW', narration: 'PETROL', amount: 300 },
        { slNo: 2, empName: 'RAJENDRA DWIVEDI JI', expense: 'ADVANCE -> AMAR TIWARI', cashFlow: 'OUTFLOW', narration: 'SHORT', amount: 235 },
        { slNo: 3, empName: 'RAJENDRA DWIVEDI JI', expense: 'ADVANCE -> RAJENDRA DWIVEDI JI', cashFlow: 'OUTFLOW', narration: 'SHORT', amount: 236.51 },
        { slNo: 4, empName: 'RAVENDRA SINGH CHAUD', expense: 'ADVANCE -> ANOOP KUMAR', cashFlow: 'OUTFLOW', narration: '', amount: 5000 },
        { slNo: 5, empName: 'RAVENDRA SINGH CHAUD', expense: 'TANKER DRIVER 9655', cashFlow: 'OUTFLOW', narration: 'DEEPAK SE TRANSFER', amount: 5000 }
      ],
      cashCollections: [
        { slNo: 1, empName: 'RAJENDRA DWIVEDI JI', shift: 'S-2', collection: 100165 },
        { slNo: 2, empName: 'RAJENDRA DWIVEDI JI', shift: 'S-2', collection: 30 },
        { slNo: 3, empName: 'RAVENDRA SINGH CHAUD', shift: 'S-1', collection: 60000 },
        { slNo: 4, empName: 'RAVENDRA SINGH CHAUD', shift: 'S-1', collection: 91270 },
        { slNo: 5, empName: 'RAVENDRA SINGH CHAUD', shift: 'S-1', collection: 8580 }
      ],
      employeeSummary: [
        { slNo: 1, empName: 'RAJENDRA DWIVEDI JI', sale: 145304.51, lubSale: 0, crdRecovery: 0, cashIn: 0, swipe: 44338, credit: 0, expense: 771.51, saleDisc: 0, empCashRecovery: 100195, shortage: 0 },
        { slNo: 2, empName: 'RAVENDRA SINGH CHAUD', sale: 248856.07, lubSale: 50, crdRecovery: 0, cashIn: 0, swipe: 77964, credit: 0, expense: 11100, saleDisc: 0, empCashRecovery: 159850, shortage: -7.93 }
      ],
      handover: {
        openingCash: 117360,
        daySettlement: 260045,
        totalSettlement: 377405,
        handed: [
          { mode: 'OWNER', desc: 'TO HOME VINIT LE GYA THA', cash: 300 },
          { mode: 'OWNER', desc: 'TO HOME VINIT', cash: 272700 }
        ],
        totalHanded: 273000,
        closingCash: 104405
      }
    };

    return (
      <div className="min-h-screen bg-white p-6 print:p-2">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Back Button */}
          <div className="flex justify-between items-center mb-4 print:hidden">
            <Button variant="outline" onClick={() => setReportType('summary')}>
              ← Back to Selection
            </Button>
            <div className="flex gap-2">
              <Button size="sm" onClick={handlePrint} className="bg-green-600 text-white hover:bg-green-700">
                <Printer className="w-4 h-4 mr-1" />Print
              </Button>
            </div>
          </div>

          {/* Report */}
          <div className="border-2 border-black">
            {/* Header */}
            <div className="border-b-2 border-black p-3 text-center">
              <h1 className="text-sm font-bold">{orgDetails.firmName || 'MS SHREE HARSH VALLABH FUELS'}</h1>
              <p className="text-[10px]">{orgDetails.address || 'VILLAGE DELAURA SAJJANPUR BYPASS'}</p>
              <p className="text-[10px]">{orgDetails.city || 'SATNA MP'}</p>
              <p className="text-[10px] font-semibold">{orgDetails.gstNo || '23AJAPD5363NIZA'}</p>
              <p className="text-[10px]">{orgDetails.contactNo || '9981440655'}</p>
            </div>

            {/* Title Section */}
            <div className="border-b border-black px-3 py-2">
              <h2 className="text-center text-sm font-bold">Liquid Sales</h2>
              <div className="flex justify-between items-center mt-1">
                <div className="text-[10px]">Date: {format(selectedDate, 'dd-MM-yyyy')}</div>
                <div className="text-sm font-bold">Day Sheet</div>
                <div className="w-24"></div>
              </div>
            </div>

            {/* Liquid Sales Table */}
            <div className="border-b border-black px-3 py-2">
              <table className="w-full text-[9px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-400 bg-gray-50">
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Sl.No</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Emp Name</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Nozzle Name</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Product</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">O-Reading</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">C-Reading</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Testing</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Litre Sales</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Price</th>
                    <th className="px-1 py-1 text-right font-semibold">S.Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {daySheetData.liquidSales.map((sale) => (
                    <tr key={sale.slNo} className="border-b border-gray-200">
                      <td className="border-r border-gray-300 px-1 py-0.5">{sale.slNo}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5">{sale.empName}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5">{sale.nozzle}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5">{sale.product}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{sale.oReading.toFixed(2)}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{sale.cReading.toFixed(2)}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{sale.testing.toFixed(2)}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{sale.litreSales.toFixed(2)}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{sale.price.toFixed(2)}</td>
                      <td className="px-1 py-0.5 text-right">{sale.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Lubricant Sales */}
            <div className="border-b border-black px-3 py-2">
              <h3 className="text-center text-xs font-bold mb-2">Lubricant Sales</h3>
              <table className="w-full text-[9px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-400 bg-gray-50">
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Sl.No</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Emp Name</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Lub Name</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Sales</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Price</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Batta</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Discount</th>
                    <th className="px-1 py-1 text-right font-semibold">Sales Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {daySheetData.lubSales.map((lub) => (
                    <tr key={lub.slNo} className="border-b border-gray-200">
                      <td className="border-r border-gray-300 px-1 py-0.5">{lub.slNo}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5">{lub.empName}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5">{lub.lubName}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{lub.sales.toFixed(2)}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{lub.price.toFixed(2)}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{lub.batta.toFixed(2)}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{lub.discount.toFixed(2)}</td>
                      <td className="px-1 py-0.5 text-right">{lub.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-purple-50 font-semibold border-t border-gray-400">
                    <td className="px-1 py-0.5" colSpan="7">TOTAL SALES</td>
                    <td className="px-1 py-0.5 text-right">{daySheetData.lubSales.reduce((sum, l) => sum + l.amount, 0).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tank Wise Sales Summary */}
            <div className="border-b border-black px-3 py-2">
              <h3 className="text-center text-xs font-bold mb-2">Tank Wise Sales</h3>
              <table className="w-full text-[9px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-400 bg-gray-50">
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Sl.No</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Product</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Tank</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Open Stock</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Receipt</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Total Stock</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Meter Sales</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Closing Stock</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Value</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Vari(Ltr.)</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Vari(Rs/-)</th>
                    <th className="px-1 py-1 text-right font-semibold">Rate Revision</th>
                  </tr>
                </thead>
                <tbody>
                  {daySheetData.tankSummary.map((tank) => (
                    <tr key={tank.slNo} className="border-b border-gray-200">
                      <td className="border-r border-gray-300 px-1 py-0.5">{tank.slNo}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5">{tank.product}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5">{tank.tank}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{tank.openStock.toFixed(2)}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{tank.receipt}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{tank.totalStock.toFixed(2)}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{tank.meterSales.toFixed(2)}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{tank.closingStock.toFixed(2)}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{tank.value.toFixed(2)}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{tank.variationLtr.toFixed(2)}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{tank.variationRs.toFixed(2)}</td>
                      <td className="px-1 py-0.5 text-right">{tank.rateRevision.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-purple-50 font-semibold border-t border-gray-400">
                    <td className="px-1 py-0.5" colSpan="8">TOTAL</td>
                    <td className="border-r border-gray-300 px-1 py-0.5 text-right">{daySheetData.tankSummary.reduce((s, t) => s + t.value, 0).toFixed(2)}</td>
                    <td className="border-r border-gray-300 px-1 py-0.5 text-right" colSpan="2">{daySheetData.tankSummary.reduce((s, t) => s + t.variationRs, 0).toFixed(2)}</td>
                    <td className="px-1 py-0.5 text-right">0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Swipe Sales */}
            <div className="border-b border-black px-3 py-2">
              <h3 className="text-center text-xs font-bold mb-2">SwipeMode Sales</h3>
              <table className="w-full text-[9px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-400 bg-gray-50">
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Sl.No</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Emp Name</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Swipe</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Card Amount</th>
                    <th className="px-1 py-1 text-left font-semibold">Note</th>
                  </tr>
                </thead>
                <tbody>
                 {daySheetData.swipeSales.map((swipe) => (
                    <tr key={swipe.slNo} className="border-b border-gray-200">
                      <td className="border-r border-gray-300 px-1 py-0.5">{swipe.slNo}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5">{swipe.empName}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5">{swipe.swipe}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{swipe.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="px-1 py-0.5">{swipe.note}</td>
                    </tr>
                  ))}
                  <tr className="bg-purple-50 font-semibold border-t border-gray-400">
                    <td className="px-1 py-0.5" colSpan="3">TOTAL CARD SALES</td>
                    <td className="border-r border-gray-300 px-1 py-0.5 text-right">{daySheetData.swipeSales.reduce((s, sw) => s + sw.amount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="px-1 py-0.5"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Expenses */}
            <div className="border-b border-black px-3 py-2">
              <h3 className="text-center text-xs font-bold mb-2">Expenses</h3>
              <table className="w-full text-[9px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-400 bg-gray-50">
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Sl.No</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Emp Name</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Expense</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">CashFlow</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Narration</th>
                    <th className="px-1 py-1 text-right font-semibold">Expense Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {daySheetData.expenses.map((exp) => (
                    <tr key={exp.slNo} className="border-b border-gray-200">
                      <td className="border-r border-gray-300 px-1 py-0.5">{exp.slNo}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5">{exp.empName}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5">{exp.expense}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5">{exp.cashFlow}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5">{exp.narration}</td>
                      <td className="px-1 py-0.5 text-right">{exp.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-purple-50 font-semibold border-t border-gray-400">
                    <td className="px-1 py-0.5" colSpan="5">TOTAL OUTFLOW : {daySheetData.expenses.reduce((s, e) => s + e.amount, 0).toFixed(2)} INFLOW : 0</td>
                    <td className="px-1 py-0.5 text-right"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Cash Collections */}
            <div className="border-b border-black px-3 py-2">
              <h3 className="text-center text-xs font-bold mb-2">Cash Collections</h3>
              <table className="w-full text-[9px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-400 bg-gray-50">
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Sl.No</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Emp Name</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Shift</th>
                    <th className="px-1 py-1 text-right font-semibold">Collection</th>
                  </tr>
                </thead>
                <tbody>
                  {daySheetData.cashCollections.map((coll) => (
                    <tr key={coll.slNo} className="border-b border-gray-200">
                      <td className="border-r border-gray-300 px-1 py-0.5">{coll.slNo}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5">{coll.empName}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5">{coll.shift}</td>
                      <td className="px-1 py-0.5 text-right">{coll.collection.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                  <tr className="bg-purple-50 font-semibold border-t border-gray-400">
                    <td className="px-1 py-0.5" colSpan="3">TOTAL AMOUNT</td>
                    <td className="px-1 py-0.5 text-right">{daySheetData.cashCollections.reduce((s, c) => s + c.collection, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Employee Summary */}
            <div className="border-b border-black px-3 py-2">
              <h3 className="text-center text-xs font-bold mb-2">Employee Transactions Summary</h3>
              <p className="text-[8px] text-center mb-2">Total Shortage = ( Sale + LubSale + Crd.Recovery + Cash In ) - ( Swipe + Credit + Expense + Sale Disc. + Emp.CashRecovery )</p>
              <table className="w-full text-[9px] border-collapse">
                <thead>
                  <tr className="border-b border-gray-400 bg-gray-50">
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Sl.No</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-left font-semibold">Emp Name</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Sale</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">LubSale</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Crd.Recovery</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Cash In</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Swipe</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Credit</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Expense</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Sale Discount</th>
                    <th className="border-r border-gray-300 px-1 py-1 text-right font-semibold">Emp.CashRecovery</th>
                    <th className="px-1 py-1 text-right font-semibold">Shortage</th>
                  </tr>
                </thead>
                <tbody>
                  {daySheetData.employeeSummary.map((emp) => (
                    <tr key={emp.slNo} className="border-b border-gray-200">
                      <td className="border-r border-gray-300 px-1 py-0.5">{emp.slNo}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5">{emp.empName}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{emp.sale.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{emp.lubSale.toFixed(2)}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{emp.crdRecovery.toFixed(2)}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{emp.cashIn.toFixed(2)}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{emp.swipe.toLocaleString('en-IN')}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{emp.credit.toFixed(2)}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{emp.expense.toFixed(2)}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{emp.saleDisc.toFixed(2)}</td>
                      <td className="border-r border-gray-300 px-1 py-0.5 text-right">{emp.empCashRecovery.toLocaleString('en-IN')}</td>
                      <td className="px-1 py-0.5 text-right">{emp.shortage.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-purple-50 font-semibold border-t border-gray-400">
                    <td className="px-1 py-0.5" colSpan="2">TOTAL</td>
                    <td className="border-r border-gray-300 px-1 py-0.5 text-right">{daySheetData.employeeSummary.reduce((s, e) => s + e.sale, 0).toFixed(2)}</td>
                    <td className="border-r border-gray-300 px-1 py-0.5 text-right">{daySheetData.employeeSummary.reduce((s, e) => s + e.lubSale, 0).toFixed(2)}</td>
                    <td className="border-r border-gray-300 px-1 py-0.5 text-right">{daySheetData.employeeSummary.reduce((s, e) => s + e.crdRecovery, 0).toFixed(2)}</td>
                    <td className="border-r border-gray-300 px-1 py-0.5 text-right">{daySheetData.employeeSummary.reduce((s, e) => s + e.cashIn, 0).toFixed(2)}</td>
                    <td className="border-r border-gray-300 px-1 py-0.5 text-right">{daySheetData.employeeSummary.reduce((s, e) => s + e.swipe, 0).toLocaleString('en-IN')}</td>
                    <td className="border-r border-gray-300 px-1 py-0.5 text-right">{daySheetData.employeeSummary.reduce((s, e) => s + e.credit, 0).toFixed(2)}</td>
                    <td className="border-r border-gray-300 px-1 py-0.5 text-right">{daySheetData.employeeSummary.reduce((s, e) => s + e.expense, 0).toFixed(2)}</td>
                    <td className="border-r border-gray-300 px-1 py-0.5 text-right">{daySheetData.employeeSummary.reduce((s, e) => s + e.saleDisc, 0).toFixed(2)}</td>
                    <td className="border-r border-gray-300 px-1 py-0.5 text-right">{daySheetData.employeeSummary.reduce((s, e) => s + e.empCashRecovery, 0).toLocaleString('en-IN')}</td>
                    <td className="px-1 py-0.5 text-right">{daySheetData.employeeSummary.reduce((s, e) => s + e.shortage, 0).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Net Cash In-Hand - Two Column Layout */}
            <div className="px-3 py-2">
              <h3 className="text-center text-xs font-bold mb-3 bg-purple-100 py-1.5 border-y-2 border-gray-400">Net Cash In-Hand</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Left Column - Business Summary */}
                <div>
                  <table className="w-full text-[9px] border-collapse border-2 border-gray-300">
                    <thead>
                      <tr className="bg-purple-100 border-b-2 border-gray-400">
                        <th className="border-r border-gray-300 px-2 py-1 text-left font-semibold">Particulars</th>
                        <th className="px-2 py-1 text-right font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="border-r border-gray-300 px-2 py-1">SALE CASH</td>
                        <td className="px-2 py-1 text-right">3,94,160.58</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="border-r border-gray-300 px-2 py-1">LUBS SALE CASH</td>
                        <td className="px-2 py-1 text-right">50.00</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="border-r border-gray-300 px-2 py-1">CASH IN</td>
                        <td className="px-2 py-1 text-right">0.00</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="border-r border-gray-300 px-2 py-1">CASH RECOVERY</td>
                        <td className="px-2 py-1 text-right">0.00</td>
                      </tr>
                      <tr className="bg-purple-100 font-semibold border-b-2 border-gray-400">
                        <td className="border-r border-gray-300 px-2 py-1">TOTAL BUSINESS</td>
                        <td className="px-2 py-1 text-right">3,94,210.58</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="border-r border-gray-300 px-2 py-1">SWIPE</td>
                        <td className="px-2 py-1 text-right">1,22,302.00</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="border-r border-gray-300 px-2 py-1">LUBS CREDIT</td>
                        <td className="px-2 py-1 text-right">0.00</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="border-r border-gray-300 px-2 py-1">CREDIT</td>
                        <td className="px-2 py-1 text-right">0.00</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="border-r border-gray-300 px-2 py-1">EXPENSES</td>
                        <td className="px-2 py-1 text-right">11,871.51</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="border-r border-gray-300 px-2 py-1">SHORTAGE</td>
                        <td className="px-2 py-1 text-right">+7.93</td>
                      </tr>
                      <tr className="bg-purple-600 text-white font-bold">
                        <td className="border-r border-white px-2 py-1">CashIn Hand</td>
                        <td className="px-2 py-1 text-right">2,60,045.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Right Column - Settlement */}
                <div>
                  <table className="w-full text-[9px] border-collapse border-2 border-gray-300">
                    <thead>
                      <tr className="bg-purple-100 border-b-2 border-gray-400">
                        <th className="border-r border-gray-300 px-2 py-1 text-left font-semibold">OPENING HANDCASH</th>
                        <th className="border-r border-gray-300 px-2 py-1 text-right font-semibold">1,17,360.00</th>
                        <th className="border-r border-gray-300 px-2 py-1 text-left font-semibold">DAY SETTLEMENT</th>
                        <th className="border-r border-gray-300 px-2 py-1 text-right font-semibold">2,60,045.00</th>
                        <th className="px-2 py-1 text-right font-semibold">3,77,405.00</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="border-r border-gray-300 px-2 py-1 text-left font-semibold">Mode</th>
                        <th className="border-r border-gray-300 px-2 py-1 text-left font-semibold" colSpan="2">Handed Cash</th>
                        <th className="px-2 py-1" colSpan="2"></th>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="border-r border-gray-300 px-2 py-1">OWNER</td>
                        <td className="border-r border-gray-300 px-2 py-1" colSpan="2">TO HOME</td>
                        <td className="border-r border-gray-300 px-2 py-1 text-[8px]">VINIT LE GYA THA 02/11/2025 KO ADD NHI KIYA THA</td>
                        <td className="px-2 py-1 text-right">300.00</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="border-r border-gray-300 px-2 py-1">OWNER</td>
                        <td className="border-r border-gray-300 px-2 py-1" colSpan="2">TO HOME</td>
                        <td className="border-r border-gray-300 px-2 py-1">VINIT</td>
                        <td className="px-2 py-1 text-right">2,72,700.00</td>
                      </tr>
                      <tr className="bg-purple-100 font-semibold border-b border-gray-400">
                        <td className="px-2 py-1" colSpan="4">TOTAL HANDED</td>
                        <td className="px-2 py-1 text-right">2,73,000.00</td>
                      </tr>
                      <tr className="bg-purple-600 text-white font-bold">
                        <td className="px-2 py-1" colSpan="4">DAY CLOSING BAL. CASH</td>
                        <td className="px-2 py-1 text-right">1,04,405.00</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1" colSpan="5">NOTE</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @page { margin: 0.5cm; size: A4 portrait; }
          }
        `}</style>
      </div>
    );
  }

  // Show Day Bunk Report in full screen when selected
  if (reportType === 'dayBunkSummary') {
    return (
      <div className="min-h-screen bg-white p-6 print:p-4">
        <div className="max-w-[1400px] mx-auto space-y-3">
          {/* Back Button and Controls */}
          <div className="flex justify-between items-center mb-4 print:hidden">
            <Button variant="outline" onClick={() => setReportType('summary')}>
              ← Back to Selection
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint} className="bg-green-600 text-white hover:bg-green-700">
                <Printer className="w-4 h-4 mr-1" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} className="bg-blue-600 text-white hover:bg-blue-700">
                <FileDown className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>

          {/* Report Content */}
          <div className="border-2 border-black">
          {/* Company Header */}
          <div className="border-b-2 border-black p-4">
            <div className="flex justify-between items-start">
              {/* Left Logo */}
              <div className="w-20">
                {orgDetails.firmLogo ? (
                  <img src={orgDetails.firmLogo} alt="Logo" className="h-16 w-16 object-contain" />
                ) : (
                  <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center border-2 border-yellow-400">
                    <span className="text-yellow-700 text-[8px] font-bold">LOGO</span>
                  </div>
                )}
              </div>

              {/* Center Info */}
              <div className="flex-1 text-center px-4">
                <h1 className="text-base font-bold mb-0.5">{orgDetails.firmName || 'MS SHREE HARSH VALLABH FUELS'}</h1>
                <p className="text-[10px] leading-tight">{orgDetails.address || 'VILLAGE DELAURA SAJJANPUR BYPASS'}</p>
                <p className="text-[10px] leading-tight">{orgDetails.city || 'SATNA MP'}</p>
                <p className="text-[10px] leading-tight font-semibold">{orgDetails.gstNo || '23AJAPD5363NIZA'}</p>
                <p className="text-[10px] leading-tight">{orgDetails.contactNo || '9981440655'}</p>
              </div>

              {/* Right QR */}
              <div className="w-20 flex justify-end">
                <div className="h-16 w-16 bg-blue-50 flex items-center justify-center border-2 border-blue-300">
                  <span className="text-blue-600 text-[8px] font-bold">QR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Date and Title */}
          <div className="border-b border-black px-4 py-1.5 flex justify-between items-center">
            <div className="text-[11px]">
              <span className="font-medium">Date:</span>
              <span className="ml-1">{format(selectedDate, 'dd-MMM-yyyy')}</span>
            </div>
            <h2 className="text-sm font-bold absolute left-1/2 transform -translate-x-1/2">Bunk Day Report</h2>
            <div className="w-32"></div>
          </div>

          {/* Tank Dip Info */}
          <div className="border-b border-black px-4 py-1 text-[10px] font-medium">
            T1 (DIP : {data.tanks.t1.dip} / {data.tanks.t1.volume})
            <span className="ml-4">T2 (DIP : {data.tanks.t2.dip} / {data.tanks.t2.volume})</span>
            <span className="ml-4">T3 (DIP : {data.tanks.t3.dip} / {data.tanks.t3.volume})</span>
          </div>

          {/* Opening Stock Bar */}
          <div className="border-b border-black px-4 py-1 text-[10px] font-medium">
            MS (Qty : {data.openingStock.ms.qty} , Rate : {data.openingStock.ms.rate}, ₹ {data.openingStock.ms.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })})
            <span className="ml-4">HSD (Qty : {data.openingStock.hsd.qty} , Rate : {data.openingStock.hsd.rate}, ₹ {data.openingStock.hsd.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })})</span>
            <span className="ml-4">CNG (Qty : {data.openingStock.cng.qty} , Rate : {data.openingStock.cng.rate}, ₹ {data.openingStock.cng.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })})</span>
          </div>

          {/* Three Product Tables */}
          <div className="border-b border-black p-3 grid grid-cols-3 gap-3">
            {/* PETROL Table */}
            <div className="border-2 border-gray-400">
              <div className="bg-purple-100 px-2 py-1 border-b border-gray-400 text-center">
                <h3 className="text-[11px] font-bold">PETROL 15KL-T1</h3>
              </div>
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="px-1.5 py-1 text-left font-semibold">Unit</th>
                    <th className="px-1.5 py-1 text-right font-semibold">CM</th>
                    <th className="px-1.5 py-1 text-right font-semibold">Test</th>
                    <th className="px-1.5 py-1 text-right font-semibold">Sale</th>
                    <th className="px-1.5 py-1 text-right font-semibold">Value (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.petrol.nozzles.map((nozzle, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <td className="px-1.5 py-0.5">{nozzle.unit}</td>
                      <td className="px-1.5 py-0.5 text-right">{nozzle.cm.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="px-1.5 py-0.5 text-right">{nozzle.test.toFixed(2)}</td>
                      <td className="px-1.5 py-0.5 text-right">{nozzle.sale.toFixed(2)}</td>
                      <td className="px-1.5 py-0.5 text-right">{nozzle.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                  <tr className="bg-purple-50 font-semibold border-t border-gray-400">
                    <td className="px-1.5 py-0.5">TOTAL</td>
                    <td className="px-1.5 py-0.5 text-right"></td>
                    <td className="px-1.5 py-0.5 text-right">{data.products.petrol.total.test.toFixed(2)}</td>
                    <td className="px-1.5 py-0.5 text-right">{data.products.petrol.total.sale.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="px-1.5 py-0.5 text-right">{data.products.petrol.total.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* DIESEL Table */}
            <div className="border-2 border-gray-400">
              <div className="bg-purple-100 px-2 py-1 border-b border-gray-400 text-center">
                <h3 className="text-[11px] font-bold">DIESEL 20KL-T2</h3>
              </div>
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="px-1.5 py-1 text-left font-semibold">Unit</th>
                    <th className="px-1.5 py-1 text-right font-semibold">CM</th>
                    <th className="px-1.5 py-1 text-right font-semibold">Test</th>
                    <th className="px-1.5 py-1 text-right font-semibold">Sale</th>
                    <th className="px-1.5 py-1 text-right font-semibold">Value (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.diesel.nozzles.map((nozzle, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <td className="px-1.5 py-0.5">{nozzle.unit}</td>
                      <td className="px-1.5 py-0.5 text-right">{nozzle.cm.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="px-1.5 py-0.5 text-right">{nozzle.test.toFixed(2)}</td>
                      <td className="px-1.5 py-0.5 text-right">{nozzle.sale.toFixed(2)}</td>
                      <td className="px-1.5 py-0.5 text-right">{nozzle.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                  <tr className="bg-purple-50 font-semibold border-t border-gray-400">
                    <td className="px-1.5 py-0.5">TOTAL</td>
                    <td className="px-1.5 py-0.5 text-right"></td>
                    <td className="px-1.5 py-0.5 text-right">{data.products.diesel.total.test.toFixed(2)}</td>
                    <td className="px-1.5 py-0.5 text-right">{data.products.diesel.total.sale.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="px-1.5 py-0.5 text-right">{data.products.diesel.total.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* CNG Table */}
            <div className="border-2 border-gray-400">
              <div className="bg-purple-100 px-2 py-1 border-b border-gray-400 text-center">
                <h3 className="text-[11px] font-bold">CNG 600KG-T3</h3>
              </div>
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="px-1.5 py-1 text-left font-semibold">Unit</th>
                    <th className="px-1.5 py-1 text-right font-semibold">CM</th>
                    <th className="px-1.5 py-1 text-right font-semibold">Test</th>
                    <th className="px-1.5 py-1 text-right font-semibold">Sale</th>
                    <th className="px-1.5 py-1 text-right font-semibold">Value (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.cng.nozzles.map((nozzle, idx) => (
                    <tr key={idx} className="border-b border-gray-200">
                      <td className="px-1.5 py-0.5">{nozzle.unit}</td>
                      <td className="px-1.5 py-0.5 text-right">{nozzle.cm.toFixed(2)}</td>
                      <td className="px-1.5 py-0.5 text-right">{nozzle.test.toFixed(2)}</td>
                      <td className="px-1.5 py-0.5 text-right">{nozzle.sale.toFixed(2)}</td>
                      <td className="px-1.5 py-0.5 text-right">{nozzle.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                  <tr className="bg-purple-50 font-semibold border-t border-gray-400">
                    <td className="px-1.5 py-0.5">TOTAL</td>
                    <td className="px-1.5 py-0.5 text-right"></td>
                    <td className="px-1.5 py-0.5 text-right">{data.products.cng.total.test.toFixed(2)}</td>
                    <td className="px-1.5 py-0.5 text-right">{data.products.cng.total.sale.toFixed(2)}</td>
                    <td className="px-1.5 py-0.5 text-right">{data.products.cng.total.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Stock Summary Table */}
          <div className="border-b border-black px-3 py-2">
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-gray-400">
                  <th className="border-r border-gray-300 px-2 py-1 text-left font-semibold bg-gray-50">Product</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-left font-semibold bg-gray-50">Tank</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-right font-semibold bg-gray-50">Open Stock</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-right font-semibold bg-gray-50">Receipt</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-right font-semibold bg-gray-50">Total Stock</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-right font-semibold bg-gray-50">Meter Sales</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-right font-semibold bg-gray-50">Closing Stock</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-right font-semibold bg-gray-50">₹ Value</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-right font-semibold bg-gray-50">₹ Vari(Ltr.)</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-right font-semibold bg-gray-50">Vari(₹)</th>
                  <th className="px-2 py-1 text-right font-semibold bg-gray-50">₹ Rate Revision</th>
                </tr>
              </thead>
              <tbody>
                {data.stockSummary.map((stock, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="border-r border-gray-300 px-2 py-0.5">{stock.product}</td>
                    <td className="border-r border-gray-300 px-2 py-0.5">{stock.tank}</td>
                    <td className="border-r border-gray-300 px-2 py-0.5 text-right">{stock.openStock.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="border-r border-gray-300 px-2 py-0.5 text-right">{stock.receipt}</td>
                    <td className="border-r border-gray-300 px-2 py-0.5 text-right">{stock.totalStock.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="border-r border-gray-300 px-2 py-0.5 text-right">{stock.meterSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="border-r border-gray-300 px-2 py-0.5 text-right">{stock.closingStock.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="border-r border-gray-300 px-2 py-0.5 text-right">{stock.value.toFixed(2)}</td>
                    <td className="border-r border-gray-300 px-2 py-0.5 text-right">{stock.variationLtr.toFixed(2)}</td>
                    <td className="border-r border-gray-300 px-2 py-0.5 text-right">{stock.variationAmount.toFixed(2)}</td>
                    <td className="px-2 py-0.5 text-right">{stock.rateRevision.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-purple-50 font-semibold border-t-2 border-gray-400">
                  <td className="px-2 py-0.5 border-r border-gray-300" colSpan="7">TOTAL</td>
                  <td className="px-2 py-0.5 text-right border-r border-gray-300">₹ {data.stockSummary.reduce((sum, s) => sum + s.value, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="px-2 py-0.5 text-right border-r border-gray-300">₹ {data.stockSummary.reduce((sum, s) => sum + s.variationAmount, 0).toFixed(2)}</td>
                  <td className="px-2 py-0.5 text-right" colSpan="2">₹ 0.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Combined Table: Lubricants + Recovery + Business Summary */}
          <div className="border-b border-black px-3 py-2">
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-gray-400 bg-gray-50">
                  <th className="border-r border-gray-300 px-2 py-1 text-left font-semibold">Lubricants</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-right font-semibold">Qty</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-right font-semibold">Amount</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-right font-semibold">Recovery Mode</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-right font-semibold">Amount</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-left font-semibold">Particulars</th>
                  <th className="px-2 py-1 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="border-r border-gray-300 px-2 py-0.5"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right">CASH</td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right">0.00</td>
                  <td className="border-r border-gray-300 px-2 py-0.5">Liquid Sale</td>
                  <td className="px-2 py-0.5 text-right">{data.businessSummary[0].amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="border-r border-gray-300 px-2 py-0.5"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right">BANK</td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right">0.00</td>
                  <td className="border-r border-gray-300 px-2 py-0.5">Lubs Sale</td>
                  <td className="px-2 py-0.5 text-right">{data.businessSummary[1].amount.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="border-r border-gray-300 px-2 py-0.5"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right">SWIPE RECOVERY</td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right">0.00</td>
                  <td className="border-r border-gray-300 px-2 py-0.5">Cash In</td>
                  <td className="px-2 py-0.5 text-right">{data.businessSummary[2].amount.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="border-r border-gray-300 px-2 py-0.5"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right">PETRO CARD</td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right">0.00</td>
                  <td className="border-r border-gray-300 px-2 py-0.5">Cash Recovery</td>
                  <td className="px-2 py-0.5 text-right">{data.businessSummary[3].amount.toFixed(2)}</td>
                </tr>
                <tr className="bg-purple-50 font-semibold border-b border-gray-400">
                  <td className="border-r border-gray-300 px-2 py-0.5">TOTAL</td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right">₹ 0.00</td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right">TOTAL</td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right">₹ 0.00</td>
                  <td className="border-r border-gray-300 px-2 py-0.5 bg-blue-50">Total Business</td>
                  <td className="px-2 py-0.5 text-right bg-blue-50">₹ {data.businessSummary[4].amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="border-r border-gray-300 px-2 py-0.5" colSpan="5"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5">Swipe</td>
                  <td className="px-2 py-0.5 text-right">{data.businessSummary[5].amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="border-r border-gray-300 px-2 py-0.5" colSpan="5"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5">Lubs Credit</td>
                  <td className="px-2 py-0.5 text-right">{data.businessSummary[6].amount.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="border-r border-gray-300 px-2 py-0.5" colSpan="5"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5">Credit</td>
                  <td className="px-2 py-0.5 text-right">{data.businessSummary[7].amount.toFixed(2)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="border-r border-gray-300 px-2 py-0.5" colSpan="5"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5">Expenses</td>
                  <td className="px-2 py-0.5 text-right">{data.businessSummary[8].amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="border-r border-gray-300 px-2 py-0.5" colSpan="5"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5">Shortage</td>
                  <td className="px-2 py-0.5 text-right">+{data.businessSummary[9].amount.toFixed(2)}</td>
                </tr>
                <tr className="bg-purple-600 text-white font-bold">
                  <td className="px-2 py-0.5" colSpan="5"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5">Cash in Hand</td>
                  <td className="px-2 py-0.5 text-right">₹ {data.businessSummary[10].amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Credit and Swipe Section */}
          <div className="border-b border-black px-3 py-2">
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-gray-400 bg-gray-50">
                  <th className="border-r border-gray-300 px-2 py-1 text-left font-semibold">Credit Particulars</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-right font-semibold">Quantity</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-right font-semibold">Amount</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-left font-semibold">Swipe Banks</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-right font-semibold">Batch/TId</th>
                  <th className="px-2 py-1 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="border-r border-gray-300 px-2 py-0.5">CREDIT</td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right">₹ 0.00</td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5">QR PAYTM</td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right">0</td>
                  <td className="px-2 py-0.5 text-right">{data.swipeDetails[0].amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="border-r border-gray-300 px-2 py-0.5">ADVANCE</td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right">₹ 0.00</td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5">PHONE PE</td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right">0</td>
                  <td className="px-2 py-0.5 text-right">{data.swipeDetails[1].amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr className="bg-purple-50 font-semibold border-t border-gray-400">
                  <td className="border-r border-gray-300 px-2 py-0.5">TOTAL</td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right">₹ 0.00</td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5">TOTAL</td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right"></td>
                  <td className="px-2 py-0.5 text-right">₹ {data.swipeDetails.reduce((sum, s) => sum + s.amount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Handover Table */}
          <div className="px-3 py-2">
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr className="border-b border-gray-400 bg-gray-50">
                  <th className="border-r border-gray-300 px-2 py-1 text-left font-semibold">OPENING HANDCASH</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-right font-semibold">{data.handover.openingCash.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-left font-semibold">DAY SETTLEMENT</th>
                  <th className="border-r border-gray-300 px-2 py-1 text-right font-semibold">{data.handover.daySettlement.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</th>
                  <th className="px-2 py-1 text-right font-semibold">{data.handover.totalSettlement.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="border-r border-gray-300 px-2 py-0.5">Mode</td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right">Handed Cash</td>
                  <td className="border-r border-gray-300 px-2 py-0.5" colSpan="3"></td>
                </tr>
                {data.handover.handed.map((hand, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="border-r border-gray-300 px-2 py-0.5">{hand.mode}</td>
                    <td className="border-r border-gray-300 px-2 py-0.5 text-right">{hand.desc}</td>
                    <td className="border-r border-gray-300 px-2 py-0.5 text-right">{hand.cash.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="border-r border-gray-300 px-2 py-0.5" colSpan="2"></td>
                  </tr>
                ))}
                <tr className="bg-purple-50 font-semibold border-b border-gray-400">
                  <td className="border-r border-gray-300 px-2 py-0.5">TOTAL HANDED</td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right"></td>
                  <td className="border-r border-gray-300 px-2 py-0.5 text-right">{data.handover.totalHanded.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="border-r border-gray-300 px-2 py-0.5" colSpan="2"></td>
                </tr>
                <tr className="bg-purple-600 text-white font-bold">
                  <td className="px-2 py-0.5" colSpan="2">DAY CLOSING BAL. CASH</td>
                  <td className="px-2 py-0.5 text-right" colSpan="3">{data.handover.closingCash.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td className="px-2 py-0.5" colSpan="5">NOTE</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

          {/* Print Styles */}
          <style>{`
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              @page {
                margin: 0.5cm;
                size: A4 landscape;
              }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Default view with report selection
  const availableShifts = [
    { value: 'morning', label: 'Morning Shift (6:00 AM - 2:00 PM)' },
    { value: 'evening', label: 'Evening Shift (2:00 PM - 10:00 PM)' },
    { value: 'night', label: 'Night Shift (10:00 PM - 6:00 AM)' },
    { value: 'all', label: 'All Shifts' }
  ];

  const availableEmployees = [
    { value: 'umesh', label: 'UMESH KUMAR SEN' },
    { value: 'ravendra', label: 'RAVENDRA SINGH CHAUD' },
    { value: 'rajendra', label: 'RAJENDRA DWIVEDI JI' },
    { value: 'emp1', label: 'John Doe' },
    { value: 'emp2', label: 'Jane Smith' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Daily Business Summary Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* DAY BUSINESS REPORT */}
          <div className="space-y-4">
            <Label className="text-lg font-bold border-b-2 pb-2 block">DAY BUSINESS REPORT</Label>

            {/* Row 1: Day Bunk Report, Day Sheet, Date Picker */}
            <div className="grid grid-cols-3 gap-6 items-start">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="dayBunkSummary"
                  name="reportType"
                  value="dayBunkSummary"
                  checked={reportType === 'dayBunkSummary'}
                  onChange={(e) => setReportType(e.target.value)}
                  className="h-4 w-4"
                />
                <Label htmlFor="dayBunkSummary" className="cursor-pointer font-medium">
                  Day Bunk Report
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="daySheet"
                  name="reportType"
                  value="daySheet"
                  checked={reportType === 'daySheet'}
                  onChange={(e) => setReportType(e.target.value)}
                  className="h-4 w-4"
                />
                <Label htmlFor="daySheet" className="cursor-pointer font-medium">
                  Day Sheet
                </Label>
              </div>

              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "dd-MMM-yyyy") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Row 2: Employee Sheet, Day Business, Employee Selector */}
            <div className="grid grid-cols-3 gap-6 items-start">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="employeeSheet"
                  name="reportType"
                  value="employeeSheet"
                  checked={reportType === 'employeeSheet'}
                  onChange={(e) => setReportType(e.target.value)}
                  className="h-4 w-4"
                />
                <Label htmlFor="employeeSheet" className="cursor-pointer font-medium">
                  Employee Sheet
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="dayBusiness"
                  name="reportType"
                  value="dayBusiness"
                  checked={reportType === 'dayBusiness'}
                  onChange={(e) => setReportType(e.target.value)}
                  className="h-4 w-4"
                />
                <Label htmlFor="dayBusiness" className="cursor-pointer font-medium">
                  Day Business
                </Label>
              </div>

              {/* Employee Selector */}
              {reportType === 'employeeSheet' && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Select Employee:</Label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Select Employee --</option>
                    {availableEmployees.map(emp => (
                      <option key={emp.value} value={emp.value}>{emp.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Row 3: Shift Wise Checkbox and Shift Selector */}
            <div className="grid grid-cols-3 gap-6 items-center">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="shiftWise"
                  checked={shiftWise}
                  onChange={(e) => setShiftWise(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="shiftWise" className="cursor-pointer font-medium">
                  Shift Wise
                </Label>
              </div>

              {shiftWise && (
                <div className="col-span-2 space-y-2">
                  <Label className="text-sm font-semibold">Select Shift:</Label>
                  <select
                    value={selectedShift}
                    onChange={(e) => setSelectedShift(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Select Shift --</option>
                    {availableShifts.map(shift => (
                      <option key={shift.value} value={shift.value}>{shift.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                onClick={() => {
                  if (reportType === 'employeeSheet' && !selectedEmployee) {
                    alert('Please select an employee');
                    return;
                  }
                  // Reports will open in new tabs or display based on type
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                disabled={!selectedDate || (shiftWise && !selectedShift) || (reportType === 'employeeSheet' && !selectedEmployee)}
              >
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyBusinessSummaryReport;