import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useLocalStorage from '@/hooks/useLocalStorage';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';

const ExpensesForm = ({ onSave, expense }) => {
  const [expenseTypes] = useLocalStorage('expenseTypes', []);
  const [employees] = useLocalStorage('employees', []);
  const [shifts] = useLocalStorage('shifts', []);
  const [formData, setFormData] = useState({
    expenseTypeId: null,
    shiftId: null,
    amount: '',
    description: '',
    flow: 'Cash Out',
    employeeId: null,
  });

  // Populate form when editing
  useEffect(() => {
    if (expense) {
      setFormData({
        expenseTypeId: expense.expenseTypeId || null,
        shiftId: expense.shiftId || null,
        amount: expense.amount || '',
        description: expense.description || '',
        flow: expense.flow || 'Cash Out',
        employeeId: expense.employeeId || null,
      });
    } else {
      setFormData({
        expenseTypeId: null,
        shiftId: null,
        amount: '',
        description: '',
        flow: 'Cash Out',
        employeeId: null,
      });
    }
  }, [expense]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.expenseTypeId || !formData.amount) {
        alert("Please select expense type and enter an amount.");
        return;
    }
    const expenseType = expenseTypes.find(et => et.id === formData.expenseTypeId);
    const employee = employees.find(emp => emp.id === formData.employeeId);
    const shift = shifts.find(s => s.id === formData.shiftId);
    onSave({
      id: uuidv4(),
      ...formData,
      date: new Date().toLocaleDateString(),
      expenseTypeName: expenseType ? expenseType.expenseType : 'N/A',
      employeeName: employee ? employee.employeeName : 'N/A',
      shiftName: shift ? shift.shiftName : 'N/A',
    });
    setFormData({ expenseTypeId: null, shiftId: null, amount: '', description: '', flow: 'Cash Out', employeeId: null });
  };

  return (
    <Card className="bg-primary/5">
      <CardHeader className="bg-primary text-primary-foreground p-4">
        <CardTitle>Add New Expense</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-1">
              <Label>Expense Type</Label>
              <Select onValueChange={(v) => setFormData(f => ({...f, expenseTypeId: v}))} value={formData.expenseTypeId}>
                <SelectTrigger><SelectValue placeholder="Choose Type" /></SelectTrigger>
                <SelectContent>{expenseTypes.map(et => <SelectItem key={et.id} value={et.id}>{et.expenseType}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Shift</Label>
              <Select onValueChange={(v) => setFormData(f => ({...f, shiftId: v}))} value={formData.shiftId}>
                <SelectTrigger><SelectValue placeholder="Choose Shift" /></SelectTrigger>
                <SelectContent>{shifts.map(s => <SelectItem key={s.id} value={s.id}>{s.shiftName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label>Amount</Label><Input name="amount" type="number" value={formData.amount} onChange={(e) => setFormData(f => ({...f, amount: e.target.value}))} /></div>
            <div className="space-y-1">
              <Label>Employee</Label>
              <Select onValueChange={(v) => setFormData(f => ({...f, employeeId: v}))} value={formData.employeeId}>
                <SelectTrigger><SelectValue placeholder="Select Employee" /></SelectTrigger>
                <SelectContent>{employees.map(emp => <SelectItem key={emp.id} value={emp.id}>{emp.employeeName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label>Flow</Label><RadioGroup value={formData.flow} onValueChange={(v) => setFormData(f => ({...f, flow: v}))} className="flex pt-2"><div className="flex items-center space-x-2"><RadioGroupItem value="Cash Out" id="cash_out" /><Label htmlFor="cash_out">Cash Out</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="Cash In" id="cash_in" /><Label htmlFor="cash_in">Cash In</Label></div></RadioGroup></div>
            <div className="lg:col-span-5 space-y-1"><Label>Description</Label><Textarea name="description" value={formData.description} onChange={(e) => setFormData(f => ({...f, description: e.target.value}))} /></div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Add Expense</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpensesForm;