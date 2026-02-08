import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ScientificCalculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('0');
  const [angleMode, setAngleMode] = useState('DEG'); // DEG, RAD, GRAD
  const [calculationCount, setCalculationCount] = useState(0);

  // Safe evaluation function for scientific calculator
  const safeEval = (expression) => {
    // Remove any potentially dangerous characters and patterns
    const sanitized = expression.replace(/[^0-9+\-*/().\sMathPIEMathE,]/g, '');
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
        let expression = input.replace(/x/g, '*').replace(/÷/g, '/');

        // Handle trigonometric functions with angle conversion
        const angleFactor = angleMode === 'DEG' ? '(Math.PI/180)*' :
                           angleMode === 'GRAD' ? '(Math.PI/200)*' : '';
        expression = expression.replace(/sin\(/g, `Math.sin(${angleFactor}`);
        expression = expression.replace(/cos\(/g, `Math.cos(${angleFactor}`);
        expression = expression.replace(/tan\(/g, `Math.tan(${angleFactor}`);
        expression = expression.replace(/asin\(/g, `Math.asin(`);
        expression = expression.replace(/acos\(/g, `Math.acos(`);
        expression = expression.replace(/atan\(/g, `Math.atan(`);

        // Handle other functions
        expression = expression.replace(/log\(/g, 'Math.log10(');
        expression = expression.replace(/ln\(/g, 'Math.log(');
        expression = expression.replace(/exp\(/g, 'Math.exp(');
        expression = expression.replace(/√/g, 'Math.sqrt(');
        expression = expression.replace(/π/g, 'Math.PI');
        expression = expression.replace(/e/g, 'Math.E');

        const calculatedResult = safeEval(expression);
        const resultStr = calculatedResult.toString();
        setResult(resultStr);
        setInput(resultStr);
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
    } else if (value === 'DEG') {
      setAngleMode('DEG');
    } else if (value === 'RAD') {
      setAngleMode('RAD');
    } else if (value === 'GRAD') {
      setAngleMode('GRAD');
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
      const calculatorKeys = ['0','1','2','3','4','5','6','7','8','9','+','-','*','/','=','Enter','Backspace','Escape','c','C','.'];
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
  }, [input, angleMode]);

  // Professional scientific calculator layout
  const buttonRows = [
    // Angle mode and parentheses
    [
      { label: 'DEG', class: angleMode === 'DEG' ? 'bg-blue-500 text-white border-blue-600' : 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300', tooltip: 'Degrees' },
      { label: 'RAD', class: angleMode === 'RAD' ? 'bg-blue-500 text-white border-blue-600' : 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300', tooltip: 'Radians' },
      { label: 'GRAD', class: angleMode === 'GRAD' ? 'bg-blue-500 text-white border-blue-600' : 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300', tooltip: 'Gradians' },
      { label: '(', class: 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300', tooltip: 'Left Parenthesis' },
      { label: ')', class: 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300', tooltip: 'Right Parenthesis' }
    ],
    // Trigonometric functions
    [
      { label: 'sin', class: 'bg-green-100 hover:bg-green-200 text-green-700 border-green-300', tooltip: 'Sine' },
      { label: 'cos', class: 'bg-green-100 hover:bg-green-200 text-green-700 border-green-300', tooltip: 'Cosine' },
      { label: 'tan', class: 'bg-green-100 hover:bg-green-200 text-green-700 border-green-300', tooltip: 'Tangent' },
      { label: 'ln', class: 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700 border-cyan-300', tooltip: 'Natural Logarithm' },
      { label: 'log', class: 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700 border-cyan-300', tooltip: 'Logarithm (base 10)' }
    ],
    // Power and root functions
    [
      { label: 'x²', class: 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300', action: () => { setInput(`(${input})**2`); }, tooltip: 'Square' },
      { label: 'xʸ', class: 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300', tooltip: 'Power' },
      { label: '√', class: 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300', tooltip: 'Square Root' },
      { label: '10ˣ', class: 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300', action: () => { setInput(`10**(${input})`); }, tooltip: '10 to the power of x' },
      { label: 'eˣ', class: 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300', action: () => { setInput(`Math.exp(${input})`); }, tooltip: 'e to the power of x' }
    ],
    // Additional functions
    [
      { label: '1/x', class: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-300', action: () => { setInput(`1/(${input})`); }, tooltip: 'Reciprocal' },
      { label: '|x|', class: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-300', action: () => { setInput(`Math.abs(${input})`); }, tooltip: 'Absolute Value' },
      { label: 'exp', class: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-300', tooltip: 'Exponential' },
      { label: 'mod', class: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-300', tooltip: 'Modulo' },
      { label: 'π', class: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-300', tooltip: 'Pi (π)' }
    ],
    // Clear functions and divide
    [
      { label: 'CE', class: 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300', tooltip: 'Clear Entry' },
      { label: 'C', class: 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300', tooltip: 'Clear All' },
      { label: 'DEL', class: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300', tooltip: 'Delete' },
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
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 shadow-inner">
      {/* Header with angle mode indicator and calculation counter */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {angleMode}
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {calculationCount} calc{calculationCount !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Scientific Calculator
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
            {row.map(({ label, class: className, action, tooltip }) => (
              <Button
                key={label}
                onClick={() => (action ? action() : handleButtonClick(label))}
                className={`h-12 text-sm font-medium rounded-lg border-2 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm ${className}`}
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

export default ScientificCalculator;