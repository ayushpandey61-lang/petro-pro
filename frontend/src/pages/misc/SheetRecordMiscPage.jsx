import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const SheetRecordMiscPage = () => {
    const [shiftRecords, setShiftRecords] = useLocalStorage('shiftRecords', []);
    const [employees] = useLocalStorage('employees', []);
    const [shifts] = useLocalStorage('shifts', []);
    const [filters, setFilters] = useState({ from: null, to: null, shiftId: null, employeeId: null });
    const { toast } = useToast();
    const navigate = useNavigate();

    const filteredRecords = useMemo(() => {
        return shiftRecords.filter(record => {
            if (!record.date) return false;
            const recordDate = parseISO(record.date);
            const fromDate = filters.from ? new Date(filters.from) : null;
            const toDate = filters.to ? new Date(filters.to) : null;
            if (fromDate) {
                fromDate.setHours(0, 0, 0, 0);
                if (recordDate < fromDate) return false;
            }
            if (toDate) {
                toDate.setHours(23, 59, 59, 999);
                if (recordDate > toDate) return false;
            }
            if (filters.shiftId && record.shiftId !== filters.shiftId) return false;
            if (filters.employeeId && record.employeeId !== filters.employeeId) return false;
            return true;
        }).sort((a, b) => parseISO(b.date) - parseISO(a.date));
    }, [shiftRecords, filters]);

    const handleUpdateEmployee = (recordId, newEmployeeId) => {
        const updatedRecords = shiftRecords.map(rec => {
            if (rec.id === recordId) {
                return { ...rec, employeeId: newEmployeeId };
            }
            return rec;
        });
        setShiftRecords(updatedRecords);
        toast({ title: "Success", description: "Employee updated for the shift record." });
    };

    const handleEditRecord = (recordId) => {
        navigate(`/shift-sheet-entry/${recordId}`);
    };

    const getEmployeeName = (id) => employees.find(e => e.id === id)?.employeeName || 'N/A';
    const getShiftName = (id) => shifts.find(s => s.id === id)?.shiftName || 'N/A';

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sheet Records</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="flex flex-wrap gap-4 items-end p-4 border rounded-lg">
                    <div className="space-y-1">
                        <label>From Date</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal", !filters.from && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {filters.from ? format(filters.from, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={filters.from} onSelect={(d) => setFilters(f => ({...f, from: d}))} /></PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-1">
                        <label>To Date</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal", !filters.to && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {filters.to ? format(filters.to, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={filters.to} onSelect={(d) => setFilters(f => ({...f, to: d}))} /></PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-1">
                        <label>Shift</label>
                        <Select onValueChange={(v) => setFilters(f => ({...f, shiftId: v}))} value={filters.shiftId}>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Shifts" /></SelectTrigger>
                            <SelectContent>{shifts.map(s => <SelectItem key={s.id} value={s.id}>{s.shiftName}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <label>Employee</label>
                        <Select onValueChange={(v) => setFilters(f => ({...f, employeeId: v}))} value={filters.employeeId}>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Employees" /></SelectTrigger>
                            <SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id}>{e.employeeName}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Shift</TableHead>
                                <TableHead>Employee</TableHead>
                                <TableHead>Total Sale</TableHead>
                                <TableHead>Shortage</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRecords.length > 0 ? filteredRecords.map(record => {
                                const totalSale = record.summary?.sale || 0;
                                return (
                                <TableRow key={record.id}>
                                    <TableCell>{format(parseISO(record.date), 'PPP')}</TableCell>
                                    <TableCell>{getShiftName(record.shiftId)}</TableCell>
                                    <TableCell>{getEmployeeName(record.employeeId)}</TableCell>
                                    <TableCell>₹{totalSale.toFixed(2)}</TableCell>
                                    <TableCell className="text-red-500">₹{record.summary?.shiftShort?.toFixed(2) || '0.00'}</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEditRecord(record.id)}>
                                            <Edit className="h-4 w-4 text-blue-500" />
                                        </Button>
                                        <Select onValueChange={(newEmpId) => handleUpdateEmployee(record.id, newEmpId)} defaultValue={record.employeeId}>
                                            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Change Employee" /></SelectTrigger>
                                            <SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id}>{e.employeeName}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            )}) : (
                                <TableRow>
                                    <TableCell colSpan="6" className="text-center">No records found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};
export default SheetRecordMiscPage;