import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const templates = [
  { id: 1, name: 'Bill Memo', description: 'Standard bill memo format.' },
  { id: 2, name: 'Invoice Slip', description: 'Detailed invoice slip.' },
  { id: 3, name: 'Credit Statement', description: 'Customer credit statement.' },
  { id: 4, name: 'Day End Report', description: 'Summary report for the day.' },
  { id: 5, name: 'Purchase Order', description: 'Template for purchase orders.' },
];

const PrintTemplatePage = () => {
  return (
    <>
      <Helmet>
        <title>Print Master - PetroPro</title>
        <meta name="description" content="Manage and preview print templates." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        <Card className="bg-primary/5">
          <CardHeader className="bg-primary text-primary-foreground p-4">
            <CardTitle>Print Master</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="text-center">
                    <CardHeader>
                      <CardTitle>{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 bg-muted flex items-center justify-center rounded-md mb-4">
                        <p className="text-muted-foreground">Preview</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <Button className="bg-green-600 hover:bg-green-700">Update</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default PrintTemplatePage;