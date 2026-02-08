import React from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';
import useLocalStorage from '@/hooks/useLocalStorage';

const BowserTransactionsReport = () => {
  const [creditParties] = useLocalStorage('creditParties', []);
  const partyOptions = creditParties.map(p => ({ value: p.id, label: p.organizationName }));

  const fields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'party', label: 'Party', type: 'select', options: partyOptions },
    { name: 'bowserList', label: 'Bowser List', type: 'select', options: [{value: 'b1', label: 'Bowser 1'}] },
    { name: 'chooseBowser', label: 'Choose Bowser', type: 'text' },
  ];
  return <ReportFilterForm title="Bowser Transactions" fields={fields} />;
};

export default BowserTransactionsReport;