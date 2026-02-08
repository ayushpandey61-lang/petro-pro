import React from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const SalesReport = () => {
  const [fuelProducts] = useLocalStorage('fuelProducts', []);
  const productOptions = fuelProducts.map(p => ({ value: p.id, label: p.productName }));

  const handleReportSubmit = (formData) => {
    console.log('Sales Report Data:', formData);
    // Here you would typically send the data to your backend
    // For now, we'll just log it
  };

  const salesFields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'product', label: 'Product', type: 'select', options: productOptions },
    { name: 'liquids', label: 'Liquids', type: 'checkbox' },
    { name: 'lubricants', label: 'Lubricants', type: 'checkbox' },
    { name: 'shiftWise', label: 'Shift Wise', type: 'checkbox' },
  ];
  
  const consolidatedFields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
  ];

  const monthWiseFields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'product', label: 'Product', type: 'select', options: productOptions },
    { name: 'lubricants', label: 'Lubricants', type: 'checkbox' },
    { name: 'liquids', label: 'Liquids', type: 'checkbox' },
  ];

  return (
    <Accordion type="multiple" className="w-full space-y-4">
      <AccordionItem value="item-1">
        <AccordionTrigger className="font-semibold">Sales</AccordionTrigger>
        <AccordionContent>
          <ReportFilterForm title="Sales" fields={salesFields} showTitle={false} onSubmit={handleReportSubmit} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="font-semibold">Consolidated Sales</AccordionTrigger>
        <AccordionContent>
          <ReportFilterForm title="Consolidated Sales" fields={consolidatedFields} showTitle={false} onSubmit={handleReportSubmit} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="font-semibold">Month Wise Sale Report</AccordionTrigger>
        <AccordionContent>
          <ReportFilterForm title="Month Wise Sale Report" fields={monthWiseFields} showTitle={false} onSubmit={handleReportSubmit} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SalesReport;