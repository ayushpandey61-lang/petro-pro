import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/DatePicker';
import { PenLine as FilePenLine, Info, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

const defaultState = {
  sale_date: new Date(),
  shift_id: '',
  employee_id: '',
  product_id: '',
  rate: '',
  quantity: '',
  discount: '',
  description: '',
  sale_type: 'Cash',
  gst_no: '',
  bill_no: '',
  indent: '',
};

const LubricantsSaleForm = ({ onSave, initialData, shifts, lubricants, employees, onCancel, loading }) => {
  const [formData, setFormData] = useState(defaultState);
  const isEditing = useMemo(() => !!initialData, [initialData]);

  useEffect(() => {
    if (isEditing) {
      setFormData({
        ...defaultState,
        ...initialData,
        sale_date: new Date(initialData.sale_date),
      });
    } else {
      setFormData(defaultState);
    }
  }, [initialData, isEditing]);
  
  const handleProductChange = (productId) => {
    const product = lubricants.find(l => l.id === productId);
    setFormData(prev => ({
      ...prev,
      product_id: productId,
      rate: product ? (product.saleRate || product.sale_rate || product.rate || '') : '',
    }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { sale_date, ...rest } = formData;
    const dataToSave = { ...rest, sale_date: sale_date.toISOString().split('T')[0] };
    onSave(dataToSave, isEditing);
    if (!isEditing) {
      setFormData(defaultState);
    }
  };

  const totalAmount = useMemo(() => {
    const amount = (formData.rate || 0) * (formData.quantity || 0);
    return amount > 0 ? amount.toFixed(2) : '0.00';
  }, [formData.rate, formData.quantity]);

  return (
    <Card className="glass-card">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="sale_date">Choose Date</Label>
              <DatePicker id="sale_date" value={formData.sale_date} onChange={(date) => handleChange('sale_date', date)} />
            </div>
            <div>
              <Label htmlFor="shift_id">Select Shift</Label>
              <Select id="shift_id" onValueChange={(v) => handleChange('shift_id', v)} value={formData.shift_id}>
                <SelectTrigger><SelectValue placeholder="Select Shift" /></SelectTrigger>
                <SelectContent>{shifts.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <Label>Total Amount</Label>
              <div className="flex items-center justify-center h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                {totalAmount}
              </div>
            </div>
            <div>
              <Label htmlFor="employee_id">Select Employee</Label>
              <Select id="employee_id" onValueChange={(v) => handleChange('employee_id', v)} value={formData.employee_id}>
                <SelectTrigger><SelectValue placeholder="Select Employee" /></SelectTrigger>
                <SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <Label htmlFor="product_id">Lubs Item</Label>
              <Select id="product_id" onValueChange={handleProductChange} value={formData.product_id}>
                <SelectTrigger><SelectValue placeholder="Select Product" /></SelectTrigger>
                <SelectContent>{lubricants.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rate">Sale Rate</Label>
              <Input id="rate" type="number" value={formData.rate} onChange={(e) => handleChange('rate', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" value={formData.quantity} onChange={(e) => handleChange('quantity', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="discount">Discount Amount</Label>
              <Input id="discount" type="number" value={formData.discount} onChange={(e) => handleChange('discount', e.target.value)} />
            </div>
            <div>
                <Label htmlFor="indent">Indent</Label>
                <Input id="indent" value={formData.indent} onChange={(e) => handleChange('indent', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
              <Label htmlFor="description">Employee Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
            </div>
            <div className="flex items-center pt-6 space-x-4">
              <Label>Sale Type:</Label>
              <RadioGroup value={formData.sale_type} onValueChange={(v) => handleChange('sale_type', v)} className="flex">
                <div className="flex items-center space-x-2"><RadioGroupItem value="Cash" id="cash" /><Label htmlFor="cash">Cash</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="Credit" id="credit" /><Label htmlFor="credit">Credit</Label></div>
              </RadioGroup>
            </div>
            <div className="flex items-center pt-6">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button type="button" variant="outline"><Info className="mr-2 h-4 w-4" /> GST / Bill Info</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>GST and Bill Information</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="gst_no">GST No.</Label>
                                <Input id="gst_no" value={formData.gst_no} onChange={(e) => handleChange('gst_no', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="bill_no">Bill No.</Label>
                                <Input id="bill_no" value={formData.bill_no} onChange={(e) => handleChange('bill_no', e.target.value)} />
                            </div>
                        </div>
                        <DialogClose asChild><Button type="button">Done</Button></DialogClose>
                    </DialogContent>
                </Dialog>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            {isEditing && (
              <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              <FilePenLine className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : (isEditing ? 'Update Sale' : 'Add Sale')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LubricantsSaleForm;