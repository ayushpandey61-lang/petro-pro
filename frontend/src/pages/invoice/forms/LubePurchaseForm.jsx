import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Textarea } from '@/components/ui/textarea';

const LubePurchaseForm = ({ onSave }) => {
  const [vendors] = useLocalStorage('vendors', []);
  const [lubricants] = useLocalStorage('lubricants', []);
  
  const initialItem = { productId: null, qty: '', rate: '', vat: '', amount: '', discount: '', gst: '', tcs: '', total: '' };
  const [formData, setFormData] = useState({
    invoiceDate: new Date(),
    invoiceNo: '',
    image: '',
    description: '',
    vendorId: null,
    items: [initialItem],
    totalAmount: 0,
  });

  useEffect(() => {
    const total = formData.items.reduce((acc, i) => acc + (parseFloat(i.total) || 0), 0);
    setFormData(prev => ({ ...prev, totalAmount: total.toFixed(2) }));
  }, [formData.items]);

  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, invoiceDate: date }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...formData.items];
    items[index][name] = value;
    
    const item = items[index];
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    const amount = qty * rate;
    item.amount = amount.toFixed(2);
    
    const discount = parseFloat(item.discount) || 0;
    const gst = parseFloat(item.gst) || 0;
    const tcs = parseFloat(item.tcs) || 0;
    const discountedAmount = amount - discount;
    const total = discountedAmount + (discountedAmount * gst / 100) + (discountedAmount * tcs / 100);
    item.total = total.toFixed(2);

    setFormData(prev => ({ ...prev, items }));
  };

  const handleItemSelectChange = (index, value) => {
    const items = [...formData.items];
    items[index].productId = value;
    setFormData(prev => ({ ...prev, items }));
  };

  const addItem = () => {
    setFormData(prev => ({ ...prev, items: [...prev.items, initialItem] }));
  };

  const removeItem = (index) => {
    const items = [...formData.items];
    items.splice(index, 1);
    setFormData(prev => ({ ...prev, items }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const vendor = vendors.find(v => v.id === formData.vendorId);
    onSave({ ...formData, vendorName: vendor ? vendor.vendorName : 'N/A', invoiceDate: format(formData.invoiceDate, 'yyyy-MM-dd') });
  };

  return (
    <Card className="bg-primary/5">
      <CardHeader className="bg-primary text-primary-foreground p-4">
        <CardTitle>Lubricants Invoice Details</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="invoice">
            <TabsList>
              <TabsTrigger value="invoice">Invoice</TabsTrigger>
              <TabsTrigger value="items">Invoice Items</TabsTrigger>
            </TabsList>
            <TabsContent value="invoice" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <Label>Invoice Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.invoiceDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.invoiceDate ? format(formData.invoiceDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.invoiceDate} onSelect={handleDateChange} initialFocus /></PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1"><Label>Invoice No.</Label><Input name="invoiceNo" value={formData.invoiceNo} onChange={handleInvoiceChange} /></div>
                <div className="space-y-1"><Label>Upload Image</Label><Input name="image" type="file" /></div>
                <div className="space-y-1"><Label>Description</Label><Textarea name="description" value={formData.description} onChange={handleInvoiceChange} /></div>
                <div className="space-y-1">
                  <Label>Vendor</Label>
                  <Select onValueChange={(v) => setFormData(p => ({...p, vendorId: v}))} value={formData.vendorId}>
                    <SelectTrigger><SelectValue placeholder="Select Vendor" /></SelectTrigger>
                    <SelectContent>{vendors.filter(v => v.vendorType === 'Lube' || v.vendorType === 'Other').map(v => <SelectItem key={v.id} value={v.id}>{v.vendorName}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="items" className="mt-4">
              <div className="space-y-2">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-10 gap-2 items-center">
                    <Select onValueChange={(v) => handleItemSelectChange(index, v)} value={item.productId}><SelectTrigger className="col-span-2"><SelectValue placeholder="Product" /></SelectTrigger><SelectContent>{lubricants.map(l => <SelectItem key={l.id} value={l.id}>{l.productName}</SelectItem>)}</SelectContent></Select>
                    <Input name="qty" placeholder="Qty" value={item.qty} onChange={(e) => handleItemChange(index, e)} />
                    <Input name="rate" placeholder="Rate" value={item.rate} onChange={(e) => handleItemChange(index, e)} />
                    <Input name="amount" placeholder="Amount" value={item.amount} readOnly className="bg-muted" />
                    <Input name="discount" placeholder="Discount" value={item.discount} onChange={(e) => handleItemChange(index, e)} />
                    <Input name="gst" placeholder="GST %" value={item.gst} onChange={(e) => handleItemChange(index, e)} />
                    <Input name="tcs" placeholder="TCS %" value={item.tcs} onChange={(e) => handleItemChange(index, e)} />
                    <Input name="vat" placeholder="VAT" value={item.vat} onChange={(e) => handleItemChange(index, e)} />
                    <div className="flex items-center gap-1">
                      <Input name="total" placeholder="Total" value={item.total} readOnly className="bg-muted" />
                      {index > 0 && <Button type="button" variant="destructive" size="icon" onClick={() => removeItem(index)}><Trash2 className="h-4 w-4" /></Button>}
                    </div>
                  </div>
                ))}
              </div>
              <Button type="button" size="sm" variant="outline" onClick={addItem} className="mt-2"><PlusCircle className="mr-2 h-4 w-4" />Add Item</Button>
            </TabsContent>
          </Tabs>
          <div className="mt-4 p-4 bg-muted rounded-md flex justify-end items-center gap-4">
            <Label className="font-bold">Total Amount:</Label>
            <Input value={`₹${parseFloat(formData.totalAmount).toLocaleString('en-IN')}`} readOnly className="w-40 font-bold text-right" />
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LubePurchaseForm;