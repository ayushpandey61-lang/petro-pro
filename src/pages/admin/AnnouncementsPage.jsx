import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AnnouncementsPage = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">
            Announcements management functionality is coming soon. This will allow you to create and manage website announcements.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementsPage;