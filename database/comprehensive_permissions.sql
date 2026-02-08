-- Comprehensive Permissions for PetroPro Management System
-- This script adds detailed permissions for all modules and sections

-- Insert comprehensive permissions for all application sections
INSERT OR IGNORE INTO permissions (name, description, module) VALUES

-- =============================================================================
-- DASHBOARD MODULE
-- =============================================================================
('dashboard.view', 'View main dashboard and overview statistics', 'dashboard'),
('dashboard.edit', 'Modify dashboard layout and widget configuration', 'dashboard'),
('dashboard.export', 'Export dashboard data and reports', 'dashboard'),
('dashboard.configure', 'Configure dashboard settings and preferences', 'dashboard'),

-- =============================================================================
-- MASTER DATA MODULE
-- =============================================================================
('master.view', 'View all master data (products, vendors, customers, etc.)', 'master'),
('master.edit', 'Create and modify master data records', 'master'),
('master.delete', 'Delete master data records', 'master'),
('master.import', 'Import master data from external files', 'master'),
('master.export', 'Export master data to external formats', 'master'),

-- Employees Management
('employees.view', 'View employee information and details', 'employees'),
('employees.create', 'Add new employees to the system', 'employees'),
('employees.edit', 'Modify employee information and details', 'employees'),
('employees.delete', 'Remove employees from the system', 'employees'),
('employees.salary', 'Manage employee salary information', 'employees'),
('employees.attendance', 'Manage employee attendance records', 'employees'),

-- Products Management
('products.view', 'View product catalog and details', 'products'),
('products.create', 'Add new products to catalog', 'products'),
('products.edit', 'Modify product information and pricing', 'products'),
('products.delete', 'Remove products from catalog', 'products'),
('products.categories', 'Manage product categories and classification', 'products'),
('products.inventory', 'Manage product inventory levels', 'products'),
('products.pricing', 'Manage product pricing and discounts', 'products'),

-- Fuel Products (Petrol-specific)
('fuel_products.view', 'View fuel products and specifications', 'fuel_products'),
('fuel_products.create', 'Add new fuel products', 'fuel_products'),
('fuel_products.edit', 'Modify fuel product details and rates', 'fuel_products'),
('fuel_products.delete', 'Remove fuel products', 'fuel_products'),
('fuel_products.rates', 'Manage fuel pricing and rates', 'fuel_products'),
('fuel_products.tanks', 'Manage fuel tank assignments', 'fuel_products'),

-- Lubricants Management
('lubricants.view', 'View lubricants catalog and stock', 'lubricants'),
('lubricants.create', 'Add new lubricant products', 'lubricants'),
('lubricants.edit', 'Modify lubricant details and pricing', 'lubricants'),
('lubricants.delete', 'Remove lubricant products', 'lubricants'),
('lubricants.stock', 'Manage lubricant inventory', 'lubricants'),
('lubricants.purchase', 'Manage lubricant purchases', 'lubricants'),

-- Customers and Parties
('customers.view', 'View customer and party information', 'customers'),
('customers.create', 'Add new customers and parties', 'customers'),
('customers.edit', 'Modify customer details and credit limits', 'customers'),
('customers.delete', 'Remove customers from system', 'customers'),
('customers.credit', 'Manage customer credit limits and terms', 'customers'),
('customers.statements', 'Generate customer statements and ledgers', 'customers'),

-- Vendors and Suppliers
('vendors.view', 'View vendor and supplier information', 'vendors'),
('vendors.create', 'Add new vendors and suppliers', 'vendors'),
('vendors.edit', 'Modify vendor details and terms', 'vendors'),
('vendors.delete', 'Remove vendors from system', 'vendors'),
('vendors.payments', 'Manage vendor payments and transactions', 'vendors'),
('vendors.statements', 'Generate vendor statements', 'vendors'),

-- Tanks and Storage
('tanks.view', 'View tank information and capacity', 'tanks'),
('tanks.create', 'Add new storage tanks', 'tanks'),
('tanks.edit', 'Modify tank details and calibration', 'tanks'),
('tanks.delete', 'Remove tanks from system', 'tanks'),
('tanks.dip', 'Record and manage tank dip readings', 'tanks'),
('tanks.calibration', 'Calibrate tank measurements', 'tanks'),

