import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import useLocalStorage from '@/hooks/useLocalStorage';

const LubesStockPage = () => {
  const [lubricants] = useLocalStorage('lubricants', []);
  // This is a simplified view. A real app would aggregate purchases and sales.
  const stockData = lubricants.map(l => ({
    ...l,
    purchase: Math.floor(Math.random() * 50) + 10, // Mock data
    sale: Math.floor(Math.random() * 30), // Mock data
    loss: Math.floor(Math.random() * 5), // Mock data
    get stock() { return this.openingStock + this.purchase - this.sale - this.loss; }
  }));

  const columns = [
    { accessorKey: "productName", header: "Product" },
    { accessorKey: "openingStock", header: "Opening" },
    { accessorKey: "purchase", header: "Purchase" },
    { accessorKey: "sale", header: "Sale" },
    { accessorKey: "loss", header: "Loss" },
    { accessorKey: "stock", header: "Stock" },
  ];

  return (
    <>
      <Helmet>
        <title>Lubes Stock - PetroPro</title>
        <meta name="description" content="View current lubricant stock levels." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle>Lubes Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={stockData} filterColumn="productName" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default LubesStockPage;