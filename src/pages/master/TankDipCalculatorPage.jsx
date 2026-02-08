import React, { useState } from 'react';
    import { Helmet } from 'react-helmet-async';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import useLocalStorage from '@/hooks/useLocalStorage';
    import { useToast } from '@/components/ui/use-toast';
    import { getVolumeFromDip } from '@/lib/tankVolumeCalculator';
    import { Droplets } from 'lucide-react';

    const TankDipCalculatorPage = () => {
      const [tanks] = useLocalStorage('tanks', []);
      const [selectedTankId, setSelectedTankId] = useState(null);
      const [dipCm, setDipCm] = useState('');
      const [calculatedVolume, setCalculatedVolume] = useState(null);
      const { toast } = useToast();

      const handleCalculate = () => {
        if (!selectedTankId || !dipCm) {
          toast({ variant: 'destructive', title: 'Input Required', description: 'Please select a tank and enter a dip reading.' });
          return;
        }

        const tank = tanks.find(t => t.id === selectedTankId);
        if (!tank) {
          toast({ variant: 'destructive', title: 'Error', description: 'Selected tank not found.' });
          return;
        }

        try {
          const volume = getVolumeFromDip(tank, parseFloat(dipCm));
          setCalculatedVolume(volume);
        } catch (error) {
          toast({ variant: 'destructive', title: 'Calculation Error', description: error.message });
          setCalculatedVolume(null);
        }
      };

      return (
        <>
          <Helmet>
            <title>Tank Dip Calculator - PetroPro</title>
            <meta name="description" content="Calculate tank volume from dip reading." />
          </Helmet>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 flex justify-center items-center min-h-[70vh]"
          >
            <Card className="w-full max-w-md shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Droplets className="h-6 w-6 text-primary" />
                  Tank Dip Calculator
                </CardTitle>
                <CardDescription>Select a tank and enter the dip reading in centimeters to calculate the volume in liters.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tank-select">Select Tank</Label>
                  <Select onValueChange={setSelectedTankId}>
                    <SelectTrigger id="tank-select">
                      <SelectValue placeholder="Choose a tank..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tanks.map(tank => (
                        <SelectItem key={tank.id} value={tank.id}>
                          {tank.tankName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dip-reading">Dip Reading (cm)</Label>
                  <Input 
                    id="dip-reading"
                    type="number"
                    value={dipCm}
                    onChange={(e) => setDipCm(e.target.value)}
                    placeholder="e.g., 150.5"
                  />
                </div>
                <Button onClick={handleCalculate} className="w-full">Calculate Volume</Button>

                {calculatedVolume !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-4 bg-muted rounded-lg"
                  >
                    <p className="text-sm text-muted-foreground">Calculated Volume</p>
                    <p className="text-3xl font-bold text-primary">{calculatedVolume.toFixed(2)} Liters</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      );
    };

    export default TankDipCalculatorPage;