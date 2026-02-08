import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FilePlus, TrendingUp, Receipt, Droplets } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const dayBusinessLinks = [
  {
    title: "Day Assigning",
    description: "Assign nozzles and lubricant recovery tasks.",
    icon: FilePlus,
    path: "/day-business/assigning",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Daily Sale Rate",
    description: "Set and track daily fuel prices.",
    icon: TrendingUp,
    path: "/day-business/daily-rate",
    color: "text-green-500",
    bg: "bg-green-500/10"
  },
  {
    title: "Sale Entry",
    description: "Record meter readings and sales data.",
    icon: Receipt,
    path: "/day-business/sale-entry",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10"
  },
  {
    title: "Lubricants Sale",
    description: "Record lubricant sales and transactions.",
    icon: Droplets,
    path: "/day-business/lubricants-sale",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
];

const DayBusiness = () => {
  return (
    <>
      <Helmet>
        <title>Day Business - PetroPro</title>
        <meta name="description" content="Manage daily business operations including assignments, rates, and sales entries." />
      </Helmet>
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Day Business</h1>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-muted-foreground mb-8 max-w-3xl"
        >
          Manage your daily operations from here. Choose a task to get started.
        </motion.p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dayBusinessLinks.map((link, index) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.3, duration: 0.5 }}
            >
              <Link to={link.path}>
                <Card className="glass hover:border-primary/80 hover:bg-card/80 transition-all duration-300 h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${link.bg}`}>
                        <link.icon className={`w-6 h-6 ${link.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{link.title}</CardTitle>
                        <CardDescription>{link.description}</CardDescription>
                      </div>
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

export default DayBusiness;