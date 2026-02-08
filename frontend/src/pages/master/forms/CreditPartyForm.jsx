import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const CreditPartyForm = ({ onSave, party }) => {
  const initialVehicle = { vehicleNo: '', vehicleType: null };
  const [formData, setFormData] = useState({
    registeredDate: new Date(),
    organizationName: '',
    tinGstNo: '',
    custRepresentName: '',
    organizationAddress: '',
    advanceRs: '',
    photo: '',
    phone: '',
    altPhone: '',
    creditLimit: '',
    username: '',
    password: '',
    email: '',
    openingBalance: '0',
    openingDate: new Date(),
    balanceType: 'Due',
    penaltyInterest: false,
    discountAmount: '0',
    offerType: 'Per Ltr',
    vehicles: [initialVehicle],
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (party) {
      setFormData({
        ...party,
        registeredDate: new Date(party.registeredDate),
        openingDate: new Date(party.openingDate),
        vehicles: party.vehicles || [initialVehicle],
      });
      if(party.photo) setPhotoPreview(party.photo);
    }
  }, [party]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({ ...prev, [name]: date }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVehicleChange = (index, e) => {
    const { name, value } = e.target;
    const vehicles = [...formData.vehicles];
    vehicles[index][name] = value;
    setFormData(prev => ({...prev, vehicles}));
  };
  
  const handleVehicleTypeChange = (index, value) => {
    const vehicles = [...formData.vehicles];
    vehicles[index].vehicleType = value;
    setFormData(prev => ({...prev, vehicles}));
  }

  const addVehicle = () => {
    setFormData(prev => ({...prev, vehicles: [...prev.vehicles, initialVehicle]}));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    // Optionally reset form
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Credit Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label>Registered Date*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.registeredDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.registeredDate ? format(formData.registeredDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.registeredDate} onSelect={(d) => handleDateChange('registeredDate', d)} initialFocus /></PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1"><Label>Organization Name*</Label><Input name="organizationName" value={formData.organizationName} onChange={handleChange} required /></div>
            <div className="space-y-1"><Label>TIN / GST NO</Label><Input name="tinGstNo" value={formData.tinGstNo} onChange={handleChange} /></div>
            <div className="space-y-1"><Label>Cust/Represent Name*</Label><Input name="custRepresentName" value={formData.custRepresentName} onChange={handleChange} required /></div>
            <div className="space-y-1"><Label>Organization Address</Label><Input name="organizationAddress" value={formData.organizationAddress} onChange={handleChange} /></div>
            <div className="space-y-1"><Label>Advance Rs/-</Label><Input name="advanceRs" type="number" value={formData.advanceRs} onChange={handleChange} /></div>
            <div className="space-y-1">
              <Label>Upload Image</Label>
              <Input name="photo" type="file" onChange={handlePhotoChange} />
              {photoPreview && <img src={photoPreview} alt="preview" className="h-16 mt-2" src="https://images.unsplash.com/photo-1610632533321-4f43939619a6"/>}
            </div>
            <div className="space-y-1"><Label>Phone No</Label><Input name="phone" type="tel" value={formData.phone} onChange={handleChange} /></div>
            <div className="space-y-1"><Label>Alt Phone No</Label><Input name="altPhone" type="tel" value={formData.altPhone} onChange={handleChange} /></div>
            <div className="space-y-1"><Label>Credit Limit</Label><Input name="creditLimit" type="number" value={formData.creditLimit} onChange={handleChange} /></div>
            <div className="space-y-1"><Label>User Name</Label><Input name="username" value={formData.username} onChange={handleChange} /></div>
            <div className="space-y-1"><Label>Password</Label><Input name="password" type="password" value={formData.password} onChange={handleChange} /></div>
            <div className="space-y-1 col-span-1 md:col-span-2"><Label>Email</Label><Input name="email" type="email" value={formData.email} onChange={handleChange} /></div>
          </div>

          <Card className="p-4 bg-background">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="space-y-1"><Label>Opening Balance</Label><Input name="openingBalance" type="number" value={formData.openingBalance} onChange={handleChange} /></div>
              <div className="space-y-1">
                <Label>Opening Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.openingDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.openingDate ? format(formData.openingDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.openingDate} onSelect={(d) => handleDateChange('openingDate', d)} initialFocus /></PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1">
                <Label>Balance Type</Label>
                <Select onValueChange={(v) => handleSelectChange('balanceType', v)} value={formData.balanceType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Due">Due : Will Receive</SelectItem><SelectItem value="Excess">Excess : Will Payback</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2"><Checkbox id="penaltyInterest" name="penaltyInterest" checked={formData.penaltyInterest} onCheckedChange={(c) => handleSelectChange('penaltyInterest', c)} /><label htmlFor="penaltyInterest" className="text-sm font-medium">Penalty Interest</label></div>
            </div>
          </Card>
          
           <Card className="p-4 bg-background">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1"><Label>Discount Amount</Label><Input name="discountAmount" type="number" value={formData.discountAmount} onChange={handleChange} /></div>
                <div className="space-y-1"><Label>Offer Type</Label><Select onValueChange={(v) => handleSelectChange('offerType', v)} value={formData.offerType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Per Ltr">Per Ltr</SelectItem><SelectItem value="Fixed">Fixed</SelectItem></SelectContent></Select></div>
            </div>
          </Card>

          <Card className="p-4 bg-background">
             <Label>Vehicles</Label>
            {formData.vehicles.map((vehicle, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 items-center">
                    <div className="space-y-1"><Label className="text-xs">Vehicle No</Label><Input name="vehicleNo" value={vehicle.vehicleNo} onChange={(e) => handleVehicleChange(index, e)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Vehicle Type</Label><Select onValueChange={(v) => handleVehicleTypeChange(index, v)} value={vehicle.vehicleType}><SelectTrigger><SelectValue placeholder="Select type"/></SelectTrigger><SelectContent><SelectItem value="car">Car</SelectItem><SelectItem value="truck">Truck</SelectItem><SelectItem value="bike">Bike</SelectItem></SelectContent></Select></div>
                    {index === formData.vehicles.length - 1 && <Button type="button" onClick={addVehicle} size="icon" className="self-end bg-blue-500 hover:bg-blue-600"><PlusCircle className="h-4 w-4"/></Button>}
                </div>
            ))}
          </Card>

          <div className="flex justify-end">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreditPartyForm;