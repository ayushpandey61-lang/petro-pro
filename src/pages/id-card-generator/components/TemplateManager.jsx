import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2 } from 'lucide-react';

const TemplateManager = ({ templates, loadTemplate, deleteTemplate }) => {
  return (
    <div>
        <h3 className="text-lg font-semibold mb-2">Saved Templates</h3>
        <ScrollArea className="h-24">
            <div className="space-y-2">
            {templates.length > 0 ? templates.map(template => (
                <div key={template.id} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                <span className="text-sm font-medium">{template.name}</span>
                <div className="space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => loadTemplate(template)}>Load</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteTemplate(template.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                </div>
            )) : (
                <p className="text-sm text-muted-foreground text-center py-4">No saved templates.</p>
            )}
            </div>
        </ScrollArea>
    </div>
  );
};

export default TemplateManager;