import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trash2, Lock, Unlock, Droplets } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';

const LiquidSale = ({ data, updateData, rates, onSaveAndNext }) => {
  const [allNozzles] = useLocalStorage('nozzles', []);
  const [tanks] = useLocalStorage('tanks', []);
  const [fuelProducts] = useLocalStorage('fuelProducts', []);
  const [selectedNozzleIds, setSelectedNozzleIds] = useState(new Set(data?.readings?.map(r => r.nozzleId) || []));
  const [readings, setReadings] = useState(data?.readings || []);
  const [priceLocks, setPriceLocks] = useState({});
  const { toast } = useToast();

  const nozzlesByPump = useMemo(() => {
    return allNozzles.reduce((acc, nozzle) => {
      const pump = nozzle.pump || 'Uncategorized';
      if (!acc[pump]) {
        acc[pump] = [];
      }
      acc[pump].push(nozzle);
      return acc;
    }, {});
  }, [allNozzles]);
  
  const togglePriceLock = (nozzleId) => {
    setPriceLocks(prev => ({ ...prev, [nozzleId]: !prev[nozzleId] }));
  };

  const updateReadingsAndData = useCallback((newReadings) => {
    setReadings(newReadings);
    const totalsByProduct = newReadings.reduce((acc, reading) => {
      if (reading.productShortName) {
        if (!acc[reading.productShortName]) {
          acc[reading.productShortName] = { totalSaleQty: 0, totalAmount: 0 };
        }
        acc[reading.productShortName].totalSaleQty += parseFloat(reading.sale) || 0;
        acc[reading.productShortName].totalAmount += parseFloat(reading.saleAmount) || 0;
      }
      return acc;
    }, {});
    updateData({ readings: newReadings, totals: totalsByProduct });
  }, [updateData]);

  const calculateReading = (reading) => {
    const sale = (parseFloat(reading.closingReading) || 0) - (parseFloat(reading.openingReading) || 0) - (parseFloat(reading.testQty) || 0);
    const finalSale = sale > 0 ? sale.toFixed(2) : '0.00';
    const saleAmount = (parseFloat(finalSale) * (parseFloat(reading.price) || 0)).toFixed(2);
    return { ...reading, sale: finalSale, saleAmount };
  };

  useEffect(() => {
    const selectedNozzles = allNozzles.filter(n => selectedNozzleIds.has(n.id));
    const existingReadingsMap = new Map((readings || []).map(r => [r.nozzleId, r]));

    const initialLocks = {};

    const newReadings = selectedNozzles.map(n => {
      const tank = tanks.find(t => t.id === n.tankId);
      const product = fuelProducts.find(p => p.id === tank?.productId);
      const rateInfo = rates.find(r => r.id === product?.id);
      
      const existingReading = existingReadingsMap.get(n.id);
      
      const isLocked = priceLocks[n.id] === undefined ? true : priceLocks[n.id];
      if (priceLocks[n.id] === undefined) {
        initialLocks[n.id] = true;
      }

      let price;
      if (isLocked) {
        price = rateInfo?.closeRate || rateInfo?.openSaleRate || '0';
      } else {
        price = existingReading?.price || rateInfo?.closeRate || rateInfo?.openSaleRate || '0';
      }
      
      const baseReading = {
        nozzleId: n.id,
        pumpName: n.pump || 'N/A',
        tankName: tank?.tankName || 'N/A',
        productName: product?.productName || 'N/A',
        productShortName: product?.shortName || 'N/A',
        productId: product?.id,
        nozzleName: n.nozzleName,
        openingReading: existingReading?.openingReading || n.lastClosingReading || '',
        closingReading: existingReading?.closingReading || '',
        testQty: existingReading?.testQty || '0',
        price: price,
      };
      
      return calculateReading(baseReading);
    });
    
    if (Object.keys(initialLocks).length > 0) {
        setPriceLocks(prev => ({...prev, ...initialLocks}));
    }

    updateReadingsAndData(newReadings);
  }, [selectedNozzleIds, allNozzles, tanks, fuelProducts, rates]);


  const handleNozzleSelection = (nozzleId, checked) => {
    setSelectedNozzleIds(prev => {
      const newSet = new Set(prev);
      if (checked) newSet.add(nozzleId);
      else newSet.delete(nozzleId);
      return newSet;
    });
  };
  
  const handleSelectAllNozzles = (checked) => {
    setSelectedNozzleIds(checked ? new Set(allNozzles.map(n => n.id)) : new Set());
  };

  const handleReadingChange = (index, field, value) => {
    const updatedReadings = [...readings];
    const newReading = { ...updatedReadings[index], [field]: value };
    updatedReadings[index] = calculateReading(newReading);
    updateReadingsAndData(updatedReadings);
  };
  
  const handleSave = () => {
    toast({ title: 'Saved!', description: 'Liquid sale data saved.' });
    onSaveAndNext();
  };
  
  const removeReading = (nozzleId) => {
    handleNozzleSelection(nozzleId, false);
  };

  return (
    <Card className="bg-blue-900 text-white">
      <CardHeader className="flex flex-col md:flex-row items-center justify-between p-4 space-y-2 md:space-y-0">
        <div className="w-full flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 items-center">
            {fuelProducts.filter(p => p.shortName).map((product) => (
                <div key={product.id} className="p-2 bg-black/20 rounded-lg text-center">
                    <p className="font-bold text-sm">{product.shortName}</p>
                    <div className="flex justify-around items-center mt-1">
                        <div>
                            <p className="text-xs opacity-80 flex items-center justify-center"><Droplets className="h-3 w-3 mr-1"/> Qty</p>
                            <p className="font-semibold text-sm">{(data?.totals?.[product.shortName]?.totalSaleQty || 0).toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-xs opacity-80">Amt</p>
                            <p className="font-semibold text-sm">₹{(data?.totals?.[product.shortName]?.totalAmount || 0).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-yellow-400 text-black hover:bg-yellow-500">Show Nozzles</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Select Nozzles for this Shift</DialogTitle></DialogHeader>
            <div className="flex items-center space-x-2 p-2">
                <Checkbox id="selectAllNozzles" onCheckedChange={handleSelectAllNozzles} />
                <Label htmlFor="selectAllNozzles">Select All Nozzles</Label>
            </div>
            <Accordion type="multiple" className="w-full">
              {Object.entries(nozzlesByPump).map(([pump, nozzles]) => (
                <AccordionItem value={pump} key={pump}>
                  <AccordionTrigger>{pump}</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-2">
                      {nozzles.map(nozzle => (
                        <div key={nozzle.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`nozzle-${nozzle.id}`}
                            checked={selectedNozzleIds.has(nozzle.id)}
                            onCheckedChange={(checked) => handleNozzleSelection(nozzle.id, checked)}
                          />
                          <Label htmlFor={`nozzle-${nozzle.id}`}>{nozzle.nozzleName}</Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <div className="overflow-x-auto">
          {readings.map((reading, index) => (
            <div key={reading.nozzleId} className="grid grid-cols-12 gap-2 items-center mb-2 p-2 rounded-md bg-blue-800">
                <div className="col-span-2">
                    <p className="font-semibold text-xs">{reading.pumpName} / {reading.tankName}</p>
                    <p className="font-bold">{reading.nozzleName} ({reading.productName})</p>
                </div>
                <div className="col-span-2">
                    <Label className="text-xs">Open Reading</Label>
                    <Input type="number" value={reading.openingReading} onChange={(e) => handleReadingChange(index, 'openingReading', e.target.value)} className="h-8 bg-white text-black" />
                </div>
                <div className="col-span-2">
                    <Label className="text-xs">Closed Reading</Label>
                    <Input type="number" value={reading.closingReading} onChange={(e) => handleReadingChange(index, 'closingReading', e.target.value)} className="h-8 bg-white text-black" />
                </div>
                 <div className="col-span-1">
                    <Label className="text-xs">Test Qty</Label>
                    <Input type="number" value={reading.testQty} onChange={(e) => handleReadingChange(index, 'testQty', e.target.value)} className="h-8 bg-white text-black" />
                 </div>
                 <div className="col-span-1">
                    <Label className="text-xs">Sale</Label>
                    <Input type="number" value={reading.sale} readOnly className="h-8 bg-gray-300 text-black" />
                 </div>
                 <div className="col-span-1">
                    <Label className="text-xs">Price</Label>
                    <div className="flex items-center">
                        <Input 
                            type="number" 
                            value={reading.price}
                            onChange={(e) => handleReadingChange(index, 'price', e.target.value)} 
                            readOnly={priceLocks[reading.nozzleId]}
                            className={`h-8 text-black ${priceLocks[reading.nozzleId] ? 'bg-gray-300' : 'bg-white'}`}
                        />
                        <Button variant="ghost" size="icon" onClick={() => togglePriceLock(reading.nozzleId)}>
                            {priceLocks[reading.nozzleId] ? <Lock className="h-4 w-4 text-yellow-400" /> : <Unlock className="h-4 w-4 text-green-400" />}
                        </Button>
                    </div>
                 </div>
                 <div className="col-span-1">
                    <Label className="text-xs">Sale Amt</Label>
                    <Input type="number" value={reading.saleAmount} readOnly className="h-8 bg-gray-300 text-black" />
                 </div>
                 <div className="col-span-1 flex items-end">
                    <Button variant="ghost" size="icon" onClick={() => removeReading(reading.nozzleId)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                 </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">Save and Next</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiquidSale;