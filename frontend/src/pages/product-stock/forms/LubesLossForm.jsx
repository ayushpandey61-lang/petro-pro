import React, { useState } from 'react';
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
import useLocalStorage from '@/hooks/useLocalStorage';

const LubesLossForm = ({ onSave }) => {
  const [lubricants] = useLocalStorage('lubricants', []);
  const [formData, setFormData] = useState({
    date: new Date(),
    productId: '',
    quantity: '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    const product = lubricants.find(l => l.id === formData.productId);
    onSave({
      ...formData,
      productName: product ? product.productName : 'N/A',
      date: format(formData.date, "yyyy-MM-dd"),
    });
  };

  return (
    <Card className="bg-primary/5">
      <CardHeader className="bg-primary text-primary-foreground p-4">
        <CardTitle>Add Product</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <Label>Choose Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.date} onSelect={(d) => setFormData(f => ({...f, date: d}))} /></PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label>Lube Item</Label>
              <Select onValueChange={(v) => setFormData(f => ({...f, productId: v}))} value={formData.productId}>
                <SelectTrigger><SelectValue placeholder="Select Product" /></SelectTrigger>
                <SelectContent>{lubricants.map(l => <SelectItem key={l.id} value={l.id}>{l.productName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label>Quantity</Label><Input name="quantity" type="number" value={formData.quantity} onChange={(e) => setFormData(f => ({...f, quantity: e.target.value}))} /></div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Add</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LubesLossForm;