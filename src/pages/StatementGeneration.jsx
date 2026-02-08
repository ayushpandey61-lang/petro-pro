import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useLocalStorage from '@/hooks/useLocalStorage';
import { DataTable } from '@/components/ui/data-table';
import { useToast } from '@/components/ui/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const StatementGeneration = () => {
  const [creditParties] = useLocalStorage('creditParties', []);
  const [bills, setBills] = useLocalStorage('generatedBills', []);
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    fromDate: null,
    toDate: null,
    organizationId: ''
  });

  const handleGenerate = () => {
    if (!filters.organizationId || !filters.fromDate || !filters.toDate) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select an organization and a date range.",
      });
      return;
    }

    const newBill = {
      id: `ST-${Date.now()}`,
      statementDate: format(new Date(), 'yyyy-MM-dd'),
      organizationId: filters.organizationId,
      organizationName: creditParties.find(p => p.id === filters.organizationId)?.organizationName || 'N/A',
      fromDate: format(filters.fromDate, 'yyyy-MM-dd'),
      toDate: format(filters.toDate, 'yyyy-MM-dd'),
      billAmount: (Math.random() * 50000 + 5000).toFixed(2), // Mock amount
    };

    setBills(prev => [...prev, newBill]);
    toast({
      title: "Generated!",
      description: "Statement generated successfully.",
    });
  };

  const columns = [
    { accessorKey: 'id', header: 'ST No.' },
    { accessorKey: 'statementDate', header: 'Statement Date' },
    { accessorKey: 'organizationName', header: 'Organisation' },
    { accessorKey: 'fromDate', header: 'From Date' },
    { accessorKey: 'toDate', header: 'To Date' },
    { accessorKey: 'billAmount', header: 'Bill Amount', cell: ({ row }) => `₹${parseFloat(row.original.billAmount).toLocaleString('en-IN')}` },
    {
      id: 'action',
      header: 'Action',
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> View/Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>Statement Generation - PetroPro</title>
        <meta name="description" content="Generate credit customer statements and bills." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        <Card className="bg-primary/5">
          <CardHeader className="bg-primary text-primary-foreground p-4">
            <CardTitle>Bill Generation</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-1">
                <Label>Date Range</Label>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-[180px] justify-start text-left font-normal", !filters.fromDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.fromDate ? format(filters.fromDate, "PPP") : <span>From Date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={filters.fromDate} onSelect={(d) => setFilters(f => ({...f, fromDate: d}))} /></PopoverContent>
                  </Popover>
                  <span>-</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-[180px] justify-start text-left font-normal", !filters.toDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.toDate ? format(filters.toDate, "PPP") : <span>To Date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={filters.toDate} onSelect={(d) => setFilters(f => ({...f, toDate: d}))} /></PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-1 flex-grow">
                <Label>Organization</Label>
                <Select onValueChange={(v) => setFilters(f => ({...f, organizationId: v}))} value={filters.organizationId}>
                  <SelectTrigger><SelectValue placeholder="Choose Organization" /></SelectTrigger>
                  <SelectContent>{creditParties.map(c => <SelectItem key={c.id} value={c.id}>{c.organizationName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button onClick={handleGenerate}>Generate</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 glass">
          <CardContent className="pt-6">
            <DataTable columns={columns} data={bills} filterColumn="organizationName" />
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default StatementGeneration;