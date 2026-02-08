import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';

const ExpiryItemForm = ({ onSave, item }) => {
  const [formData, setFormData] = useState({
    category: '',
    itemName: '',
    regNo: '',
    expiryDate: new Date(),
    alertDays: '',
    note: '',
    certificate: null,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        expiryDate: new Date(item.expiryDate),
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, expiryDate: date }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, certificate: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      expiryDate: format(formData.expiryDate, "yyyy-MM-dd")
    });
    setFormData({
      category: '',
      itemName: '',
      regNo: '',
      expiryDate: new Date(),
      alertDays: '',
      note: '',
      certificate: null,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Expiry/Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="space-y-1"><Label>Category</Label><Input name="category" value={formData.category} onChange={handleChange} /></div>
            <div className="space-y-1"><Label>Item Name</Label><Input name="itemName" value={formData.itemName} onChange={handleChange} /></div>
            <div className="space-y-1"><Label>Reg. No.</Label><Input name="regNo" value={formData.regNo} onChange={handleChange} /></div>
            <div className="space-y-1">
              <Label>Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.expiryDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiryDate ? format(formData.expiryDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.expiryDate} onSelect={handleDateChange} initialFocus /></PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1"><Label>Alert Days</Label><Input name="alertDays" type="number" value={formData.alertDays} onChange={handleChange} /></div>
            <div className="space-y-1"><Label>Upload Certificate</Label><Input type="file" onChange={handleFileChange} /></div>
            <div className="space-y-1 md:col-span-2"><Label>Note</Label><Textarea name="note" value={formData.note} onChange={handleChange} /></div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpiryItemForm;