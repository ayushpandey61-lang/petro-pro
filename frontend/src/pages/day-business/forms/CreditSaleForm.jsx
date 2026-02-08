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
    <div className="form-container premium-card">
      <div className="form-header">
        <div className="relative z-10">
          <h2 className="form-title">Add New Credit Sale</h2>
          <p className="form-description mt-1 opacity-90">Record a new credit sale transaction</p>
        </div>
      </div>

      <div className="form-content">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Customer & Product Information */}
          <div className="form-section">
            <h3 className="form-subtitle mb-4">Customer & Product Information</h3>
            <div className="form-grid">
              <div className="form-field">
                <Label className="form-label">Organization</Label>
                <Select onValueChange={(v) => setFormData(f => ({...f, organizationId: v}))} value={formData.organizationId}>
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
                <Label className="form-label">Vehicle No</Label>
                <Input
                  name="vehicleNo"
                  value={formData.vehicleNo}
                  onChange={(e) => setFormData(f => ({...f, vehicleNo: e.target.value}))}
                  className="form-input"
                  placeholder="Enter vehicle number"
                />
              </div>
              <div className="form-field">
                <Label className="form-label">Product</Label>
                <Select onValueChange={(v) => setFormData(f => ({...f, productId: v}))} value={formData.productId}>
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
            </div>
          </div>

          {/* Transaction Details */}
          <div className="form-section">
            <h3 className="form-subtitle mb-4">Transaction Details</h3>
            <div className="form-grid">
              <div className="form-field">
                <Label className="form-label">Quantity (Liters)</Label>
                <Input
                  name="quantity"
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData(f => ({...f, quantity: e.target.value}))}
                  className="form-input"
                  placeholder="0.00"
                />
              </div>
              <div className="form-field">
                <Label className="form-label">Price per Liter</Label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(f => ({...f, price: e.target.value}))}
                  className="form-input"
                  placeholder="0.00"
                />
              </div>
              <div className="form-field">
                <Label className="form-label">Total Amount</Label>
                <Input
                  name="totalAmount"
                  type="number"
                  step="0.01"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData(f => ({...f, totalAmount: e.target.value}))}
                  className="form-input bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="form-section">
            <h3 className="form-subtitle mb-4">Additional Information</h3>
            <div className="form-grid">
              <div className="form-field md:col-span-2">
                <Label className="form-label">Description</Label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData(f => ({...f, description: e.target.value}))}
                  className="form-textarea"
                  placeholder="Enter any additional notes or description..."
                  rows={3}
                />
              </div>
              <div className="form-field">
                <Label className="form-label">Slip No</Label>
                <Input
                  name="slipNo"
                  value={formData.slipNo}
                  onChange={(e) => setFormData(f => ({...f, slipNo: e.target.value}))}
                  className="form-input"
                  placeholder="Enter slip number"
                />
              </div>
              <div className="form-field">
                <Label className="form-label">Mileage (KM)</Label>
                <Input
                  name="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData(f => ({...f, mileage: e.target.value}))}
                  className="form-input"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="form-divider"></div>

          <div className="form-button-group">
            <Button type="button" variant="outline" className="form-button-outline">
              Clear Form
            </Button>
            <Button type="submit" className="form-button-primary">
              Add Credit Sale
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreditSaleForm;