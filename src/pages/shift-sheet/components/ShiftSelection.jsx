import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import RateSetupModal from '../forms/RateSetupModal';

const ShiftSelection = ({ filters, setFilters, shifts, employees, handleOpenSheet, recordId, onRatesSaved, isRateModalOpen, setIsRateModalOpen }) => {
  return (
    <>
      <Card className="bg-primary/5">
        <CardHeader className="bg-primary text-primary-foreground p-4">
          <CardTitle>Shift Details</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-wrap items-end gap-4">
          <div className="space-y-1">
            <Label>Choose Shift</Label>
            <Select onValueChange={(v) => setFilters(f => ({...f, shiftId: v}))} value={filters.shiftId || ''}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select Shift" /></SelectTrigger>
              <SelectContent>{shifts.map(s => <SelectItem key={s.id} value={s.id}>{s.shiftName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Choose Employee</Label>
            <Select onValueChange={(v) => setFilters(f => ({...f, employeeId: v}))} value={filters.employeeId || ''}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select Employee" /></SelectTrigger>
              <SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id}>{e.employeeName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Choose Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal", !filters.date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.date ? format(filters.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={filters.date} onSelect={(d) => setFilters(f => ({...f, date: d}))} initialFocus /></PopoverContent>
            </Popover>
          </div>
          <Button onClick={handleOpenSheet}>{recordId ? 'Load Sheet' : 'Enter Sheet'}</Button>
        </CardContent>
      </Card>
      <RateSetupModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        onSave={onRatesSaved}
        selectedDate={filters.date}
      />
    </>
  );
};

export default ShiftSelection;