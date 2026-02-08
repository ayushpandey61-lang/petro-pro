/**
 * Report Template Integration Utility
 * This file handles the integration between reports and templates
 */

// Template-Report Mappings
export const TEMPLATE_REPORT_MAPPINGS = {
  // Business Reports
  'daily-business-summary': {
    recommendedTemplates: ['daily-business-summary', 'business-flow'],
    defaultTemplate: 'daily-business-summary',
    category: 'business'
  },
  'sales-report': {
    recommendedTemplates: ['sales-report'],
    defaultTemplate: 'sales-report',
    category: 'business'
  },
  'business-flow': {
    recommendedTemplates: ['business-flow'],
    defaultTemplate: 'business-flow',
    category: 'business'
  },

  // Financial Reports
  'purchase-report': {
    recommendedTemplates: ['purchase-report'],
    defaultTemplate: 'purchase-report',
    category: 'financial'
  },
  'expenditure-report': {
    recommendedTemplates: ['expenditure-report'],
    defaultTemplate: 'expenditure-report',
    category: 'financial'
  },
  'interest-transaction': {
    recommendedTemplates: ['interest-transaction'],
    defaultTemplate: 'interest-transaction',
    category: 'financial'
  },

  // Inventory Reports
  'stock-variation': {
    recommendedTemplates: ['stock-variation'],
    defaultTemplate: 'stock-variation',
    category: 'inventory'
  },
  'lubricants-stock': {
    recommendedTemplates: ['lubricants-stock'],
    defaultTemplate: 'lubricants-stock',
    category: 'inventory'
  },
  'day-wise-stock-value': {
    recommendedTemplates: ['day-wise-stock-value'],
    defaultTemplate: 'day-wise-stock-value',
    category: 'inventory'
  },

  // Customer Reports
  'credit-customer': {
    recommendedTemplates: ['credit-customer'],
    defaultTemplate: 'credit-customer',
    category: 'customer'
  },
  'guest-customer-sales': {
    recommendedTemplates: ['guest-customer-sales'],
    defaultTemplate: 'guest-customer-sales',
    category: 'customer'
  },
  'customer-statement': {
    recommendedTemplates: ['customer-statement'],
    defaultTemplate: 'customer-statement',
    category: 'customer'
  },

  // Employee Reports
  'attendance': {
    recommendedTemplates: ['attendance'],
    defaultTemplate: 'attendance',
    category: 'employee'
  },
  'employee-status': {
    recommendedTemplates: ['employee-status'],
    defaultTemplate: 'employee-status',
    category: 'employee'
  },

  // Operational Reports
  'density-report': {
    recommendedTemplates: ['density-report'],
    defaultTemplate: 'density-report',
    category: 'operational'
  },
  'dsr-format': {
    recommendedTemplates: ['dsr-format'],
    defaultTemplate: 'dsr-format',
    category: 'operational'
  },
  'swipe-report': {
    recommendedTemplates: ['swipe-report'],
    defaultTemplate: 'swipe-report',
    category: 'operational'
  },

  // Transaction Reports
  'vendor-transaction': {
    recommendedTemplates: ['vendor-transaction'],
    defaultTemplate: 'vendor-transaction',
    category: 'transaction'
  },
  'bowser-transactions': {
    recommendedTemplates: ['bowser-transactions'],
    defaultTemplate: 'bowser-transactions',
    category: 'transaction'
  }
};

// Template Integration Functions
export const getReportTemplateMapping = (reportId) => {
  return TEMPLATE_REPORT_MAPPINGS[reportId] || {
    recommendedTemplates: [],
    defaultTemplate: null,
    category: 'general'
  };
};

export const getRecommendedTemplates = (reportId) => {
  const mapping = getReportTemplateMapping(reportId);
  return mapping.recommendedTemplates;
};

export const getDefaultTemplate = (reportId) => {
  const mapping = getReportTemplateMapping(reportId);
  return mapping.defaultTemplate;
};

export const getReportCategory = (reportId) => {
  const mapping = getReportTemplateMapping(reportId);
  return mapping.category;
};

// Template Application Functions
export const applyTemplateToReport = (reportData, templateId, customizations = {}) => {
  const { getTemplateById } = require('./reportTemplates');
  const template = getTemplateById(templateId);

  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }

  // Apply template layout to report data
  const enhancedReportData = {
    ...reportData,
    template: {
      id: templateId,
      name: template.name,
      layout: template.layout,
      styling: template.styling,
      customizations: {
        ...template.layout, // Default customizations
        ...customizations    // Override with user customizations
      }
    }
  };

  return enhancedReportData;
};

