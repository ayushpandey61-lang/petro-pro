import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import ShiftForm from '@/pages/master/forms/ShiftForm';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

const ShiftPage = () => {
  const [shifts, setShifts] = useLocalStorage('shifts', []);
  const [editingShift, setEditingShift] = useState(null);
  const { toast } = useToast();

  const handleSave = (shiftData) => {
    if (editingShift) {
      setShifts(shifts.map(s => s.id === editingShift.id ? { ...s, ...shiftData } : s));
      toast({ title: "Success", description: "Shift updated successfully." });
    } else {
      setShifts([...shifts, { ...shiftData, id: `SHFT-${Date.now()}` }]);
      toast({ title: "Success", description: "Shift added successfully." });
    }
    setEditingShift(null);
  };

  const handleEdit = (shift) => {
    setEditingShift(shift);
  };
  
  const handleDelete = (id) => {
    setShifts(shifts.filter(s => s.id !== id));
    toast({ title: "Success", description: "Shift deleted successfully." });
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
    { accessorKey: "shiftName", header: "Shift Type" },
    { accessorKey: "fromTime", header: "From Time" },
    { accessorKey: "toTime", header: "To Time" },
    { accessorKey: "duties", header: "Duties" },
    {
      id: "actions",
      cell: ({ row }) => {
        const shift = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(shift)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(shift.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>Employee Shifts - PetroPro</title>
        <meta name="description" content="Manage employee work shifts." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6"
      >
        <ShiftForm onSave={handleSave} shift={editingShift} />
        <Card className="glass">
          <CardContent className="pt-6">
            <div className="overflow-auto max-h-96">
              <div className="min-w-max">
                <DataTable columns={columns} data={shifts} filterColumn="shiftName" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default ShiftPage;