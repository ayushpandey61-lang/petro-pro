import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ProgrammerCalculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('0');
  const [base, setBase] = useState('DEC');
  const [bitLength, setBitLength] = useState('64');
  const [calculationCount, setCalculationCount] = useState(0);

  const convertToBase = (num, targetBase) => {
    if (isNaN(num)) return '0';
    switch (targetBase) {
      case 'BIN': return num.toString(2);
      case 'OCT': return num.toString(8);
      case 'DEC': return num.toString(10);
      case 'HEX': return num.toString(16).toUpperCase();
      default: return num.toString(10);
    }
  };

  const parseInput = (value, fromBase) => {
    try {
      switch (fromBase) {
        case 'BIN': return parseInt(value, 2);
        case 'OCT': return parseInt(value, 8);
        case 'DEC': return parseInt(value, 10);
        case 'HEX': return parseInt(value, 16);
        default: return parseInt(value, 10);
      }
    } catch {
      return 0;
    }
  };

  const handleButtonClick = (value) => {
    if (value === '=') {
      try {
        const num = parseInput(input, base);
        setResult(convertToBase(num, base));
        setCalculationCount(prev => prev + 1); // Increment calculation counter
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'C') {
      setInput('');
      setResult('0');
    } else if (value === 'CE') {
       setInput('');
    } else if (value === 'DEL') {
      setInput(input.slice(0, -1));
    } else if (['AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR'].includes(value)) {
      // Bitwise operations would require two operands
      setInput((prev) => prev + ' ' + value + ' ');
    } else if (value === 'NOT') {
      const num = parseInput(input, base);
      const result = ~num;
      setResult(convertToBase(result, base));
      setInput(convertToBase(result, base));
    } else if (value === 'LSH') {
      // Left shift
      const num = parseInput(input, base);
      const result = num << 1;
      setResult(convertToBase(result, base));
      setInput(convertToBase(result, base));
    } else if (value === 'RSH') {
      // Right shift
      const num = parseInput(input, base);
      const result = num >> 1;
      setResult(convertToBase(result, base));
      setInput(convertToBase(result, base));
    } else {
      setInput((prev) => prev + value);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only prevent default for calculator-specific keys
      const calculatorKeys = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','A','B','C','D','E','F','=','Enter','Backspace','Escape','c','C'];
      const shouldPrevent = calculatorKeys.includes(event.key) ||
                           (event.key.toLowerCase() === 'c' && !event.ctrlKey);

      if (shouldPrevent) {
        event.preventDefault();
      }

      const { key } = event;

      // Number and hex keys
      if (/[0-9a-fA-F]/.test(key)) {
        handleButtonClick(key.toUpperCase());
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
  }, [input, base]);

  // Professional programmer calculator layout
  const buttonRows = [
    // Bitwise operations
    [
      { label: 'AND', class: 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300', tooltip: 'Bitwise AND' },
      { label: 'OR', class: 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300', tooltip: 'Bitwise OR' },
      { label: 'XOR', class: 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300', tooltip: 'Bitwise XOR' },
      { label: 'NAND', class: 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300', tooltip: 'Bitwise NAND' },
      { label: 'NOR', class: 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300', tooltip: 'Bitwise NOR' }
    ],
    // More bitwise operations
    [
      { label: 'XNOR', class: 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300', tooltip: 'Bitwise XNOR' },
      { label: 'NOT', class: 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300', tooltip: 'Bitwise NOT' },
      { label: 'LSH', class: 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300', tooltip: 'Left Shift' },
      { label: 'RSH', class: 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300', tooltip: 'Right Shift' },
      { label: 'MOD', class: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-300', tooltip: 'Modulo' }
    ],
    // Clear and divide
    [
      { label: 'CE', class: 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300', tooltip: 'Clear Entry' },
      { label: 'C', class: 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300', tooltip: 'Clear All' },
      { label: 'DEL', class: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300', tooltip: 'Delete' },
      { label: '÷', class: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-300 font-bold', tooltip: 'Divide' },
      { label: 'A', class: 'bg-green-100 hover:bg-green-200 text-green-700 border-green-300 font-semibold', tooltip: 'A (10)' }
    ],
    // Hex digits
    [
      { label: 'B', class: 'bg-green-100 hover:bg-green-200 text-green-700 border-green-300 font-semibold', tooltip: 'B (11)' },
      { label: 'C', class: 'bg-green-100 hover:bg-green-200 text-green-700 border-green-300 font-semibold', tooltip: 'C (12)' },
      { label: 'D', class: 'bg-green-100 hover:bg-green-200 text-green-700 border-green-300 font-semibold', tooltip: 'D (13)' },
      { label: 'E', class: 'bg-green-100 hover:bg-green-200 text-green-700 border-green-300 font-semibold', tooltip: 'E (14)' },
      { label: 'F', class: 'bg-green-100 hover:bg-green-200 text-green-700 border-green-300 font-semibold', tooltip: 'F (15)' }
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
    <div className="flex flex-col h-full bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 shadow-inner">
      {/* Header with base and bit length selectors */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-700 mb-1 block">Base</label>
          <Select value={base} onValueChange={setBase}>
            <SelectTrigger className="bg-white border-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BIN">Binary</SelectItem>
              <SelectItem value="OCT">Octal</SelectItem>
              <SelectItem value="DEC">Decimal</SelectItem>
              <SelectItem value="HEX">Hexadecimal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-700 mb-1 block">Bit Length</label>
          <Select value={bitLength} onValueChange={setBitLength}>
            <SelectTrigger className="bg-white border-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8">8-bit</SelectItem>
              <SelectItem value="16">16-bit</SelectItem>
              <SelectItem value="32">32-bit</SelectItem>
              <SelectItem value="64">64-bit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Base indicator and calculation counter */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            {base} • {bitLength}-bit
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            {calculationCount} calc{calculationCount !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Programmer Calculator
        </div>
      </div>

      {/* Display Area */}
      <div className="flex-1 flex flex-col justify-end text-right mb-4 p-4 bg-white rounded-lg shadow-sm border">
        {/* Result Display - Above */}
        <Input
          type="text"
          value={result}
          readOnly
          className="bg-transparent border-none text-4xl font-bold text-slate-800 p-0 h-auto font-mono mb-2"
          placeholder="0"
        />
        {/* Input/Typing Area - Below */}
        <Input
          type="text"
          value={input}
          readOnly
          className="bg-transparent border-none text-xl text-slate-600 p-0 h-auto font-mono"
          placeholder="0"
        />
      </div>

      {/* Button Grid */}
      <div className="space-y-2">
        {buttonRows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-2">
            {row.map(({ label, class: className, tooltip }) => (
              <Button
                key={label}
                onClick={() => handleButtonClick(label)}
                className={`h-12 text-sm font-medium rounded-lg border-2 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm ${className} ${label === '=' ? 'col-span-5' : ''}`}
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

export default ProgrammerCalculator;