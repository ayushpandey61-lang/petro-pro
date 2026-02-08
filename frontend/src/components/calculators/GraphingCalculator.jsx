import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GraphingCalculator = () => {
  const [expression, setExpression] = useState('x^2');
  const canvasRef = useRef(null);

  const evaluateExpression = (x) => {
    try {
      // Replace ^ with ** for exponentiation
      let expr = expression.replace(/\^/g, '**');
      // Replace x with the actual value
      expr = expr.replace(/x/g, `(${x})`);
      return eval(expr);
    } catch {
      return null;
    }
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Plot function
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const scale = 50; // pixels per unit
    const centerX = width / 2;
    const centerY = height / 2;

    let firstPoint = true;
    for (let px = 0; px < width; px++) {
      const x = (px - centerX) / scale;
      const y = evaluateExpression(x);

      if (y !== null && isFinite(y)) {
        const py = centerY - y * scale;
        if (firstPoint) {
          ctx.moveTo(px, py);
          firstPoint = false;
        } else {
          ctx.lineTo(px, py);
        }
      } else {
        firstPoint = true;
      }
    }
    ctx.stroke();
  };

  useEffect(() => {
    drawGraph();
  }, [expression]);

  const commonFunctions = [
    'x^2', 'x^3', 'sqrt(x)', 'sin(x)', 'cos(x)', 'tan(x)', 'log(x)', 'exp(x)'
  ];

  return (
    <div className="flex flex-col h-full bg-background rounded-lg p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Graphing Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Function f(x) =</Label>
            <Input
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="Enter function, e.g., x^2, sin(x), etc."
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Common Functions</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {commonFunctions.map(func => (
                <Button
                  key={func}
                  variant="outline"
                  size="sm"
                  onClick={() => setExpression(func)}
                >
                  {func}
                </Button>
              ))}
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Use ^ for exponentiation (e.g., x^2)</p>
            <p>Available functions: sin, cos, tan, log, exp, sqrt</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GraphingCalculator;