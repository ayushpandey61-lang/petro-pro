import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useLocalStorage from '@/hooks/useLocalStorage';

const TankLorryForm = ({ onSave, lorry }) => {
  const [formData, setFormData] = useState({
    tankId: null,
    dipInMM: '',
    volumeInLtrs: '',
    type: 'Dip',
  });

  const [tanks] = useLocalStorage('tanks', []);

  useEffect(() => {
    if (lorry) {
      setFormData(lorry);
    }
  }, [lorry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!formData.tankId || !formData.dipInMM || !formData.volumeInLtrs){
        alert('Please fill all required fields');
        return;
    }
    onSave(formData);
    setFormData({ tankId: null, dipInMM: '', volumeInLtrs: '', type: 'Dip' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tank Dip Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <Label>Tank Name *</Label>
              <Select onValueChange={(v) => handleSelectChange('tankId', v)} value={formData.tankId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tank" />
                </SelectTrigger>
                <SelectContent>
                  {tanks.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.tankName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Dip in MM *</Label>
              <Input name="dipInMM" type="number" value={formData.dipInMM} onChange={handleChange} required />
            </div>
             <div className="space-y-1">
              <Label>Volume in Ltrs *</Label>
              <Input name="volumeInLtrs" type="number" value={formData.volumeInLtrs} onChange={handleChange} required />
            </div>
            <div className="space-y-1">
                <Label>Type</Label>
                 <RadioGroup value={formData.type} onValueChange={(v) => handleSelectChange('type', v)} className="flex">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Dip" id="dip" /><Label htmlFor="dip">Dip</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="Lorry" id="lorry" /><Label htmlFor="lorry">Lorry</Label></div>
                 </RadioGroup>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TankLorryForm;