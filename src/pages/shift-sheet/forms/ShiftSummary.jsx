import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import useShiftCalculations from '../hooks/useShiftCalculations';

const ShiftSummary = ({ shiftData, onFinalize }) => {
  const totals = useShiftCalculations(shiftData);

  return (
    <Card>
      <CardHeader><CardTitle>Shift Summary & Shortage</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg bg-muted/50">
            <h3 className="font-semibold text-green-600">Total Business (Cash Inflow)</h3>
            <p className="text-2xl font-bold">₹ {totals.sale.toFixed(2)}</p>
          </div>
          <div className="p-4 border rounded-lg bg-muted/50">
            <h3 className="font-semibold text-blue-600">Total Accounted For</h3>
            <p className="text-2xl font-bold">₹ {(totals.credit + totals.swipe + totals.expense + totals.cashHandovered).toFixed(2)}</p>
          </div>
          <div className="p-4 border rounded-lg bg-muted/50">
            <h3 className="font-semibold text-red-600">Shift Shortage</h3>
            <p className="text-2xl font-bold">₹ {totals.shiftShort.toFixed(2)}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
                <Label>Previous Shortage</Label>
                <Input readOnly value="₹ 0.00" className="bg-muted" />
            </div>
            <div className="space-y-1">
                <Label>Overall Shortage</Label>
                <Input readOnly value={`₹ ${totals.overallShortage.toFixed(2)}`} className="bg-muted font-bold" />
            </div>
        </div>
        <div className="flex justify-end">
            <Button onClick={onFinalize} className="bg-primary hover:bg-primary/90">Finalize & Close Shift</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShiftSummary;