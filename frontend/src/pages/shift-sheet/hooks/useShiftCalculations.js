import { useMemo } from 'react';

const useShiftCalculations = (shiftData) => {
  return useMemo(() => {
    if (!shiftData || Object.keys(shiftData).length === 0) {
      return {
        sale: 0, liquidSale: 0, lubeSaleCash: 0, lubeSaleCredit: 0, creditSale: 0,
        credit: 0, recovery: 0, swipe: 0, expense: 0, cashIn: 0,
        cashHandovered: 0, shiftShort: 0, overallShortage: 0, cashToBeCollected: 0,
      };
    }

    const liquidSaleTotal = shiftData.liquidSale?.readings?.reduce((acc, r) => acc + (parseFloat(r.saleAmount) || 0), 0) || 0;
    const lubeSaleCashTotal = shiftData.lubeSale?.items?.filter(i => i.saleType === 'Cash').reduce((acc, i) => acc + (parseFloat(i.amount) || 0), 0) || 0;
    const lubeSaleCreditTotal = shiftData.lubeSale?.items?.filter(i => i.saleType === 'Credit').reduce((acc, i) => acc + (parseFloat(i.amount) || 0), 0) || 0;
    const creditSaleTotal = shiftData.creditSale?.items?.reduce((acc, i) => acc + (parseFloat(i.totalAmount) || 0), 0) || 0;
    
    const cashRecoveryTotal = shiftData.recovery?.items?.filter(i => i.collectionMode === 'Cash').reduce((acc, i) => acc + (parseFloat(i.amount) || 0), 0) || 0;
    const swipeRecoveryTotal = shiftData.recovery?.items?.filter(i => i.collectionMode === 'Swipe').reduce((acc, i) => acc + (parseFloat(i.amount) || 0), 0) || 0;
    
    const swipeTotalRaw = shiftData.swipe?.items?.reduce((acc, i) => acc + (parseFloat(i.amount) || 0), 0) || 0;
    const swipeTotal = swipeTotalRaw - swipeRecoveryTotal;

    const expensesOutTotal = shiftData.expenses?.items?.filter(i => i.flow === 'Cash Out').reduce((acc, i) => acc + (parseFloat(i.amount) || 0), 0) || 0;
    const expensesInTotal = shiftData.expenses?.items?.filter(i => i.flow === 'Cash In').reduce((acc, i) => acc + (parseFloat(i.amount) || 0), 0) || 0;
    
    const cashHandoveredTotal = shiftData.cashHandover?.items?.reduce((acc, i) => acc + (parseFloat(i.amount) || 0), 0) || 0;
    
    // Total cash that should have been collected
    const totalCashInflow = liquidSaleTotal + lubeSaleCashTotal + cashRecoveryTotal + expensesInTotal;
    
    // Total credit given out during the shift
    const totalCreditGiven = creditSaleTotal + lubeSaleCreditTotal;

    // All cash outflows from the drawer
    const totalCashOutflow = expensesOutTotal + cashHandoveredTotal;
    
    // Shortage calculation
    // Expected cash in hand = Total Cash Inflow - Total Cash Outflow
    // Accounted for (non-cash) = Total Credit Given + Total Swipe
    // Shortage = Expected cash in hand - Accounted for (non-cash)
    // This seems wrong. Let's use the user's logic.
    // Shortage = (Total Sale + Lube Cash Sale + Recovery Cash + Expense Cash In) - (Credit Sale + Swipe + Expense Cash Out + Cash Handover)
    
    const shiftShort = totalCashInflow - (totalCreditGiven + swipeTotal + totalCashOutflow);
    
    // Assuming previous shortage is not yet tracked, so it's 0
    const previousShortage = 0; 
    const overallShortage = previousShortage + shiftShort;

    return {
      sale: totalCashInflow, // This is total business amount
      liquidSale: liquidSaleTotal,
      lubeSaleCash: lubeSaleCashTotal,
      lubeSaleCredit: lubeSaleCreditTotal,
      creditSale: creditSaleTotal,
      credit: totalCreditGiven,
      recovery: cashRecoveryTotal,
      swipe: swipeTotal,
      expense: expensesOutTotal,
      cashIn: expensesInTotal,
      cashHandovered: cashHandoveredTotal,
      shiftShort: shiftShort,
      overallShortage: overallShortage,
      cashToBeCollected: totalCashInflow - swipeTotal,
    };
  }, [shiftData]);
};

export default useShiftCalculations;