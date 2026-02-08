import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';

const ShiftSheetHeader = ({ rates }) => (
  <Card className="bg-blue-900 text-white shadow-lg">
    <CardHeader className="p-2">
      <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Shift Sheet</h2>
          <div className="flex gap-2">
              {rates.map(rate => (
              <div key={rate.id} className="px-2 py-1 bg-black/20 rounded">
                  <span className="font-semibold text-xs">{rate.shortName}:</span>
                  <span className="ml-2 text-sm">₹{rate.closeRate || rate.openSaleRate}</span>
              </div>
              ))}
          </div>
      </div>
    </CardHeader>
  </Card>
);

export default ShiftSheetHeader;