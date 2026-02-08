import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';

const LubricantForm = ({ onSave, lubricant }) => {
  const [formData, setFormData] = useState({
    productName: '',
    gst: '',
    hsnCode: '',
    mrpRate: '',
    saleRate: '',
    minQuantity: '',
    openingStock: '',
    status: true,
  });

  useEffect(() => {
    if (lubricant) {
      setFormData(lubricant);
    } else {
      setFormData({
        productName: '',
        gst: '',
        hsnCode: '',
        mrpRate: '',
        saleRate: '',
        minQuantity: '',
        openingStock: '',
        status: true,
      });
    }
  }, [lubricant]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleStatusChange = (checked) => {
    setFormData(prev => ({ ...prev, status: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      productName: '',
      gst: '',
      hsnCode: '',
      mrpRate: '',
      saleRate: '',
      minQuantity: '',
      openingStock: '',
      status: true,
    });
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
    <Card>
      <CardHeader>
        <CardTitle>{lubricant ? 'Edit Lubricant' : 'Add Lubricant'}</CardTitle>
        <CardDescription>Fill in the details for the lubricant product.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input id="productName" value={formData.productName} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gst">GST(%)</Label>
              <Input id="gst" type="number" value={formData.gst} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hsnCode">HSN Code</Label>
              <Input id="hsnCode" value={formData.hsnCode} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mrpRate">MRP Rate</Label>
              <Input id="mrpRate" type="number" value={formData.mrpRate} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="saleRate">Sale Rate</Label>
              <Input id="saleRate" type="number" value={formData.saleRate} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minQuantity">Minimum Quantity</Label>
              <Input id="minQuantity" type="number" value={formData.minQuantity} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="openingStock">Opening Stock</Label>
              <Input id="openingStock" type="number" value={formData.openingStock} onChange={handleChange} />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Switch id="status" checked={formData.status} onCheckedChange={handleStatusChange} />
              <Label htmlFor="status">Status</Label>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">{lubricant ? 'Update' : 'Save'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </motion.div>
  );
};

export default LubricantForm;