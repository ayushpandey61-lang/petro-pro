import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Download, Settings, Copy } from 'lucide-react';
import { getTemplateById, TEMPLATE_TYPES } from '@/lib/reportTemplates';

const TemplatePreview = ({
  templateId,
  isOpen,
  onClose,
  onUse,
  onEdit
}) => {
  const template = getTemplateById(templateId);

  if (!template) {
    return null;
  }

  const getTypeColor = (type) => {
    switch (type) {
      case TEMPLATE_TYPES.STANDARD:
        return 'bg-blue-100 text-blue-800';
      case TEMPLATE_TYPES.DETAILED:
        return 'bg-green-100 text-green-800';
      case TEMPLATE_TYPES.SUMMARY:
        return 'bg-purple-100 text-purple-800';
      case TEMPLATE_TYPES.COMPACT:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      business: '📊',
      financial: '💰',
      inventory: '📦',
      customer: '👥',
      employee: '👨‍💼',
      operational: '⚙️',
      transaction: '🔄'
    };
    return icons[category] || '📄';
  };

  const getSectionTypeIcon = (type) => {
    const icons = {
      'summary-cards': '📊',
      'table': '📋',
      'chart': '📈',
      'customer-info': '👤',
      'text': '📝'
    };
    return icons[type] || '📄';
  };

  const renderMockContent = (section) => {
    switch (section.type) {
      case 'summary-cards':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {section.show?.map((item, index) => (
              <div key={index} className="bg-gray-100 rounded p-3 text-center">
                <div className="text-sm font-medium text-gray-600 capitalize">
                  {item.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-lg font-bold text-gray-800">₹0.00</div>
              </div>
            )) || (
              <>
                <div className="bg-gray-100 rounded p-3 text-center">
                  <div className="text-sm font-medium text-gray-600">Metric 1</div>
                  <div className="text-lg font-bold text-gray-800">₹0.00</div>
                </div>
                <div className="bg-gray-100 rounded p-3 text-center">
                  <div className="text-sm font-medium text-gray-600">Metric 2</div>
                  <div className="text-lg font-bold text-gray-800">₹0.00</div>
                </div>
              </>
            )}
          </div>
        );

      case 'table':
        return (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {section.columns?.map((col, index) => (
                    <th key={index} className="p-2 text-left font-medium">
                      {col.replace(/([A-Z])/g, ' $1').trim()}
                    </th>
                  )) || (
                    <>
                      <th className="p-2 text-left font-medium">Column 1</th>
                      <th className="p-2 text-left font-medium">Column 2</th>
                      <th className="p-2 text-left font-medium">Column 3</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2">Sample Data 1</td>
                  <td className="p-2">Sample Data 2</td>
                  <td className="p-2">Sample Data 3</td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="p-2">Sample Data 4</td>
                  <td className="p-2">Sample Data 5</td>
                  <td className="p-2">Sample Data 6</td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case 'chart':
        return (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <div className="text-4xl mb-2">📈</div>
            <div className="text-sm text-gray-600">
              {section.type === 'line' ? 'Line Chart' :
               section.type === 'bar' ? 'Bar Chart' :
               section.type === 'pie' ? 'Pie Chart' : 'Chart'} Preview
            </div>
          </div>
        );

      case 'customer-info':
        return (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Customer Name:</span>
                <div className="text-gray-600">Sample Customer</div>
              </div>
              <div>
                <span className="font-medium">Account No:</span>
                <div className="text-gray-600">CUST001</div>
              </div>
              <div>
                <span className="font-medium">Phone:</span>
                <div className="text-gray-600">+91 9876543210</div>
              </div>
              <div>
                <span className="font-medium">Credit Limit:</span>
                <div className="text-gray-600">₹50,000.00</div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-100 rounded p-4 text-center text-gray-600">
            {section.title || 'Section'} Preview
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{getCategoryIcon(template.category)}</span>
            <div>
              <div className="text-xl">{template.name}</div>
              <div className="text-sm text-muted-foreground font-normal">
                {template.description}
              </div>
            </div>
            <Badge className={getTypeColor(template.type)}>
              {template.type}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button onClick={() => onUse && onUse(template)} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Use This Template
          </Button>
          {onEdit && (
            <Button variant="outline" onClick={() => onEdit(template)}>
              <Settings className="w-4 h-4 mr-2" />
              Edit Template
            </Button>
          )}
        </div>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Template Layout Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Template Layout Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {template.layout.sections.map((section, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{getSectionTypeIcon(section.type)}</span>
                      <h4 className="font-medium">{section.title || `${section.type} Section`}</h4>
                    </div>
                    {renderMockContent(section)}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Template Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Template Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium mb-2">Header Settings:</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li className="flex items-center gap-2">
                        <span className={template.layout.header.showLogo ? 'text-green-600' : 'text-red-600'}>
                          {template.layout.header.showLogo ? '✓' : '✗'}
                        </span>
                        Company Logo
                      </li>
                      <li className="flex items-center gap-2">
                        <span className={template.layout.header.showCompanyInfo ? 'text-green-600' : 'text-red-600'}>
                          {template.layout.header.showCompanyInfo ? '✓' : '✗'}
                        </span>
                        Company Information
                      </li>
                      <li className="flex items-center gap-2">
                        <span className={template.layout.header.showDateRange ? 'text-green-600' : 'text-red-600'}>
                          {template.layout.header.showDateRange ? '✓' : '✗'}
                        </span>
                        Date Range
                      </li>
                      <li className="flex items-center gap-2">
                        <span className={template.layout.header.showReportTitle ? 'text-green-600' : 'text-red-600'}>
                          {template.layout.header.showReportTitle ? '✓' : '✗'}
                        </span>
                        Report Title
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Footer Settings:</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li className="flex items-center gap-2">
                        <span className={template.layout.footer.showGeneratedBy ? 'text-green-600' : 'text-red-600'}>
                          {template.layout.footer.showGeneratedBy ? '✓' : '✗'}
                        </span>
                        Generated By
                      </li>
                      <li className="flex items-center gap-2">
                        <span className={template.layout.footer.showTimestamp ? 'text-green-600' : 'text-red-600'}>
                          {template.layout.footer.showTimestamp ? '✓' : '✗'}
                        </span>
                        Timestamp
                      </li>
                      <li className="flex items-center gap-2">
                        <span className={template.layout.footer.showPageNumbers ? 'text-green-600' : 'text-red-600'}>
                          {template.layout.footer.showPageNumbers ? '✓' : '✗'}
                        </span>
                        Page Numbers
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Styling Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Styling Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium">Primary Color</div>
                    <div
                      className="w-8 h-8 rounded mx-auto mt-1 border"
                      style={{ backgroundColor: template.styling.primaryColor }}
                    ></div>
                    <div className="text-xs text-gray-600 mt-1">
                      {template.styling.primaryColor}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Secondary Color</div>
                    <div
                      className="w-8 h-8 rounded mx-auto mt-1 border"
                      style={{ backgroundColor: template.styling.secondaryColor }}
                    ></div>
                    <div className="text-xs text-gray-600 mt-1">
                      {template.styling.secondaryColor}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Font Size</div>
                    <div className="text-lg mt-1">{template.styling.fontSize}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Header Size</div>
                    <div className="text-lg mt-1">{template.styling.headerFontSize}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreview;