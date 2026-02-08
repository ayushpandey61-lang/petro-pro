import React from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';
import useLocalStorage from '@/hooks/useLocalStorage';

const ExpenditureReport = () => {
    const [expenseTypes] = useLocalStorage('expenseTypes', []);
    const expenseTypeOptions = expenseTypes.map(e => ({ value: e.id, label: e.expenseType }));

  const fields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'expenditureType', label: 'Expenditure Type', type: 'select', options: [{ value: 'all', label: 'All' }, ...expenseTypeOptions] },
    { name: 'groupType', label: 'Group By', type: 'radio', options: [{value: 'shiftwise', label: 'Shift Wise'}, {value: 'inflow_outflow', label: 'Inflow/Outflow'}] },
  ];
  return <ReportFilterForm title="Expenditure" fields={fields} />;
};

export default ExpenditureReport;