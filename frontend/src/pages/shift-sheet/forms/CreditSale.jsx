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
    <div className="form-section border-l-4 border-l-blue-500">
      <div className="form-grid">
        <div className="form-field">
          <Label className="form-label form-label-required">Organization</Label>
          <Select onValueChange={(v) => handleValueChange('organizationId', v)} value={formData.organizationId || ''} disabled={!isEditing}>
            <SelectTrigger className="form-select">
              <SelectValue placeholder="Choose Organization" />
            </SelectTrigger>
            <SelectContent>
              {creditParties.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.organizationName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="form-field">
          <Label className="form-label form-label-required">Vehicle No</Label>
          <Input
            name="vehicleNo"
            value={formData.vehicleNo}
            onChange={(e) => handleValueChange('vehicleNo', e.target.value)}
            readOnly={!isEditing}
            className="form-input"
            placeholder="Enter vehicle number"
          />
        </div>
        <div className="form-field">
          <Label className="form-label form-label-required">Product</Label>
          <Select onValueChange={(v) => handleValueChange('productId', v)} value={formData.productId || ''} disabled={!isEditing}>
            <SelectTrigger className="form-select">
              <SelectValue placeholder="Choose Product" />
            </SelectTrigger>
            <SelectContent>
              {fuelProducts.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.productName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="form-field">
          <Label className="form-label form-label-required">Quantity</Label>
          <Input
            type="number"
            step="0.01"
            name="quantity"
            value={formData.quantity}
            onChange={(e) => handleValueChange('quantity', e.target.value)}
            readOnly={!isEditing}
            className="form-input"
            placeholder="0.00"
          />
        </div>
        <div className="form-field">
          <Label className="form-label form-label-required">Price</Label>
          <Input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={(e) => handleValueChange('price', e.target.value)}
            readOnly={!isEditing}
            className="form-input"
            placeholder="0.00"
          />
        </div>
        <div className="form-field">
          <Label className="form-label form-label-required">Total Amount</Label>
          <Input
            type="number"
            step="0.01"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={(e) => handleValueChange('totalAmount', e.target.value)}
            readOnly={!isEditing}
            className="form-input bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            placeholder="0.00"
          />
        </div>
        <div className="form-field md:col-span-2">
          <Label className="form-label">Description</Label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={(e) => handleValueChange('description', e.target.value)}
            readOnly={!isEditing}
            className="form-textarea"
            placeholder="Enter description..."
            rows={2}
          />
        </div>
        <div className="form-field">
          <Label className="form-label">Slip No</Label>
          <Input
            name="slipNo"
            value={formData.slipNo}
            onChange={(e) => handleValueChange('slipNo', e.target.value)}
            readOnly={!isEditing}
            className="form-input"
            placeholder="Enter slip number"
          />
        </div>
        <div className="form-field">
          <Label className="form-label">Mileage</Label>
          <Input
            name="mileage"
            value={formData.mileage}
            onChange={(e) => handleValueChange('mileage', e.target.value)}
            readOnly={!isEditing}
            className="form-input"
            placeholder="0"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        {isEditing ? (
          <Button onClick={handleSaveClick} className="form-button-primary">
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        ) : (
          <Button variant="outline" size="icon" onClick={() => setIsEditing(true)} className="form-button-outline">
            <Edit className="h-4 w-4" />
          </Button>
        )}
        <Button variant="outline" size="icon" onClick={() => onRemove(formData.id)} className="border-red-500 text-red-600 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </Button>
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
      <div className="form-container premium-card">
        <div className="form-header">
          <div className="relative z-10">
            <h2 className="form-title">Credit Sale</h2>
            <p className="form-description mt-1 opacity-90">Record credit sales for this shift</p>
          </div>
        </div>
        <div className="form-content">
          <div className="flex items-center justify-center space-x-4 py-8">
            <Label className="form-label text-lg">Any Credit Sale in this shift?</Label>
            <Switch checked={showForm} onCheckedChange={setShowForm} />
            <Button onClick={() => setShowForm(true)} className="form-button-primary">
              Yes, Add Credit Sales
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container premium-card">
      <div className="form-header">
        <div className="relative z-10">
          <h2 className="form-title">Credit Sale Entry</h2>
          <p className="form-description mt-1 opacity-90">Manage credit sales for this shift</p>
        </div>
      </div>
      <div className="form-content">
        <div className="space-y-6">
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
          <div className="text-center">
            <Button onClick={handleAddItem} variant="outline" className="form-button-outline">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Credit Sale Entry
            </Button>
          </div>
        </div>
        <div className="form-divider"></div>
        <div className="form-button-group">
          <Button variant="outline" onClick={() => setShowForm(false)} className="form-button-secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveAndNextClick} className="form-button-primary">
            Save and Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreditSale;