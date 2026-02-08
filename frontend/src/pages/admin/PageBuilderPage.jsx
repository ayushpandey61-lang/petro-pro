import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PageBuilderPage = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Page Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">
            Page Builder functionality is coming soon. This will allow you to create and edit website pages visually.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageBuilderPage;