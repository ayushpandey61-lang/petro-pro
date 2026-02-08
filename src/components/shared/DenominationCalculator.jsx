import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import useLocalStorage from '@/hooks/useLocalStorage';

const DenominationCalculator = ({ onValueChange }) => {
  const [denominations] = useLocalStorage('denominations', []);
  const [counts, setCounts] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newTotal = denominations.reduce((acc, denom) => {
      const value = parseInt(denom.denomination, 10);
      const count = parseInt(counts[denom.id] || 0, 10);
      return acc + (value * count);
    }, 0);
    setTotal(newTotal);
    if (onValueChange) {
      onValueChange(newTotal);
    }
  }, [counts, denominations, onValueChange]);

  const handleCountChange = (denomId, count) => {
    setCounts(prev => ({ ...prev, [denomId]: count }));
  };

  const sortedDenominations = [...denominations].sort((a, b) => parseInt(b.denomination, 10) - parseInt(a.denomination, 10));

  return (
    <div className="p-4 bg-card rounded-lg shadow-lg space-y-4">
      <div className="grid grid-cols-3 gap-x-4 gap-y-2">
        <Label className="font-semibold">Denomination</Label>
        <Label className="font-semibold">Count</Label>
        <Label className="font-semibold text-right">Amount</Label>
        {sortedDenominations.map(denom => (
          <React.Fragment key={denom.id}>
            <div className="flex items-center">{denom.denomination}</div>
            <div>
              <Input
                type="number"
                min="0"
                value={counts[denom.id] || ''}
                onChange={(e) => handleCountChange(denom.id, e.target.value)}
                className="h-8"
              />
            </div>
            <div className="flex items-center justify-end">
              ₹{((parseInt(denom.denomination, 10) || 0) * (parseInt(counts[denom.id], 10) || 0)).toLocaleString('en-IN')}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between items-center pt-4 border-t">
        <Label className="text-lg font-bold">Total</Label>
        <div className="text-lg font-bold">₹{total.toLocaleString('en-IN')}</div>
      </div>
    </div>
  );
};

export default DenominationCalculator;