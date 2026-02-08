import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { MoreHorizontal, Edit, Trash2, PlusCircle, Truck, DollarSign, LineChart } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LorryForm = ({ lorry, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    lorry_number: '',
    capacity: '',
    model: '',
    purchase_date: new Date(),
  });

  useEffect(() => {
    if (lorry) {
      setFormData({
        lorry_number: lorry.lorry_number,
        capacity: lorry.capacity || '',
        model: lorry.model || '',
        purchase_date: lorry.purchase_date ? new Date(lorry.purchase_date) : new Date(),
      });
    }
  }, [lorry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, purchase_date: format(formData.purchase_date, 'yyyy-MM-dd') });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Lorry Number</Label>
          <Input name="lorry_number" value={formData.lorry_number} onChange={handleChange} required />
        </div>
        <div className="space-y-1">
          <Label>Capacity (Liters)</Label>
          <Input name="capacity" type="number" value={formData.capacity} onChange={handleChange} />
        </div>
        <div className="space-y-1">
          <Label>Model</Label>
          <Input name="model" value={formData.model} onChange={handleChange} />
        </div>
        <div className="space-y-1">
          <Label>Purchase Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.purchase_date && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.purchase_date ? format(formData.purchase_date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.purchase_date} onSelect={(d) => setFormData(f => ({...f, purchase_date: d}))} /></PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Lorry</Button>
      </div>
    </form>
  );
};

const ExpenseForm = ({ lorryId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        lorry_id: lorryId,
        expense_date: new Date(),
        expense_type: '',
        amount: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, expense_date: format(formData.expense_date, 'yyyy-MM-dd') });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Expense Date</Label>
                    <Popover>
                        <PopoverTrigger asChild><Button variant="outline" className="w-full justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{formData.expense_date ? format(formData.expense_date, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.expense_date} onSelect={(d) => setFormData(f => ({...f, expense_date: d}))} /></PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-1"><Label>Expense Type</Label><Input name="expense_type" value={formData.expense_type} onChange={(e) => setFormData(f => ({...f, expense_type: e.target.value}))} required /></div>
                <div className="space-y-1"><Label>Amount</Label><Input name="amount" type="number" value={formData.amount} onChange={(e) => setFormData(f => ({...f, amount: e.target.value}))} required /></div>
                <div className="space-y-1 md:col-span-2"><Label>Description</Label><Input name="description" value={formData.description} onChange={(e) => setFormData(f => ({...f, description: e.target.value}))} /></div>
            </div>
            <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit">Save Expense</Button></div>
        </form>
    );
};

const TripForm = ({ lorryId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        lorry_id: lorryId,
        trip_date: new Date(),
        revenue: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, trip_date: format(formData.trip_date, 'yyyy-MM-dd') });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Trip Date</Label>
                    <Popover>
                        <PopoverTrigger asChild><Button variant="outline" className="w-full justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{formData.trip_date ? format(formData.trip_date, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.trip_date} onSelect={(d) => setFormData(f => ({...f, trip_date: d}))} /></PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-1"><Label>Revenue</Label><Input name="revenue" type="number" value={formData.revenue} onChange={(e) => setFormData(f => ({...f, revenue: e.target.value}))} required /></div>
                <div className="space-y-1 md:col-span-2"><Label>Description</Label><Input name="description" value={formData.description} onChange={(e) => setFormData(f => ({...f, description: e.target.value}))} /></div>
            </div>
            <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit">Save Trip</Button></div>
        </form>
    );
};

