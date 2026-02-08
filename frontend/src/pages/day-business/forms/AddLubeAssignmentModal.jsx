import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, PlusCircle, XCircle, CheckCircle, X } from 'lucide-react';
import { format } from 'date-fns';

const AddLubeAssignmentModal = ({ isOpen, onClose, onSave, employees, shifts, lubricants }) => {
  const { toast } = useToast();
  const [assignmentDate, setAssignmentDate] = useState(new Date());
  const [shiftId, setShiftId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [assignmentRows, setAssignmentRows] = useState([{ id: uuidv4(), productId: '', rate: '', quantity: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAssignmentDate(new Date());
      setShiftId('');
      setEmployeeId('');
      setAssignmentRows([{ id: uuidv4(), productId: '', rate: '', quantity: '' }]);
    }
  }, [isOpen]);

  const handleAddRow = () => {
    setAssignmentRows([...assignmentRows, { id: uuidv4(), productId: '', rate: '', quantity: '' }]);
  };

  const handleRemoveRow = (id) => {
    setAssignmentRows(assignmentRows.filter((row) => row.id !== id));
  };

  const handleRowChange = (id, field, value) => {
    const newRows = assignmentRows.map((row) => {
      if (row.id === id) {
        const newRow = { ...row, [field]: value };
        if (field === 'productId') {
          const selectedLubricant = lubricants.find(l => l.id === value);
          if (selectedLubricant) {
            newRow.rate = selectedLubricant.rate || '';
          }
        }
        return newRow;
      }
      return row;
    });
    setAssignmentRows(newRows);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assignmentDate || !shiftId || !employeeId) {
      toast({ variant: 'destructive', title: 'Validation Error', description: 'Please fill in date, shift, and employee.' });
      return;
    }
    
    const validRows = assignmentRows.filter(row => row.productId && row.rate && row.quantity);

    if (validRows.length === 0) {
      toast({ variant: 'destructive', title: 'Validation Error', description: 'Please add at least one valid lubricant assignment.' });
      return;
    }

    setIsSubmitting(true);

    const assignmentsToInsert = validRows.map(row => ({
      assignment_date: format(assignmentDate, 'yyyy-MM-dd'),
      shift_id: shiftId,
      employee_id: employeeId,
      product_id: row.productId,
      product_rate: parseFloat(row.rate),
      assigned_qty: parseInt(row.quantity, 10),
    }));

    try {
      await apiClient.createMasterData('lube-assignments', assignmentsToInsert);
      toast({ title: 'Success!', description: 'Lubricant assignments have been added successfully.' });
      onSave();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Submission Error', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Assignings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="assignment-date">Choose Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button id="assignment-date" variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {assignmentDate ? format(assignmentDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={assignmentDate} onSelect={setAssignmentDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="shift-select">Select Shift</Label>
                <Select value={shiftId} onValueChange={setShiftId}>
                  <SelectTrigger id="shift-select"><SelectValue placeholder="Select a shift" /></SelectTrigger>
                  <SelectContent>
                    {shifts.map(s => <SelectItem key={s.id} value={s.id}>{s.shift_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="employee-select">Select Employee</Label>
                <Select value={employeeId} onValueChange={setEmployeeId}>
                  <SelectTrigger id="employee-select"><SelectValue placeholder="Select an employee" /></SelectTrigger>
                  <SelectContent>
                    {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.employee_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {assignmentRows.map((row, index) => (
                <div key={row.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
                  <div className="grid gap-2 md:col-span-5">
                    {index === 0 && <Label>Lubricant Item*</Label>}
                    <Select value={row.productId} onValueChange={(value) => handleRowChange(row.id, 'productId', value)}>
                        <SelectTrigger><SelectValue placeholder="Choose product" /></SelectTrigger>
                        <SelectContent>
                           {lubricants.map(l => <SelectItem key={l.id} value={l.id}>{l.product_name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2 md:col-span-3">
                    {index === 0 && <Label>Sale Rate*</Label>}
                    <Input placeholder="Enter Amount" type="number" value={row.rate} onChange={(e) => handleRowChange(row.id, 'rate', e.target.value)} />
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    {index === 0 && <Label>Qty*</Label>}
                    <Input placeholder="Qty" type="number" value={row.quantity} onChange={(e) => handleRowChange(row.id, 'quantity', e.target.value)} />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <Button type="button" size="icon" variant="outline" onClick={handleAddRow} className="h-9 w-9">
                        <PlusCircle className="h-4 w-4 text-green-500" />
                    </Button>
                    {assignmentRows.length > 1 && (
                      <Button type="button" size="icon" variant="destructive" onClick={() => handleRemoveRow(row.id)} className="h-9 w-9">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="p-6 pt-0">
            <DialogClose asChild>
              <Button type="button" variant="outline"><X className="mr-2 h-4 w-4" />Close</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : <><CheckCircle className="mr-2 h-4 w-4" />Submit</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLubeAssignmentModal;