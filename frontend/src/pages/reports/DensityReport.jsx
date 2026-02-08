import React from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';
import useLocalStorage from '@/hooks/useLocalStorage';

const DensityReport = () => {
  const [tanks] = useLocalStorage('tanks', []);
  const tankOptions = tanks.map(t => ({ value: t.id, label: t.tankName }));

  const fields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'tank', label: 'Choose Tank', type: 'select', options: tankOptions },
  ];

  return <ReportFilterForm title="Density Report" fields={fields} />;
};

export default DensityReport;