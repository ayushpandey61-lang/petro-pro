import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';

const DaySettlementForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    date: new Date(),
    dayOpeningBalance: '',
    dayCashInflow: '',
    dayClosingBalance: '',
    remittance: '',
    note: '',
    uploadSlip: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      date: format(formData.date, "yyyy-MM-dd"),
    });
  };

  return (
    <Card className="bg-primary/5">
      <CardHeader className="bg-primary text-primary-foreground p-4">
        <CardTitle>Settlement</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <Label>Choose Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.date} onSelect={(d) => setFormData(f => ({...f, date: d}))} /></PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1"><Label>Day Opening Balance</Label><Input name="dayOpeningBalance" value={formData.dayOpeningBalance} readOnly className="bg-muted" /></div>
            <div className="space-y-1"><Label>Day Cash Inflow</Label><Input name="dayCashInflow" value={formData.dayCashInflow} readOnly className="bg-muted" /></div>
          </div>
          <Card className="p-4 bg-background/70">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1"><Label>Day Closing Bal. (Calculated)</Label><Input name="dayClosingBalance" value={formData.dayClosingBalance} readOnly className="bg-muted" /></div>
              <div className="space-y-1"><Label>Day Closing Bal. (Confirmed)</Label><Input /></div>
              <div className="space-y-1"><Label>Remittance</Label><Input name="remittance" value={formData.remittance} onChange={(e) => setFormData(f => ({...f, remittance: e.target.value}))} /></div>
              <div className="space-y-1"><Label>Note</Label><Textarea name="note" value={formData.note} onChange={(e) => setFormData(f => ({...f, note: e.target.value}))} /></div>
              <div className="space-y-1"><Label>Upload Slips / Docs</Label><Input type="file" /></div>
            </div>
          </Card>
          <div className="flex justify-end">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Confirm</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DaySettlementForm;