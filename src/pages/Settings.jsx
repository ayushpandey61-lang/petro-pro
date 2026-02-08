import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { User, Bell, Palette, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const settingsLinks = [
  { path: '/settings/user-profile', name: 'User Profile', icon: User },
  { path: '/settings/notifications', name: 'Notifications', icon: Bell },
  { path: '/settings/appearance', name: 'Appearance', icon: Palette },
];

const Settings = () => {
  return (
    <>
      <Helmet>
        <title>Settings - PetroPro</title>
        <meta name="description" content="Manage your application settings." />
      </Helmet>
      <div className="p-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-6 text-foreground"
        >
          Settings
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-6"
        >
          <Card className="w-full md:w-1/4 h-fit sticky top-6">
            <CardContent className="p-2">
              <nav className="flex flex-col space-y-1">
                {settingsLinks.map(link => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                        isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      }`
                    }
                  >
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </NavLink>
                ))}
              </nav>
            </CardContent>
          </Card>
          <div className="w-full md:w-3/4">
            <Outlet />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Settings;