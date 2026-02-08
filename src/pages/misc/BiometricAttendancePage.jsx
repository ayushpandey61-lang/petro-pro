import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Fingerprint, LogIn, LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useLocalStorage from '@/hooks/useLocalStorage';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';

const BiometricAttendancePage = () => {
    const { toast } = useToast();
    const [employees] = useLocalStorage('employees', []);
    const [biometricRecords, setBiometricRecords] = useLocalStorage('biometricRecords', []);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [lastPunch, setLastPunch] = useState(null);

    const handleEmployeeSelect = (employeeId) => {
        setSelectedEmployee(employeeId);
        const employeeRecords = biometricRecords
            .filter(r => r.employeeId === employeeId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setLastPunch(employeeRecords[0] || null);
    };

    const handlePunch = (punchType) => {
        if (!selectedEmployee) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select an employee.' });
            return;
        }

        if (lastPunch && lastPunch.type === punchType) {
             toast({ variant: 'destructive', title: 'Error', description: `You have already punched ${punchType}.` });
             return;
        }
        
        const newRecord = {
            id: uuidv4(),
            employeeId: selectedEmployee,
            employeeName: employees.find(e => e.id === selectedEmployee)?.employeeName || 'Unknown',
            timestamp: new Date().toISOString(),
            type: punchType,
        };

        setBiometricRecords(prev => [...prev, newRecord]);
        handleEmployeeSelect(selectedEmployee); // Refresh last punch info
        toast({
            title: 'Success!',
            description: `${newRecord.employeeName} punched ${punchType} at ${format(new Date(newRecord.timestamp), 'hh:mm:ss a')}`,
        });
    };

    return (
        <>
            <Helmet>
                <title>Biometric Punch - PetroPro</title>
                <meta name="description" content="Simulated biometric attendance punching system." />
            </Helmet>
            <div className="flex justify-center items-center p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <Card className="text-center shadow-2xl">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                                <Fingerprint className="w-16 h-16 text-primary" />
                            </div>
                            <CardTitle className="text-2xl mt-4">Biometric Attendance</CardTitle>
                            <CardDescription>Select your name and punch in or out.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <Select onValueChange={handleEmployeeSelect} value={selectedEmployee}>
                                <SelectTrigger className="w-full h-12 text-lg">
                                    <SelectValue placeholder="Select Employee..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.filter(e => e.status).map(e => (
                                        <SelectItem key={e.id} value={e.id} className="text-lg">{e.employeeName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {selectedEmployee && (
                                <Card className="bg-muted p-4 text-sm">
                                    {lastPunch ? (
                                        <p>Your last punch was <span className={`font-bold ${lastPunch.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                                            {lastPunch.type.toUpperCase()}
                                        </span> at {format(new Date(lastPunch.timestamp), 'hh:mm a')}
                                        </p>
                                    ) : (
                                        <p>No recent punches found for today.</p>
                                    )}
                                </Card>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4">
                                <Button 
                                    className="h-20 text-xl bg-green-500 hover:bg-green-600" 
                                    onClick={() => handlePunch('in')}
                                    disabled={!selectedEmployee || lastPunch?.type === 'in'}
                                >
                                    <LogIn className="mr-2 h-8 w-8" />
                                    Punch In
                                </Button>
                                <Button 
                                    className="h-20 text-xl bg-red-500 hover:bg-red-600" 
                                    onClick={() => handlePunch('out')}
                                    disabled={!selectedEmployee || lastPunch?.type === 'out'}
                                >
                                    <LogOut className="mr-2 h-8 w-8" />
                                    Punch Out
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </>
    );
};
export default BiometricAttendancePage;