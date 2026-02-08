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
import { format, parseISO } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Textarea } from '@/components/ui/textarea';

const LiquidPurchaseForm = ({ onSave, initialData }) => {
  const [vendors] = useLocalStorage('vendors', []);
  const [fuelProducts] = useLocalStorage('fuelProducts', []);
  const [tanks] = useLocalStorage('tanks', []);

  const initialProductState = { 
    id: Date.now(), productId: '', productName: '', qty: '', cost: '', rsPerLiter: '',
    invoiceDensity: '', observedTemperature: '', observedDensity: '', densityAt15C: '', variation: '',
    otherTax: '', vat: '', tcs: '', total: '', tankLorryNo: '', decantedTankId: '', inclRate: ''
  };

  const getInitialFormData = () => {
    if (initialData) {
      return {
        ...initialData,
        invoiceDate: initialData.invoiceDate ? parseISO(initialData.invoiceDate) : new Date(),
        products: initialData.products.map(p => ({ ...initialProductState, ...p }))
      };
    }
    return {
      invoiceDate: new Date(), invoiceNo: '', image: '', description: '',
      vendorId: null, products: [initialProductState], totalAmount: 0,
    };
  };

  const [formData, setFormData] = useState(getInitialFormData);
  
  useEffect(() => {
    setFormData(getInitialFormData());
  }, [initialData]);

  useEffect(() => {
    const total = formData.products.reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0);
    setFormData(prev => ({ ...prev, totalAmount: total.toFixed(2) }));
  }, [formData.products]);

  const handleInvoiceChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, invoiceDate: date }));
  };
  
  const updateProduct = (index, newValues) => {
    const products = [...formData.products];
    products[index] = { ...products[index], ...newValues };

    const p = products[index];
    const qty = parseFloat(p.qty) || 0;
    const cost = parseFloat(p.cost) || 0;
    const vat = parseFloat(p.vat) || 0;
    const tcs = parseFloat(p.tcs) || 0;
    const otherTax = parseFloat(p.otherTax) || 0;
    
    p.rsPerLiter = qty > 0 ? (cost / qty).toFixed(4) : '0.0000';
    p.total = (cost + (cost * vat / 100) + (cost * tcs / 100) + (cost * otherTax / 100)).toFixed(2);
    p.inclRate = qty > 0 ? (p.total / qty).toFixed(4) : '0.0000';

    const temp = parseFloat(p.observedTemperature) || 0;
    const obsDensity = parseFloat(p.observedDensity) || 0;
    const invDensity = parseFloat(p.invoiceDensity) || 0;

    if (temp > 0 && obsDensity > 0) {
        const alpha = 0.00084;
        const correctedDensity = obsDensity * (1 - alpha * (15 - temp));
        p.densityAt15C = correctedDensity.toFixed(2);
        if (invDensity > 0) {
          p.variation = (correctedDensity - invDensity).toFixed(2);
        }
    } else {
        p.densityAt15C = '';
        p.variation = '';
    }

    setFormData(prev => ({ ...prev, products }));
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    updateProduct(index, { [name]: value });
  };

  const handleProductSelectChange = (index, field, value) => {
      if (field === 'productId') {
          const selectedProduct = fuelProducts.find(p => p.id === value);
          const autoDecantTank = tanks.find(t => t.productId === value);
          updateProduct(index, {
              productId: value,
              productName: selectedProduct ? selectedProduct.productName : '',
              decantedTankId: autoDecantTank ? autoDecantTank.id : ''
          });
      } else {
          updateProduct(index, { [field]: value });
      }
  };

  const addProduct = () => {
    setFormData(prev => ({ ...prev, products: [...prev.products, {...initialProductState, id: Date.now()}] }));
  };

  const removeProduct = (index) => {
    const products = [...formData.products];
    products.splice(index, 1);
    setFormData(prev => ({ ...prev, products }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const vendor = vendors.find(v => v.id === formData.vendorId);
    const enrichedProducts = formData.products.map(p => {
        const tank = tanks.find(t => t.id === p.decantedTankId);
        return {
            ...p,
            decantedTankNo: tank ? tank.tankName : 'N/A'
        }
    });
    
    onSave({ 
        ...formData, 
        vendorName: vendor ? vendor.vendorName : 'N/A', 
        invoiceDate: format(formData.invoiceDate, 'yyyy-MM-dd'),
        products: enrichedProducts
    });
    
    if (!initialData) { // Reset form only if it's a new entry
      setFormData(getInitialFormData());
    }
  };

  return (
    <Card className="bg-primary/5">
      <CardHeader className="bg-primary text-primary-foreground p-4">
        <CardTitle>{initialData ? 'Edit Liquid Invoice' : 'New Liquid Invoice'}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="invoice">
            <TabsList>
              <TabsTrigger value="invoice">Invoice</TabsTrigger>
              <TabsTrigger value="product">Product Details</TabsTrigger>
              <TabsTrigger value="density">Density Details</TabsTrigger>
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
                <div className="space-y-1">
                    <Label>Upload Image</Label>
                    <Input name="image" type="file" onChange={handleInvoiceChange} />
                    {formData.image && <img src={formData.image} alt="preview" className="h-16 mt-2 rounded-md" />}
                </div>
                <div className="space-y-1"><Label>Description</Label><Textarea name="description" value={formData.description} onChange={handleInvoiceChange} /></div>
                <div className="space-y-1">
                  <Label>Vendor</Label>
                  <Select onValueChange={(v) => setFormData(p => ({...p, vendorId: v}))} value={formData.vendorId}>
                    <SelectTrigger><SelectValue placeholder="Select Vendor" /></SelectTrigger>
                    <SelectContent>{vendors.filter(v => v.vendorType === 'Liquid').map(v => <SelectItem key={v.id} value={v.id}>{v.vendorName}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="product" className="mt-4">
              <div className="space-y-2">
                {formData.products.map((product, index) => (
                  <div key={product.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center border p-2 rounded-md">
                    <div className="col-span-12 md:col-span-2">
                      <Select onValueChange={(v) => handleProductSelectChange(index, 'productId', v)} value={product.productId}><SelectTrigger><SelectValue placeholder="Product" /></SelectTrigger><SelectContent>{fuelProducts.map(p => <SelectItem key={p.id} value={p.id}>{p.productName}</SelectItem>)}</SelectContent></Select>
                    </div>
                    <Input name="qty" className="md:col-span-1" placeholder="Qty (Liters)" value={product.qty} onChange={(e) => handleProductChange(index, e)} />
                    <Input name="cost" className="md:col-span-1" placeholder="Cost" value={product.cost} onChange={(e) => handleProductChange(index, e)} />
                    <Input name="rsPerLiter" className="md:col-span-1" placeholder="Rs/Liter" value={product.rsPerLiter} readOnly className="bg-muted" />
                    <Input name="otherTax" className="md:col-span-2" placeholder="Other Tax %" value={product.otherTax} onChange={(e) => handleProductChange(index, e)} />
                    <Input name="vat" className="md:col-span-1" placeholder="VAT %" value={product.vat} onChange={(e) => handleProductChange(index, e)} />
                    <Input name="tcs" className="md:col-span-1" placeholder="TCS %" value={product.tcs} onChange={(e) => handleProductChange(index, e)} />
                    <Input name="inclRate" className="md:col-span-1" placeholder="Incl. Rate" value={product.inclRate} readOnly className="bg-muted" />
                    <Input name="total" className="md:col-span-1" placeholder="Total" value={product.total} readOnly className="bg-muted" />
                    <div className="flex items-center gap-1 md:col-span-1">
                      {formData.products.length > 1 && <Button type="button" variant="destructive" size="icon" onClick={() => removeProduct(index)}><Trash2 className="h-4 w-4" /></Button>}
                    </div>
                  </div>
                ))}
              </div>
              <Button type="button" size="sm" variant="outline" onClick={addProduct} className="mt-2"><PlusCircle className="mr-2 h-4 w-4" />Add Product</Button>
            </TabsContent>
            <TabsContent value="density" className="mt-4">
                <div className="space-y-2">
                    {formData.products.map((product, index) => (
                        <div key={product.id} className="grid grid-cols-1 md:grid-cols-8 gap-2 items-center p-2 border rounded-md">
                            <Label className="font-semibold col-span-2">{product.productName || `Product ${index+1}`}</Label>
                            <Input name="invoiceDensity" type="number" step="0.50" placeholder="Invoice Density (KG/M³)" value={product.invoiceDensity} onChange={(e) => handleProductChange(index, e)} />
                            <Input name="observedTemperature" type="number" step="0.25" placeholder="Observed Temp (°C)" value={product.observedTemperature} onChange={(e) => handleProductChange(index, e)} />
                            <Input name="observedDensity" type="number" step="0.50" placeholder="Observed Density (KG/M³)" value={product.observedDensity} onChange={(e) => handleProductChange(index, e)} />
                            <Input name="densityAt15C" placeholder="Density at 15°C (KG/M³)" value={product.densityAt15C} readOnly className="bg-muted" />
                            <Input name="variation" placeholder="Variation" value={product.variation} readOnly className="bg-muted" />
                            <div className="col-span-1 grid grid-cols-1 gap-2">
                                <Select onValueChange={(v) => handleProductSelectChange(index, 'decantedTankId', v)} value={product.decantedTankId}>
                                    <SelectTrigger><SelectValue placeholder="Decanted Tank" /></SelectTrigger>
                                    <SelectContent>{tanks.filter(t => t.productId === product.productId).map(t => <SelectItem key={t.id} value={t.id}>{t.tankName}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>
                    ))}
                </div>
            </TabsContent>
          </Tabs>
          <div className="mt-4 p-4 bg-muted rounded-md flex justify-end items-center gap-4">
            <Label className="font-bold">Total Amount:</Label>
            <Input value={`₹${parseFloat(formData.totalAmount).toLocaleString('en-IN')}`} readOnly className="w-40 font-bold text-right" />
          </div>
          <div className="flex justify-end mt-4 gap-2">
            {initialData && <Button type="button" variant="outline" onClick={() => onSave(null)}>Cancel Edit</Button>}
            <Button type="submit" className="bg-green-600 hover:bg-green-700">{initialData ? 'Update' : 'Save'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LiquidPurchaseForm;