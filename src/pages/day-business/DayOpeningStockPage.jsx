import React, { useState, useEffect, useMemo, useCallback } from 'react';
    import { Helmet } from 'react-helmet-async';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
    import { Calendar } from '@/components/ui/calendar';
    import { Calendar as CalendarIcon, Edit, User, BarChart, TrendingUp, Search, Trash2 } from 'lucide-react';
    import { cn } from '@/lib/utils';
    import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
    import useLocalStorage from '@/hooks/useLocalStorage';
    import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
    import { useToast } from '@/components/ui/use-toast';
    import { getVolumeFromDip } from '@/lib/tankVolumeCalculator';
    import { DataTable } from '@/components/ui/data-table';
    import { Checkbox } from '@/components/ui/checkbox';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { useOrg } from '@/hooks/useOrg';

    const DayOpeningStockPage = () => {
      const [tanks] = useLocalStorage('tanks', []);
      const [fuelProducts] = useLocalStorage('fuelProducts', []);
      const [liquidPurchases] = useLocalStorage('liquidPurchases', []);
      const [saleEntries] = useLocalStorage('saleEntries', []);
      const [dailyStockRecords, setDailyStockRecords] = useLocalStorage('dailyStockRecords', {});
      
      const [tankEntryDate, setTankEntryDate] = useState(new Date());
      const [showTankAccordion, setShowTankAccordion] = useState(false);
      const [activeTankEntry, setActiveTankEntry] = useState([]);
      
      const [filters, setFilters] = useState({
          fromDate: startOfMonth(new Date()),
          toDate: endOfMonth(new Date()),
          productId: null,
      });
      const [filteredData, setFilteredData] = useState([]);

      const { toast } = useToast();
      const { orgDetails } = useOrg();

      const formattedTankEntryDate = useMemo(() => format(tankEntryDate, 'yyyy-MM-dd'), [tankEntryDate]);
      const previousDateStr = useMemo(() => format(subDays(tankEntryDate, 1), 'yyyy-MM-dd'), [tankEntryDate]);

      const loadStockDataForEntry = useCallback(() => {
        const prevDayRecord = dailyStockRecords[previousDateStr] || [];

        const dailySales = saleEntries
          .filter(sale => sale.saleDate === formattedTankEntryDate)
          .flatMap(sale => sale.readings)
          .reduce((acc, reading) => {
            const nozzle = tanks.flatMap(t => t.nozzles || []).find(n => n.id === reading.nozzleId);
            if (nozzle) {
                const tank = tanks.find(t => t.id === nozzle.tankId);
                 if (tank) {
                    acc[tank.id] = (acc[tank.id] || 0) + parseFloat(reading.sale || 0);
                }
            }
            return acc;
          }, {});

        const dailyPurchases = liquidPurchases
          .filter(purchase => purchase.invoiceDate === formattedTankEntryDate)
          .flatMap(purchase => purchase.products)
          .reduce((acc, product) => {
            const tank = tanks.find(t => t.tankName === product.decantedTankNo);
            if (tank) {
              acc[tank.id] = (acc[tank.id] || 0) + parseFloat(product.qty || 0);
            }
            return acc;
          }, {});

        const initialData = tanks.map(tank => {
          const prevTankData = prevDayRecord.find(item => item.id === tank.id);
          const openingStock = prevTankData ? prevTankData.closingStock : (tank.openingStock || '0');
          const receipt = dailyPurchases[tank.id]?.toFixed(2) || '0';
          const sale = dailySales[tank.id]?.toFixed(2) || '0';
          const totalStock = (parseFloat(openingStock) + parseFloat(receipt)).toFixed(2);
          const closingStock = (parseFloat(totalStock) - parseFloat(sale)).toFixed(2);
          const product = fuelProducts.find(p => p.id === tank.productId);

          return {
            id: tank.id,
            tankName: tank.tankName,
            productId: tank.productId,
            productName: product?.productName || 'N/A',
            openingStock: openingStock,
            receipt: receipt,
            totalStock: totalStock,
            meterSale: sale,
            closingStock: closingStock,
            dipCm: '',
            dipStock: 0,
            variationLiters: 0,
            variationAmount: 0,
            stockDump: 0,
            userLog: `Created by Admin on ${new Date().toLocaleString()}`,
          };
        });
        setActiveTankEntry(initialData);
      }, [tanks, tankEntryDate, saleEntries, liquidPurchases, formattedTankEntryDate, previousDateStr, dailyStockRecords, fuelProducts]);

      useEffect(() => {
        if (showTankAccordion) {
          loadStockDataForEntry();
        }
      }, [tankEntryDate, showTankAccordion, loadStockDataForEntry]);
      
      const handleSearch = () => {
          const allRecords = Object.entries(dailyStockRecords).flatMap(([date, records]) => 
              records.map(r => ({...r, date}))
          );

          const data = allRecords.filter(record => {
              const recordDate = new Date(record.date);
              const isDateInRange = recordDate >= filters.fromDate && recordDate <= filters.toDate;
              const isProductMatch = !filters.productId || record.productId === filters.productId;
              return isDateInRange && isProductMatch;
          });

          setFilteredData(data);
          toast({ title: 'Search Complete', description: `${data.length} records found.` });
      };

      useEffect(() => {
        handleSearch();
      }, [dailyStockRecords]);

      const handleInputChange = (id, field, value) => {
        setActiveTankEntry(prevData => {
          return prevData.map(item => {
            if (item.id === id) {
              const updatedItem = { ...item, [field]: value };
              const tankDetails = tanks.find(t => t.id === id);

              if (field === 'dipCm' && tankDetails) {
                  try {
                      const volume = getVolumeFromDip(tankDetails, parseFloat(value));
                      updatedItem.dipStock = volume.toFixed(2);
                  } catch (error) {
                      toast({ variant: 'destructive', title: 'Calculation Error', description: error.message });
                      updatedItem.dipStock = 0;
                  }
              }
              
              const open = parseFloat(updatedItem.openingStock) || 0;
              const receipt = parseFloat(updatedItem.receipt) || 0;
              const sale = parseFloat(updatedItem.meterSale) || 0;
              
              updatedItem.totalStock = (open + receipt).toFixed(2);
              updatedItem.closingStock = (updatedItem.totalStock - sale).toFixed(2);
              
              const dipStock = parseFloat(updatedItem.dipStock) || 0;
              updatedItem.variationLiters = (dipStock - parseFloat(updatedItem.closingStock)).toFixed(2);
              updatedItem.stockDump = dipStock; // Assuming stock dump is same as dip stock initially

              // TODO: Calculate variation amount based on product price
              updatedItem.variationAmount = (updatedItem.variationLiters * 100).toFixed(2); // Mocked price

              return updatedItem;
            }
            return item;
          });
        });
      };

      const handleSave = () => {
        setDailyStockRecords(prev => ({
            ...prev,
            [formattedTankEntryDate]: activeTankEntry
        }));
        toast({ title: "Success", description: `Daily stock data for ${formattedTankEntryDate} saved.` });
        setShowTankAccordion(false);
      };

      const handleDeleteStock = (idsToDelete) => {
        const newRecords = { ...dailyStockRecords };
        idsToDelete.forEach(idToDelete => {
            for (const date in newRecords) {
                newRecords[date] = newRecords[date].filter(record => record.id !== idToDelete);
                if (newRecords[date].length === 0) {
                    delete newRecords[date];
                }
            }
        });
        setDailyStockRecords(newRecords);
        toast({ title: "Deleted", description: "Selected stock records have been deleted." });
      };

      const columns = useMemo(() => [
        {
          id: 'select',
          header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
          cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
          enableSorting: false,
          enableHiding: false,
        },
        { accessorKey: 'siNo', header: 'SI.No.', cell: ({ row }) => row.index + 1 },
        { accessorKey: 'date', header: 'Date', cell: ({ row }) => format(new Date(row.original.date), 'dd-MM-yyyy')},
        { accessorKey: 'tankName', header: 'Tank' },
        { accessorKey: 'variationLiters', header: 'Variation (Lts)', cell: ({row}) => <span className={cn(parseFloat(row.original.variationLiters) < 0 ? 'text-red-500' : 'text-green-500')}>{row.original.variationLiters}</span> },
        { accessorKey: 'variationAmount', header: 'Variation (Amt)' },
        { accessorKey: 'openingStock', header: 'Open Stock' },
        { accessorKey: 'receipt', header: 'Receipt' },
        { accessorKey: 'totalStock', header: 'Total Stock' },
        { accessorKey: 'meterSale', header: 'Meter Sale' },
        { accessorKey: 'closingStock', header: 'Closing Stock' },
        { accessorKey: 'dipCm', header: 'DIP Details', cell: ({row}) => `Dip: ${row.original.dipCm || 'N/A'} cm`},
        { accessorKey: 'stockDump', header: 'Stock Dump' },
        {
          id: 'actions',
          header: 'Action',
          cell: () => <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>,
        },
        { accessorKey: 'userLog', header: 'User Log Details', cell: ({row}) => <div className="text-xs">{row.original.userLog}</div> },
      ], []);


      return (
        <>
          <Helmet>
            <title>Daily Stock - PetroPro</title>
            <meta name="description" content="Manage daily opening and closing stock for tanks." />
          </Helmet>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6 space-y-6">
            <div className="flex justify-end gap-4">
                <Button variant="outline"><BarChart className="mr-2 h-4 w-4"/> Stock Report</Button>
                <Button variant="outline"><TrendingUp className="mr-2 h-4 w-4"/> Stock Variation</Button>
            </div>
            
            <Card>
                <CardContent className="p-4 flex items-end gap-4 bg-primary/10 rounded-lg">
                    <div className="space-y-1">
                        <Label>Choose Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !tankEntryDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {tankEntryDate ? format(tankEntryDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={tankEntryDate} onSelect={setTankEntryDate} initialFocus /></PopoverContent>
                        </Popover>
                    </div>
                    <Button onClick={() => setShowTankAccordion(!showTankAccordion)}>
                        {showTankAccordion ? 'Hide Tanks' : 'Show Tanks'}
                    </Button>
                </CardContent>
            </Card>

            {showTankAccordion && (
                <Card>
                <CardHeader>
                    <CardTitle>Daily Stock Entry for {format(tankEntryDate, "PPP")}</CardTitle>
                    <CardDescription>Manage daily opening, closing, and dip stock for tanks.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <Accordion type="multiple" defaultValue={tanks.map(t => t.id)}>
                    {activeTankEntry.map(item => (
                        <AccordionItem value={item.id} key={item.id}>
                        <AccordionTrigger className="bg-muted p-3 rounded-t-md hover:no-underline">
                            <div className="flex justify-between w-full pr-4 font-semibold">
                            <span>{item.tankName}</span>
                            <span className="text-muted-foreground">{item.productName}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 border border-t-0 rounded-b-md">
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            <div className="space-y-1"><Label>Opening Stock (L)</Label><Input type="number" value={item.openingStock} onChange={(e) => handleInputChange(item.id, 'openingStock', e.target.value)} readOnly className="bg-muted"/></div>
                            <div className="space-y-1"><Label>Purchase/Receipt (L)</Label><Input type="number" value={item.receipt} onChange={(e) => handleInputChange(item.id, 'receipt', e.target.value)} /></div>
                            <div className="space-y-1"><Label>Total Stock (L)</Label><Input value={item.totalStock} readOnly className="bg-muted" /></div>
                            <div className="space-y-1"><Label>Sale (L)</Label><Input type="number" value={item.meterSale} onChange={(e) => handleInputChange(item.id, 'meterSale', e.target.value)} readOnly className="bg-muted"/></div>
                            <div className="space-y-1"><Label>Closing Stock (L)</Label><Input value={item.closingStock} readOnly className="bg-muted" /></div>
                            <div className="space-y-1"><Label>Dip Reading (cm)</Label><Input type="number" value={item.dipCm} onChange={(e) => handleInputChange(item.id, 'dipCm', e.target.value)} /></div>
                            <div className="space-y-1"><Label>Stock by Dip (L)</Label><Input value={item.dipStock} readOnly className="bg-muted" /></div>
                            <div className="space-y-1"><Label>Variation (L)</Label><Input value={item.variationLiters} readOnly className={cn("font-bold", parseFloat(item.variationLiters) > 0 ? "text-green-600" : parseFloat(item.variationLiters) < 0 ? "text-red-600" : "")} /></div>
                            </div>
                        </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                    <div className="flex justify-end">
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">Save Stock Entry</Button>
                    </div>
                </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                             <CardTitle>Stock History</CardTitle>
                             <CardDescription>View and manage past stock records.</CardDescription>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteStock([])}><Trash2 className="mr-2 h-4 w-4"/> Delete Stock</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap items-end gap-4 p-4 border rounded-lg bg-muted mb-4">
                        <div className="space-y-1"><Label>From Date</Label>
                             <Popover><PopoverTrigger asChild>
                                <Button variant="outline" className="w-[180px]"><CalendarIcon className="mr-2 h-4 w-4"/>{format(filters.fromDate, "dd-MM-yy")}</Button>
                            </PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={filters.fromDate} onSelect={(d) => setFilters(f => ({...f, fromDate: d}))} /></PopoverContent></Popover>
                        </div>
                         <div className="space-y-1"><Label>To Date</Label>
                             <Popover><PopoverTrigger asChild>
                                <Button variant="outline" className="w-[180px]"><CalendarIcon className="mr-2 h-4 w-4"/>{format(filters.toDate, "dd-MM-yy")}</Button>
                            </PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={filters.toDate} onSelect={(d) => setFilters(f => ({...f, toDate: d}))} /></PopoverContent></Popover>
                        </div>
                        <div className="space-y-1">
                            <Label>Product</Label>
                             <Select onValueChange={(v) => setFilters(f => ({...f, productId: v}))}>
                                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Choose Product"/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={null}>All Products</SelectItem>
                                    {fuelProducts.map(p => <SelectItem key={p.id} value={p.id}>{p.productName}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleSearch}><Search className="mr-2 h-4 w-4"/>Search</Button>
                    </div>
                     <DataTable 
                        columns={columns} 
                        data={filteredData} 
                        filterColumn="tankName"
                        onDelete={handleDeleteStock}
                        orgDetails={orgDetails}
                        reportTitle="Stock History Report"
                     />
                </CardContent>
            </Card>

          </motion.div>
        </>
      );
    };

    export default DayOpeningStockPage;