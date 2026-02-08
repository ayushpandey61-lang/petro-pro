import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Copy, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, subDays } from 'date-fns';
import useLocalStorage from '@/hooks/useLocalStorage';

const DailySaleRateForm = ({ onSave, rate: editingRate }) => {
  const [fuelProducts] = useLocalStorage('fuelProducts', []);
  const [allRates] = useLocalStorage('dailySaleRates', []);
  const [formData, setFormData] = useState({
    chooseDate: new Date(),
    products: []
  });
  const [isCopied, setIsCopied] = useState(false);
  const originalCloseRates = useRef([]);

  const businessDate = format(formData.chooseDate, "yyyy-MM-dd");

  const populateFormForDate = (date) => {
    const selectedDateStr = format(date, 'yyyy-MM-dd');
    const rateForSelectedDate = allRates.find(r => format(new Date(r.chooseDate), 'yyyy-MM-dd') === selectedDateStr);

    if (rateForSelectedDate) {
      // If rates exist for the selected date, load them.
      setFormData({
        ...rateForSelectedDate,
        chooseDate: new Date(rateForSelectedDate.chooseDate),
      });
    } else {
      // If not, find the previous day's rates to populate the open rates.
      const prevDate = subDays(date, 1);
      const prevDateStr = format(prevDate, 'yyyy-MM-dd');
      const rateForPrevDate = allRates.find(r => format(new Date(r.chooseDate), 'yyyy-MM-dd') === prevDateStr);
      
      const initialProducts = fuelProducts.map(p => {
        const lastProductRate = rateForPrevDate?.products.find(lp => lp.id === p.id);
        return {
          id: p.id,
          name: p.productName,
          openSaleRate: lastProductRate?.closeRate || '',
          closeRate: '',
        };
      });
      setFormData({ chooseDate: date, products: initialProducts });
    }
  };
  
  useEffect(() => {
    if (editingRate) {
      setFormData({
        ...editingRate,
        chooseDate: new Date(editingRate.chooseDate),
      });
    } else {
      populateFormForDate(new Date());
    }
  }, [editingRate, fuelProducts]);

  const handleDateChange = (date) => {
    if (date) {
      populateFormForDate(date);
    }
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...formData.products];
    updatedProducts[index][name] = value;
    setFormData(prev => ({ ...prev, products: updatedProducts }));
  };
  
  const handleCopyRates = () => {
      if(!isCopied) {
        originalCloseRates.current = formData.products.map(p => p.closeRate);
        const updatedProducts = formData.products.map(p => ({
            ...p,
            closeRate: p.openSaleRate
        }));
        setFormData(prev => ({...prev, products: updatedProducts}));
        setIsCopied(true);
      } else {
        const updatedProducts = formData.products.map((p, index) => ({
            ...p,
            closeRate: originalCloseRates.current[index] || ''
        }));
        setFormData(prev => ({...prev, products: updatedProducts}));
        setIsCopied(false);
      }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      businessDate: businessDate
    });
    setFormData({
      chooseDate: new Date(),
      products: []
    });
    populateFormForDate(new Date());
    setIsCopied(false);
    originalCloseRates.current = [];
  };

  return (
    <Card className="bg-primary/5">
      <CardHeader className="bg-primary text-primary-foreground p-4">
        <CardTitle>{editingRate ? 'Edit Daily Sale Rate' : 'Add Daily Sale Rate'}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="space-y-1">
              <Label>Choose Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !formData.chooseDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.chooseDate ? format(formData.chooseDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.chooseDate} onSelect={handleDateChange} initialFocus /></PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label>Business Date</Label>
              <Input value={businessDate} readOnly />
            </div>
            <Button type="button" onClick={handleCopyRates} variant="outline" size="icon" className="ml-auto">
                {isCopied ? <RotateCcw className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">{isCopied ? 'Reset Rates' : 'Copy Open to Close Rates'}</span>
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center font-semibold">
                <Label>Product Name</Label>
                <Label>Open Sale Rate</Label>
                <Label>Close Rate</Label>
            </div>
            {formData.products.map((product, index) => (
              <div key={product.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <Label className="md:text-left font-semibold">{product.name}</Label>
                <Input placeholder="Open Sale Rate" name="openSaleRate" value={product.openSaleRate} onChange={(e) => handleProductChange(index, e)} />
                <Input placeholder="Close Rate" name="closeRate" value={product.closeRate} onChange={(e) => handleProductChange(index, e)} />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Save</Button>
            <Button type="submit" variant="outline">Save & Next</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DailySaleRateForm;