import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import useLocalStorage from '@/hooks/useLocalStorage';
import useAuth from '@/hooks/useAuth';
import { ShieldCheck } from 'lucide-react';

const allPermissions = [
    { id: 'dashboard.view', label: 'View Dashboard' },
    { id: 'master.view', label: 'View Master' },
    { id: 'master.edit', label: 'Edit Master Data' },
    { id: 'day_business.view', label: 'View Day Business' },
    { id: 'day_business.edit', label: 'Edit Day Business' },
    { id: 'invoice.view', label: 'View Invoices' },
    { id: 'invoice.create', label: 'Create Invoices' },
    { id: 'reports.view', label: 'View Reports' },
    { id: 'permissions.manage', label: 'Manage Permissions' },
];

const PermissionsPage = () => {
    const { user } = useAuth(); // Changed from mockUsers
    const [roles, setRoles] = useLocalStorage('userRoles', []);
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
        const initialPermissions = {};
        roles.forEach(role => {
            initialPermissions[role.name] = role.permissions || [];
        });
        setPermissions(initialPermissions);
    }, [roles]);

    const { toast } = useToast();

    const handlePermissionChange = (roleName, permissionId, checked) => {
        setPermissions(prev => {
            const newPermissions = new Set(prev[roleName] || []);
            if (checked) {
                newPermissions.add(permissionId);
            } else {
                newPermissions.delete(permissionId);
            }
            return { ...prev, [roleName]: Array.from(newPermissions) };
        });
    };

    const handleSave = () => {
        const updatedRoles = roles.map(role => ({
            ...role,
            permissions: permissions[role.name] || [],
        }));
        setRoles(updatedRoles);
        toast({
            title: "Permissions Saved!",
            description: "User role permissions have been updated.",
        });
    };

    if (user?.role !== 'Super Admin') {
        return (
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }
    
    return (
        <>
            <Helmet>
                <title>Manage Permissions - PetroPro</title>
                <meta name="description" content="Configure user role permissions." />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <ShieldCheck className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold">User Permissions</h1>
                </div>

                <Card>
                    <CardHeader className="form-section-header">
                        <CardTitle className="text-white">Role Permission Matrix</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="p-4 text-left font-semibold">Permission</th>
                                        {roles.map(role => (
                                            <th key={role.id} className="p-4 text-center font-semibold">{role.name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {allPermissions.map(permission => (
                                        <tr key={permission.id} className="border-b">
                                            <td className="p-4 font-medium">{permission.label}</td>
                                            {roles.map(role => (
                                                <td key={role.id} className="p-4 text-center">
                                                    <Checkbox
                                                        checked={permissions[role.name]?.includes(permission.id)}
                                                        onCheckedChange={(checked) => handlePermissionChange(role.name, permission.id, checked)}
                                                        disabled={role.name === 'Super Admin'}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex justify-end mt-6">
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            </motion.div>
        </>
    );
};

export default PermissionsPage;