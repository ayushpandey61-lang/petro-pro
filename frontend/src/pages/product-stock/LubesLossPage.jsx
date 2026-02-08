import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import LubesLossForm from '@/pages/product-stock/forms/LubesLossForm';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';

const LubesLossPage = () => {
  const [losses, setLosses] = useLocalStorage('lubesLosses', []);
  const { toast } = useToast();

  const handleSave = (lossData) => {
    setLosses([...losses, { ...lossData, id: `LL-${Date.now()}` }]);
    toast({ title: "Success", description: "Lube loss recorded successfully." });
  };

  const columns = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "productName", header: "Product" },
    { accessorKey: "quantity", header: "Quantity" },
  ];

  return (
    <>
      <Helmet>
        <title>Lubes Loss - PetroPro</title>
        <meta name="description" content="Record lubricant losses." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <LubesLossForm onSave={handleSave} />
        <Card className="glass">
          <CardContent className="pt-6">
            <DataTable columns={columns} data={losses} filterColumn="productName" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default LubesLossPage;