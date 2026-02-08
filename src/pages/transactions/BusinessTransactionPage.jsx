import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import BusinessTransactionForm from '@/pages/transactions/forms/BusinessTransactionForm';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const BusinessTransactionPage = () => {
  const [transactions, setTransactions] = useLocalStorage('businessTransactions', []);
  const { toast } = useToast();

  const handleSave = (transactionData) => {
    setTransactions([...transactions, { ...transactionData, id: `BT-${Date.now()}`, created: new Date().toLocaleString() }]);
    toast({ title: "Success", description: "Transaction saved successfully." });
  };

  const columns = [
    { accessorKey: "id", header: "S.No." },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "partyName", header: "Party" },
    { 
      id: 'credit',
      header: 'Credit (From)',
      cell: ({ row }) => row.original.flowType === 'Credit' ? `₹${parseFloat(row.original.amount).toLocaleString('en-IN')}` : '-'
    },
    { 
      id: 'debit',
      header: 'Debit (To)',
      cell: ({ row }) => row.original.flowType === 'Debit' ? `₹${parseFloat(row.original.amount).toLocaleString('en-IN')}` : '-'
    },
    { accessorKey: "description", header: "Description" },
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
        <title>Business Debit/Credit - PetroPro</title>
        <meta name="description" content="Manage business debit and credit transactions." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6"
      >
        <BusinessTransactionForm onSave={handleSave} />
        <Card className="glass">
          <CardContent className="pt-6">
            <DataTable columns={columns} data={transactions} filterColumn="partyName" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default BusinessTransactionPage;