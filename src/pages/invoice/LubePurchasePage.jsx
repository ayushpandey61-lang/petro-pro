import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import LubePurchaseForm from '@/pages/invoice/forms/LubePurchaseForm';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const LubePurchasePage = () => {
  const [purchases, setPurchases] = useLocalStorage('lubePurchases', []);
  const { toast } = useToast();

  const handleSave = (purchaseData) => {
    setPurchases([...purchases, { ...purchaseData, id: `LBP-${Date.now()}`, created: new Date().toLocaleString() }]);
    toast({ title: "Success", description: "Lube purchase saved successfully." });
  };

  const columns = [
    { accessorKey: "id", header: "Serial No." },
    { accessorKey: "invoiceDate", header: "Invoice Date" },
    { accessorKey: "invoiceNo", header: "Invoice No." },
    { 
      accessorKey: "image", 
      header: "Image",
      cell: ({ row }) => row.original.image ? <img src={row.original.image} alt="invoice" className="h-10 w-10 object-cover rounded-md" src="https://images.unsplash.com/photo-1542385153-28825501OTc3"/> : 'No Image'
    },
    { accessorKey: "vendorName", header: "Vendor" },
    { accessorKey: "description", header: "Description" },
    { 
      id: 'amount',
      header: 'Amount',
      cell: ({ row }) => `₹${parseFloat(row.original.totalAmount).toLocaleString('en-IN')}`
    },
    {
      id: 'view',
      header: 'View',
      cell: () => <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
    },
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
        <title>Lube Purchase - PetroPro</title>
        <meta name="description" content="Manage lubricant purchases and invoices." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6"
      >
        <LubePurchaseForm onSave={handleSave} />
        <Card className="glass">
          <CardContent className="pt-6">
            <DataTable columns={columns} data={purchases} filterColumn="vendorName" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default LubePurchasePage;