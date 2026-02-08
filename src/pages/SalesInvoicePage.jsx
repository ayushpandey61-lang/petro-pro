import React from 'react';
import { Helmet } from 'react-helmet-async';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';
import useLocalStorage from '@/hooks/useLocalStorage';

const SalesInvoicePage = () => {
  const [creditParties] = useLocalStorage('creditParties', []);
  const partyOptions = creditParties.map(p => ({ value: p.id, label: p.organizationName }));

  const fields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'organization', label: 'Organization', type: 'select', options: partyOptions },
    { name: 'vehicle', label: 'Vehicle', type: 'select', options: [] },
  ];

  return (
    <>
      <Helmet>
        <title>Generate Sales Invoice - PetroPro</title>
        <meta name="description" content="Generate and print sales invoices." />
      </Helmet>
      <div className="p-6">
        <ReportFilterForm title="Generate Credit Bill" fields={fields} />
      </div>
    </>
  );
};

export default SalesInvoicePage;