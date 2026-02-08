import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calculator, X, Minimize2, Maximize2, Menu, ChevronLeft } from 'lucide-react';
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
    icon: '🧮',
  },
  scientific: {
    name: 'Scientific',
    component: ScientificCalculator,
    icon: '🔬',
  },
  graphing: {
    name: 'Graphing',
    component: GraphingCalculator,
    icon: '📊',
  },
  programmer: {
    name: 'Programmer',
    component: ProgrammerCalculator,
    icon: '💻',
  },
  date: {
    name: 'Date',
    component: DateCalculator,
    icon: '📅',
  },
};

const converterModes = {
  currency: {
    name: 'Currency',
    component: CurrencyConverter,
    icon: '💱',
  },
  temperature: {
    name: 'Temperature',
    component: TemperatureConverter,
    icon: '🌡️',
  },
  length: {
    name: 'Length',
    component: LengthConverter,
    icon: '📏',
  },
  weight: {
    name: 'Weight',
    component: WeightConverter,
    icon: '⚖️',
  },
  volume: {
    name: 'Volume',
    component: VolumeConverter,
    icon: '🧪',
  },
  area: {
    name: 'Area',
    component: AreaConverter,
    icon: '📐',
  },
  speed: {
    name: 'Speed',
    component: SpeedConverter,
    icon: '💨',
  },
  time: {
    name: 'Time',
    component: TimeConverter,
    icon: '⏰',
  },
  energy: {
    name: 'Energy',
    component: EnergyConverter,
    icon: '⚡',
  },
  power: {
    name: 'Power',
    component: PowerConverter,
    icon: '🔌',
  },
  data: {
    name: 'Data',
    component: DataConverter,
    icon: '💾',
  },
  pressure: {
    name: 'Pressure',
    component: PressureConverter,
    icon: '🌊',
  },
  angle: {
    name: 'Angle',
    component: AngleConverter,
    icon: '📐',
  },
};

