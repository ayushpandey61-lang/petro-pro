import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const StandardCalculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('0');
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState([]);
  const [isMemoryActive, setIsMemoryActive] = useState(false);
  const [calculationCount, setCalculationCount] = useState(0);

  // Safe evaluation function
  const safeEval = (expression) => {
    // Remove any potentially dangerous characters
    const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
    try {
      // Use a safer evaluation method
      return Function('"use strict"; return (' + sanitized + ')')();
    } catch {
      throw new Error('Invalid expression');
    }
  };

  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        if (!input.trim()) return;
        const expression = input.replace(/x/g, '*').replace(/÷/g, '/');
        const calculatedResult = safeEval(expression);
        const resultStr = calculatedResult.toString();
        setResult(resultStr);
        setInput(resultStr);
        setHistory(prev => [...prev.slice(-4), `${input} = ${resultStr}`]); // Keep last 5 entries
        setCalculationCount(prev => prev + 1); // Increment calculation counter
      } catch (error) {
        setResult('Error');
        setInput('');
      }
    } else if (value === 'C') {
      setInput('');
      setResult('0');
    } else if (value === 'CE') {
       setInput('');
    } else if (value === 'DEL') {
      setInput(input.slice(0, -1));
    } else if (value === '%') {
      try {
        if (!input.trim()) return;
        const percentage = safeEval(input) / 100;
        const resultStr = percentage.toString();
        setInput(resultStr);
        setResult(resultStr);
        setHistory(prev => [...prev.slice(-4), `${input}% = ${resultStr}`]);
        setCalculationCount(prev => prev + 1);
      } catch {
        setResult('Error');
        setInput('');
      }
    } else if (value === '+/-') {
      if (input.startsWith('-')) {
        setInput(input.substring(1));
      } else if (input && input !== '0') {
        setInput('-' + input);
      }
    } else if (value === 'MC') {
      setMemory(0);
      setIsMemoryActive(false);
    } else if (value === 'MR') {
      if (memory !== 0) {
        setInput(memory.toString());
      }
    } else if (value === 'MS') {
      const num = parseFloat(result) || parseFloat(input) || 0;
      if (!isNaN(num)) {
        setMemory(num);
        setIsMemoryActive(true);
      }
    } else if (value === 'M+') {
      const num = parseFloat(result) || parseFloat(input) || 0;
      if (!isNaN(num)) {
        setMemory(prev => prev + num);
        setIsMemoryActive(true);
      }
    } else if (value === 'M-') {
      const num = parseFloat(result) || parseFloat(input) || 0;
      if (!isNaN(num)) {
        setMemory(prev => prev - num);
        setIsMemoryActive(true);
      }
    } else {
      // Prevent multiple operators in a row
      const lastChar = input.slice(-1);
      const operators = ['+', '-', 'x', '÷', '*', '/'];
      if (operators.includes(lastChar) && operators.includes(value)) {
        setInput(input.slice(0, -1) + value);
      } else {
        setInput((prev) => prev + value);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only prevent default for calculator-specific keys
      const calculatorKeys = ['0','1','2','3','4','5','6','7','8','9','+','-','*','/','=','Enter','Backspace','Escape','c','C'];
      const shouldPrevent = calculatorKeys.includes(event.key) ||
                           (event.key.toLowerCase() === 'c' && !event.ctrlKey);

      if (shouldPrevent) {
        event.preventDefault();
      }

      const { key } = event;

      // Number keys and decimal point
      if (/[0-9]|\./.test(key)) {
        handleButtonClick(key);
      }
      // Operators
      else if (/[\+\-\*\/]/.test(key)) {
        handleButtonClick(key === '*' ? 'x' : key === '/' ? '÷' : key);
      }
      // Equals and Enter
      else if (key === 'Enter' || key === '=') {
        handleButtonClick('=');
      }
      // Backspace for delete
      else if (key === 'Backspace') {
        handleButtonClick('DEL');
      }
      // Clear (C or Escape)
      else if (key.toLowerCase() === 'c' || key === 'Escape') {
        handleButtonClick('C');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [input]);

  // Organized button layout with better grouping and visual hierarchy
  const buttonRows = [
    // Memory functions row
    [
      { label: 'MC', class: 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300', tooltip: 'Memory Clear' },
      { label: 'MR', class: 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300', tooltip: 'Memory Recall' },
      { label: 'MS', class: 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300', tooltip: 'Memory Store' },
      { label: 'M+', class: 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300', tooltip: 'Memory Add' },
      { label: 'M-', class: 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300', tooltip: 'Memory Subtract' }
    ],
    // Clear functions row
    [
      { label: '%', class: 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300', tooltip: 'Percentage' },
      { label: 'CE', class: 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300', tooltip: 'Clear Entry' },
      { label: 'C', class: 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300', tooltip: 'Clear All' },
      { label: 'DEL', class: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300', tooltip: 'Delete' }
    ],
    // Scientific functions and numbers row
    [
      { label: '1/x', class: 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300', action: () => {
        if (!input.trim()) return;
        const reciprocal = 1 / parseFloat(input);
        const resultStr = reciprocal.toString();
        setInput(resultStr);
        setResult(resultStr);
        setHistory(prev => [...prev.slice(-4), `1/(${input}) = ${resultStr}`]);
        setCalculationCount(prev => prev + 1);
      }, tooltip: 'Reciprocal' },
      { label: 'x²', class: 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300', action: () => {
        if (!input.trim()) return;
        const square = parseFloat(input) ** 2;
        const resultStr = square.toString();
        setInput(resultStr);
        setResult(resultStr);
        setHistory(prev => [...prev.slice(-4), `(${input})² = ${resultStr}`]);
        setCalculationCount(prev => prev + 1);
      }, tooltip: 'Square' },
      { label: '√x', class: 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300', action: () => {
        if (!input.trim()) return;
        const sqrt = Math.sqrt(parseFloat(input));
        const resultStr = sqrt.toString();
        setInput(resultStr);
        setResult(resultStr);
        setHistory(prev => [...prev.slice(-4), `√(${input}) = ${resultStr}`]);
        setCalculationCount(prev => prev + 1);
      }, tooltip: 'Square Root' },
      { label: '÷', class: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-300 font-bold', tooltip: 'Divide' }
    ],
    // Numbers row 1 (7 8 9 x)
    [
      { label: '7', class: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 font-semibold', tooltip: '7' },
      { label: '8', class: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 font-semibold', tooltip: '8' },
      { label: '9', class: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 font-semibold', tooltip: '9' },
      { label: 'x', class: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-300 font-bold', tooltip: 'Multiply' }
    ],
    // Numbers row 2 (4 5 6 -)
    [
      { label: '4', class: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 font-semibold', tooltip: '4' },
      { label: '5', class: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 font-semibold', tooltip: '5' },
      { label: '6', class: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 font-semibold', tooltip: '6' },
      { label: '-', class: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-300 font-bold', tooltip: 'Subtract' }
    ],
    // Numbers row 3 (1 2 3 +)
    [
      { label: '1', class: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 font-semibold', tooltip: '1' },
      { label: '2', class: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 font-semibold', tooltip: '2' },
      { label: '3', class: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 font-semibold', tooltip: '3' },
      { label: '+', class: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-300 font-bold', tooltip: 'Add' }
    ],
    // Numbers row 4 (+/- 0 . =)
    [
      { label: '+/-', class: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300', tooltip: 'Change Sign' },
      { label: '0', class: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 font-semibold col-span-2', tooltip: '0' },
      { label: '.', class: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 font-semibold', tooltip: 'Decimal Point' },
      { label: '=', class: 'bg-green-500 hover:bg-green-600 text-white border-green-600 font-bold shadow-lg', tooltip: 'Equals' }
    ]
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 shadow-inner">
      {/* Header with Memory Indicator and Calculation Counter */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {isMemoryActive && (
            <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              M
            </div>
          )}
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            {calculationCount} calculation{calculationCount !== 1 ? 's' : ''}
          </div>
          {history.length > 0 && (
            <Button
              onClick={() => {
                setHistory([]);
                setCalculationCount(0);
              }}
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear History
            </Button>
          )}
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Standard Calculator
        </div>
      </div>

      {/* Display Area */}
      <div className="flex-1 flex flex-col justify-end text-right mb-4 p-4 bg-white rounded-lg shadow-sm border">
        <Input
          type="text"
          value={input}
          readOnly
          className="bg-transparent border-none text-xl text-slate-600 p-0 h-auto font-mono"
          placeholder="0"
        />
        <Input
          type="text"
          value={result}
          readOnly
          className="bg-transparent border-none text-4xl font-bold text-slate-800 p-0 h-auto font-mono"
        />
      </div>

      {/* History Display */}
      {history.length > 0 && (
        <div className="mb-4 p-3 bg-slate-50 rounded-lg border max-h-32 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-600 mb-2">Last 5 Calculations:</div>
          <div className="space-y-1">
            {history.slice(-5).reverse().map((entry, index) => (
              <div key={index} className="text-xs text-slate-700 font-mono bg-white p-2 rounded border">
                {entry}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Button Grid */}
      <div className="space-y-2">
        {buttonRows.map((row, rowIndex) => (
          <div key={rowIndex} className={`grid gap-2 ${rowIndex === 1 ? 'grid-cols-4' : 'grid-cols-5'}`}>
            {row.map(({ label, class: className, action, tooltip }) => (
              <Button
                key={label}
                onClick={() => (action ? action() : handleButtonClick(label))}
                className={`h-14 text-lg font-medium rounded-lg border-2 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm ${className} ${label === '0' ? 'col-span-2' : ''}`}
                variant="outline"
                title={tooltip}
              >
                {label}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StandardCalculator;