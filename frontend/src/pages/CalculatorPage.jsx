import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import {
  Menu, X, Calculator, FlaskConical, BarChart3, Code, Calendar, Globe, Beaker, Ruler, Weight, Thermometer, Zap, AppWindow, Square, Move, Clock, ZapOff, Sigma, Orbit, ArrowRightLeft, Home
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import StandardCalculator from '@/components/calculators/StandardCalculator';
import ScientificCalculator from '@/components/calculators/ScientificCalculator';
import ProgrammerCalculator from '@/components/calculators/ProgrammerCalculator';
import DateCalculator from '@/components/calculators/DateCalculator';
import GraphingCalculator from '@/components/calculators/GraphingCalculator';
import CurrencyConverter from '@/components/shared/CurrencyConverter';
import { TemperatureConverter, LengthConverter, WeightConverter, VolumeConverter, AreaConverter, SpeedConverter, TimeConverter, EnergyConverter, PowerConverter, DataConverter, PressureConverter, AngleConverter } from '@/components/shared/UnitConverter';

const calculatorModes = {
  standard: {
    name: 'Standard',
    component: StandardCalculator,
    icon: Calculator,
  },
  scientific: {
    name: 'Scientific',
    component: ScientificCalculator,
    icon: FlaskConical,
  },
  graphing: {
    name: 'Graphing',
    component: GraphingCalculator,
    icon: BarChart3,
  },
  programmer: {
    name: 'Programmer',
    component: ProgrammerCalculator,
    icon: Code,
  },
  date: {
    name: 'Date Calculation',
    component: DateCalculator,
    icon: Calendar,
  },
};

const converterModes = {
  currency: {
    name: 'Currency',
    component: CurrencyConverter,
    icon: Globe,
  },
  volume: {
    name: 'Volume',
    component: VolumeConverter,
    icon: Beaker,
  },
  length: {
    name: 'Length',
    component: LengthConverter,
    icon: Ruler,
  },
  weight: {
    name: 'Weight & Mass',
    component: WeightConverter,
    icon: Weight,
  },
  temperature: {
    name: 'Temperature',
    component: TemperatureConverter,
    icon: Thermometer,
  },
  energy: {
    name: 'Energy',
    component: EnergyConverter,
    icon: Zap,
  },
  area: {
    name: 'Area',
    component: AreaConverter,
    icon: AppWindow,
  },
  speed: {
    name: 'Speed',
    component: SpeedConverter,
    icon: Move,
  },
  time: {
    name: 'Time',
    component: TimeConverter,
    icon: Clock,
  },
  power: {
    name: 'Power',
    component: PowerConverter,
    icon: ZapOff,
  },
  data: {
    name: 'Data',
    component: DataConverter,
    icon: Sigma,
  },
  pressure: {
    name: 'Pressure',
    component: PressureConverter,
    icon: Orbit,
  },
  angle: {
    name: 'Angle',
    component: AngleConverter,
    icon: ArrowRightLeft,
  },
};

const ComingSoon = ({ feature }) => {
  const { toast } = useToast();
  React.useEffect(() => {
    toast({
      title: "🚧 Feature Not Implemented",
      description: `The ${feature} isn't implemented yet—but you can request it in your next prompt! 🚀`,
    });
  }, [feature, toast]);
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <h2 className="text-2xl font-bold mb-2">{feature}</h2>
      <p className="text-muted-foreground">This feature is coming soon!</p>
    </div>
  );
};

const CalculatorPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState('standard');
  const { theme } = useTheme();
  const navigate = useNavigate();

  const ActiveComponent =
    calculatorModes[currentMode]?.component ||
    converterModes[currentMode]?.component ||
    StandardCalculator;
  const activeModeName =
    calculatorModes[currentMode]?.name ||
    converterModes[currentMode]?.name ||
    'Standard';

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    setIsSidebarOpen(false);
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };
  
  const NavItem = ({ modeKey, modes, currentMode, onClick }) => {
    const { name, icon: Icon } = modes[modeKey];
    const isActive = currentMode === modeKey;
    return (
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className="w-full justify-start"
        onClick={() => onClick(modeKey)}
      >
        <Icon className="mr-4 h-5 w-5" />
        {name}
      </Button>
    );
  };

  return (
    <HelmetProvider>
      <div className={`${theme} font-sans`}>
        <Helmet>
          <title>Advanced Calculator - PetroPro</title>
          <meta name="description" content="An advanced, multi-mode calculator and unit converter." />
        </Helmet>
        <div className="relative h-screen w-screen overflow-hidden bg-background text-foreground flex">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                key="sidebar"
                variants={sidebarVariants}
                initial="closed"
                animate="open"
                exit="closed"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute top-0 left-0 h-full w-80 bg-card border-r z-50 p-4 flex flex-col"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Calculator</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                    <X />
                  </Button>
                </div>
                
                <div className="overflow-y-auto flex-grow pr-2">
                    <h3 className="text-sm font-semibold text-muted-foreground px-4 mb-2">CALCULATOR</h3>
                    {Object.keys(calculatorModes).map(key => (
                        <NavItem key={key} modeKey={key} modes={calculatorModes} currentMode={currentMode} onClick={handleModeChange} />
                    ))}
                    
                    <h3 className="text-sm font-semibold text-muted-foreground px-4 mt-6 mb-2">CONVERTER</h3>
                    {Object.keys(converterModes).map(key => (
                        <NavItem key={key} modeKey={key} modes={converterModes} currentMode={currentMode} onClick={handleModeChange} />
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <main className="flex-1 flex flex-col h-full w-full">
            <header className="flex items-center p-4 border-b h-16 shrink-0">
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="mr-4">
                <Menu />
              </Button>
              <h1 className="text-2xl font-semibold">{activeModeName}</h1>
              <div className="flex-grow" />
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <Home />
              </Button>
            </header>
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-md mx-auto p-4 h-full">
                    <ActiveComponent />
                </div>
            </div>
          </main>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default CalculatorPage;