const FloatingCalculator = () => {
  console.log('FloatingCalculator component rendered');
  const [isVisible, setIsVisible] = useState(false);
  const [currentMode, setCurrentMode] = useState('standard');
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [size, setSize] = useState(() => {
    // Default size for calculator - consistent across all screen sizes
    return { width: 400, height: 500 };
  });
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [position, setPosition] = useState(() => {
    // Load saved position from localStorage
    const saved = localStorage.getItem('calculatorPosition');
    if (saved) {
      const savedPosition = JSON.parse(saved);
      // Check if position is within screen bounds
      if (typeof window !== 'undefined') {
        const maxX = window.innerWidth - 420; // Calculator width + margin
        const maxY = window.innerHeight - 520; // Calculator height + margin

        if (savedPosition.x >= 0 && savedPosition.x <= maxX &&
            savedPosition.y >= 0 && savedPosition.y <= maxY) {
          return savedPosition;
        }
      }
    }

    // Default position: Bottom right corner with consistent margins
    if (typeof window !== 'undefined') {
      return {
        x: Math.max(0, window.innerWidth - 420), // 400px width + 20px margin
        y: Math.max(0, window.innerHeight - 550)  // 500px height + 50px margin
      };
    }

    // Fallback for SSR
    return { x: 100, y: 100 };
  });

  const ActiveComponent =
    calculatorModes[currentMode]?.component ||
    converterModes[currentMode]?.component ||
    StandardCalculator;

  const activeModeName =
    calculatorModes[currentMode]?.name ||
    converterModes[currentMode]?.name ||
    'Standard';

  // Save position to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calculatorPosition', JSON.stringify(position));
  }, [position]);

  // Reset to default position if needed (can be called programmatically)
  const resetToDefaultPosition = () => {
    const defaultPosition = {
      x: Math.max(0, window.innerWidth - 420),
      y: Math.max(0, window.innerHeight - 550)
    };
    setPosition(defaultPosition);
    localStorage.setItem('calculatorPosition', JSON.stringify(defaultPosition));
  };

  // Handle window resize to ensure calculator stays within bounds
  useEffect(() => {
    const handleResize = () => {
      // Keep consistent size but adjust position to stay within bounds
      const maxX = Math.max(0, window.innerWidth - 420); // 400px width + 20px margin
      const maxY = Math.max(0, window.innerHeight - 550); // 500px height + 50px margin

      setPosition(prevPosition => ({
        x: Math.max(0, Math.min(prevPosition.x, maxX)),
        y: Math.max(0, Math.min(prevPosition.y, maxY))
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Floating Calculator Button - Always visible */}
      <motion.div
        className="fixed bottom-6 right-6 z-[9999]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          size="lg"
          className={`h-16 w-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 border-4 border-white bg-red-500 hover:bg-red-600 text-white`}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => {
            if (!isVisible) {
              // If calculator is hidden, show it at saved position
              setIsVisible(true);
              setIsMinimized(false);
              // Position is already loaded from localStorage
            } else {
              // If calculator is visible, toggle minimize
              setIsMinimized(!isMinimized);
              if (!isMinimized) {
                // Minimizing - slide to right edge but keep within bounds
                const safeX = Math.max(0, window.innerWidth - 80);
                const safeY = Math.max(0, Math.min(position.y, window.innerHeight - 80));
                setPosition({ x: safeX, y: safeY });
              } else {
                // Restoring - slide back to saved position
                const saved = localStorage.getItem('calculatorPosition');
                let savedPosition = saved ? JSON.parse(saved) : { x: 100, y: 100 };

                // Ensure restored position is within bounds (400x500 calculator + margins)
                const maxX = Math.max(0, window.innerWidth - 420);
                const maxY = Math.max(0, window.innerHeight - 550);
                savedPosition.x = Math.max(0, Math.min(savedPosition.x, maxX));
                savedPosition.y = Math.max(0, Math.min(savedPosition.y, maxY));

                setPosition(savedPosition);
              }
            }
          }}
        >
          <Calculator className="h-8 w-8" />
        </Button>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-16 right-0 bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-md text-sm whitespace-nowrap"
            >
              {!isVisible ? 'Open Calculator' : isMinimized ? 'Restore Calculator' : 'Minimize Calculator'}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Calculator Window */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.div
              drag
              dragMomentum={false}
              dragConstraints={{
                left: 0,
                right: typeof window !== 'undefined' ? Math.max(0, window.innerWidth - 420) : 0,
                top: 0,
                bottom: typeof window !== 'undefined' ? Math.max(0, window.innerHeight - 550) : 0
              }}
              animate={{
                x: position.x,
                y: position.y,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onDragEnd={(event, info) => {
                setPosition({ x: position.x + info.offset.x, y: position.y + info.offset.y });
              }}
              className="bg-background border border-border rounded-lg shadow-2xl overflow-hidden cursor-move pointer-events-auto z-[10000]"
              style={{ width: size.width, height: size.height, maxWidth: '90vw', maxHeight: '90vh' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-muted/50 border-b">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  <span className="font-semibold">{activeModeName} Calculator</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                    title={isSidebarVisible ? "Hide Menu" : "Show Menu"}
                  >
                    {isSidebarVisible ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsMinimized(!isMinimized);
                      if (!isMinimized) {
                        // When minimizing, slide window to the right edge but keep within bounds
                        const safeX = Math.max(0, window.innerWidth - 80);
                        const safeY = Math.max(0, Math.min(position.y, window.innerHeight - 80));
                        setPosition({ x: safeX, y: safeY });
                      } else {
                        // When maximizing, slide back to saved position
                        const saved = localStorage.getItem('calculatorPosition');
                        let savedPosition = saved ? JSON.parse(saved) : { x: 100, y: 100 };

                        // Ensure restored position is within bounds (400x500 calculator + margins)
                        const maxX = Math.max(0, window.innerWidth - 420);
                        const maxY = Math.max(0, window.innerHeight - 550);
                        savedPosition.x = Math.max(0, Math.min(savedPosition.x, maxX));
                        savedPosition.y = Math.max(0, Math.min(savedPosition.y, maxY));

                        setPosition(savedPosition);
                      }
                    }}
                    title={isMinimized ? "Maximize Calculator" : "Minimize Calculator"}
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVisible(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex gap-4 p-4 overflow-hidden"
                    style={{ height: 420 }}
                  >
                    {/* Sidebar */}
                    <AnimatePresence>
                      {isSidebarVisible && (
                        <motion.div
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 256, opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-muted/50 rounded-lg p-4 overflow-y-auto flex-shrink-0"
                        >
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm font-semibold text-muted-foreground mb-2">CALCULATORS</h3>
                              <div className="space-y-1">
                                {Object.entries(calculatorModes).map(([key, mode]) => (
                                  <Button
                                    key={key}
                                    variant={currentMode === key ? 'secondary' : 'ghost'}
                                    className="w-full justify-start text-sm"
                                    onClick={() => setCurrentMode(key)}
                                  >
                                    <span className="mr-2">{mode.icon}</span>
                                    {mode.name}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h3 className="text-sm font-semibold text-muted-foreground mb-2">CONVERTERS</h3>
                              <div className="space-y-1">
                                {Object.entries(converterModes).map(([key, mode]) => (
                                  <Button
                                    key={key}
                                    variant={currentMode === key ? 'secondary' : 'ghost'}
                                    className="w-full justify-start text-sm"
                                    onClick={() => setCurrentMode(key)}
                                  >
                                    <span className="mr-2">{mode.icon}</span>
                                    {mode.name}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Calculator Content */}
                    <div className="flex-1 overflow-y-auto min-w-0">
                      <ActiveComponent />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Resize Handle */}
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const startX = e.clientX;
                  const startY = e.clientY;
                  const startWidth = size.width;
                  const startHeight = size.height;

                  const handleMouseMove = (e) => {
                    const newWidth = Math.max(400, Math.min(800, startWidth + (e.clientX - startX)));
                    const newHeight = Math.max(500, Math.min(600, startHeight + (e.clientY - startY)));
                    setSize({ width: newWidth, height: newHeight });
                  };

                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };

                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              >
                <div className="w-full h-full bg-muted rounded-tl border-l border-t border-border" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingCalculator;