import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';

const BusinessCrDrPartyForm = ({ onSave, party }) => {
  const [formData, setFormData] = useState({
    date: new Date(),
    partyType: null,
    name: '',
    phone: '',
    email: '',
    address: '',
    openingBalance: '',
    openingDate: new Date(),
    balanceType: null,
    description: ''
  });

  useEffect(() => {
    if (party) {
      setFormData({
        ...party,
        date: new Date(party.date),
        openingDate: new Date(party.openingDate),
      });
    }
  }, [party]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (name, date) => {
    setFormData(prev => ({ ...prev, [name]: date }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    // Reset form
    setFormData({
      date: new Date(),
      partyType: null,
      name: '',
      phone: '',
      email: '',
      address: '',
      openingBalance: '',
      openingDate: new Date(),
      balanceType: null,
      description: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Busi. Cr/Dr Party</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-1">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.date} onSelect={(d) => handleDateChange('date', d)} initialFocus /></PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label>Party Type</Label>
              <Select onValueChange={(v) => handleSelectChange('partyType', v)} value={formData.partyType}>
                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                <SelectContent><SelectItem value="creditor">Creditor</SelectItem><SelectItem value="debtor">Debtor</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Party Name</Label>
              <Input name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <Label>Phone Num</Label>
              <Input name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <Label>Address</Label>
              <Input name="address" value={formData.address} onChange={handleChange} />
            </div>
          </div>
          <Card className="p-4 bg-background">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div className="space-y-1">
                <Label>Opening Balance</Label>
                <Input name="openingBalance" type="number" value={formData.openingBalance} onChange={handleChange} />
              </div>
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
                <Label>Choose Type</Label>
                <Select onValueChange={(v) => handleSelectChange('balanceType', v)} value={formData.balanceType}>
                  <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                  <SelectContent><SelectItem value="payable">Payable</SelectItem><SelectItem value="receivable">Receivable</SelectItem></SelectContent>
                </Select>
              </div>
               <div className="space-y-1">
                <Label>Description</Label>
                <Textarea name="description" value={formData.description} onChange={handleChange} />
              </div>
            </div>
          </Card>
          <div className="flex justify-end">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BusinessCrDrPartyForm;