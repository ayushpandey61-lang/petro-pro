import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useLocalStorage from '@/hooks/useLocalStorage';
import { PlusCircle } from 'lucide-react';

const NozzleForm = ({ onSave, nozzle }) => {
  const [formData, setFormData] = useState({
    pump: '',
    tankId: null,
    nozzleName: '',
  });

  const [tanks] = useLocalStorage('tanks', []);
  const [fuelProducts] = useLocalStorage('fuelProducts', []);

  useEffect(() => {
    if (nozzle) {
      setFormData(nozzle);
    }
  }, [nozzle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value) => {
    const selectedTank = tanks.find(t => t.id === value);
    setFormData(prev => ({ 
      ...prev, 
      tankId: value, 
      productId: selectedTank?.productId 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ pump: '', tankId: null, nozzleName: '', productId: null });
  };
  
  const getTankDisplay = (tank) => {
    const product = fuelProducts.find(p => p.id === tank.productId);
    return `${tank.tankName} (${product?.productName || 'N/A'})`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Pump & Nozzle</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1 flex-grow">
              <Label>Pump *</Label>
              <Input name="pump" value={formData.pump} onChange={handleChange} required />
            </div>
            <div className="space-y-1 flex-grow">
              <Label>Tank *</Label>
              <Select onValueChange={handleSelectChange} value={formData.tankId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tank" />
                </SelectTrigger>
                <SelectContent>
                  {tanks.map(t => (
                    <SelectItem key={t.id} value={t.id}>{getTankDisplay(t)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 flex-grow">
              <Label>Nozzle *</Label>
              <Input name="nozzleName" value={formData.nozzleName} onChange={handleChange} required />
            </div>
            <Button type="button" size="icon" variant="ghost"><PlusCircle className="text-blue-500 h-6 w-6"/></Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NozzleForm;