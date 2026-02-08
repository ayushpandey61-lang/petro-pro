import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, PlusCircle, Search, Trash2, Edit, Eye, XCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable } from '@/components/ui/data-table';
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
import { generatePdf, generateCsv } from '@/lib/reportUtils';
import { useOrg } from '@/hooks/useOrg';
import AddLubeAssignmentModal from '@/pages/day-business/forms/AddLubeAssignmentModal';

const LubsAssigningTab = () => {
  const { toast } = useToast();
  const { orgDetails } = useOrg();
  const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [lubricants, setLubricants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [recoveryDate, setRecoveryDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);

  const [searchFromDate, setSearchFromDate] = useState(null);
  const [searchToDate, setSearchToDate] = useState(null);
  const [searchEmployee, setSearchEmployee] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [employeesData, shiftsData, lubricantsData] = await Promise.all([
        apiClient.getMasterData('employees'),
        apiClient.getMasterData('shifts'),
        apiClient.getMasterData('lubricants'),
      ]);

      setEmployees(employeesData || []);
      setShifts(shiftsData || []);
      setLubricants(lubricantsData || []);
    } catch (err) {
      setError(err.message);
      toast({ variant: 'destructive', title: 'Error fetching initial data', description: err.message });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchFromDate) params.from_date = format(searchFromDate, 'yyyy-MM-dd');
      if (searchToDate) params.to_date = format(searchToDate, 'yyyy-MM-dd');
      if (searchEmployee) params.employee_id = searchEmployee;

      const data = await apiClient.request('/day-business/lube-assignments', { params });
      setAssignments(data || []);
      if (!data || data.length === 0) {
        toast({ title: 'No Results', description: 'No assignments found for the selected criteria.' });
      }
    } catch (err) {
      setError(err.message);
      toast({ variant: 'destructive', title: 'Error fetching assignments', description: err.message });
    } finally {
      setLoading(false);
    }
  }, [toast, searchFromDate, searchToDate, searchEmployee]);

  const filteredAssignments = useMemo(() => {
    if (!globalFilter) return assignments;

    return assignments.filter(a => {
      const employee = employees.find(e => e.id === a.employee_id);
      const shift = shifts.find(s => s.id === a.shift_id);
      const lubricant = lubricants.find(l => l.id === a.product_id);

      return (
        employee?.name?.toLowerCase().includes(globalFilter.toLowerCase()) ||
        shift?.name?.toLowerCase().includes(globalFilter.toLowerCase()) ||
        lubricant?.name?.toLowerCase().includes(globalFilter.toLowerCase()) ||
        Object.values(a).some(val =>
          String(val).toLowerCase().includes(globalFilter.toLowerCase())
        )
      );
    });
  }, [assignments, globalFilter, employees, shifts, lubricants]);


  const exportHeaders = [
    { label: 'S.No.', key: 'sno' },
    { label: 'Date', key: 'assignment_date' },
    { label: 'Shift', key: 'shift_name' },
    { label: 'Employee', key: 'employee_name' },
    { label: 'Product', key: 'product_name' },
    { label: 'Product Rate', key: 'product_rate' },
    { label: 'Assigned', key: 'assigned_qty' },
    { label: 'Sold', key: 'sold_qty' },
    { label: 'Balance', key: 'balance_qty' },
    { label: 'Collected', key: 'collected_amount' },
    { label: 'Shortage', key: 'shortage' },
  ];

  const exportData = useMemo(() => filteredAssignments.map((a, i) => {
    const shift = shifts.find(s => s.id === a.shift_id);
    const employee = employees.find(e => e.id === a.employee_id);
    const lubricant = lubricants.find(l => l.id === a.product_id);

    return {
      sno: i + 1,
      assignment_date: a.assignment_date,
      shift_name: shift?.name || 'N/A',
      employee_name: employee?.name || 'N/A',
      product_name: lubricant?.name || 'N/A',
      product_rate: a.product_rate,
      assigned_qty: a.assigned_qty,
      sold_qty: a.sold_qty,
      balance_qty: a.balance_qty,
      collected_amount: a.collected_amount,
      shortage: a.shortage,
    };
  }), [filteredAssignments, shifts, employees, lubricants]);

  const handleExportPdf = () => generatePdf({ title: 'Lubricants Assignment Report', headers: exportHeaders, data: exportData.map(row => exportHeaders.map(header => row[header.key])), orgDetails });
  const handleExportCsv = () => generateCsv({ filename: 'lube-assignments.csv', headers: exportHeaders, data: exportData });
  const handleSaveAssignment = () => {
    setIsModalOpen(false);
    handleSearch();
  };

  return (
    <div className="space-y-4">
      <AddLubeAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAssignment}
        employees={employees}
        shifts={shifts}
        lubricants={lubricants}
      />
      <Card>
        <CardHeader className="bg-blue-600 text-white rounded-t-lg p-4">
          <CardTitle className="flex justify-between items-center">
            Lubricants Recovery
            <Button size="sm" onClick={() => setIsModalOpen(true)} className="bg-white text-blue-600 hover:bg-gray-100">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Assignings
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
          <div className="grid gap-2">
            <Label>Recovery Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {recoveryDate ? format(recoveryDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={recoveryDate} onSelect={setRecoveryDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2 flex-grow">
            <Label>Choose Employee</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger><SelectValue placeholder="Select Employee" /></SelectTrigger>
              <SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Shift</Label>
            <RadioGroup value={selectedShift} onValueChange={setSelectedShift} className="flex items-center space-x-4">
              {shifts.map(s => (
                <div key={s.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={s.id} id={`shift-${s.id}`} />
                  <Label htmlFor={`shift-${s.id}`}>{s.name}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <Button onClick={handleSearch}>Show Assigns</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex flex-wrap items-end gap-4">
          <Label className="mt-2">Search From</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {searchFromDate ? format(searchFromDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={searchFromDate} onSelect={setSearchFromDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Label className="mt-2">To</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {searchToDate ? format(searchToDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={searchToDate} onSelect={setSearchToDate} initialFocus />
            </PopoverContent>
          </Popover>
          <div className="grid gap-2 flex-grow">
            <Label>Employee</Label>
            <Select value={searchEmployee} onValueChange={setSearchEmployee}>
              <SelectTrigger><SelectValue placeholder="Choose Employee" /></SelectTrigger>
              <SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button onClick={handleSearch}><Search className="mr-2 h-4 w-4" /> Search</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCsv}>CSV</Button>
              <Button variant="outline" size="sm" onClick={handleExportPdf}>PDF</Button>
              <div className="relative">
                <Input
                  placeholder="Type to filter..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-8"
                />
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="overflow-auto max-h-96">
            <div className="min-w-max">
              <DataTable
                columns={[
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
                    accessorKey: 'assignment_date',
                    header: 'Date',
                    cell: ({ row }) => format(new Date(row.original.assignment_date), 'dd-MM-yyyy')
                  },
                  {
                    accessorKey: 'shift_name',
                    header: 'Shift',
                    cell: ({ row }) => {
                      const shift = shifts.find(s => s.id === row.original.shift_id);
                      return shift?.name || 'N/A';
                    }
                  },
                  {
                    accessorKey: 'employee_name',
                    header: 'Employee',
                    cell: ({ row }) => {
                      const employee = employees.find(e => e.id === row.original.employee_id);
                      return employee?.name || 'N/A';
                    }
                  },
                  {
                    accessorKey: 'product_name',
                    header: 'Product',
                    cell: ({ row }) => {
                      const lubricant = lubricants.find(l => l.id === row.original.product_id);
                      return lubricant?.name || 'N/A';
                    }
                  },
                  {
                    accessorKey: 'product_rate',
                    header: 'Product Rate',
                    cell: ({ row }) => `₹${parseFloat(row.original.product_rate || 0).toFixed(2)}`
                  },
                  {
                    accessorKey: 'assigned_qty',
                    header: 'Assigned'
                  },
                  {
                    accessorKey: 'sold_qty',
                    header: 'Sold'
                  },
                  {
                    accessorKey: 'balance_qty',
                    header: 'Balance'
                  },
                  {
                    accessorKey: 'collected_amount',
                    header: 'Collected',
                    cell: ({ row }) => `₹${parseFloat(row.original.collected_amount || 0).toFixed(2)}`
                  },
                  {
                    accessorKey: 'shortage',
                    header: 'Shortage',
                    cell: ({ row }) => `₹${parseFloat(row.original.shortage || 0).toFixed(2)}`
                  },
                  {
                    id: 'actions',
                    header: 'Actions',
                    cell: ({ row }) => (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => toast({title: '🚧 Feature In Progress'})} title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toast({title: '🚧 Feature In Progress'})} title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toast({title: '🚧 Feature In Progress'})} title="Delete" className="text-destructive hover:text-destructive">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ),
                  },
                  {
                    accessorKey: 'user_log',
                    header: 'User Log Details',
                    cell: ({ row }) => (
                      <div className="text-xs">
                        <p>Created: {new Date(row.original.created_at || row.original.assignment_date).toLocaleString()}</p>
                        <p>Updated: {new Date(row.original.updated_at || row.original.assignment_date).toLocaleString()}</p>
                      </div>
                    )
                  },
                ]}
                data={filteredAssignments}
                filterColumn="product_name"
                initialGlobalFilter={globalFilter}
                loading={loading}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <p>Showing {filteredAssignments.length} of {assignments.length} entries</p>
            {/* Pagination controls can be added here */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LubsAssigningTab;