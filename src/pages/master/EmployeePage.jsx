import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MoreHorizontal, Edit, Trash2, ToggleLeft, ToggleRight, UserPlus, FileCode as FileId } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import EmployeeForm from '@/pages/master/forms/EmployeeForm';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';

const EmployeePage = () => {
  const [employees, setEmployees] = useLocalStorage('employees', []);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSave = (employeeData) => {
    if (editingEmployee) {
      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? { ...emp, ...employeeData } : emp));
      toast({ title: "Success", description: "Employee updated successfully." });
    } else {
      setEmployees([...employees, { ...employeeData, id: `EMP-${Date.now()}`, status: true }]);
      toast({ title: "Success", description: "Employee added successfully." });
    }
    setEditingEmployee(null);
    setIsFormOpen(false);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  }

  const handleDelete = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    toast({ title: "Success", description: "Employee deleted successfully." });
  };
  const toggleStatus = (id) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, status: !emp.status } : emp));
    toast({ title: "Status Updated", description: "Employee status has been toggled." });
  };

  const handleGenerateIdCard = (employee) => {
    navigate('/id-card-generator', { state: { employeeId: employee.id } });
  };
  
  const columns = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "S.No",
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        return <span className="font-mono text-sm">{pageIndex * pageSize + row.index + 1}</span>;
      }
    },
    {
      accessorKey: "photo",
      header: "Photo",
      cell: ({ row }) => {
        const photo = row.original.photo;
        return photo ? <img src={photo} alt={row.original.employeeName} className="h-10 w-10 rounded-full object-cover"/> : <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs">No img</div>
      }
    },
    { accessorKey: "employeeName", header: "Emp Name" },
    { accessorKey: "employeeNumber", header: "Emp ID" },
    { accessorKey: "phone", header: "Mobile" },
    { accessorKey: "designation", header: "Designation" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Switch checked={row.original.status} onCheckedChange={() => toggleStatus(row.original.id)} /> },
    {
      id: "actions",
      cell: ({ row }) => {
        const employee = row.original;
        return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(employee)}><Edit className="mr-2 h-4 w-4" /><span>Edit</span></DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleGenerateIdCard(employee)}><FileId className="mr-2 h-4 w-4" /><span>Generate ID Card</span></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toggleStatus(employee.id)}>{employee.status ? <ToggleLeft className="mr-2 h-4 w-4" /> : <ToggleRight className="mr-2 h-4 w-4" />}<span>{employee.status ? 'Deactivate' : 'Activate'}</span></DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(employee.id)} className="text-destructive hover:!text-destructive-foreground hover:!bg-destructive"><Trash2 className="mr-2 h-4 w-4" /><span>Delete</span></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>Employee Master - PetroPro</title>
        <meta name="description" content="Manage your employees' data, including profiles and ID cards." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6 space-y-6"
      >
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Employee Management</h1>
            <Button onClick={handleAddNew}><UserPlus className="mr-2 h-4 w-4"/>Add New Employee</Button>
        </div>

        {isFormOpen && (
            <EmployeeForm onSave={handleSave} employee={editingEmployee} onCancel={() => setIsFormOpen(false)} />
        )}

        <Card>
           <CardHeader>
            <CardTitle>Employee List</CardTitle>
            <CardDescription>A comprehensive list of all employees in your organization.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={employees} filterColumn="employeeName" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default EmployeePage;