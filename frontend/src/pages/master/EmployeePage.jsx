import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MoreHorizontal, Edit, Trash2, ToggleLeft, ToggleRight, UserPlus, FileCode as FileId, User, Image as ImageIcon, Phone, DollarSign, CreditCard, MapPin, FileText, Calendar, CreditCard as AadharIcon } from 'lucide-react';
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
      header: "S.No.",
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        return <span className="font-mono text-sm">{pageIndex * pageSize + row.index + 1}</span>;
      }
    },
    {
      accessorKey: "employeeName",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span>Emp Name</span>
        </div>
      )
    },
    {
      accessorKey: "employeeNumber",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <span>Emp Num</span>
        </div>
      )
    },
    {
      accessorKey: "photo",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <ImageIcon className="h-4 w-4" />
          <span>Image</span>
        </div>
      ),
      cell: ({ row }) => {
        const photo = row.original.photo;
        return photo ? (
          <img
            src={photo}
            alt={row.original.employeeName}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-4 w-4 text-gray-500" />
          </div>
        );
      },
      enableSorting: false
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <Phone className="h-4 w-4" />
          <span>Mobile Num</span>
        </div>
      )
    },
    {
      accessorKey: "salary",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4" />
          <span>Salary</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-sm">
          <div>₹{row.original.salaryAmount || '0.00'}</div>
          <div className="text-xs text-gray-500">{row.original.salaryType || 'Monthly'}</div>
        </div>
      ),
      enableSorting: false
    },
    {
      accessorKey: "pfEsiIt",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <CreditCard className="h-4 w-4" />
          <span>PF/ESI/IT</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-xs">
          <div>PF: {row.original.pfAmount || '0.00'}</div>
          <div>ESI: {row.original.esiAmount || '0.00'}</div>
          <div>IT: {row.original.itAmount || '0.00'}</div>
        </div>
      ),
      enableSorting: false
    },
    {
      accessorKey: "aadharNumber",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <AadharIcon className="h-4 w-4" />
          <span>Adhar Num</span>
        </div>
      )
    },
    {
      accessorKey: "designation",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <span>Designation</span>
        </div>
      )
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span>Address</span>
        </div>
      )
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          <span>Description</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-xs max-w-32 truncate" title={row.original.description}>
          {row.original.description || 'No description'}
        </div>
      ),
      enableSorting: false
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Switch
          checked={row.original.status}
          onCheckedChange={() => toggleStatus(row.original.id)}
        />
      )
    },
    {
      id: "actions",
      header: "ACTION",
      enableSorting: false,
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex items-center gap-1">
            {/* Edit Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(employee)}
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title="Edit employee"
            >
              <Edit className="h-4 w-4" />
            </Button>

            {/* Delete Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(employee.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Delete employee"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: 'logs',
      header: 'User Log',
      cell: ({ row }) => (
        <div className="text-xs">
          <p>Created: {row.original.created || 'N/A'}</p>
          {row.original.modified && <p>Modified: {row.original.modified}</p>}
        </div>
      )
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

        <Card className="overflow-hidden">
           <CardHeader className="pb-4">
             <CardTitle className="text-xl font-semibold">Employee List</CardTitle>
             <CardDescription>A comprehensive list of all employees in your organization.</CardDescription>
           </CardHeader>
           <CardContent className="p-0">
             <div className="px-6 pb-6">
               <DataTable columns={columns} data={employees} filterColumn="employeeName" />
             </div>
           </CardContent>
         </Card>
      </motion.div>
    </>
  );
};

export default EmployeePage;