-- Nozzles and Pumps
('nozzles.view', 'View nozzle and pump information', 'nozzles'),
('nozzles.create', 'Add new nozzles and pumps', 'nozzles'),
('nozzles.edit', 'Modify nozzle assignments and settings', 'nozzles'),
('nozzles.delete', 'Remove nozzles from system', 'nozzles'),
('nozzles.assign', 'Assign nozzles to tanks and pumps', 'nozzles'),
('nozzles.maintenance', 'Track nozzle maintenance', 'nozzles'),

-- =============================================================================
-- DAY BUSINESS MODULE
-- =============================================================================
('day_business.view', 'View daily business operations', 'day_business'),
('day_business.edit', 'Manage daily business entries', 'day_business'),
('day_business.approve', 'Approve daily business transactions', 'day_business'),
('day_business.delete', 'Delete business entries', 'day_business'),

-- Shift Management
('shifts.view', 'View shift information and assignments', 'shifts'),
('shifts.create', 'Create new shifts', 'shifts'),
('shifts.edit', 'Modify shift details and assignments', 'shifts'),
('shifts.delete', 'Delete shifts', 'shifts'),
('shifts.assign', 'Assign employees to shifts', 'shifts'),
('shifts.reports', 'Generate shift reports', 'shifts'),

-- Opening and Closing Stock
('opening_stock.view', 'View opening stock records', 'opening_stock'),
('opening_stock.create', 'Record opening stock levels', 'opening_stock'),
('opening_stock.edit', 'Modify opening stock entries', 'opening_stock'),
('opening_stock.approve', 'Approve opening stock records', 'opening_stock'),

-- Daily Sales
('daily_sales.view', 'View daily sales records', 'daily_sales'),
('daily_sales.create', 'Record daily sales entries', 'daily_sales'),
('daily_sales.edit', 'Modify sales records', 'daily_sales'),
('daily_sales.delete', 'Delete sales records', 'daily_sales'),
('daily_sales.rates', 'Manage daily sales rates', 'daily_sales'),
('daily_sales.reports', 'Generate sales reports', 'daily_sales'),

-- Credit Sales
('credit_sales.view', 'View credit sales records', 'credit_sales'),
('credit_sales.create', 'Create credit sales entries', 'credit_sales'),
('credit_sales.edit', 'Modify credit sales', 'credit_sales'),
('credit_sales.delete', 'Delete credit sales', 'credit_sales'),
('credit_sales.approve', 'Approve credit sales', 'credit_sales'),
('credit_sales.limits', 'Manage credit limits', 'credit_sales'),

-- Cash Sales
('cash_sales.view', 'View cash sales records', 'cash_sales'),
('cash_sales.create', 'Record cash sales', 'cash_sales'),
('cash_sales.edit', 'Modify cash sales', 'cash_sales'),
('cash_sales.delete', 'Delete cash sales', 'cash_sales'),
('cash_sales.receipts', 'Generate cash receipts', 'cash_sales'),

-- Expenses
('expenses.view', 'View expense records', 'expenses'),
('expenses.create', 'Record business expenses', 'expenses'),
('expenses.edit', 'Modify expense entries', 'expenses'),
('expenses.delete', 'Delete expense records', 'expenses'),
('expenses.approve', 'Approve expense claims', 'expenses'),
('expenses.categories', 'Manage expense categories', 'expenses'),

-- Recovery
('recovery.view', 'View recovery records', 'recovery'),
('recovery.create', 'Record cash recoveries', 'recovery'),
('recovery.edit', 'Modify recovery entries', 'recovery'),
('recovery.delete', 'Delete recovery records', 'recovery'),

-- Swipe Machine Transactions
('swipe.view', 'View card swipe transactions', 'swipe'),
('swipe.create', 'Record swipe transactions', 'swipe'),
('swipe.edit', 'Modify swipe records', 'swipe'),
('swipe.delete', 'Delete swipe transactions', 'swipe'),
('swipe.reconcile', 'Reconcile swipe transactions', 'swipe'),

-- Employee Cash Recovery
('cash_recovery.view', 'View employee cash recovery', 'cash_recovery'),
('cash_recovery.create', 'Record cash recoveries', 'cash_recovery'),
('cash_recovery.edit', 'Modify recovery records', 'cash_recovery'),
('cash_recovery.approve', 'Approve cash recoveries', 'cash_recovery'),

