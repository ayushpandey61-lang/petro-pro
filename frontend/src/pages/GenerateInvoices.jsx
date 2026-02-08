import React from 'react';
import { motion } from 'framer-motion';
import { FilePlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const GenerateInvoices = () => {
  const { toast } = useToast();

  const handleAction = (action) => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: `${action} functionality isn't implemented yet.`,
    });
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Generate Invoices</h1>
        <Button onClick={() => handleAction('Bulk Generate')}>Bulk Generate</Button>
      </motion.div>
      <div className="flex flex-col items-center justify-center h-full text-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg min-h-[60vh]">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
          className="p-8 bg-white dark:bg-gray-800 rounded-full shadow-2xl mb-6"
        >
          <FilePlus className="w-24 h-24 text-lime-500" />
        </motion.div>
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl font-bold text-gray-800 dark:text-white mb-2"
        >
          Invoice Generation Hub
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-lg text-gray-600 dark:text-gray-300 max-w-md"
        >
          This section will contain tools for bulk and custom invoice generation.
        </motion.p>
      </div>
    </div>
  );
};

export default GenerateInvoices;