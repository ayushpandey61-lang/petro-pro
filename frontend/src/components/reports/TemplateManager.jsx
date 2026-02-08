import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Link, Settings, Save, X } from 'lucide-react';
import { getAllTemplates, getTemplateById, REPORT_CATEGORIES } from '@/lib/reportTemplates';

const TemplateManager = ({
  reportId,
  reportName,
  currentTemplateId,
  onTemplateChange,
  onSave
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(currentTemplateId || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customizations, setCustomizations] = useState({
    showHeader: true,
    showFooter: true,
    showSummary: true,
    customTitle: '',
    customDescription: ''
  });

  const allTemplates = getAllTemplates();
  const currentTemplate = getTemplateById(selectedTemplateId);

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplateId(templateId);
    const template = getTemplateById(templateId);
    if (template) {
      // Auto-populate customizations based on template defaults
      setCustomizations(prev => ({
        ...prev,
        showHeader: template.layout.header.showLogo || template.layout.header.showCompanyInfo,
        showFooter: template.layout.footer.showGeneratedBy || template.layout.footer.showTimestamp,
        showSummary: template.layout.sections.some(s => s.type === 'summary-cards'),
        customTitle: template.name,
        customDescription: template.description
      }));
    }
  };

  const handleSave = () => {
    const templateConfig = {
      templateId: selectedTemplateId,
      customizations,
      reportId,
      reportName
    };

    if (onSave) {
      onSave(templateConfig);
    }

    if (onTemplateChange) {
      onTemplateChange(selectedTemplateId);
    }

    setIsDialogOpen(false);
  };

  const getReportTypeIcon = (reportId) => {
    // Map report IDs to appropriate icons
    const iconMap = {
      'daily-business-summary': '📊',
      'sales': '💰',
      'purchase': '🛒',
      'inventory': '📦',
      'customer': '👥',
      'employee': '👨‍💼',
      'attendance': '📋',
      'financial': '💳'
    };

    return iconMap[reportId] || '📄';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Template Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Template Display */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Current Template</Label>
          <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-3">
              <span className="text-lg">
                {currentTemplate ? getReportTypeIcon(currentTemplate.category) : '📄'}
              </span>
              <div>
                <div className="font-medium">
                  {currentTemplate?.name || 'No template selected'}
                </div>
                {currentTemplate && (
                  <div className="text-sm text-gray-600">
                    {currentTemplate.description}
                  </div>
                )}
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Link className="w-4 h-4 mr-2" />
                  {currentTemplate ? 'Change Template' : 'Select Template'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Select Template for {reportName}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Template Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Choose Template</Label>
                    <Select value={selectedTemplateId} onValueChange={handleTemplateSelect}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a template..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Template</SelectItem>
                        {Object.entries(allTemplates).map(([templateId, template]) => (
                          <SelectItem key={templateId} value={templateId}>
                            <div className="flex items-center gap-2">
                              <span>{getReportTypeIcon(template.category)}</span>
                              <span>{template.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {template.type}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Template Preview */}
                  {currentTemplate && (
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Template Preview</Label>
                      <Card className="border-2 border-blue-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getReportTypeIcon(currentTemplate.category)}</span>
                              <div>
                                <div className="font-medium">{currentTemplate.name}</div>
                                <div className="text-sm text-gray-600">{currentTemplate.description}</div>
                              </div>
                            </div>
                            <Badge className={
                              currentTemplate.type === 'standard' ? 'bg-blue-100 text-blue-800' :
                              currentTemplate.type === 'detailed' ? 'bg-green-100 text-green-800' :
                              currentTemplate.type === 'summary' ? 'bg-purple-100 text-purple-800' :
                              'bg-orange-100 text-orange-800'
                            }>
                              {currentTemplate.type}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Category:</span>
                              <span>{REPORT_CATEGORIES[currentTemplate.category.toUpperCase()]?.name || currentTemplate.category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Sections:</span>
                              <span>{currentTemplate.layout.sections.length} sections</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Features:</span>
                              <div className="flex gap-1">
                                {currentTemplate.layout.header.showLogo && <Badge variant="outline" className="text-xs">Logo</Badge>}
                                {currentTemplate.layout.header.showCompanyInfo && <Badge variant="outline" className="text-xs">Company Info</Badge>}
                                {currentTemplate.layout.sections.some(s => s.type === 'chart') && <Badge variant="outline" className="text-xs">Charts</Badge>}
                                {currentTemplate.layout.sections.some(s => s.type === 'summary-cards') && <Badge variant="outline" className="text-xs">Summary Cards</Badge>}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Template Customization */}
                  {currentTemplate && (
                    <div className="space-y-4">
                      <Separator />
                      <Label className="text-base font-medium">Template Customization</Label>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="show-header">Show Header</Label>
                            <Switch
                              id="show-header"
                              checked={customizations.showHeader}
                              onCheckedChange={(checked) =>
                                setCustomizations(prev => ({ ...prev, showHeader: checked }))
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="show-footer">Show Footer</Label>
                            <Switch
                              id="show-footer"
                              checked={customizations.showFooter}
                              onCheckedChange={(checked) =>
                                setCustomizations(prev => ({ ...prev, showFooter: checked }))
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="show-summary">Show Summary</Label>
                            <Switch
                              id="show-summary"
                              checked={customizations.showSummary}
                              onCheckedChange={(checked) =>
                                setCustomizations(prev => ({ ...prev, showSummary: checked }))
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="custom-title">Custom Title</Label>
                            <Input
                              id="custom-title"
                              value={customizations.customTitle}
                              onChange={(e) =>
                                setCustomizations(prev => ({ ...prev, customTitle: e.target.value }))
                              }
                              placeholder="Enter custom title..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="custom-description">Custom Description</Label>
                            <Textarea
                              id="custom-description"
                              value={customizations.customDescription}
                              onChange={(e) =>
                                setCustomizations(prev => ({ ...prev, customDescription: e.target.value }))
                              }
                              placeholder="Enter custom description..."
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Template
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Template Features */}
        {currentTemplate && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Template Features</Label>
            <div className="flex flex-wrap gap-2">
              {currentTemplate.layout.header.showLogo && (
                <Badge variant="outline" className="text-xs">Company Logo</Badge>
              )}
              {currentTemplate.layout.header.showCompanyInfo && (
                <Badge variant="outline" className="text-xs">Company Info</Badge>
              )}
              {currentTemplate.layout.header.showDateRange && (
                <Badge variant="outline" className="text-xs">Date Range</Badge>
              )}
              {currentTemplate.layout.sections.some(s => s.type === 'chart') && (
                <Badge variant="outline" className="text-xs">Charts</Badge>
              )}
              {currentTemplate.layout.sections.some(s => s.type === 'summary-cards') && (
                <Badge variant="outline" className="text-xs">Summary Cards</Badge>
              )}
              {currentTemplate.layout.footer.showGeneratedBy && (
                <Badge variant="outline" className="text-xs">Generated By</Badge>
              )}
              {currentTemplate.layout.footer.showTimestamp && (
                <Badge variant="outline" className="text-xs">Timestamp</Badge>
              )}
            </div>
          </div>
        )}

        {/* Template Statistics */}
        {currentTemplate && (
          <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {currentTemplate.layout.sections.length}
              </div>
              <div className="text-xs text-gray-600">Sections</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {currentTemplate.layout.sections.filter(s => s.type === 'table').length}
              </div>
              <div className="text-xs text-gray-600">Tables</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {currentTemplate.layout.sections.filter(s => s.type === 'chart').length}
              </div>
              <div className="text-xs text-gray-600">Charts</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TemplateManager;