const TankLorryManagementPage = () => {
  const [lorries, setLorries] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [trips, setTrips] = useState([]);
  const [editingLorry, setEditingLorry] = useState(null);
  const [selectedLorry, setSelectedLorry] = useState(null);
  const [isLorryFormOpen, setIsLorryFormOpen] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [isTripFormOpen, setIsTripFormOpen] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const lorriesData = await apiClient.request('/master/tank-lorries');
      setLorries(lorriesData);

      const expensesData = await apiClient.request('/master/tank-lorry-expenses');
      setExpenses(expensesData);

      const tripsData = await apiClient.request('/master/tank-lorry-trips');
      setTrips(tripsData);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error fetching data', description: error.message });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveLorry = async (lorryData) => {
    try {
      if (editingLorry) {
        await apiClient.updateMasterData('tank-lorries', editingLorry.id, lorryData);
      } else {
        await apiClient.createMasterData('tank-lorries', lorryData);
      }

      toast({ title: 'Success', description: `Lorry ${editingLorry ? 'updated' : 'added'} successfully.` });
      setIsLorryFormOpen(false);
      setEditingLorry(null);
      fetchData();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error saving lorry', description: error.message });
    }
  };

  const handleSaveExpense = async (expenseData) => {
    try {
      await apiClient.createMasterData('tank-lorry-expenses', expenseData);
      toast({ title: 'Success', description: 'Expense added successfully.' });
      setIsExpenseFormOpen(false);
      fetchData();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error saving expense', description: error.message });
    }
  };

  const handleSaveTrip = async (tripData) => {
    try {
      await apiClient.createMasterData('tank-lorry-trips', tripData);
      toast({ title: 'Success', description: 'Trip added successfully.' });
      setIsTripFormOpen(false);
      fetchData();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error saving trip', description: error.message });
    }
  };

  const handleDeleteLorry = async (id) => {
    try {
      // Also delete related expenses and trips
      await apiClient.deleteMasterData('tank-lorry-expenses', id);
      await apiClient.deleteMasterData('tank-lorry-trips', id);
      await apiClient.deleteMasterData('tank-lorries', id);

      toast({ title: 'Success', description: 'Lorry deleted successfully.' });
      fetchData();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error deleting lorry', description: error.message });
    }
  };

  const lorryColumns = [
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
    { accessorKey: "lorry_number", header: "Lorry Number" },
    { accessorKey: "capacity", header: "Capacity (L)" },
    { accessorKey: "model", header: "Model" },
    { accessorKey: "purchase_date", header: "Purchase Date", cell: ({ row }) => format(new Date(row.original.purchase_date), 'PPP') },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setEditingLorry(row.original); setIsLorryFormOpen(true); }}><Edit className="mr-2 h-4 w-4" /><span>Edit</span></DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteLorry(row.original.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /><span>Delete</span></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const profitData = useMemo(() => {
    return lorries.map(lorry => {
        const lorryTrips = trips.filter(t => t.lorry_id === lorry.id);
        const lorryExpenses = expenses.filter(e => e.lorry_id === lorry.id);
        const totalRevenue = lorryTrips.reduce((sum, trip) => sum + (trip.revenue || 0), 0);
        const totalExpenses = lorryExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
        const profit = totalRevenue - totalExpenses;
        return {
            ...lorry,
            totalRevenue,
            totalExpenses,
            profit
        };
    });
  }, [lorries, trips, expenses]);

  const profitColumns = [
      { accessorKey: "lorry_number", header: "Lorry Number" },
      { accessorKey: "totalRevenue", header: "Total Revenue", cell: ({row}) => `₹${row.original.totalRevenue.toFixed(2)}` },
      { accessorKey: "totalExpenses", header: "Total Expenses", cell: ({row}) => `₹${row.original.totalExpenses.toFixed(2)}` },
      { accessorKey: "profit", header: "Profit", cell: ({row}) => `₹${row.original.profit.toFixed(2)}` },
  ];

  return (
    <>
      <Helmet>
        <title>Tank Lorry Management - PetroPro</title>
        <meta name="description" content="Manage your tank lorries, expenses, and profitability." />
      </Helmet>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Tank Lorry Management</CardTitle>
                <CardDescription>Add, track, and manage your fleet of tank lorries.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="lorries">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="lorries"><Truck className="mr-2 h-4 w-4" />Lorries</TabsTrigger>
                        <TabsTrigger value="expenses"><DollarSign className="mr-2 h-4 w-4" />Expenses & Trips</TabsTrigger>
                        <TabsTrigger value="profit"><LineChart className="mr-2 h-4 w-4" />Profitability</TabsTrigger>
                    </TabsList>
                    <TabsContent value="lorries" className="mt-4">
                        <div className="flex justify-end mb-4">
                            <Dialog open={isLorryFormOpen} onOpenChange={setIsLorryFormOpen}>
                                <DialogTrigger asChild><Button onClick={() => setEditingLorry(null)}><PlusCircle className="mr-2 h-4 w-4" />Add Lorry</Button></DialogTrigger>
                                <DialogContent><DialogHeader><DialogTitle>{editingLorry ? 'Edit' : 'Add'} Lorry</DialogTitle></DialogHeader><LorryForm lorry={editingLorry} onSave={handleSaveLorry} onCancel={() => setIsLorryFormOpen(false)} /></DialogContent>
                            </Dialog>
                        </div>
                        <div className="overflow-auto max-h-96">
                          <div className="min-w-max">
                            <DataTable columns={lorryColumns} data={lorries} filterColumn="lorry_number" />
                          </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="expenses" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-4">
                            <div className="space-y-1">
                                <Label>Select Lorry to Add Entry</Label>
                                <Select onValueChange={(id) => setSelectedLorry(lorries.find(l => l.id === id))}><SelectTrigger><SelectValue placeholder="Select a lorry..." /></SelectTrigger><SelectContent>{lorries.map(l => <SelectItem key={l.id} value={l.id}>{l.lorry_number}</SelectItem>)}</SelectContent></Select>
                            </div>
                            <div className="flex gap-2 self-end">
                                <Dialog open={isExpenseFormOpen} onOpenChange={setIsExpenseFormOpen}>
                                    <DialogTrigger asChild><Button disabled={!selectedLorry}><PlusCircle className="mr-2 h-4 w-4" />Add Expense</Button></DialogTrigger>
                                    <DialogContent><DialogHeader><DialogTitle>Add Expense for {selectedLorry?.lorry_number}</DialogTitle></DialogHeader><ExpenseForm lorryId={selectedLorry?.id} onSave={handleSaveExpense} onCancel={() => setIsExpenseFormOpen(false)} /></DialogContent>
                                </Dialog>
                                <Dialog open={isTripFormOpen} onOpenChange={setIsTripFormOpen}>
                                    <DialogTrigger asChild><Button disabled={!selectedLorry}><PlusCircle className="mr-2 h-4 w-4" />Add Trip/Revenue</Button></DialogTrigger>
                                    <DialogContent><DialogHeader><DialogTitle>Add Trip for {selectedLorry?.lorry_number}</DialogTitle></DialogHeader><TripForm lorryId={selectedLorry?.id} onSave={handleSaveTrip} onCancel={() => setIsTripFormOpen(false)} /></DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Expense and trip records will be displayed here in a future update.</p>
                    </TabsContent>
                    <TabsContent value="profit" className="mt-4">
                        <DataTable columns={profitColumns} data={profitData} filterColumn="lorry_number" />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default TankLorryManagementPage;