// Report Generation with Template
export const generateReportWithTemplate = (reportData, templateId, customizations = {}) => {
  const enhancedData = applyTemplateToReport(reportData, templateId, customizations);

  // Generate report sections based on template layout
  const reportSections = generateReportSections(enhancedData);

  return {
    ...enhancedData,
    sections: reportSections,
    generatedAt: new Date().toISOString(),
    templateVersion: '1.0'
  };
};

// Generate report sections based on template layout
const generateReportSections = (reportData) => {
  const { template, data, headers, title, dateRange, organization } = reportData;
  const sections = [];

  if (!template) {
    return sections;
  }

  template.layout.sections.forEach((sectionConfig, index) => {
    const section = {
      id: `section-${index + 1}`,
      type: sectionConfig.type,
      title: sectionConfig.title,
      config: sectionConfig,
      content: null
    };

    // Generate content based on section type
    switch (sectionConfig.type) {
      case 'summary-cards':
        section.content = generateSummaryCards(data, sectionConfig);
        break;
      case 'table':
        section.content = generateTable(headers, data, sectionConfig);
        break;
      case 'chart':
        section.content = generateChart(data, sectionConfig);
        break;
      case 'customer-info':
        section.content = generateCustomerInfo(data, sectionConfig);
        break;
      default:
        section.content = generateTextSection(data, sectionConfig);
    }

    sections.push(section);
  });

  return sections;
};

// Section Generators
const generateSummaryCards = (data, config) => {
  const cards = [];

  if (config.show && Array.isArray(config.show)) {
    config.show.forEach((metric, index) => {
      const value = calculateMetricValue(data, metric);
      cards.push({
        id: `card-${index + 1}`,
        title: metric.replace(/([A-Z])/g, ' $1').trim(),
        value: value,
        format: 'currency'
      });
    });
  } else {
    // Default summary cards
    cards.push(
      { id: 'card-1', title: 'Total Records', value: data.length, format: 'number' },
      { id: 'card-2', title: 'Report Period', value: 'Current Period', format: 'text' }
    );
  }

  return cards;
};

const generateTable = (headers, data, config) => {
  return {
    headers: config.columns || headers,
    data: data,
    styling: {
      striped: true,
      bordered: true,
      hover: true
    }
  };
};

const generateChart = (data, config) => {
  return {
    type: config.type || 'bar',
    data: data,
    title: config.title,
    config: config
  };
};

const generateCustomerInfo = (data, config) => {
  return {
    fields: [
      { label: 'Customer Name', value: data.customerName || 'N/A' },
      { label: 'Account Number', value: data.accountNo || 'N/A' },
      { label: 'Phone', value: data.phone || 'N/A' },
      { label: 'Credit Limit', value: data.creditLimit || '₹0.00' }
    ]
  };
};

const generateTextSection = (data, config) => {
  return {
    content: `This is a ${config.title || 'text'} section with ${data.length} records.`,
    format: 'paragraph'
  };
};

// Helper function to calculate metric values
const calculateMetricValue = (data, metric) => {
  switch (metric.toLowerCase()) {
    case 'totalrecords':
      return data.length;
    case 'totalsales':
      return data.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    case 'totalquantity':
      return data.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
    case 'average':
      return data.length > 0 ? data.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0) / data.length : 0;
    default:
      return '0.00';
  }
};

// Template Validation
export const validateTemplateForReport = (templateId, reportId) => {
  const template = require('./reportTemplates').getTemplateById(templateId);
  const mapping = getReportTemplateMapping(reportId);

  if (!template) {
    return { valid: false, reason: 'Template not found' };
  }

  if (!mapping.recommendedTemplates.includes(templateId)) {
    return {
      valid: false,
      reason: `Template ${template.name} is not recommended for ${reportId} reports`,
      warning: true
    };
  }

  return { valid: true };
};

// Export/Import Template Configurations
export const exportTemplateConfiguration = (reportId, templateId, customizations) => {
  return {
    reportId,
    templateId,
    customizations,
    exportedAt: new Date().toISOString(),
    version: '1.0'
  };
};

export const importTemplateConfiguration = (config) => {
  // Validate configuration
  if (!config.reportId || !config.templateId) {
    throw new Error('Invalid template configuration');
  }

  return config;
};

// Default Template Configurations
export const getDefaultTemplateConfigurations = () => {
  const configurations = {};

  Object.entries(TEMPLATE_REPORT_MAPPINGS).forEach(([reportId, mapping]) => {
    if (mapping.defaultTemplate) {
      configurations[reportId] = {
        templateId: mapping.defaultTemplate,
        customizations: {
          showHeader: true,
          showFooter: true,
          showSummary: true,
          customTitle: '',
          customDescription: ''
        }
      };
    }
  });

  return configurations;
};