import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DateCalculator = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [operation, setOperation] = useState('difference');
  const [days, setDays] = useState('');
  const [result, setResult] = useState('');

  const calculateDateDifference = () => {
    if (!fromDate || !toDate) return;

    const date1 = new Date(fromDate);
    const date2 = new Date(toDate);

    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setResult(`${diffDays} days`);
  };

  const addSubtractDays = () => {
    if (!fromDate || !days) return;

    const date = new Date(fromDate);
    const dayCount = parseInt(days);

    if (operation === 'add') {
      date.setDate(date.getDate() + dayCount);
    } else if (operation === 'subtract') {
      date.setDate(date.getDate() - dayCount);
    }

    setResult(date.toLocaleDateString());
  };

  const handleCalculate = () => {
    if (operation === 'difference') {
      calculateDateDifference();
    } else {
      addSubtractDays();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-lg p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Date Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Operation</Label>
            <Select value={operation} onValueChange={setOperation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="difference">Date Difference</SelectItem>
                <SelectItem value="add">Add Days</SelectItem>
                <SelectItem value="subtract">Subtract Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {operation === 'difference' ? (
            <>
              <div>
                <Label className="text-sm font-medium">From Date</Label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">To Date</Label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <Label className="text-sm font-medium">Start Date</Label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Days</Label>
                <Input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  placeholder="Enter number of days"
                />
              </div>
            </>
          )}

          <Button onClick={handleCalculate} className="w-full">
            Calculate
          </Button>

          {result && (
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{result}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DateCalculator;