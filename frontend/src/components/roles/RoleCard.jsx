import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, Shield, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const RoleCard = ({
    role,
    permissions = [],
    onEdit,
    onDelete,
    onManagePermissions,
    isEditing = false,
    editingRole,
    onSaveEdit,
    onCancelEdit,
    onUpdateEdit
}) => {
    const rolePermissions = permissions.filter(p => role.permissions?.includes(p.id));
    const permissionCount = rolePermissions.length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group"
        >
            <Card className="premium-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-all duration-300">
                                {role.name?.charAt(0).toUpperCase() || 'R'}
                            </div>
                            <div>
                                {isEditing && editingRole?.id === role.id ? (
                                    <input
                                        type="text"
                                        value={editingRole.name}
                                        onChange={(e) => onUpdateEdit({ ...editingRole, name: e.target.value })}
                                        className="text-xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-purple-500"
                                        autoFocus
                                    />
                                ) : (
                                    <h3 className="text-xl font-bold text-foreground group-hover:text-blue-600 transition-colors">
                                        {role.name}
                                    </h3>
                                )}
                                <div className="flex items-center space-x-2 mt-1">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        {permissionCount} permission{permissionCount !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            {isEditing && editingRole?.id === role.id ? (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={onSaveEdit}
                                        className="hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={onCancelEdit}
                                        className="hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </Button>
                                </>
                            ) : (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="h-10 w-10 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-muted/50"
                                        >
                                            <MoreHorizontal className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuItem
                                            onClick={() => onEdit(role)}
                                            className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                                        >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Role
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => onManagePermissions(role)}
                                            className="hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                                        >
                                            <Shield className="mr-2 h-4 w-4" />
                                            Manage Permissions
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-destructive hover:bg-red-50 transition-all duration-200"
                                            onClick={() => onDelete(role.id)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Role
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>

                    {/* Permissions Preview */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Permissions</span>
                            <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
                                {permissionCount}
                            </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {rolePermissions.slice(0, 3).map(permission => (
                                <Badge
                                    key={permission.id}
                                    variant="outline"
                                    className="text-xs bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200"
                                >
                                    {permission.name}
                                </Badge>
                            ))}
                            {permissionCount > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{permissionCount - 3} more
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default RoleCard;