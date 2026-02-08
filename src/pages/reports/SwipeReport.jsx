import React from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';

const SwipeReport = () => {
  const fields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'inputMode', label: 'Input Mode', type: 'select', options: [] },
    { name: 'batchWise', label: 'Batch Wise', type: 'checkbox' },
  ];
  return <ReportFilterForm title="Swipe" fields={fields} />;
};

export default SwipeReport;