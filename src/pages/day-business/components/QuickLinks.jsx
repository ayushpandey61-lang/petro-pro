import React from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Droplets, CreditCard, Wallet, Coins, Banknote, ClipboardCheck, Receipt, BarChart } from 'lucide-react';

const QuickLink = ({ to, icon: Icon, label }) => (
  <NavLink to={to} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-center w-20">
    <div className="p-3 bg-primary/10 rounded-full">
      <Icon className="h-5 w-5" />
    </div>
    <span className="text-xs font-medium">{label}</span>
  </NavLink>
);

export const QuickLinks = () => (
  <Card>
    <CardContent className="p-4 flex flex-wrap justify-center items-center gap-2 sm:justify-end sm:gap-6">
      <QuickLink to="/reports" icon={BarChart} label="Reports" />
      <QuickLink to="/day-business/sale-entry" icon={Receipt} label="Sale Entry" />
      <QuickLink to="/day-business/lubricants-sale" icon={Droplets} label="Lubs Sale" />
      <QuickLink to="/day-business/swipe" icon={CreditCard} label="Swipe" />
      <QuickLink to="/day-business/credit-sale" icon={Wallet} label="Credit Sale" />
      <QuickLink to="/day-business/expenses" icon={Banknote} label="Expenses" />
      <QuickLink to="/day-business/recovery" icon={Coins} label="Recovery" />
      <QuickLink to="/day-business/day-settlement" icon={ClipboardCheck} label="Settlement" />
    </CardContent>
  </Card>
);