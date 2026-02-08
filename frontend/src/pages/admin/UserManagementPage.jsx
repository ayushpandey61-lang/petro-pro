import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UserManagementPage = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">
            User management functionality is coming soon. This will allow you to manage website users and their permissions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementPage;