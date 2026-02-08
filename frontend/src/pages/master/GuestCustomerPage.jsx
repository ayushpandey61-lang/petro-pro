import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import GuestCustomerForm from '@/pages/master/forms/GuestCustomerForm';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const StatusBadge = ({ active }) => (
  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
    active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }`}>
    {active ? 'ACTIVATED' : 'DEACTIVATED'}
  </span>
);

const GuestCustomerPage = () => {
  const [customers, setCustomers] = useLocalStorage('guestCustomers', []);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const { toast } = useToast();

  const handleSave = (customerData) => {
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...c, ...customerData } : c));
      toast({ title: "Success", description: "Guest customer updated successfully." });
    } else {
      setCustomers([...customers, { ...customerData, id: `GC-${Date.now()}`, status: true, created: new Date().toLocaleString() }]);
      toast({ title: "Success", description: "Guest customer added successfully." });
    }
    setEditingCustomer(null);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
  };
  
  const handleDelete = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
    toast({ title: "Success", description: "Guest customer deleted successfully." });
  };
  
  const columns = [
    { accessorKey: "id", header: "S.No" },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "customerName", header: "Name" },
    { accessorKey: "mobileNumber", header: "Number" },
    { accessorKey: "discountAmount", header: "Offer Amount" },
    { 
      accessorKey: "vehicles", 
      header: "Vehicle Number",
      cell: ({ row }) => row.original.vehicles.map(v => v.vehicleNo).join(', ')
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
        <div className="text-xs">
          <p>Created: {row.original.created}</p>
        </div>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(customer)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(customer.id)} className="text-destructive">
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
        <title>Guest Customers - PetroPro</title>
        <meta name="description" content="Manage guest customers and their vehicles." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6"
      >
        <GuestCustomerForm onSave={handleSave} customer={editingCustomer} />
        <Card className="glass">
          <CardContent className="pt-6">
            <DataTable columns={columns} data={customers} filterColumn="customerName" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default GuestCustomerPage;