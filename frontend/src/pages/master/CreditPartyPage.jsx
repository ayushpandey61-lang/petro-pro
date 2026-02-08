import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { MoreHorizontal, Edit, Trash2, Truck, Eye, User, Mail, Phone, MapPin, Percent, CreditCard, DollarSign, Calendar, Image as ImageIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import CreditPartyForm from '@/pages/master/forms/CreditPartyForm';
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

const CreditPartyPage = () => {
  const [creditParties, setCreditParties] = useLocalStorage('creditParties', []);
  const [editingParty, setEditingParty] = useState(null);
  const { toast } = useToast();

  const handleSave = (partyData) => {
    if (editingParty) {
      setCreditParties(creditParties.map(p => p.id === editingParty.id ? { ...p, ...partyData, modified: new Date().toLocaleString() } : p));
      toast({ title: "Success", description: "Credit party updated successfully." });
    } else {
      setCreditParties([...creditParties, { ...partyData, id: `CP-${Date.now()}`, status: true, created: new Date().toLocaleString() }]);
      toast({ title: "Success", description: "Credit party added successfully." });
    }
    setEditingParty(null);
  };
  
  const handleEdit = (party) => {
    setEditingParty(party);
  };

  const handleDelete = (id) => {
    setCreditParties(creditParties.filter(p => p.id !== id));
    toast({ title: "Success", description: "Credit party deleted successfully." });
  };

  const toggleStatus = (id) => {
    setCreditParties(creditParties.map(p => p.id === id ? { ...p, status: !p.status, modified: new Date().toLocaleString() } : p));
    toast({ title: "Status Updated", description: "Credit party status has been toggled." });
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
    {
      accessorKey: "date",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>Date</span>
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-sm">{row.original.date || 'N/A'}</span>
      )
    },
    {
      accessorKey: "representativeName",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span>Representative</span>
        </div>
      )
    },
    {
      accessorKey: "organizationName",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <span>Organisation Name</span>
        </div>
      )
    },
    {
      accessorKey: "image",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <ImageIcon className="h-4 w-4" />
          <span>Image</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          {row.original.image ? (
            <img
              src={row.original.image}
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-500" />
            </div>
          )}
        </div>
      ),
      enableSorting: false
    },
    {
      accessorKey: "gstNo",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <span>GST No</span>
        </div>
      )
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <Phone className="h-4 w-4" />
          <span>Phone No</span>
        </div>
      )
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <Mail className="h-4 w-4" />
          <span>Email</span>
        </div>
      )
    },
    {
      accessorKey: "discount",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <Percent className="h-4 w-4" />
          <span>Discount</span>
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-sm">{row.original.discount || '0'}%</span>
      )
    },
    {
      accessorKey: "openingBalance",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <span>₹</span>
          <span>Opening Balance</span>
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-sm">₹{row.original.openingBalance || '0.00'}</span>
      )
    },
    {
      accessorKey: "advance",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <CreditCard className="h-4 w-4" />
          <span>Advance</span>
        </div>
      )
    },
    {
      accessorKey: "creditLimit",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <span>Limit</span>
        </div>
      )
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span>Address</span>
        </div>
      )
    },
    {
      accessorKey: "vehicles",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <Truck className="h-4 w-4" />
          <span>Vehicles</span>
        </div>
      ),
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // Handle show vehicles list
            toast({ title: "Vehicles", description: `Showing vehicles for ${row.original.representativeName || row.original.organizationName}` });
          }}
          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          title="Show all vehicles"
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
      enableSorting: false
    },
    {
      accessorKey: "loginCredentials",
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span>Login Credential</span>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-xs">
          <p>Username: {row.original.username || 'N/A'}</p>
          <p>Password: {row.original.password ? '••••••••' : 'N/A'}</p>
        </div>
      ),
      enableSorting: false
    },
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
      header: "ACTIONS",
      enableSorting: false,
      cell: ({ row }) => {
        const party = row.original;
        return (
          <div className="flex items-center gap-1">
            {/* Edit Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(party)}
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title="Edit customer"
            >
              <Edit className="h-4 w-4" />
            </Button>

            {/* Delete Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(party.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Delete customer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: 'logs',
      header: 'User Log',
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
        <title>Credit Customer Management - PetroPro</title>
        <meta name="description" content="Manage your credit customers, their limits, and balances." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6"
      >
        <CreditPartyForm onSave={handleSave} party={editingParty} />
        <Card className="glass">
          <CardHeader>
            <CardTitle>Credit Customer List</CardTitle>
            <CardDescription>A list of all credit customers.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6">
              <DataTable columns={columns} data={creditParties} filterColumn="representativeName" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default CreditPartyPage;