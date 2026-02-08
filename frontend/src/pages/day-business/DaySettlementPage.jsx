import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DaySettlementForm from '@/pages/day-business/forms/DaySettlementForm';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { DataTable } from '@/components/ui/data-table';

const DaySettlementPage = () => {
  const [settlements, setSettlements] = useLocalStorage('daySettlements', []);
  const { toast } = useToast();

  const handleSave = (settlementData) => {
    setSettlements([...settlements, { ...settlementData, id: `SETTLE-${Date.now()}` }]);
    toast({ title: "Success", description: "Day settlement saved successfully." });
  };

  const columns = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "dayOpeningBalance", header: "Open Bal." },
    { accessorKey: "dayCashInflow", header: "Cash Inflow" },
    { accessorKey: "dayClosingBalance", header: "Close Bal." },
    { accessorKey: "remittance", header: "Remittance" },
  ];

  return (
    <>
      <Helmet>
        <title>Day Settlement - PetroPro</title>
        <meta name="description" content="Settle daily accounts and balances." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6"
      >
        <DaySettlementForm onSave={handleSave} />
        <Card className="glass">
          <CardContent className="pt-6">
            <DataTable columns={columns} data={settlements} filterColumn="date" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default DaySettlementPage;