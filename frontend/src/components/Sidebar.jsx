import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Fuel as GasPump, Droplets, Users, Wallet, Truck, CalendarCheck, FileText, Settings, GitBranch, Printer, UserPlus, BookOpen, FilePlus, TrendingUp, Receipt, Coins, FileUp, ClipboardCheck, PieChart, FileBarChart, FileDiff, ClipboardList, HeartHandshake as Handshake, BarChart, BookUser, Banknote, ShieldCheck, FileKey, Microscope, FileHeart, FileClock, Download, MessageSquare, UserCog, Fuel, CreditCard, ListOrdered, MinusCircle, SlidersHorizontal, Package, DollarSign, LineChart, ShoppingCart, ShieldQuestion, Monitor, Globe, Image, FileImage, Type, Palette, Megaphone, Bell, Users as UsersIcon, BarChart3 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from '@/hooks/useTranslation';
import useAuth from '@/hooks/useAuth';
import { useSidebar } from '@/hooks/useSidebar';

const menuItems = [
  { labelKey: 'dashboard', icon: LayoutDashboard, path: '/dashboard', permission: 'dashboard.access' },
  {
    labelKey: 'master', icon: GitBranch, permission: 'fuel_product.access',
    subItems: [
      { labelKey: 'fuel_product', icon: GasPump, path: '/master/fuel-product', permission: 'fuel_product.access' },
      { labelKey: 'lubricants', icon: Droplets, path: '/master/lubricants', permission: 'lubricants.access' },
      { labelKey: 'employee', icon: Users, path: '/master/employee', permission: 'employee.access' },
      { labelKey: 'credit_party', icon: BookUser, path: '/master/credit-party', permission: 'credit_party.access' },
      { labelKey: 'vendor', icon: Truck, path: '/master/vendor', permission: 'vendor.access' },
      { labelKey: 'tank_and_nozzle', icon: Fuel, path: '/master/tanks', permission: 'tank_nozzle.access' },
      { labelKey: 'pump_setting', icon: Settings, path: '/master/nozzles', permission: 'pump_setting.access' },
      { labelKey: 'expenses_type', icon: Wallet, path: '/master/expense-types', permission: 'expenses_type.access' },
      { labelKey: 'business_debit_credit_party', icon: Handshake, path: '/master/business-cr-dr-party', permission: 'business_parties.access' },
      { labelKey: 'swipe_machine', icon: CreditCard, path: '/master/swipe-machines', permission: 'swipe_machine.access' },
      { labelKey: 'expiry_item', icon: CalendarCheck, path: '/master/expiry-items', permission: 'expiry_item.access' },
      { labelKey: 'duty_pay_shift', icon: UserCog, path: '/master/shifts', permission: 'duty_shift.access' },
      { labelKey: 'template_print', icon: Printer, path: '/master/print-templates', permission: 'print_template.access' },
      { labelKey: 'guest_customer', icon: UserPlus, path: '/master/guest-customer', permission: 'guest_customer.access' },
      { labelKey: 'denomination', icon: ListOrdered, path: '/master/denomination', permission: 'denomination.access' },
      { labelKey: 'tank_lorry_management', icon: Truck, path: '/master/tank-lorry-management', permission: 'tank_lorry.access' },
    ],
  },
  {
    labelKey: 'day_business', icon: BookOpen, permission: 'day_assigning.access',
    subItems: [
      { labelKey: 'day_assigning', icon: FilePlus, path: '/day-business/assigning', permission: 'day_assigning.access' },
      { labelKey: 'daily_sale_rate', icon: TrendingUp, path: '/day-business/daily-rate', permission: 'daily_sale_rate.access' },
      { labelKey: 'sale_entry', icon: Receipt, path: '/day-business/sale-entry', permission: 'sale_entry.access' },
      { labelKey: 'lubricants_sale', icon: Droplets, path: '/day-business/lubricants-sale', permission: 'lubricants_sale.access' },
      { labelKey: 'swipe', icon: CreditCard, path: '/day-business/swipe', permission: 'swipe.access' },
      { labelKey: 'credit_sale', icon: FileBarChart, path: '/day-business/credit-sale', permission: 'credit_sale.access' },
      { labelKey: 'expenses', icon: Wallet, path: '/day-business/expenses', permission: 'expenses.access' },
      { labelKey: 'recovery', icon: Coins, path: '/day-business/recovery', permission: 'recovery.access' },
      { labelKey: 'employee_cash_recovery', icon: Users, path: '/day-business/employee-cash-recovery', permission: 'employee_cash_recovery.access' },
      { labelKey: 'day_opening_stock', icon: FileUp, path: '/day-business/day-opening-stock', permission: 'day_opening_stock.access' },
      { labelKey: 'day_settlement', icon: ClipboardCheck, path: '/day-business/day-settlement', permission: 'day_settlement.access' },
    ],
  },
  {
    labelKey: 'invoice', icon: FileText, permission: 'liquid_purchase.access',
    subItems: [
      { labelKey: 'liquid_purchase', icon: GasPump, path: '/invoice/liquid-purchase', permission: 'liquid_purchase.access' },
      { labelKey: 'lube_purchase', icon: Droplets, path: '/invoice/lube-purchase', permission: 'lube_purchase.access' },
    ]
  },
  { labelKey: 'statement_generation', icon: FileText, path: '/statement-generation', permission: 'statement_generation.access' },
  {
    labelKey: 'product_stock', icon: PieChart, permission: 'product_stock.access',
    subItems: [
      { labelKey: 'stock_report', icon: FileBarChart, path: '/product-stock/stock-report', permission: 'product_stock.access' },
      { labelKey: 'lubes_loss', icon: FileDiff, path: '/product-stock/lubes-loss', permission: 'product_stock.access' },
      { labelKey: 'lubes_stock', icon: Droplets, path: '/product-stock/lubes-stock', permission: 'product_stock.access' },
      { labelKey: 'minimum_stock', icon: MinusCircle, path: '/product-stock/minimum-stock', permission: 'product_stock.access' },
    ],
  },
  { labelKey: 'shift_sheet_entry', icon: ClipboardList, path: '/shift-sheet-entry', permission: 'shift_sheet_entry.access' },
  { labelKey: 'business_debit_credit_transaction', icon: Handshake, path: '/business-debit-credit', permission: 'business_transaction.access' },
  { labelKey: 'vendor_transaction', icon: Truck, path: '/vendor-transaction', permission: 'vendor_transaction.access' },
  { labelKey: 'reports', icon: BarChart, path: '/reports', permission: 'reports.access' },
  { labelKey: 'generate_sales_invoice', icon: Receipt, path: '/sales-invoice', permission: 'sales_invoice.access' },
  { labelKey: 'credit_limit_reports', icon: ShieldCheck, path: '/credit-limit-reports', permission: 'credit_limit_reports.access' },
  { labelKey: 'miscellaneous', icon: SlidersHorizontal, path: '/miscellaneous', permission: 'miscellaneous.access' },
  { labelKey: 'id-card-generator', icon: UserCog, path: '/id-card-generator', permission: 'id_card_generator.access' },
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
            className="ml-4 whitespace-nowrap font-medium text-[0.9375rem]"
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

const AccordionNavItem = ({ item, collapsed, openAccordion, onAccordionChange }) => {
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
            className="ml-4 whitespace-nowrap font-medium text-[0.9375rem]"
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
            <div className="flex items-center justify-center p-2 my-1 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 cursor-pointer">
              <Icon className="w-5 h-5" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="p-0" sideOffset={10}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[200px]">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 font-semibold text-sm text-gray-900 dark:text-gray-100">
                {label}
              </div>
              {filteredSubItems.map((subItem) => (
                <NavLink
                  key={subItem.labelKey}
                  to={subItem.path}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <subItem.icon className="w-4 h-4 mr-2" />
                  <span className="font-medium text-[0.9375rem]">{t(subItem.labelKey)}</span>
                </NavLink>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full" value={openAccordion} onValueChange={onAccordionChange}>
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
  const [openAccordion, setOpenAccordion] = useState(null);

  const visibleMenuItems = menuItems.filter(item => {
    if (item.labelKey === 'settings' && !hasPermission('settings.view')) {
        return false;
    }
    return hasPermission(item.permission);
  });

  const settingsItem = { labelKey: 'settings', icon: Settings, path: '/settings', permission: 'settings.view' };
  const hasSettingsPermission = hasPermission(settingsItem.permission);

  const handleAccordionChange = (value) => {
    setOpenAccordion(value === openAccordion ? null : value);
  };


  return (
    <motion.div
      animate={{ width: collapsed ? '5.5rem' : '18rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-full bg-card border-r shadow-md shrink-0"
    >
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {visibleMenuItems.map((item) =>
          item.subItems ? (
            <AccordionNavItem
              key={item.labelKey}
              item={item}
              collapsed={collapsed}
              openAccordion={openAccordion}
              onAccordionChange={handleAccordionChange}
            />
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