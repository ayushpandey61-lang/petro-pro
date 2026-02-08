import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const GuestCustomerForm = ({ onSave, customer }) => {
  const initialVehicle = { vehicleNo: '' };
  const [formData, setFormData] = useState({
    taxType: 'TIN',
    customerName: '',
    mobileNumber: '',
    discountAmount: '',
    vehicles: [initialVehicle],
    date: format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        ...customer,
        vehicles: customer.vehicles.length ? customer.vehicles : [initialVehicle],
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, taxType: value }));
  };

  const handleVehicleChange = (index, e) => {
    const { name, value } = e.target;
    const vehicles = [...formData.vehicles];
    vehicles[index][name] = value;
    setFormData(prev => ({...prev, vehicles}));
  };

  const addVehicle = () => {
    setFormData(prev => ({...prev, vehicles: [...prev.vehicles, initialVehicle]}));
  };

  const removeVehicle = (index) => {
    const vehicles = [...formData.vehicles];
    vehicles.splice(index, 1);
    setFormData(prev => ({...prev, vehicles}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      taxType: 'TIN', customerName: '', mobileNumber: '', discountAmount: '',
      vehicles: [initialVehicle], date: format(new Date(), "yyyy-MM-dd"),
    });
  };

  return (
    <Card className="bg-primary/5">
      <CardHeader className="bg-primary text-primary-foreground p-4">
        <CardTitle>Create Guest Customer</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-1">
              <Label>Choose Tax</Label>
              <Select onValueChange={handleSelectChange} value={formData.taxType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="TIN">TIN</SelectItem><SelectItem value="GST">GST</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label>Customer Name</Label><Input name="customerName" value={formData.customerName} onChange={handleChange} /></div>
            <div className="space-y-1"><Label>Mobile Number</Label><Input name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} /></div>
            <div className="space-y-1"><Label>Discount Amount</Label><Input name="discountAmount" value={formData.discountAmount} onChange={handleChange} /></div>
            <div className="space-y-1"><Label>GST / TIN</Label><Input /></div>
          </div>
          
          <div className="space-y-2">
            <Label>Vehicle Number</Label>
            {formData.vehicles.map((vehicle, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input name="vehicleNo" placeholder="Vehicle No" value={vehicle.vehicleNo} onChange={(e) => handleVehicleChange(index, e)} />
                {formData.vehicles.length > 1 && <Button type="button" variant="destructive" size="icon" onClick={() => removeVehicle(index)}><Trash2 className="h-4 w-4" /></Button>}
                {index === formData.vehicles.length - 1 && <Button type="button" size="icon" onClick={addVehicle}><PlusCircle className="h-4 w-4" /></Button>}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GuestCustomerForm;