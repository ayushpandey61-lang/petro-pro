import React from 'react';
import { Helmet } from 'react-helmet-async';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';

const CreditLimitReportsPage = () => {
    const fields = [
        { name: 'fromParty', label: 'From Party', type: 'select', options: [] },
        { name: 'toDate', label: 'To Date', type: 'date' },
    ];
  return (
    <>
      <Helmet>
        <title>Credit Limit Reports - PetroPro</title>
        <meta name="description" content="Generate and view credit limit reports." />
      </Helmet>
      <div className="p-6">
        <ReportFilterForm title="Credit Limit Constant Report" fields={fields} />
      </div>
    </>
  );
};

export default CreditLimitReportsPage;