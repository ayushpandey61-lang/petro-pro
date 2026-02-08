import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Shield, Plus, Trash2, Edit, Save, X, MoreHorizontal, Loader2 } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { apiClient } from '@/lib/api';

const PermissionManager = ({ role, availablePermissions, onSave, onClose }) => {
    const [assignedPermissions, setAssignedPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPermissions = async () => {
            setLoading(true);
            try {
                const data = await apiClient.getRolePermissions(role.id);
                if (data) {
                    setAssignedPermissions(data.map(p => p.permission_id));
                }
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
            setLoading(false);
        };
        fetchPermissions();
    }, [role.id]);

    const handleToggle = (permissionId) => {
        setAssignedPermissions(prev =>
            prev.includes(permissionId) ? prev.filter(pId => pId !== permissionId) : [...prev, permissionId]
        );
    };

    const handleSave = () => {
        onSave(role.id, assignedPermissions);
    };

    return (
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Manage Permissions for {role.name}</DialogTitle>
                <DialogDescription>Select the permissions to grant to this role.</DialogDescription>
            </DialogHeader>
            {loading ? (
                <div className="flex justify-center items-center h-48"><Loader2 className="animate-spin h-8 w-8" /></div>
            ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto p-2 border rounded-md">
                    {availablePermissions.map(p => (
                        <div key={p.id} className="flex items-center space-x-3 p-2 rounded hover:bg-muted">
                            <Checkbox 
                                id={`perm-${p.id}`} 
                                checked={assignedPermissions.includes(p.id)} 
                                onCheckedChange={() => handleToggle(p.id)} 
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label htmlFor={`perm-${p.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {p.name}
                                </label>
                                <p className="text-xs text-muted-foreground">{p.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} disabled={loading}>
                    <Save className="mr-2 h-4 w-4" /> Save
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};

const RolesPermissionsPage = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newRoleName, setNewRoleName] = useState('');
    const [editingRole, setEditingRole] = useState(null);
    const [managingPermissionsFor, setManagingPermissionsFor] = useState(null);
    const { toast } = useToast();

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const [rolesData, permsData] = await Promise.all([
                apiClient.getRoles(),
                apiClient.getPermissions()
            ]);

            if (rolesData.error) {
                console.error('Roles error:', rolesData.error);
                toast({ title: "Error fetching roles", description: rolesData.error, variant: "destructive" });
                setRoles([]);
            } else {
                setRoles(rolesData || []);
            }

            if (permsData.error) {
                console.error('Permissions error:', permsData.error);
                toast({ title: "Error fetching permissions", description: permsData.error, variant: "destructive" });
                setPermissions([]);
            } else {
                setPermissions(permsData || []);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            toast({ title: "Unexpected error", description: "An unexpected error occurred while fetching data.", variant: "destructive" });
            setRoles([]);
            setPermissions([]);
        }
        setLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleAddRole = async () => {
        if (!newRoleName) return;
        try {
            const result = await apiClient.createRole({ name: newRoleName });
            if (result.error) {
                console.error('Add role error:', result.error);
                toast({ title: "Error", description: result.error, variant: "destructive" });
            } else {
                toast({ title: "Success", description: "Role added." });
                setNewRoleName('');
                fetchAllData();
            }
        } catch (error) {
            console.error('Unexpected error adding role:', error);
            toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        }
    };

    const handleSaveRole = async () => {
        if (!editingRole) return;
        try {
            const result = await apiClient.updateRole(editingRole.id, { name: editingRole.name });
            if (result.error) {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            } else {
                toast({ title: "Success", description: "Role updated." });
                setEditingRole(null);
                fetchAllData();
            }
        } catch (error) {
            console.error('Error updating role:', error);
            toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        }
    };

    const handleDeleteRole = async (roleId) => {
        try {
            const result = await apiClient.deleteRole(roleId);
            if (result.error) {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            } else {
                toast({ title: "Success", description: "Role deleted." });
                fetchAllData();
            }
        } catch (error) {
            console.error('Error deleting role:', error);
            toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        }
    };

    const handleSavePermissions = async (roleId, permissionIds) => {
        try {
            const result = await apiClient.updateRolePermissions(roleId, permissionIds);
            if (result.error) {
                console.error('Error saving permissions:', result.error);
                toast({ title: "Error", description: result.error, variant: "destructive" });
                return;
            }

            toast({ title: "Success", description: "Permissions updated." });
            setManagingPermissionsFor(null);
        } catch (error) {
            console.error('Unexpected error saving permissions:', error);
            toast({ title: "Error", description: "An unexpected error occurred while saving permissions.", variant: "destructive" });
        }
    };

    const columns = [
        { 
            accessorKey: "name", 
            header: "Role Name", 
            cell: ({ row }) => {
                const role = row.original;
                return (editingRole && editingRole.id === role.id) ? (
                    <Input value={editingRole.name} onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })} autoFocus />
                ) : (
                    role.name
                );
            }
        },
        { 
            id: "actions", 
            cell: ({ row }) => {
                const role = row.original;
                if (editingRole && editingRole.id === role.id) {
                    return (
                        <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="icon" onClick={handleSaveRole}><Save className="h-4 w-4 text-green-500" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => setEditingRole(null)}><X className="h-4 w-4 text-red-500" /></Button>
                        </div>
                    );
                }
                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setEditingRole(role)}><Edit className="mr-2 h-4 w-4" /> Edit Name</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setManagingPermissionsFor(role)}><Shield className="mr-2 h-4 w-4" /> Manage Permissions</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteRole(role.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            }
        }
    ];

    if (loading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    // Show setup message if tables don't exist
    if (roles.length === 0 && permissions.length === 0) {
        return (
            <>
                <Helmet>
                    <title>Roles & Permissions - PetroPro</title>
                    <meta name="description" content="Manage user roles and their permissions." />
                </Helmet>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 p-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-red-600">Database Setup Required</CardTitle>
                            <CardDescription>
                                The roles and permissions system requires database tables that haven't been created yet.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <h3 className="font-semibold text-yellow-800 mb-2">Required Database Tables:</h3>
                                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                                    <li><code>roles</code> - Stores user roles (Super Admin, Manager, etc.)</li>
                                    <li><code>permissions</code> - Stores available permissions (dashboard.view, master.edit, etc.)</li>
                                    <li><code>role_permissions</code> - Links roles to their permissions</li>
                                </ul>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-semibold text-blue-800 mb-2">Setup Options:</h3>
                                <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                                    <li>Run the <code>database_setup.sql</code> file in your Supabase SQL editor</li>
                                    <li>Or use the SQL script provided in the project root directory</li>
                                    <li>Alternatively, create the tables manually in your Supabase dashboard</li>
                                </ol>
                            </div>
                            <Button onClick={fetchAllData} variant="outline">
                                <Shield className="mr-2 h-4 w-4" />
                                Check Again
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>Roles & Permissions - PetroPro</title>
                <meta name="description" content="Manage user roles and their permissions." />
            </Helmet>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Role</CardTitle>
                        <CardDescription>Create a new role to assign specific permissions.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        <Input placeholder="Enter new role name (e.g., Accountant)" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} />
                        <Button onClick={handleAddRole}><Plus className="mr-2 h-4 w-4" /> Add Role</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Roles</CardTitle>
                        <CardDescription>Edit role names and manage their permissions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={roles} />
                    </CardContent>
                </Card>
            </motion.div>
            <Dialog open={!!managingPermissionsFor} onOpenChange={(isOpen) => !isOpen && setManagingPermissionsFor(null)}>
                {managingPermissionsFor && (
                    <PermissionManager
                        role={managingPermissionsFor}
                        availablePermissions={permissions}
                        onSave={handleSavePermissions}
                        onClose={() => setManagingPermissionsFor(null)}
                    />
                )}
            </Dialog>
        </>
    );
};

export default RolesPermissionsPage;