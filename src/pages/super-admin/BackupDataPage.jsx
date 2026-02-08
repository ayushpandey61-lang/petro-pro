import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DatabaseBackup, Download, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const BackupDataPage = () => {
    const { toast } = useToast();

    const handleBackup = () => {
        // This is a mock function. In a real app, this would involve API calls.
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data[key] = localStorage.getItem(key);
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `petropro-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Backup Successful", description: "All application data has been downloaded." });
    };

    const handleRestore = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    // Clear existing data before restoring
                    // In a real app, ask for confirmation
                    localStorage.clear();
                    Object.keys(data).forEach(key => {
                        localStorage.setItem(key, data[key]);
                    });
                    toast({ title: "Restore Successful", description: "Data restored from backup. Please refresh the page." });
                } catch (error) {
                    toast({ title: "Restore Failed", description: "Invalid backup file.", variant: "destructive" });
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <>
            <Helmet>
                <title>Backup & Restore - PetroPro</title>
                <meta name="description" content="Backup or restore your application data." />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 flex justify-center items-center"
            >
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><DatabaseBackup /> Backup & Restore</CardTitle>
                        <CardDescription>Save your data locally or restore from a backup file.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-2">Create Backup</h3>
                            <p className="text-sm text-muted-foreground mb-4">Download all your application data into a single JSON file. Keep it safe!</p>
                            <Button onClick={handleBackup} className="w-full"><Download className="mr-2 h-4 w-4" /> Download Backup</Button>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-semibold mb-2">Restore from Backup</h3>
                            <p className="text-sm text-muted-foreground mb-4">Restore your data from a previously downloaded backup file. This will overwrite current data.</p>
                            <Button asChild className="w-full"><label htmlFor="restore-file"><Upload className="mr-2 h-4 w-4" /> Choose File to Restore</label></Button>
                            <input type="file" id="restore-file" accept=".json" className="hidden" onChange={handleRestore} />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </>
    );
};

export default BackupDataPage;