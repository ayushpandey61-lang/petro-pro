import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const NotificationsSettingsPage = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({ email: true, push: false, sms: false });

  const handleNotificationChange = (name, checked) => {
    setNotifications({ ...notifications, [name]: checked });
  };

  const handleSaveChanges = () => {
    toast({
      title: "Preferences Saved!",
      description: "Your notification settings have been updated.",
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell /> Notifications</CardTitle>
          <CardDescription>Manage your notification preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch id="email-notifications" checked={notifications.email} onCheckedChange={(c) => handleNotificationChange('email', c)} />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label htmlFor="push-notifications">Push Notifications</Label>
            <Switch id="push-notifications" checked={notifications.push} onCheckedChange={(c) => handleNotificationChange('push', c)} />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label htmlFor="sms-notifications">SMS Notifications</Label>
            <Switch id="sms-notifications" checked={notifications.sms} onCheckedChange={(c) => handleNotificationChange('sms', c)} />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveChanges}><Save className="mr-2 h-4 w-4" />Save Preferences</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationsSettingsPage;