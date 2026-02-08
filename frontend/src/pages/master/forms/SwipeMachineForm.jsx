import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SwipeMachineForm = ({ onSave, machine }) => {
  const [formData, setFormData] = useState({
    machineName: '',
    accountType: 'Bank',
  });

  useEffect(() => {
    if (machine) {
      setFormData(machine);
    }
  }, [machine]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, accountType: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ machineName: '', accountType: 'Bank' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Swipe Machine</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1 flex-grow">
              <Label>Machine Name *</Label>
              <Input name="machineName" value={formData.machineName} onChange={handleChange} required />
            </div>
            <div className="space-y-1 flex-grow">
              <Label>Account Type</Label>
              <Select onValueChange={handleSelectChange} value={formData.accountType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank">Bank</SelectItem>
                  <SelectItem value="Vendor">Vendor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SwipeMachineForm;