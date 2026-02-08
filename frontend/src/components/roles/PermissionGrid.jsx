import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, X, Copy, Save, Users, Calculator, FileText, CreditCard } from 'lucide-react';
import PermissionTemplates from './PermissionTemplates';

const PermissionGrid = ({
    permissions = [],
    selectedPermissions = [],
    onTogglePermission,
    onApplyTemplate,
    loading = false,
    title = "Available Permissions",
    description = "Select the permissions to grant to this role"
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [activeTab, setActiveTab] = useState('permissions');
    const getPermissionDescription = (permissionName) => {
        const descriptions = {
            'dashboard.view': 'Access to main dashboard and overview',
            'dashboard.edit': 'Can modify dashboard settings and layout',
            'master.view': 'View master data (products, vendors, etc.)',
            'master.edit': 'Create and modify master data',
            'day_business.view': 'View daily business operations',
            'day_business.edit': 'Manage daily business entries',
            'invoice.view': 'View and print invoices',
            'invoice.create': 'Create new invoices',
            'reports.view': 'Access to all reports',
            'reports.create': 'Generate custom reports',
            'permissions.manage': 'Manage user roles and permissions',
            'settings.view': 'Access application settings',
            'settings.edit': 'Modify application settings',
            'super_admin.view': 'Full system administration access'
        };
        return descriptions[permissionName] || 'Permission for this functionality';
    };

    const getPermissionCategory = (permissionName) => {
        if (permissionName.includes('dashboard')) return 'Dashboard';
        if (permissionName.includes('master')) return 'Master Data';
        if (permissionName.includes('day_business')) return 'Daily Business';
        if (permissionName.includes('invoice')) return 'Invoices';
        if (permissionName.includes('reports')) return 'Reports';
        if (permissionName.includes('permissions') || permissionName.includes('admin')) return 'Administration';
        if (permissionName.includes('settings')) return 'Settings';
        return 'General';
    };

    // Filter permissions based on search term and category
    const filteredPermissions = permissions.filter(permission => {
        const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             getPermissionDescription(permission.name).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || getPermissionCategory(permission.name) === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
        const category = getPermissionCategory(permission.name);
        if (!acc[category]) acc[category] = [];
        acc[category].push(permission);
        return acc;
    }, {});

    // Get unique categories for filter dropdown
    const categories = ['all', ...new Set(permissions.map(p => getPermissionCategory(p.name)))];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="text-sm text-muted-foreground">Loading permissions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {title}
                </h3>
                <p className="text-muted-foreground">{description}</p>
            </div>

            {/* Search and Filter Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200"
            >
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search permissions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                        {searchTerm && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSearchTerm('')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-48 bg-white border-gray-200">
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.filter(cat => cat !== 'all').map(category => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </motion.div>

            {/* Tabs for Permissions and Templates */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted">
                    <TabsTrigger value="permissions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Individual Permissions
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Permission Templates
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="permissions" className="space-y-4">
                    <div className="space-y-4">
                        {Object.entries(groupedPermissions).length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-12"
                            >
                                <div className="text-muted-foreground">
                                    {searchTerm || selectedCategory !== 'all' ? (
                                        <>
                                            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No permissions found matching your search.</p>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    setSelectedCategory('all');
                                                }}
                                                className="mt-2"
                                            >
                                                Clear Filters
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <p>No permissions available.</p>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                           Object.entries(groupedPermissions).map(([categoryKey, categoryPermissions]) => {
                               const IconComponent = category.icon;
                               const isExpanded = expandedCategories.has(categoryKey);
                               const permissionCount = getCategoryPermissionCount(categoryKey);
                               const totalPermissions = category.permissions.length;
                               const allSelected = permissionCount === totalPermissions;
                               const someSelected = permissionCount > 0 && permissionCount < totalPermissions;

                               return (
                                   <motion.div
                                       key={categoryKey}
                                       initial={{ opacity: 0, y: 20 }}
                                       animate={{ opacity: 1, y: 0 }}
                                       transition={{ duration: 0.3 }}
                                       className="border border-border rounded-lg overflow-hidden"
                                   >
                                       <Collapsible open={isExpanded} onOpenChange={() => toggleCategory(categoryKey)}>
                                           <CollapsibleTrigger asChild>
                                               <Button
                                                   variant="ghost"
                                                   className="w-full p-4 hover:bg-muted/50 transition-all duration-200 justify-between"
                                               >
                                                   <div className="flex items-center space-x-3">
                                                       <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg`}>
                                                           <IconComponent className="h-5 w-5 text-white" />
                                                       </div>
                                                       <div className="text-left">
                                                           <h4 className="font-semibold text-foreground">{category.name}</h4>
                                                           <p className="text-xs text-muted-foreground">{category.description}</p>
                                                       </div>
                                                   </div>
                                                   <div className="flex items-center space-x-3">
                                                       <Badge variant="secondary" className="bg-muted">
                                                           {permissionCount}/{totalPermissions}
                                                       </Badge>
                                                       <div className="flex items-center space-x-2">
                                                           <Button
                                                               variant="ghost"
                                                               size="sm"
                                                               onClick={(e) => {
                                                                   e.stopPropagation();
                                                                   selectAllInCategory(categoryKey);
                                                               }}
                                                               className="h-8 w-8 p-0"
                                                           >
                                                               {allSelected ? (
                                                                   <CheckSquare className="h-4 w-4 text-green-500" />
                                                               ) : someSelected ? (
                                                                   <div className="h-4 w-4 border-2 border-blue-500 rounded-sm bg-blue-500/20" />
                                                               ) : (
                                                                   <Square className="h-4 w-4 text-muted-foreground" />
                                                               )}
                                                           </Button>
                                                           {isExpanded ? (
                                                               <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                           ) : (
                                                               <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                           )}
                                                       </div>
                                                   </div>
                                               </Button>
                                           </CollapsibleTrigger>
                                           <CollapsibleContent>
                                               <div className="p-4 space-y-3 bg-muted/20">
                                                   {categoryPermissions.map((permission) => (
                                                       <motion.div
                                                           key={permission.id}
                                                           initial={{ opacity: 0, x: -20 }}
                                                           animate={{ opacity: 1, x: 0 }}
                                                           transition={{ duration: 0.2 }}
                                                           className="flex items-start space-x-3 p-3 rounded-lg hover:bg-background transition-colors"
                                                       >
                                                           <Checkbox
                                                               id={`perm-${permission.id}`}
                                                               checked={selectedPermissions.includes(permission.id)}
                                                               onCheckedChange={() => onTogglePermission(permission.id)}
                                                               className="mt-1 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500"
                                                           />
                                                           <div className="flex-1 min-w-0">
                                                               <label
                                                                   htmlFor={`perm-${permission.id}`}
                                                                   className="text-sm font-medium text-foreground cursor-pointer block"
                                                               >
                                                                   {permission.name}
                                                               </label>
                                                               <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                                                   {getPermissionDescription(permission.name)}
                                                               </p>
                                                           </div>
                                                       </motion.div>
                                                   ))}
                                               </div>
                                           </CollapsibleContent>
                                       </Collapsible>
                                   </motion.div>
                               );
                           })
                       )}
                   </div>

                   {/* Summary */}
                   <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.3, delay: 0.5 }}
                       className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200"
                   >
                       <div className="flex items-center justify-between">
                           <span className="text-sm font-medium text-blue-800">
                               Selected Permissions
                           </span>
                           <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                               {selectedPermissions.length} of {filteredPermissions.length}
                           </Badge>
                       </div>
                   </motion.div>
               </TabsContent>

               <TabsContent value="templates" className="mt-6">
                   <PermissionTemplates
                       onApplyTemplate={onApplyTemplate}
                       appliedPermissions={selectedPermissions}
                   />
               </TabsContent>
           </Tabs>
       </div>
   );
};

export default PermissionGrid;