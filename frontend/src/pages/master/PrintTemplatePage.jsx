import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, List, Plus } from 'lucide-react';
import TemplateCategory from '@/components/reports/TemplateCategory';
import TemplatePreview from '@/components/reports/TemplatePreview';
import ReportTemplate from '@/components/reports/ReportTemplate';
import {
  REPORT_CATEGORIES,
  REPORT_TEMPLATES,
  getAllTemplates,
  getCategoryInfo,
  TEMPLATE_TYPES
} from '@/lib/reportTemplates';

const PrintTemplatePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  // Get all templates
  const allTemplates = getAllTemplates();
  const categories = Object.keys(REPORT_TEMPLATES);

  // Filter templates based on search and filters
  const filteredTemplates = Object.entries(allTemplates).filter(([templateId, template]) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesType = selectedType === 'all' || template.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const handlePreview = (template) => {
    setPreviewTemplate(template);
  };

  const handleUseTemplate = (template) => {
    // TODO: Implement template usage logic
    console.log('Using template:', template);
    // This would typically open a report with the selected template
  };

  const handleEditTemplate = (template) => {
    // TODO: Implement template editing logic
    console.log('Editing template:', template);
  };

  const getTemplateCount = () => {
    return filteredTemplates.length;
  };

  const getCategoryCount = (category) => {
    if (category === 'all') return Object.keys(allTemplates).length;
    return Object.keys(REPORT_TEMPLATES[category]?.templates || {}).length;
  };

  return (
    <>
      <Helmet>
        <title>Report Templates - PetroPro</title>
        <meta name="description" content="Manage and preview report templates categorized by business function." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6"
      >
        {/* Header */}
        <Card className="bg-primary/5">
          <CardHeader className="bg-primary text-primary-foreground p-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Report Templates</CardTitle>
                <p className="text-primary-foreground/80 mt-1">
                  Manage and customize report templates for different business functions
                </p>
              </div>
              <Button className="bg-white text-primary hover:bg-gray-100">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories ({getCategoryCount('all')})</SelectItem>
                  {categories.map(category => {
                    const categoryInfo = getCategoryInfo(category);
                    return (
                      <SelectItem key={category} value={category}>
                        {categoryInfo.icon} {categoryInfo.name} ({getCategoryCount(category)})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={TEMPLATE_TYPES.STANDARD}>Standard</SelectItem>
                  <SelectItem value={TEMPLATE_TYPES.DETAILED}>Detailed</SelectItem>
                  <SelectItem value={TEMPLATE_TYPES.SUMMARY}>Summary</SelectItem>
                  <SelectItem value={TEMPLATE_TYPES.COMPACT}>Compact</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {getTemplateCount()} of {Object.keys(allTemplates).length} templates
              </div>
              <div className="flex gap-2">
                {selectedCategory !== 'all' && (
                  <Badge variant="outline">
                    Category: {getCategoryInfo(selectedCategory)?.name}
                  </Badge>
                )}
                {selectedType !== 'all' && (
                  <Badge variant="outline">
                    Type: {selectedType}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Display */}
        {selectedCategory === 'all' ? (
          // Show all templates grouped by category
          <div className="space-y-6">
            {categories.map(category => (
              <TemplateCategory
                key={category}
                category={category}
                onPreview={handlePreview}
                onUse={handleUseTemplate}
                onEdit={handleEditTemplate}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            ))}
          </div>
        ) : (
          // Show templates for selected category
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-2xl">{getCategoryInfo(selectedCategory)?.icon}</span>
                {getCategoryInfo(selectedCategory)?.name}
                <Badge variant="secondary">
                  {getCategoryCount(selectedCategory)} templates
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={
                viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-4"
              }>
                {filteredTemplates.map(([templateId, template]) => (
                  <ReportTemplate
                    key={templateId}
                    templateId={templateId}
                    onPreview={handlePreview}
                    onUse={handleUseTemplate}
                    onEdit={handleEditTemplate}
                    showActions={true}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Template Preview Modal */}
        {previewTemplate && (
          <TemplatePreview
            templateId={previewTemplate.id}
            isOpen={!!previewTemplate}
            onClose={() => setPreviewTemplate(null)}
            onUse={handleUseTemplate}
            onEdit={handleEditTemplate}
          />
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Import Templates</Button>
          <Button variant="outline">Export Templates</Button>
          <Button className="bg-green-600 hover:bg-green-700">Save Changes</Button>
        </div>
      </motion.div>
    </>
  );
};

export default PrintTemplatePage;