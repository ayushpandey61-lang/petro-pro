import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const UnitConverter = ({ conversionType, units, conversionFactors }) => {
  const [amount, setAmount] = useState(1);
  const [fromUnit, setFromUnit] = useState(Object.keys(units)[0]);
  const [toUnit, setToUnit] = useState(Object.keys(units)[1] || Object.keys(units)[0]);
  const [result, setResult] = useState('');

  useEffect(() => {
    if (amount && fromUnit && toUnit) {
      const baseValue = amount * conversionFactors[fromUnit];
      const convertedValue = baseValue / conversionFactors[toUnit];
      setResult(convertedValue.toFixed(6));
    } else {
      setResult('');
    }
  }, [amount, fromUnit, toUnit, conversionFactors]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardContent className="p-2">
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-4xl font-bold">{result || '0.000000'}</p>
            <p className="text-muted-foreground">{toUnit}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 space-y-1">
              <Label className="text-muted-foreground text-xs">From</Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(units).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="icon" className="mt-4" onClick={handleSwap}>
              <ArrowRightLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 space-y-1">
              <Label className="text-muted-foreground text-xs">To</Label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(units).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-2xl h-12"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Specific converter components
export const TemperatureConverter = () => {
  const units = {
    'C': 'Celsius',
    'F': 'Fahrenheit',
    'K': 'Kelvin'
  };

  const conversionFactors = {
    'C': 1,
    'F': 1.8,
    'K': 1
  };

  const [amount, setAmount] = useState(1);
  const [fromUnit, setFromUnit] = useState('C');
  const [toUnit, setToUnit] = useState('F');
  const [result, setResult] = useState('');

  useEffect(() => {
    if (amount && fromUnit && toUnit) {
      let celsius;
      // Convert to Celsius first
      if (fromUnit === 'C') celsius = parseFloat(amount);
      else if (fromUnit === 'F') celsius = (parseFloat(amount) - 32) * 5/9;
      else if (fromUnit === 'K') celsius = parseFloat(amount) - 273.15;

      // Convert from Celsius to target
      let converted;
      if (toUnit === 'C') converted = celsius;
      else if (toUnit === 'F') converted = celsius * 9/5 + 32;
      else if (toUnit === 'K') converted = celsius + 273.15;

      setResult(converted.toFixed(2));
    }
  }, [amount, fromUnit, toUnit]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardContent className="p-2">
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-4xl font-bold">{result || '0.00'}</p>
            <p className="text-muted-foreground">{toUnit}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 space-y-1">
              <Label className="text-muted-foreground text-xs">From</Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(units).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="icon" className="mt-4" onClick={handleSwap}>
              <ArrowRightLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 space-y-1">
              <Label className="text-muted-foreground text-xs">To</Label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(units).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-2xl h-12"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const LengthConverter = () => {
  const units = {
    'mm': 'Millimeter',
    'cm': 'Centimeter',
    'm': 'Meter',
    'km': 'Kilometer',
    'in': 'Inch',
    'ft': 'Foot',
    'yd': 'Yard',
    'mi': 'Mile'
  };

  const conversionFactors = {
    'mm': 0.001,
    'cm': 0.01,
    'm': 1,
    'km': 1000,
    'in': 0.0254,
    'ft': 0.3048,
    'yd': 0.9144,
    'mi': 1609.344
  };

  return <UnitConverter conversionType="length" units={units} conversionFactors={conversionFactors} />;
};

export const WeightConverter = () => {
  const units = {
    'mg': 'Milligram',
    'g': 'Gram',
    'kg': 'Kilogram',
    'oz': 'Ounce',
    'lb': 'Pound',
    't': 'Ton'
  };

  const conversionFactors = {
    'mg': 0.000001,
    'g': 0.001,
    'kg': 1,
    'oz': 0.0283495,
    'lb': 0.453592,
    't': 1000
  };

  return <UnitConverter conversionType="weight" units={units} conversionFactors={conversionFactors} />;
};

export const VolumeConverter = () => {
  const units = {
    'ml': 'Milliliter',
    'l': 'Liter',
    'gal': 'Gallon',
    'qt': 'Quart',
    'pt': 'Pint',
    'cup': 'Cup',
    'fl_oz': 'Fluid Ounce'
  };

  const conversionFactors = {
    'ml': 0.001,
    'l': 1,
    'gal': 3.78541,
    'qt': 0.946353,
    'pt': 0.473176,
    'cup': 0.236588,
    'fl_oz': 0.0295735
  };

  return <UnitConverter conversionType="volume" units={units} conversionFactors={conversionFactors} />;
};

export const AreaConverter = () => {
  const units = {
    'mm2': 'Square Millimeter',
    'cm2': 'Square Centimeter',
    'm2': 'Square Meter',
    'km2': 'Square Kilometer',
    'in2': 'Square Inch',
    'ft2': 'Square Foot',
    'yd2': 'Square Yard',
    'ac': 'Acre',
    'ha': 'Hectare'
  };

  const conversionFactors = {
    'mm2': 0.000001,
    'cm2': 0.0001,
    'm2': 1,
    'km2': 1000000,
    'in2': 0.00064516,
    'ft2': 0.092903,
    'yd2': 0.836127,
    'ac': 4046.86,
    'ha': 10000
  };

  return <UnitConverter conversionType="area" units={units} conversionFactors={conversionFactors} />;
};

export const SpeedConverter = () => {
  const units = {
    'mps': 'Meters per Second',
    'kmh': 'Kilometers per Hour',
    'mph': 'Miles per Hour',
    'knot': 'Knot',
    'fps': 'Feet per Second'
  };

  const conversionFactors = {
    'mps': 1,
    'kmh': 0.277778,
    'mph': 0.44704,
    'knot': 0.514444,
    'fps': 0.3048
  };

  return <UnitConverter conversionType="speed" units={units} conversionFactors={conversionFactors} />;
};

export const TimeConverter = () => {
  const units = {
    'ns': 'Nanosecond',
    'μs': 'Microsecond',
    'ms': 'Millisecond',
    's': 'Second',
    'min': 'Minute',
    'h': 'Hour',
    'day': 'Day',
    'week': 'Week',
    'month': 'Month',
    'year': 'Year'
  };

  const conversionFactors = {
    'ns': 0.000000001,
    'μs': 0.000001,
    'ms': 0.001,
    's': 1,
    'min': 60,
    'h': 3600,
    'day': 86400,
    'week': 604800,
    'month': 2629746, // Average month
    'year': 31556952 // Average year
  };

  return <UnitConverter conversionType="time" units={units} conversionFactors={conversionFactors} />;
};

export const EnergyConverter = () => {
  const units = {
    'J': 'Joule',
    'kJ': 'Kilojoule',
    'cal': 'Calorie',
    'kcal': 'Kilocalorie',
    'Wh': 'Watt-hour',
    'kWh': 'Kilowatt-hour',
    'BTU': 'British Thermal Unit'
  };

  const conversionFactors = {
    'J': 1,
    'kJ': 1000,
    'cal': 4.184,
    'kcal': 4184,
    'Wh': 3600,
    'kWh': 3600000,
    'BTU': 1055.06
  };

  return <UnitConverter conversionType="energy" units={units} conversionFactors={conversionFactors} />;
};

export const PowerConverter = () => {
  const units = {
    'W': 'Watt',
    'kW': 'Kilowatt',
    'MW': 'Megawatt',
    'hp': 'Horsepower',
    'BTU/h': 'BTU per Hour'
  };

  const conversionFactors = {
    'W': 1,
    'kW': 1000,
    'MW': 1000000,
    'hp': 745.7,
    'BTU/h': 0.293071
  };

  return <UnitConverter conversionType="power" units={units} conversionFactors={conversionFactors} />;
};

export const DataConverter = () => {
  const units = {
    'B': 'Byte',
    'KB': 'Kilobyte',
    'MB': 'Megabyte',
    'GB': 'Gigabyte',
    'TB': 'Terabyte',
    'PB': 'Petabyte'
  };

  const conversionFactors = {
    'B': 1,
    'KB': 1024,
    'MB': 1048576,
    'GB': 1073741824,
    'TB': 1099511627776,
    'PB': 1125899906842624
  };

  return <UnitConverter conversionType="data" units={units} conversionFactors={conversionFactors} />;
};

export const PressureConverter = () => {
  const units = {
    'Pa': 'Pascal',
    'kPa': 'Kilopascal',
    'MPa': 'Megapascal',
    'bar': 'Bar',
    'psi': 'PSI',
    'atm': 'Atmosphere'
  };

  const conversionFactors = {
    'Pa': 1,
    'kPa': 1000,
    'MPa': 1000000,
    'bar': 100000,
    'psi': 6894.76,
    'atm': 101325
  };

  return <UnitConverter conversionType="pressure" units={units} conversionFactors={conversionFactors} />;
};

export const AngleConverter = () => {
  const units = {
    'deg': 'Degree',
    'rad': 'Radian',
    'grad': 'Gradian'
  };

  const conversionFactors = {
    'deg': 1,
    'rad': 57.2958,
    'grad': 0.9
  };

  return <UnitConverter conversionType="angle" units={units} conversionFactors={conversionFactors} />;
};

export default UnitConverter;