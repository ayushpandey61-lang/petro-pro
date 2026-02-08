import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/ui/data-table';
import { MoreHorizontal, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
import FuelProductForm from '@/pages/master/forms/FuelProductForm';
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

const FuelProductPage = () => {
  const [products, setProducts] = useLocalStorage('fuelProducts', []);
  const [editingProduct, setEditingProduct] = useState(null);
  const { toast } = useToast();

  const handleSave = (productData) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productData, modified: new Date().toLocaleString() } : p));
      toast({ title: "Success", description: "Fuel product updated successfully." });
    } else {
      setProducts([...products, { ...productData, id: `PROD-${Date.now()}`, status: true, created: new Date().toLocaleString() }]);
      toast({ title: "Success", description: "Fuel product added successfully." });
    }
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };
  
  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
    toast({ title: "Success", description: "Fuel product deleted successfully." });
  };

  const handleToggleStatus = (id) => {
    const updatedProducts = products.map(p =>
      p.id === id ? { ...p, status: !p.status, modified: new Date().toLocaleString() } : p
    );
    setProducts(updatedProducts);
    toast({
      title: "Success",
      description: "Fuel product status updated successfully."
    });
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
    { accessorKey: "shortName", header: "Short Name" },
    { accessorKey: "vat", header: "VAT" },
    { accessorKey: "tcs", header: "TCS" },
    { accessorKey: "gst", header: "GST" },
    { accessorKey: "lfr_kl", header: "LFR/KL" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          active={row.original.status}
          onClick={() => handleToggleStatus(row.original.id)}
        />
      )
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-1">
            {/* Edit Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(product)}
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title="Edit product"
            >
              <Edit className="h-4 w-4" />
            </Button>

            {/* Delete Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Delete product"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Fuel Product</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{product.productName}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(product.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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
        <title>Fuel Product Management - PetroPro</title>
        <meta name="description" content="Manage your fuel products (liquids)." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6"
      >
        <FuelProductForm onSave={handleSave} product={editingProduct} />
        <Card className="glass">
          <CardHeader>
            <CardTitle>Fuel Product List</CardTitle>
            <CardDescription>A list of all fuel products.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={products} filterColumn="productName" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default FuelProductPage;