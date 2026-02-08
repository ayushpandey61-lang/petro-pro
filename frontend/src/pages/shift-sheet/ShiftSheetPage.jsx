import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { Droplets, CreditCard, Wallet, Coins, Banknote, ClipboardCheck, Receipt, BarChart } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO } from 'date-fns';

import ShiftSheetHeader from './components/ShiftSheetHeader';
import ShiftSelection from './components/ShiftSelection';
import ShiftSummaryDisplay from './components/ShiftSummaryDisplay';
import ShiftTabs from './components/ShiftTabs';
import useShiftCalculations from './hooks/useShiftCalculations';

const QuickLink = ({ to, icon: Icon, label }) => (
  <NavLink to={to} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
    <div className="p-3 bg-primary/10 rounded-full">
      <Icon className="h-5 w-5" />
    </div>
    <span className="text-xs font-medium">{label}</span>
  </NavLink>
);

const ShiftSheetPage = () => {
  const { id: recordId } = useParams();
  const navigate = useNavigate();
  const [shifts] = useLocalStorage('shifts', []);
  const [employees] = useLocalStorage('employees', []);
  const [rates, setRates] = useLocalStorage('dailySaleRates', []);
  const [shiftRecords, setShiftRecords] = useLocalStorage('shiftRecords', []);
  const [, setLubricantsSales] = useLocalStorage('lubricantsSales', []);
  const [, setSwipes] = useLocalStorage('swipes', []);
  const [, setCreditSales] = useLocalStorage('creditSales', []);
  const [, setExpenses] = useLocalStorage('expenses', []);
  const [, setRecoveries] = useLocalStorage('recoveries', []);
  const [, setEmployeeCashRecoveries] = useLocalStorage('employeeCashRecoveries', []);
  const [nozzles, setNozzles] = useLocalStorage('nozzles', []);
  
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [filters, setFilters] = useState({
    date: new Date(),
    shiftId: null,
    employeeId: null,
  });
  const [currentRates, setCurrentRates] = useState([]);
  const [shiftData, setShiftData] = useState({});
  
  const { toast } = useToast();
  const summaryTotals = useShiftCalculations(shiftData);

  const initializeShiftData = (ratesToUse = currentRates) => {
    const newShiftData = {
      id: uuidv4(),
      ...filters,
      date: format(filters.date, 'yyyy-MM-dd'),
      liquidSale: { readings: [], totals: {} },
      lubeSale: { items: [], total: 0 },
      creditSale: { items: [], total: 0 },
      recovery: { items: [], total: 0 },
      cashHandover: { items: [], total: 0 },
      swipe: { items: [], total: 0 },
      expenses: { items: [], total: 0 },
      summary: { shiftShort: 0, overallShort: 0, sale: 0 },
    };
    setShiftData(newShiftData);
    return newShiftData;
  };

  useEffect(() => {
    if (recordId) {
      const recordToEdit = shiftRecords.find(r => r.id === recordId);
      if (recordToEdit) {
        setFilters({
          date: parseISO(recordToEdit.date),
          shiftId: recordToEdit.shiftId,
          employeeId: recordToEdit.employeeId,
        });
        setShiftData(recordToEdit);
        setShowSheet(true);
      } else {
        toast({ variant: "destructive", title: "Error", description: "Shift record not found." });
        navigate('/shift-sheet-entry');
      }
    }
  }, [recordId, shiftRecords, navigate, toast]);

  useEffect(() => {
    if (filters.date) {
      const dateStr = format(filters.date, 'yyyy-MM-dd');
      const rateForDate = rates.find(r => r.businessDate === dateStr);
      setCurrentRates(rateForDate ? rateForDate.products : []);
    }
  }, [filters.date, rates]);

  const handleOpenSheet = () => {
    if (filters.date && filters.shiftId && filters.employeeId) {
      const dateStr = format(filters.date, 'yyyy-MM-dd');
      const rateForDate = rates.find(r => r.businessDate === dateStr);
      if (rateForDate?.products?.length > 0) {
        setCurrentRates(rateForDate.products);
        setShowSheet(true);
        if (!recordId) {
          initializeShiftData(rateForDate.products);
        }
      } else {
        toast({ variant: "destructive", title: "Rates not set!", description: "Please set the daily sale rates for this date first." });
        setIsRateModalOpen(true);
      }
    } else {
      toast({ variant: "destructive", title: "Missing Info", description: "Please select a shift, employee, and date." });
    }
  };

  const handleRatesSaved = (savedRates) => {
    const dateStr = format(filters.date, 'yyyy-MM-dd');
    const existingRateIndex = rates.findIndex(r => r.businessDate === dateStr);
    if (existingRateIndex > -1) {
      const updatedRates = [...rates];
      updatedRates[existingRateIndex] = { ...updatedRates[existingRateIndex], products: savedRates };
      setRates(updatedRates);
    } else {
      setRates([...rates, { id: `RATE-${Date.now()}`, businessDate: dateStr, chooseDate: filters.date, products: savedRates, status: true, created: new Date().toLocaleString() }]);
    }
    setCurrentRates(savedRates);
    setIsRateModalOpen(false);
    setShowSheet(true);
    if (!recordId) {
      initializeShiftData(savedRates);
    }
    toast({ title: "Success", description: "Rates for the day have been set." });
  };

  const updateShiftData = (section, data) => {
    setShiftData(prev => ({ ...prev, [section]: data }));
  };

  const synchronizeDayBusinessData = (finalShiftData) => {
    const { date, employeeId } = finalShiftData;
    const employee = employees.find(e => e.id === employeeId);
    const employeeName = employee ? employee.employeeName : 'N/A';

    if (finalShiftData.lubeSale?.items.length > 0) {
      const newLubeSales = finalShiftData.lubeSale.items.map(item => ({...item, date, employeeId, employeeName, quantity: item.qty}));
      setLubricantsSales(prev => [...prev, ...newLubeSales]);
    }
    if (finalShiftData.swipe?.items.length > 0) {
      const newSwipes = finalShiftData.swipe.items.map(item => ({...item, date, employeeId, employeeName}));
      setSwipes(prev => [...prev, ...newSwipes]);
    }
    if (finalShiftData.creditSale?.items.length > 0) {
      const newCreditSales = finalShiftData.creditSale.items.map(item => ({...item, date}));
      setCreditSales(prev => [...prev, ...newCreditSales]);
    }
    if (finalShiftData.expenses?.items.length > 0) {
      const newExpenses = finalShiftData.expenses.items.map(item => ({...item, date, employeeId: item.employeeId || employeeId, employeeName: item.employeeName || employeeName }));
      setExpenses(prev => [...prev, ...newExpenses]);
    }
    if (finalShiftData.recovery?.items.length > 0) {
      const newRecoveries = finalShiftData.recovery.items.map(item => ({...item, date, employeeId, employeeName}));
      setRecoveries(prev => [...prev, ...newRecoveries]);
    }
    if (finalShiftData.cashHandover?.items.length > 0) {
      const newCashRecoveries = finalShiftData.cashHandover.items.map(item => ({...item, date, employeeId, employeeName}));
      setEmployeeCashRecoveries(prev => [...prev, ...newCashRecoveries]);
    }
  };

  const handleFinalizeShift = () => {
    const finalShiftData = { ...shiftData, summary: summaryTotals };
    
    const updatedNozzles = nozzles.map(n => {
        const reading = finalShiftData.liquidSale.readings.find(r => r.nozzleId === n.id);
        if (reading && reading.closingReading) {
            return { ...n, lastClosingReading: reading.closingReading };
        }
        return n;
    });
    setNozzles(updatedNozzles);

    if (recordId) {
        const updatedRecords = shiftRecords.map(r => r.id === recordId ? finalShiftData : r);
        setShiftRecords(updatedRecords);
        toast({ title: "Shift Updated!", description: "The shift record has been updated successfully." });
    } else {
        setShiftRecords([...shiftRecords, finalShiftData]);
        synchronizeDayBusinessData(finalShiftData);
        toast({ title: "Shift Finalized!", description: "The shift record has been saved successfully and all data has been synced." });
    }
    
    setShowSheet(false);
    setFilters({ date: new Date(), shiftId: null, employeeId: null });
    setShiftData({});
    navigate('/miscellaneous/sheet-record');
  };

  return (
    <>
      <Helmet>
        <title>{recordId ? 'Edit Shift Sheet' : 'Shift Sheet Entry'} - PetroPro</title>
        <meta name="description" content="Manage and enter daily shift sheet data." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6"
      >
        <Card>
          <CardContent className="p-4 flex justify-end items-center gap-4 sm:gap-6">
              <QuickLink to="/reports" icon={BarChart} label="Reports" />
              <QuickLink to="/day-business/sale-entry" icon={Receipt} label="Sale" />
              <QuickLink to="/day-business/lubricants-sale" icon={Droplets} label="Lubs Sale" />
              <QuickLink to="/day-business/swipe" icon={CreditCard} label="Swipe" />
              <QuickLink to="/day-business/credit-sale" icon={Wallet} label="Credit" />
              <QuickLink to="/day-business/expenses" icon={Banknote} label="Expenses" />
              <QuickLink to="/day-business/recovery" icon={Coins} label="Recovery" />
              <QuickLink to="/day-business/day-settlement" icon={ClipboardCheck} label="Settlement" />
          </CardContent>
        </Card>
        
        {!showSheet ? (
          <ShiftSelection
            filters={filters}
            setFilters={setFilters}
            shifts={shifts}
            employees={employees}
            handleOpenSheet={handleOpenSheet}
            recordId={recordId}
            onRatesSaved={handleRatesSaved}
            isRateModalOpen={isRateModalOpen}
            setIsRateModalOpen={setIsRateModalOpen}
          />
        ) : (
          <>
            <ShiftSheetHeader rates={currentRates} />
            <ShiftSummaryDisplay summary={summaryTotals} />
            <ShiftTabs
              shiftData={shiftData}
              updateShiftData={updateShiftData}
              rates={currentRates}
              onFinalize={handleFinalizeShift}
            />
          </>
        )}
      </motion.div>
    </>
  );
};

export default ShiftSheetPage;