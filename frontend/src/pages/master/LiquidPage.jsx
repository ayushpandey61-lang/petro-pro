import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { MoreHorizontal, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import LiquidForm from '@/pages/master/forms/LiquidForm';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const StatusBadge = ({ active }) => (
  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
    active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }`}>
    {active ? 'ACTIVE' : 'INACTIVE'}
  </span>
);

const LiquidPage = () => {
  const [liquids, setLiquids] = useLocalStorage('liquids', []);
  const [editingLiquid, setEditingLiquid] = useState(null);
  const { toast } = useToast();

  const handleSave = (liquidData) => {
    if (editingLiquid) {
      setLiquids(liquids.map(l => l.id === editingLiquid.id ? {
        ...l,
        ...liquidData,
        modified: new Date().toLocaleString()
      } : l));
      toast({ title: "Success", description: "Liquid product updated successfully." });
    } else {
      setLiquids([...liquids, {
        ...liquidData,
        id: `LIQ-${Date.now()}`,
        status: true,
        created: new Date().toLocaleString()
      }]);
      toast({ title: "Success", description: "Liquid product added successfully." });
    }
    setEditingLiquid(null);
  };

  const handleEdit = (liquid) => {
    setEditingLiquid(liquid);
  };

  const handleDelete = (id) => {
    setLiquids(liquids.filter(l => l.id !== id));
    toast({ title: "Success", description: "Liquid product deleted successfully." });
  };

  const handleToggleStatus = (id) => {
    const updatedLiquids = liquids.map(l =>
      l.id === id ? { ...l, status: !l.status, modified: new Date().toLocaleString() } : l
    );
    setLiquids(updatedLiquids);
    toast({
      title: "Success",
      description: "Liquid product status updated successfully."
    });
  };

  const columns = [
    {
      accessorKey: "id",
      header: "S.No",
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.id}</span>
    },
    {
      accessorKey: "productName",
      header: "Product Name",
      cell: ({ row }) => <span className="font-medium">{row.original.productName}</span>
    },
    { accessorKey: "shortName", header: "Short Name" },
    {
      accessorKey: "vat",
      header: "VAT (%)",
      cell: ({ row }) => <span>{row.original.vat}%</span>
    },
    {
      accessorKey: "tcs",
      header: "TCS (%)",
      cell: ({ row }) => <span>{row.original.tcs}%</span>
    },
    {
      accessorKey: "gst",
      header: "GST (%)",
      cell: ({ row }) => <span>{row.original.gst}%</span>
    },
    {
      accessorKey: "lfr_kl",
      header: "LFR/KL",
      cell: ({ row }) => <span className="font-mono">{row.original.lfr_kl}</span>
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge active={row.original.status} />
    },
    {
      accessorKey: 'logs',
      header: 'User Log Details',
      cell: ({ row }) => (
        <div className="text-xs text-muted-foreground">
          <p>Created: {row.original.created}</p>
          {row.original.modified && <p>Modified: {row.original.modified}</p>}
        </div>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const liquid = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(liquid)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Liquid Product</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{liquid.productName}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(liquid.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>Liquid Products Management - PetroPro</title>
        <meta name="description" content="Manage liquid fuel products with VAT, TCS, GST rates." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6"
      >
        <LiquidForm
          onSave={handleSave}
          liquid={editingLiquid}
          onCancel={() => setEditingLiquid(null)}
        />

        <Card className="glass">
          <CardHeader>
            <CardTitle>Liquid Products List</CardTitle>
            <CardDescription>
              Manage liquid fuel products with tax rates and status controls.
              Total: {liquids.length} products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={liquids}
              filterColumn="productName"
              searchPlaceholder="Search liquid products..."
            />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default LiquidPage;