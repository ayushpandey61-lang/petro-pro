import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  FileText,
  Image,
  BarChart3,
  Settings,
  Globe,
  Megaphone,
  Shield,
  Activity,
  TrendingUp,
  Eye,
  Edit,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useOrg } from '@/hooks/useOrg';

const AdminDashboard = () => {
  const { orgDetails } = useOrg();

  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Pages',
      value: '24',
      change: '+3',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Media Files',
      value: '156',
      change: '+8',
      icon: Image,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Page Views',
      value: '45.2K',
      change: '+23%',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const recentActivities = [
    {
      action: 'Page Updated',
      item: 'Home Page',
      time: '2 minutes ago',
      type: 'update',
      user: 'Admin'
    },
    {
      action: 'New Image Added',
      item: 'Gallery Section',
      time: '15 minutes ago',
      type: 'create',
      user: 'Admin'
    },
    {
      action: 'SEO Settings Modified',
      item: 'Meta Tags',
      time: '1 hour ago',
      type: 'update',
      user: 'Admin'
    },
    {
      action: 'User Registered',
      item: 'John Doe',
      time: '2 hours ago',
      type: 'create',
      user: 'System'
    }
  ];

  const quickActions = [
    {
      title: 'Create New Page',
      description: 'Add a new page to your website',
      icon: Plus,
      action: () => console.log('Create page'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Upload Media',
      description: 'Add images, videos, or documents',
      icon: Image,
      action: () => console.log('Upload media'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Edit Content',
      description: 'Modify existing page content',
      icon: Edit,
      action: () => console.log('Edit content'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'View Analytics',
      description: 'Check website performance',
      icon: BarChart3,
      action: () => console.log('View analytics'),
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  const systemStatus = [
    {
      component: 'Website',
      status: 'Online',
      uptime: '99.9%',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      component: 'Database',
      status: 'Healthy',
      uptime: '100%',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      component: 'Backup',
      status: 'Last: 2h ago',
      uptime: 'Auto',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      component: 'Security',
      status: 'Protected',
      uptime: 'Active',
      icon: Shield,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Welcome back! Here's what's happening with your website.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Organization Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {orgDetails.firmName || 'Organization Name'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {orgDetails.address || 'Address not set'} • {orgDetails.contactNo || 'Contact not set'}
              </p>
            </div>
            <div className="ml-auto">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className={`h-auto p-4 flex flex-col items-center gap-3 ${action.color} text-white border-none`}
                    onClick={action.action}
                  >
                    <Icon className="w-8 h-8" />
                    <div className="text-center">
                      <div className="font-semibold">{action.title}</div>
                      <div className="text-sm opacity-90">{action.description}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <span className="font-medium">{item.component}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{item.status}</div>
                      <div className="text-xs text-gray-500">{item.uptime}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  {activity.type === 'create' && <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  {activity.type === 'update' && <Edit className="w-4 h-4 text-green-600 dark:text-green-400" />}
                  {activity.type === 'delete' && <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {activity.action}: <span className="text-blue-600 dark:text-blue-400">{activity.item}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    by {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Petrol Pump Management System - Admin Panel</p>
        <p className="mt-1">Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;