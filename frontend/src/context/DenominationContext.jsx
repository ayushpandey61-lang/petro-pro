import React, { createContext, useContext, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DenominationCalculator from '@/components/shared/DenominationCalculator';

const DenominationContext = createContext();

export const useDenomination = () => useContext(DenominationContext);

export const DenominationProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [targetInput, setTargetInput] = useState(null);

  const openCalculator = (inputSetter) => {
    setTargetInput(() => inputSetter); // Store the setter function
    setIsOpen(true);
  };

  const closeCalculator = () => {
    setIsOpen(false);
    setTargetInput(null);
  };

  const handleValueChange = (value) => {
    if (targetInput) {
      targetInput(value);
    }
  };

  return (
    <DenominationContext.Provider value={{ openCalculator }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Denomination Calculator</DialogTitle>
          </DialogHeader>
          <DenominationCalculator onValueChange={handleValueChange} />
        </DialogContent>
      </Dialog>
    </DenominationContext.Provider>
  );
};