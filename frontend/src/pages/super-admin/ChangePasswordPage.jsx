import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { KeyRound, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ChangePasswordPage = () => {
    const { toast } = useToast();
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
            return;
        }
        if (!passwords.newPassword || passwords.newPassword.length < 6) {
            toast({ title: "Error", description: "New password must be at least 6 characters.", variant: "destructive" });
            return;
        }
        // Mock password change logic
        toast({ title: "Success", description: "Password changed successfully! (Demo)" });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    return (
        <>
            <Helmet>
                <title>Change Password - PetroPro</title>
                <meta name="description" content="Change your account password." />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 flex justify-center items-center"
            >
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><KeyRound /> Change Password</CardTitle>
                        <CardDescription>Update your password for enhanced security.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <Input id="currentPassword" name="currentPassword" type="password" value={passwords.currentPassword} onChange={handleChange} required />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input id="newPassword" name="newPassword" type="password" value={passwords.newPassword} onChange={handleChange} required />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input id="confirmPassword" name="confirmPassword" type="password" value={passwords.confirmPassword} onChange={handleChange} required />
                            </div>
                            <Button type="submit" className="w-full"><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </>
    );
};

export default ChangePasswordPage;