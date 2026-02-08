import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import DailySaleRateForm from '@/pages/day-business/forms/DailySaleRateForm';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

const DailySaleRatePage = () => {
  const [rates, setRates] = useLocalStorage('dailySaleRates', []);
  const [editingRate, setEditingRate] = useState(null);
  const { toast } = useToast();

  const handleSave = (rateData) => {
    if (editingRate) {
      setRates(rates.map(r => r.id === editingRate.id ? { ...r, ...rateData, lastModified: new Date().toLocaleString() } : r));
      toast({ title: "Success", description: "Rates updated successfully." });
    } else {
      setRates([...rates, { ...rateData, id: `RATE-${Date.now()}`, status: true, created: new Date().toLocaleString() }]);
      toast({ title: "Success", description: "Rates saved successfully." });
    }
    setEditingRate(null);
  };

  const handleEdit = (rate) => {
    setEditingRate(rate);
  };

  const handleDelete = (id) => {
    setRates(rates.filter(r => r.id !== id));
    toast({ title: "Success", description: "Rate record deleted successfully." });
  };

  const toggleStatus = (id) => {
    setRates(rates.map(r => r.id === id ? { ...r, status: !r.status } : r));
  };

  const columns = useMemo(() => [
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
      header: "SI.No.",
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        return <span className="font-mono text-sm">{pageIndex * pageSize + row.index + 1}</span>;
      }
    },
    { accessorKey: "businessDate", header: "Closing Date" },
    {
      id: 'products',
      header: 'Product Rates',
      cell: ({ row }) => (
        <div>
          {row.original.products.map(p => (
            <div key={p.id} className="text-xs">{p.name}: Open {p.openSaleRate} / Close {p.closeRate}</div>
          ))}
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <Switch checked={row.original.status} onCheckedChange={() => toggleStatus(row.original.id)} />
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)} title="Edit">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => toggleStatus(row.original.id)} title={row.original.status ? 'Deactivate' : 'Activate'}>
            {row.original.status ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original.id)} title="Delete" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: 'lastModified',
      header: 'User Log Details',
      cell: ({ row }) => (
        <div className="text-xs">
          <p>Created: {row.original.created || 'N/A'}</p>
          <p>Updated: {row.original.lastModified || 'N/A'}</p>
        </div>
      )
    },
  ], [handleEdit, handleDelete, toggleStatus]);

  return (
    <>
      <Helmet>
        <title>Daily Sale Rate - PetroPro</title>
        <meta name="description" content="Manage daily sale rates for fuel products." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6"
      >
        <DailySaleRateForm onSave={handleSave} rate={editingRate} />
        <Card className="glass">
          <CardContent className="pt-6">
            <DataTable
              columns={columns}
              data={rates}
              filterColumn="businessDate"
              onDelete={(ids) => {
                setRates(rates.filter(rate => !ids.includes(rate.id)));
                toast({variant: "destructive", title: "Deleted", description: "Selected rates deleted."});
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default DailySaleRatePage;