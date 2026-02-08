import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Download,
  RefreshCw,
  Calendar,
  Filter
} from 'lucide-react';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalVisitors: 15420,
      pageViews: 45230,
      avgSessionDuration: '3:24',
      bounceRate: '42.3%'
    },
    trafficSources: [
      { source: 'Organic Search', visitors: 8234, percentage: 53.4 },
      { source: 'Direct', visitors: 4521, percentage: 29.3 },
      { source: 'Social Media', visitors: 1890, percentage: 12.3 },
      { source: 'Referral', visitors: 775, percentage: 5.0 }
    ],
    topPages: [
      { page: '/', views: 12450, percentage: 27.5 },
      { page: '/products', views: 8920, percentage: 19.7 },
      { page: '/about', views: 6780, percentage: 15.0 },
      { page: '/contact', views: 5430, percentage: 12.0 },
      { page: '/services', views: 4320, percentage: 9.5 }
    ],
    devices: [
      { type: 'Desktop', users: 8920, percentage: 57.8, icon: Monitor },
      { type: 'Mobile', users: 5430, percentage: 35.2, icon: Smartphone },
      { type: 'Tablet', users: 1070, percentage: 6.9, icon: Tablet }
    ],
    realTime: {
      activeUsers: 127,
      topPages: [
        { page: '/', users: 45 },
        { page: '/products', users: 32 },
        { page: '/contact', users: 28 }
      ]
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const formatPercentage = (num) => {
    return `${num}%`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Website Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Monitor your website performance and user engagement
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {timeRange === '7d' ? 'Last 7 days' : timeRange === '30d' ? 'Last 30 days' : 'Last 90 days'}
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {[
          { label: '7 days', value: '7d' },
          { label: '30 days', value: '30d' },
          { label: '90 days', value: '90d' }
        ].map(range => (
          <Button
            key={range.value}
            variant={timeRange === range.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(range.value)}
          >
            {range.label}
          </Button>
        ))}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Visitors</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(analyticsData.overview.totalVisitors)}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +12.5% from last period
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Page Views</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(analyticsData.overview.pageViews)}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +8.2% from last period
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Session</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.overview.avgSessionDuration}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  <TrendingUp className="w-3 h-3 inline mr-1 rotate-180" />
                  -2.1% from last period
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bounce Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.overview.bounceRate}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  -5.3% from last period
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="traffic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="traffic" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Traffic Sources
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Top Pages
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Devices
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Real-time
          </TabsTrigger>
        </TabsList>

        {/* Traffic Sources */}
        <TabsContent value="traffic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="font-medium">{source.source}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatNumber(source.visitors)} visitors
                      </span>
                      <Badge variant="secondary">
                        {formatPercentage(source.percentage)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Pages */}
        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                          {index + 1}
                        </span>
                      </div>
                      <span className="font-medium">{page.page}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatNumber(page.views)} views
                      </span>
                      <Badge variant="outline">
                        {formatPercentage(page.percentage)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Devices */}
        <TabsContent value="devices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.devices.map((device, index) => {
                  const Icon = device.icon;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="font-medium">{device.type}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {formatNumber(device.users)} users
                        </span>
                        <Badge variant="secondary">
                          {formatPercentage(device.percentage)}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Real-time */}
        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Active Users Right Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {analyticsData.realTime.activeUsers}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">users currently on your site</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Pages (Real-time)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.realTime.topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{page.page}</span>
                      <Badge variant="outline">
                        {page.users} users
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Analytics data is updated every 5 minutes</p>
        <p className="mt-1">Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default AnalyticsPage;