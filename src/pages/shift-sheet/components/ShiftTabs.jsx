import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LiquidSale from '../forms/LiquidSale';
import LubeSale from '../forms/LubeSale';
import CreditSale from '../forms/CreditSale';
import Recovery from '../forms/Recovery';
import CashHandover from '../forms/CashHandover';
import Swipe from '../forms/Swipe';
import Expenses from '../forms/Expenses';
import ShiftSummary from '../forms/ShiftSummary';

const ShiftTabs = ({ shiftData, updateShiftData, rates, onFinalize }) => {
  const [activeTab, setActiveTab] = useState('liquid_sale');

  const tabsConfig = [
    { value: 'liquid_sale', label: 'Sale', component: LiquidSale },
    { value: 'lube_sale', label: 'Lube Sale', component: LubeSale },
    { value: 'credit_sale', label: 'Credit Sale', component: CreditSale },
    { value: 'recovery', label: 'Recovery', component: Recovery },
    { value: 'swipe', label: 'Swipe', component: Swipe },
    { value: 'expenses', label: 'Expenses', component: Expenses },
    { value: 'cash_handover', label: 'Cash Handover', component: CashHandover },
    { value: 'summary', label: 'Summary', component: ShiftSummary },
  ];

  const handleSaveAndNext = useCallback(() => {
    const currentIndex = tabsConfig.findIndex(tab => tab.value === activeTab);
    if (currentIndex < tabsConfig.length - 1) {
      setActiveTab(tabsConfig[currentIndex + 1].value);
    }
  }, [activeTab, tabsConfig]);

  const componentsProps = {
    liquid_sale: { data: shiftData.liquidSale, updateData: (d) => updateShiftData('liquidSale', d), rates: rates, onSaveAndNext: handleSaveAndNext },
    lube_sale: { data: shiftData.lubeSale, updateData: (d) => updateShiftData('lubeSale', d), onSaveAndNext: handleSaveAndNext },
    credit_sale: { data: shiftData.creditSale, updateData: (d) => updateShiftData('creditSale', d), rates: rates, onSaveAndNext: handleSaveAndNext },
    recovery: { data: shiftData.recovery, updateData: (d) => updateShiftData('recovery', d), onSaveAndNext: handleSaveAndNext },
    cash_handover: { data: shiftData.cashHandover, updateData: (d) => updateShiftData('cashHandover', d), onSaveAndNext: handleSaveAndNext },
    swipe: { data: shiftData.swipe, updateData: (d) => updateShiftData('swipe', d), onSaveAndNext: handleSaveAndNext },
    expenses: { data: shiftData.expenses, updateData: (d) => updateShiftData('expenses', d), onSaveAndNext: handleSaveAndNext },
    summary: { shiftData: shiftData, onFinalize: onFinalize },
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 md:grid-cols-8">
        {tabsConfig.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
        ))}
      </TabsList>
      {tabsConfig.map(tab => (
        <TabsContent key={tab.value} value={tab.value} className="mt-4">
          {React.createElement(tab.component, componentsProps[tab.value])}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ShiftTabs;