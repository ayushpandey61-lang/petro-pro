import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const NozzleReadings = ({ readings, employees, onReadingChange, onBulkCopy, backupExists }) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-end">
        <Button type="button" variant="secondary" onClick={onBulkCopy}>
          {backupExists ? 'Undo Copy' : 'Copy Opening to Closing'}
        </Button>
      </div>
      <Accordion type="multiple" className="w-full" defaultValue={["nozzles"]}>
        <AccordionItem value="nozzles">
          <AccordionTrigger>Nozzle Readings</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {readings.map((reading) => (
              <div key={reading.id} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-x-4 gap-y-2 items-end p-2 border rounded-md">
                <div className="font-bold col-span-full lg:col-span-1">{reading.nozzleName} ({reading.productName})</div>
                <div className="space-y-1"><Label className="text-xs">Opening</Label><Input type="number" value={reading.openingReading} onChange={(e) => onReadingChange(reading.id, 'openingReading', e.target.value)} /></div>
                <div className="space-y-1"><Label className="text-xs">Closing</Label><Input type="number" value={reading.closingReading} onChange={(e) => onReadingChange(reading.id, 'closingReading', e.target.value)} /></div>
                <div className="space-y-1"><Label className="text-xs">Test</Label><Input type="number" value={reading.test} onChange={(e) => onReadingChange(reading.id, 'test', e.target.value)} /></div>
                <div className="space-y-1"><Label className="text-xs">Price</Label><Input type="number" value={reading.price} onChange={(e) => onReadingChange(reading.id, 'price', e.target.value)} /></div>
                <div className="space-y-1"><Label className="text-xs">Sale Amt</Label><Input value={reading.saleAmount} readOnly className="bg-muted" /></div>
                <div className="space-y-1">
                  <Label className="text-xs">Employee</Label>
                  <Select value={reading.employeeId} onValueChange={(v) => onReadingChange(reading.id, 'employeeId', v)}>
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
  );
};

export default NozzleReadings;