import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import VendorTransactionForm from '@/pages/transactions/forms/VendorTransactionForm';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const VendorTransactionPage = () => {
  const [transactions, setTransactions] = useLocalStorage('vendorTransactions', []);
  const { toast } = useToast();

  const handleSave = (transactionData) => {
    setTransactions([...transactions, { ...transactionData, id: `VT-${Date.now()}`, created: new Date().toLocaleString() }]);
    toast({ title: "Success", description: "Vendor transaction saved successfully." });
  };

  const columns = [
    { accessorKey: "id", header: "S.No." },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "vendorName", header: "Vendor" },
    { 
      id: 'credit',
      header: 'Credit',
      cell: ({ row }) => row.original.creditDebit === 'Credit' ? `₹${parseFloat(row.original.amount).toLocaleString('en-IN')}` : '-'
    },
    { 
      id: 'debit',
      header: 'Debit',
      cell: ({ row }) => row.original.creditDebit === 'Debit' ? `₹${parseFloat(row.original.amount).toLocaleString('en-IN')}` : '-'
    },
    { accessorKey: "description", header: "By Description" },
    {
      id: "action",
      header: "Action",
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    {
      id: 'userlog',
      header: 'User Log',
      cell: ({ row }) => <div className="text-xs">Created: {row.original.created}</div>
    }
  ];

  return (
    <>
      <Helmet>
        <title>Vendor Transactions - PetroPro</title>
        <meta name="description" content="Manage transactions with vendors." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6"
      >
        <VendorTransactionForm onSave={handleSave} />
        <Card className="glass">
          <CardContent className="pt-6">
            <DataTable columns={columns} data={transactions} filterColumn="vendorName" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default VendorTransactionPage;