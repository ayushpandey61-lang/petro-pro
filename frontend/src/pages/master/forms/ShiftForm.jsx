import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const ShiftForm = ({ onSave, shift }) => {
  const [formData, setFormData] = useState({
    shiftName: '',
    fromTime: '',
    toTime: '',
    duties: '1.00',
  });

  useEffect(() => {
    if (shift) {
      setFormData(shift);
    }
  }, [shift]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ shiftName: '', fromTime: '', toTime: '', duties: '1.00' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Shifts</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1 flex-grow">
              <Label>Shift Name *</Label>
              <Input name="shiftName" value={formData.shiftName} onChange={handleChange} required />
            </div>
            <div className="space-y-1">
              <Label>From Time *</Label>
              <Input name="fromTime" type="time" value={formData.fromTime} onChange={handleChange} required />
            </div>
            <div className="space-y-1">
              <Label>To Time *</Label>
              <Input name="toTime" type="time" value={formData.toTime} onChange={handleChange} required />
            </div>
            <div className="space-y-1">
              <Label>Duties</Label>
              <Input name="duties" type="number" step="0.01" value={formData.duties} onChange={handleChange} />
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ShiftForm;