-- =============================================================================
-- INVOICE MODULE
-- =============================================================================
('invoices.view', 'View all invoices', 'invoices'),
('invoices.create', 'Create new invoices', 'invoices'),
('invoices.edit', 'Modify existing invoices', 'invoices'),
('invoices.delete', 'Delete invoices', 'invoices'),
('invoices.print', 'Print invoices and receipts', 'invoices'),
('invoices.email', 'Email invoices to customers', 'invoices'),

-- Sales Invoices
('sales_invoices.view', 'View sales invoices', 'sales_invoices'),
('sales_invoices.create', 'Create sales invoices', 'sales_invoices'),
('sales_invoices.edit', 'Modify sales invoices', 'sales_invoices'),
('sales_invoices.delete', 'Delete sales invoices', 'sales_invoices'),
('sales_invoices.discount', 'Apply discounts to invoices', 'sales_invoices'),

-- Purchase Invoices
('purchase_invoices.view', 'View purchase invoices', 'purchase_invoices'),
('purchase_invoices.create', 'Create purchase invoices', 'purchase_invoices'),
('purchase_invoices.edit', 'Modify purchase invoices', 'purchase_invoices'),
('purchase_invoices.delete', 'Delete purchase invoices', 'purchase_invoices'),
('purchase_invoices.approve', 'Approve purchase invoices', 'purchase_invoices'),

-- Liquid Purchases (Fuel)
('liquid_purchases.view', 'View fuel purchase invoices', 'liquid_purchases'),
('liquid_purchases.create', 'Create fuel purchase invoices', 'liquid_purchases'),
('liquid_purchases.edit', 'Modify fuel purchase invoices', 'liquid_purchases'),
('liquid_purchases.approve', 'Approve fuel purchases', 'liquid_purchases'),

-- Lube Purchases
('lube_purchases.view', 'View lubricant purchase invoices', 'lube_purchases'),
('lube_purchases.create', 'Create lubricant purchase invoices', 'lube_purchases'),
('lube_purchases.edit', 'Modify lubricant purchase invoices', 'lube_purchases'),
('lube_purchases.approve', 'Approve lubricant purchases', 'lube_purchases'),

-- Invoice Templates
('invoice_templates.view', 'View invoice templates', 'invoice_templates'),
('invoice_templates.create', 'Create custom invoice templates', 'invoice_templates'),
('invoice_templates.edit', 'Modify invoice templates', 'invoice_templates'),
('invoice_templates.delete', 'Delete invoice templates', 'invoice_templates'),

-- =============================================================================
-- REPORTS MODULE
-- =============================================================================
('reports.view', 'Access to all reports', 'reports'),
('reports.create', 'Generate custom reports', 'reports'),
('reports.edit', 'Modify existing reports', 'reports'),
('reports.delete', 'Delete saved reports', 'reports'),
('reports.export', 'Export reports to external formats', 'reports'),
('reports.schedule', 'Schedule automated reports', 'reports'),
('reports.share', 'Share reports with others', 'reports'),

-- Financial Reports
('reports.financial.view', 'View financial reports and statements', 'reports_financial'),
('reports.financial.create', 'Generate financial statements', 'reports_financial'),
('reports.financial.export', 'Export financial data', 'reports_financial'),

-- Sales Reports
('reports.sales.view', 'View sales performance reports', 'reports_sales'),
('reports.sales.create', 'Generate sales analysis reports', 'reports_sales'),
('reports.sales.export', 'Export sales data', 'reports_sales'),

-- Inventory Reports
('reports.inventory.view', 'View inventory and stock reports', 'reports_inventory'),
('reports.inventory.create', 'Generate inventory reports', 'reports_inventory'),
('reports.inventory.export', 'Export inventory data', 'reports_inventory'),

-- Customer Reports
('reports.customers.view', 'View customer analysis reports', 'reports_customers'),
('reports.customers.create', 'Generate customer reports', 'reports_customers'),
('reports.customers.export', 'Export customer data', 'reports_customers'),

-- Vendor Reports
('reports.vendors.view', 'View vendor analysis reports', 'reports_vendors'),
('reports.vendors.create', 'Generate vendor reports', 'reports_vendors'),
('reports.vendors.export', 'Export vendor data', 'reports_vendors'),

-- Daily Reports
('reports.daily.view', 'View daily business reports', 'reports_daily'),
('reports.daily.create', 'Generate daily summary reports', 'reports_daily'),
('reports.daily.export', 'Export daily reports', 'reports_daily'),

