/**
 * Report Templates Configuration
 * This file contains all the template configurations for different report categories
 */

// Report Categories
export const REPORT_CATEGORIES = {
  BUSINESS: 'business',
  FINANCIAL: 'financial',
  INVENTORY: 'inventory',
  CUSTOMER: 'customer',
  EMPLOYEE: 'employee',
  OPERATIONAL: 'operational',
  TRANSACTION: 'transaction'
};

// Template Types
export const TEMPLATE_TYPES = {
  STANDARD: 'standard',
  DETAILED: 'detailed',
  SUMMARY: 'summary',
  COMPACT: 'compact'
};

// Report Template Configuration
export const REPORT_TEMPLATES = {
  // Business Reports
  [REPORT_CATEGORIES.BUSINESS]: {
    name: 'Business Reports',
    description: 'Daily operations, sales, and business performance reports',
    icon: '📊',
    templates: {
      'daily-business-summary': {
        id: 'daily-business-summary',
        name: 'Daily Business Summary',
        description: 'Comprehensive summary of daily business operations',
        type: TEMPLATE_TYPES.STANDARD,
        category: REPORT_CATEGORIES.BUSINESS,
        layout: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
            showDateRange: true,
            showReportTitle: true
          },
          sections: [
            {
              type: 'summary-cards',
              title: 'Key Metrics',
              columns: 4,
              show: ['totalLiquidSale', 'totalLubeSale', 'totalCreditSale', 'totalRecovery']
            },
            {
              type: 'table',
              title: 'Day Sheet',
              columns: ['date', 'employee', 'totalSale', 'totalCollection', 'shortage']
            },
            {
              type: 'table',
              title: 'Employee Sheet',
              columns: ['employee', 'date', 'totalSale', 'totalCollection', 'shortage']
            },
            {
              type: 'table',
              title: 'Day Business',
              columns: ['nozzle', 'opening', 'closing', 'sale', 'amount']
            }
          ],
          footer: {
            showGeneratedBy: true,
            showTimestamp: true,
            showPageNumbers: true
          }
        },
        styling: {
          primaryColor: '#2c3e50',
          secondaryColor: '#3498db',
          fontSize: '12px',
          headerFontSize: '18px'
        }
      },
      'sales-report': {
        id: 'sales-report',
        name: 'Sales Report',
        description: 'Detailed sales transactions and revenue analysis',
        type: TEMPLATE_TYPES.DETAILED,
        category: REPORT_CATEGORIES.BUSINESS,
        layout: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
            showDateRange: true,
            showReportTitle: true
          },
          sections: [
            {
              type: 'summary-cards',
              title: 'Sales Summary',
              columns: 3,
              show: ['totalSales', 'totalQuantity', 'averageSale']
            },
            {
              type: 'table',
              title: 'Sales Details',
              columns: ['date', 'product', 'quantity', 'rate', 'amount', 'paymentMode']
            },
            {
              type: 'chart',
              title: 'Sales Trend',
              type: 'line',
              data: 'salesTrend'
            }
          ],
          footer: {
            showGeneratedBy: true,
            showTimestamp: true,
            showPageNumbers: true
          }
        },
        styling: {
          primaryColor: '#27ae60',
          secondaryColor: '#2ecc71',
          fontSize: '11px',
          headerFontSize: '16px'
        }
      },
      'business-flow': {
        id: 'business-flow',
        name: 'Business Flow Report',
        description: 'Analysis of business operations and cash flow',
        type: TEMPLATE_TYPES.SUMMARY,
        category: REPORT_CATEGORIES.BUSINESS,
        layout: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
            showDateRange: true,
            showReportTitle: true
          },
          sections: [
            {
              type: 'summary-cards',
              title: 'Business Overview',
              columns: 4,
              show: ['totalRevenue', 'totalExpenses', 'netProfit', 'cashFlow']
            },
            {
              type: 'table',
              title: 'Cash Flow Statement',
              columns: ['date', 'description', 'inflow', 'outflow', 'balance']
            },
            {
              type: 'chart',
              title: 'Profit & Loss',
              type: 'bar',
              data: 'profitLoss'
            }
          ],
          footer: {
            showGeneratedBy: true,
            showTimestamp: true,
            showPageNumbers: true
          }
        },
        styling: {
          primaryColor: '#8e44ad',
          secondaryColor: '#9b59b6',
          fontSize: '12px',
          headerFontSize: '18px'
        }
      }
    }
  },

  // Financial Reports
  [REPORT_CATEGORIES.FINANCIAL]: {
    name: 'Financial Reports',
    description: 'Purchase, expenditure, and financial transaction reports',
    icon: '💰',
    templates: {
      'purchase-report': {
        id: 'purchase-report',
        name: 'Purchase Report',
        description: 'Vendor purchases and procurement history',
        type: TEMPLATE_TYPES.DETAILED,
        category: REPORT_CATEGORIES.FINANCIAL,
        layout: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
            showDateRange: true,
            showReportTitle: true
          },
          sections: [
            {
              type: 'summary-cards',
              title: 'Purchase Summary',
              columns: 3,
              show: ['totalPurchases', 'totalQuantity', 'averagePurchase']
            },
            {
              type: 'table',
              title: 'Purchase Details',
              columns: ['date', 'vendor', 'product', 'quantity', 'rate', 'amount', 'invoiceNo']
            },
            {
              type: 'table',
              title: 'Vendor Summary',
              columns: ['vendor', 'totalPurchases', 'totalAmount', 'lastPurchase']
            }
          ],
          footer: {
            showGeneratedBy: true,
            showTimestamp: true,
            showPageNumbers: true
          }
        },
        styling: {
          primaryColor: '#e67e22',
          secondaryColor: '#d35400',
          fontSize: '11px',
          headerFontSize: '16px'
        }
      },
      'expenditure-report': {
        id: 'expenditure-report',
        name: 'Expenditure Report',
        description: 'Detailed expenditure and expense analysis',
        type: TEMPLATE_TYPES.STANDARD,
        category: REPORT_CATEGORIES.FINANCIAL,
        layout: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
            showDateRange: true,
            showReportTitle: true
          },
          sections: [
            {
              type: 'summary-cards',
              title: 'Expense Summary',
              columns: 4,
              show: ['totalExpenses', 'fuelExpenses', 'maintenance', 'otherExpenses']
            },
            {
              type: 'table',
              title: 'Expense Details',
              columns: ['date', 'category', 'description', 'amount', 'paymentMode', 'approvedBy']
            },
            {
              type: 'chart',
              title: 'Expense Breakdown',
              type: 'pie',
              data: 'expenseBreakdown'
            }
          ],
          footer: {
            showGeneratedBy: true,
            showTimestamp: true,
            showPageNumbers: true
          }
        },
        styling: {
          primaryColor: '#e74c3c',
          secondaryColor: '#c0392b',
          fontSize: '12px',
          headerFontSize: '18px'
        }
      },
      'interest-transaction': {
        id: 'interest-transaction',
        name: 'Interest Transaction Report',
        description: 'Interest calculations and financial transactions',
        type: TEMPLATE_TYPES.COMPACT,
        category: REPORT_CATEGORIES.FINANCIAL,
        layout: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
            showDateRange: true,
            showReportTitle: true
          },
          sections: [
            {
              type: 'table',
              title: 'Interest Transactions',
              columns: ['date', 'customer', 'principal', 'interestRate', 'interestAmount', 'totalAmount']
            },
            {
              type: 'summary-cards',
              title: 'Interest Summary',
              columns: 2,
              show: ['totalInterest', 'totalPrincipal']
            }
          ],
          footer: {
            showGeneratedBy: true,
            showTimestamp: true,
            showPageNumbers: true
          }
        },
        styling: {
          primaryColor: '#f39c12',
          secondaryColor: '#e67e22',
          fontSize: '11px',
          headerFontSize: '16px'
        }
      }
    }
  },

  // Inventory Reports
  [REPORT_CATEGORIES.INVENTORY]: {
    name: 'Inventory Reports',
    description: 'Stock management, variations, and inventory analysis',
    icon: '📦',
    templates: {
      'stock-variation': {
        id: 'stock-variation',
        name: 'Stock Variation Report',
        description: 'Stock level changes and variations',
        type: TEMPLATE_TYPES.STANDARD,
        category: REPORT_CATEGORIES.INVENTORY,
        layout: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
            showDateRange: true,
            showReportTitle: true
          },
          sections: [
            {
              type: 'summary-cards',
              title: 'Stock Summary',
              columns: 3,
              show: ['openingStock', 'closingStock', 'variation']
            },
            {
              type: 'table',
              title: 'Stock Variations',
              columns: ['date', 'product', 'opening', 'closing', 'variation', 'reason']
            }
          ],
          footer: {
            showGeneratedBy: true,
            showTimestamp: true,
            showPageNumbers: true
          }
        },
        styling: {
          primaryColor: '#16a085',
          secondaryColor: '#1abc9c',
          fontSize: '12px',
          headerFontSize: '18px'
        }
      },
      'lubricants-stock': {
        id: 'lubricants-stock',
        name: 'Lubricants Stock Report',
        description: 'Current inventory status of lubricants',
        type: TEMPLATE_TYPES.COMPACT,
        category: REPORT_CATEGORIES.INVENTORY,
        layout: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
            showDateRange: true,
            showReportTitle: true
          },
          sections: [
            {
              type: 'table',
              title: 'Lubricants Inventory',
              columns: ['product', 'openingStock', 'received', 'sold', 'closingStock', 'reorderLevel']
            },
            {
              type: 'summary-cards',
              title: 'Stock Status',
              columns: 3,
              show: ['totalProducts', 'lowStock', 'outOfStock']
            }
          ],
          footer: {
            showGeneratedBy: true,
            showTimestamp: true,
            showPageNumbers: true
          }
        },
        styling: {
          primaryColor: '#2980b9',
          secondaryColor: '#3498db',
          fontSize: '11px',
          headerFontSize: '16px'
        }
      },
      'day-wise-stock-value': {
        id: 'day-wise-stock-value',
        name: 'Day Wise Stock Value Report',
        description: 'Daily stock valuation and inventory worth',
        type: TEMPLATE_TYPES.DETAILED,
        category: REPORT_CATEGORIES.INVENTORY,
        layout: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
            showDateRange: true,
            showReportTitle: true
          },
          sections: [
            {
              type: 'summary-cards',
              title: 'Stock Value Summary',
              columns: 3,
              show: ['totalValue', 'fuelValue', 'lubeValue']
            },
            {
              type: 'table',
              title: 'Daily Stock Values',
              columns: ['date', 'fuelStock', 'fuelValue', 'lubeStock', 'lubeValue', 'totalValue']
            },
            {
              type: 'chart',
              title: 'Stock Value Trend',
              type: 'line',
              data: 'stockValueTrend'
            }
          ],
          footer: {
            showGeneratedBy: true,
            showTimestamp: true,
            showPageNumbers: true
          }
        },
        styling: {
          primaryColor: '#8e44ad',
          secondaryColor: '#9b59b6',
          fontSize: '12px',
          headerFontSize: '18px'
        }
      }
    }
  },

  // Customer Reports
  [REPORT_CATEGORIES.CUSTOMER]: {
    name: 'Customer Reports',
    description: 'Customer transactions, credit, and sales reports',
    icon: '👥',
    templates: {
      'credit-customer': {
        id: 'credit-customer',
        name: 'Credit Customer Report',
        description: 'Outstanding credit sales and customer balances',
        type: TEMPLATE_TYPES.STANDARD,
        category: REPORT_CATEGORIES.CUSTOMER,
        layout: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
            showDateRange: true,
            showReportTitle: true
          },
          sections: [
            {
              type: 'summary-cards',
              title: 'Credit Summary',
              columns: 3,
              show: ['totalCredit', 'totalOutstanding', 'totalCollected']
            },
            {
              type: 'table',
              title: 'Credit Customers',
              columns: ['customer', 'creditLimit', 'outstanding', 'lastTransaction', 'status']
            }
          ],
          footer: {
            showGeneratedBy: true,
            showTimestamp: true,
            showPageNumbers: true
          }
        },
        styling: {
          primaryColor: '#e67e22',
          secondaryColor: '#d35400',
          fontSize: '12px',
          headerFontSize: '18px'
        }
      },
      'guest-customer-sales': {
        id: 'guest-customer-sales',
        name: 'Guest Customer Sales Report',
        description: 'Sales transactions for guest customers',
        type: TEMPLATE_TYPES.COMPACT,
        category: REPORT_CATEGORIES.CUSTOMER,
        layout: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
            showDateRange: true,
            showReportTitle: true
          },
          sections: [
            {
              type: 'table',
              title: 'Guest Customer Sales',
              columns: ['date', 'customerName', 'product', 'quantity', 'amount', 'paymentMode']
            },
            {
              type: 'summary-cards',
              title: 'Guest Sales Summary',
              columns: 2,
              show: ['totalSales', 'totalAmount']
            }
          ],
          footer: {
            showGeneratedBy: true,
            showTimestamp: true,
            showPageNumbers: true
          }
        },
        styling: {
          primaryColor: '#27ae60',
          secondaryColor: '#2ecc71',
          fontSize: '11px',
          headerFontSize: '16px'
        }
      },
      'customer-statement': {
        id: 'customer-statement',
        name: 'Customer Statement',
        description: 'Individual customer transaction history',
        type: TEMPLATE_TYPES.DETAILED,
        category: REPORT_CATEGORIES.CUSTOMER,
        layout: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
            showDateRange: true,
            showReportTitle: true
          },
          sections: [
            {
              type: 'customer-info',
              title: 'Customer Information'
            },
            {
              type: 'table',
              title: 'Transaction History',
              columns: ['date', 'description', 'debit', 'credit', 'balance']
            },
            {
              type: 'summary-cards',
              title: 'Account Summary',
              columns: 3,
              show: ['openingBalance', 'totalDebit', 'totalCredit', 'closingBalance']
            }
          ],
          footer: {
            showGeneratedBy: true,
            showTimestamp: true,
            showPageNumbers: true
          }
        },
        styling: {
          primaryColor: '#2c3e50',
          secondaryColor: '#34495e',
          fontSize: '12px',
          headerFontSize: '18px'
        }
      }
    }
  },

  // Employee Reports
  [REPORT_CATEGORIES.EMPLOYEE]: {
    name: 'Employee Reports',
    description: 'Staff attendance, performance, and employee-related reports',
    icon: '👨‍💼',
    templates: {
      'attendance': {
        id: 'attendance',
        name: 'Employee Attendance Report',
        description: 'Staff attendance records and working hours',
        type: TEMPLATE_TYPES.STANDARD,
        category: REPORT_CATEGORIES.EMPLOYEE,
        layout: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
            showDateRange: true,
            showReportTitle: true
          },
          sections: [
            {
              type: 'summary-cards',
              title: 'Attendance Summary',
              columns: 4,
              show: ['totalEmployees', 'present', 'absent', 'late']
            },
            {
              type: 'table',
              title: 'Attendance Details',
              columns: ['employee', 'date', 'shift', 'checkIn', 'checkOut', 'status', 'hours']
            }
          ],
          footer: {
            showGeneratedBy: true,
            showTimestamp: true,
            showPageNumbers: true
          }
        },
        styling: {
          primaryColor: '#8e44ad',
          secondaryColor: '#9b59b6',
          fontSize: '12px',
          headerFontSize: '18px'
        }
      },
      'employee-status': {
        id: 'employee-status',
        name: 'Employee Status Report',
        description: 'Employee performance and status overview',
        type: TEMPLATE_TYPES.SUMMARY,
        category: REPORT_CATEGORIES.EMPLOYEE,
        layout: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
            showDateRange: true,
            showReportTitle: true
          },
          sections: [
            {
              type: 'table',
              title: 'Employee Status',
              columns: ['employee', 'designation', 'status', 'totalSales', 'performance', 'lastActive']
            },
            {
              type: 'summary-cards',
              title: 'Employee Overview',
              columns: 3,
              show: ['totalEmployees', 'active', 'inactive']
            }
          ],
          footer: {
            showGeneratedBy: true,
            showTimestamp: true,
            showPageNumbers: true
          }
        },
        styling: {
          primaryColor: '#16a085',
          secondaryColor: '#1abc9c',
          fontSize: '11px',
          headerFontSize: '16px'
        }
      }
    }
  },

  // Operational Reports
  [REPORT_CATEGORIES.OPERATIONAL]: {
    name: 'Operational Reports',
    description: 'Daily operations, density, and system reports',
    icon: '⚙️',
    templates: {
      'density-report': {
        id: 'density-report',
        name: 'Density Report',
        description: 'Fuel density measurements and quality reports',
        type: TEMPLATE_TYPES.COMPACT,
        category: REPORT_CATEGORIES.OPERATIONAL,
        layout: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
            showDateRange: true,
            showReportTitle: true
          },
          sections: [
            {
              type: 'table',
              title: 'Density Readings',
              columns: ['date', 'product', 'tank', 'density', 'temperature', 'quality']
            },
            {
              type: 'summary-cards',
              title: 'Quality Summary',
              columns: 2,
              show: ['averageDensity', 'qualityStatus']
            }
          ],
          footer: {
            showGeneratedBy: true,
            showTimestamp: true,
            showPageNumbers: true
          }
        },
        styling: {
          primaryColor: '#e67e22',
          secondaryColor: '#d35400',
          fontSize: '11px',
          headerFontSize: '16px'
        }
      },
      'dsr-format': {
        id: 'dsr-format',
        name: 'DSR Format Report',
        description: 'Daily sales report in standard format',
        type: TEMPLATE_TYPES.STANDARD,
        category: REPORT_CATEGORIES.OPERATIONAL,
        layout: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
            showDateRange: true,
            showReportTitle: true
          },
          sections: [
            {
              type: 'summary-cards',
              title: 'Daily Sales Summary',
              columns: 4,
              show: ['totalSales', 'cashSales', 'creditSales', 'cardSales']
            },
            {
              type: 'table',
              title: 'Product Wise Sales',
              columns: ['product', 'opening', 'sales', 'closing', 'amount']
            },
            {
              type: 'table',
              title: 'Payment Mode Summary',
              columns: ['paymentMode', 'count', 'amount', 'percentage']
            }
          ],
          footer: {
            showGeneratedBy: true,
            showTimestamp: true,
            showPageNumbers: true
          }
        },
        styling: {
          primaryColor: '#2c3e50',
          secondaryColor: '#34495e',
          fontSize: '12px',
          headerFontSize: '18px'
        }
      },
      'swipe-report': {
        id: 'swipe-report',
        name: 'Swipe Report',
        description: 'Card swipe transactions and processing',
        type: TEMPLATE_TYPES.COMPACT,
        category: REPORT_CATEGORIES.OPERATIONAL,
        layout: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
            showDateRange: true,
            showReportTitle: true
          },
          sections: [
            {
              type: 'table',
              title: 'Swipe Transactions',
              columns: ['date', 'time', 'cardType', 'amount', 'status', 'reference']
            },
            {
              type: 'summary-cards',
              title: 'Swipe Summary',
              columns: 3,
              show: ['totalSwipes', 'successful', 'failed']
            }
          ],
          footer: {
            showGeneratedBy: true,
            showTimestamp: true,
            showPageNumbers: true
          }
        },
        styling: {
          primaryColor: '#27ae60',
          secondaryColor: '#2ecc71',
          fontSize: '11px',
          headerFontSize: '16px'
        }
      }
    }
  },

  // Transaction Reports
  [REPORT_CATEGORIES.TRANSACTION]: {
    name: 'Transaction Reports',
    description: 'Vendor transactions, bowser operations, and other transactions',
    icon: '🔄',
    templates: {
      'vendor-transaction': {
        id: 'vendor-transaction',
        name: 'Vendor Transaction Report',
        description: 'All transactions with vendors and suppliers',
        type: TEMPLATE_TYPES.DETAILED,
        category: REPORT_CATEGORIES.TRANSACTION,
        layout: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
            showDateRange: true,
            showReportTitle: true
          },
          sections: [
            {
              type: 'summary-cards',
              title: 'Vendor Summary',
              columns: 3,
              show: ['totalVendors', 'activeVendors', 'totalTransactions']
            },
            {
              type: 'table',
              title: 'Vendor Transactions',
              columns: ['date', 'vendor', 'transactionType', 'amount', 'description', 'status']
            }
          ],
          footer: {
            showGeneratedBy: true,
            showTimestamp: true,
            showPageNumbers: true
          }
        },
        styling: {
          primaryColor: '#e74c3c',
          secondaryColor: '#c0392b',
          fontSize: '12px',
          headerFontSize: '18px'
        }
      },
      'bowser-transactions': {
        id: 'bowser-transactions',
        name: 'Bowser Transactions Report',
        description: 'Fuel bowser operations and transactions',
        type: TEMPLATE_TYPES.STANDARD,
        category: REPORT_CATEGORIES.TRANSACTION,
        layout: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
            showDateRange: true,
            showReportTitle: true
          },
          sections: [
            {
              type: 'table',
              title: 'Bowser Operations',
              columns: ['date', 'bowser', 'product', 'quantity', 'rate', 'amount', 'destination']
            },
            {
              type: 'summary-cards',
              title: 'Bowser Summary',
              columns: 2,
              show: ['totalQuantity', 'totalAmount']
            }
          ],
          footer: {
            showGeneratedBy: true,
            showTimestamp: true,
            showPageNumbers: true
          }
        },
        styling: {
          primaryColor: '#f39c12',
          secondaryColor: '#e67e22',
          fontSize: '11px',
          headerFontSize: '16px'
        }
      }
    }
  }
};

// Helper functions
export const getTemplateById = (templateId) => {
  for (const category of Object.values(REPORT_TEMPLATES)) {
    if (category.templates[templateId]) {
      return category.templates[templateId];
    }
  }
  return null;
};

export const getTemplatesByCategory = (category) => {
  return REPORT_TEMPLATES[category]?.templates || {};
};

export const getAllTemplates = () => {
  const allTemplates = {};
  Object.values(REPORT_TEMPLATES).forEach(category => {
    Object.assign(allTemplates, category.templates);
  });
  return allTemplates;
};

export const getCategoryInfo = (category) => {
  return REPORT_TEMPLATES[category] || null;
};

export const getReportTypeFromTemplate = (templateId) => {
  const template = getTemplateById(templateId);
  if (template) {
    return template.category;
  }
  return null;
};