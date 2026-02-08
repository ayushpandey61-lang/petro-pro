import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calculator, X, Menu, ChevronLeft, Link, Unlink, RotateCcw } from 'lucide-react';
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
  console.log('🔥 FloatingCalculator component rendered');
  const [isVisible, setIsVisible] = useState(false); // Start with calculator closed
  const [currentMode, setCurrentMode] = useState(() => localStorage.getItem('calculatorMode') || 'standard');
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDetached, setIsDetached] = useState(() => localStorage.getItem('calculatorDetached') === 'true');
  const [size, setSize] = useState(() => {
    // Default size for calculator - Windows Calculator style
    return { width: 350, height: 550 };
  });
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isRepositioning, setIsRepositioning] = useState(false);

  // Calculator state persistence
  const [calculatorState, setCalculatorState] = useState(() => {
    const savedState = localStorage.getItem('calculatorState');
    return savedState ? JSON.parse(savedState) : {
      input: '',
      result: '0',
      memory: 0,
      history: [],
      isMemoryActive: false,
      calculationCount: 0
    };
  });
  const [position, setPosition] = useState(() => {
    // Force visible position - use screen dimensions for full screen compatibility
    if (typeof window !== 'undefined') {
      const screenWidth = window.screen.width || window.innerWidth || 1920;
      const screenHeight = window.screen.height || window.innerHeight || 1080;

      console.log('Screen dimensions:', { screenWidth, screenHeight });

      // Always position in visible area - center as fallback with safety margins
      const centerX = Math.max(20, (screenWidth - 350) / 2);
      const centerY = Math.max(80, (screenHeight - 550) / 2); // Account for header space

      console.log('Calculated center position:', { centerX, centerY });

      return {
        x: centerX,
        y: centerY
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

  // Create props for calculator components to maintain state
  const getCalculatorProps = () => {
    if (currentMode === 'standard') {
      return {
        calculatorState,
        setCalculatorState,
        clearCalculator: () => {
          setCalculatorState({
            input: '',
            result: '0',
            memory: 0,
            history: [],
            isMemoryActive: false,
            calculationCount: 0
          });
        }
      };
    }
    return {};
  };

  // Save position to localStorage whenever it changes
  useEffect(() => {
    if (!isDetached) {
      localStorage.setItem('calculatorPosition', JSON.stringify(position));
    }
    localStorage.setItem('calculatorDetached', isDetached.toString());
  }, [position, isDetached]);

  // Save calculator state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calculatorState', JSON.stringify(calculatorState));
  }, [calculatorState]);

  // Save current mode to localStorage
  useEffect(() => {
    localStorage.setItem('calculatorMode', currentMode);
  }, [currentMode]);

  // Ensure calculator is always visible - ultra-aggressive approach
  useEffect(() => {
    const ensureVisibility = () => {
      const screenWidth = window.screen.width || window.innerWidth || 1920;
      const screenHeight = window.screen.height || window.innerHeight || 1080;

      console.log('Visibility check:', {
        position,
        screenWidth,
        screenHeight,
        isVisible,
        isMinimized,
        timestamp: new Date().toISOString()
      });

      // Check if current position is outside visible bounds with more lenient constraints
      const isOutsideBounds =
        position.x > screenWidth - 100 || // More lenient right boundary
        position.y > screenHeight - 100 || // More lenient bottom boundary
        position.x < -100 || // More lenient left boundary
        position.y < 0 || // Allow negative Y for header space
        position.x + 350 > screenWidth + 50 ||
        position.y + 550 > screenHeight + 50;

      if (isOutsideBounds) {
        console.log('Calculator position outside bounds, FORCE RESETTING to center');
        setIsRepositioning(true);
        const centerX = Math.max(20, (screenWidth - 400) / 2);
        const centerY = Math.max(80, (screenHeight - 500) / 2);
        setPosition({ x: centerX, y: centerY });
        setIsDetached(false); // Force re-attachment

        // Remove repositioning indicator after animation
        setTimeout(() => setIsRepositioning(false), 1000);
      }
    };

    // Force visibility check on mount
    ensureVisibility();

    // Multiple fallback checks
    const timeouts = [
      setTimeout(ensureVisibility, 100),   // Check after 100ms
      setTimeout(ensureVisibility, 500),   // Check after 500ms
      setTimeout(ensureVisibility, 1000),  // Check after 1s
      setTimeout(ensureVisibility, 2000),  // Check after 2s
    ];

    // Continuous monitoring
    const interval = setInterval(ensureVisibility, 2000); // Check every 2 seconds

    // Check on various window events
    const handleEvent = () => {
      console.log('Window event triggered, checking visibility');
      setTimeout(ensureVisibility, 100);
    };

    window.addEventListener('resize', handleEvent);
    window.addEventListener('orientationchange', handleEvent);
    window.addEventListener('fullscreenchange', handleEvent);
    window.addEventListener('focus', handleEvent);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(interval);
      window.removeEventListener('resize', handleEvent);
      window.removeEventListener('orientationchange', handleEvent);
      window.removeEventListener('fullscreenchange', handleEvent);
      window.removeEventListener('focus', handleEvent);
    };
  }, [position, isVisible, isMinimized]); // Run when position or visibility changes

  // Force visibility when calculator becomes visible
  useEffect(() => {
    if (isVisible && !isMinimized) {
      console.log('Calculator became visible, ensuring position is safe');
      setTimeout(() => {
        const screenWidth = window.screen.width || window.innerWidth || 1920;
        const screenHeight = window.screen.height || window.innerHeight || 1080;

        const isOutsideBounds =
          position.x > screenWidth - 100 ||
          position.y > screenHeight - 100 ||
          position.x < -100 ||
          position.y < 0;

        if (isOutsideBounds) {
          console.log('Calculator visible but outside bounds, FORCE RESETTING');
          const centerX = Math.max(20, (screenWidth - 400) / 2);
          const centerY = Math.max(80, (screenHeight - 500) / 2);
          setPosition({ x: centerX, y: centerY });
        }
      }, 200);
    }
  }, [isVisible, isMinimized]);

  // Dedicated full screen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      console.log('Full screen state changed:', isFullscreen);

      if (isFullscreen && isVisible && !isMinimized) {
        // In full screen mode, ensure calculator is positioned correctly
        setTimeout(() => {
          const screenWidth = window.screen.width || window.innerWidth || 1920;
          const screenHeight = window.screen.height || window.innerHeight || 1080;

          const centerX = Math.max(20, (screenWidth - 400) / 2);
          const centerY = Math.max(80, (screenHeight - 500) / 2);

          console.log('Full screen mode - repositioning calculator to center');
          setPosition({ x: centerX, y: centerY });
          setIsDetached(false);
        }, 500); // Small delay to ensure full screen is fully applied
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isVisible, isMinimized]);


  // Reset to default position if needed (can be called programmatically)
  const resetToDefaultPosition = () => {
    // Use screen dimensions with safety margins for full screen compatibility
    const screenWidth = window.screen.width || window.innerWidth || 1920;
    const screenHeight = window.screen.height || window.innerHeight || 1080;

    // Ensure calculator stays within visible bounds with safety margins
    const safeWidth = Math.min(screenWidth - 40, 400); // Max 400px or screen width minus margins
    const safeHeight = Math.min(screenHeight - 100, 500); // Max 500px or screen height minus margins

    const defaultPosition = {
      x: Math.max(20, screenWidth - safeWidth - 20), // Position from right with safety margin
      y: Math.max(80, Math.min(100, screenHeight - safeHeight - 20)) // Top position with safety margin, account for header
    };
    setPosition(defaultPosition);
    localStorage.setItem('calculatorPosition', JSON.stringify(defaultPosition));
  };


  // Handle window resize to ensure calculator stays within bounds
  useEffect(() => {
    const handleResize = () => {
      if (!isDetached) {
        // If attached, maintain fixed position (top-right) with safety margins
        resetToDefaultPosition();
      } else {
        // If detached, keep current position but ensure it stays within bounds
        const screenWidth = window.screen.width || window.innerWidth || 1920;
        const screenHeight = window.screen.height || window.innerHeight || 1080;

        const minX = isSidebarVisible ? 276 : 20; // Account for sidebar width
        const maxX = Math.max(minX, screenWidth - 420); // Safe right boundary
        const maxY = Math.max(80, screenHeight - 550); // Safe bottom boundary, account for header

        setPosition(prevPosition => ({
          x: Math.max(minX, Math.min(prevPosition.x, maxX)),
          y: Math.max(80, Math.min(prevPosition.y, maxY)) // Account for header space
        }));
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('fullscreenchange', handleResize); // Handle full screen changes
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('fullscreenchange', handleResize);
    };
  }, [isDetached, isSidebarVisible]);

  // Add keyboard shortcut to toggle calculator (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (!isVisible) {
          setIsVisible(true);
          setIsMinimized(false);
          setIsDetached(false);
          resetToDefaultPosition();
        } else {
          // Toggle minimize state only - keep same position
          setIsMinimized(!isMinimized);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, isMinimized, position, isDetached]);

  // Debug logging for visibility state
  console.log('FloatingCalculator render state:', {
    isVisible,
    isMinimized,
    isDetached,
    position,
    currentMode,
    showTooltip
  });

  // Ensure the component always renders the button
  console.log('🔥 Rendering FloatingCalculator with state:', { isVisible, isMinimized, showTooltip });

  return (
    <>


      {/* Floating Calculator Window */}
      <AnimatePresence>
        {isVisible && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[2147483646] flex items-start justify-center p-4 pointer-events-none"
            style={{
              paddingTop: '80px', // Account for header space
              minHeight: '100vh', // Ensure full screen coverage
            }}
          >
            {/* Sidebar - positioned to the left of calculator */}
            <AnimatePresence>
              {isSidebarVisible && !isMinimized && (
                <motion.div
                  initial={{ x: -256, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -256, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed bg-muted/95 backdrop-blur-sm border border-border rounded-lg shadow-2xl overflow-hidden pointer-events-auto z-[2147483647]"
                  style={{
                    width: 256,
                    height: size.height,
                    left: Math.max(20, position.x - 256 - 16), // 16px gap between sidebar and calculator, with safety margin
                    top: Math.max(80, position.y), // Account for header space
                    maxHeight: '90vh',
                    minHeight: '400px',
                    position: 'fixed', // Ensure proper positioning
                    zIndex: 2147483647 // Maximum z-index
                  }}
                >
                  <div className="p-4 h-full overflow-y-auto">
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Calculator Window */}
            <motion.div
              drag={!isMinimized} // Don't allow dragging when minimized
              dragMomentum={false}
              dragConstraints={isDetached && !isMinimized ? {
                left: isSidebarVisible ? 276 : 20, // Account for sidebar width (256px + 16px gap)
                right: typeof window !== 'undefined' ? Math.max(20, (window.screen.width || window.innerWidth) - 420) : 20,
                top: 80, // Account for header space
                bottom: typeof window !== 'undefined' ? Math.max(80, (window.screen.height || window.innerHeight) - 550) : 80
              } : {
                left: position.x - 10,
                right: position.x + 10,
                top: position.y - 10,
                bottom: position.y + 10
              }}
              animate={{
                x: position.x,
                y: position.y,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onDragEnd={(event, info) => {
                if (!isMinimized) {
                  const newX = position.x + info.offset.x;
                  const newY = position.y + info.offset.y;
                  setPosition({ x: newX, y: newY });
                }
              }}
              className={`overflow-hidden pointer-events-auto z-[2147483647] ${isMinimized ? 'cursor-default' : 'cursor-move'}`}
              style={{
                width: isMinimized ? '350px' : size.width,
                height: isMinimized ? '60px' : size.height, // Only show header when minimized
                maxWidth: '90vw',
                maxHeight: '90vh',
                minWidth: '350px',
                minHeight: isMinimized ? '60px' : '500px',
                backgroundColor: '#1f1f1f',
                border: '1px solid #3f3f3f',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                position: 'fixed', // Ensure proper positioning
                left: position.x,
                top: position.y,
                transform: 'none' // Override any transform that might hide it
              }}
            >
              {/* Header - Windows Style */}
              <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                    <Calculator className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-medium text-white">
                    {activeModeName}
                  </span>
                  {isRepositioning && (
                    <span className="text-xs text-blue-400 font-medium animate-pulse">
                      Repositioning...
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                    onClick={() => setIsMinimized(!isMinimized)}
                    title={isMinimized ? "Restore Calculator" : "Minimize Calculator"}
                  >
                    <span className="text-xs">—</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                    onClick={() => {
                      setIsVisible(false);
                      setIsMinimized(false);
                    }}
                    title="Close Calculator"
                  >
                    <span className="text-xs">✕</span>
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
                    className="p-4 overflow-hidden flex-1"
                    style={{ height: 'calc(100% - 60px)' }} // Fill remaining height after header
                  >
                    {/* Calculator Content - Full Width */}
                    <div className="w-full h-full overflow-y-auto">
                      <ActiveComponent {...getCalculatorProps()} />
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