-- Shift Reports
('reports.shifts.view', 'View shift-wise reports', 'reports_shifts'),
('reports.shifts.create', 'Generate shift reports', 'reports_shifts'),
('reports.shifts.export', 'Export shift data', 'reports_shifts'),

-- =============================================================================
-- SETTINGS MODULE
-- =============================================================================
('settings.view', 'Access application settings', 'settings'),
('settings.edit', 'Modify application settings', 'settings'),
('settings.delete', 'Reset settings to default', 'settings'),

-- Firm Profile
('settings.firm.view', 'View firm profile and details', 'settings_firm'),
('settings.firm.edit', 'Modify firm profile information', 'settings_firm'),
('settings.firm.logo', 'Manage firm logo and branding', 'settings_firm'),

-- User Management
('settings.users.view', 'View user accounts', 'settings_users'),
('settings.users.create', 'Create new user accounts', 'settings_users'),
('settings.users.edit', 'Modify user account details', 'settings_users'),
('settings.users.delete', 'Delete user accounts', 'settings_users'),
('settings.users.roles', 'Manage user roles and permissions', 'settings_users'),
('settings.users.password', 'Reset user passwords', 'settings_users'),

-- Appearance Settings
('settings.appearance.view', 'View appearance settings', 'settings_appearance'),
('settings.appearance.edit', 'Modify theme and appearance', 'settings_appearance'),
('settings.appearance.themes', 'Manage custom themes', 'settings_appearance'),

-- Notification Settings
('settings.notifications.view', 'View notification settings', 'settings_notifications'),
('settings.notifications.edit', 'Configure notification preferences', 'settings_notifications'),
('settings.notifications.test', 'Send test notifications', 'settings_notifications'),

-- =============================================================================
-- SUPER ADMIN MODULE
-- =============================================================================
('super_admin.view', 'Access super admin panel', 'super_admin'),
('super_admin.edit', 'Modify system configuration', 'super_admin'),
('super_admin.delete', 'Delete system data', 'super_admin'),

-- System Administration
('admin.system.view', 'View system configuration', 'admin_system'),
('admin.system.edit', 'Modify system settings', 'admin_system'),
('admin.system.backup', 'Create system backups', 'admin_system'),
('admin.system.restore', 'Restore from backups', 'admin_system'),
('admin.system.logs', 'View system logs and audit trail', 'admin_system'),

-- Database Management
('admin.database.view', 'View database information', 'admin_database'),
('admin.database.edit', 'Modify database structure', 'admin_database'),
('admin.database.backup', 'Create database backups', 'admin_database'),
('admin.database.restore', 'Restore database from backup', 'admin_database'),
('admin.database.optimize', 'Optimize database performance', 'admin_database'),

-- Security Management
('admin.security.view', 'View security settings', 'admin_security'),
('admin.security.edit', 'Modify security configuration', 'admin_security'),
('admin.security.logs', 'View security audit logs', 'admin_security'),
('admin.security.threats', 'Monitor security threats', 'admin_security'),

-- User Role Management
('admin.roles.view', 'View user roles and permissions', 'admin_roles'),
('admin.roles.create', 'Create new user roles', 'admin_roles'),
('admin.roles.edit', 'Modify role permissions', 'admin_roles'),
('admin.roles.delete', 'Delete user roles', 'admin_roles'),
('admin.roles.assign', 'Assign roles to users', 'admin_roles'),

-- Organization Management
('admin.organization.view', 'View organization details', 'admin_organization'),
('admin.organization.edit', 'Modify organization settings', 'admin_organization'),
('admin.organization.users', 'Manage organization users', 'admin_organization'),
('admin.organization.bunks', 'Manage multiple bunk locations', 'admin_organization'),

-- =============================================================================
-- MISCELLANEOUS MODULES
-- =============================================================================

-- Calculator Functions
('calculators.view', 'Access calculator tools', 'calculators'),
('calculators.scientific', 'Use scientific calculator', 'calculators'),
('calculators.programmer', 'Use programmer calculator', 'calculators'),
('calculators.graphing', 'Use graphing calculator', 'calculators'),
('calculators.unit_converter', 'Use unit converter', 'calculators'),
('calculators.currency', 'Use currency converter', 'calculators'),

-- ID Card Generator
('id_cards.view', 'View ID card generator', 'id_cards'),
('id_cards.create', 'Generate employee ID cards', 'id_cards'),
('id_cards.edit', 'Modify ID card templates', 'id_cards'),
('id_cards.print', 'Print ID cards', 'id_cards'),

