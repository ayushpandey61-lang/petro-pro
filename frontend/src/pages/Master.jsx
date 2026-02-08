import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Users, Fuel as GasPump, Droplets, BookUser, Truck, Wallet, HeartHandshake, CreditCard, CalendarCheck, UserCog, Printer, Settings, UserPlus, ListOrdered } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const masterLinks = [
  { title: "Employee", icon: Users, path: "/master/employee" },
  { title: "Fuel Products", icon: GasPump, path: "/master/fuel-product" },
  { title: "Lubricants", icon: Droplets, path: "/master/lubricants" },
  { title: "Credit Customer", icon: BookUser, path: "/master/credit-party" },
  { title: "Expense Types", icon: Wallet, path: "/master/expense-types" },
  { title: "Business Cr/Dr Party", icon: HeartHandshake, path: "/master/business-cr-dr-party" },
  { title: "Vendors", icon: Truck, path: "/master/vendor" },
  { title: "Tanks", icon: GasPump, path: "/master/tanks" },
  { title: "Pump Setting", icon: Settings, path: "/master/nozzles" },
  { title: "Swipe Machines", icon: CreditCard, path: "/master/swipe-machines" },
  { title: "Expiry Items", icon: CalendarCheck, path: "/master/expiry-items" },
  { title: "Shifts", icon: UserCog, path: "/master/shifts" },
  { title: "Print Templates", icon: Printer, path: "/master/print-templates" },
  { title: "Guest Customer", icon: UserPlus, path: "/master/guest-customer" },
  { title: "Denomination", icon: ListOrdered, path: "/master/denomination" },
];

const Master = () => {
  return (
    <>
      <Helmet>
        <title>Master Data - PetroPro</title>
        <meta name="description" content="Manage all your core business data including employees, products, vendors, and more." />
      </Helmet>
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <GitBranch className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-foreground">Master Data</h1>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-muted-foreground mb-8 max-w-3xl"
        >
          This is the central hub for managing your core business information. Select a category below to view, add, or edit data.
        </motion.p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {masterLinks.map((link, index) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index + 0.3, duration: 0.5 }}
            >
              <Link to={link.path}>
                <Card className="shadow-md hover:shadow-lg hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                        <link.icon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                      </div>
                      <CardTitle className="text-lg">{link.title}</CardTitle>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Master;