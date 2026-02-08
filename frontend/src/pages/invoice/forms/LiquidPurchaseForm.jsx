import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, PlusCircle, Trash2, Beaker, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const DensityEntryModal = ({ product, index, onUpdateProduct, trigger, tanks }) => {
  const [tempData, setTempData] = useState({
    invoiceDensity: product.invoiceDensity || '',
    observedTemperature: product.observedTemperature || '',
    observedDensity: product.observedDensity || '',
    densityAt15C: product.densityAt15C || '',
    variation: product.variation || '',
    tankLorryNo: product.tankLorryNo || '',
    decantedTankId: product.decantedTankId || ''
  });

  // Auto-calculate density at 15°C when hydrometer reading or temperature changes
  useEffect(() => {
    const hydrometerReading = parseFloat(tempData.observedDensity) || 0;
    const temperature = parseFloat(tempData.observedTemperature) || 0;

    if (hydrometerReading > 0 && temperature > 0) {
      // Standard petroleum density correction formula
      const alpha = 0.0008; // Coefficient of expansion
      const correctedDensity = hydrometerReading * (1 - alpha * (temperature - 15));
      const calculatedDensity = Math.round(correctedDensity * 100) / 100; // Round to 2 decimal places

      setTempData(prev => ({
        ...prev,
        densityAt15C: calculatedDensity.toFixed(2)
      }));

      // Calculate variation if invoice density is available
      const invoiceDensity = parseFloat(tempData.invoiceDensity) || 0;
      if (invoiceDensity > 0) {
        const variation = calculatedDensity - invoiceDensity;
        setTempData(prev => ({
          ...prev,
          variation: variation.toFixed(2)
        }));
      }
    }
  }, [tempData.observedDensity, tempData.observedTemperature, tempData.invoiceDensity]);

  const handleSave = () => {
    onUpdateProduct(index, tempData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Density Details - {product.productName || `Product ${index + 1}`}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Input
            name="invoiceDensity"
            type="number"
            step="0.50"
            placeholder="Invoice density @15"
            value={tempData.invoiceDensity}
            onChange={(e) => setTempData(prev => ({ ...prev, invoiceDensity: e.target.value }))}
          />
          <Input
            name="observedDensity"
            type="number"
            step="0.50"
            placeholder="Hydrometer reading"
            value={tempData.observedDensity}
            onChange={(e) => setTempData(prev => ({ ...prev, observedDensity: e.target.value }))}
          />
          <Input
            name="observedTemperature"
            type="number"
            step="0.25"
            placeholder="Temperature reading"
            value={tempData.observedTemperature}
            onChange={(e) => setTempData(prev => ({ ...prev, observedTemperature: e.target.value }))}
          />
          <Input
            name="densityAt15C"
            type="number"
            step="0.01"
            placeholder="Auto-calculated"
            value={tempData.densityAt15C}
            readOnly
            className="bg-muted"
          />
          <Input
            name="variation"
            type="number"
            step="0.01"
            placeholder="Auto-calculated"
            value={tempData.variation}
            readOnly
            className="bg-muted"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input
            name="tankLorryNo"
            placeholder="Tank Lorry No"
            value={tempData.tankLorryNo}
            onChange={(e) => setTempData(prev => ({ ...prev, tankLorryNo: e.target.value }))}
          />
          <Select onValueChange={(v) => setTempData(prev => ({ ...prev, decantedTankId: v }))} value={tempData.decantedTankId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Tank" />
            </SelectTrigger>
            <SelectContent>
              {tanks.filter(t => t.productId === product.productId).map(t => (
                <SelectItem key={t.id} value={t.id}>{t.tankName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={handleSave}>Save Density Details</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

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

  const [activeTab, setActiveTab] = useState("invoice");
  const [mandatoryFieldsValid, setMandatoryFieldsValid] = useState(false);

  // Check if mandatory fields are filled
  useEffect(() => {
    const isValid = formData.invoiceDate && formData.invoiceNo && formData.vendorId;
    setMandatoryFieldsValid(isValid);
  }, [formData.invoiceDate, formData.invoiceNo, formData.vendorId]);

  // Enable product details tab only if mandatory fields are valid
  useEffect(() => {
    if (mandatoryFieldsValid && activeTab === "invoice") {
      // Auto-switch to product details tab when mandatory fields are complete
      setTimeout(() => setActiveTab("product"), 500);
    }
  }, [mandatoryFieldsValid, activeTab]);

  return (
    <Card className="bg-primary/5">
      <CardHeader className="bg-primary text-primary-foreground p-4">
        <CardTitle>{initialData ? 'Edit Liquid Invoice' : 'New Liquid Invoice'}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="invoice" className="relative">
                Invoice Details
                {!mandatoryFieldsValid && <AlertCircle className="ml-1 h-3 w-3 text-red-500" />}
              </TabsTrigger>
              <TabsTrigger value="product" disabled={!mandatoryFieldsValid}>
                Product Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="invoice" className="mt-4">
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Please fill all mandatory fields (Date, Invoice No., Vendor) to proceed to Product Details.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.invoiceDate && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.invoiceDate ? format(formData.invoiceDate, "PPP") : <span>Select Date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.invoiceDate} onSelect={handleDateChange} initialFocus /></PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1">
                    <Input name="invoiceNo" placeholder="Invoice No." value={formData.invoiceNo} onChange={handleInvoiceChange} required />
                  </div>
                  <div className="space-y-1">
                    <Select onValueChange={(v) => setFormData(p => ({...p, vendorId: v}))} value={formData.vendorId} required>
                      <SelectTrigger><SelectValue placeholder="Select Vendor" /></SelectTrigger>
                      <SelectContent>{vendors.filter(v => v.vendorType === 'Liquid').map(v => <SelectItem key={v.id} value={v.id}>{v.vendorName}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1 md:col-span-2 lg:col-span-3">
                    <Label>Description</Label>
                    <Textarea name="description" value={formData.description} onChange={handleInvoiceChange} />
                  </div>
                  <div className="space-y-1">
                    <Label>Upload Image</Label>
                    <Input name="image" type="file" onChange={handleInvoiceChange} />
                    {formData.image && <img src={formData.image} alt="preview" className="h-16 mt-2 rounded-md" />}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="product" className="mt-4">
              <div className="space-y-2">
                {formData.products.map((product, index) => (
                  <div key={product.id} className="grid grid-cols-1 md:grid-cols-11 gap-2 items-center border p-2 rounded-md">
                    {/* Density Icon Button */}
                    <div className="flex justify-center">
                      <DensityEntryModal
                        product={product}
                        index={index}
                        onUpdateProduct={updateProduct}
                        tanks={tanks}
                        trigger={
                          <Button type="button" variant="outline" size="icon" className="h-8 w-8">
                            <Beaker className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </div>
                    <div className="col-span-12 md:col-span-2">
                      <Select onValueChange={(v) => handleProductSelectChange(index, 'productId', v)} value={product.productId}>
                        <SelectTrigger><SelectValue placeholder="Product" /></SelectTrigger>
                        <SelectContent>{fuelProducts.map(p => <SelectItem key={p.id} value={p.id}>{p.productName}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <Input name="qty" className="md:col-span-1" placeholder="Qty (Liters)" value={product.qty} onChange={(e) => handleProductChange(index, e)} />
                    <Input name="cost" className="md:col-span-1" placeholder="Cost" value={product.cost} onChange={(e) => handleProductChange(index, e)} />
                    <Input name="rsPerLiter" className="md:col-span-1 bg-muted" placeholder="Rs/Liter" value={product.rsPerLiter} readOnly />
                    <Input name="otherTax" className="md:col-span-1" placeholder="Other Tax %" value={product.otherTax} onChange={(e) => handleProductChange(index, e)} />
                    <Input name="vat" className="md:col-span-1" placeholder="VAT %" value={product.vat} onChange={(e) => handleProductChange(index, e)} />
                    <Input name="tcs" className="md:col-span-1" placeholder="TCS %" value={product.tcs} onChange={(e) => handleProductChange(index, e)} />
                    <Input name="inclRate" className="md:col-span-1 bg-muted" placeholder="Incl. Rate" value={product.inclRate} readOnly />
                    <Input name="total" className="md:col-span-1 bg-muted" placeholder="Total" value={product.total} readOnly />
                    <div className="flex items-center gap-1 md:col-span-1">
                      {formData.products.length > 1 && <Button type="button" variant="destructive" size="icon" onClick={() => removeProduct(index)}><Trash2 className="h-4 w-4" /></Button>}
                    </div>
                  </div>
                ))}
              </div>
              <Button type="button" size="sm" variant="outline" onClick={addProduct} className="mt-2"><PlusCircle className="mr-2 h-4 w-4" />Add Product</Button>
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