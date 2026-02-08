import React from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';

const LubricantsStockReport = () => {
  const fields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
  ];
  return <ReportFilterForm title="Lubricants Open/Closing Stock" fields={fields} />;
};

export default LubricantsStockReport;