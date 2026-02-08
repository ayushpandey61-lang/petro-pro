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
    <div className="form-container premium-card">
      <div className="form-header">
        <div className="relative z-10">
          <h2 className="form-title">Fuel Sale Entry</h2>
          <p className="form-description mt-1 opacity-90">Record fuel sales and meter readings</p>
        </div>
      </div>

      <div className="form-content">
        <div className="space-y-6">
          {/* Basic Information Section */}
          <div className="form-section">
            <h3 className="form-subtitle mb-4 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="form-field">
                <Label className="form-label">Choose Shift</Label>
                <Select onValueChange={(v) => setFormData(p => ({...p, shift: v}))} value={formData.shift} disabled={shiftsLoading}>
                  <SelectTrigger className="form-select">
                    <SelectValue placeholder={shiftsLoading ? "Loading..." : "Select Shift"} />
                  </SelectTrigger>
                  <SelectContent>
                    {shifts.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.shiftName || s.name || `Shift ${s.id}`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="form-field">
                <Label className="form-label">Choose Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="form-input text-left justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.saleDate ? format(formData.saleDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={formData.saleDate} onSelect={handleDateChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="form-field">
                <Label className="form-label">Tank Selection</Label>
                <RadioGroup defaultValue="d1" className="flex gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="d1" id="s_d1" />
                    <Label htmlFor="s_d1" className="form-label cursor-pointer">Tank D1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="d2" id="s_d2" />
                    <Label htmlFor="s_d2" className="form-label cursor-pointer">Tank D2</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="form-field">
                <Button
                  onClick={() => setShowReadings(true)}
                  className="form-button-primary h-12"
                >
                  Enter Sale Records
                </Button>
              </div>
            </div>
          </div>

          {showReadings && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Meter Readings Section */}
              <div className="form-section">
                <h3 className="form-subtitle mb-4">Meter Readings & Sales</h3>
                <div className="space-y-4">
                  {formData.readings.map((reading, index) => (
                    <div key={reading.nozzleId} className="form-section border-l-4 border-l-blue-500">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
                          {reading.nozzleName}
                        </span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">Nozzle #{index + 1}</span>
                      </div>

                      <div className="form-grid">
                        <div className="form-field">
                          <Label className="form-label">Opening Reading</Label>
                          <Input
                            type="number"
                            step="0.01"
                            name="openingReading"
                            value={reading.openingReading}
                            onChange={(e) => handleReadingChange(index, e)}
                            className="form-input"
                            placeholder="0.00"
                          />
                        </div>
                        <div className="form-field">
                          <Label className="form-label">Closing Reading</Label>
                          <Input
                            type="number"
                            step="0.01"
                            name="closingReading"
                            value={reading.closingReading}
                            onChange={(e) => handleReadingChange(index, e)}
                            className="form-input"
                            placeholder="0.00"
                          />
                        </div>
                        <div className="form-field">
                          <Label className="form-label">Test Quantity</Label>
                          <Input
                            type="number"
                            step="0.01"
                            name="testQty"
                            value={reading.testQty}
                            onChange={(e) => handleReadingChange(index, e)}
                            className="form-input"
                            placeholder="0.00"
                          />
                        </div>
                        <div className="form-field">
                          <Label className="form-label">Sale (Auto)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            name="sale"
                            value={reading.sale}
                            readOnly
                            className="form-input bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                          />
                        </div>
                        <div className="form-field">
                          <Label className="form-label">Price per Liter</Label>
                          <Input
                            type="number"
                            step="0.01"
                            name="price"
                            value={reading.price}
                            onChange={(e) => handleReadingChange(index, e)}
                            className="form-input"
                            placeholder="0.00"
                          />
                        </div>
                        <div className="form-field">
                          <Label className="form-label">Sale Amount (Auto)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            name="saleAmount"
                            value={reading.saleAmount}
                            readOnly
                            className="form-input bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                          />
                        </div>
                        <div className="form-field md:col-span-2">
                          <Label className="form-label">Employee</Label>
                          <Select onValueChange={(v) => handleEmployeeChange(index, v)} value={reading.employeeId} disabled={employeesLoading}>
                            <SelectTrigger className="form-select">
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
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-divider"></div>

              <div className="form-button-group">
                <Button type="button" variant="outline" className="form-button-outline">
                  Reset All Readings
                </Button>
                <Button type="submit" className="form-button-primary">
                  Confirm All Entries
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaleEntryForm;