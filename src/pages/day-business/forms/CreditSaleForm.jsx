import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuidv4 } from 'uuid';

const CreditSaleForm = ({ onSave }) => {
  const [creditParties] = useLocalStorage('creditParties', []);
  const [fuelProducts] = useLocalStorage('fuelProducts', []);
  
  const [formData, setFormData] = useState({
    organizationId: null,
    productId: null,
    vehicleNo: '',
    quantity: '',
    price: '',
    totalAmount: '',
    description: '',
    slipNo: '',
    mileage: '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.organizationId || !formData.productId || !formData.totalAmount) {
        // Simple validation
        alert("Please fill organization, product, and total amount.");
        return;
    }
    const organization = creditParties.find(c => c.id === formData.organizationId);
    const product = fuelProducts.find(p => p.id === formData.productId);
    onSave({
      id: uuidv4(),
      ...formData,
      organizationName: organization ? organization.organizationName : 'N/A',
      productName: product ? product.productName : 'N/A',
    });
    // Reset form
    setFormData({
      organizationId: null,
      productId: null,
      vehicleNo: '',
      quantity: '',
      price: '',
      totalAmount: '',
      description: '',
      slipNo: '',
      mileage: '',
    });
  };

  return (
    <Card className="bg-primary/5">
      <CardHeader className="bg-primary text-primary-foreground p-4">
        <CardTitle>Add New Credit Sale</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSave} className="space-y-4">
          <Card className="p-4 bg-background/70">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label>Organization</Label>
                <Select onValueChange={(v) => setFormData(f => ({...f, organizationId: v}))} value={formData.organizationId}>
                  <SelectTrigger><SelectValue placeholder="Choose Organization" /></SelectTrigger>
                  <SelectContent>{creditParties.map(c => <SelectItem key={c.id} value={c.id}>{c.organizationName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Vehicle No</Label>
                <Input name="vehicleNo" value={formData.vehicleNo} onChange={(e) => setFormData(f => ({...f, vehicleNo: e.target.value}))} />
              </div>
              <div className="space-y-1">
                <Label>Product</Label>
                <Select onValueChange={(v) => setFormData(f => ({...f, productId: v}))} value={formData.productId}>
                  <SelectTrigger><SelectValue placeholder="Choose Product" /></SelectTrigger>
                  <SelectContent>{fuelProducts.map(p => <SelectItem key={p.id} value={p.id}>{p.productName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Quantity</Label><Input name="quantity" value={formData.quantity} onChange={(e) => setFormData(f => ({...f, quantity: e.target.value}))} /></div>
              <div className="space-y-1"><Label>Price</Label><Input name="price" value={formData.price} onChange={(e) => setFormData(f => ({...f, price: e.target.value}))} /></div>
              <div className="space-y-1"><Label>Total Amount</Label><Input name="totalAmount" value={formData.totalAmount} onChange={(e) => setFormData(f => ({...f, totalAmount: e.target.value}))} /></div>
              <div className="space-y-1"><Label>Description</Label><Textarea name="description" value={formData.description} onChange={(e) => setFormData(f => ({...f, description: e.target.value}))} /></div>
              <div className="space-y-1"><Label>Slip No</Label><Input name="slipNo" value={formData.slipNo} onChange={(e) => setFormData(f => ({...f, slipNo: e.target.value}))} /></div>
              <div className="space-y-1"><Label>Mileage</Label><Input name="mileage" value={formData.mileage} onChange={(e) => setFormData(f => ({...f, mileage: e.target.value}))} /></div>
            </div>
          </Card>
          <div className="flex justify-end">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Add Credit Sale</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreditSaleForm;