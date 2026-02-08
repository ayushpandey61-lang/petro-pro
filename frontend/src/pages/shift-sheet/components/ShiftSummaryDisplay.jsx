import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const SummaryItem = ({ label, value, isNegative }) => (
  <div className="p-2 bg-black/20 rounded-lg">
    <p className="text-xs uppercase opacity-80">{label}</p>
    <p className={`font-bold text-lg ${isNegative ? 'text-red-400' : 'text-green-400'}`}>₹{value.toFixed(2)}</p>
  </div>
);

const ShiftSummaryDisplay = ({ summary }) => (
  <Card className="bg-blue-900 text-white shadow-lg">
    <CardContent className="p-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 text-center">
      <SummaryItem label="Total Business" value={summary.sale} />
      <SummaryItem label="Lube Sale (Cash)" value={summary.lubeSaleCash} />
      <SummaryItem label="Total Credit" value={summary.credit} />
      <SummaryItem label="Recovery (Cash)" value={summary.recovery} />
      <SummaryItem label="Swipe" value={summary.swipe} />
      <SummaryItem label="Expenses Out" value={summary.expense} />
      <SummaryItem label="Shift Shortage" value={summary.shiftShort} isNegative={summary.shiftShort !== 0} />
      <SummaryItem label="Overall Short" value={summary.overallShortage} isNegative={summary.overallShortage !== 0} />
    </CardContent>
  </Card>
);

export default ShiftSummaryDisplay;