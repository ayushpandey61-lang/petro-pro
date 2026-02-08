import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { DatePicker } from '@/components/ui/DatePicker';
import { QuickLinks } from './components/QuickLinks';
import ProductSummary from './components/ProductSummary';
import NozzleReadings from './components/NozzleReadings';

const SaleEntryPage = () => {
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
    const rateForDate = rates.find(r => r.businessDate === format(saleDate, 'yyyy-MM-dd'));

    const initialReadings = nozzles.map(nozzle => {
      const tank = tanks.find(t => t.id === nozzle.tankId);
      const product = fuelProducts.find(p => p.id === tank?.productId);
      const rateInfo = rateForDate?.products.find(p => p.id === product?.id);

      const lastShiftRecord = [...shiftRecords, ...saleEntries]
        .sort((a, b) => new Date(b.saleDate || b.date) - new Date(a.saleDate || a.date))
        .find(rec => (rec.readings || rec.liquidSale?.readings)?.some(r => r.nozzleId === nozzle.id));
      
      const lastReading = lastShiftRecord?.readings?.find(r => r.nozzleId === nozzle.id) || lastShiftRecord?.liquidSale?.readings?.find(r => r.nozzleId === nozzle.id);

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
      setReadings(prevReadings => 
        prevReadings.map(r => ({...r, closingReading: closingReadingsBackup.current[r.id] || r.closingReading }))
      );
      closingReadingsBackup.current = {};
      toast({ title: 'Undo successful', description: 'Closing readings restored.' });
    } else {
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

  const productSummaryData = useMemo(() => {
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
    return readings.reduce((acc, p) => acc + (parseFloat(p.saleAmount) || 0), 0).toFixed(2);
  }, [readings]);

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

    const updatedNozzles = nozzles.map(n => {
        const reading = readings.find(r => r.nozzleId === n.id);
        if (reading && reading.closingReading) {
            return { ...n, lastClosingReading: reading.closingReading };
        }
        return n;
    });
    setNozzles(updatedNozzles);

    setEditingEntry(null);
    setShowNozzles(false);
    setReadings([]);
    setShiftId('');
  };

  const handleEdit = (entry) => {
      // Find the parent entry for editing
      const parentEntry = saleEntries.find(e => e.id === entry.parentEntryId) || entry;
      setEditingEntry(parentEntry);
      setSaleDate(new Date(parentEntry.saleDate));
      setShiftId(parentEntry.shiftId);
      setReadings(parentEntry.readings);
      setShowNozzles(true);
  };

  const allEntries = useMemo(() => {
      const flattenedEntries = [];

      // Process regular sale entries
      saleEntries.forEach(entry => {
          entry.readings.forEach(reading => {
              flattenedEntries.push({
                  id: `${entry.id}-${reading.nozzleId}`,
                  parentEntryId: entry.id,
                  saleDate: entry.saleDate,
                  shiftId: entry.shiftId,
                  nozzleId: reading.nozzleId,
                  nozzleName: reading.nozzleName,
                  productName: reading.productName,
                  openingReading: reading.openingReading,
                  closingReading: reading.closingReading,
                  testQty: reading.test,
                  saleQty: reading.sale,
                  saleAmount: reading.saleAmount,
                  employeeId: reading.employeeId,
                  totalAmount: entry.totalAmount,
                  created: entry.created,
                  updated: entry.updated,
                  isFromShiftSheet: false,
              });
          });
      });

      // Process shift records
      shiftRecords.forEach(sr => {
          sr.liquidSale.readings.forEach(reading => {
              flattenedEntries.push({
                  id: `${sr.id}-${reading.nozzleId}`,
                  parentEntryId: sr.id,
                  saleDate: sr.date,
                  shiftId: sr.shiftId,
                  nozzleId: reading.nozzleId,
                  nozzleName: reading.nozzleName,
                  productName: reading.productName,
                  openingReading: reading.openingReading,
                  closingReading: reading.closingReading,
                  testQty: reading.test,
                  saleQty: reading.sale,
                  saleAmount: reading.saleAmount,
                  employeeId: reading.employeeId,
                  totalAmount: sr.liquidSale.readings.reduce((sum, r) => sum + (parseFloat(r.saleAmount) || 0), 0).toFixed(2),
                  created: sr.created_at,
                  updated: sr.updated_at,
                  isFromShiftSheet: true,
              });
          });
      });

      return flattenedEntries.sort((a,b) => new Date(b.saleDate) - new Date(a.saleDate));
  }, [saleEntries, shiftRecords]);
  
  const columns = useMemo(() => [
    {
      id: 'select',
      header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    },
    {
      header: 'S.No.',
      cell: ({ row, table }) => {
        const sortedRows = table.getSortedRowModel().rows;
        const index = sortedRows.findIndex(sortedRow => sortedRow.id === row.id);
        return index + 1;
      }
    },
    {
      accessorKey: 'saleDate',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.original.saleDate), 'dd-MM-yyyy')
    },
    {
      id: 'employee',
      header: 'Employee',
      cell: ({ row }) => {
        const empId = row.original.employeeId;
        const employee = employees.find(e => e.id === empId);
        return employee?.employeeName || 'N/A';
      }
    },
    {
      id: 'nozzle',
      header: 'Nozzle',
      cell: ({ row }) => row.original.nozzleName || 'N/A'
    },
    {
      id: 'product',
      header: 'Product',
      cell: ({ row }) => row.original.productName || 'N/A'
    },
    {
      id: 'meterReadings',
      header: 'Meter Reading',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="text-xs">
            <span className="font-medium">Opening: </span>
            {row.original.openingReading || '0'}
          </div>
          <div className="text-xs">
            <span className="font-medium">Closing: </span>
            {row.original.closingReading || '0'}
          </div>
        </div>
      )
    },
    {
      id: 'testQty',
      header: 'Test Qty',
      cell: ({ row }) => parseFloat(row.original.testQty || 0).toFixed(2)
    },
    {
      id: 'saleQty',
      header: 'Sale Qty',
      cell: ({ row }) => parseFloat(row.original.saleQty || 0).toFixed(2)
    },
    {
      id: 'saleAmount',
      header: 'Sale Amount',
      cell: ({ row }) => `₹${parseFloat(row.original.saleAmount || 0).toFixed(2)}`
    },
    {
      id: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const shiftName = shifts.find(s => s.id === row.original.shiftId)?.shiftName || 'N/A';
        return `${shiftName} - ${row.original.productName || 'N/A'}`;
      }
    },
    {
      id: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex gap-2">
          {!row.original.isFromShiftSheet && (
            <>
              <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)} title="Edit Entry">
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete the nozzle reading for ${row.original.nozzleName}?`)) {
                    // Delete individual nozzle reading
                    const parentEntry = saleEntries.find(entry => entry.id === row.original.parentEntryId);
                    if (parentEntry) {
                      const updatedReadings = parentEntry.readings.filter(r => r.nozzleId !== row.original.nozzleId);
                      if (updatedReadings.length === 0) {
                        // If no readings left, delete the entire entry
                        setSaleEntries(saleEntries.filter(entry => entry.id !== parentEntry.id));
                        toast({ variant: "destructive", title: "Deleted", description: "Entire sale entry deleted (no nozzles remaining)." });
                      } else {
                        // Update the entry with remaining readings
                        const updatedEntry = {
                          ...parentEntry,
                          readings: updatedReadings,
                          totalAmount: updatedReadings.reduce((sum, r) => sum + (parseFloat(r.saleAmount) || 0), 0).toFixed(2),
                          updated: new Date().toISOString()
                        };
                        setSaleEntries(saleEntries.map(entry => entry.id === parentEntry.id ? updatedEntry : entry));
                        toast({ variant: "destructive", title: "Deleted", description: `Nozzle reading for ${row.original.nozzleName} deleted.` });
                      }
                    }
                  }
                }}
                title="Delete Nozzle Reading"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'updated',
      header: 'User Log Details',
      cell: ({ row }) => row.original.updated ? new Date(row.original.updated).toLocaleString() : 'N/A'
    },
  ], [shifts, employees, handleEdit, saleEntries, setSaleEntries, toast]);

  return (
    <>
      <Helmet>
        <title>Sale Entry - PetroPro</title>
        <meta name="description" content="A comprehensive page for daily business sale entries." />
      </Helmet>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-4 sm:p-6 space-y-6">
        
        <QuickLinks />

        {showNozzles && (
          <ProductSummary productSummary={productSummaryData} totalAmount={totalAmount} />
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
                  <DatePicker value={saleDate} onChange={setSaleDate} />
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
                <NozzleReadings
                  readings={readings}
                  employees={employees}
                  onReadingChange={handleReadingChange}
                  onBulkCopy={handleBulkCopy}
                  backupExists={Object.keys(closingReadingsBackup.current).length > 0}
                />
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
                <DataTable
                  columns={columns}
                  data={allEntries}
                  filterColumn="saleDate"
                  onDelete={(ids) => {
                      // Handle deletion of individual nozzle readings
                      const entriesToUpdate = new Map();

                      ids.forEach(id => {
                          const [parentEntryId, nozzleId] = id.split('-');
                          if (!entriesToUpdate.has(parentEntryId)) {
                              const parentEntry = saleEntries.find(entry => entry.id === parentEntryId);
                              if (parentEntry) {
                                  entriesToUpdate.set(parentEntryId, {
                                      ...parentEntry,
                                      readings: [...parentEntry.readings]
                                  });
                              }
                          }

                          if (entriesToUpdate.has(parentEntryId)) {
                              const entry = entriesToUpdate.get(parentEntryId);
                              entry.readings = entry.readings.filter(r => r.nozzleId !== nozzleId);
                          }
                      });

                      // Update sale entries, removing any that have no readings left
                      const updatedEntries = saleEntries.map(entry => {
                          if (entriesToUpdate.has(entry.id)) {
                              const updatedEntry = entriesToUpdate.get(entry.id);
                              if (updatedEntry.readings.length === 0) {
                                  return null; // Mark for removal
                              }
                              // Recalculate total amount
                              updatedEntry.totalAmount = updatedEntry.readings.reduce((sum, r) => sum + (parseFloat(r.saleAmount) || 0), 0).toFixed(2);
                              updatedEntry.updated = new Date().toISOString();
                              return updatedEntry;
                          }
                          return entry;
                      }).filter(entry => entry !== null);

                      setSaleEntries(updatedEntries);
                      toast({variant: "destructive", title: "Deleted", description: `${ids.length} nozzle reading(s) deleted successfully.`});
                  }}
                />
            </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default SaleEntryPage;