import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Save,
  Globe,
  Search,
  BarChart3,
  Share2,
  Eye,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Settings,
  Plus,
  Trash2
} from 'lucide-react';
import { useOrg } from '@/hooks/useOrg';

const SEOSettingsPage = () => {
  const { orgDetails } = useOrg();

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: `${orgDetails.firmName || 'Petrol Pump'} - Quality Fuel Services`,
    metaDescription: `Visit ${orgDetails.firmName || 'our petrol pump'} for quality fuel and excellent service. Located at ${orgDetails.address || 'your location'}.`,
    keywords: ['petrol pump', 'fuel station', 'diesel', 'petrol', 'CNG', 'fuel services'],
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: 'summary_large_image',
    canonicalUrl: '',
    robotsMeta: 'index, follow',
    structuredData: true
  });

  const [sitemapSettings, setSitemapSettings] = useState({
    autoGenerate: true,
    includeImages: true,
    updateFrequency: 'daily',
    priority: {
      home: 1.0,
      products: 0.8,
      about: 0.6,
      contact: 0.7
    }
  });

  const [analytics, setAnalytics] = useState({
    googleAnalyticsId: '',
    facebookPixelId: '',
    enableTracking: false,
    trackEvents: {
      pageViews: true,
      buttonClicks: false,
      formSubmissions: true,
      purchases: true
    }
  });

  const handleSave = () => {
    console.log('Saving SEO settings:', { seoSettings, sitemapSettings, analytics });
    // Here you would typically save to backend
  };

  const updateSEOSetting = (field, value) => {
    setSeoSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addKeyword = (keyword) => {
    if (keyword && !seoSettings.keywords.includes(keyword)) {
      setSeoSettings(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword]
      }));
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setSeoSettings(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keywordToRemove)
    }));
  };

  const seoScore = Math.floor(Math.random() * 40) + 60; // Mock score

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            SEO Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Optimize your website for search engines and improve visibility
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </div>

      {/* SEO Score */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">SEO Score</h3>
              <p className="text-gray-600 dark:text-gray-400">Overall website optimization</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{seoScore}%</div>
              <Badge variant={seoScore > 80 ? "default" : seoScore > 60 ? "secondary" : "destructive"}>
                {seoScore > 80 ? "Excellent" : seoScore > 60 ? "Good" : "Needs Improvement"}
              </Badge>
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${seoScore}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="meta" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="meta" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Meta Tags
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="sitemap" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Sitemap
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Meta Tags Tab */}
        <TabsContent value="meta" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Meta Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={seoSettings.metaTitle}
                  onChange={(e) => updateSEOSetting('metaTitle', e.target.value)}
                  placeholder="Enter meta title"
                />
                <p className="text-sm text-gray-500">
                  {seoSettings.metaTitle.length}/60 characters (recommended)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={seoSettings.metaDescription}
                  onChange={(e) => updateSEOSetting('metaDescription', e.target.value)}
                  placeholder="Enter meta description"
                  rows={3}
                />
                <p className="text-sm text-gray-500">
                  {seoSettings.metaDescription.length}/160 characters (recommended)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Keywords</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add keyword"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addKeyword(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <Button onClick={() => {
                    const input = document.querySelector('input[placeholder="Add keyword"]');
                    if (input.value) {
                      addKeyword(input.value);
                      input.value = '';
                    }
                  }}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {seoSettings.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {keyword}
                      <Trash2
                        className="w-3 h-3 cursor-pointer hover:text-red-600"
                        onClick={() => removeKeyword(keyword)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input
                  id="canonicalUrl"
                  value={seoSettings.canonicalUrl}
                  onChange={(e) => updateSEOSetting('canonicalUrl', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="robotsMeta">Robots Meta</Label>
                <Input
                  id="robotsMeta"
                  value={seoSettings.robotsMeta}
                  onChange={(e) => updateSEOSetting('robotsMeta', e.target.value)}
                  placeholder="index, follow"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Open Graph (Facebook)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ogTitle">OG Title</Label>
                <Input
                  id="ogTitle"
                  value={seoSettings.ogTitle}
                  onChange={(e) => updateSEOSetting('ogTitle', e.target.value)}
                  placeholder="Title for social media sharing"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogDescription">OG Description</Label>
                <Textarea
                  id="ogDescription"
                  value={seoSettings.ogDescription}
                  onChange={(e) => updateSEOSetting('ogDescription', e.target.value)}
                  placeholder="Description for social media sharing"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ogImage">OG Image URL</Label>
                <Input
                  id="ogImage"
                  value={seoSettings.ogImage}
                  onChange={(e) => updateSEOSetting('ogImage', e.target.value)}
                  placeholder="https://yourwebsite.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Twitter Cards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twitterCard">Twitter Card Type</Label>
                <select
                  id="twitterCard"
                  value={seoSettings.twitterCard}
                  onChange={(e) => updateSEOSetting('twitterCard', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                  <option value="app">App</option>
                  <option value="player">Player</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sitemap Tab */}
        <TabsContent value="sitemap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sitemap Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-generate Sitemap</Label>
                  <p className="text-sm text-gray-500">Automatically create and update sitemap.xml</p>
                </div>
                <Switch
                  checked={sitemapSettings.autoGenerate}
                  onCheckedChange={(checked) => setSitemapSettings(prev => ({ ...prev, autoGenerate: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Include Images</Label>
                  <p className="text-sm text-gray-500">Include image URLs in sitemap</p>
                </div>
                <Switch
                  checked={sitemapSettings.includeImages}
                  onCheckedChange={(checked) => setSitemapSettings(prev => ({ ...prev, includeImages: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Update Frequency</Label>
                <select
                  value={sitemapSettings.updateFrequency}
                  onChange={(e) => setSitemapSettings(prev => ({ ...prev, updateFrequency: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="always">Always</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Google Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gaId">Google Analytics ID</Label>
                <Input
                  id="gaId"
                  value={analytics.googleAnalyticsId}
                  onChange={(e) => setAnalytics(prev => ({ ...prev, googleAnalyticsId: e.target.value }))}
                  placeholder="GA4-MEASUREMENT-ID or UA-XXXXXXXXX-X"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Tracking</Label>
                  <p className="text-sm text-gray-500">Collect website analytics data</p>
                </div>
                <Switch
                  checked={analytics.enableTracking}
                  onCheckedChange={(checked) => setAnalytics(prev => ({ ...prev, enableTracking: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Facebook Pixel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fbPixel">Facebook Pixel ID</Label>
                <Input
                  id="fbPixel"
                  value={analytics.facebookPixelId}
                  onChange={(e) => setAnalytics(prev => ({ ...prev, facebookPixelId: e.target.value }))}
                  placeholder="Your Facebook Pixel ID"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(analytics.trackEvents).map(([event, enabled]) => (
                  <div key={event} className="flex items-center justify-between">
                    <Label className="capitalize">{event.replace(/([A-Z])/g, ' $1')}</Label>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) => setAnalytics(prev => ({
                        ...prev,
                        trackEvents: { ...prev.trackEvents, [event]: checked }
                      }))}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOSettingsPage;