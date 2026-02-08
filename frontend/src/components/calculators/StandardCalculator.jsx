import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const StandardCalculator = ({ calculatorState, setCalculatorState, clearCalculator }) => {
  // Use passed state or fallback to default
  const state = calculatorState || {
    input: '',
    result: '0',
    memory: 0,
    history: [],
    isMemoryActive: false,
    calculationCount: 0
  };

  const setInput = (value) => setCalculatorState?.(prev => ({ ...prev, input: value })) || (() => {});
  const setResult = (value) => setCalculatorState?.(prev => ({ ...prev, result: value })) || (() => {});
  const setMemory = (value) => setCalculatorState?.(prev => ({ ...prev, memory: value })) || (() => {});
  const setHistory = (value) => setCalculatorState?.(prev => ({ ...prev, history: value })) || (() => {});
  const setIsMemoryActive = (value) => setCalculatorState?.(prev => ({ ...prev, isMemoryActive: value })) || (() => {});
  const setCalculationCount = (value) => setCalculatorState?.(prev => ({ ...prev, calculationCount: value })) || (() => {});

  // Extract values from state
  const { input, result, memory, history, isMemoryActive, calculationCount } = state;

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
    <div className="flex flex-col h-full bg-gray-900 text-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs">🧮</span>
          </div>
          <span className="text-white font-medium">Standard</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={() => {
              if (clearCalculator) {
                clearCalculator();
              } else {
                setHistory([]);
                setCalculationCount(0);
              }
            }}
          >
            <span className="text-xs">🗑️</span>
          </Button>
        </div>
      </div>

      {/* Display Area */}
      <div className="bg-gray-900 p-6 text-right">
        <div className="text-5xl font-light text-white mb-2 min-h-[60px] flex items-center justify-end overflow-hidden">
          {result || '0'}
        </div>
        {input && (
          <div className="text-xl text-gray-400 min-h-[24px] flex items-center justify-end overflow-hidden">
            {input}
          </div>
        )}
      </div>

      {/* Button Grid - Windows Calculator Style */}
      <div className="p-4 bg-gray-900 grid grid-cols-4 gap-3">
        {/* Memory Row */}
        <Button
          onClick={() => handleButtonClick('MC')}
          className="h-12 bg-gray-700 hover:bg-gray-600 text-white border-none text-sm font-medium rounded"
          variant="ghost"
        >
          MC
        </Button>
        <Button
          onClick={() => handleButtonClick('MR')}
          className="h-12 bg-gray-700 hover:bg-gray-600 text-white border-none text-sm font-medium rounded"
          variant="ghost"
        >
          MR
        </Button>
        <Button
          onClick={() => handleButtonClick('M+')}
          className="h-12 bg-gray-700 hover:bg-gray-600 text-white border-none text-sm font-medium rounded"
          variant="ghost"
        >
          M+
        </Button>
        <Button
          onClick={() => handleButtonClick('M-')}
          className="h-12 bg-gray-700 hover:bg-gray-600 text-white border-none text-sm font-medium rounded"
          variant="ghost"
        >
          M-
        </Button>

        {/* Second Row */}
        <Button
          onClick={() => handleButtonClick('%')}
          className="h-12 bg-gray-700 hover:bg-gray-600 text-white border-none text-sm font-medium rounded"
          variant="ghost"
        >
          %
        </Button>
        <Button
          onClick={() => handleButtonClick('CE')}
          className="h-12 bg-gray-700 hover:bg-gray-600 text-white border-none text-sm font-medium rounded"
          variant="ghost"
        >
          CE
        </Button>
        <Button
          onClick={() => handleButtonClick('C')}
          className="h-12 bg-gray-700 hover:bg-gray-600 text-white border-none text-sm font-medium rounded"
          variant="ghost"
        >
          C
        </Button>
        <Button
          onClick={() => handleButtonClick('DEL')}
          className="h-12 bg-gray-700 hover:bg-gray-600 text-white border-none text-sm font-medium rounded"
          variant="ghost"
        >
          ⌫
        </Button>

        {/* Third Row */}
        <Button
          onClick={() => {
            if (!input.trim()) return;
            const reciprocal = 1 / parseFloat(input);
            const resultStr = reciprocal.toString();
            setInput(resultStr);
            setResult(resultStr);
            setHistory(prev => [...prev.slice(-4), `1/(${input}) = ${resultStr}`]);
            setCalculationCount(prev => prev + 1);
          }}
          className="h-12 bg-gray-700 hover:bg-gray-600 text-white border-none text-sm font-medium rounded"
          variant="ghost"
        >
          1/x
        </Button>
        <Button
          onClick={() => {
            if (!input.trim()) return;
            const square = parseFloat(input) ** 2;
            const resultStr = square.toString();
            setInput(resultStr);
            setResult(resultStr);
            setHistory(prev => [...prev.slice(-4), `(${input})² = ${resultStr}`]);
            setCalculationCount(prev => prev + 1);
          }}
          className="h-12 bg-gray-700 hover:bg-gray-600 text-white border-none text-sm font-medium rounded"
          variant="ghost"
        >
          x²
        </Button>
        <Button
          onClick={() => {
            if (!input.trim()) return;
            const sqrt = Math.sqrt(parseFloat(input));
            const resultStr = sqrt.toString();
            setInput(resultStr);
            setResult(resultStr);
            setHistory(prev => [...prev.slice(-4), `√(${input}) = ${resultStr}`]);
            setCalculationCount(prev => prev + 1);
          }}
          className="h-12 bg-gray-700 hover:bg-gray-600 text-white border-none text-sm font-medium rounded"
          variant="ghost"
        >
          ²√x
        </Button>
        <Button
          onClick={() => handleButtonClick('÷')}
          className="h-12 bg-orange-500 hover:bg-orange-600 text-white border-none text-lg font-semibold rounded"
          variant="ghost"
        >
          ÷
        </Button>

        {/* Fourth Row */}
        <Button
          onClick={() => handleButtonClick('7')}
          className="h-12 bg-gray-800 hover:bg-gray-700 text-white border-none text-lg font-medium rounded"
          variant="ghost"
        >
          7
        </Button>
        <Button
          onClick={() => handleButtonClick('8')}
          className="h-12 bg-gray-800 hover:bg-gray-700 text-white border-none text-lg font-medium rounded"
          variant="ghost"
        >
          8
        </Button>
        <Button
          onClick={() => handleButtonClick('9')}
          className="h-12 bg-gray-800 hover:bg-gray-700 text-white border-none text-lg font-medium rounded"
          variant="ghost"
        >
          9
        </Button>
        <Button
          onClick={() => handleButtonClick('x')}
          className="h-12 bg-orange-500 hover:bg-orange-600 text-white border-none text-lg font-semibold rounded"
          variant="ghost"
        >
          ×
        </Button>

        {/* Fifth Row */}
        <Button
          onClick={() => handleButtonClick('4')}
          className="h-12 bg-gray-800 hover:bg-gray-700 text-white border-none text-lg font-medium rounded"
          variant="ghost"
        >
          4
        </Button>
        <Button
          onClick={() => handleButtonClick('5')}
          className="h-12 bg-gray-800 hover:bg-gray-700 text-white border-none text-lg font-medium rounded"
          variant="ghost"
        >
          5
        </Button>
        <Button
          onClick={() => handleButtonClick('6')}
          className="h-12 bg-gray-800 hover:bg-gray-700 text-white border-none text-lg font-medium rounded"
          variant="ghost"
        >
          6
        </Button>
        <Button
          onClick={() => handleButtonClick('-')}
          className="h-12 bg-orange-500 hover:bg-orange-600 text-white border-none text-lg font-semibold rounded"
          variant="ghost"
        >
          −
        </Button>

        {/* Sixth Row */}
        <Button
          onClick={() => handleButtonClick('1')}
          className="h-12 bg-gray-800 hover:bg-gray-700 text-white border-none text-lg font-medium rounded"
          variant="ghost"
        >
          1
        </Button>
        <Button
          onClick={() => handleButtonClick('2')}
          className="h-12 bg-gray-800 hover:bg-gray-700 text-white border-none text-lg font-medium rounded"
          variant="ghost"
        >
          2
        </Button>
        <Button
          onClick={() => handleButtonClick('3')}
          className="h-12 bg-gray-800 hover:bg-gray-700 text-white border-none text-lg font-medium rounded"
          variant="ghost"
        >
          3
        </Button>
        <Button
          onClick={() => handleButtonClick('+')}
          className="h-12 bg-orange-500 hover:bg-orange-600 text-white border-none text-lg font-semibold rounded"
          variant="ghost"
        >
          +
        </Button>

        {/* Seventh Row */}
        <Button
          onClick={() => handleButtonClick('+/-')}
          className="h-12 bg-gray-800 hover:bg-gray-700 text-white border-none text-lg font-medium rounded"
          variant="ghost"
        >
          +/-
        </Button>
        <Button
          onClick={() => handleButtonClick('0')}
          className="h-12 bg-gray-800 hover:bg-gray-700 text-white border-none text-lg font-medium rounded col-span-2"
          variant="ghost"
        >
          0
        </Button>
        <Button
          onClick={() => handleButtonClick('.')}
          className="h-12 bg-gray-800 hover:bg-gray-700 text-white border-none text-lg font-medium rounded"
          variant="ghost"
        >
          .
        </Button>
        <Button
          onClick={() => handleButtonClick('=')}
          className="h-12 bg-blue-500 hover:bg-blue-600 text-white border-none text-lg font-semibold rounded"
          variant="ghost"
        >
          =
        </Button>
      </div>
    </div>
  );
};

export default StandardCalculator;