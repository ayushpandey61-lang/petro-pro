import React, { useState, useMemo } from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';

const DailyBusinessSummaryReport = () => {
  const [shiftRecords] = useLocalStorage('shiftRecords', []);
  const [filters, setFilters] = useState({});

  const handleFilterSubmit = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredData = useMemo(() => {
    if (!filters.dayBusinessDateRange) return [];
    
    const { from, to } = filters.dayBusinessDateRange;
    if (!from || !to) return [];

    return shiftRecords.filter(record => {
        const recordDate = parseISO(record.date);
        return recordDate >= from && recordDate <= to;
    });
  }, [filters, shiftRecords]);

  const calculateSummary = (records) => {
    const summary = {
      totalLiquidSale: 0,
      totalLubeSale: 0,
      totalCreditSale: 0,
      totalRecovery: 0,
      totalSwipe: 0,
      totalExpense: 0,
      totalCashHandover: 0,
      totalShortage: 0,
    };

    records.forEach(rec => {
        summary.totalLiquidSale += rec.liquidSale?.readings.reduce((acc, r) => acc + (parseFloat(r.saleAmount) || 0), 0) || 0;
        summary.totalLubeSale += rec.lubeSale?.items.reduce((acc, i) => acc + (parseFloat(i.amount) || 0), 0) || 0;
        summary.totalCreditSale += rec.creditSale?.items.reduce((acc, i) => acc + (parseFloat(i.totalAmount) || 0), 0) || 0;
        summary.totalRecovery += rec.recovery?.items.reduce((acc, i) => acc + (parseFloat(i.amount) || 0), 0) || 0;
        summary.totalSwipe += rec.swipe?.items.reduce((acc, i) => acc + (parseFloat(i.amount) || 0), 0) || 0;
        summary.totalExpense += rec.expenses?.items.reduce((acc, i) => acc + (parseFloat(i.amount) || 0), 0) || 0;
        summary.totalCashHandover += rec.empCashRecovery?.items.reduce((acc, i) => acc + (parseFloat(i.amount) || 0), 0) || 0;
        const totalSale = summary.totalLiquidSale + summary.totalLubeSale;
        summary.totalShortage += totalSale - (summary.totalCreditSale + summary.totalRecovery + summary.totalSwipe + summary.totalExpense + summary.totalCashHandover);
    });

    return summary;
  };

  const summaryData = calculateSummary(filteredData);
  
  const dayBusinessFields = [{ name: 'dayBusinessDateRange', label: 'Date Range', type: 'dateRange' }];

  return (
    <Accordion type="multiple" className="w-full space-y-4" defaultValue={['item-2']}>
      <AccordionItem value="item-1">
        <AccordionTrigger className="font-semibold">Dip Sheet Summary</AccordionTrigger>
        <AccordionContent>Feature coming soon!</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="font-semibold">Daily Business Sheet</AccordionTrigger>
        <AccordionContent>
          <ReportFilterForm title="Daily Business Sheet" fields={dayBusinessFields} showTitle={false} onSubmit={handleFilterSubmit} />
          {filteredData.length > 0 && (
             <Card className="mt-4">
                <CardHeader><CardTitle>Summary Report</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Metric</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(summaryData).map(([key, value]) => (
                                <TableRow key={key}>
                                    <TableCell className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</TableCell>
                                    <TableCell className="text-right">₹{value.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
             </Card>
          )}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="font-semibold">Day Settlement</AccordionTrigger>
        <AccordionContent>Feature coming soon!</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DailyBusinessSummaryReport;