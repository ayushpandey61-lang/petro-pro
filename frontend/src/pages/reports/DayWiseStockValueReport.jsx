import React from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';

const DayWiseStockValueReport = () => {
  const fields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'productType', label: 'Product Type', type: 'radio', options: [{value: 'liquid', label: 'Liquid'}, {value: 'lubricants', label: 'Lubricants'}] },
  ];

  return <ReportFilterForm title="Day Wise Stock Value" fields={fields} />;
};

export default DayWiseStockValueReport;