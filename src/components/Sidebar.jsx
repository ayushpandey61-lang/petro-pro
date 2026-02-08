import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Fuel as GasPump, Droplets, Users, Wallet, Truck, CalendarCheck, FileText, Settings, GitBranch, Printer, UserPlus, BookOpen, FilePlus, TrendingUp, Receipt, Coins, FileUp, ClipboardCheck, PieChart, FileBarChart, FileDiff, ClipboardList, HeartHandshake as Handshake, BarChart, BookUser, Banknote, ShieldCheck, FileKey, Microscope, FileHeart, FileClock, Download, MessageSquare, UserCog, Fuel, CreditCard, ListOrdered, MinusCircle, SlidersHorizontal, Package, DollarSign, LineChart, ShoppingCart, ShieldQuestion, Monitor, Globe, Image, FileImage, Type, Palette, Megaphone, Bell, Users as UsersIcon, BarChart3 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from '@/hooks/useTranslation';
import useAuth from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';

const menuItems = [
  { labelKey: 'dashboard', icon: LayoutDashboard, path: '/dashboard', permission: 'dashboard.view' },
  {
    labelKey: 'master', icon: GitBranch, permission: 'master.view',
    subItems: [
      { labelKey: 'fuel_product', icon: GasPump, path: '/master/fuel-product', permission: 'master.edit' },
      { labelKey: 'lubricants', icon: Droplets, path: '/master/lubricants', permission: 'master.edit' },
      { labelKey: 'employee', icon: Users, path: '/master/employee', permission: 'master.edit' },
      { labelKey: 'credit_party', icon: BookUser, path: '/master/credit-party', permission: 'master.edit' },
      { labelKey: 'vendor', icon: Truck, path: '/master/vendor', permission: 'master.edit' },
      { labelKey: 'tank_and_nozzle', icon: Fuel, path: '/master/tanks', permission: 'master.edit' },
      { labelKey: 'pump_setting', icon: Settings, path: '/master/nozzles', permission: 'master.edit' },
      { labelKey: 'expenses_type', icon: Wallet, path: '/master/expense-types', permission: 'master.edit' },
      { labelKey: 'business_debit_credit_party', icon: Handshake, path: '/master/business-cr-dr-party', permission: 'master.edit' },
      { labelKey: 'swipe_machine', icon: CreditCard, path: '/master/swipe-machines', permission: 'master.edit' },
      { labelKey: 'expiry_item', icon: CalendarCheck, path: '/master/expiry-items', permission: 'master.edit' },
      { labelKey: 'duty_pay_shift', icon: UserCog, path: '/master/shifts', permission: 'master.edit' },
      { labelKey: 'template_print', icon: Printer, path: '/master/print-templates', permission: 'master.edit' },
      { labelKey: 'guest_customer', icon: UserPlus, path: '/master/guest-customer', permission: 'master.edit' },
      { labelKey: 'denomination', icon: ListOrdered, path: '/master/denomination', permission: 'master.edit' },
      { labelKey: 'tank_lorry_management', icon: Truck, path: '/master/tank-lorry-management', permission: 'master.edit' },
    ],
  },
  {
    labelKey: 'day_business', icon: BookOpen, permission: 'day_business.view',
    subItems: [
      { labelKey: 'day_assigning', icon: FilePlus, path: '/day-business/assigning', permission: 'day_business.edit' },
      { labelKey: 'daily_sale_rate', icon: TrendingUp, path: '/day-business/daily-rate', permission: 'day_business.edit' },
      { labelKey: 'sale_entry', icon: Receipt, path: '/day-business/sale-entry', permission: 'day_business.edit' },
      { labelKey: 'lubricants_sale', icon: Droplets, path: '/day-business/lubricants-sale', permission: 'day_business.edit' },
      { labelKey: 'swipe', icon: CreditCard, path: '/day-business/swipe', permission: 'day_business.edit' },
      { labelKey: 'credit_sale', icon: FileBarChart, path: '/day-business/credit-sale', permission: 'day_business.edit' },
      { labelKey: 'expenses', icon: Wallet, path: '/day-business/expenses', permission: 'day_business.edit' },
      { labelKey: 'recovery', icon: Coins, path: '/day-business/recovery', permission: 'day_business.edit' },
      { labelKey: 'employee_cash_recovery', icon: Users, path: '/day-business/employee-cash-recovery', permission: 'day_business.edit' },
      { labelKey: 'day_opening_stock', icon: FileUp, path: '/day-business/day-opening-stock', permission: 'day_business.edit' },
      { labelKey: 'day_settlement', icon: ClipboardCheck, path: '/day-business/day-settlement', permission: 'day_business.edit' },
    ],
  },
  {
    labelKey: 'invoice', icon: FileText, permission: 'invoice.create',
    subItems: [
      { labelKey: 'liquid_purchase', icon: GasPump, path: '/invoice/liquid-purchase', permission: 'invoice.create' },
      { labelKey: 'lube_purchase', icon: Droplets, path: '/invoice/lube-purchase', permission: 'invoice.create' },
    ]
  },
  { labelKey: 'statement_generation', icon: FileText, path: '/statement-generation', permission: 'reports.view' },
  {
    labelKey: 'product_stock', icon: PieChart, permission: 'reports.view',
    subItems: [
      { labelKey: 'stock_report', icon: FileBarChart, path: '/product-stock/stock-report', permission: 'reports.view' },
      { labelKey: 'lubes_loss', icon: FileDiff, path: '/product-stock/lubes-loss', permission: 'reports.view' },
      { labelKey: 'lubes_stock', icon: Droplets, path: '/product-stock/lubes-stock', permission: 'reports.view' },
      { labelKey: 'minimum_stock', icon: MinusCircle, path: '/product-stock/minimum-stock', permission: 'reports.view' },
    ],
  },
  { labelKey: 'shift_sheet_entry', icon: ClipboardList, path: '/shift-sheet-entry', permission: 'day_business.edit' },
  { labelKey: 'business_debit_credit_transaction', icon: Handshake, path: '/business-debit-credit', permission: 'day_business.edit' },
  { labelKey: 'vendor_transaction', icon: Truck, path: '/vendor-transaction', permission: 'day_business.edit' },
  { labelKey: 'reports', icon: BarChart, path: '/reports', permission: 'reports.view' },
  { labelKey: 'generate_sales_invoice', icon: Receipt, path: '/sales-invoice', permission: 'invoice.create' },
  { labelKey: 'credit_limit_reports', icon: ShieldCheck, path: '/credit-limit-reports', permission: 'reports.view' },
  { labelKey: 'miscellaneous', icon: SlidersHorizontal, path: '/miscellaneous', permission: 'master.view' },
  { labelKey: 'id-card-generator', icon: UserCog, path: '/id-card-generator', permission: 'master.view' },
];

