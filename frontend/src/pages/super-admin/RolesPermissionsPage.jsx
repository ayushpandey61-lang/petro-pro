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

    // Comprehensive permission structure with CRUD operations
    const permissionModules = [
        {
            category: 'Core System',
            modules: [
                {
                    name: 'Dashboard',
                    key: 'dashboard',
                    permissions: ['access', 'export', 'configure']
                },
                {
                    name: 'Settings',
                    key: 'settings',
                    permissions: ['view', 'edit', 'manage']
                }
            ]
        },
        {
            category: 'Master Data',
            modules: [
                {
                    name: 'Fuel Product',
                    key: 'fuel_product',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Lubricants',
                    key: 'lubricants',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Employee',
                    key: 'employee',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Credit Party',
                    key: 'credit_party',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Vendor',
                    key: 'vendor',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Tank & Nozzle',
                    key: 'tank_nozzle',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Pump Setting',
                    key: 'pump_setting',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Expenses Type',
                    key: 'expenses_type',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Business Cr/Debit Parties',
                    key: 'business_parties',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Swipe Machine',
                    key: 'swipe_machine',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Expiry Item',
                    key: 'expiry_item',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Duty Pay Shift',
                    key: 'duty_shift',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Print Template',
                    key: 'print_template',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Guest Customer',
                    key: 'guest_customer',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Denomination',
                    key: 'denomination',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Tank Lorry Management',
                    key: 'tank_lorry',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                }
            ]
        },
        {
            category: 'Daily Business',
            modules: [
                {
                    name: 'Day Assigning',
                    key: 'day_assigning',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Daily Sale Rate',
                    key: 'daily_sale_rate',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Sale Entry',
                    key: 'sale_entry',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Lubricants Sale',
                    key: 'lubricants_sale',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Swipe',
                    key: 'swipe',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Credit Sale',
                    key: 'credit_sale',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Expenses',
                    key: 'expenses',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Recovery',
                    key: 'recovery',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Employee Cash Recovery',
                    key: 'employee_cash_recovery',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Day Opening Stock',
                    key: 'day_opening_stock',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Day Settlement',
                    key: 'day_settlement',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                }
            ]
        },
        {
            category: 'Invoices & Transactions',
            modules: [
                {
                    name: 'Liquid Purchase',
                    key: 'liquid_purchase',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Lube Purchase',
                    key: 'lube_purchase',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Statement Generation',
                    key: 'statement_generation',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Business Transaction',
                    key: 'business_transaction',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Vendor Transaction',
                    key: 'vendor_transaction',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Generate Sales Invoice',
                    key: 'sales_invoice',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                }
            ]
        },
        {
            category: 'Reports & Analytics',
            modules: [
                {
                    name: 'Reports',
                    key: 'reports',
                    permissions: ['access', 'view', 'export', 'generate']
                },
                {
                    name: 'Product Stock',
                    key: 'product_stock',
                    permissions: ['access', 'view', 'export', 'analyze']
                },
                {
                    name: 'Credit Limit Reports',
                    key: 'credit_limit_reports',
                    permissions: ['access', 'view', 'export', 'analyze']
                },
                {
                    name: 'Attendance',
                    key: 'attendance',
                    permissions: ['access', 'view', 'export', 'manage']
                },
                {
                    name: 'Daily Collection Report',
                    key: 'daily_collection_report',
                    permissions: ['access', 'view', 'export', 'generate']
                }
            ]
        },
        {
            category: 'System Administration',
            modules: [
                {
                    name: 'User Management',
                    key: 'user_management',
                    permissions: ['access', 'add', 'update', 'delete', 'view']
                },
                {
                    name: 'Role Permissions',
                    key: 'role_permissions',
                    permissions: ['access', 'manage', 'assign', 'revoke']
                },
                {
                    name: 'Backup Data',
                    key: 'backup_data',
                    permissions: ['access', 'create', 'restore', 'delete']
                },
                {
                    name: 'System Settings',
                    key: 'system_settings',
                    permissions: ['access', 'configure', 'manage', 'audit']
                }
            ]
        }
    ];

    useEffect(() => {
        const fetchPermissions = async () => {
            setLoading(true);
            try {
                const data = await apiClient.request(`/admin/roles/${role.id}/permissions`);
                setAssignedPermissions(data.map(p => p.permission_id));
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

    const handleModulePermissionToggle = (moduleKey, permissionType, checked) => {
        const permissionId = `${moduleKey}.${permissionType}`;
        handleToggle(permissionId);
    };

    const getModulePermissions = (moduleKey) => {
        const allPermissions = assignedPermissions.filter(p => p.startsWith(`${moduleKey}.`));
        return {
            access: allPermissions.some(p => p.includes('access')),
            add: allPermissions.some(p => p.includes('add') || p.includes('create')),
            update: allPermissions.some(p => p.includes('update') || p.includes('edit')),
            delete: allPermissions.some(p => p.includes('delete')),
            view: allPermissions.some(p => p.includes('view'))
        };
    };

    const handleSave = () => {
        onSave(role.id, assignedPermissions);
    };

    return (
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
            <DialogHeader className="space-y-3 pb-4 border-b border-gradient-to-r from-blue-500/20 to-purple-500/20">
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Manage Permissions for {role.name}
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                    Select the permissions to grant to this role. Changes will be applied immediately.
                </DialogDescription>
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
                    {permissionModules.map((category) => (
                        <div key={category.category} className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                    <Shield className="h-4 w-4 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground">{category.category}</h3>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {category.modules.map((module) => {
                                    const modulePermissions = getModulePermissions(module.key);
                                    return (
                                        <div key={module.key} className="premium-card p-6 hover:shadow-lg transition-all duration-300">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-base font-semibold text-foreground">{module.name}</h4>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs text-muted-foreground">Permissions:</span>
                                                    <div className="flex space-x-1">
                                                        {Object.values(modulePermissions).filter(Boolean).length > 0 && (
                                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                        )}
                                                        <span className="text-xs font-medium text-green-600">
                                                            {Object.values(modulePermissions).filter(Boolean).length}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                {module.permissions.map((permissionType) => {
                                                    const permissionId = `${module.key}.${permissionType}`;
                                                    const isChecked = assignedPermissions.includes(permissionId);
                                                    return (
                                                        <div key={permissionType} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                                            <Checkbox
                                                                id={`${module.key}-${permissionType}`}
                                                                checked={isChecked}
                                                                onCheckedChange={() => handleModulePermissionToggle(module.key, permissionType, !isChecked)}
                                                                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500"
                                                            />
                                                            <label
                                                                htmlFor={`${module.key}-${permissionType}`}
                                                                className="text-xs font-medium text-foreground cursor-pointer capitalize"
                                                            >
                                                                {permissionType === 'access' ? 'Access' :
                                                                 permissionType === 'add' ? 'Add' :
                                                                 permissionType === 'update' ? 'Update' :
                                                                 permissionType === 'delete' ? 'Delete' :
                                                                 permissionType === 'view' ? 'View' :
                                                                 permissionType === 'export' ? 'Export' :
                                                                 permissionType === 'configure' ? 'Configure' :
                                                                 permissionType === 'manage' ? 'Manage' :
                                                                 permissionType === 'create' ? 'Create' :
                                                                 permissionType === 'edit' ? 'Edit' :
                                                                 permissionType === 'generate' ? 'Generate' :
                                                                 permissionType === 'restore' ? 'Restore' :
                                                                 permissionType === 'assign' ? 'Assign' :
                                                                 permissionType === 'revoke' ? 'Revoke' :
                                                                 permissionType === 'audit' ? 'Audit' :
                                                                 permissionType === 'analyze' ? 'Analyze' : permissionType}
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <DialogFooter className="pt-4 border-t border-gradient-to-r from-blue-500/20 to-purple-500/20">
                <Button
                    variant="outline"
                    onClick={onClose}
                    className="hover:bg-muted/50 transition-all duration-200"
                >
                    Cancel
                </Button>
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

    const handleAddRole = async () => {
        if (!newRoleName) return;
        try {
            await apiClient.request('/admin/roles', {
                method: 'POST',
                body: JSON.stringify({ name: newRoleName })
            });
            toast({ title: "Success", description: "Role added." });
            setNewRoleName('');
            fetchAllData();
        } catch (error) {
            console.error('Error adding role:', error);
            toast({
                title: "Error",
                description: error.message || "An unexpected error occurred.",
                variant: "destructive"
            });
        }
    };

    const handleSaveRole = async () => {
        if (!editingRole) return;
        try {
            await apiClient.request(`/admin/roles/${editingRole.id}`, {
                method: 'PUT',
                body: JSON.stringify({ name: editingRole.name })
            });
            toast({ title: "Success", description: "Role updated." });
            setEditingRole(null);
            fetchAllData();
        } catch (error) {
            console.error('Error updating role:', error);
            toast({
                title: "Error",
                description: error.message || "An unexpected error occurred.",
                variant: "destructive"
            });
        }
    };

    const handleDeleteRole = async (roleId) => {
        try {
            await apiClient.request(`/admin/roles/${roleId}`, {
                method: 'DELETE'
            });
            toast({ title: "Success", description: "Role deleted." });
            fetchAllData();
        } catch (error) {
            console.error('Error deleting role:', error);
            toast({
                title: "Error",
                description: error.message || "An unexpected error occurred.",
                variant: "destructive"
            });
        }
    };

    const handleSavePermissions = async (roleId, permissionIds) => {
        try {
            await apiClient.request(`/admin/roles/${roleId}/permissions`, {
                method: 'PUT',
                body: JSON.stringify({ permissionIds })
            });

            toast({ title: "Success", description: "Permissions updated." });
            setManagingPermissionsFor(null);
        } catch (error) {
            console.error('Error saving permissions:', error);
            toast({
                title: "Error",
                description: error.message || "An unexpected error occurred while saving permissions.",
                variant: "destructive"
            });
        }
    };

    const columns = [
        {
            accessorKey: "name",
            header: "Role Name",
            cell: ({ row }) => {
                const role = row.original;
                return (editingRole && editingRole.id === role.id) ? (
                    <Input
                        value={editingRole.name}
                        onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                        autoFocus
                        className="h-10 text-base font-medium"
                    />
                ) : (
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                            {role.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-lg text-foreground">{role.name}</span>
                    </div>
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
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleSaveRole}
                                className="hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                            >
                                <Save className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingRole(null)}
                                className="hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    );
                }
                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-10 w-10 p-0 hover:bg-muted/50 transition-all duration-200"
                                >
                                    <MoreHorizontal className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem
                                    onClick={() => setEditingRole(role)}
                                    className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Name
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setManagingPermissionsFor(role)}
                                    className="hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                                >
                                    <Shield className="mr-2 h-4 w-4" />
                                    Manage Permissions
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive hover:bg-red-50 transition-all duration-200"
                                    onClick={() => handleDeleteRole(role.id)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6"
                >
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Hero Section */}
                        <div className="text-center space-y-4 py-12">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-pink-500 shadow-lg mb-6">
                                <Shield className="h-10 w-10 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                Database Setup Required
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                The roles and permissions system requires database tables that haven't been created yet.
                            </p>
                        </div>

                        {/* Setup Information Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="premium-card p-8 border-l-4 border-l-yellow-500">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                        <Shield className="h-5 w-5 text-yellow-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-yellow-800">Required Database Tables</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                                        <code className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-sm font-mono">roles</code>
                                        <span className="text-sm text-yellow-700">Stores user roles (Super Admin, Manager, etc.)</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                                        <code className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-sm font-mono">permissions</code>
                                        <span className="text-sm text-yellow-700">Stores available permissions (dashboard.view, master.edit, etc.)</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                                        <code className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-sm font-mono">role_permissions</code>
                                        <span className="text-sm text-yellow-700">Links roles to their permissions</span>
                                    </div>
                                </div>
                            </div>

                            <div className="premium-card p-8 border-l-4 border-l-blue-500">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Shield className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-blue-800">Setup Options</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                                        <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                                        <span className="text-sm text-blue-700">Run the database_setup.sql file in your database</span>
                                    </div>
                                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                                        <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                                        <span className="text-sm text-blue-700">Or use the SQL script provided in the project root directory</span>
                                    </div>
                                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                                        <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                                        <span className="text-sm text-blue-700">Alternatively, create the tables manually in your database</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <Button
                                onClick={fetchAllData}
                                variant="outline"
                                size="lg"
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <Shield className="mr-2 h-5 w-5" />
                                Check Again
                            </Button>
                        </div>
                    </div>
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
                            <Shield className="h-10 w-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Roles & Permissions Management
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
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                                className="flex-1 h-12 text-base"
                            />
                            <Button
                                onClick={handleAddRole}
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
                                <Shield className="h-6 w-6 text-white" />
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