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
    <div className="form-container premium-card">
      <div className="form-header">
        <div className="relative z-10">
          <h2 className="form-title">{editingRate ? 'Edit Daily Sale Rate' : 'Add Daily Sale Rate'}</h2>
          <p className="form-description mt-1 opacity-90">Manage fuel product rates for the selected date</p>
        </div>
      </div>

      <div className="form-content">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection Section */}
          <div className="form-section">
            <h3 className="form-subtitle mb-4 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Date Selection
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="form-field">
                <Label className="form-label">Choose Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="form-input text-left justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.chooseDate ? format(formData.chooseDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={formData.chooseDate} onSelect={handleDateChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="form-field">
                <Label className="form-label">Business Date</Label>
                <Input
                  value={businessDate}
                  readOnly
                  className="form-input bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div className="form-field">
                <Button
                  type="button"
                  onClick={handleCopyRates}
                  variant="outline"
                  className="form-button-outline h-12"
                >
                  {isCopied ? <RotateCcw className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {isCopied ? 'Reset Rates' : 'Copy Open to Close'}
                </Button>
              </div>
            </div>
          </div>

          {/* Rate Management Section */}
          <div className="form-section">
            <h3 className="form-subtitle mb-4">Rate Management</h3>
            <div className="space-y-4">
              {/* Header Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 bg-slate-100 dark:bg-slate-800 rounded-lg font-semibold text-slate-700 dark:text-slate-300">
                <div>Product Name</div>
                <div>Open Sale Rate</div>
                <div>Close Rate</div>
              </div>

              {/* Product Rows */}
              {formData.products.map((product, index) => (
                <div key={product.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {product.name}
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Open Sale Rate"
                    name="openSaleRate"
                    value={product.openSaleRate}
                    onChange={(e) => handleProductChange(index, e)}
                    className="form-input"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Close Rate"
                    name="closeRate"
                    value={product.closeRate}
                    onChange={(e) => handleProductChange(index, e)}
                    className="form-input"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form-divider"></div>

          <div className="form-button-group">
            <Button type="button" variant="outline" className="form-button-outline">
              Reset All
            </Button>
            <Button type="submit" variant="outline" className="form-button-secondary">
              Save & Next
            </Button>
            <Button type="submit" className="form-button-primary">
              Save Rates
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DailySaleRateForm;