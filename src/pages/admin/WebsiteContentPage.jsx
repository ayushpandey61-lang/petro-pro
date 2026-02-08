import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Save,
  Eye,
  Edit,
  Globe,
  FileText,
  Image,
  Type,
  Palette,
  Settings,
  Plus,
  Trash2,
  Copy,
  Upload
} from 'lucide-react';
import { useOrg } from '@/hooks/useOrg';

const WebsiteContentPage = () => {
  const { orgDetails } = useOrg();
  const [activeTab, setActiveTab] = useState('home');

  const [content, setContent] = useState({
    home: {
      heroTitle: orgDetails.firmName || 'Welcome to Our Petrol Pump',
      heroSubtitle: 'Quality Fuel & Excellent Service',
      aboutText: 'We provide high-quality fuel and excellent service to our customers.',
      services: [
        { title: 'Premium Fuel', description: 'High-quality fuel for your vehicle' },
        { title: 'Quick Service', description: 'Fast and efficient service' },
        { title: '24/7 Support', description: 'Round the clock customer support' }
      ]
    },
    about: {
      title: 'About Our Petrol Pump',
      content: 'Established with a vision to provide quality fuel services...',
      mission: 'To provide the best fuel services to our customers',
      vision: 'To be the leading petrol pump in the region'
    },
    contact: {
      address: orgDetails.address || 'Address not set',
      phone: orgDetails.contactNo || 'Phone not set',
      email: orgDetails.email || 'Email not set',
      workingHours: '24/7'
    }
  });

  const handleSave = () => {
    console.log('Saving content:', content);
    // Here you would typically save to backend
  };

  const handlePreview = () => {
    console.log('Preview content');
    // Open preview in new tab
  };

  const updateContent = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateService = (index, field, value) => {
    const updatedServices = [...content.home.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    updateContent('home', 'services', updatedServices);
  };

  const addService = () => {
    const newService = { title: 'New Service', description: 'Service description' };
    updateContent('home', 'services', [...content.home.services, newService]);
  };

  const removeService = (index) => {
    const updatedServices = content.home.services.filter((_, i) => i !== index);
    updateContent('home', 'services', updatedServices);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Website Content Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your website content, pages, and settings
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePreview} className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Content Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="home" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Home
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            About
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            Contact
          </TabsTrigger>
        </TabsList>

        {/* Home Tab */}
        <TabsContent value="home" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Home Page Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Hero Title</Label>
                  <Input
                    id="heroTitle"
                    value={content.home.heroTitle}
                    onChange={(e) => updateContent('home', 'heroTitle', e.target.value)}
                    placeholder="Enter hero title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Input
                    id="heroSubtitle"
                    value={content.home.heroSubtitle}
                    onChange={(e) => updateContent('home', 'heroSubtitle', e.target.value)}
                    placeholder="Enter hero subtitle"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutText">About Section Text</Label>
                <Textarea
                  id="aboutText"
                  value={content.home.aboutText}
                  onChange={(e) => updateContent('home', 'aboutText', e.target.value)}
                  placeholder="Enter about section text"
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-semibold">Services</Label>
                  <Button onClick={addService} size="sm" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Service
                  </Button>
                </div>

                {content.home.services.map((service, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="secondary">Service {index + 1}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeService(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Service Title</Label>
                        <Input
                          value={service.title}
                          onChange={(e) => updateService(index, 'title', e.target.value)}
                          placeholder="Enter service title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Service Description</Label>
                        <Input
                          value={service.description}
                          onChange={(e) => updateService(index, 'description', e.target.value)}
                          placeholder="Enter service description"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                About Page Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="aboutTitle">Page Title</Label>
                <Input
                  id="aboutTitle"
                  value={content.about.title}
                  onChange={(e) => updateContent('about', 'title', e.target.value)}
                  placeholder="Enter page title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aboutContent">Main Content</Label>
                <Textarea
                  id="aboutContent"
                  value={content.about.content}
                  onChange={(e) => updateContent('about', 'content', e.target.value)}
                  placeholder="Enter main content"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="mission">Mission Statement</Label>
                  <Textarea
                    id="mission"
                    value={content.about.mission}
                    onChange={(e) => updateContent('about', 'mission', e.target.value)}
                    placeholder="Enter mission statement"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vision">Vision Statement</Label>
                  <Textarea
                    id="vision"
                    value={content.about.vision}
                    onChange={(e) => updateContent('about', 'vision', e.target.value)}
                    placeholder="Enter vision statement"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Services Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  Services Configuration
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Manage your service offerings and descriptions
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactAddress">Address</Label>
                  <Textarea
                    id="contactAddress"
                    value={content.contact.address}
                    onChange={(e) => updateContent('contact', 'address', e.target.value)}
                    placeholder="Enter address"
                    rows={3}
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone Number</Label>
                    <Input
                      id="contactPhone"
                      value={content.contact.phone}
                      onChange={(e) => updateContent('contact', 'phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email Address</Label>
                    <Input
                      id="contactEmail"
                      value={content.contact.email}
                      onChange={(e) => updateContent('contact', 'email', e.target.value)}
                      placeholder="Enter email address"
                      type="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workingHours">Working Hours</Label>
                    <Input
                      id="workingHours"
                      value={content.contact.workingHours}
                      onChange={(e) => updateContent('contact', 'workingHours', e.target.value)}
                      placeholder="Enter working hours"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            SEO Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                placeholder="Enter meta title for SEO"
                defaultValue={`${orgDetails.firmName || 'Petrol Pump'} - Quality Fuel Services`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Input
                id="metaDescription"
                placeholder="Enter meta description for SEO"
                defaultValue={`Visit ${orgDetails.firmName || 'our petrol pump'} for quality fuel and excellent service. Located at ${orgDetails.address || 'your location'}.`}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteContentPage;