import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BackupRestorePage = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Backup & Restore</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">
            Backup and restore functionality is coming soon. This will allow you to backup and restore website data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupRestorePage;