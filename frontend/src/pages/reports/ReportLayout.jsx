import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const reportLinks = [
  { path: '/reports/all-credit-customer', name: 'All Credit Customers' },
  { path: '/reports/attendance', name: 'Attendance' },
  { path: '/reports/business-credit-debit-flow', name: 'Busi. Credit/Debit Flow' },
  { path: '/reports/bowser-transactions', name: 'Bowser Transactions' },
  { path: '/reports/customer-account-statement', name: 'Customer Account Statement' },
  { path: '/reports/daily-business-summary', name: 'Daily Business Summary' },
  { path: '/reports/daily-rate-history', name: 'Daily Rate History' },
  { path: '/reports/daily-stock-sale-register', name: 'Daily Stock/Sale (DSR)' },
  { path: '/reports/discount-offered', name: 'Discount Offered' },
  { path: '/reports/employee-status', name: 'Employee Status' },
  { path: '/reports/expenditure', name: 'Expenditure' },
  { path: '/reports/feedback', name: 'Feedback' },
  { path: '/reports/guest-customer-sales', name: 'Guest Customer Sales' },
  { path: '/reports/interest-transactions', name: 'Interest Transactions' },
  { path: '/reports/lubricants-stock', name: 'Lubricants Stock' },
  { path: '/reports/purchase', name: 'Purchase' },
  { path: '/reports/sales', name: 'Sales' },
  { path: '/reports/stock-variation', name: 'Stock Variation' },
  { path: '/reports/swipe', name: 'Swipe' },
  { path: '/reports/taxation', name: 'Taxation' },
  { path: '/reports/vendor-transactions', name: 'Vendor Transactions' },
];

const ReportLayout = () => {
  return (
    <div className="p-6">
       <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex gap-6"
      >
        <Card className="w-1/4 h-fit sticky top-6">
          <CardContent className="p-2">
            <nav className="flex flex-col space-y-1 h-[75vh] overflow-y-auto">
              {reportLinks.sort((a,b) => a.name.localeCompare(b.name)).map(link => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm rounded-md transition-colors ${
                      isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </CardContent>
        </Card>
        <div className="w-3/4">
            <Outlet />
        </div>
      </motion.div>
    </div>
  );
};

export default ReportLayout;