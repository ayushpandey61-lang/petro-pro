import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useNozzles, useEmployees, useShifts } from '@/hooks/useMasterData';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const SaleEntryForm = ({ onSave }) => {
  const { data: nozzles, loading: nozzlesLoading } = useNozzles();
  const { data: employees, loading: employeesLoading } = useEmployees();
  const { data: shifts, loading: shiftsLoading } = useShifts();
  
  const [formData, setFormData] = useState({
    shift: null,
    saleDate: new Date(),
    readings: []
  });
  const [showReadings, setShowReadings] = useState(false);

  useEffect(() => {
    if (showReadings && nozzles.length > 0) {
      const initialReadings = nozzles.map(n => ({
        nozzleId: n.id,
        nozzleName: n.nozzleName || n.name || `Nozzle ${n.id}`,
        openingReading: '',
        closingReading: '',
        testQty: '',
        sale: '',
        price: '',
        saleAmount: '',
        employeeId: null,
        saleDate: format(formData.saleDate, "yyyy-MM-dd")
      }));
      setFormData(prev => ({ ...prev, readings: initialReadings }));
    }
  }, [showReadings, nozzles, formData.saleDate]);

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, saleDate: date }));
  };

  const handleReadingChange = (index, e) => {
    const { name, value } = e.target;
    const updatedReadings = [...formData.readings];
    updatedReadings[index][name] = value;
    
    // Auto-calculate sale and saleAmount
    const reading = updatedReadings[index];
    if (name === 'closingReading' || name === 'openingReading' || name === 'testQty') {
      const sale = (parseFloat(reading.closingReading) || 0) - (parseFloat(reading.openingReading) || 0) - (parseFloat(reading.testQty) || 0);
      reading.sale = sale.toFixed(2);
      if (reading.price) {
        reading.saleAmount = (sale * parseFloat(reading.price)).toFixed(2);
      }
    }
    if (name === 'price') {
        if (reading.sale) {
            reading.saleAmount = (parseFloat(reading.sale) * parseFloat(reading.price)).toFixed(2);
        }
    }

    setFormData(prev => ({ ...prev, readings: updatedReadings }));
  };

  const handleEmployeeChange = (index, value) => {
    const updatedReadings = [...formData.readings];
    updatedReadings[index].employeeId = value;
    setFormData(prev => ({ ...prev, readings: updatedReadings }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setShowReadings(false);
  };

  return (
    <Card className="bg-primary/5">
      <CardHeader className="bg-primary text-primary-foreground p-4">
        <CardTitle>Sale Entry</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1">
            <Label>Choose Shift</Label>
            <Select onValueChange={(v) => setFormData(p => ({...p, shift: v}))} value={formData.shift} disabled={shiftsLoading}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder={shiftsLoading ? "Loading..." : "Select Shift"} /></SelectTrigger>
              <SelectContent>{shifts.map(s => <SelectItem key={s.id} value={s.id}>{s.shiftName || s.name || `Shift ${s.id}`}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Choose Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !formData.saleDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.saleDate ? format(formData.saleDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.saleDate} onSelect={handleDateChange} initialFocus /></PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center space-x-4 pt-6">
            <RadioGroup defaultValue="d1" className="flex">
              <div className="flex items-center space-x-2"><RadioGroupItem value="d1" id="s_d1" /><Label htmlFor="s_d1">D1</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="d2" id="s_d2" /><Label htmlFor="s_d2">D2</Label></div>
            </RadioGroup>
          </div>
          <Button onClick={() => setShowReadings(true)}>Sale Records</Button>
        </div>

        {showReadings && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {formData.readings.map((reading, index) => (
                <Card key={reading.nozzleId} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                        {reading.nozzleName}
                      </span>
                      <span className="text-sm text-muted-foreground">Nozzle #{index + 1}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`opening-${index}`} className="text-sm font-medium">Opening Reading</Label>
                        <Input
                          id={`opening-${index}`}
                          type="number"
                          name="openingReading"
                          value={reading.openingReading}
                          onChange={(e) => handleReadingChange(index, e)}
                          className="h-10"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`closing-${index}`} className="text-sm font-medium">Closing Reading</Label>
                        <Input
                          id={`closing-${index}`}
                          type="number"
                          name="closingReading"
                          value={reading.closingReading}
                          onChange={(e) => handleReadingChange(index, e)}
                          className="h-10"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`test-${index}`} className="text-sm font-medium">Test Qty</Label>
                        <Input
                          id={`test-${index}`}
                          type="number"
                          name="testQty"
                          value={reading.testQty}
                          onChange={(e) => handleReadingChange(index, e)}
                          className="h-10"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`sale-${index}`} className="text-sm font-medium">Sale (Auto)</Label>
                        <Input
                          id={`sale-${index}`}
                          type="number"
                          name="sale"
                          value={reading.sale}
                          readOnly
                          className="h-10 bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`price-${index}`} className="text-sm font-medium">Price</Label>
                        <Input
                          id={`price-${index}`}
                          type="number"
                          name="price"
                          value={reading.price}
                          onChange={(e) => handleReadingChange(index, e)}
                          className="h-10"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`amount-${index}`} className="text-sm font-medium">Sale Amount (Auto)</Label>
                        <Input
                          id={`amount-${index}`}
                          type="number"
                          name="saleAmount"
                          value={reading.saleAmount}
                          readOnly
                          className="h-10 bg-muted"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`employee-${index}`} className="text-sm font-medium">Employee</Label>
                        <Select onValueChange={(v) => handleEmployeeChange(index, v)} value={reading.employeeId} disabled={employeesLoading}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder={employeesLoading ? "Loading..." : "Select Employee"} />
                          </SelectTrigger>
                          <SelectContent>
                            {employees.map(e => (
                              <SelectItem key={e.id} value={e.id}>
                                {e.name || e.employeeName || `Employee ${e.id}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-green-600 hover:bg-green-700 px-8 py-2">
                Confirm All Entries
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default SaleEntryForm;