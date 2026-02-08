import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '@/hooks/useAuth';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { LogOut, Sun, Moon, Languages, Calculator as CalculatorIcon, ShieldCheck, UserCog, Settings, Wallet, Globe, Building, Users, KeyRound, DatabaseBackup, MessageSquare as MessageSquareWarning, ChevronDown, Contact, Menu, CheckSquare, Maximize, Minimize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTheme } from '@/hooks/useTheme';
import DenominationCalculator from './DenominationCalculator';
import CurrencyConverter from './CurrencyConverter';
import { useOrg } from '@/hooks/useOrg';
import NotificationBell from './NotificationBell';
import { useSidebar } from '@/hooks/useSidebar';

const Header = () => {
  const { user, logout, userRole } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { orgDetails } = useOrg();
  const navigate = useNavigate();
  const { setCollapsed } = useSidebar();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // App version - you can update this as needed
  const appVersion = "1.0.0";

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  };

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const FloatingButton = ({ children, tooltip, onClick, className = "" }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              className={`relative ${className}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              whileHover={{
                scale: 1.1,
                y: -2,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={onClick}
                className="relative overflow-hidden"
              >
                {children}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 bg-primary/10 rounded-md"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <header 
      className="flex items-center justify-between h-16 px-6 border-b z-40 shrink-0"
      style={{ 
        backgroundColor: `hsl(var(--header-background))`,
        color: `hsl(var(--header-foreground))` 
      }}
    >
      <div className="flex items-center gap-4">
        <FloatingButton tooltip="Toggle Sidebar" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </FloatingButton>
        {orgDetails.firmLogo && <img  src={orgDetails.firmLogo} alt="Organisation Logo" className="h-10 object-contain" />}
        <div>
            <h1 className="text-lg font-semibold" style={{ color: 'hsl(var(--header-foreground))' }}>{orgDetails.firmName || 'PetroPro'}</h1>
            <p className="text-sm" style={{ color: 'hsl(var(--header-foreground), 0.7)' }}>Welcome, {user?.user_metadata?.name || user?.email || 'User'}!</p>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <FloatingButton
          tooltip={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </FloatingButton>

        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                whileHover={{
                  scale: 1.1,
                  y: -2,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <NotificationBell />
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <FloatingButton
          tooltip="ID Card Generator"
          onClick={() => navigate('/id-card-generator')}
        >
          <Contact className="h-5 w-5" />
        </FloatingButton>

        <Dialog>
          <DialogTrigger asChild>
            <div>
              <FloatingButton tooltip="Currency Converter">
                <Globe className="h-5 w-5" />
              </FloatingButton>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Currency Converter</DialogTitle>
            </DialogHeader>
            <CurrencyConverter />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <div>
              <FloatingButton tooltip="Denomination Counter">
                <Wallet className="h-5 w-5" />
              </FloatingButton>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Denomination Cash Counter</DialogTitle>
            </DialogHeader>
            <DenominationCalculator />
          </DialogContent>
        </Dialog>

        <FloatingButton
          tooltip="Calculator"
          onClick={() => navigate('/calculator')}
        >
          <CalculatorIcon className="h-5 w-5" />
        </FloatingButton>

        <FloatingButton
          tooltip="Todo List"
          onClick={() => navigate('/todo-list')}
        >
          <CheckSquare className="h-5 w-5" />
        </FloatingButton>

        <FloatingButton
          tooltip={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
          onClick={toggleLanguage}
        >
          <Languages className="h-5 w-5" />
        </FloatingButton>

        <FloatingButton
          tooltip={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          onClick={toggleTheme}
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </FloatingButton>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-pointer"
              style={{
                backgroundColor: 'hsl(var(--header-background), 0.6)',
              }}
              whileHover={{
                scale: 1.02,
                y: -1,
                backgroundColor: 'hsl(var(--header-background), 0.8)',
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {(user?.user_metadata?.name || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>User Profile & Settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium" style={{ color: 'hsl(var(--header-foreground))' }}>
                  {user?.user_metadata?.name || 'User'}
                </span>
                <span className="text-xs" style={{ color: 'hsl(var(--header-foreground), 0.7)' }}>
                  {userRole || 'User'}
                </span>
              </div>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end" forceMount>
            {/* User Options */}
            <DropdownMenuItem onClick={() => navigate('/settings/user-profile')}>
              <UserCog className="mr-2 h-4 w-4" />
              <span>User Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>{t('settings')}</span>
            </DropdownMenuItem>

            {/* Super Admin Options - only show if user is Super Admin */}
            {userRole === 'Super Admin' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Admin Controls
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate('/super-admin/organisation-details')}>
                    <Building className="mr-2 h-4 w-4" />
                    Organisation Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/super-admin/roles-permissions')}>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Roles & Permissions
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/super-admin/bunk-user')}>
                    <Users className="mr-2 h-4 w-4" />
                    Bunk User
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate('/super-admin/change-password')}>
                    <KeyRound className="mr-2 h-4 w-4" />
                    Change Password
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/super-admin/backup-data')}>
                    <DatabaseBackup className="mr-2 h-4 w-4" />
                    Backup Data
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/super-admin/report-us')}>
                    <MessageSquareWarning className="mr-2 h-4 w-4" />
                    Report Us
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}

            {/* Logout - always at the bottom */}
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Version Display */}
        <div className="flex items-center px-3 py-1 rounded-md text-xs font-medium ml-2" style={{
          backgroundColor: 'hsl(var(--header-background), 0.8)',
          color: 'hsl(var(--header-foreground), 0.8)'
        }}>
          v{appVersion}
        </div>
      </div>
    </header>
  );
};

export default Header;