import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [result, setResult] = useState('');
  const [exchangeRates, setExchangeRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];

  useEffect(() => {
    setLoading(true);
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(res => res.json())
      .then(data => {
        setExchangeRates(data.rates);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch exchange rates", err);
        toast({ title: "Error", description: "Could not fetch latest exchange rates.", variant: "destructive" });
        setLoading(false);
      });
  }, [toast]);

  useEffect(() => {
    if (exchangeRates && amount) {
      const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
      setResult((parseFloat(amount) * rate).toFixed(2));
    } else {
      setResult('');
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  if (loading) {
    return <div className="text-center p-8">Loading exchange rates...</div>;
  }
  
  if (!exchangeRates) {
    return <div className="text-center p-8 text-destructive">Failed to load exchange rates.</div>;
  }

  return (
    <Card className="bg-transparent border-none shadow-none">
        <CardContent className="p-2">
            <div className="space-y-4">
                <div className="text-center">
                    <p className="text-4xl font-bold">{result || '0.00'}</p>
                    <p className="text-muted-foreground">{toCurrency}</p>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="flex-1 space-y-1">
                        <Label className="text-muted-foreground text-xs">From</Label>
                        <Select value={fromCurrency} onValueChange={setFromCurrency}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <Button variant="ghost" size="icon" className="mt-4" onClick={handleSwap}>
                        <ArrowRightLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex-1 space-y-1">
                        <Label className="text-muted-foreground text-xs">To</Label>
                        <Select value={toCurrency} onValueChange={setToCurrency}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>{currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Amount</Label>
                    <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-2xl h-12" />
                </div>
            </div>
        </CardContent>
    </Card>
  );
};

export default CurrencyConverter;