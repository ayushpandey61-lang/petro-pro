import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import useLocalStorage from '@/hooks/useLocalStorage';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useDenomination } from '@/context/DenominationContext';

const VendorTransactionForm = ({ onSave }) => {
  const [vendors] = useLocalStorage('vendors', []);
  const { openCalculator } = useDenomination();
  const [formData, setFormData] = useState({
    date: new Date(),
    number: '',
    creditDebit: 'Credit',
    vendorId: '',
    amount: '',
    payMode: 'Cash',
    description: '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    const vendor = vendors.find(v => v.id === formData.vendorId);
    onSave({
      ...formData,
      vendorName: vendor ? vendor.vendorName : 'N/A',
      date: format(formData.date, "yyyy-MM-dd"),
    });
  };

  const setAmount = (value) => {
    setFormData(f => ({ ...f, amount: value }));
  };

  return (
    <Card className="bg-primary/5">
      <CardHeader className="bg-primary text-primary-foreground p-4">
        <CardTitle>Vendor Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1">
              <Label>Date</Label>
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
            <div className="space-y-1"><Label>Number</Label><Input name="number" value={formData.number} onChange={(e) => setFormData(f => ({...f, number: e.target.value}))} /></div>
            <div className="flex items-center space-x-4 pt-6"><RadioGroup value={formData.creditDebit} onValueChange={(v) => setFormData(f => ({...f, creditDebit: v}))} className="flex"><div className="flex items-center space-x-2"><RadioGroupItem value="Credit" id="vt_credit" /><Label htmlFor="vt_credit">Credit</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="Debit" id="vt_debit" /><Label htmlFor="vt_debit">Debit</Label></div></RadioGroup></div>
            <div className="space-y-1 flex-grow">
              <Label>Select Bank</Label>
              <Select onValueChange={(v) => setFormData(f => ({...f, vendorId: v}))} value={formData.vendorId}>
                <SelectTrigger><SelectValue placeholder="Select Vendor" /></SelectTrigger>
                <SelectContent>{vendors.map(v => <SelectItem key={v.id} value={v.id}>{v.vendorName}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Amount</Label>
              <div className="flex items-center gap-1">
                <Input name="amount" type="number" value={formData.amount} onChange={(e) => setFormData(f => ({...f, amount: e.target.value}))} />
                <Button type="button" variant="outline" size="icon" onClick={() => openCalculator(setAmount)}><ListOrdered className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="space-y-1"><Label>Description</Label><Textarea name="description" value={formData.description} onChange={(e) => setFormData(f => ({...f, description: e.target.value}))} /></div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VendorTransactionForm;