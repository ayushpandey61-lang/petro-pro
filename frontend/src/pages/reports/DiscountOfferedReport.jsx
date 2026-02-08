import React from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';

const DiscountOfferedReport = () => {
  const fields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'rate', label: 'Rate', type: 'text' },
  ];
  return <ReportFilterForm title="Discount Report" fields={fields} />;
};

export default DiscountOfferedReport;