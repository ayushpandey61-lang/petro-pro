import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { History, Trash2, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
  }, [history]);

  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        const calculatedResult = new Function('return ' + input.replace(/x/g, '*'))();
        const resultStr = calculatedResult.toString();
        setResult(resultStr);
        
        // Add to history
        const historyEntry = {
          expression: input,
          result: resultStr,
          timestamp: new Date().toLocaleString()
        };
        setHistory(prev => [historyEntry, ...prev].slice(0, 50)); // Keep last 50 entries
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'C') {
      setInput('');
      setResult('');
    } else if (value === 'DEL') {
      setInput(input.slice(0, -1));
    } else {
      setInput(input + value);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calculatorHistory');
  };

  const useHistoryItem = (expression, result) => {
    setInput(expression);
    setResult(result);
    setShowHistory(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
      if (/[0-9]|\.|\+|-|\*|\/|x/.test(key)) {
        event.preventDefault();
        handleButtonClick(key === '*' ? 'x' : key);
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        handleButtonClick('=');
      } else if (key === 'Backspace') {
        event.preventDefault();
        handleButtonClick('DEL');
      } else if (key.toLowerCase() === 'c' || key === 'Escape') {
        event.preventDefault();
        handleButtonClick('C');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [input]);

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', 'x',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
  ];

  return (
    <div className="relative">
      {showHistory && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-card border rounded-lg shadow-lg z-10 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <History className="h-5 w-5" />
              History
            </h3>
            <div className="flex gap-2">
              {history.length > 0 && (
                <Button size="sm" variant="outline" onClick={clearHistory}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => setShowHistory(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <ScrollArea className="h-[300px]">
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No history yet</p>
            ) : (
              <div className="space-y-2">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => useHistoryItem(item.expression, item.result)}
                  >
                    <div className="text-sm text-muted-foreground">{item.expression}</div>
                    <div className="text-lg font-semibold">= {item.result}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.timestamp}</div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
      
      <div className="p-4 bg-card rounded-lg shadow-lg">
        <div className="mb-4">
          <Input
            type="text"
            value={input}
            readOnly
            className="text-right text-lg mb-2"
            placeholder="0"
          />
          <Input
            type="text"
            value={result}
            readOnly
            className="text-right text-2xl font-bold bg-muted"
            placeholder="Result"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          <Button onClick={() => handleButtonClick('C')} className="col-span-2 bg-destructive hover:bg-destructive/90">C</Button>
          <Button onClick={() => handleButtonClick('DEL')}>DEL</Button>
          <Button onClick={() => setShowHistory(!showHistory)} variant="outline" title="History">
            <History className="h-4 w-4" />
          </Button>
          {buttons.map((btn) => (
            <Button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              variant={['/','x','-','+','='].includes(btn) ? "default" : "secondary"}
            >
              {btn}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;