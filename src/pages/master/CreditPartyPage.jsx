import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
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
    { accessorKey: "organizationName", header: "Party Name" },
    { accessorKey: "creditLimit", header: "Credit Limit" },
    { accessorKey: "openingBalance", header: "Opening Balance" },
    { accessorKey: "phone", header: "Mobile" },
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
        const party = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(party)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(party.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          <CardContent>
            <div className="overflow-auto max-h-96">
              <div className="min-w-max">
                <DataTable columns={columns} data={creditParties} filterColumn="organizationName" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default CreditPartyPage;