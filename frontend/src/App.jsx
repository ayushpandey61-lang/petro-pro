import React from 'react';
    import { Routes, Route, Navigate } from 'react-router-dom';
    import Layout from '@/components/Layout';
    import Dashboard from '@/pages/Dashboard';
    import Master from '@/pages/Master';
    import EmployeePage from '@/pages/master/EmployeePage';
    import FuelProductPage from '@/pages/master/FuelProductPage';
    import LubricantsPage from '@/pages/master/LubricantsPage';
    import CreditPartyPage from '@/pages/master/CreditPartyPage';
    import VendorPage from '@/pages/master/VendorPage';
    import TankPage from '@/pages/master/TankPage';
    import NozzlePage from '@/pages/master/NozzlePage';
    import ExpenseTypePage from '@/pages/master/ExpenseTypePage';
    import BusinessCrDrPartyPage from '@/pages/master/BusinessCrDrPartyPage';
    import SwipeMachinePage from '@/pages/master/SwipeMachinePage';
    import ExpiryItemPage from '@/pages/master/ExpiryItemPage';
    import ShiftPage from '@/pages/master/ShiftPage';
    import PrintTemplatePage from '@/pages/master/PrintTemplatePage';
    import GuestCustomerPage from '@/pages/master/GuestCustomerPage';
    import DenominationPage from '@/pages/master/DenominationPage';
    import DayBusiness from '@/pages/DayBusiness';
    import DayAssigningPage from '@/pages/day-business/DayAssigningPage';
    import DailySaleRatePage from '@/pages/day-business/DailySaleRatePage';
    import SaleEntryPage from '@/pages/day-business/SaleEntryPage';
    import LubricantsSalePage from '@/pages/day-business/LubricantsSalePage';
    import SwipePage from '@/pages/day-business/SwipePage';
    import CreditSalePage from '@/pages/day-business/CreditSalePage';
    import ExpensesPage from '@/pages/day-business/ExpensesPage';
    import RecoveryPage from '@/pages/day-business/RecoveryPage';
    import EmployeeCashRecoveryPage from '@/pages/day-business/EmployeeCashRecoveryPage';
    import DayOpeningStockPage from '@/pages/day-business/DayOpeningStockPage';
    import DaySettlementPage from '@/pages/day-business/DaySettlementPage';
    import LiquidPurchasePage from '@/pages/invoice/LiquidPurchasePage';
    import LubePurchasePage from '@/pages/invoice/LubePurchasePage';
    import StatementGeneration from '@/pages/StatementGeneration';
    import ProductStock from '@/pages/ProductStock';
    import StockReportPage from '@/pages/product-stock/StockReportPage';
    import LubesLossPage from '@/pages/product-stock/LubesLossPage';
    import LubesStockPage from '@/pages/product-stock/LubesStockPage';
    import MinimumStockPage from '@/pages/product-stock/MinimumStockPage';
    import ShiftSheetPage from '@/pages/shift-sheet/ShiftSheetPage';
    import BusinessTransactionPage from '@/pages/transactions/BusinessTransactionPage';
    import VendorTransactionPage from '@/pages/transactions/VendorTransactionPage';
    import ReportLayout from '@/pages/reports/ReportLayout';
    import AllCreditCustomerReport from '@/pages/reports/AllCreditCustomerReport';
    import AttendanceReport from '@/pages/reports/AttendanceReport';
    import BusinessFlowReport from '@/pages/reports/BusinessFlowReport';
    import BowserTransactionsReport from '@/pages/reports/BowserTransactionsReport';
    import CustomerStatementReport from '@/pages/reports/CustomerStatementReport';
    import DailyRateHistoryReport from '@/pages/reports/DailyRateHistoryReport';
    import DailyBusinessSummaryReport from '@/pages/reports/DailyBusinessSummaryReport';
    import DiscountOfferedReport from '@/pages/reports/DiscountOfferedReport';
    import ExpenditureReport from '@/pages/reports/ExpenditureReport';
    import TaxationReport from '@/pages/reports/TaxationReport';
    import GuestCustomerSalesReport from '@/pages/reports/GuestCustomerSalesReport';
    import LubricantsStockReport from '@/pages/reports/LubricantsStockReport';
    import PurchaseReport from '@/pages/reports/PurchaseReport';
    import EmployeeStatusReport from '@/pages/reports/EmployeeStatusReport';
    import SalesReport from '@/pages/reports/SalesReport';
    import StockVariationReport from '@/pages/reports/StockVariationReport';
    import SwipeReport from '@/pages/reports/SwipeReport';
    import VendorTransactionReport from '@/pages/reports/VendorTransactionReport';
    import FeedbackReport from '@/pages/reports/FeedbackReport';
    import InterestTransactionReport from '@/pages/reports/InterestTransactionReport';
    import DailyStockSaleRegisterReport from '@/pages/reports/DailyStockSaleRegisterReport';
    import DensityReport from '@/pages/reports/DensityReport';
    import DsrFormatReport from '@/pages/reports/DsrFormatReport';
    import DayWiseStockValueReport from '@/pages/reports/DayWiseStockValueReport';
    import SalesInvoicePage from '@/pages/SalesInvoicePage';
    import CreditLimitReportsPage from '@/pages/CreditLimitReportsPage';
    import MiscellaneousLayout from '@/pages/misc/MiscellaneousLayout';
    import InterestTransactionMiscPage from '@/pages/misc/InterestTransactionMiscPage';
    import SheetRecordMiscPage from '@/pages/misc/SheetRecordMiscPage';
    import DayCashReportMiscPage from '@/pages/misc/DayCashReportMiscPage';
    import AttendanceMiscPage from '@/pages/misc/AttendanceMiscPage';
    import DutyPayMiscPage from '@/pages/misc/DutyPayMiscPage';
    import SalesOfficerMiscPage from '@/pages/misc/SalesOfficerMiscPage';
    import CreditRequestsMiscPage from '@/pages/misc/CreditRequestsMiscPage';
    import ExpiryItemMiscPage from '@/pages/misc/ExpiryItemMiscPage';
    import FeedbackMiscPage from '@/pages/misc/FeedbackMiscPage';
    import Settings from '@/pages/Settings';
    import { LanguageProvider } from '@/context/LanguageContext';
    import { ThemeProvider } from '@/context/ThemeContext';
    import { HelmetProvider } from 'react-helmet-async';
    import { DenominationProvider } from '@/context/DenominationContext';
    import UserProfilePage from '@/pages/settings/UserProfilePage';
    import NotificationsSettingsPage from '@/pages/settings/NotificationsSettingsPage';
    import AppearanceSettingsPage from '@/pages/settings/AppearanceSettingsPage';
    import RolesPermissionsPage from '@/pages/super-admin/RolesPermissionsPage';
    import OrganisationDetailsPage from '@/pages/super-admin/OrganisationDetailsPage';
    import ChangePasswordPage from '@/pages/super-admin/ChangePasswordPage';
    import BackupDataPage from '@/pages/super-admin/BackupDataPage';
    import ReportUsPage from '@/pages/super-admin/ReportUsPage';
    import BunkUserPage from '@/pages/super-admin/BunkUserPage';
    import TankLorryManagementPage from '@/pages/master/TankLorryManagementPage';
    import { OrgProvider } from '@/context/OrgContext';
    import IdCardGeneratorPage from '@/pages/id-card-generator';
    import BiometricAttendancePage from '@/pages/misc/BiometricAttendancePage';
    import TankDipPage from '@/pages/master/TankDipPage';
    import TankDipCalculatorPage from '@/pages/master/TankDipCalculatorPage';
    import CalculatorPage from '@/pages/CalculatorPage';
    import TodoList from '@/pages/TodoList';
    import MasterDataLoader from '@/components/MasterDataLoader';
    import Login from '@/pages/Login';
    import ProtectedRoute from '@/components/auth/ProtectedRoute';
    import { SidebarProvider } from '@/context/SidebarContext';
    import { AuthProvider } from '@/context/AuthContext';
    
    
        function App() {
          return (
            <HelmetProvider>
              <LanguageProvider>
                <OrgProvider>
                  <ThemeProvider>
                    <SidebarProvider>
                      <AuthProvider>
                        <DenominationProvider>
                          <MasterDataLoader />
                      <Routes>
                        <Route path="/calculator" element={<CalculatorPage />} />
                        <Route path="/todo-list" element={<ProtectedRoute><TodoList /></ProtectedRoute>} />
                        <Route path="/debug" element={
                          <div className="p-8">
                            <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
                            <p className="mb-4">If you can see this page, routing is working!</p>
                            <div className="bg-gray-100 p-4 rounded">
                              <h2 className="text-lg font-semibold mb-2">Authentication Status:</h2>
                              <pre>{JSON.stringify({ user: 'Check console for details' }, null, 2)}</pre>
                            </div>
                          </div>
                        } />
                        <Route path="/test" element={
                          <div className="p-8">
                            <h1 className="text-2xl font-bold mb-4 text-green-600">✅ Frontend is Working!</h1>
                            <p className="mb-4">This page confirms that the React application is loading correctly.</p>
                            <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
                              <h2 className="text-lg font-semibold mb-2">Status:</h2>
                              <ul className="list-disc list-inside space-y-1">
                                <li>✅ React is rendering</li>
                                <li>✅ Tailwind CSS is working</li>
                                <li>✅ Routing is functional</li>
                                <li>✅ Components are loading</li>
                              </ul>
                            </div>
                            <div className="mt-4">
                              <button
                                onClick={() => window.location.href = '/login'}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                              >
                                Go to Login
                              </button>
                            </div>
                          </div>
                        } />
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Layout />}>
                          <Route index element={<Navigate to="/dashboard" replace />} />
                          <Route path="dashboard" element={<Dashboard />} />
                          
                          <Route path="master" element={<Master />} />
                          <Route path="master/employee" element={<EmployeePage />} />
                          <Route path="master/fuel-product" element={<FuelProductPage />} />
                          <Route path="master/lubricants" element={<LubricantsPage />} />
                          <Route path="master/credit-party" element={<CreditPartyPage />} />
                          <Route path="master/vendor" element={<VendorPage />} />
                          <Route path="master/tanks" element={<TankPage />} />
                          <Route path="master/nozzles" element={<NozzlePage />} />
                          <Route path="master/expense-types" element={<ExpenseTypePage />} />
                          <Route path="master/business-cr-dr-party" element={<BusinessCrDrPartyPage />} />
                          <Route path="master/swipe-machines" element={<SwipeMachinePage />} />
                          <Route path="master/expiry-items" element={<ExpiryItemPage />} />
                          <Route path="master/shifts" element={<ShiftPage />} />
                          <Route path="master/print-templates" element={<PrintTemplatePage />} />
                          <Route path="master/guest-customer" element={<GuestCustomerPage />} />
                          <Route path="master/denomination" element={<DenominationPage />} />
                          <Route path="master/tank-dip" element={<TankDipPage />} />
                          <Route path="master/tank-dip-calculator" element={<TankDipCalculatorPage />} />
                          <Route path="master/tank-lorry-management" element={<TankLorryManagementPage />} />
                          
                          <Route path="day-business" element={<DayBusiness />} />
                          <Route path="day-business/assigning" element={<DayAssigningPage />} />
                          <Route path="day-business/daily-rate" element={<DailySaleRatePage />} />
                          <Route path="day-business/sale-entry" element={<SaleEntryPage />} />
                          <Route path="day-business/lubricants-sale" element={<LubricantsSalePage />} />
                          <Route path="day-business/swipe" element={<SwipePage />} />
                          <Route path="day-business/credit-sale" element={<CreditSalePage />} />
                          <Route path="day-business/expenses" element={<ExpensesPage />} />
                          <Route path="day-business/recovery" element={<RecoveryPage />} />
                          <Route path="day-business/employee-cash-recovery" element={<EmployeeCashRecoveryPage />} />
                          <Route path="day-business/day-opening-stock" element={<DayOpeningStockPage />} />
                          <Route path="day-business/day-settlement" element={<DaySettlementPage />} />

                          <Route path="invoice/liquid-purchase" element={<LiquidPurchasePage />} />
                          <Route path="invoice/lube-purchase" element={<LubePurchasePage />} />

                          <Route path="statement-generation" element={<StatementGeneration />} />
                          
                          <Route path="product-stock" element={<ProductStock />}>
                            <Route index element={<Navigate to="stock-report" replace />} />
                            <Route path="stock-report" element={<StockReportPage />} />
                            <Route path="lubes-loss" element={<LubesLossPage />} />
                            <Route path="lubes-stock" element={<LubesStockPage />} />
                            <Route path="minimum-stock" element={<MinimumStockPage />} />
                          </Route>

                          <Route path="shift-sheet-entry" element={<ShiftSheetPage />} />
                          <Route path="shift-sheet-entry/:id" element={<ShiftSheetPage />} />
                          <Route path="business-debit-credit" element={<BusinessTransactionPage />} />
                          <Route path="vendor-transaction" element={<VendorTransactionPage />} />
                          
                          <Route path="reports" element={<ReportLayout />}>
                            <Route index element={<Navigate to="all-credit-customer" replace />} />
                            <Route path="all-credit-customer" element={<AllCreditCustomerReport />} />
                            <Route path="attendance" element={<AttendanceReport />} />
                            <Route path="business-credit-debit-flow" element={<BusinessFlowReport />} />
                            <Route path="bowser-transactions" element={<BowserTransactionsReport />} />
                            <Route path="customer-account-statement" element={<CustomerStatementReport />} />
                            <Route path="daily-rate-history" element={<DailyRateHistoryReport />} />
                            <Route path="daily-stock-sale-register" element={<DailyStockSaleRegisterReport />} />
                            <Route path="density-report" element={<DensityReport />} />
                            <Route path="dsr-format" element={<DsrFormatReport />} />
                            <Route path="day-wise-stock-value" element={<DayWiseStockValueReport />} />
                            <Route path="daily-business-summary" element={<DailyBusinessSummaryReport />} />
                            <Route path="discount-offered" element={<DiscountOfferedReport />} />
                            <Route path="expenditure" element={<ExpenditureReport />} />
                            <Route path="taxation" element={<TaxationReport />} />
                            <Route path="guest-customer-sales" element={<GuestCustomerSalesReport />} />
                            <Route path="lubricants-stock" element={<LubricantsStockReport />} />
                            <Route path="purchase" element={<PurchaseReport />} />
                            <Route path="employee-status" element={<EmployeeStatusReport />} />
                            <Route path="sales" element={<SalesReport />} />
                            <Route path="stock-variation" element={<StockVariationReport />} />
                            <Route path="swipe" element={<SwipeReport />} />
                            <Route path="vendor-transactions" element={<VendorTransactionReport />} />
                            <Route path="feedback" element={<FeedbackReport />} />
                            <Route path="interest-transactions" element={<InterestTransactionReport />} />
                          </Route>

                          <Route path="sales-invoice" element={<SalesInvoicePage />} />
                          <Route path="credit-limit-reports" element={<CreditLimitReportsPage />} />

                          <Route path="miscellaneous" element={<MiscellaneousLayout />}>
                              <Route index element={<Navigate to="interest-transaction" replace />} />
                              <Route path="interest-transaction" element={<InterestTransactionMiscPage />} />
                              <Route path="sheet-record" element={<SheetRecordMiscPage />} />
                              <Route path="day-cash-report" element={<DayCashReportMiscPage />} />
                              <Route path="attendance" element={<AttendanceMiscPage />} />
                              <Route path="biometric-attendance" element={<BiometricAttendancePage />} />
                              <Route path="duty-pay" element={<DutyPayMiscPage />} />
                              <Route path="sales-officer" element={<SalesOfficerMiscPage />} />
                              <Route path="credit-requests" element={<CreditRequestsMiscPage />} />
                              <Route path="expiry-item" element={<ExpiryItemMiscPage />} />
                              <Route path="feedback" element={<FeedbackMiscPage />} />
                          </Route>
                          
                          <Route path="id-card-generator" element={<IdCardGeneratorPage />} />
                          
                          <Route path="super-admin/organisation-details" element={<OrganisationDetailsPage />} />
                          <Route path="super-admin/change-password" element={<ChangePasswordPage />} />
                          <Route path="super-admin/backup-data" element={<BackupDataPage />} />
                          <Route path="super-admin/report-us" element={<ReportUsPage />} />
                          <Route path="super-admin/bunk-user" element={<BunkUserPage />} />
                          <Route path="super-admin/roles-permissions" element={<RolesPermissionsPage />} />

                          <Route path="settings" element={<Settings />}>
                            <Route index element={<Navigate to="user-profile" replace />} />
                            <Route path="user-profile" element={<UserProfilePage />} />
                            <Route path="notifications" element={<NotificationsSettingsPage />} />
                            <Route path="appearance" element={<AppearanceSettingsPage />} />
                          </Route>
                        </Route>
                      </Routes>
                   </DenominationProvider>
                 </AuthProvider>
               </SidebarProvider>
             </ThemeProvider>
           </OrgProvider>
         </LanguageProvider>
       </HelmetProvider>
      );
    }

    export default App;