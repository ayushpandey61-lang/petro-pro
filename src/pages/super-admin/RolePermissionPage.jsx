import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import useLocalStorage from '@/hooks/useLocalStorage';
import { ShieldCheck, Plus, Trash2, Edit, Save, X, Settings } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

const allPermissionsList = [
  'dashboard.view', 'master.view', 'master.edit', 'day_business.view', 'day_business.edit', 
  'invoice.view', 'invoice.create', 'reports.view', 'permissions.manage', 'settings.view',
  'super_admin.view'
];

const PermissionManager = ({ role, onSave }) => {
    const [permissions, setPermissions] = useState(role.permissions || []);

    const handleToggle = (permission) => {
        setPermissions(prev => 
            prev.includes(permission) ? prev.filter(p => p !== permission) : [...prev, permission]
        );
    };

    const handleSave = () => {
        onSave(permissions);
    };

    return (
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Manage Permissions for {role.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 max-h-96 overflow-y-auto p-2">
                {allPermissionsList.map(p => (
                    <div key={p} className="flex items-center space-x-2">
                        <Checkbox id={`perm-${p}`} checked={permissions.includes(p)} onCheckedChange={() => handleToggle(p)} />
                        <label htmlFor={`perm-${p}`} className="text-sm font-medium leading-none">{p}</label>
                    </div>
                ))}
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <DialogClose asChild><Button onClick={handleSave}>Save</Button></DialogClose>
            </DialogFooter>
        </DialogContent>
    );
};

const RolePermissionPage = () => {
    const [roles, setRoles] = useLocalStorage('userRoles', [
        { id: 1, name: 'DSM', permissions: ['dashboard.view'] },
        { id: 2, name: 'Manager', permissions: ['dashboard.view', 'reports.view'] },
        { id: 3, name: 'Super Admin', permissions: allPermissionsList },
        { id: 4, name: 'Supervisor', permissions: ['day_business.view'] },
    ]);
    const [newRole, setNewRole] = useState('');
    const [editingRole, setEditingRole] = useState(null);
    const [managingPermissionsFor, setManagingPermissionsFor] = useState(null);
    const { toast } = useToast();

    const addRole = () => {
        if (newRole && !roles.find(r => r.name === newRole)) {
            setRoles([...roles, { id: Date.now(), name: newRole, permissions: [] }]);
            setNewRole('');
            toast({ title: "Success", description: "Role added." });
        } else {
            toast({ title: "Error", description: "Role name is empty or already exists.", variant: "destructive" });
        }
    };
    
    const startEdit = (role) => setEditingRole({ ...role });
    const cancelEdit = () => setEditingRole(null);

    const saveEdit = () => {
        setRoles(roles.map(r => r.id === editingRole.id ? editingRole : r));
        setEditingRole(null);
        toast({ title: "Success", description: "Role updated." });
    };
    
    const deleteRole = (id) => {
        setRoles(roles.filter(r => r.id !== id));
        toast({ title: "Success", description: "Role deleted." });
    };

    const savePermissions = (newPermissions) => {
        setRoles(roles.map(r => r.id === managingPermissionsFor.id ? { ...r, permissions: newPermissions } : r));
        setManagingPermissionsFor(null);
        toast({ title: "Success", description: "Permissions updated." });
    };

    const columns = [
        { accessorKey: "name", header: "Role Name", cell: ({ row }) => {
            const role = row.original;
            if (editingRole && editingRole.id === role.id) {
                return <Input value={editingRole.name} onChange={(e) => setEditingRole({...editingRole, name: e.target.value})} />;
            }
            return role.name;
        }},
        { accessorKey: "permissions", header: "Permissions", cell: ({ row }) => `${row.original.permissions?.length || 0} granted` },
        { id: "actions", cell: ({ row }) => {
            const role = row.original;
            if (editingRole && editingRole.id === role.id) {
                return (
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={saveEdit}><Save className="h-4 w-4 text-green-500" /></Button>
                        <Button variant="ghost" size="icon" onClick={cancelEdit}><X className="h-4 w-4 text-red-500" /></Button>
                    </div>
                );
            }
            return (
                <Dialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><Settings className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => startEdit(role)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                            <DialogTrigger asChild><DropdownMenuItem onClick={() => setManagingPermissionsFor(role)}><ShieldCheck className="mr-2 h-4 w-4" /> Permissions</DropdownMenuItem></DialogTrigger>
                            <DropdownMenuItem className="text-destructive" onClick={() => deleteRole(role.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {managingPermissionsFor && managingPermissionsFor.id === role.id && <PermissionManager role={managingPermissionsFor} onSave={savePermissions} />}
                </Dialog>
            );
        }}
    ];

    return (
        <>
            <Helmet>
                <title>Role & Permission - PetroPro</title>
                <meta name="description" content="Manage user roles and their permissions." />
            </Helmet>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Add New Role</CardTitle></CardHeader>
                    <CardContent className="flex gap-2">
                        <Input placeholder="Enter new role name (e.g., Accountant)" value={newRole} onChange={(e) => setNewRole(e.target.value)} />
                        <Button onClick={addRole}><Plus className="mr-2 h-4 w-4" /> Add Role</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Manage Roles</CardTitle></CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={roles} />
                    </CardContent>
                </Card>
            </motion.div>
        </>
    );
};

export default RolePermissionPage;