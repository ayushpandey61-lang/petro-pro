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

  const [rowSelection, setRowSelection] = useState({});

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
    return assignments.filter(a =>
      a.employees?.employee_name?.toLowerCase().includes(globalFilter.toLowerCase()) ||
      a.shifts?.shift_name?.toLowerCase().includes(globalFilter.toLowerCase()) ||
      a.lubricants?.product_name?.toLowerCase().includes(globalFilter.toLowerCase()) ||
      Object.values(a).some(val =>
        String(val).toLowerCase().includes(globalFilter.toLowerCase())
      )
    );
  }, [assignments, globalFilter]);

  const handleDeleteSelected = async () => {
    const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
    if (selectedIds.length === 0) {
      toast({ variant: 'destructive', title: 'No rows selected', description: 'Please select rows to delete.' });
      return;
    }
    try {
      await apiClient.request('/day-business/lube-assignments', {
        method: 'DELETE',
        body: JSON.stringify({ ids: selectedIds })
      });
      toast({ title: 'Success', description: `${selectedIds.length} assignments deleted.` });
      handleSearch();
      setRowSelection({});
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error deleting assignments', description: err.message });
    }
  };

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

  const exportData = useMemo(() => filteredAssignments.map((a, i) => ({
    sno: i + 1,
    assignment_date: a.assignment_date,
    shift_name: a.shifts?.shift_name || 'N/A',
    employee_name: a.employees?.employee_name || 'N/A',
    product_name: a.lubricants?.product_name || 'N/A',
    product_rate: a.product_rate,
    assigned_qty: a.assigned_qty,
    sold_qty: a.sold_qty,
    balance_qty: a.balance_qty,
    collected_amount: a.collected_amount,
    shortage: a.shortage,
  })), [filteredAssignments]);

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
              <SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id}>{e.employee_name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Shift</Label>
            <RadioGroup value={selectedShift} onValueChange={setSelectedShift} className="flex items-center space-x-4">
              {shifts.map(s => (
                <div key={s.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={s.id} id={`shift-${s.id}`} />
                  <Label htmlFor={`shift-${s.id}`}>{s.shift_name}</Label>
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
              <SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id}>{e.employee_name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button onClick={handleSearch}><Search className="mr-2 h-4 w-4" /> Search</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={Object.keys(rowSelection).length === 0}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the selected assignments.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteSelected}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Select>
                <SelectTrigger className="w-[120px]"><SelectValue placeholder="Show: All" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Show 10</SelectItem>
                  <SelectItem value="20">Show 20</SelectItem>
                  <SelectItem value="50">Show 50</SelectItem>
                  <SelectItem value="all">Show All</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 text-left"><Checkbox onCheckedChange={(checked) => {
                    const newRowSelection = {};
                    if (checked) {
                      filteredAssignments.forEach(a => newRowSelection[a.id] = true);
                    }
                    setRowSelection(newRowSelection);
                  }}
                  checked={Object.keys(rowSelection).length > 0 && Object.keys(rowSelection).length === filteredAssignments.length}
                  /></th>
                  {exportHeaders.map(h => <th key={h.key} className="p-2 text-left font-semibold">{h.label}</th>)}
                  <th className="p-2 text-left font-semibold">Action</th>
                  <th className="p-2 text-left font-semibold">User Log Details</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={exportHeaders.length + 3} className="text-center p-4">Loading...</td></tr>
                ) : error ? (
                  <tr><td colSpan={exportHeaders.length + 3} className="text-center p-4 text-destructive">{error}</td></tr>
                ) : filteredAssignments.length === 0 ? (
                  <tr><td colSpan={exportHeaders.length + 3} className="text-center p-4">No data available in table</td></tr>
                ) : (
                  filteredAssignments.map((a, i) => (
                    <tr key={a.id} className="border-b">
                      <td className="p-2"><Checkbox checked={rowSelection[a.id] || false} onCheckedChange={(checked) => setRowSelection(prev => ({...prev, [a.id]: checked}))} /></td>
                      <td className="p-2">{i + 1}</td>
                      <td className="p-2">{format(new Date(a.assignment_date), 'dd-MM-yyyy')}</td>
                      <td className="p-2">{a.shifts?.shift_name || 'N/A'}</td>
                      <td className="p-2">{a.employees?.employee_name || 'N/A'}</td>
                      <td className="p-2">{a.lubricants?.product_name || 'N/A'}</td>
                      <td className="p-2">{a.product_rate}</td>
                      <td className="p-2">{a.assigned_qty}</td>
                      <td className="p-2">{a.sold_qty}</td>
                      <td className="p-2">{a.balance_qty}</td>
                      <td className="p-2">{a.collected_amount}</td>
                      <td className="p-2">{a.shortage}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toast({title: '🚧 Feature In Progress'})}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toast({title: '🚧 Feature In Progress'})}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => toast({title: '🚧 Feature In Progress'})}><XCircle className="h-4 w-4" /></Button>
                        </div>
                      </td>
                      <td className="p-2"><Button variant="link" size="sm" onClick={() => toast({title: '🚧 Feature In Progress'})}>View Log</Button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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