-- Attendance System
('attendance.view', 'View attendance records', 'attendance'),
('attendance.create', 'Record attendance', 'attendance'),
('attendance.edit', 'Modify attendance records', 'attendance'),
('attendance.reports', 'Generate attendance reports', 'attendance'),
('attendance.biometric', 'Manage biometric attendance', 'attendance'),

-- Credit Management
('credit.view', 'View credit customer information', 'credit'),
('credit.create', 'Set up credit accounts', 'credit'),
('credit.edit', 'Modify credit terms and limits', 'credit'),
('credit.approve', 'Approve credit applications', 'credit'),
('credit.reports', 'Generate credit reports', 'credit'),

-- Business Transactions
('transactions.view', 'View business transactions', 'transactions'),
('transactions.create', 'Record business transactions', 'transactions'),
('transactions.edit', 'Modify transaction records', 'transactions'),
('transactions.delete', 'Delete transactions', 'transactions'),
('transactions.reconcile', 'Reconcile transaction accounts', 'transactions'),

-- Vendor Transactions
('vendor_transactions.view', 'View vendor transaction history', 'vendor_transactions'),
('vendor_transactions.create', 'Record vendor transactions', 'vendor_transactions'),
('vendor_transactions.edit', 'Modify vendor transactions', 'vendor_transactions'),
('vendor_transactions.reconcile', 'Reconcile vendor accounts', 'vendor_transactions'),

-- Miscellaneous Features
('miscellaneous.view', 'Access miscellaneous features', 'miscellaneous'),
('miscellaneous.feedback', 'Manage customer feedback', 'miscellaneous'),
('miscellaneous.alerts', 'Manage system alerts', 'miscellaneous'),
('miscellaneous.announcements', 'Manage announcements', 'miscellaneous'),

-- =============================================================================
-- ADVANCED FEATURES
-- =============================================================================

-- Tank Dip Calculator
('tank_dip.view', 'Access tank dip calculator', 'tank_dip'),
('tank_dip.create', 'Record tank dip measurements', 'tank_dip'),
('tank_dip.edit', 'Modify dip records', 'tank_dip'),
('tank_dip.calculator', 'Use tank volume calculator', 'tank_dip'),

-- Print Templates
('print_templates.view', 'View print templates', 'print_templates'),
('print_templates.create', 'Create custom print templates', 'print_templates'),
('print_templates.edit', 'Modify print templates', 'print_templates'),
('print_templates.delete', 'Delete print templates', 'print_templates'),

-- Business Flow Reports
('business_flow.view', 'View business flow reports', 'business_flow'),
('business_flow.create', 'Generate business flow analysis', 'business_flow'),
('business_flow.export', 'Export business flow data', 'business_flow'),

-- DSR Format Reports
('dsr_reports.view', 'View DSR format reports', 'dsr_reports'),
('dsr_reports.create', 'Generate DSR reports', 'dsr_reports'),
('dsr_reports.edit', 'Modify DSR formats', 'dsr_reports'),

-- Density Reports
('density_reports.view', 'View fuel density reports', 'density_reports'),
('density_reports.create', 'Generate density reports', 'density_reports'),
('density_reports.edit', 'Modify density calculations', 'density_reports'),

-- Stock Management
('stock.view', 'View stock levels and reports', 'stock'),
('stock.edit', 'Modify stock records', 'stock'),
('stock.reports', 'Generate stock reports', 'stock'),
('stock.alerts', 'Manage stock level alerts', 'stock'),
('stock.valuation', 'View stock valuation', 'stock'),

-- Loss Management
('losses.view', 'View product loss records', 'losses'),
('losses.create', 'Record product losses', 'losses'),
('losses.edit', 'Modify loss records', 'losses'),
('losses.reports', 'Generate loss reports', 'losses'),

-- Minimum Stock Alerts
('min_stock.view', 'View minimum stock alerts', 'min_stock'),
('min_stock.edit', 'Configure minimum stock levels', 'min_stock'),
('min_stock.alerts', 'Manage stock alert notifications', 'min_stock'),

-- Expiry Management
('expiry.view', 'View product expiry information', 'expiry'),
('expiry.create', 'Record expiry dates', 'expiry'),
('expiry.edit', 'Modify expiry records', 'expiry'),
('expiry.alerts', 'Manage expiry alerts', 'expiry'),
('expiry.reports', 'Generate expiry reports', 'expiry');