import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Shield, Settings, FileText, Calculator, CreditCard } from 'lucide-react';

const PermissionTemplates = ({ onApplyTemplate, appliedPermissions = [] }) => {
    const templates = [
        {
            id: 'super_admin',
            name: 'Super Administrator',
            icon: Shield,
            color: 'from-red-500 to-rose-500',
            description: 'Full system access with all permissions',
            permissionCount: 150,
            permissions: [
                'dashboard.view', 'dashboard.edit', 'dashboard.export', 'dashboard.configure',
                'master.view', 'master.edit', 'master.delete', 'master.import', 'master.export',
                'employees.view', 'employees.create', 'employees.edit', 'employees.delete', 'employees.salary', 'employees.attendance',
                'products.view', 'products.create', 'products.edit', 'products.delete', 'products.categories', 'products.inventory', 'products.pricing',
                'fuel_products.view', 'fuel_products.create', 'fuel_products.edit', 'fuel_products.delete', 'fuel_products.rates', 'fuel_products.tanks',
                'lubricants.view', 'lubricants.create', 'lubricants.edit', 'lubricants.delete', 'lubricants.stock', 'lubricants.purchase',
                'customers.view', 'customers.create', 'customers.edit', 'customers.delete', 'customers.credit', 'customers.statements',
                'vendors.view', 'vendors.create', 'vendors.edit', 'vendors.delete', 'vendors.payments', 'vendors.statements',
                'tanks.view', 'tanks.create', 'tanks.edit', 'tanks.delete', 'tanks.dip', 'tanks.calibration',
                'nozzles.view', 'nozzles.create', 'nozzles.edit', 'nozzles.delete', 'nozzles.assign', 'nozzles.maintenance',
                'day_business.view', 'day_business.edit', 'day_business.approve', 'day_business.delete',
                'shifts.view', 'shifts.create', 'shifts.edit', 'shifts.delete', 'shifts.assign', 'shifts.reports',
                'opening_stock.view', 'opening_stock.create', 'opening_stock.edit', 'opening_stock.approve',
                'daily_sales.view', 'daily_sales.create', 'daily_sales.edit', 'daily_sales.delete', 'daily_sales.rates', 'daily_sales.reports',
                'credit_sales.view', 'credit_sales.create', 'credit_sales.edit', 'credit_sales.delete', 'credit_sales.approve', 'credit_sales.limits',
                'cash_sales.view', 'cash_sales.create', 'cash_sales.edit', 'cash_sales.delete', 'cash_sales.receipts',
                'expenses.view', 'expenses.create', 'expenses.edit', 'expenses.delete', 'expenses.approve', 'expenses.categories',
                'recovery.view', 'recovery.create', 'recovery.edit', 'recovery.delete',
                'swipe.view', 'swipe.create', 'swipe.edit', 'swipe.delete', 'swipe.reconcile',
                'cash_recovery.view', 'cash_recovery.create', 'cash_recovery.edit', 'cash_recovery.approve',
                'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.delete', 'invoices.print', 'invoices.email',
                'sales_invoices.view', 'sales_invoices.create', 'sales_invoices.edit', 'sales_invoices.delete', 'sales_invoices.discount',
                'purchase_invoices.view', 'purchase_invoices.create', 'purchase_invoices.edit', 'purchase_invoices.delete', 'purchase_invoices.approve',
                'liquid_purchases.view', 'liquid_purchases.create', 'liquid_purchases.edit', 'liquid_purchases.approve',
                'lube_purchases.view', 'lube_purchases.create', 'lube_purchases.edit', 'lube_purchases.approve',
                'invoice_templates.view', 'invoice_templates.create', 'invoice_templates.edit', 'invoice_templates.delete',
                'reports.view', 'reports.create', 'reports.edit', 'reports.delete', 'reports.export', 'reports.schedule', 'reports.share',
                'reports.financial.view', 'reports.financial.create', 'reports.financial.export',
                'reports.sales.view', 'reports.sales.create', 'reports.sales.export',
                'reports.inventory.view', 'reports.inventory.create', 'reports.inventory.export',
                'reports.customers.view', 'reports.customers.create', 'reports.customers.export',
                'reports.vendors.view', 'reports.vendors.create', 'reports.vendors.export',
                'reports.daily.view', 'reports.daily.create', 'reports.daily.export',
                'reports.shifts.view', 'reports.shifts.create', 'reports.shifts.export',
                'settings.view', 'settings.edit', 'settings.delete',
                'settings.firm.view', 'settings.firm.edit', 'settings.firm.logo',
                'settings.users.view', 'settings.users.create', 'settings.users.edit', 'settings.users.delete', 'settings.users.roles', 'settings.users.password',
                'settings.appearance.view', 'settings.appearance.edit', 'settings.appearance.themes',
                'settings.notifications.view', 'settings.notifications.edit', 'settings.notifications.test',
                'super_admin.view', 'super_admin.edit', 'super_admin.delete',
                'admin.system.view', 'admin.system.edit', 'admin.system.backup', 'admin.system.restore', 'admin.system.logs',
                'admin.database.view', 'admin.database.edit', 'admin.database.backup', 'admin.database.restore', 'admin.database.optimize',
                'admin.security.view', 'admin.security.edit', 'admin.security.logs', 'admin.security.threats',
                'admin.roles.view', 'admin.roles.create', 'admin.roles.edit', 'admin.roles.delete', 'admin.roles.assign',
                'admin.organization.view', 'admin.organization.edit', 'admin.organization.users', 'admin.organization.bunks',
                'calculators.view', 'calculators.scientific', 'calculators.programmer', 'calculators.graphing', 'calculators.unit_converter', 'calculators.currency',
                'id_cards.view', 'id_cards.create', 'id_cards.edit', 'id_cards.print',
                'attendance.view', 'attendance.create', 'attendance.edit', 'attendance.reports', 'attendance.biometric',
                'credit.view', 'credit.create', 'credit.edit', 'credit.approve', 'credit.reports',
                'transactions.view', 'transactions.create', 'transactions.edit', 'transactions.delete', 'transactions.reconcile',
                'vendor_transactions.view', 'vendor_transactions.create', 'vendor_transactions.edit', 'vendor_transactions.reconcile',
                'miscellaneous.view', 'miscellaneous.feedback', 'miscellaneous.alerts', 'miscellaneous.announcements',
                'tank_dip.view', 'tank_dip.create', 'tank_dip.edit', 'tank_dip.calculator',
                'print_templates.view', 'print_templates.create', 'print_templates.edit', 'print_templates.delete',
                'business_flow.view', 'business_flow.create', 'business_flow.export',
                'dsr_reports.view', 'dsr_reports.create', 'dsr_reports.edit',
                'density_reports.view', 'density_reports.create', 'density_reports.edit',
                'stock.view', 'stock.edit', 'stock.reports', 'stock.alerts', 'stock.valuation',
                'losses.view', 'losses.create', 'losses.edit', 'losses.reports',
                'min_stock.view', 'min_stock.edit', 'min_stock.alerts',
                'expiry.view', 'expiry.create', 'expiry.edit', 'expiry.alerts', 'expiry.reports'
            ]
        },
        {
            id: 'manager',
            name: 'Manager',
            icon: UserCheck,
            color: 'from-blue-500 to-indigo-500',
            description: 'Management level access with operational and supervisory permissions',
            permissionCount: 85,
            permissions: [
                'dashboard.view', 'dashboard.edit', 'dashboard.export',
                'master.view', 'master.edit', 'master.export',
                'employees.view', 'employees.create', 'employees.edit', 'employees.attendance',
                'products.view', 'products.create', 'products.edit', 'products.categories', 'products.inventory', 'products.pricing',
                'fuel_products.view', 'fuel_products.create', 'fuel_products.edit', 'fuel_products.rates',
                'lubricants.view', 'lubricants.create', 'lubricants.edit', 'lubricants.stock',
                'customers.view', 'customers.create', 'customers.edit', 'customers.credit', 'customers.statements',
                'vendors.view', 'vendors.create', 'vendors.edit', 'vendors.payments', 'vendors.statements',
                'tanks.view', 'tanks.create', 'tanks.edit', 'tanks.dip',
                'nozzles.view', 'nozzles.create', 'nozzles.edit', 'nozzles.assign',
                'day_business.view', 'day_business.edit', 'day_business.approve',
                'shifts.view', 'shifts.create', 'shifts.edit', 'shifts.assign', 'shifts.reports',
                'opening_stock.view', 'opening_stock.create', 'opening_stock.edit', 'opening_stock.approve',
                'daily_sales.view', 'daily_sales.create', 'daily_sales.edit', 'daily_sales.rates', 'daily_sales.reports',
                'credit_sales.view', 'credit_sales.create', 'credit_sales.edit', 'credit_sales.approve', 'credit_sales.limits',
                'cash_sales.view', 'cash_sales.create', 'cash_sales.edit', 'cash_sales.receipts',
                'expenses.view', 'expenses.create', 'expenses.edit', 'expenses.approve', 'expenses.categories',
                'recovery.view', 'recovery.create', 'recovery.edit',
                'swipe.view', 'swipe.create', 'swipe.edit', 'swipe.reconcile',
                'cash_recovery.view', 'cash_recovery.create', 'cash_recovery.edit', 'cash_recovery.approve',
                'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.print',
                'sales_invoices.view', 'sales_invoices.create', 'sales_invoices.edit', 'sales_invoices.discount',
                'purchase_invoices.view', 'purchase_invoices.create', 'purchase_invoices.edit', 'purchase_invoices.approve',
                'liquid_purchases.view', 'liquid_purchases.create', 'liquid_purchases.edit', 'liquid_purchases.approve',
                'lube_purchases.view', 'lube_purchases.create', 'lube_purchases.edit', 'lube_purchases.approve',
                'reports.view', 'reports.create', 'reports.export', 'reports.schedule',
                'reports.financial.view', 'reports.financial.create', 'reports.financial.export',
                'reports.sales.view', 'reports.sales.create', 'reports.sales.export',
                'reports.inventory.view', 'reports.inventory.create', 'reports.inventory.export',
                'reports.customers.view', 'reports.customers.create', 'reports.customers.export',
                'reports.vendors.view', 'reports.vendors.create', 'reports.vendors.export',
                'reports.daily.view', 'reports.daily.create', 'reports.daily.export',
                'reports.shifts.view', 'reports.shifts.create', 'reports.shifts.export',
                'settings.view', 'settings.edit',
                'settings.firm.view', 'settings.firm.edit',
                'settings.users.view', 'settings.users.edit',
                'settings.appearance.view', 'settings.appearance.edit',
                'settings.notifications.view', 'settings.notifications.edit',
                'admin.system.view', 'admin.system.logs',
                'admin.roles.view', 'admin.roles.edit',
                'admin.security.view', 'admin.security.logs'
            ]
        },
        {
            id: 'supervisor',
            name: 'Supervisor',
            icon: Users,
            color: 'from-green-500 to-emerald-500',
            description: 'Supervisory access with operational permissions',
            permissionCount: 45,
            permissions: [
                'dashboard.view', 'dashboard.edit',
                'master.view',
                'employees.view', 'employees.attendance',
                'products.view', 'products.edit', 'products.inventory',
                'fuel_products.view', 'fuel_products.edit',
                'lubricants.view', 'lubricants.edit', 'lubricants.stock',
                'customers.view', 'customers.edit',
                'vendors.view', 'vendors.edit',
                'tanks.view', 'tanks.dip',
                'nozzles.view', 'nozzles.edit',
                'day_business.view', 'day_business.edit',
                'shifts.view', 'shifts.edit', 'shifts.assign',
                'opening_stock.view', 'opening_stock.create', 'opening_stock.edit',
                'daily_sales.view', 'daily_sales.create', 'daily_sales.edit', 'daily_sales.rates',
                'credit_sales.view', 'credit_sales.create', 'credit_sales.edit',
                'cash_sales.view', 'cash_sales.create', 'cash_sales.edit',
                'expenses.view', 'expenses.create', 'expenses.edit',
                'recovery.view', 'recovery.create',
                'swipe.view', 'swipe.create', 'swipe.edit',
                'cash_recovery.view', 'cash_recovery.create',
                'invoices.view', 'invoices.create', 'invoices.print',
                'sales_invoices.view', 'sales_invoices.create', 'sales_invoices.edit',
                'purchase_invoices.view', 'purchase_invoices.create',
                'liquid_purchases.view', 'liquid_purchases.create',
                'lube_purchases.view', 'lube_purchases.create',
                'reports.view', 'reports.create', 'reports.export',
                'reports.sales.view', 'reports.sales.create', 'reports.sales.export',
                'reports.inventory.view', 'reports.inventory.create', 'reports.inventory.export',
                'reports.daily.view', 'reports.daily.create', 'reports.daily.export',
                'reports.shifts.view', 'reports.shifts.create', 'reports.shifts.export',
                'settings.view',
                'settings.firm.view',
                'settings.appearance.view',
                'settings.notifications.view'
            ]
        },
        {
            id: 'operator',
            name: 'Operator',
            icon: UserCheck,
            color: 'from-purple-500 to-indigo-500',
            description: 'Basic operational access for day-to-day tasks',
            permissionCount: 25,
            permissions: [
                'dashboard.view',
                'master.view',
                'employees.view',
                'products.view', 'products.inventory',
                'fuel_products.view',
                'lubricants.view', 'lubricants.stock',
                'customers.view',
                'vendors.view',
                'tanks.view', 'tanks.dip',
                'nozzles.view',
                'day_business.view', 'day_business.edit',
                'shifts.view',
                'opening_stock.view', 'opening_stock.create',
                'daily_sales.view', 'daily_sales.create', 'daily_sales.edit',
                'cash_sales.view', 'cash_sales.create',
                'expenses.view', 'expenses.create',
                'recovery.view', 'recovery.create',
                'swipe.view', 'swipe.create',
                'cash_recovery.view', 'cash_recovery.create',
                'invoices.view', 'invoices.print',
                'sales_invoices.view', 'sales_invoices.create',
                'reports.view',
                'reports.daily.view', 'reports.daily.create',
                'settings.view',
                'settings.firm.view',
                'settings.appearance.view'
            ]
        },
        {
            id: 'accountant',
            name: 'Accountant',
            icon: Calculator,
            color: 'from-emerald-500 to-teal-500',
            description: 'Financial and accounting access with reporting',
            permissionCount: 35,
            permissions: [
                'dashboard.view', 'dashboard.export',
                'master.view',
                'employees.view', 'employees.salary',
                'products.view', 'products.pricing',
                'customers.view', 'customers.edit', 'customers.credit', 'customers.statements',
                'vendors.view', 'vendors.edit', 'vendors.payments', 'vendors.statements',
                'day_business.view',
                'daily_sales.view', 'daily_sales.reports',
                'credit_sales.view', 'credit_sales.edit', 'credit_sales.limits',
                'cash_sales.view',
                'expenses.view', 'expenses.create', 'expenses.edit', 'expenses.approve',
                'recovery.view',
                'cash_recovery.view',
                'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.print',
                'sales_invoices.view', 'sales_invoices.create', 'sales_invoices.edit',
                'purchase_invoices.view', 'purchase_invoices.create', 'purchase_invoices.edit', 'purchase_invoices.approve',
                'liquid_purchases.view', 'liquid_purchases.create',
                'lube_purchases.view', 'lube_purchases.create',
                'reports.view', 'reports.create', 'reports.edit', 'reports.export', 'reports.schedule',
                'reports.financial.view', 'reports.financial.create', 'reports.financial.export',
                'reports.sales.view', 'reports.sales.create', 'reports.sales.export',
                'reports.customers.view', 'reports.customers.create', 'reports.customers.export',
                'reports.vendors.view', 'reports.vendors.create', 'reports.vendors.export',
                'reports.daily.view', 'reports.daily.create', 'reports.daily.export',
                'settings.view', 'settings.edit',
                'settings.firm.view', 'settings.firm.edit',
                'settings.users.view',
                'settings.appearance.view', 'settings.appearance.edit',
                'settings.notifications.view', 'settings.notifications.edit',
                'admin.system.view', 'admin.system.logs',
                'admin.security.view', 'admin.security.logs'
            ]
        },
        {
            id: 'clerk',
            name: 'Data Entry Clerk',
            icon: FileText,
            color: 'from-gray-500 to-slate-500',
            description: 'Limited access for data entry tasks only',
            permissionCount: 15,
            permissions: [
                'dashboard.view',
                'master.view',
                'employees.view',
                'products.view',
                'customers.view',
                'vendors.view',
                'day_business.view', 'day_business.edit',
                'daily_sales.view', 'daily_sales.create',
                'cash_sales.view', 'cash_sales.create',
                'expenses.view', 'expenses.create',
                'invoices.view', 'invoices.print',
                'sales_invoices.view', 'sales_invoices.create',
                'reports.view',
                'reports.daily.view',
                'settings.view',
                'settings.firm.view',
                'settings.appearance.view'
            ]
        }
    ];

    const handleApplyTemplate = (template) => {
        // Convert permission names to IDs
        onApplyTemplate(template.permissions);
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Permission Templates
                </h3>
                <p className="text-muted-foreground">
                    Choose from pre-configured permission templates for common roles
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template, index) => {
                    const IconComponent = template.icon;
                    const isApplied = appliedPermissions.length > 0 &&
                        template.permissions.every(p => appliedPermissions.includes(p));

                    return (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Card className="premium-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02] h-full">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${template.color} flex items-center justify-center shadow-lg`}>
                                            <IconComponent className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{template.name}</CardTitle>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <Badge variant="secondary" className="bg-muted">
                                                    {template.permissionCount} permissions
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        {template.description}
                                    </p>

                                    <div className="space-y-2">
                                        <div className="text-xs font-medium text-muted-foreground">Key Permissions:</div>
                                        <div className="flex flex-wrap gap-1">
                                            {template.permissions.slice(0, 3).map(permission => (
                                                <Badge key={permission} variant="outline" className="text-xs">
                                                    {permission.split('.')[0]}
                                                </Badge>
                                            ))}
                                            {template.permissions.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{template.permissions.length - 3} more
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => handleApplyTemplate(template)}
                                        className={`w-full bg-gradient-to-r ${template.color} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-200`}
                                        disabled={isApplied}
                                    >
                                        {isApplied ? 'Template Applied' : 'Apply Template'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200"
            >
                <div className="text-center">
                    <p className="text-sm text-blue-800">
                        💡 <strong>Tip:</strong> After applying a template, you can still customize individual permissions as needed.
                        Templates provide a quick starting point for common role configurations.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default PermissionTemplates;