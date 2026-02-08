import React, { useState, useEffect } from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Switch } from '@/components/ui/switch';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import useLocalStorage from '@/hooks/useLocalStorage';

    const TankForm = ({ onSave, tank }) => {
      const [products] = useLocalStorage('fuelProducts', []);
      const [formData, setFormData] = useState({
        tankName: '',
        productId: null,
        capacity: '',
        inside_length_m: '',
        inside_diameter_m: '',
        minLevel: '',
        openingStock: '',
        status: true,
      });

      useEffect(() => {
        if (tank) {
          setFormData({
              tankName: tank.tankName || '',
              productId: tank.productId || null,
              capacity: tank.capacity || '',
              inside_length_m: tank.inside_length_m || '',
              inside_diameter_m: tank.inside_diameter_m || '',
              minLevel: tank.minLevel || '',
              openingStock: tank.openingStock || '',
              status: tank.status !== undefined ? tank.status : true,
          });
        } else {
          setFormData({
            tankName: '',
            productId: null,
            capacity: '',
            inside_length_m: '',
            inside_diameter_m: '',
            minLevel: '',
            openingStock: '',
            status: true,
          });
        }
      }, [tank]);

      const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
      };
      
      const handleProductSelectChange = (value) => {
        setFormData(prev => ({ ...prev, productId: value }));
      };
      
      const handleStatusChange = (checked) => {
        setFormData(prev => ({ ...prev, status: checked }));
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        setFormData({
          tankName: '',
          productId: null,
          capacity: '',
          inside_length_m: '',
          inside_diameter_m: '',
          minLevel: '',
          openingStock: '',
          status: true,
        });
      };

      return (
        <Card>
          <CardHeader>
            <CardTitle>{tank ? 'Edit Tank' : 'Add Tank'}</CardTitle>
            <CardDescription>Fill in the details for the tank, including dimensions in meters for dip chart calculation.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tankName">Tank Name</Label>
                  <Input id="tankName" value={formData.tankName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productId">Product</Label>
                  <Select onValueChange={handleProductSelectChange} value={formData.productId}>
                    <SelectTrigger id="productId">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.productName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (Liters)</Label>
                  <Input id="capacity" type="number" value={formData.capacity} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inside_diameter_m">Inside Diameter (M)</Label>
                  <Input id="inside_diameter_m" type="number" value={formData.inside_diameter_m} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inside_length_m">Inside Length (M)</Label>
                  <Input id="inside_length_m" type="number" value={formData.inside_length_m} onChange={handleChange} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="minLevel">Minimum Level</Label>
                  <Input id="minLevel" type="number" value={formData.minLevel} onChange={handleChange} />
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
                <Button type="submit">{tank ? 'Update' : 'Save'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      );
    };

    export default TankForm;