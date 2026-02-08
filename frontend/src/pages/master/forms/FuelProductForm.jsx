import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlusCircle, X } from 'lucide-react';

const FuelProductForm = ({ onSave, product }) => {
  const [formRows, setFormRows] = useState([{
    productName: '',
    shortName: '',
    vat: '0',
    tcs: '0',
    gst: '0',
    lfr_kl: '0',
  }]);

  useEffect(() => {
    if (product) {
      setFormRows([product]);
    } else {
      setFormRows([{
        productName: '',
        shortName: '',
        vat: '0',
        tcs: '0',
        gst: '0',
        lfr_kl: '0',
      }]);
    }
  }, [product]);

  const handleChange = (index, field, value) => {
    const updatedRows = [...formRows];
    updatedRows[index][field] = value;
    setFormRows(updatedRows);
  };

  const addRow = () => {
    setFormRows([...formRows, {
      productName: '',
      shortName: '',
      vat: '0',
      tcs: '0',
      gst: '0',
      lfr_kl: '0',
    }]);
  };

  const removeRow = (index) => {
    if (formRows.length > 1) {
      setFormRows(formRows.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all rows
    for (let i = 0; i < formRows.length; i++) {
      const row = formRows[i];
      if (!row.productName.trim()) {
        alert(`Row ${i + 1}: Product name is required`);
        return;
      }
      if (!row.shortName.trim()) {
        alert(`Row ${i + 1}: Short name is required`);
        return;
      }
    }

    // Save all rows
    formRows.forEach(row => {
      const dataToSave = {
        ...row,
        vat: parseFloat(row.vat) || 0,
        tcs: parseFloat(row.tcs) || 0,
        gst: parseFloat(row.gst) || 0,
        lfr_kl: parseFloat(row.lfr_kl) || 0,
      };
      onSave(dataToSave);
    });

    // Reset form
    setFormRows([{
      productName: '',
      shortName: '',
      vat: '0',
      tcs: '0',
      gst: '0',
      lfr_kl: '0',
    }]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Fuel Products</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {formRows.map((row, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg bg-background/50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium">Product {index + 1}</h4>
                {formRows.length > 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeRow(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                <div className="space-y-1">
                  <Label>Product *</Label>
                  <Input
                    value={row.productName}
                    onChange={(e) => handleChange(index, 'productName', e.target.value)}
                    placeholder="e.g., Petrol, Diesel"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Short Name *</Label>
                  <Input
                    value={row.shortName}
                    onChange={(e) => handleChange(index, 'shortName', e.target.value)}
                    placeholder="e.g., PET, DIE"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>VAT(%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={row.vat}
                    onChange={(e) => handleChange(index, 'vat', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1">
                  <Label>TCS(%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={row.tcs}
                    onChange={(e) => handleChange(index, 'tcs', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1">
                  <Label>GST(%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={row.gst}
                    onChange={(e) => handleChange(index, 'gst', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-1">
                  <Label>LFR/KL</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={row.lfr_kl}
                    onChange={(e) => handleChange(index, 'lfr_kl', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={addRow}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Another Product
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Save All Products
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FuelProductForm;