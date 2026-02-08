import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Fingerprint, Edit, Save, Check, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataTable } from '@/components/ui/data-table';


const AttendanceMiscPage = () => {
    const { toast } = useToast();
    const [employees] = useLocalStorage('employees', []);
    const [shifts] = useLocalStorage('shifts', []);
    const [attendance, setAttendance] = useLocalStorage('attendance', []);
    
    const [date, setDate] = useState(new Date());
    const [shiftId, setShiftId] = useState('');
    const [showAttendanceSheet, setShowAttendanceSheet] = useState(false);
    const [attendanceStatus, setAttendanceStatus] = useState({});

    const handleShowSheet = () => {
        if (!date || !shiftId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a date and shift.' });
            return;
        }
        const initialStatus = {};
        employees.forEach(emp => {
            const existingRecord = attendance.find(a => a.employeeId === emp.id && a.date === format(date, 'yyyy-MM-dd') && a.shiftId === shiftId);
            initialStatus[emp.id] = existingRecord ? existingRecord.status : 'A'; // Default to Absent
        });
        setAttendanceStatus(initialStatus);
        setShowAttendanceSheet(true);
    };

    const handleStatusChange = (employeeId, status) => {
        setAttendanceStatus(prev => ({ ...prev, [employeeId]: status }));
    };

    const handleSaveAttendance = () => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const updatedAttendance = [...attendance];

        Object.entries(attendanceStatus).forEach(([employeeId, status]) => {
            const existingIndex = updatedAttendance.findIndex(a => a.employeeId === employeeId && a.date === dateStr && a.shiftId === shiftId);
            if (existingIndex > -1) {
                updatedAttendance[existingIndex].status = status;
            } else {
                updatedAttendance.push({
                    id: uuidv4(),
                    employeeId,
                    date: dateStr,
                    shiftId,
                    status,
                });
            }
        });

        setAttendance(updatedAttendance);
        toast({ title: 'Success', description: 'Attendance has been saved.' });
        setShowAttendanceSheet(false);
    };
    
    const columns = [
        {
            accessorKey: 'employeeName',
            header: 'Employee Name'
        },
        {
            id: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const employeeId = row.original.id;
                const currentStatus = attendanceStatus[employeeId];
                return (
                    <div className="flex gap-2">
                        <Button
                            size="icon"
                            variant={currentStatus === 'P' ? 'success' : 'outline'}
                            onClick={() => handleStatusChange(employeeId, 'P')}
                            className="w-8 h-8"
                        >
                            <Check className="h-4 w-4" />
                        </Button>
                         <Button
                            size="icon"
                            variant={currentStatus === 'A' ? 'destructive' : 'outline'}
                            onClick={() => handleStatusChange(employeeId, 'A')}
                             className="w-8 h-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                );
            }
        }
    ];

    return (
        <>
        <Helmet>
            <title>Staff Attendance - PetroPro</title>
        </Helmet>
        <Card>
            <CardHeader>
                <CardTitle>Staff Attendance</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                 {!showAttendanceSheet ? (
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="space-y-1">
                            <Label>Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} /></PopoverContent>
                            </Popover>
                        </div>
                         <div className="space-y-1">
                            <Label>Shift</Label>
                            <Select onValueChange={setShiftId} value={shiftId}>
                                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select Shift" /></SelectTrigger>
                                <SelectContent>
                                    {shifts.map(s => <SelectItem key={s.id} value={s.id}>{s.shiftName}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleShowSheet}>Take Attendance</Button>
                    </div>
                ) : (
                    <div>
                        <DataTable columns={columns} data={employees} />
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setShowAttendanceSheet(false)}>Cancel</Button>
                            <Button onClick={handleSaveAttendance}><Save className="mr-2 h-4 w-4"/> Save Attendance</Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
        </>
    );
};
export default AttendanceMiscPage;