import React from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const EmployeeStatusReport = () => {
  const [employees] = useLocalStorage('employees', []);
  const employeeOptions = employees.map(e => ({ value: e.id, label: e.employeeName }));
  
  const transactionsFields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'employee', label: 'Choose Employee', type: 'select', options: employeeOptions },
    { name: 'groupBy', label: 'Group By', type: 'radio', options: [{value: 'employee', label: 'Employee'}, {value: 'shift', label: 'Shift'}] },
  ];

  const attendanceFields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'employee', label: 'Employee Name', type: 'select', options: employeeOptions },
    { name: 'groupBy', label: 'Group By', type: 'radio', options: [
        {value: 'advance', label: 'Advance/Salary'},
        {value: 'workpumps', label: 'Work Pumps'},
        {value: 'shortage', label: 'Shortage'},
    ]},
  ];

  return (
    <Accordion type="multiple" defaultValue={['item-1']} className="w-full space-y-4">
      <AccordionItem value="item-1">
        <AccordionTrigger className="font-semibold">Employee Transactions</AccordionTrigger>
        <AccordionContent>
          <ReportFilterForm title="Employee Transactions" fields={transactionsFields} showTitle={false} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="font-semibold">Pump Attendance</AccordionTrigger>
        <AccordionContent>
          <ReportFilterForm title="Pump Attendance" fields={attendanceFields} showTitle={false} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default EmployeeStatusReport;