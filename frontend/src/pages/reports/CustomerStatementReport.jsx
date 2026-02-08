import React from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';
import useLocalStorage from '@/hooks/useLocalStorage';

const CustomerStatementReport = () => {
    const [creditParties] = useLocalStorage('creditParties', []);
    const partyOptions = creditParties.map(p => ({ value: p.id, label: p.organizationName }));

  const fields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'organization', label: 'Organization', type: 'select', options: partyOptions },
    { name: 'liquids', label: 'Liquids', type: 'checkbox' },
    { name: 'lubricants', label: 'Lubricants', type: 'checkbox' },
    { name: 'recovery', label: 'Recovery', type: 'checkbox' },
    { name: 'af', label: 'AF', type: 'checkbox' },
  ];
  return <ReportFilterForm title="Customer Account Statement" fields={fields} />;
};

export default CustomerStatementReport;