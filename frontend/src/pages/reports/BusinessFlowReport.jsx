import React from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';

const BusinessFlowReport = () => {
  const fields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'transactionType', label: 'Transaction Type', type: 'select', options: [{value: 'debit', label: 'Debit'}, {value: 'credit', label: 'Credit'}] },
    { name: 'chooseOption', label: 'Choose Option', type: 'select', options: [] },
    { name: 'party', label: 'Party', type: 'select', options: [] },
  ];
  return <ReportFilterForm title="All Transactions" fields={fields} />;
};

export default BusinessFlowReport;