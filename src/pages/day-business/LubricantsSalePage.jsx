import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import LubricantsSaleForm from '@/pages/day-business/forms/LubricantsSaleForm';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/DatePicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
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
import { QuickLinks } from './components/QuickLinks';
import { apiClient } from '@/lib/api';
import useAuth from '@/hooks/useAuth';
import { useOrg } from '@/hooks/useOrg';

const LubricantsSalePage = () => {
  const [sales, setSales] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [lubricants, setLubricants] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editingSale, setEditingSale] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ fromDate: null, toDate: null, productId: '' });
  const [filteredSales, setFilteredSales] = useState([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { orgDetails } = useOrg();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        salesData,
        shiftsData,
        lubesData,
        employeesData
      ] = await Promise.all([
        apiClient.getLubricantsSale(),
        apiClient.getMasterData('shifts'),
        apiClient.getMasterData('lubricants'),
        apiClient.getMasterData('employees')
      ]);

      const formattedSales = salesData.map(s => ({
        ...s,
        shift_name: shiftsData.find(shift => shift.id === s.shift_id)?.shift_name || 'N/A',
        product_name: lubesData.find(lube => lube.id === s.product_id)?.product_name || 'N/A',
        employee_name: employeesData.find(emp => emp.id === s.employee_id)?.employee_name || 'N/A',
      }));

      setSales(formattedSales);
      setFilteredSales(formattedSales);
      setShifts(shiftsData);
      setLubricants(lubesData);
      setEmployees(employeesData);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error fetching data', description: error.message });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleSearch = () => {
    let filtered = [...sales];
    if (filters.fromDate) {
        filtered = filtered.filter(s => new Date(s.sale_date) >= filters.fromDate);
    }
    if (filters.toDate) {
        filtered = filtered.filter(s => new Date(s.sale_date) <= filters.toDate);
    }
    if (filters.productId) {
        filtered = filtered.filter(s => s.product_id === filters.productId);
    }
    setFilteredSales(filtered);
  };

  const handleSave = async (saleData, isEditing) => {
    setLoading(true);
    try {
      const dataToSave = { ...saleData, user_id: user.id };

      if (isEditing) {
        await apiClient.updateLubricantsSale(editingSale.id, dataToSave);
        toast({ title: 'Success', description: 'Lubricant sale updated successfully.' });
      } else {
        // Generate transaction number
        const sales = await apiClient.getLubricantsSale();
        const nextId = (sales?.length || 0) + 1;
        dataToSave.txn_no = `LUBE-${String(nextId).padStart(4, '0')}`;
        await apiClient.createLubricantsSale(dataToSave);
        toast({ title: 'Success', description: 'Lubricant sale saved successfully.' });
      }

      setEditingSale(null);
      fetchData();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error saving sale', description: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (ids) => {
    setLoading(true);
    try {
      for (const id of ids) {
        await apiClient.deleteLubricantsSale(id);
      }
      toast({ title: 'Success', description: 'Selected sales deleted successfully.' });
      fetchData();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error deleting sales', description: error.message });
    } finally {
      setLoading(false);
    }
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
      accessorKey: 'id',
      header: 'SI.No.',
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        return <span className="font-mono text-sm">{pageIndex * pageSize + row.index + 1}</span>;
      }
    },
    {
      accessorKey: 'txn_no',
      header: 'Txn No.',
      cell: ({ row }) => <span>{row.original.txn_no || `LS-${row.index + 1}`}</span>,
    },
    { accessorKey: 'sale_date', header: 'Sale Date' },
    { accessorKey: 'shift_name', header: 'Shift' },
    { accessorKey: 'product_name', header: 'Product' },
    { accessorKey: 'sale_type', header: 'Sale Type' },
    { accessorKey: 'quantity', header: 'Quantity' },
    { accessorKey: 'rate', header: 'Rate' },
    { accessorKey: 'amount', header: 'Amount' },
    { accessorKey: 'discount', header: 'Discount' },
    { accessorKey: 'indent', header: 'Indent' },
    { accessorKey: 'employee_name', header: 'Employee' },
    { accessorKey: 'description', header: 'Description' },
    {
      accessorKey: 'user_log',
      header: 'User Log',
      cell: ({ row }) => (
        <div className="text-xs">
          <p>Created: {new Date(row.original.created_at).toLocaleString()}</p>
          <p>Updated: {new Date(row.original.updated_at).toLocaleString()}</p>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setEditingSale(row.original)} title="Edit">
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" title="Delete" className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
        </div>
      ),
    },
  ], []);

  return (
    <>
      <Helmet>
        <title>Lubricants Sale - PetroPro</title>
        <meta name="description" content="Manage and record lubricant sales." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6 space-y-6"
      >
        <QuickLinks />
        <LubricantsSaleForm
          key={editingSale?.id || 'new'}
          onSave={handleSave}
          initialData={editingSale}
          shifts={shifts}
          lubricants={lubricants}
          employees={employees}
          onCancel={() => setEditingSale(null)}
          loading={loading}
        />
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="p-4 border-b">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                      <Label>From Date</Label>
                      <DatePicker value={filters.fromDate} onChange={(date) => setFilters(prev => ({...prev, fromDate: date}))} />
                  </div>
                  <div>
                      <Label>To Date</Label>
                      <DatePicker value={filters.toDate} onChange={(date) => setFilters(prev => ({...prev, toDate: date}))} />
                  </div>
                  <div>
                      <Label>Select Product</Label>
                      <Select value={filters.productId} onValueChange={(value) => setFilters(prev => ({...prev, productId: value}))}>
                          <SelectTrigger><SelectValue placeholder="All Products" /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="">All Products</SelectItem>
                              {lubricants.map(l => <SelectItem key={l.id} value={l.id}>{l.product_name}</SelectItem>)}
                          </SelectContent>
                      </Select>
                  </div>
                  <Button onClick={handleSearch}>Search</Button>
              </div>
            </div>
            
            <DataTable
              columns={columns}
              data={filteredSales}
              filterColumn="product_name"
              onDelete={handleDelete}
              loading={loading}
              orgDetails={orgDetails}
              reportTitle="Lubricants Sale Report"
            />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default LubricantsSalePage;