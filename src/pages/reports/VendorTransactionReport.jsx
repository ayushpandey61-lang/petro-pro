import React from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';

const VendorTransactionReport = () => {
  const fields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'lubricants', label: 'Lubricants', type: 'checkbox' },
    { name: 'liquids', label: 'Liquids', type: 'checkbox' },
  ];
  return <ReportFilterForm title="Transactions" fields={fields} />;
};

export default VendorTransactionReport;