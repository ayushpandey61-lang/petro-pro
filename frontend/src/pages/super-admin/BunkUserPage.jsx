import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { DataTable } from '@/components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Eye, EyeOff, Save, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api';
import useLocalStorage from '@/hooks/useLocalStorage';

const BunkUserPage = () => {
    const [bunkUsers, setBunkUsers] = useLocalStorage('bunkUsers', []);
    const [employees] = useLocalStorage('employees', []);
    const [roles, setRoles] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const { toast } = useToast();

    const fetchRoles = useCallback(async () => {
        try {
            const data = await apiClient.request('/admin/roles');
            setRoles(data || []);
        } catch (error) {
            console.error('Error fetching roles:', error);
            toast({
                title: "Error fetching roles",
                description: error.message || "An unexpected error occurred.",
                variant: "destructive"
            });
            setRoles([]);
        }
    }, [toast]);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const initialFormState = {
        date: new Date(),
        employeeId: '',
        userRole: '',
        username: '',
        password: '',
        status: true,
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (editingUser) {
            const emp = employees.find(e => e.employeeName === editingUser.employeeName);
            setFormData({
                ...editingUser,
                date: new Date(editingUser.date),
                employeeId: emp ? emp.id : '',
            });
            setIsFormOpen(true);
        } else {
            setFormData(initialFormState);
        }
    }, [editingUser, employees]);
    
    const [visiblePasswords, setVisiblePasswords] = useState({});

    const handleSave = () => {
        if (!formData.employeeId || !formData.userRole || !formData.username || !formData.password) {
            toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
            return;
        }

        const employee = employees.find(e => e.id === formData.employeeId);
        const userToSave = {
            id: editingUser ? editingUser.id : `BU-${Date.now()}`,
            date: format(formData.date, 'yyyy-MM-dd'),
            employeeName: employee?.employeeName || 'N/A',
            userRole: formData.userRole,
            username: formData.username,
            password: formData.password,
            status: formData.status,
            userLog: `Saved on ${new Date().toLocaleString()}`,
        };

        if (editingUser) {
            setBunkUsers(bunkUsers.map(u => u.id === editingUser.id ? userToSave : u));
            toast({ title: "Success", description: "User updated successfully." });
        } else {
            setBunkUsers([...bunkUsers, userToSave]);
            toast({ title: "Success", description: "User created successfully." });
        }
        
        setEditingUser(null);
        setIsFormOpen(false);
    };

    const handleEdit = (user) => setEditingUser(user);

    const handleDelete = (id) => {
        setBunkUsers(bunkUsers.filter(u => u.id !== id));
        toast({ title: "Success", description: "User deleted." });
    };

    const toggleStatus = (id) => {
        setBunkUsers(bunkUsers.map(u => u.id === id ? { ...u, status: !u.status } : u));
    };

    const togglePasswordVisibility = (id) => {
        setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const columns = [
        { 
            accessorKey: "date", 
            header: "Date",
            cell: ({ row }) => format(new Date(row.original.date), 'dd/MM/yyyy')
        },
        { accessorKey: "employeeName", header: "Employee Name" },
        { accessorKey: "userRole", header: "User Role" },
        { accessorKey: "username", header: "Username" },
        { 
            accessorKey: "password", 
            header: "Password",
            cell: ({ row }) => {
                const id = row.original.id;
                return (
                    <div className="flex items-center gap-2">
                        <span>{visiblePasswords[id] ? row.original.password : '••••••••'}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => togglePasswordVisibility(id)}>
                            {visiblePasswords[id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                );
            }
        },
        { 
            accessorKey: "status", 
            header: "Status",
            cell: ({ row }) => <Switch checked={row.original.status} onCheckedChange={() => toggleStatus(row.original.id)} />
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(row.original)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(row.original.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    ];

    return (
        <>
            <Helmet>
                <title>Bunk User Management - PetroPro</title>
            </Helmet>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Bunk User Management</h1>
                    <Button onClick={() => { setEditingUser(null); setIsFormOpen(true); }}>
                        <UserPlus className="mr-2 h-4 w-4" /> Create User
                    </Button>
                </div>
                
                {isFormOpen && (
                    <Card>
                        <CardHeader><CardTitle>{editingUser ? 'Edit User' : 'Create New User'}</CardTitle></CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <Label>Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild><Button variant="outline" className={cn("w-full justify-start", !formData.date && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger>
                                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.date} onSelect={(d) => setFormData({...formData, date: d})} /></PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-1">
                                    <Label>Employee Name</Label>
                                    <Select value={formData.employeeId || ''} onValueChange={(v) => setFormData({...formData, employeeId: v})}>
                                        <SelectTrigger><SelectValue placeholder="Select Employee" /></SelectTrigger>
                                        <SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id}>{e.employeeName}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label>User Role</Label>
                                     <Select value={formData.userRole || ''} onValueChange={(v) => setFormData({...formData, userRole: v})}>
                                        <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
                                        <SelectContent>{roles.map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Username</Label>
                                    <Input value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Password</Label>
                                    <Input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => { setIsFormOpen(false); setEditingUser(null); }}>Cancel</Button>
                                <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader><CardTitle>User List</CardTitle></CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={bunkUsers} filterColumn="employeeName" />
                    </CardContent>
                </Card>
            </motion.div>
        </>
    );
};

export default BunkUserPage;