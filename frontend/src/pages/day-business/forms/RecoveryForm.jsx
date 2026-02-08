import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import useLocalStorage from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

const RecoveryForm = ({ onSave, employeeId }) => {
  const [creditParties] = useLocalStorage('creditParties', []);
  const [shifts] = useLocalStorage('shifts', []);
  const [employees] = useLocalStorage('employees', []);
  const [formData, setFormData] = useState({
    date: new Date(),
    shiftId: null,
    organizationId: null,
    employeeId: employeeId || null,
    amount: '',
    collectionMode: 'Cash',
  });

  const handleSave = (e) => {
    e.preventDefault();
    const organization = creditParties.find(c => c.id === formData.organizationId);
    const shift = shifts.find(s => s.id === formData.shiftId);
    const employee = employees.find(emp => emp.id === formData.employeeId);
    onSave({
      id: uuidv4(),
      ...formData,
      employeeId: formData.employeeId,
      organizationName: organization ? organization.organizationName : 'N/A',
      shiftName: shift ? shift.shiftName : 'N/A',
      employeeName: employee ? employee.employeeName : 'N/A',
      date: format(formData.date, "yyyy-MM-dd"),
    });
    setFormData({ date: new Date(), shiftId: null, organizationId: null, employeeId: employeeId || null, amount: '', collectionMode: 'Cash' });
  };

  return (
    <Card className="bg-primary/5">
      <CardHeader className="bg-primary text-primary-foreground p-4">
        <CardTitle>Add New Recovery</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-end">
            <div className="space-y-1">
              <Label>Choose Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.date} onSelect={(d) => setFormData(f => ({...f, date: d}))} /></PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label>Shift</Label>
              <Select onValueChange={(v) => setFormData(f => ({...f, shiftId: v}))} value={formData.shiftId}>
                <SelectTrigger><SelectValue placeholder="Choose Shift" /></SelectTrigger>
                <SelectContent>{shifts.map(s => <SelectItem key={s.id} value={s.id}>{s.shiftName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Organization</Label>
              <Select onValueChange={(v) => setFormData(f => ({...f, organizationId: v}))} value={formData.organizationId}>
                <SelectTrigger><SelectValue placeholder="Choose Organization" /></SelectTrigger>
                <SelectContent>{creditParties.map(c => <SelectItem key={c.id} value={c.id}>{c.organizationName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Employee</Label>
              <Select onValueChange={(v) => setFormData(f => ({...f, employeeId: v}))} value={formData.employeeId}>
                <SelectTrigger><SelectValue placeholder="Choose Employee" /></SelectTrigger>
                <SelectContent>{employees.map(emp => <SelectItem key={emp.id} value={emp.id}>{emp.employeeName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label>Amount</Label><Input name="amount" type="number" value={formData.amount} onChange={(e) => setFormData(f => ({...f, amount: e.target.value}))} /></div>
            <div className="space-y-1">
              <Label>Collection Mode</Label>
              <Select onValueChange={(v) => setFormData(f => ({...f, collectionMode: v}))} value={formData.collectionMode}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Swipe">Swipe</SelectItem>
                  <SelectItem value="Bank">Bank</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Add Recovery</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RecoveryForm;