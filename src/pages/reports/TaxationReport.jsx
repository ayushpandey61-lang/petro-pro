import React from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const TaxationReport = () => {
  const gstFields = [{ name: 'dateRange', label: 'Date Range', type: 'dateRange' }];

  return (
    <Accordion type="multiple" defaultValue={['item-1']} className="w-full space-y-4">
      <AccordionItem value="item-1">
        <AccordionTrigger className="font-semibold">GST Report</AccordionTrigger>
        <AccordionContent>
          <ReportFilterForm title="GST Report" fields={gstFields} showTitle={false} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="font-semibold">GST Sale Report</AccordionTrigger>
        <AccordionContent>
          <ReportFilterForm title="GST Sale Report" fields={gstFields} showTitle={false} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="font-semibold">TDS Report</AccordionTrigger>
        <AccordionContent>
          <ReportFilterForm title="TDS Report" fields={gstFields} showTitle={false} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger className="font-semibold">VAT Report</AccordionTrigger>
        <AccordionContent>
          <ReportFilterForm title="VAT Report" fields={gstFields} showTitle={false} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger className="font-semibold">LFR Report</AccordionTrigger>
        <AccordionContent>
          <ReportFilterForm title="LFR Report" fields={gstFields} showTitle={false} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-6">
        <AccordionTrigger className="font-semibold">TDS Report</AccordionTrigger>
        <AccordionContent>
          <ReportFilterForm title="TDS Report" fields={gstFields} showTitle={false} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default TaxationReport;