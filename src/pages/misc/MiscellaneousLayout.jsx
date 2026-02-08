import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { SlidersHorizontal, ListChecks, FileClock, BarChart3, Fingerprint, Coins, UserCheck, CheckSquare, AlertTriangle, MessageSquare } from 'lucide-react';

const miscLinks = [
  { title: "Interest Transaction", path: "/miscellaneous/interest-transaction", icon: Coins },
  { title: "Sheet Record", path: "/miscellaneous/sheet-record", icon: FileClock },
  { title: "Day Cash Report", path: "/miscellaneous/day-cash-report", icon: BarChart3 },
  { title: "Attendance", path: "/miscellaneous/attendance", icon: UserCheck },
  { title: "Biometric Punch", path: "/miscellaneous/biometric-attendance", icon: Fingerprint },
  { title: "Duty Pay", path: "/miscellaneous/duty-pay", icon: CheckSquare },
  { title: "Sales Officer", path: "/miscellaneous/sales-officer", icon: UserCheck },
  { title: "Credit Requests", path: "/miscellaneous/credit-requests", icon: ListChecks },
  { title: "Expiry Item", path: "/miscellaneous/expiry-item", icon: AlertTriangle },
  { title: "Feedback", path: "/miscellaneous/feedback", icon: MessageSquare },
];

const MiscellaneousLayout = () => {
  return (
    <>
      <Helmet>
        <title>Miscellaneous - PetroPro</title>
        <meta name="description" content="Access various miscellaneous tools and reports." />
      </Helmet>
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Miscellaneous</h1>
          </div>
        </motion.div>
        
        <div className="border-b border-border">
          <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
            {miscLinks.map((link) => (
              <NavLink
                key={link.title}
                to={link.path}
                className={({ isActive }) =>
                  `shrink-0 flex items-center gap-2 px-1 pb-4 text-sm font-medium ${
                    isActive
                      ? 'border-b-2 border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                <link.icon className="w-4 h-4" />
                {link.title}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MiscellaneousLayout;