import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { PieChart, FileBarChart, FileDiff, Droplets, MinusCircle } from 'lucide-react';

const stockLinks = [
  { title: "Stock Report", path: "/product-stock/stock-report", icon: FileBarChart },
  { title: "Lubes Loss", path: "/product-stock/lubes-loss", icon: FileDiff },
  { title: "Lubes Stock", path: "/product-stock/lubes-stock", icon: Droplets },
  { title: "Minimum Stock", path: "/product-stock/minimum-stock", icon: MinusCircle },
];

const ProductStock = () => {
  return (
    <>
      <Helmet>
        <title>Product Stock - PetroPro</title>
        <meta name="description" content="Manage and track your fuel and lubricant inventory." />
      </Helmet>
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <PieChart className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Product Stock</h1>
          </div>
        </motion.div>
        
        <div className="border-b border-border">
          <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
            {stockLinks.map((link) => (
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

export default ProductStock;