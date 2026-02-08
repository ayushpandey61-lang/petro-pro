import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, Trash2, Edit, Save } from 'lucide-react';

const CreditSaleEntryForm = ({ onSave, onRemove, item, rates, creditParties, fuelProducts }) => {
  const [formData, setFormData] = useState(item);
  const [isEditing, setIsEditing] = useState(!item.organizationName);

  useEffect(() => {
    if (isEditing && formData.productId && !formData.price) {
      const rateInfo = rates.find(r => r.id === formData.productId);
      const price = rateInfo?.closeRate || rateInfo?.openSaleRate || '';
      handleValueChange('price', price);
    }
  }, [formData.productId, rates, isEditing]);

  const handleValueChange = (field, value) => {
    let newFormData = { ...formData, [field]: value };

    if (field === 'quantity' && newFormData.price) {
      newFormData.totalAmount = (parseFloat(value || 0) * parseFloat(newFormData.price)).toFixed(2);
    } else if (field === 'totalAmount' && newFormData.price && parseFloat(newFormData.price) > 0) {
      newFormData.quantity = (parseFloat(value || 0) / parseFloat(newFormData.price)).toFixed(2);
    } else if (field === 'price' && newFormData.quantity) {
      newFormData.totalAmount = (parseFloat(newFormData.quantity) * parseFloat(value || 0)).toFixed(2);
    }

    setFormData(newFormData);
  };

  const handleSaveClick = () => {
    if (!formData.organizationId || !formData.productId || !formData.totalAmount || !formData.vehicleNo || !formData.quantity || !formData.price) {
      alert("Organization, Vehicle No, Product, Quantity, Price and Total Amount are mandatory.");
      return;
    }
    const organization = creditParties.find(c => c.id === formData.organizationId);
    const product = fuelProducts.find(p => p.id === formData.productId);
    onSave({
      ...formData,
      organizationName: organization ? organization.organizationName : 'N/A',
      productName: product ? product.productName : 'N/A',
    });
    setIsEditing(false);
  };

  return (
    <div className="border p-4 rounded-md space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1">
          <Label>Organization*</Label>
          <Select onValueChange={(v) => handleValueChange('organizationId', v)} value={formData.organizationId || ''} disabled={!isEditing}>
            <SelectTrigger><SelectValue placeholder="Choose Organization" /></SelectTrigger>
            <SelectContent>{creditParties.map(c => <SelectItem key={c.id} value={c.id}>{c.organizationName}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1"><Label>Vehicle No*</Label><Input name="vehicleNo" value={formData.vehicleNo} onChange={(e) => handleValueChange('vehicleNo', e.target.value)} readOnly={!isEditing} /></div>
        <div className="space-y-1">
          <Label>Product*</Label>
          <Select onValueChange={(v) => handleValueChange('productId', v)} value={formData.productId || ''} disabled={!isEditing}>
            <SelectTrigger><SelectValue placeholder="Choose Product" /></SelectTrigger>
            <SelectContent>{fuelProducts.map(p => <SelectItem key={p.id} value={p.id}>{p.productName}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1"><Label>Quantity*</Label><Input type="number" name="quantity" value={formData.quantity} onChange={(e) => handleValueChange('quantity', e.target.value)} readOnly={!isEditing} /></div>
        <div className="space-y-1"><Label>Price*</Label><Input type="number" name="price" value={formData.price} onChange={(e) => handleValueChange('price', e.target.value)} readOnly={!isEditing} /></div>
        <div className="space-y-1"><Label>Total Amount*</Label><Input type="number" name="totalAmount" value={formData.totalAmount} onChange={(e) => handleValueChange('totalAmount', e.target.value)} readOnly={!isEditing} /></div>
        <div className="space-y-1"><Label>Description</Label><Textarea name="description" value={formData.description} onChange={(e) => handleValueChange('description', e.target.value)} readOnly={!isEditing} /></div>
        <div className="space-y-1"><Label>Slip No</Label><Input name="slipNo" value={formData.slipNo} onChange={(e) => handleValueChange('slipNo', e.target.value)} readOnly={!isEditing} /></div>
        <div className="space-y-1"><Label>Mileage</Label><Input name="mileage" value={formData.mileage} onChange={(e) => handleValueChange('mileage', e.target.value)} readOnly={!isEditing} /></div>
      </div>
      <div className="flex justify-end space-x-2">
        {isEditing ? (
          <Button onClick={handleSaveClick}><Save className="mr-2 h-4 w-4" /> Save</Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4" /></Button>
        )}
        <Button variant="ghost" size="icon" onClick={() => onRemove(formData.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </div>
    </div>
  );
};

const CreditSale = ({ data, updateData, onSaveAndNext, rates }) => {
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState([]);
  const [creditParties] = useLocalStorage('creditParties', []);
  const [fuelProducts] = useLocalStorage('fuelProducts', []);
  const { toast } = useToast();

  useEffect(() => {
    setItems(data?.items || []);
    if (data?.items?.length > 0) {
      setShowForm(true);
    }
  }, [data]);

  const handleAddItem = () => {
    setItems([...items, {
      id: uuidv4(),
      organizationId: '',
      productId: '',
      vehicleNo: '',
      quantity: '',
      price: '',
      totalAmount: '',
      description: '',
      slipNo: '',
      mileage: '',
    }]);
  };

  const handleSaveItem = (savedItem) => {
    const newItems = items.map(i => i.id === savedItem.id ? savedItem : i);
    setItems(newItems);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSaveAndNextClick = () => {
    const hasUnsaved = items.some(item => !item.organizationName);
    if (hasUnsaved) {
      toast({ variant: 'destructive', title: 'Unsaved Changes', description: 'Please save all credit sale entries before proceeding.' });
      return;
    }
    updateData({ ...data, items });
    toast({ title: "Credit Sale Saved!", description: "Proceeding to next section." });
    onSaveAndNext();
  };

  if (!showForm) {
    return (
      <Card>
        <CardHeader><CardTitle>Credit Sale</CardTitle></CardHeader>
        <CardContent className="flex items-center space-x-2">
          <Label>Any Credit Sale in this shift?</Label>
          <Switch checked={showForm} onCheckedChange={setShowForm} />
          <Button onClick={() => setShowForm(true)}>Yes</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Credit Sale Entry</CardTitle>
        <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map(item => (
            <CreditSaleEntryForm
              key={item.id}
              item={item}
              onSave={handleSaveItem}
              onRemove={handleRemoveItem}
              rates={rates}
              creditParties={creditParties}
              fuelProducts={fuelProducts}
            />
          ))}
          <Button onClick={handleAddItem} variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Credit Sale</Button>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSaveAndNextClick} className="bg-green-600 hover:bg-green-700">Save and Next</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditSale;