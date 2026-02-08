import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const StockReportPage = () => {
  const [tanks] = useLocalStorage('tanks', []);
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });

  // Mock data for the report
  const reportData = tanks.map(tank => ({
    date: format(new Date(), 'yyyy-MM-dd'),
    tank: tank.tankName,
    product: tank.product,
    variation: (Math.random() * 10 - 5).toFixed(2),
    openStock: (Math.random() * 10000).toFixed(2),
    receipt: (Math.random() * 5000).toFixed(2),
    totalStock: (Math.random() * 15000).toFixed(2),
    sale: (Math.random() * 4000).toFixed(2),
    closeStock: (Math.random() * 11000).toFixed(2),
  }));

  const columns = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "tank", header: "Tank" },
    { accessorKey: "product", header: "Product" },
    { accessorKey: "variation", header: "Variation" },
    { accessorKey: "openStock", header: "Open Stock" },
    { accessorKey: "receipt", header: "Receipt" },
    { accessorKey: "totalStock", header: "Total Stock" },
    { accessorKey: "sale", header: "Sale" },
    { accessorKey: "closeStock", header: "Close Stock" },
  ];

  return (
    <>
      <Helmet>
        <title>Stock Report - PetroPro</title>
        <meta name="description" content="View detailed stock reports for fuel products." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle>Stock Report</CardTitle>
            <div className="flex items-center gap-4 mt-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "PPP") : <span>From Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dateRange.from} onSelect={(d) => setDateRange(dr => ({...dr, from: d}))} /></PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal", !dateRange.to && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "PPP") : <span>To Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dateRange.to} onSelect={(d) => setDateRange(dr => ({...dr, to: d}))} /></PopoverContent>
              </Popover>
              <Button>Submit</Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={reportData} filterColumn="product" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default StockReportPage;