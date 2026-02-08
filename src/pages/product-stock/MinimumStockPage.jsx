import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import useLocalStorage from '@/hooks/useLocalStorage';

const MinimumStockPage = () => {
  const [lubricants] = useLocalStorage('lubricants', []);
  
  // This is a simplified view. A real app would have current stock levels.
  // We'll simulate current stock and filter based on min quantity.
  const stockData = lubricants.map(l => ({
    ...l,
    currentStock: Math.floor(Math.random() * (parseInt(l.minQuantity) + 5)), // Simulate stock around min level
  })).filter(l => l.currentStock < l.minQuantity);

  const columns = [
    { 
      accessorKey: "productName", 
      header: "Product",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.productName}</p>
          <p className="text-xs text-muted-foreground">{row.original.hsnCode}</p>
        </div>
      )
    },
    { accessorKey: "minQuantity", header: "Minimum Stock" },
    { accessorKey: "currentStock", header: "Present Stock" },
  ];

  return (
    <>
      <Helmet>
        <title>Minimum Stock Alert - PetroPro</title>
        <meta name="description" content="View items that are below their minimum stock level." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle>Minimum Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={stockData} filterColumn="productName" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default MinimumStockPage;