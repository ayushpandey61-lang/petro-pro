import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useLocalStorage from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

const SwipeForm = ({ onSave, swipe }) => {
  const [swipeMachines] = useLocalStorage('swipeMachines', []);
  const [shifts] = useLocalStorage('shifts', []);
  const [employees] = useLocalStorage('employees', []);
  const [formData, setFormData] = useState({
    swipeMachineId: null,
    shiftId: null,
    employeeId: null,
    batchNo: '',
    amount: '',
  });

  // Populate form when editing
  useEffect(() => {
    if (swipe) {
      setFormData({
        swipeMachineId: swipe.swipeMachineId || null,
        shiftId: swipe.shiftId || null,
        employeeId: swipe.employeeId || null,
        batchNo: swipe.batchNo || '',
        amount: swipe.amount || '',
      });
    } else {
      setFormData({
        swipeMachineId: null,
        shiftId: null,
        employeeId: null,
        batchNo: '',
        amount: '',
      });
    }
  }, [swipe]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.swipeMachineId || !formData.amount) {
        alert("Please select a machine and enter an amount.");
        return;
    }
    const machine = swipeMachines.find(m => m.id === formData.swipeMachineId);
    const shift = shifts.find(s => s.id === formData.shiftId);
    const employee = employees.find(emp => emp.id === formData.employeeId);
    onSave({
      id: uuidv4(),
      ...formData,
      swipeMachineName: machine ? machine.machineName : 'N/A',
      shiftName: shift ? shift.shiftName : 'N/A',
      employeeName: employee ? employee.employeeName : 'N/A',
    });
    setFormData({ swipeMachineId: null, shiftId: null, employeeId: null, batchNo: '', amount: '' });
  };

  return (
    <Card className="bg-primary/5">
      <CardHeader className="bg-primary text-primary-foreground p-4">
        <CardTitle>Add New Swipe Transaction</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-1">
              <Label>Swipe Machine</Label>
              <Select onValueChange={(v) => setFormData(f => ({...f, swipeMachineId: v}))} value={formData.swipeMachineId}>
                <SelectTrigger><SelectValue placeholder="Choose Swipe" /></SelectTrigger>
                <SelectContent>{swipeMachines.map(m => <SelectItem key={m.id} value={m.id}>{m.machineName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Shift</Label>
              <Select onValueChange={(v) => setFormData(f => ({...f, shiftId: v}))} value={formData.shiftId}>
                <SelectTrigger><SelectValue placeholder="Choose Shift" /></SelectTrigger>
                <SelectContent>{shifts.map(s => <SelectItem key={s.id} value={s.id}>{s.shiftName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Employee</Label>
              <Select onValueChange={(v) => setFormData(f => ({...f, employeeId: v}))} value={formData.employeeId}>
                <SelectTrigger><SelectValue placeholder="Choose Employee" /></SelectTrigger>
                <SelectContent>{employees.map(emp => <SelectItem key={emp.id} value={emp.id}>{emp.employeeName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label>Batch No</Label><Input name="batchNo" value={formData.batchNo} onChange={(e) => setFormData(f => ({...f, batchNo: e.target.value}))} /></div>
            <div className="space-y-1"><Label>Amount</Label><Input name="amount" type="number" value={formData.amount} onChange={(e) => setFormData(f => ({...f, amount: e.target.value}))} /></div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Add Swipe</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SwipeForm;