import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FilePenLine, X, Save } from 'lucide-react';

const defaultState = {
  productName: '',
  shortName: '',
  vat: '',
  tcs: '',
  gst: '',
  lfr_kl: '',
  description: '',
  status: true,
};

const LiquidForm = ({ onSave, liquid, onCancel }) => {
  const [formData, setFormData] = useState(defaultState);
  const isEditing = !!liquid;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        ...defaultState,
        ...liquid,
      });
    } else {
      setFormData(defaultState);
    }
  }, [liquid, isEditing]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.productName.trim()) {
      alert('Product name is required');
      return;
    }

    if (!formData.shortName.trim()) {
      alert('Short name is required');
      return;
    }

    // Convert numeric fields
    const dataToSave = {
      ...formData,
      vat: parseFloat(formData.vat) || 0,
      tcs: parseFloat(formData.tcs) || 0,
      gst: parseFloat(formData.gst) || 0,
      lfr_kl: parseFloat(formData.lfr_kl) || 0,
    };

    onSave(dataToSave);
    if (!isEditing) {
      setFormData(defaultState);
    }
  };

  const handleCancel = () => {
    setFormData(defaultState);
    if (onCancel) onCancel();
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FilePenLine className="h-5 w-5" />
          {isEditing ? 'Edit Liquid Product' : 'Add New Liquid Product'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName" className="text-sm font-medium">
                Product Name *
              </Label>
              <Input
                id="productName"
                type="text"
                value={formData.productName}
                onChange={(e) => handleChange('productName', e.target.value)}
                placeholder="e.g., Petrol, Diesel, CNG"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortName" className="text-sm font-medium">
                Short Name *
              </Label>
              <Input
                id="shortName"
                type="text"
                value={formData.shortName}
                onChange={(e) => handleChange('shortName', e.target.value)}
                placeholder="e.g., PET, DIE, CNG"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vat" className="text-sm font-medium">
                VAT (%)
              </Label>
              <Input
                id="vat"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.vat}
                onChange={(e) => handleChange('vat', e.target.value)}
                placeholder="0.00"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tcs" className="text-sm font-medium">
                TCS (%)
              </Label>
              <Input
                id="tcs"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.tcs}
                onChange={(e) => handleChange('tcs', e.target.value)}
                placeholder="0.00"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gst" className="text-sm font-medium">
                GST (%)
              </Label>
              <Input
                id="gst"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.gst}
                onChange={(e) => handleChange('gst', e.target.value)}
                placeholder="0.00"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lfr_kl" className="text-sm font-medium">
                LFR/KL
              </Label>
              <Input
                id="lfr_kl"
                type="number"
                step="0.01"
                min="0"
                value={formData.lfr_kl}
                onChange={(e) => handleChange('lfr_kl', e.target.value)}
                placeholder="0.00"
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Additional notes about the liquid product..."
              className="w-full min-h-[80px]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={formData.status}
                onCheckedChange={(checked) => handleChange('status', checked)}
              />
              <Label htmlFor="status" className="text-sm font-medium">
                {formData.status ? 'Active' : 'Inactive'}
              </Label>
            </div>

            <div className="flex gap-2">
              {isEditing && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              )}
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? 'Update Product' : 'Save Product'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LiquidForm;