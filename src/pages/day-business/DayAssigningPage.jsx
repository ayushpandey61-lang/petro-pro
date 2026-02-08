import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import LubsAssigningTab from '@/pages/day-business/components/LubsAssigningTab';
import NozzleAssigningTab from '@/pages/day-business/components/NozzleAssigningTab';

const DayAssigningPage = () => {
  return (
    <>
      <Helmet>
        <title>Day Assigning - PetroPro</title>
        <meta name="description" content="Assign nozzles and lubricant recovery tasks to employees." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <NavLink to="/dashboard" className="hover:text-primary">Dashboard</NavLink>
          <ChevronRight className="h-4 w-4" />
          <NavLink to="/day-business" className="hover:text-primary">Day Business</NavLink>
          <ChevronRight className="h-4 w-4" />
          <span className="font-semibold text-foreground">Day Assigning</span>
        </div>

        <Tabs defaultValue="lubs_assigning" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="lubs_assigning">Lubs Assignings</TabsTrigger>
            <TabsTrigger value="nozzle_assigning">Nozzles Assigning</TabsTrigger>
          </TabsList>
          <TabsContent value="lubs_assigning" className="mt-4">
            <LubsAssigningTab />
          </TabsContent>
          <TabsContent value="nozzle_assigning" className="mt-4">
            <NozzleAssigningTab />
          </TabsContent>
        </Tabs>
      </motion.div>
    </>
  );
};

export default DayAssigningPage;