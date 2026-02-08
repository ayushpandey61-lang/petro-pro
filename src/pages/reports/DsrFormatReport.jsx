import React from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';
import useLocalStorage from '@/hooks/useLocalStorage';

const DsrFormatReport = () => {
  const [fuelProducts] = useLocalStorage('fuelProducts', []);
  const productOptions = fuelProducts.map(p => ({ value: p.id, label: p.productName }));

  const fields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'product', label: 'Choose Product', type: 'select', options: productOptions },
  ];
  return <ReportFilterForm title="DSR Format" fields={fields} />;
};

export default DsrFormatReport;