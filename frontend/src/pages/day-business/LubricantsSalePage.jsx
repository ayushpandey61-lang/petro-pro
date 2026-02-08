import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/DatePicker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, Edit, Trash2, Search, FileText, Download, Filter, Plus } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuickLinks } from './components/QuickLinks';
import { apiClient } from '@/lib/api';
import useAuth from '@/hooks/useAuth';
import { useOrg } from '@/hooks/useOrg';

const LubricantsSalePage = () => {
  const [sales, setSales] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [lubricants, setLubricants] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [creditCustomers, setCreditCustomers] = useState([]);
  const [saleItems, setSaleItems] = useState([{
    product_id: '',
    rate: '',
    quantity: '',
    discount: '',
    amount: '',
    indent: ''
  }]);
  const [editingSale, setEditingSale] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ fromDate: null, toDate: null, productId: '' });
  const [filteredSales, setFilteredSales] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { orgDetails } = useOrg();

  // Form state
  const [formData, setFormData] = useState({
    sale_date: new Date(),
    shift_id: '',
    product_id: '',
    employee_id: '',
    rate: '',
    quantity: '',
    discount: '',
    amount: '',
    description: '',
    sale_type: 'Cash',
    indent: '',
    gst_no: '',
    bill_no: '',
    credit_customer_id: ''
  });

  // Show loading while authentication is initializing
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show message if user is not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access the lubricants sale page.</p>
          <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching lubricants sale data...');
      console.log('🔐 Current user:', localStorage.getItem('petropro_current_user'));
      console.log('🔑 Auth token exists:', !!localStorage.getItem('auth_token'));

      const [
        salesData,
        shiftsData,
        lubesData,
        employeesData,
        creditCustomersData
      ] = await Promise.all([
        apiClient.getLubricantsSale().catch(err => {
          console.error('Error fetching lubricants sale:', err);
          return [];
        }),
        apiClient.getMasterData('shifts').catch(err => {
          console.error('Error fetching shifts:', err);
          return [];
        }),
        apiClient.getMasterData('lubricants').catch(err => {
          console.error('Error fetching lubricants:', err);
          return [];
        }),
        apiClient.getMasterData('employees').catch(err => {
          console.error('Error fetching employees:', err);
          return [];
        }),
        apiClient.getMasterData('credit_party').catch(err => {
          console.error('Error fetching credit customers:', err);
          return [];
        })
      ]);

      console.log('Raw data received:', {
        salesCount: salesData?.length || 0,
        shiftsCount: shiftsData?.length || 0,
        lubricantsCount: lubesData?.length || 0,
        employeesCount: employeesData?.length || 0,
        creditCustomersCount: creditCustomersData?.length || 0
      });

      // Format the sales data with proper lookups
      const formattedSales = salesData.map(s => {
        const shift = shiftsData.find(shift => shift.id === parseInt(s.shift_id));
        const product = lubesData.find(lube => lube.id === parseInt(s.product_id));
        const employee = employeesData.find(emp => emp.id === parseInt(s.employee_id));

        return {
          ...s,
          shift_name: shift?.name || 'N/A',
          product_name: product?.name || 'N/A',
          employee_name: employee?.name || 'N/A',
        };
      });

      console.log('Formatted data:', {
        formattedSales,
        shiftsData,
        lubesData,
        employeesData
      });

      setSales(formattedSales);
      setFilteredSales(formattedSales);
      setShifts(shiftsData || []);
      setLubricants(lubesData || []);
      setEmployees(employeesData || []);
      setCreditCustomers(creditCustomersData || []);

      console.log('✅ Data fetching completed successfully');
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });

      // Provide more specific error messages
      let errorMessage = 'Failed to load page data';
      if (error.message.includes('Network')) {
        errorMessage = 'Network error - please check your connection';
      } else if (error.message.includes('401')) {
        errorMessage = 'Authentication required - please log in again';
      } else if (error.message.includes('403')) {
        errorMessage = 'Access denied - insufficient permissions';
      } else if (error.message.includes('404')) {
        errorMessage = 'Data endpoint not found';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error - please try again later';
      }

      toast({
        variant: 'destructive',
        title: 'Error Loading Data',
        description: `${errorMessage}: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleProductChange = (productId) => {
    const product = lubricants.find(l => l.id === parseInt(productId));
    setFormData(prev => ({
      ...prev,
      product_id: productId,
      rate: product ? (product.price || '') : '',
    }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateItemAmount = (rate, quantity, discount) => {
    const r = parseFloat(rate) || 0;
    const q = parseFloat(quantity) || 0;
    const d = parseFloat(discount) || 0;
    return (r * q - d).toFixed(2);
  };

  const calculateTotalAmount = () => {
    // For now, return the single item amount
    // This can be extended to sum multiple items when multiple item support is added
    return calculateItemAmount(formData.rate, formData.quantity, formData.discount);
  };

  const calculateAmount = () => {
    return calculateItemAmount(formData.rate, formData.quantity, formData.discount);
  };

  const addNewItem = () => {
    setSaleItems(prev => [...prev, {
      product_id: '',
      rate: '',
      quantity: '',
      discount: '',
      amount: '',
      indent: ''
    }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSave = {
        ...formData,
        amount: calculateTotalAmount(),
        sale_date: formData.sale_date.toISOString().split('T')[0]
      };

      if (editingSale) {
        await apiClient.updateLubricantsSale(editingSale.id, dataToSave);
        toast({ title: 'Success', description: 'Lubricant sale updated successfully.' });
      } else {
        await apiClient.createLubricantsSale(dataToSave);
        toast({ title: 'Success', description: 'Lubricant sale saved successfully.' });
      }

      setEditingSale(null);
      setFormData({
        sale_date: new Date(),
        shift_id: '',
        product_id: '',
        employee_id: '',
        rate: '',
        quantity: '',
        discount: '',
        amount: '',
        description: '',
        sale_type: 'Cash',
        indent: '',
        gst_no: '',
        bill_no: '',
        credit_customer_id: ''
      });
      fetchData();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error saving sale', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = [...sales];
    if (filters.fromDate) {
        filtered = filtered.filter(s => new Date(s.sale_date) >= filters.fromDate);
    }
    if (filters.toDate) {
        filtered = filtered.filter(s => new Date(s.sale_date) <= filters.toDate);
    }
    if (filters.productId) {
        filtered = filtered.filter(s => parseInt(s.product_id) === parseInt(filters.productId));
    }
    setFilteredSales(filtered);
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
      header: 'S.No.',
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
    { accessorKey: 'indent', header: 'Indent No' },
    { accessorKey: 'employee_name', header: 'Employee' },
    {
      id: 'actions',
      header: 'Action',
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
    { accessorKey: 'description', header: 'Description' },
    {
      accessorKey: 'user_log',
      header: 'User Log Details',
      cell: ({ row }) => (
        <div className="text-xs">
          <p>Created: {new Date(row.original.created_at).toLocaleString()}</p>
          <p>Updated: {new Date(row.original.updated_at).toLocaleString()}</p>
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

        {/* Main Form Section */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Lubricant Sales</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Choose Date</Label>
                  <Input
                    type="date"
                    value={formData.sale_date.toISOString().split('T')[0]}
                    onChange={(e) => handleChange('sale_date', new Date(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Select Employee</Label>
                  <Select value={formData.employee_id} onValueChange={(value) => handleChange('employee_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(emp => (
                        <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Select Shift</Label>
                  <Select value={formData.shift_id} onValueChange={(value) => handleChange('shift_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Shift" />
                    </SelectTrigger>
                    <SelectContent>
                      {shifts.map(shift => (
                        <SelectItem key={shift.id} value={shift.id}>{shift.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Total Amount</Label>
                  <div className="h-10 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-center justify-center font-bold text-lg text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    ₹{calculateTotalAmount()}
                  </div>
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <Label>Select Item</Label>
                  <Select value={formData.product_id} onValueChange={handleProductChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Item" />
                    </SelectTrigger>
                    <SelectContent>
                      {lubricants.map(l => (
                        <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Sale Rate</Label>
                  <Input
                    type="number"
                    value={formData.rate}
                    onChange={(e) => handleChange('rate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Discount</Label>
                  <Input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => handleChange('discount', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Indent</Label>
                  <Input
                    value={formData.indent}
                    onChange={(e) => handleChange('indent', e.target.value)}
                    placeholder="Enter indent number"
                  />
                </div>
                <div>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={calculateAmount()}
                    readOnly
                    className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 font-semibold"
                  />
                </div>
              </div>


              {/* Third Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-4 pt-6">
                  <Label>Sale Type:</Label>
                  <RadioGroup
                    value={formData.sale_type}
                    onValueChange={(value) => handleChange('sale_type', value)}
                    className="flex"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Cash" id="cash" />
                      <Label htmlFor="cash">Cash</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Credit" id="credit" />
                      <Label htmlFor="credit">Credit</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex items-center pt-6 gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" className="hover:bg-blue-50 hover:border-blue-300">
                        <FileText className="mr-2 h-4 w-4" /> Fill GST
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>GST and Bill Information</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>GST No.</Label>
                          <Input
                            value={formData.gst_no}
                            onChange={(e) => handleChange('gst_no', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Bill No.</Label>
                          <Input
                            value={formData.bill_no}
                            onChange={(e) => handleChange('bill_no', e.target.value)}
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    type="button"
                    variant="outline"
                    className="hover:bg-blue-50 hover:border-blue-300"
                    onClick={addNewItem}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Fourth Row - Credit Customer (shown only when Credit is selected) */}
              {formData.sale_type === 'Credit' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Credit Customer</Label>
                    <Select value={formData.credit_customer_id} onValueChange={(value) => handleChange('credit_customer_id', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Credit Customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {creditCustomers.map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Confirm Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 px-8 py-2"
                >
                  {loading ? 'Saving...' : 'CONFIRM'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Search Section */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Search className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Search Filters</h3>
              </div>
              <Button
                variant="outline"
                className="hover:bg-blue-50 hover:border-blue-300"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search className="mr-2 h-4 w-4" />
                {showSearch ? 'Hide Search' : 'Show Search'}
              </Button>
            </div>

            {showSearch && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>From Date</Label>
                    <DatePicker
                      value={filters.fromDate}
                      onChange={(date) => setFilters(prev => ({...prev, fromDate: date}))}
                    />
                  </div>
                  <div>
                    <Label>To Date</Label>
                    <DatePicker
                      value={filters.toDate}
                      onChange={(date) => setFilters(prev => ({...prev, toDate: date}))}
                    />
                  </div>
                  <div>
                    <Label>Product</Label>
                    <Select value={filters.productId} onValueChange={(value) => setFilters(prev => ({...prev, productId: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Products</SelectItem>
                        {lubricants.map(l => (
                          <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFilters({ fromDate: null, toDate: null, productId: '' });
                        setFilteredSales(sales);
                      }}
                      className="hover:bg-gray-50 hover:border-gray-300"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Table Section */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
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