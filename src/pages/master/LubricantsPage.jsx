import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import LubricantForm from '@/pages/master/forms/LubricantForm';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';

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

const LubricantsPage = () => {
  const [lubricants, setLubricants] = useLocalStorage('lubricants', []);
  const [editingLubricant, setEditingLubricant] = useState(null);
  const { toast } = useToast();

  const handleSave = (lubricantData) => {
    if (editingLubricant) {
      setLubricants(lubricants.map(l => l.id === editingLubricant.id ? { ...l, ...lubricantData, modified: new Date().toLocaleString() } : l));
      toast({ title: "Success", description: "Lubricant updated successfully." });
    } else {
      setLubricants([...lubricants, { ...lubricantData, id: `LUBE-${Date.now()}`, status: true, created: new Date().toLocaleString() }]);
      toast({ title: "Success", description: "Lubricant added successfully." });
    }
    setEditingLubricant(null);
  };
  
  const handleEdit = (lubricant) => {
    setEditingLubricant(lubricant);
  };

  const handleDelete = (id) => {
    setLubricants(lubricants.filter(l => l.id !== id));
    toast({ title: "Success", description: "Lubricant deleted successfully." });
  };

  const toggleStatus = (id) => {
    setLubricants(lubricants.map(l => l.id === id ? { ...l, status: !l.status, modified: new Date().toLocaleString() } : l));
    toast({ title: "Status Updated", description: "Lubricant status has been toggled." });
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
    { accessorKey: "productName", header: "Product Name" },
    { accessorKey: "gst", header: "GST(%)" },
    { accessorKey: "hsnCode", header: "HSN Code" },
    { accessorKey: "mrpRate", header: "MRP Rate" },
    { accessorKey: "saleRate", header: "Sale Rate" },
    { accessorKey: "minQuantity", header: "Minimum Quantity" },
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
        const lubricant = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(lubricant)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(lubricant.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: 'logs',
      header: 'User Log Details',
      cell: ({ row }) => (
        <div className="text-xs">
          <p>Created: {row.original.created}</p>
          {row.original.modified && <p>Modified: {row.original.modified}</p>}
        </div>
      )
    },
  ];

  return (
    <>
      <Helmet>
        <title>Lubricant Management - PetroPro</title>
        <meta name="description" content="Manage your lubricant products, stock, and pricing." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6"
      >
        <LubricantForm onSave={handleSave} lubricant={editingLubricant} />
        <Card className="glass">
           <CardHeader>
            <CardTitle>Lubricants List</CardTitle>
            <CardDescription>A list of all lubricant products.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={lubricants} filterColumn="productName" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default LubricantsPage;