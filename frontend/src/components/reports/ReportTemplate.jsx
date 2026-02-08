import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download, Settings, Copy } from 'lucide-react';
import { getTemplateById, TEMPLATE_TYPES } from '@/lib/reportTemplates';

const ReportTemplate = ({
  templateId,
  onPreview,
  onUse,
  onEdit,
  showActions = true
}) => {
  const template = getTemplateById(templateId);

  if (!template) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <p className="text-red-600">Template not found: {templateId}</p>
        </CardContent>
      </Card>
    );
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

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {getCategoryIcon(template.category)}
            </div>
            <div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {template.description}
              </p>
            </div>
          </div>
          <Badge className={getTypeColor(template.type)}>
            {template.type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Template Layout Preview */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium mb-2">Layout Sections:</h4>
            <div className="space-y-1">
              {template.layout.sections.map((section, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="capitalize">{section.type}</span>
                  {section.title && <span>- {section.title}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Template Features */}
          <div className="flex flex-wrap gap-2">
            {template.layout.header.showLogo && (
              <Badge variant="outline" className="text-xs">Logo</Badge>
            )}
            {template.layout.header.showCompanyInfo && (
              <Badge variant="outline" className="text-xs">Company Info</Badge>
            )}
            {template.layout.sections.some(s => s.type === 'chart') && (
              <Badge variant="outline" className="text-xs">Charts</Badge>
            )}
            {template.layout.sections.some(s => s.type === 'summary-cards') && (
              <Badge variant="outline" className="text-xs">Summary Cards</Badge>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onPreview && onPreview(template)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
              <Button
                size="sm"
                onClick={() => onUse && onUse(template)}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-1" />
                Use Template
              </Button>
              {onEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(template)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportTemplate;