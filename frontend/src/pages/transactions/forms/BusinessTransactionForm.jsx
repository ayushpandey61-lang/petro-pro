import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Textarea } from '@/components/ui/textarea';
import { useDenomination } from '@/context/DenominationContext';

const BusinessTransactionForm = ({ onSave }) => {
  const [parties] = useLocalStorage('businessParties', []);
  const { openCalculator } = useDenomination();
  const [formData, setFormData] = useState({
    date: new Date(),
    flowType: '',
    partyId: '',
    amount: '',
    by: '',
    description: '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    const party = parties.find(p => p.id === formData.partyId);
    onSave({
      ...formData,
      partyName: party ? party.name : 'N/A',
      date: format(formData.date, "yyyy-MM-dd"),
    });
  };

  const setAmount = (value) => {
    setFormData(f => ({ ...f, amount: value }));
  };

  return (
    <div className="form-container premium-card">
      <div className="form-header">
        <div className="relative z-10">
          <h2 className="form-title">Business Transaction</h2>
          <p className="form-description mt-1 opacity-90">Record business transactions and payments</p>
        </div>
      </div>

      <div className="form-content">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Transaction Details Section */}
          <div className="form-section">
            <h3 className="form-subtitle mb-4 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Transaction Details
            </h3>
            <div className="form-grid">
              <div className="form-field">
                <Label className="form-label">Choose Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="form-input text-left justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={formData.date} onSelect={(d) => setFormData(f => ({...f, date: d}))} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="form-field">
                <Label className="form-label">Flow Type</Label>
                <Select onValueChange={(v) => setFormData(f => ({...f, flowType: v}))} value={formData.flowType}>
                  <SelectTrigger className="form-select">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Debit">Debit</SelectItem>
                    <SelectItem value="Credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="form-field">
                <Label className="form-label">Party</Label>
                <Select onValueChange={(v) => setFormData(f => ({...f, partyId: v}))} value={formData.partyId}>
                  <SelectTrigger className="form-select">
                    <SelectValue placeholder="Select Party" />
                  </SelectTrigger>
                  <SelectContent>
                    {parties.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Amount and Payment Section */}
          <div className="form-section">
            <h3 className="form-subtitle mb-4">Amount & Payment Information</h3>
            <div className="form-grid">
              <div className="form-field">
                <Label className="form-label">Amount (₹)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    name="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(f => ({...f, amount: e.target.value}))}
                    className="form-input"
                    placeholder="0.00"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => openCalculator(setAmount)}
                    className="h-12 w-12"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="form-field">
                <Label className="form-label">Payment By</Label>
                <Input
                  name="by"
                  value={formData.by}
                  onChange={(e) => setFormData(f => ({...f, by: e.target.value}))}
                  className="form-input"
                  placeholder="Enter payment method or person"
                />
              </div>
            </div>
            <div className="form-field mt-4">
              <Label className="form-label">Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData(f => ({...f, description: e.target.value}))}
                className="form-textarea"
                placeholder="Enter transaction description or notes..."
                rows={3}
              />
            </div>
          </div>

          <div className="form-divider"></div>

          <div className="form-button-group">
            <Button type="button" variant="outline" className="form-button-outline">
              Clear Form
            </Button>
            <Button type="submit" className="form-button-primary">
              Save Transaction
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessTransactionForm;