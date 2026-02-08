import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuth from '@/hooks/useAuth';

const UserProfilePage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', email: `${user?.username || 'user'}@example.com` });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = () => {
    toast({
      title: "Profile Saved!",
      description: "Your personal information has been updated. (This is a mock-up, data is not persisted)",
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User /> User Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={profile.name} onChange={handleProfileChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={profile.email} onChange={handleProfileChange} />
          </div>
          <Button variant="outline">Change Password</Button>
          <div className="flex justify-end">
            <Button onClick={handleSaveChanges}><Save className="mr-2 h-4 w-4" />Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserProfilePage;