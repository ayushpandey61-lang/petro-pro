import React from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';
import useLocalStorage from '@/hooks/useLocalStorage';

const DailyRateHistoryReport = () => {
    const [fuelProducts] = useLocalStorage('fuelProducts', []);
    const productOptions = fuelProducts.map(p => ({ value: p.id, label: p.productName }));

  const fields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'product', label: 'Product', type: 'select', options: productOptions },
  ];
  return <ReportFilterForm title="Daily Sale History" fields={fields} />;
};

export default DailyRateHistoryReport;