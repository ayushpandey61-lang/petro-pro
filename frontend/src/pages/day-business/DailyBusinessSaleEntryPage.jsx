import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DataTable } from '@/components/ui/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { format, subDays } from 'date-fns';
import { NavLink } from 'react-router-dom';
import { Droplets, CreditCard, Wallet, Coins, Banknote, ClipboardCheck, Calendar as CalendarIcon, Receipt, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

const QuickLink = ({ to, icon: Icon, label }) => (
  <NavLink to={to} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
    <div className="p-3 bg-primary/10 rounded-full">
      <Icon className="h-5 w-5" />
    </div>
    <span className="text-xs font-medium">{label}</span>
  </NavLink>
);

const DailyBusinessSaleEntryPage = () => {
  const [shifts] = useLocalStorage('shifts', []);
  const [employees] = useLocalStorage('employees', []);
  const [nozzles, setNozzles] = useLocalStorage('nozzles', []);
  const [fuelProducts] = useLocalStorage('fuelProducts', []);
  const [tanks] = useLocalStorage('tanks', []);
  const [rates] = useLocalStorage('dailySaleRates', []);
  const [saleEntries, setSaleEntries] = useLocalStorage('dailyBusinessSaleEntries', []);
  const [shiftRecords] = useLocalStorage('shiftRecords', []);
  const { toast } = useToast();

  const [saleDate, setSaleDate] = useState(new Date());
  const [shiftId, setShiftId] = useState('');
  const [showNozzles, setShowNozzles] = useState(false);
  const [readings, setReadings] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);

  const closingReadingsBackup = useRef({});

  const handleShowNozzles = () => {
    const prevDateStr = format(subDays(saleDate, 1), 'yyyy-MM-dd');
    const rateForDate = rates.find(r => r.businessDate === format(saleDate, 'yyyy-MM-dd'));

    const initialReadings = nozzles.map(nozzle => {
      const tank = tanks.find(t => t.id === nozzle.tankId);
      const product = fuelProducts.find(p => p.id === tank?.productId);
      const rateInfo = rateForDate?.products.find(p => p.id === product?.id);

      const lastShiftRecord = [...shiftRecords]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .find(rec => rec.liquidSale.readings.some(r => r.nozzleId === nozzle.id));
      
      const lastReading = lastShiftRecord?.liquidSale.readings.find(r => r.nozzleId === nozzle.id);

      return {
        id: uuidv4(),
        nozzleId: nozzle.id,
        nozzleName: nozzle.nozzleName,
        productName: product?.productName || 'N/A',
        openingReading: lastReading?.closingReading || nozzle.lastClosingReading || '0',
        closingReading: '',
        test: '0',
        sale: '0',
        price: rateInfo?.closeRate || rateInfo?.openSaleRate || '0',
        saleAmount: '0',
        employeeId: '',
      };
    });
    setReadings(initialReadings);
    setShowNozzles(true);
  };

  const handleReadingChange = (id, field, value) => {
    setReadings(prevReadings =>
      prevReadings.map(r => {
        if (r.id === id) {
          const newReading = { ...r, [field]: value };
          const sale = (parseFloat(newReading.closingReading) || 0) - (parseFloat(newReading.openingReading) || 0);
          const netSale = sale - (parseFloat(newReading.test) || 0);
          newReading.sale = netSale.toFixed(2);
          newReading.saleAmount = (netSale * (parseFloat(newReading.price) || 0)).toFixed(2);
          return newReading;
        }
        return r;
      })
    );
  };

  const handleBulkCopy = () => {
    if (Object.keys(closingReadingsBackup.current).length > 0) {
      // Undo
      setReadings(prevReadings => 
        prevReadings.map(r => ({...r, closingReading: closingReadingsBackup.current[r.id] || r.closingReading }))
      );
      closingReadingsBackup.current = {};
      toast({ title: 'Undo successful', description: 'Closing readings restored.' });
    } else {
      // Copy
      const backup = {};
      setReadings(prevReadings => 
        prevReadings.map(r => {
          backup[r.id] = r.closingReading;
          if (!r.closingReading) {
            const updatedReading = { ...r, closingReading: r.openingReading };
            const sale = (parseFloat(updatedReading.closingReading) || 0) - (parseFloat(updatedReading.openingReading) || 0);
            const netSale = sale - (parseFloat(updatedReading.test) || 0);
            updatedReading.sale = netSale.toFixed(2);
            updatedReading.saleAmount = (netSale * (parseFloat(updatedReading.price) || 0)).toFixed(2);
            return updatedReading;
          }
          return r;
        })
      );
      closingReadingsBackup.current = backup;
      toast({ title: 'Copy successful', description: 'Opening readings copied to empty closing fields.' });
    }
  };

  const productSummary = useMemo(() => {
    return fuelProducts.map(product => {
      const productReadings = readings.filter(r => {
          const nozzle = nozzles.find(n => n.id === r.nozzleId);
          const tank = tanks.find(t => t.id === nozzle?.tankId);
          return tank?.productId === product.id;
      });
      const gross = productReadings.reduce((acc, r) => acc + (parseFloat(r.closingReading) || 0) - (parseFloat(r.openingReading) || 0), 0);
      const test = productReadings.reduce((acc, r) => acc + (parseFloat(r.test) || 0), 0);
      const net = gross - test;
      const amount = productReadings.reduce((acc, r) => acc + (parseFloat(r.saleAmount) || 0), 0);
      return { name: product.productName, gross: gross.toFixed(2), test: test.toFixed(2), net: net.toFixed(2), amount: amount.toFixed(2) };
    });
  }, [readings, fuelProducts, nozzles, tanks]);

  const totalAmount = useMemo(() => {
    return productSummary.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0).toFixed(2);
  }, [productSummary]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!shiftId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a shift.' });
      return;
    }

    const newEntry = {
      id: editingEntry ? editingEntry.id : uuidv4(),
      saleDate: format(saleDate, 'yyyy-MM-dd'),
      shiftId,
      readings,
      totalAmount,
      productSummary,
      created: editingEntry ? editingEntry.created : new Date().toISOString(),
      updated: new Date().toISOString(),
    };

    if (editingEntry) {
        setSaleEntries(saleEntries.map(entry => entry.id === editingEntry.id ? newEntry : entry));
        toast({ title: 'Success', description: 'Sale entry updated successfully.' });
    } else {
        setSaleEntries([...saleEntries, newEntry]);
        toast({ title: 'Success', description: 'Sale entry saved successfully.' });
    }

    // Update nozzle last closing readings
    const updatedNozzles = nozzles.map(n => {
        const reading = readings.find(r => r.nozzleId === n.id);
        if (reading && reading.closingReading) {
            return { ...n, lastClosingReading: reading.closingReading };
        }
        return n;
    });
    setNozzles(updatedNozzles);

    // Reset form
    setEditingEntry(null);
    setShowNozzles(false);
    setReadings([]);
    setShiftId('');
  };

  const handleEdit = (entry) => {
      setEditingEntry(entry);
      setSaleDate(new Date(entry.saleDate));
      setShiftId(entry.shiftId);
      setReadings(entry.readings);
      setShowNozzles(true);
  };
  
  const handleDelete = (id) => {
      setSaleEntries(saleEntries.filter(entry => entry.id !== id));
      toast({variant: "destructive", title: "Deleted", description: "Sale entry deleted."});
  };

  const columns = [
    {
      id: 'select',
      header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: 'S.No.',
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        return <span className="font-mono text-sm">{pageIndex * pageSize + row.index + 1}</span>;
      }
    },
    { accessorKey: 'saleDate', header: 'Sale Date' },
    { 
      accessorKey: 'pump', 
      header: 'Pump', 
      cell: ({ row }) => {
        const uniquePumps = [...new Set(row.original.readings.map(r => nozzles.find(n => n.id === r.nozzleId)?.pump))];
        return uniquePumps.join(', ');
      }
    },
    { 
      id: 'product',
      header: 'Product',
      cell: ({ row }) => {
        const uniqueProducts = [...new Set(row.original.readings.map(r => r.productName))];
        return uniqueProducts.join(', ');
      }
    },
    { 
      accessorKey: 'shiftId', 
      header: 'Shift', 
      cell: ({ row }) => shifts.find(s => s.id === row.original.shiftId)?.shiftName || 'N/A' 
    },
    { 
      id: 'nozzle',
      header: 'Nozzle',
      cell: ({ row }) => row.original.readings.length
    },
    { id: 'meterReadings', header: 'Meter Readings', cell: () => 'View' },
    { 
      id: 'price',
      header: 'Price',
      cell: ({ row }) => `₹${(parseFloat(row.original.readings[0]?.price) || 0).toFixed(2)}`
    },
    { 
      id: 'netSale', 
      header: 'Net Sale',
      cell: ({ row }) => row.original.readings.reduce((sum, r) => sum + (parseFloat(r.sale) || 0), 0).toFixed(2)
    },
    { 
      id: 'saleAmount', 
      header: 'Sale Amount',
      cell: ({ row }) => `₹${row.original.totalAmount}`
    },
    { 
      id: 'testQty', 
      header: 'Test Qty',
      cell: ({ row }) => row.original.readings.reduce((sum, r) => sum + (parseFloat(r.test) || 0), 0).toFixed(2)
    },
    { 
      id: 'employee', 
      header: 'Employee',
      cell: ({ row }) => {
        const empId = row.original.readings[0]?.employeeId;
        return employees.find(e => e.id === empId)?.employeeName || 'N/A';
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)} title="Edit">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original.id)} title="Delete" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: 'userLog',
      header: 'User Log Details',
      cell: ({ row }) => (
        <div className="text-xs">
          <p>Created: {new Date(row.original.created).toLocaleString()}</p>
          <p>Updated: {new Date(row.original.updated).toLocaleString()}</p>
        </div>
      )
    },
  ];

  return (
    <>
      <Helmet>
        <title>Daily Business Sale Entry - PetroPro</title>
        <meta name="description" content="A comprehensive page for daily business sale entries." />
      </Helmet>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-4 sm:p-6 space-y-6">
        
        <Card>
          <CardContent className="p-4 flex justify-end items-center gap-4 sm:gap-6">
            <QuickLink to="/day-business/sale-entry" icon={Receipt} label="Sale" />
            <QuickLink to="/day-business/lubricants-sale" icon={Droplets} label="Lubs Sale" />
            <QuickLink to="/day-business/swipe" icon={CreditCard} label="Swipe" />
            <QuickLink to="/day-business/credit-sale" icon={Wallet} label="Credit" />
            <QuickLink to="/day-business/expenses" icon={Banknote} label="Expenses" />
            <QuickLink to="/day-business/recovery" icon={Coins} label="Recovery" />
            <QuickLink to="/day-business/day-settlement" icon={ClipboardCheck} label="Daily Settlement" />
          </CardContent>
        </Card>

        {showNozzles && (
          <Card className="bg-blue-900/5 text-blue-900 dark:bg-blue-500/10 dark:text-blue-200">
            <CardContent className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {productSummary.map(p => (
                <div key={p.name} className="p-3 rounded-lg bg-primary/10 text-center">
                  <p className="font-bold text-lg">{p.name}</p>
                  <div className="text-xs grid grid-cols-2 gap-x-2 mt-2">
                    <span>Gross: <span className="font-semibold">{p.gross}</span></span>
                    <span>Test: <span className="font-semibold">{p.test}</span></span>
                    <span>Net: <span className="font-semibold">{p.net}</span></span>
                    <span>Amt: <span className="font-semibold">₹{p.amount}</span></span>
                  </div>
                </div>
              ))}
              <div className="p-3 rounded-lg bg-green-600/20 text-green-800 dark:text-green-200 text-center col-span-full lg:col-span-1 flex flex-col justify-center">
                  <p className="font-bold text-xl">Total Sale</p>
                  <p className="font-bold text-3xl">₹{totalAmount}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>{editingEntry ? 'Edit Sale Entry' : 'New Sale Entry'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-end gap-4">
                <div className="space-y-1">
                  <Label htmlFor="saleDate">Choose Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal", !saleDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />{saleDate ? format(saleDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={saleDate} onSelect={setSaleDate} initialFocus /></PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="shiftId">Choose Shift</Label>
                  <Select value={shiftId} onValueChange={setShiftId}>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select Shift" /></SelectTrigger>
                    <SelectContent>{shifts.map(s => <SelectItem key={s.id} value={s.id}>{s.shiftName}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <Button type="button" onClick={handleShowNozzles}>Sale Nozzle</Button>
              </div>

              {showNozzles && (
                <div className="space-y-4 pt-4">
                  <div className="flex justify-end">
                    <Button type="button" variant="secondary" onClick={handleBulkCopy}>
                      {Object.keys(closingReadingsBackup.current).length > 0 ? 'Undo Copy' : 'Copy Opening to Closing'}
                    </Button>
                  </div>
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="nozzles">
                      <AccordionTrigger>Nozzle Readings</AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        {readings.map((reading, index) => (
                          <div key={reading.id} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-x-4 gap-y-2 items-end p-2 border rounded-md">
                            <div className="font-bold col-span-full lg:col-span-1">{reading.nozzleName} ({reading.productName})</div>
                            <div className="space-y-1"><Label className="text-xs">Opening</Label><Input type="number" value={reading.openingReading} onChange={(e) => handleReadingChange(reading.id, 'openingReading', e.target.value)} /></div>
                            <div className="space-y-1"><Label className="text-xs">Closing</Label><Input type="number" value={reading.closingReading} onChange={(e) => handleReadingChange(reading.id, 'closingReading', e.target.value)} /></div>
                            <div className="space-y-1"><Label className="text-xs">Test</Label><Input type="number" value={reading.test} onChange={(e) => handleReadingChange(reading.id, 'test', e.target.value)} /></div>
                            <div className="space-y-1"><Label className="text-xs">Price</Label><Input type="number" value={reading.price} onChange={(e) => handleReadingChange(reading.id, 'price', e.target.value)} /></div>
                            <div className="space-y-1"><Label className="text-xs">Sale Amt</Label><Input value={reading.saleAmount} readOnly className="bg-muted" /></div>
                            <div className="space-y-1">
                              <Label className="text-xs">Employee</Label>
                              <Select value={reading.employeeId} onValueChange={(v) => handleReadingChange(reading.id, 'employeeId', v)}>
                                <SelectTrigger><SelectValue placeholder="Assign" /></SelectTrigger>
                                <SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id}>{e.employeeName}</SelectItem>)}</SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </CardContent>
            {showNozzles && (
                <div className="flex justify-end p-4 border-t">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">{editingEntry ? 'Update Entry' : 'Save Entry'}</Button>
                </div>
            )}
          </Card>
        </form>

        <Card>
            <CardHeader>
                <CardTitle>Saved Sale Entries</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-auto max-h-96">
                  <div className="min-w-max">
                    <DataTable
                      columns={columns}
                      data={saleEntries}
                      filterColumn="saleDate"
                      onDelete={(ids) => {
                          setSaleEntries(saleEntries.filter(entry => !ids.includes(entry.id)));
                          toast({variant: "destructive", title: "Deleted", description: "Selected sale entries deleted."});
                      }}
                    />
                  </div>
                </div>
            </CardContent>
        </Card>

      </motion.div>
    </>
  );
};

export default DailyBusinessSaleEntryPage;