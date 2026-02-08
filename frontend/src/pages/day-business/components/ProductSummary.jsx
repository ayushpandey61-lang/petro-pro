import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ProductSummary = ({ productSummary, totalAmount }) => {
  return (
    <Card className="bg-blue-900/5 text-blue-900 dark:bg-blue-500/10 dark:text-blue-200">
      <CardContent className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {productSummary.map(p => (
          <div key={p.name} className="p-3 rounded-lg bg-primary/10 text-center">
            <p className="font-bold text-lg">{p.name}</p>
            <div className="text-xs grid grid-cols-2 gap-x-2 mt-2">
              <span>Gross: <span className="font-semibold">{p.gross}</span></span>
              <span>Test: <span className="font-semibold">{p.test}</span></span>
              <span>Net: <span className="font-semibold">{p.net}</span></span>
              <span>Amt: <span className="font-semibold">₹{p.amount}</span></span>
            </div>
          </div>
        ))}
        <div className="p-3 rounded-lg bg-green-600/20 text-green-800 dark:text-green-200 text-center col-span-full lg:col-span-1 flex flex-col justify-center">
            <p className="font-bold text-xl">Total Sale</p>
            <p className="font-bold text-3xl">₹{totalAmount}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSummary;