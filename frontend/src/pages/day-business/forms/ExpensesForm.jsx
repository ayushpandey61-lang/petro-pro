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
    <div className="form-container premium-card">
      <div className="form-header">
        <div className="relative z-10">
          <h2 className="form-title">Add New Expense</h2>
          <p className="form-description mt-1 opacity-90">Record business expenses and cash flow</p>
        </div>
      </div>

      <div className="form-content">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Basic Information Section */}
          <div className="form-section">
            <h3 className="form-subtitle mb-4">Expense Details</h3>
            <div className="form-grid">
              <div className="form-field">
                <Label className="form-label">Expense Type</Label>
                <Select onValueChange={(v) => setFormData(f => ({...f, expenseTypeId: v}))} value={formData.expenseTypeId}>
                  <SelectTrigger className="form-select">
                    <SelectValue placeholder="Choose Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseTypes.map(et => (
                      <SelectItem key={et.id} value={et.id}>{et.expenseType}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="form-field">
                <Label className="form-label">Shift</Label>
                <Select onValueChange={(v) => setFormData(f => ({...f, shiftId: v}))} value={formData.shiftId}>
                  <SelectTrigger className="form-select">
                    <SelectValue placeholder="Choose Shift" />
                  </SelectTrigger>
                  <SelectContent>
                    {shifts.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.shiftName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="form-field">
                <Label className="form-label">Amount (₹)</Label>
                <Input
                  name="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(f => ({...f, amount: e.target.value}))}
                  className="form-input"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="form-section">
            <h3 className="form-subtitle mb-4">Additional Information</h3>
            <div className="form-grid">
              <div className="form-field">
                <Label className="form-label">Employee</Label>
                <Select onValueChange={(v) => setFormData(f => ({...f, employeeId: v}))} value={formData.employeeId}>
                  <SelectTrigger className="form-select">
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(emp => (
                      <SelectItem key={emp.id} value={emp.id}>{emp.employeeName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="form-field">
                <Label className="form-label">Flow Type</Label>
                <RadioGroup
                  value={formData.flow}
                  onValueChange={(v) => setFormData(f => ({...f, flow: v}))}
                  className="flex gap-6 pt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Cash Out" id="cash_out" />
                    <Label htmlFor="cash_out" className="form-label cursor-pointer">Cash Out</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Cash In" id="cash_in" />
                    <Label htmlFor="cash_in" className="form-label cursor-pointer">Cash In</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="form-field mt-4">
              <Label className="form-label">Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData(f => ({...f, description: e.target.value}))}
                className="form-textarea"
                placeholder="Enter expense description or additional notes..."
                rows={3}
              />
            </div>
          </div>

          <div className="form-divider"></div>

          <div className="form-button-group">
            <Button type="button" variant="outline" className="form-button-outline">
              Clear Form
            </Button>
            <Button type="submit" className="form-button-primary">
              Add Expense
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpensesForm;