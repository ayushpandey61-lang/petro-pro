import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useOrg } from '@/hooks/useOrg';

const BunkDayReport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { orgDetails } = useOrg();

  // Exact data from the PDF
  const reportData = {
    company: {
      name: orgDetails.firmName || "Organization Name",
      address: orgDetails.address || "Address",
      city: "",
      gst: orgDetails.gstNo || "GST Number",
      phone: orgDetails.contactNo || "Contact Number"
    },
    products: {
      ms: { qty: 1300.06, rate: 108.03, amount: 140445.47 },
      hsd: { qty: 1465.63, rate: 93.43, amount: 136933.81 },
      cng: { qty: 178.75, rate: 94.00, amount: 16802.50 }
    },
    tanks: {
      petrol: [
        { nozzle: "P1 1ST A1", opening: 15412.54, closing: 0.00, test: 0.00, sale: 0.00, amount: 0.00 },
        { nozzle: "P1 1ST B1", opening: 7877.47, closing: 0.00, test: 0.00, sale: 0.00, amount: 0.00 },
        { nozzle: "P2 2ND A1", opening: 645649.48, closing: 0.00, test: 1068.12, sale: 115389.00, amount: 115389.00 },
        { nozzle: "P2 2ND B1", opening: 163892.06, closing: 0.00, test: 231.94, sale: 25056.47, amount: 25056.47 },
        { nozzle: "TOTAL", opening: 0.00, closing: 1300.06, test: 140445.47, sale: 140445.47, amount: 140445.47 }
      ],
      diesel: [
        { nozzle: "P1 1ST A2", opening: 677298.52, closing: 0.00, test: 445.50, sale: 41623.06, amount: 41623.06 },
        { nozzle: "P1 1ST B2", opening: 958728.11, closing: 0.00, test: 1020.13, sale: 95310.75, amount: 95310.75 },
        { nozzle: "P2 2ND A2", opening: 21237.28, closing: 0.00, test: 0.00, sale: 0.00, amount: 0.00 },
        { nozzle: "P2 2ND B2", opening: 8155.44, closing: 0.00, test: 0.00, sale: 0.00, amount: 0.00 },
        { nozzle: "TOTAL", opening: 0.00, closing: 1465.63, test: 136933.81, sale: 136933.81, amount: 136933.81 }
      ],
      cng: [
        { nozzle: "P3 A", opening: 12682.11, closing: 0.00, test: 79.47, sale: 7470.18, amount: 7470.18 },
        { nozzle: "P3 B", opening: 24949.37, closing: 0.00, test: 99.28, sale: 9332.32, amount: 9332.32 },
        { nozzle: "TOTAL", opening: 0.00, closing: 178.75, test: 16802.50, sale: 16802.50, amount: 16802.50 }
      ]
    },
    lubricants: [
      { product: "MK 2T 20ML", qty: 990.00, amount: 90.00 }
    ],
    recovery: {
      cash: 0.00,
      bank: 0.00,
      swipeRecovery: 0.00,
      petroCard: 0.00
    },
    credit: {
      credit: 0.00,
      advance: 0.00
    },
    swipeBanks: [
      { bank: "QR PAYTM", batchId: "099", amount: 678.00 },
      { bank: "CASH EXCHNG DIRECT BNK TRNSFR", batchId: "02", amount: 2115.00 },
      { bank: "PHONE PE", batchId: "037", amount: 455.00 }
    ],
    summary: {
      liquidSale: 294181.78,
      lubeSale: 90.00,
      cashIn: 0.00,
      cashRecovery: 0.00,
      totalBusiness: 294271.78,
      swipe: 139248.00,
      lubeCredit: 0.00,
      credit: 0.00,
      expenses: 15374.00,
      shortage: 0.22,
      cashInHand: 139650.00,
      openingCash: 219000.00,
      daySettlement: 139650.00,
      totalCash: 358650.00
    },
    handover: [
      { mode: "OWNER TO HOME VINIT", amount: 324660.00 }
    ],
    closingBalance: 33990.00
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Controls */}
      <div className="bg-gray-100 p-4 border-b-2 border-black">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Date:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("justify-start text-left font-normal border-black", !selectedDate && "text-muted-foreground")}>
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
          <Button
            onClick={() => {
              const reportWindow = window.open('', '_blank');
              if (reportWindow) {
                reportWindow.document.write(`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <title>Bunk Day Report - ${orgDetails.firmName || 'Organization'} - ${format(selectedDate, "dd-MMM-yyyy")}</title>
                      <style>
                        body {
                          font-family: 'Times New Roman', serif;
                          margin: 20px;
                          line-height: 1.4;
                        }
                        .header {
                          text-align: center;
                          border-bottom: 3px solid #000;
                          padding-bottom: 15px;
                          margin-bottom: 20px;
                        }
                        .company-name {
                          font-size: 28px;
                          font-weight: bold;
                          margin-bottom: 8px;
                        }
                        .company-details {
                          font-size: 16px;
                          margin: 4px 0;
                        }
                        .report-title {
                          font-size: 24px;
                          font-weight: bold;
                          margin: 15px 0;
                        }
                        .date-line {
                          font-size: 16px;
                          margin-bottom: 10px;
                        }
                        .product-summary {
                          background-color: #f0f0f0;
                          padding: 12px;
                          margin: 15px 0;
                          border: 1px solid #000;
                          font-size: 16px;
                          font-weight: bold;
                        }
                        .section-title {
                          font-size: 20px;
                          font-weight: bold;
                          margin: 25px 0 10px 0;
                          text-decoration: underline;
                        }
                        table {
                          width: 100%;
                          border-collapse: collapse;
                          margin: 15px 0;
                          font-size: 14px;
                        }
                        th, td {
                          border: 2px solid #000;
                          padding: 8px 12px;
                          text-align: left;
                        }
                        th {
                          background-color: #e0e0e0;
                          font-weight: bold;
                          font-size: 15px;
                        }
                        .text-right { text-align: right; }
                        .text-center { text-align: center; }
                        .total-row {
                          background-color: #d0d0d0;
                          font-weight: bold;
                          font-size: 15px;
                        }
                        .financial-summary {
                          margin: 20px 0;
                        }
                        .cash-settlement {
                          margin: 20px 0;
                          padding: 15px;
                          border: 2px solid #000;
                        }
                        .settlement-line {
                          display: flex;
                          justify-content: space-between;
                          margin: 8px 0;
                          padding: 5px 0;
                        }
                        .total-line {
                          border-top: 2px solid #000;
                          font-weight: bold;
                          font-size: 16px;
                          margin-top: 10px;
                          padding-top: 8px;
                        }
                        .closing-balance {
                          text-align: center;
                          font-size: 22px;
                          font-weight: bold;
                          margin: 30px 0;
                          padding: 15px;
                          border: 2px solid #000;
                        }
                        @media print {
                          body { margin: 0; }
                          .no-print { display: none; }
                        }
                      </style>
                    </head>
                    <body>
                      <div class="header">
                        <div class="company-name">${orgDetails.firmName || 'Organization Name'}</div>
                        <div class="company-details">${orgDetails.address || 'Address'}</div>
                        <div class="company-details">${orgDetails.gstNo || 'GST Number'}</div>
                        <div class="company-details">${orgDetails.contactNo || 'Contact Number'}</div>
                        <div class="company-details">${orgDetails.bunkDetails || 'Bunk Details'}</div>
                        <div class="date-line">Date: ${format(selectedDate, "dd-MMM-yyyy")}</div>
                        <div class="report-title">Bunk Day Report</div>
                      </div>

                      <div class="product-summary">
                        MS (Qty : ${formatNumber(reportData.products.ms.qty)} , Rate : ${formatNumber(reportData.products.ms.rate)}, ₹ ${formatNumber(reportData.products.ms.amount)})
                        HSD (Qty : ${formatNumber(reportData.products.hsd.qty)} , Rate : ${formatNumber(reportData.products.hsd.rate)}, ₹ ${formatNumber(reportData.products.hsd.amount)})
                        CNG (Qty : ${formatNumber(reportData.products.cng.qty)} , Rate : ${formatNumber(reportData.products.cng.rate)}, ₹ ${formatNumber(reportData.products.cng.amount)})
                      </div>

                      <div class="section-title">PETROL 15KL-T1</div>
                      <table>
                        <tr>
                          <th>Unit</th>
                          <th class="text-right">CM</th>
                          <th class="text-right">Test</th>
                          <th class="text-right">Sale</th>
                          <th class="text-right">Value (₹)</th>
                        </tr>
                        ${reportData.tanks.petrol.map(row => `
                          <tr class="${row.nozzle === 'TOTAL' ? 'total-row' : ''}">
                            <td>${row.nozzle}</td>
                            <td class="text-right">${formatNumber(row.opening)}</td>
                            <td class="text-right">${formatNumber(row.test)}</td>
                            <td class="text-right">${formatNumber(row.sale)}</td>
                            <td class="text-right">${formatCurrency(row.amount)}</td>
                          </tr>
                        `).join('')}
                      </table>

                      <div class="section-title">DIESEL 20KL-T2</div>
                      <table>
                        <tr>
                          <th>Unit</th>
                          <th class="text-right">CM</th>
                          <th class="text-right">Test</th>
                          <th class="text-right">Sale</th>
                          <th class="text-right">Value (₹)</th>
                        </tr>
                        ${reportData.tanks.diesel.map(row => `
                          <tr class="${row.nozzle === 'TOTAL' ? 'total-row' : ''}">
                            <td>${row.nozzle}</td>
                            <td class="text-right">${formatNumber(row.opening)}</td>
                            <td class="text-right">${formatNumber(row.test)}</td>
                            <td class="text-right">${formatNumber(row.sale)}</td>
                            <td class="text-right">${formatCurrency(row.amount)}</td>
                          </tr>
                        `).join('')}
                      </table>

                      <div class="section-title">CNG 600KG-T3</div>
                      <table>
                        <tr>
                          <th>Unit</th>
                          <th class="text-right">CM</th>
                          <th class="text-right">Test</th>
                          <th class="text-right">Sale</th>
                          <th class="text-right">Value (₹)</th>
                        </tr>
                        ${reportData.tanks.cng.map(row => `
                          <tr class="${row.nozzle === 'TOTAL' ? 'total-row' : ''}">
                            <td>${row.nozzle}</td>
                            <td class="text-right">${formatNumber(row.opening)}</td>
                            <td class="text-right">${formatNumber(row.test)}</td>
                            <td class="text-right">${formatNumber(row.sale)}</td>
                            <td class="text-right">${formatCurrency(row.amount)}</td>
                          </tr>
                        `).join('')}
                      </table>

                      <div style="margin: 20px 0; padding: 10px; background-color: #f9f9f9; border: 1px solid #000;">
                        Product Tank Open Stock Receipt Total Stock Meter Sales Closing Stock ₹ Value ₹ Vari(Ltr.) Vari(₹) ₹ Rate Revision
                        <br><strong>TOTAL ₹ 0 ₹ 0.00 ₹ 0.00</strong>
                      </div>

                      <div class="section-title">Lubricants</div>
                      <table>
                        <tr>
                          <th>Product</th>
                          <th class="text-right">Qty</th>
                          <th class="text-right">Amount</th>
                        </tr>
                        ${reportData.lubricants.map(item => `
                          <tr>
                            <td>${item.product}</td>
                            <td class="text-right">${formatNumber(item.qty)}</td>
                            <td class="text-right">${formatCurrency(item.amount)}</td>
                          </tr>
                        `).join('')}
                        <tr class="total-row">
                          <td>TOTAL</td>
                          <td></td>
                          <td class="text-right">${formatCurrency(reportData.lubricants.reduce((sum, item) => sum + item.amount, 0))}</td>
                        </tr>
                      </table>

                      <div class="section-title">Recovery Mode</div>
                      <table>
                        <tr><td>CASH</td><td class="text-right">${formatCurrency(reportData.recovery.cash)}</td></tr>
                        <tr><td>BANK</td><td class="text-right">${formatCurrency(reportData.recovery.bank)}</td></tr>
                        <tr><td>SWIPE RECOVERY</td><td class="text-right">${formatCurrency(reportData.recovery.swipeRecovery)}</td></tr>
                        <tr><td>PETRO CARD</td><td class="text-right">${formatCurrency(reportData.recovery.petroCard)}</td></tr>
                        <tr class="total-row">
                          <td>TOTAL</td>
                          <td class="text-right">${formatCurrency(Object.values(reportData.recovery).reduce((sum, amount) => sum + amount, 0))}</td>
                        </tr>
                      </table>

                      <div class="section-title">Credit Particulars</div>
                      <table>
                        <tr><td>CREDIT</td><td class="text-right">${formatCurrency(reportData.credit.credit)}</td></tr>
                        <tr><td>ADVANCE</td><td class="text-right">${formatCurrency(reportData.credit.advance)}</td></tr>
                        <tr class="total-row">
                          <td>TOTAL</td>
                          <td class="text-right">${formatCurrency(Object.values(reportData.credit).reduce((sum, amount) => sum + amount, 0))}</td>
                        </tr>
                      </table>

                      <div class="section-title">Swipe Banks</div>
                      <table>
                        <tr>
                          <th>Bank</th>
                          <th class="text-center">Batch/TId</th>
                          <th class="text-right">Amount</th>
                        </tr>
                        ${reportData.swipeBanks.map(bank => `
                          <tr>
                            <td>${bank.bank}</td>
                            <td class="text-center">${bank.batchId}</td>
                            <td class="text-right">${formatCurrency(bank.amount)}</td>
                          </tr>
                        `).join('')}
                        <tr class="total-row">
                          <td>TOTAL</td>
                          <td></td>
                          <td class="text-right">${formatCurrency(reportData.swipeBanks.reduce((sum, bank) => sum + bank.amount, 0))}</td>
                        </tr>
                      </table>

                      <div class="section-title">Particulars</div>
                      <table>
                        <tr><td>Liquid Sale</td><td class="text-right">${formatCurrency(reportData.summary.liquidSale)}</td></tr>
                        <tr><td>Lubs Sale</td><td class="text-right">${formatCurrency(reportData.summary.lubeSale)}</td></tr>
                        <tr><td>Cash In</td><td class="text-right">${formatCurrency(reportData.summary.cashIn)}</td></tr>
                        <tr><td>Cash Recovery</td><td class="text-right">${formatCurrency(reportData.summary.cashRecovery)}</td></tr>
                        <tr class="total-row">
                          <td>Total Business</td>
                          <td class="text-right">${formatCurrency(reportData.summary.totalBusiness)}</td>
                        </tr>
                        <tr><td>Swipe</td><td class="text-right">${formatCurrency(reportData.summary.swipe)}</td></tr>
                        <tr><td>Lubs Credit</td><td class="text-right">${formatCurrency(reportData.summary.lubeCredit)}</td></tr>
                        <tr><td>Credit</td><td class="text-right">${formatCurrency(reportData.summary.credit)}</td></tr>
                        <tr><td>Expenses</td><td class="text-right">${formatCurrency(reportData.summary.expenses)}</td></tr>
                        <tr><td>Shortage</td><td class="text-right">${reportData.summary.shortage >= 0 ? '+' : ''}${formatCurrency(reportData.summary.shortage)}</td></tr>
                        <tr class="total-row">
                          <td>Cash In Hand</td>
                          <td class="text-right">${formatCurrency(reportData.summary.cashInHand)}</td>
                        </tr>
                      </table>

                      <div class="cash-settlement">
                        <div class="settlement-line">
                          <span>OPENING HAND CASH</span>
                          <span>${formatCurrency(reportData.summary.openingCash)}</span>
                        </div>
                        <div class="settlement-line">
                          <span>DAY SETTLEMENT</span>
                          <span>${formatCurrency(reportData.summary.daySettlement)}</span>
                        </div>
                        <div class="settlement-line total-line">
                          <span>TOTAL</span>
                          <span>${formatCurrency(reportData.summary.totalCash)}</span>
                        </div>
                      </div>

                      <div class="section-title">Mode</div>
                      <table>
                        <tr>
                          <th>Handed Cash</th>
                          <th></th>
                        </tr>
                        ${reportData.handover.map(item => `
                          <tr>
                            <td>${item.mode}</td>
                            <td class="text-right">${formatCurrency(item.amount)}</td>
                          </tr>
                        `).join('')}
                        <tr class="total-row">
                          <td>TOTAL HANDED</td>
                          <td class="text-right">${formatCurrency(reportData.handover.reduce((sum, item) => sum + item.amount, 0))}</td>
                        </tr>
                      </table>

                      <div class="closing-balance">
                        DAY CLOSING BAL. CASH ${formatCurrency(reportData.closingBalance)}
                      </div>

                      <div style="margin-top: 30px; text-align: center; font-style: italic;">
                        NOTE
                      </div>
                    </body>
                  </html>
                `);
                reportWindow.document.close();
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2"
          >
            Generate {orgDetails.firmName ? `${orgDetails.firmName} ` : ''}Bunk Day Report
          </Button>
        </div>
      </div>

      {/* Report Preview */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Company Header */}
        <div className="text-center border-b-4 border-black pb-4 mb-6">
          <h1 className="text-3xl font-bold mb-2">{orgDetails.firmName || 'Organization Name'}</h1>
          <p className="text-lg">{orgDetails.address || 'Address'}</p>
          <p className="text-lg">{orgDetails.gstNo || 'GST Number'}</p>
          <p className="text-lg">{orgDetails.contactNo || 'Contact Number'}</p>
          <p className="text-lg">{orgDetails.bunkDetails || 'Bunk Details'}</p>
          <p className="text-lg mt-2">Date: {format(selectedDate, "dd-MMM-yyyy")}</p>
          <h2 className="text-2xl font-bold mt-4">Bunk Day Report</h2>
        </div>

        {/* Product Summary */}
        <div className="bg-gray-100 p-4 mb-6 border-2 border-black text-lg font-bold">
          MS (Qty : {formatNumber(reportData.products.ms.qty)} , Rate : {formatNumber(reportData.products.ms.rate)}, ₹ {formatNumber(reportData.products.ms.amount)})
          HSD (Qty : {formatNumber(reportData.products.hsd.qty)} , Rate : {formatNumber(reportData.products.hsd.rate)}, ₹ {formatNumber(reportData.products.hsd.amount)})
          CNG (Qty : {formatNumber(reportData.products.cng.qty)} , Rate : {formatNumber(reportData.products.cng.rate)}, ₹ {formatNumber(reportData.products.cng.amount)})
        </div>

        {/* PETROL Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 underline">PETROL 15KL-T1</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-black text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border-2 border-black p-3 text-left font-bold">Unit</th>
                  <th className="border-2 border-black p-3 text-right font-bold">CM</th>
                  <th className="border-2 border-black p-3 text-right font-bold">Test</th>
                  <th className="border-2 border-black p-3 text-right font-bold">Sale</th>
                  <th className="border-2 border-black p-3 text-right font-bold">Value (₹)</th>
                </tr>
              </thead>
              <tbody>
                {reportData.tanks.petrol.map((row, index) => (
                  <tr key={index} className={row.nozzle === 'TOTAL' ? 'bg-gray-300 font-bold' : ''}>
                    <td className="border-2 border-black p-3">{row.nozzle}</td>
                    <td className="border-2 border-black p-3 text-right">{formatNumber(row.opening)}</td>
                    <td className="border-2 border-black p-3 text-right">{formatNumber(row.test)}</td>
                    <td className="border-2 border-black p-3 text-right">{formatNumber(row.sale)}</td>
                    <td className="border-2 border-black p-3 text-right">{formatCurrency(row.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DIESEL Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 underline">DIESEL 20KL-T2</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-black text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border-2 border-black p-3 text-left font-bold">Unit</th>
                  <th className="border-2 border-black p-3 text-right font-bold">CM</th>
                  <th className="border-2 border-black p-3 text-right font-bold">Test</th>
                  <th className="border-2 border-black p-3 text-right font-bold">Sale</th>
                  <th className="border-2 border-black p-3 text-right font-bold">Value (₹)</th>
                </tr>
              </thead>
              <tbody>
                {reportData.tanks.diesel.map((row, index) => (
                  <tr key={index} className={row.nozzle === 'TOTAL' ? 'bg-gray-300 font-bold' : ''}>
                    <td className="border-2 border-black p-3">{row.nozzle}</td>
                    <td className="border-2 border-black p-3 text-right">{formatNumber(row.opening)}</td>
                    <td className="border-2 border-black p-3 text-right">{formatNumber(row.test)}</td>
                    <td className="border-2 border-black p-3 text-right">{formatNumber(row.sale)}</td>
                    <td className="border-2 border-black p-3 text-right">{formatCurrency(row.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CNG Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 underline">CNG 600KG-T3</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-black text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border-2 border-black p-3 text-left font-bold">Unit</th>
                  <th className="border-2 border-black p-3 text-right font-bold">CM</th>
                  <th className="border-2 border-black p-3 text-right font-bold">Test</th>
                  <th className="border-2 border-black p-3 text-right font-bold">Sale</th>
                  <th className="border-2 border-black p-3 text-right font-bold">Value (₹)</th>
                </tr>
              </thead>
              <tbody>
                {reportData.tanks.cng.map((row, index) => (
                  <tr key={index} className={row.nozzle === 'TOTAL' ? 'bg-gray-300 font-bold' : ''}>
                    <td className="border-2 border-black p-3">{row.nozzle}</td>
                    <td className="border-2 border-black p-3 text-right">{formatNumber(row.opening)}</td>
                    <td className="border-2 border-black p-3 text-right">{formatNumber(row.test)}</td>
                    <td className="border-2 border-black p-3 text-right">{formatNumber(row.sale)}</td>
                    <td className="border-2 border-black p-3 text-right">{formatCurrency(row.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tank Summary */}
        <div className="bg-gray-100 p-4 mb-6 border-2 border-black">
          <p className="text-sm mb-2">Product Tank Open Stock Receipt Total Stock Meter Sales Closing Stock ₹ Value ₹ Vari(Ltr.) Vari(₹) ₹ Rate Revision</p>
          <p className="font-bold">TOTAL ₹ 0 ₹ 0.00 ₹ 0.00</p>
        </div>

        {/* Lubricants */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 underline">Lubricants</h3>
          <table className="w-full border-collapse border-2 border-black text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-2 border-black p-3 text-left font-bold">Product</th>
                <th className="border-2 border-black p-3 text-right font-bold">Qty</th>
                <th className="border-2 border-black p-3 text-right font-bold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {reportData.lubricants.map((item, index) => (
                <tr key={index}>
                  <td className="border-2 border-black p-3">{item.product}</td>
                  <td className="border-2 border-black p-3 text-right">{formatNumber(item.qty)}</td>
                  <td className="border-2 border-black p-3 text-right">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
              <tr className="bg-gray-300 font-bold">
                <td className="border-2 border-black p-3">TOTAL</td>
                <td className="border-2 border-black p-3 text-right"></td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(reportData.lubricants.reduce((sum, item) => sum + item.amount, 0))}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Recovery Mode */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 underline">Recovery Mode</h3>
          <table className="w-full border-collapse border-2 border-black text-sm">
            <tbody>
              <tr>
                <td className="border-2 border-black p-3">CASH</td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(reportData.recovery.cash)}</td>
              </tr>
              <tr>
                <td className="border-2 border-black p-3">BANK</td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(reportData.recovery.bank)}</td>
              </tr>
              <tr>
                <td className="border-2 border-black p-3">SWIPE RECOVERY</td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(reportData.recovery.swipeRecovery)}</td>
              </tr>
              <tr>
                <td className="border-2 border-black p-3">PETRO CARD</td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(reportData.recovery.petroCard)}</td>
              </tr>
              <tr className="bg-gray-300 font-bold">
                <td className="border-2 border-black p-3">TOTAL</td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(Object.values(reportData.recovery).reduce((sum, amount) => sum + amount, 0))}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Credit Particulars */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 underline">Credit Particulars</h3>
          <table className="w-full border-collapse border-2 border-black text-sm">
            <tbody>
              <tr>
                <td className="border-2 border-black p-3">CREDIT</td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(reportData.credit.credit)}</td>
              </tr>
              <tr>
                <td className="border-2 border-black p-3">ADVANCE</td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(reportData.credit.advance)}</td>
              </tr>
              <tr className="bg-gray-300 font-bold">
                <td className="border-2 border-black p-3">TOTAL</td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(Object.values(reportData.credit).reduce((sum, amount) => sum + amount, 0))}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Swipe Banks */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 underline">Swipe Banks</h3>
          <table className="w-full border-collapse border-2 border-black text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-2 border-black p-3 text-left font-bold">Bank</th>
                <th className="border-2 border-black p-3 text-center font-bold">Batch/TId</th>
                <th className="border-2 border-black p-3 text-right font-bold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {reportData.swipeBanks.map((bank, index) => (
                <tr key={index}>
                  <td className="border-2 border-black p-3">{bank.bank}</td>
                  <td className="border-2 border-black p-3 text-center">{bank.batchId}</td>
                  <td className="border-2 border-black p-3 text-right">{formatCurrency(bank.amount)}</td>
                </tr>
              ))}
              <tr className="bg-gray-300 font-bold">
                <td className="border-2 border-black p-3">TOTAL</td>
                <td className="border-2 border-black p-3 text-center"></td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(reportData.swipeBanks.reduce((sum, bank) => sum + bank.amount, 0))}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 underline">Particulars</h3>
          <table className="w-full border-collapse border-2 border-black text-sm">
            <tbody>
              <tr>
                <td className="border-2 border-black p-3">Liquid Sale</td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(reportData.summary.liquidSale)}</td>
              </tr>
              <tr>
                <td className="border-2 border-black p-3">Lubs Sale</td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(reportData.summary.lubeSale)}</td>
              </tr>
              <tr>
                <td className="border-2 border-black p-3">Cash In</td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(reportData.summary.cashIn)}</td>
              </tr>
              <tr>
                <td className="border-2 border-black p-3">Cash Recovery</td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(reportData.summary.cashRecovery)}</td>
              </tr>
              <tr className="bg-gray-300 font-bold">
                <td className="border-2 border-black p-3">Total Business</td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(reportData.summary.totalBusiness)}</td>
              </tr>
              <tr>
                <td className="border-2 border-black p-3">Swipe</td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(reportData.summary.swipe)}</td>
              </tr>
              <tr>
                <td className="border-2 border-black p-3">Lubs Credit</td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(reportData.summary.lubeCredit)}</td>
              </tr>
              <tr>
                <td className="border-2 border-black p-3">Credit</td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(reportData.summary.credit)}</td>
              </tr>
              <tr>
                <td className="border-2 border-black p-3">Expenses</td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(reportData.summary.expenses)}</td>
              </tr>
              <tr>
                <td className="border-2 border-black p-3">Shortage</td>
                <td className="border-2 border-black p-3 text-right">{reportData.summary.shortage >= 0 ? '+' : ''}{formatCurrency(reportData.summary.shortage)}</td>
              </tr>
              <tr className="bg-gray-300 font-bold">
                <td className="border-2 border-black p-3">Cash In Hand</td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(reportData.summary.cashInHand)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Cash Settlement */}
        <div className="mb-8 p-6 border-2 border-black">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="font-medium">OPENING HAND CASH</span>
              <span className="font-bold">{formatCurrency(reportData.summary.openingCash)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium">DAY SETTLEMENT</span>
              <span className="font-bold">{formatCurrency(reportData.summary.daySettlement)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-t-2 border-black font-bold text-lg">
              <span>TOTAL</span>
              <span>{formatCurrency(reportData.summary.totalCash)}</span>
            </div>
          </div>
        </div>

        {/* Handover Details */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 underline">Mode</h3>
          <table className="w-full border-collapse border-2 border-black text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-2 border-black p-3 text-left font-bold">Handed Cash</th>
                <th className="border-2 border-black p-3 text-right font-bold"></th>
              </tr>
            </thead>
            <tbody>
              {reportData.handover.map((item, index) => (
                <tr key={index}>
                  <td className="border-2 border-black p-3">{item.mode}</td>
                  <td className="border-2 border-black p-3 text-right">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
              <tr className="bg-gray-300 font-bold">
                <td className="border-2 border-black p-3">TOTAL HANDED</td>
                <td className="border-2 border-black p-3 text-right">{formatCurrency(reportData.handover.reduce((sum, item) => sum + item.amount, 0))}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Closing Balance */}
        <div className="text-center p-6 border-2 border-black mb-8">
          <div className="text-2xl font-bold">
            DAY CLOSING BAL. CASH {formatCurrency(reportData.closingBalance)}
          </div>
        </div>

        {/* Notes Section */}
        <div className="text-center italic text-lg">
          NOTE
        </div>
      </div>
    </div>
  );
};

export default BunkDayReport;