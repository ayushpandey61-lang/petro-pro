import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import SwipeForm from '@/pages/day-business/forms/SwipeForm';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { QuickLinks } from './components/QuickLinks';

const SwipePage = () => {
  const [swipes, setSwipes] = useLocalStorage('swipes', []);
  const [editingSwipe, setEditingSwipe] = useState(null);
  const { toast } = useToast();

  const handleSave = (swipeData) => {
    if (editingSwipe) {
      setSwipes(swipes.map(swipe => swipe.id === editingSwipe.id ? { ...swipe, ...swipeData, updated: new Date().toISOString() } : swipe));
      toast({ title: "Success", description: "Swipe transaction updated successfully." });
    } else {
      setSwipes([...swipes, { ...swipeData, id: `SWP-${Date.now()}`, created: new Date().toISOString(), updated: new Date().toISOString() }]);
      toast({ title: "Success", description: "Swipe transaction saved successfully." });
    }
    setEditingSwipe(null);
  };

  const handleEdit = (swipe) => {
    setEditingSwipe(swipe);
  };

  const handleDelete = (id) => {
    setSwipes(swipes.filter(swipe => swipe.id !== id));
    toast({ title: "Success", description: "Swipe transaction deleted successfully." });
  };

  const columns = useMemo(() => [
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
      header: "SI.No.",
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        return <span className="font-mono text-sm">{pageIndex * pageSize + row.index + 1}</span>;
      }
    },
    { accessorKey: "date", header: "Date", cell: ({ row }) => new Date(row.original.date).toLocaleDateString() },
    { accessorKey: "shiftName", header: "Shift" },
    { accessorKey: "employeeName", header: "Employee" },
    { accessorKey: "swipeMachineName", header: "Swipe Machine" },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "batchNo", header: "Batch No" },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)} title="Edit">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original.id)} title="Delete" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: 'updated',
      header: 'User Log Details',
      cell: ({ row }) => (
        <div className="text-xs">
          <p>Created: {new Date(row.original.created || row.original.date).toLocaleString()}</p>
          <p>Updated: {new Date(row.original.updated || row.original.date).toLocaleString()}</p>
        </div>
      )
    },
  ], [handleEdit, handleDelete]);

  return (
    <>
      <Helmet>
        <title>Swipe Transactions - PetroPro</title>
        <meta name="description" content="Manage and record swipe machine transactions." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6 space-y-6"
      >
        <QuickLinks />

        <SwipeForm onSave={handleSave} swipe={editingSwipe} onCancel={() => setEditingSwipe(null)} />
        <Card className="glass">
          <CardContent className="pt-6">
            <DataTable
              columns={columns}
              data={swipes}
              filterColumn="employeeName"
              onDelete={(ids) => {
                setSwipes(swipes.filter(swipe => !ids.includes(swipe.id)));
                toast({variant: "destructive", title: "Deleted", description: "Selected swipe transactions deleted."});
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default SwipePage;