import React from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';
import useLocalStorage from '@/hooks/useLocalStorage';

const InterestTransactionReport = () => {
    const [creditParties] = useLocalStorage('creditParties', []);
    const partyOptions = creditParties.map(p => ({ value: p.id, label: p.organizationName }));

  const fields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'party', label: 'Party', type: 'select', options: partyOptions },
    { name: 'user', label: 'User', type: 'select', options: [] },
  ];
  return <ReportFilterForm title="Interest Transactions" fields={fields} />;
};

export default InterestTransactionReport;