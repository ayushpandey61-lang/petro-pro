import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ShieldCheck, Plus, Trash2, Edit, Save, X, Settings, Loader2 } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { apiClient } from '@/lib/api';

const allPermissionsList = [
  'dashboard.view', 'master.view', 'master.edit', 'day_business.view', 'day_business.edit', 
  'invoice.view', 'invoice.create', 'reports.view', 'permissions.manage', 'settings.view',
  'super_admin.view'
];

const PermissionManager = ({ role, availablePermissions, onSave }) => {
    const [assignedPermissions, setAssignedPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPermissions = async () => {
            setLoading(true);
            try {
                const data = await apiClient.request(`/admin/roles/${role.id}/permissions`);
                setAssignedPermissions(data.map(p => p.id));
            } catch (error) {
                console.error('Error fetching permissions:', error);
                setAssignedPermissions([]);
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
        onSave(assignedPermissions);
    };

    return (
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
            <DialogHeader className="space-y-3 pb-4 border-b border-gradient-to-r from-blue-500/20 to-purple-500/20">
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Manage Permissions for {role.name}
                </DialogTitle>
                <p className="text-base text-muted-foreground">
                    Select the permissions to grant to this role. Changes will be applied immediately.
                </p>
            </DialogHeader>
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                        <p className="text-sm text-muted-foreground">Loading permissions...</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availablePermissions.map(p => (
                            <div key={p.id} className="group">
                                <div className="premium-card p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                                    <div className="flex items-start space-x-3">
                                        <Checkbox
                                            id={`perm-${p.id}`}
                                            checked={assignedPermissions.includes(p.id)}
                                            onCheckedChange={() => handleToggle(p.id)}
                                            className="mt-1 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <label
                                                htmlFor={`perm-${p.id}`}
                                                className="text-sm font-semibold text-foreground group-hover:text-blue-600 transition-colors cursor-pointer block"
                                            >
                                                {p.name}
                                            </label>
                                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                                {p.description || (
                                                    p.name.includes('view') ? 'Read-only access to this module' :
                                                    p.name.includes('edit') ? 'Full read and write access to this module' :
                                                    p.name.includes('create') ? 'Can create new records in this module' :
                                                    p.name.includes('manage') ? 'Administrative access including user management' :
                                                    'Special permission for this functionality'
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <DialogFooter className="pt-4 border-t border-gradient-to-r from-blue-500/20 to-purple-500/20">
                <DialogClose asChild>
                    <Button
                        variant="outline"
                        className="hover:bg-muted/50 transition-all duration-200"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </DialogClose>
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    <Save className="mr-2 h-4 w-4" />
                    Save Permissions
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};

const RolePermissionPage = () => {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newRole, setNewRole] = useState('');
    const [editingRole, setEditingRole] = useState(null);
    const [managingPermissionsFor, setManagingPermissionsFor] = useState(null);
    const { toast } = useToast();

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        try {
            const [rolesData, permsData] = await Promise.all([
                apiClient.request('/admin/roles'),
                apiClient.request('/admin/permissions')
            ]);

            setRoles(rolesData || []);
            setPermissions(permsData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast({
                title: "Error fetching data",
                description: error.message || "An unexpected error occurred while fetching data.",
                variant: "destructive"
            });
            setRoles([]);
            setPermissions([]);
        }
        setLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const addRole = async () => {
        if (!newRole.trim()) {
            toast({ title: "Error", description: "Role name is required.", variant: "destructive" });
            return;
        }

        try {
            await apiClient.request('/admin/roles', {
                method: 'POST',
                body: JSON.stringify({ name: newRole.trim() })
            });

            toast({ title: "Success", description: "Role added successfully." });
            setNewRole('');
            fetchAllData();
        } catch (error) {
            console.error('Error adding role:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to add role.",
                variant: "destructive"
            });
        }
    };

    const startEdit = (role) => setEditingRole({ ...role });
    const cancelEdit = () => setEditingRole(null);

    const saveEdit = async () => {
        if (!editingRole) return;

        try {
            await apiClient.request(`/admin/roles/${editingRole.id}`, {
                method: 'PUT',
                body: JSON.stringify({ name: editingRole.name })
            });

            toast({ title: "Success", description: "Role updated successfully." });
            setEditingRole(null);
            fetchAllData();
        } catch (error) {
            console.error('Error updating role:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to update role.",
                variant: "destructive"
            });
        }
    };

    const deleteRole = async (id) => {
        try {
            await apiClient.request(`/admin/roles/${id}`, {
                method: 'DELETE'
            });

            toast({ title: "Success", description: "Role deleted successfully." });
            fetchAllData();
        } catch (error) {
            console.error('Error deleting role:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to delete role.",
                variant: "destructive"
            });
        }
    };

    const savePermissions = async (newPermissions) => {
        if (!managingPermissionsFor) return;

        try {
            await apiClient.request(`/admin/roles/${managingPermissionsFor.id}/permissions`, {
                method: 'PUT',
                body: JSON.stringify({ permissionIds: newPermissions })
            });

            toast({ title: "Success", description: "Permissions updated successfully." });
            setManagingPermissionsFor(null);
            fetchAllData();
        } catch (error) {
            console.error('Error updating permissions:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to update permissions.",
                variant: "destructive"
            });
        }
    };

    const columns = [
        { accessorKey: "name", header: "Role Name", cell: ({ row }) => {
            const role = row.original;
            if (editingRole && editingRole.id === role.id) {
                return <Input
                    value={editingRole.name}
                    onChange={(e) => setEditingRole({...editingRole, name: e.target.value})}
                    className="h-10 text-base font-medium"
                />;
            }
            return (
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                        {role.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-lg text-foreground">{role.name}</span>
                </div>
            );
        }},
        { accessorKey: "permissions", header: "Permissions", cell: ({ row }) => {
            // For API-based data, we need to fetch permissions separately or calculate from role_permissions
            const role = row.original;
            const count = role.permissions?.length || 0;
            return (
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        {count}
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {count === 0 ? 'No permissions' : count === 1 ? '1 permission' : `${count} permissions`}
                    </span>
                </div>
            );
        }},
        { id: "actions", cell: ({ row }) => {
            const role = row.original;
            if (editingRole && editingRole.id === role.id) {
                return (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={saveEdit}
                            className="hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                        >
                            <Save className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={cancelEdit}
                            className="hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                );
            }
            return (
                <Dialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-10 w-10 p-0 hover:bg-muted/50 transition-all duration-200"
                            >
                                <Settings className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem
                                onClick={() => startEdit(role)}
                                className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DialogTrigger asChild>
                                <DropdownMenuItem
                                    onClick={() => setManagingPermissionsFor(role)}
                                    className="hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                                >
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    Permissions
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuItem
                                className="text-destructive hover:bg-red-50 transition-all duration-200"
                                onClick={() => deleteRole(role.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {managingPermissionsFor && managingPermissionsFor.id === role.id && (
                        <PermissionManager
                            role={managingPermissionsFor}
                            availablePermissions={permissions}
                            onSave={savePermissions}
                        />
                    )}
                </Dialog>
            );
        }}
    ];

    if (loading) {
        return (
            <>
                <Helmet>
                    <title>Role & Permission - PetroPro</title>
                    <meta name="description" content="Manage user roles and their permissions." />
                </Helmet>
                <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <p className="text-lg text-muted-foreground">Loading roles and permissions...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>Role & Permission - PetroPro</title>
                <meta name="description" content="Manage user roles and their permissions." />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6"
            >
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Hero Section */}
                    <div className="text-center space-y-4 py-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg mb-6">
                            <ShieldCheck className="h-10 w-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Role & Permission Management
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Manage user roles and their access permissions with powerful, granular control.
                        </p>
                    </div>

                    {/* Add New Role Section */}
                    <div className="premium-card p-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                                <Plus className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">Add New Role</h2>
                                <p className="text-muted-foreground">Create a new role to assign specific permissions.</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                            <Input
                                placeholder="Enter new role name (e.g., Accountant)"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="flex-1 h-12 text-base"
                                disabled={loading}
                            />
                            <Button
                                onClick={addRole}
                                disabled={loading || !newRole.trim()}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-8"
                            >
                                <Plus className="mr-2 h-5 w-5" />
                                Add Role
                            </Button>
                        </div>
                    </div>

                    {/* Manage Roles Section */}
                    <div className="premium-card p-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                                <ShieldCheck className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">Manage Roles</h2>
                                <p className="text-muted-foreground">Edit role names and manage their permissions.</p>
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <DataTable columns={columns} data={roles} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default RolePermissionPage;