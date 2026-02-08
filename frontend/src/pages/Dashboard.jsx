import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Receipt, Coins, Wallet, BarChart, PieChart as PieChartIcon } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import useAuth from '@/hooks/useAuth';
import { ResponsiveContainer, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const daySaleFlowData = [
  { name: 'Cash', value: 125000.00 },
  { name: 'Credit', value: 45200.50 },
  { name: 'Lube', value: 15100.00 },
  { name: 'Vendor', value: 7250.00 },
];

const dayCashFlowData = [
  { name: 'Cash Sales', value: 125000.00 },
  { name: 'Credit Sales', value: 45200.50 },
];

const daySummaryData = [
    { name: 'Product', 'Opening': 4500, 'Purchase': 2200, 'Sale': 1750.41 },
    { name: 'Lube', 'Opening': 647.50, 'Purchase': 320, 'Sale': 11770.00 },
];

const dayPurchaseData = [
    { name: 'Fuel Purchase', value: 45000.00 },
    { name: 'Lube Purchase', value: 8500.00 },
];

const COLORS = ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa'];

const ChartCard = ({ data, title, chartType, setChartType }) => {
  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return (
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
          </PieChart>
        );
      case 'bar':
        return (
          <RechartsBarChart data={data}>
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
            <Bar dataKey="value" fill="hsl(var(--primary))" />
          </RechartsBarChart>
        );
      case 'line':
        return (
          <LineChart data={data}>
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-md h-full">
      <CardHeader className="form-section-header flex flex-row items-center justify-between">
        <CardTitle className="text-white">{title}</CardTitle>
        <div className="flex gap-1">
          <Button size="icon" variant={chartType === 'pie' ? 'secondary' : 'ghost'} className="h-7 w-7" onClick={() => setChartType('pie')}><PieChartIcon className="h-4 w-4" /></Button>
          <Button size="icon" variant={chartType === 'bar' ? 'secondary' : 'ghost'} className="h-7 w-7" onClick={() => setChartType('bar')}><BarChart className="h-4 w-4" /></Button>
          <Button size="icon" variant={chartType === 'line' ? 'secondary' : 'ghost'} className="h-7 w-7" onClick={() => setChartType('line')}><TrendingUp className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={200}>
          {renderChart()}
        </ResponsiveContainer>
        <div className="text-center mt-4 text-2xl font-bold">
          ₹{data.reduce((sum, item) => sum + item.value, 0).toLocaleString('en-IN')}
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, loading, userRole } = useAuth();
  const [saleFlowChartType, setSaleFlowChartType] = useState('pie');
  const [cashFlowChartType, setCashFlowChartType] = useState('pie');

  // Debug logging
  console.log('Dashboard - User:', user, 'Loading:', loading, 'Role:', userRole);

  const stats = [
    { title: 'day_sale', value: '₹1,25,400', icon: TrendingUp, color: 'text-green-500' },
    { title: 'day_purchase', value: '₹53,500', icon: Receipt, color: 'text-blue-500' },
    { title: 'day_recovery', value: '₹12,300', icon: Coins, color: 'text-yellow-500' },
    { title: 'day_expenses', value: '₹8,750', icon: Wallet, color: 'text-red-500' },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - PetroPro</title>
        <meta name="description" content="Your central hub for managing petrol pump operations. Get a quick overview of sales, stock, and recent activities." />
      </Helmet>
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-6 text-foreground"
        >
          {t('dashboard')}
        </motion.h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div key={stat.title} custom={i} initial="hidden" animate="visible" variants={cardVariants}>
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t(stat.title)}</CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <motion.div custom={4} initial="hidden" animate="visible" variants={cardVariants}>
                <ChartCard data={daySaleFlowData} title="Day Sale Flow" chartType={saleFlowChartType} setChartType={setSaleFlowChartType} />
            </motion.div>
            <motion.div custom={5} initial="hidden" animate="visible" variants={cardVariants}>
                <ChartCard data={dayCashFlowData} title="Day Cash Flow" chartType={cashFlowChartType} setChartType={setCashFlowChartType} />
            </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <motion.div custom={6} initial="hidden" animate="visible" variants={cardVariants}>
                <Card className="shadow-md h-full">
                    <CardHeader className="form-section-header"><CardTitle className="text-white">Day Summary</CardTitle></CardHeader>
                    <CardContent className="pt-4">
                        <ResponsiveContainer width="100%" height={250}>
                            <RechartsBarChart data={daySummaryData}>
                                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                                <Legend />
                                <Bar dataKey="Opening" fill="#1d4ed8" />
                                <Bar dataKey="Purchase" fill="#3b82f6" />
                                <Bar dataKey="Sale" fill="#93c5fd" />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </motion.div>
            <motion.div custom={7} initial="hidden" animate="visible" variants={cardVariants}>
                <Card className="shadow-md h-full">
                    <CardHeader className="form-section-header"><CardTitle className="text-white">Day Purchase</CardTitle></CardHeader>
                    <CardContent className="pt-4">
                        <ResponsiveContainer width="100%" height={250}>
                            <RechartsBarChart data={dayPurchaseData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                                <Legend />
                                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;