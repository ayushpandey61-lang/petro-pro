import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useLocalStorage from '@/hooks/useLocalStorage';

const EmployeeCashRecoveryForm = ({ onSave, employeeId }) => {
  const [shifts] = useLocalStorage('shifts', []);
  const [formData, setFormData] = useState({
    date: new Date(),
    shiftId: null,
    amount: '',
    description: '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    const shift = shifts.find(s => s.id === formData.shiftId);
    onSave({
      id: uuidv4(),
      ...formData,
      employeeId,
      shiftName: shift ? shift.shiftName : 'N/A',
      date: format(formData.date, "yyyy-MM-dd"),
    });
    setFormData({ date: new Date(), shiftId: null, amount: '', description: '' });
  };

  return (
    <Card className="bg-primary/5">
      <CardHeader className="bg-primary text-primary-foreground p-4">
        <CardTitle>Add Cash Handover</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
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
            <div className="space-y-1"><Label>Amount</Label><Input name="amount" type="number" value={formData.amount} onChange={(e) => setFormData(f => ({...f, amount: e.target.value}))} /></div>
            <div className="space-y-1"><Label>Description</Label><Textarea name="description" value={formData.description} onChange={(e) => setFormData(f => ({...f, description: e.target.value}))} /></div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Add Entry</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployeeCashRecoveryForm;