import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import ExpensesForm from '@/pages/day-business/forms/ExpensesForm';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { QuickLinks } from './components/QuickLinks';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useLocalStorage('expenses', []);
  const [editingExpense, setEditingExpense] = useState(null);
  const { toast } = useToast();

  const handleSave = (expenseData) => {
    if (editingExpense) {
      setExpenses(expenses.map(exp => exp.id === editingExpense.id ? { ...exp, ...expenseData } : exp));
      toast({ title: "Success", description: "Expense updated successfully." });
    } else {
      setExpenses([...expenses, { ...expenseData, id: `EXP-${Date.now()}`, created: new Date().toISOString(), updated: new Date().toISOString() }]);
      toast({ title: "Success", description: "Expense saved successfully." });
    }
    setEditingExpense(null);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
    toast({ title: "Success", description: "Expense deleted successfully." });
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
    { accessorKey: "date", header: "Date" },
    { accessorKey: "shiftName", header: "Shift" },
    { accessorKey: "expenseTypeName", header: "Expense Type" },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "employeeName", header: "Employee" },
    { accessorKey: "description", header: "Description" },
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
      accessorKey: 'userLog',
      header: 'User Log Details',
      cell: ({ row }) => (
        <div className="text-xs">
          <p>Created: {new Date(row.original.created || row.original.date).toLocaleString()}</p>
          <p>Updated: {new Date(row.original.updated || row.original.date).toLocaleString()}</p>
        </div>
      )
    },
  ];

  return (
    <>
      <Helmet>
        <title>Expenses - PetroPro</title>
        <meta name="description" content="Manage and track business expenses." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6 space-y-6"
      >
        <QuickLinks />

        <ExpensesForm onSave={handleSave} expense={editingExpense} onCancel={() => setEditingExpense(null)} />
        <Card className="glass">
          <CardContent className="pt-6">
            <div className="overflow-auto max-h-96">
              <div className="min-w-max">
                <DataTable
                  columns={columns}
                  data={expenses}
                  filterColumn="expenseTypeName"
                  onDelete={(ids) => {
                    setExpenses(expenses.filter(exp => !ids.includes(exp.id)));
                    toast({variant: "destructive", title: "Deleted", description: "Selected expenses deleted."});
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default ExpensesPage;