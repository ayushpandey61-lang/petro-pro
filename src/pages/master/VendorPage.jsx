import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import VendorForm from '@/pages/master/forms/VendorForm';
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

const VendorPage = () => {
  const [vendors, setVendors] = useLocalStorage('vendors', []);
  const [editingVendor, setEditingVendor] = useState(null);
  const { toast } = useToast();

  const handleSave = (vendorData) => {
    if (editingVendor) {
      setVendors(vendors.map(v => v.id === editingVendor.id ? { ...v, ...vendorData } : v));
      toast({ title: "Success", description: "Vendor updated successfully." });
    } else {
      setVendors([...vendors, { ...vendorData, id: `VEND-${Date.now()}`, status: true }]);
      toast({ title: "Success", description: "Vendor added successfully." });
    }
    setEditingVendor(null);
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
  };

  const handleDelete = (id) => {
    setVendors(vendors.filter(v => v.id !== id));
    toast({ title: "Success", description: "Vendor deleted successfully." });
  };

  const toggleStatus = (id) => {
    setVendors(vendors.map(v => v.id === id ? { ...v, status: !v.status } : v));
    toast({ title: "Status Updated", description: "Vendor status has been toggled." });
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
    { accessorKey: "vendorName", header: "Vendor Name" },
    { accessorKey: "phone", header: "Phone Num" },
    { accessorKey: "gstin", header: "GSTIN" },
    { accessorKey: "vendorType", header: "Type" },
    { accessorKey: "openingBalance", header: "Opening Balance" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "address", header: "Address" },
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
        const vendor = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(vendor)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(vendor.id)} className="text-destructive">
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
        <title>Vendor Management - PetroPro</title>
        <meta name="description" content="Manage your suppliers and vendors." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6"
      >
        <VendorForm onSave={handleSave} vendor={editingVendor} />
        <Card className="glass">
          <CardHeader>
            <CardTitle>Vendor List</CardTitle>
            <CardDescription>A list of all vendors.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto max-h-96">
              <div className="min-w-max">
                <DataTable columns={columns} data={vendors} filterColumn="vendorName" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default VendorPage;