import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import SwipeMachineForm from '@/pages/master/forms/SwipeMachineForm';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

const StatusBadge = ({ active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-2 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
      active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
    }`}
    title={active ? 'Click to deactivate' : 'Click to activate'}
  >
    {active ? 'ACTIVATED' : 'DEACTIVATED'}
  </button>
);

const SwipeMachinePage = () => {
  const [machines, setMachines] = useLocalStorage('swipeMachines', []);
  const [editingMachine, setEditingMachine] = useState(null);
  const { toast } = useToast();

  const handleSave = (machineData) => {
    if (editingMachine) {
      setMachines(machines.map(m => m.id === editingMachine.id ? { ...m, ...machineData } : m));
      toast({ title: "Success", description: "Swipe machine updated successfully." });
    } else {
      setMachines([...machines, { ...machineData, id: `SM-${Date.now()}`, status: true }]);
      toast({ title: "Success", description: "Swipe machine added successfully." });
    }
    setEditingMachine(null);
  };

  const handleEdit = (machine) => {
    setEditingMachine(machine);
  };
  
  const handleDelete = (id) => {
    setMachines(machines.filter(m => m.id !== id));
    toast({ title: "Success", description: "Swipe machine deleted successfully." });
  };

  const toggleStatus = (id) => {
    setMachines(machines.map(m => m.id === id ? { ...m, status: !m.status } : m));
    toast({ title: "Status Updated", description: "Swipe machine status has been toggled." });
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
    { accessorKey: "machineName", header: "Machine Name" },
    { accessorKey: "accountType", header: "A/c Type" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          active={row.original.status}
          onClick={() => toggleStatus(row.original.id)}
        />
      )
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const machine = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(machine)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(machine.id)} className="text-destructive">
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
        <title>Swipe Machines - PetroPro</title>
        <meta name="description" content="Manage swipe machines and their account types." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6"
      >
        <SwipeMachineForm onSave={handleSave} machine={editingMachine} />
        <Card className="glass">
          <CardContent className="pt-6">
            <div className="overflow-auto max-h-96">
              <div className="min-w-max">
                <DataTable columns={columns} data={machines} filterColumn="machineName" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default SwipeMachinePage;