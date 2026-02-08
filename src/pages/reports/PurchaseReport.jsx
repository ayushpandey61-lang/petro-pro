import React from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';

const PurchaseReport = () => {
  const fields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'reportView', label: 'View', type: 'radio', options: [{value: 'all', label: 'All'}, {value: 'invoice', label: 'Invoice Wise'}] },
    { name: 'productType', label: 'Product Type', type: 'radio', options: [{value: 'all', label: 'All'}, { value: 'lubricants', label: 'Lubricants' }, { value: 'liquids', label: 'Liquids' }] },
  ];
  return <ReportFilterForm title="Product Purchase" fields={fields} />;
};

export default PurchaseReport;