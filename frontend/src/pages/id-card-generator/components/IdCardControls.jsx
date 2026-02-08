import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import ContentSettings from './ContentSettings';
import ImageSettings from './ImageSettings';
import StyleSettings from './StyleSettings';
import TemplateManager from './TemplateManager';

const IdCardControls = ({ content, setContent, images, setImages, styles, setStyles, templates, loadTemplate, deleteTemplate, employees, loadEmployeeData }) => {
  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="p-4">
              <TabsContent value="content">
                <ContentSettings content={content} setContent={setContent} employees={employees} loadEmployeeData={loadEmployeeData} />
              </TabsContent>
              <TabsContent value="images">
                <ImageSettings images={images} setImages={setImages} content={content} />
              </TabsContent>
              <TabsContent value="style">
                <StyleSettings styles={styles} setStyles={setStyles} />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
        <div className="p-4 border-t">
            <TemplateManager templates={templates} loadTemplate={loadTemplate} deleteTemplate={deleteTemplate} />
        </div>
      </CardContent>
    </Card>
  );
};

export default IdCardControls;