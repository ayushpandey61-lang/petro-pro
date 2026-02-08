import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

const StatisticsCalculator = () => {
  const [data, setData] = useState('');
  const [results, setResults] = useState({});

  const calculateStatistics = () => {
    const numbers = data.split(/[\s,]+/).map(n => parseFloat(n.trim())).filter(n => !isNaN(n));

    if (numbers.length === 0) {
      setResults({ error: 'No valid numbers found' });
      return;
    }

    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / numbers.length;
    const sorted = [...numbers].sort((a, b) => a - b);
    const median = numbers.length % 2 === 0
      ? (sorted[numbers.length / 2 - 1] + sorted[numbers.length / 2]) / 2
      : sorted[Math.floor(numbers.length / 2)];
    const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numbers.length;
    const stdDev = Math.sqrt(variance);
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const range = max - min;

    setResults({
      count: numbers.length,
      sum: sum.toFixed(4),
      mean: mean.toFixed(4),
      median: median.toFixed(4),
      variance: variance.toFixed(4),
      stdDev: stdDev.toFixed(4),
      min: min.toFixed(4),
      max: max.toFixed(4),
      range: range.toFixed(4)
    });
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-lg p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Statistics Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Data (space or comma separated)</Label>
            <Textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="Enter numbers separated by spaces or commas"
              rows={4}
            />
          </div>

          <Button onClick={calculateStatistics} className="w-full">
            Calculate Statistics
          </Button>

          {Object.keys(results).length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {results.error ? (
                <div className="col-span-2 text-center text-destructive">
                  {results.error}
                </div>
              ) : (
                <>
                  <div className="text-center p-2 bg-muted rounded">
                    <p className="text-sm text-muted-foreground">Count</p>
                    <p className="text-lg font-bold">{results.count}</p>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <p className="text-sm text-muted-foreground">Sum</p>
                    <p className="text-lg font-bold">{results.sum}</p>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <p className="text-sm text-muted-foreground">Mean</p>
                    <p className="text-lg font-bold">{results.mean}</p>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <p className="text-sm text-muted-foreground">Median</p>
                    <p className="text-lg font-bold">{results.median}</p>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <p className="text-sm text-muted-foreground">Std Dev</p>
                    <p className="text-lg font-bold">{results.stdDev}</p>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <p className="text-sm text-muted-foreground">Min</p>
                    <p className="text-lg font-bold">{results.min}</p>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <p className="text-sm text-muted-foreground">Max</p>
                    <p className="text-lg font-bold">{results.max}</p>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <p className="text-sm text-muted-foreground">Range</p>
                    <p className="text-lg font-bold">{results.range}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCalculator;