import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { PlusCircle } from 'lucide-react';

const ExpenseTypeForm = ({ onSave, expenseType }) => {
  const [formData, setFormData] = useState({
    category: '',
    effectEmployee: false,
    effectProfit: false,
  });

  useEffect(() => {
    if (expenseType) {
      setFormData(expenseType);
    }
  }, [expenseType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    // Reset form
    setFormData({
      category: '',
      effectEmployee: false,
      effectProfit: false,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Expenses Type</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1 flex-grow">
              <Label>Expenses Category *</Label>
              <Input name="category" value={formData.category} onChange={handleChange} required />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="effect-employee" checked={formData.effectEmployee} onCheckedChange={(c) => handleSwitchChange('effectEmployee', c)} />
              <Label htmlFor="effect-employee">Effect Employee</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="effect-profit" checked={formData.effectProfit} onCheckedChange={(c) => handleSwitchChange('effectProfit', c)} />
              <Label htmlFor="effect-profit">Effect Profit</Label>
            </div>
             <Button type="button" size="icon" variant="ghost"><PlusCircle className="text-blue-500 h-6 w-6"/></Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseTypeForm;