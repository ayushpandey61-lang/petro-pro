import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare as MessageSquareWarning, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ReportUsPage = () => {
    const { toast } = useToast();
    const [report, setReport] = useState({ subject: '', message: '' });

    const handleChange = (e) => {
        setReport({ ...report, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!report.subject || !report.message) {
            toast({ title: "Error", description: "Please fill out both subject and message.", variant: "destructive" });
            return;
        }
        // Mock submission
        toast({ title: "Report Sent", description: "Thank you for your feedback! We will look into it." });
        setReport({ subject: '', message: '' });
    };

    return (
        <>
            <Helmet>
                <title>Report an Issue - PetroPro</title>
                <meta name="description" content="Report a bug or provide feedback." />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 flex justify-center items-center"
            >
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MessageSquareWarning /> Report an Issue</CardTitle>
                        <CardDescription>Encountered a bug or have a suggestion? Let us know.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" name="subject" value={report.subject} onChange={handleChange} placeholder="e.g., Error in daily sales report" required />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" name="message" value={report.message} onChange={handleChange} placeholder="Please describe the issue in detail..." rows={6} required />
                            </div>
                            <Button type="submit" className="w-full"><Send className="mr-2 h-4 w-4" /> Send Report</Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </>
    );
};

export default ReportUsPage;