const NavItem = ({ item, collapsed }) => {
  const { t } = useTranslation();
  const { icon: Icon, labelKey, path } = item;
  const label = t(labelKey);
  const location = useLocation();

  const isActive = location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));

  const content = (
    <NavLink
      to={path}
      className={`flex items-center p-2 my-1 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50'
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 whitespace-nowrap font-medium"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </NavLink>
  );

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
};

const AccordionNavItem = ({ item, collapsed }) => {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const { icon: Icon, labelKey, subItems, permission } = item;
  const label = t(labelKey);
  const location = useLocation();
  
  const getBasePath = (key) => {
    if (key === 'master') return '/master';
    if (key === 'day_business') return '/day-business';
    if (key === 'invoice') return '/invoice';
    if (key === 'product_stock') return '/product-stock';
    if (key === 'super_admin') return '/super-admin';
    return `/${key.toLowerCase().replace(/ /g, '-')}`;
  }

  const basePath = getBasePath(labelKey);
  const isActive = location.pathname.startsWith(basePath);

  const filteredSubItems = subItems.filter(subItem => hasPermission(subItem.permission));

  if (!hasPermission(permission) || filteredSubItems.length === 0) {
      return null;
  }

  const triggerContent = (
    <div className={`flex items-center w-full p-2 text-gray-600 dark:text-gray-300 rounded-lg ${isActive ? 'text-blue-600 dark:text-blue-300' : ''}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 whitespace-nowrap font-medium"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center p-2 my-1 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50">
              <Icon className="w-5 h-5" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full" defaultValue={isActive ? label : undefined}>
      <AccordionItem value={label} className="border-none">
        <AccordionTrigger className="hover:no-underline hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg p-0">
          {triggerContent}
        </AccordionTrigger>
        <AccordionContent className="pl-4">
          {filteredSubItems.map((subItem) => (
            <NavItem key={subItem.labelKey} item={subItem} collapsed={collapsed} />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const Sidebar = () => {
  const { collapsed } = useSidebar();
  const { hasPermission } = useAuth();

  const visibleMenuItems = menuItems.filter(item => {
    if (item.labelKey === 'settings' && !hasPermission('settings.view')) {
        return false;
    }
    return hasPermission(item.permission);
  });
  
  const settingsItem = { labelKey: 'settings', icon: Settings, path: '/settings', permission: 'settings.view' };
  const hasSettingsPermission = hasPermission(settingsItem.permission);


  return (
    <motion.div
      animate={{ width: collapsed ? '5.5rem' : '18rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-full theme-card border-r shadow-blue shrink-0"
    >
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {visibleMenuItems.map((item) =>
          item.subItems ? (
            <AccordionNavItem key={item.labelKey} item={item} collapsed={collapsed} />
          ) : (
            <NavItem key={item.labelKey} item={item} collapsed={collapsed} />
          )
        )}
        {hasSettingsPermission && <NavItem item={settingsItem} collapsed={collapsed} />}
      </nav>
    </motion.div>
  );
};

export default Sidebar;