import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const FeedbackReport = () => {
    const { toast } = useToast();
    const handleSubmit = () => {
        toast({ title: 'Report Submitted', description: 'Generating Feedback Report...' });
    };
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Feedback Reports</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button onClick={handleSubmit}>Submit</Button>
      </CardContent>
    </Card>
  );
};

export default FeedbackReport;