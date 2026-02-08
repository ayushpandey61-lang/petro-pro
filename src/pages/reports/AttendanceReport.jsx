import React, { useState } from 'react';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';
import ReportGenerator from '@/components/reports/ReportGenerator';
import useLocalStorage from '@/hooks/useLocalStorage';

const AttendanceReport = () => {
  const [employees] = useLocalStorage('employees', []);
  const [attendanceData] = useLocalStorage('attendance', []); // Assuming attendance is stored
  const [filteredData, setFilteredData] = useState(null);

  const employeeOptions = employees.map(e => ({ value: e.id, label: e.employeeName }));
  
  const fields = [
    { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
    { name: 'employee', label: 'Employee Name', type: 'select', options: employeeOptions },
    { name: 'shiftWise', label: 'Shift Wise', type: 'checkbox' },
  ];

  const handleFilterSubmit = (filters) => {
    // This is mock data generation. Replace with actual filtering.
    const data = attendanceData.filter(att => {
        let match = true;
        if(filters.employee && att.employeeId !== filters.employee) match = false;
        // Add date range filtering
        return match;
    }).map(att => ({
        employee: employees.find(e => e.id === att.employeeId)?.employeeName || 'N/A',
        date: att.date,
        status: att.status,
    }));

    setFilteredData({ data, organization: filters.organization });
  };

  const headers = [
      { key: 'employee', label: 'Employee' },
      { key: 'date', label: 'Date' },
      { key: 'status', label: 'Status' }
  ];

  return (
    <>
      <ReportFilterForm title="Staff Attendance" fields={fields} onSubmit={handleFilterSubmit} />
      {filteredData && <ReportGenerator title="Staff Attendance Report" headers={headers} data={filteredData.data} organization={filteredData.organization} />}
    </>
  );
};

export default AttendanceReport;