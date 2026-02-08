import React from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';

const StockVariationReport = () => {
  const fields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
  ];
  return <ReportFilterForm title="Stock Variations" fields={fields} />;
};

export default StockVariationReport;