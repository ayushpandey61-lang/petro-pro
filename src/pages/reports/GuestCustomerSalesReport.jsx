import React from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';

const GuestCustomerSalesReport = () => {
  const fields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'mobileNumber', label: 'Mobile Number', type: 'text' },
    { name: 'billWise', label: 'Bill Wise', type: 'checkbox' },
  ];
  return <ReportFilterForm title="Guest Customer Sales" fields={fields} />;
};

export default GuestCustomerSalesReport;