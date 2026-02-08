import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { format, subDays } from 'date-fns';

const RateSetupModal = ({ isOpen, onClose, onSave, selectedDate }) => {
  const [fuelProducts] = useLocalStorage('fuelProducts', []);
  const [dailyRates] = useLocalStorage('dailySaleRates', []);
  const [productRates, setProductRates] = useState([]);

  useEffect(() => {
    if (isOpen && fuelProducts.length > 0 && selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const yesterdayStr = format(subDays(selectedDate, 1), 'yyyy-MM-dd');
      
      const ratesForToday = dailyRates.find(r => r.businessDate === dateStr)?.products;
      const ratesForYesterday = dailyRates.find(r => r.businessDate === yesterdayStr)?.products;

      const initialRates = fuelProducts.map(product => {
        const todayRate = ratesForToday?.find(r => r.id === product.id);
        const yesterdayRate = ratesForYesterday?.find(r => r.id === product.id);
        
        return {
          id: product.id,
          name: product.productName,
          shortName: product.shortName,
          openSaleRate: todayRate?.openSaleRate || yesterdayRate?.closeRate || '',
          closeRate: todayRate?.closeRate || '',
        };
      });
      setProductRates(initialRates);
    }
  }, [isOpen, fuelProducts, dailyRates, selectedDate]);

  const handleRateChange = (id, field, value) => {
    setProductRates(prevRates =>
      prevRates.map(rate =>
        rate.id === id ? { ...rate, [field]: value } : rate
      )
    );
  };

  const handleCopyRate = (id) => {
    setProductRates(prevRates =>
      prevRates.map(rate =>
        rate.id === id ? { ...rate, closeRate: rate.openSaleRate } : rate
      )
    );
  };

  const handleSave = () => {
    onSave(productRates);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Set Product Rates for {selectedDate ? format(selectedDate, 'PPP') : ''}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
          {productRates.map(rate => (
            <div key={rate.id} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={`product-${rate.id}`} className="text-right col-span-1">
                {rate.name}
              </Label>
              <Input
                id={`open-${rate.id}`}
                type="number"
                placeholder="Opening Rate"
                value={rate.openSaleRate}
                onChange={(e) => handleRateChange(rate.id, 'openSaleRate', e.target.value)}
                className="col-span-1"
              />
              <Input
                id={`close-${rate.id}`}
                type="number"
                placeholder="Closing Rate"
                value={rate.closeRate}
                onChange={(e) => handleRateChange(rate.id, 'closeRate', e.target.value)}
                className="col-span-1"
              />
              <Button variant="ghost" size="icon" onClick={() => handleCopyRate(rate.id)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>Save and Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RateSetupModal;