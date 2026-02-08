import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Grid, List } from 'lucide-react';
import ReportTemplate from './ReportTemplate';
import { REPORT_CATEGORIES, getCategoryInfo } from '@/lib/reportTemplates';

const TemplateCategory = ({
  category,
  onPreview,
  onUse,
  onEdit,
  viewMode = 'grid',
  onViewModeChange
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const categoryInfo = getCategoryInfo(category);

  if (!categoryInfo) {
    return null;
  }

  const templateCount = Object.keys(categoryInfo.templates).length;

  const handleViewModeToggle = () => {
    onViewModeChange && onViewModeChange(viewMode === 'grid' ? 'list' : 'grid');
  };

  return (
    <Card className="mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{categoryInfo.icon}</div>
                <div>
                  <CardTitle className="text-xl">{categoryInfo.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {categoryInfo.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  {templateCount} template{templateCount !== 1 ? 's' : ''}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewModeToggle();
                  }}
                >
                  {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                </Button>
                {isOpen ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-4"
            }>
              {Object.entries(categoryInfo.templates).map(([templateId, template]) => (
                <ReportTemplate
                  key={templateId}
                  templateId={templateId}
                  onPreview={onPreview}
                  onUse={onUse}
                  onEdit={onEdit}
                  showActions={true}
                />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default TemplateCategory;