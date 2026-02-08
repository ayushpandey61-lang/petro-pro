import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Upload,
  Image as ImageIcon,
  File,
  Video,
  Music,
  Trash2,
  Download,
  Eye,
  Copy,
  Search,
  Filter,
  Grid,
  List,
  Folder,
  Plus
} from 'lucide-react';

const MediaGalleryPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Mock media files data
  const [mediaFiles, setMediaFiles] = useState([
    {
      id: 1,
      name: 'petrol-station-front.jpg',
      type: 'image',
      size: '2.4 MB',
      category: 'photos',
      url: '/api/placeholder/400/300',
      uploadedAt: '2024-01-15',
      dimensions: '1920x1080'
    },
    {
      id: 2,
      name: 'fuel-pump-station.png',
      type: 'image',
      size: '1.8 MB',
      category: 'photos',
      url: '/api/placeholder/400/300',
      uploadedAt: '2024-01-14',
      dimensions: '1600x1200'
    },
    {
      id: 3,
      name: 'service-brochure.pdf',
      type: 'document',
      size: '5.2 MB',
      category: 'documents',
      url: '#',
      uploadedAt: '2024-01-13'
    },
    {
      id: 4,
      name: 'station-video.mp4',
      type: 'video',
      size: '45.8 MB',
      category: 'videos',
      url: '#',
      uploadedAt: '2024-01-12',
      duration: '2:34'
    }
  ]);

  const categories = [
    { id: 'all', label: 'All Files', count: mediaFiles.length },
    { id: 'photos', label: 'Photos', count: mediaFiles.filter(f => f.category === 'photos').length },
    { id: 'videos', label: 'Videos', count: mediaFiles.filter(f => f.category === 'videos').length },
    { id: 'documents', label: 'Documents', count: mediaFiles.filter(f => f.category === 'documents').length }
  ];

  const filteredFiles = mediaFiles.filter(file => {
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-8 h-8 text-blue-500" />;
      case 'video': return <Video className="w-8 h-8 text-red-500" />;
      case 'document': return <File className="w-8 h-8 text-green-500" />;
      default: return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    // Here you would typically upload files to your server
    console.log('Uploading files:', files);
  };

  const handleDelete = (fileId) => {
    setMediaFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    // You could show a toast notification here
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Media Gallery
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your images, videos, and documents
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Files
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Media Files</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Drag and drop files here, or click to select
                  </p>
                  <Input
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Choose Files
                    </Button>
                  </Label>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Supported formats: Images (JPG, PNG, GIF), Videos (MP4, AVI), Documents (PDF, DOC, DOCX)
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <span>{category.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid/List */}
      <div className="grid gap-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map(file => (
              <Card key={file.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                    {file.type === 'image' ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      getFileIcon(file.type)
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium text-sm truncate" title={file.name}>
                      {file.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{file.size}</span>
                      <Badge variant="outline" className="text-xs">
                        {file.category}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(file.url)}
                        className="flex-1"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                        className="flex-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredFiles.map(file => (
                  <div key={file.id} className="p-4 flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{file.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{file.size}</span>
                        <span>{file.uploadedAt}</span>
                        <Badge variant="outline">{file.category}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(file.url)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Storage Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Storage Usage</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                54.2 MB of 100 MB used
              </p>
            </div>
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="w-3/5 h-full bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No files found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Upload some files to get started'}
            </p>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Upload Files
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MediaGalleryPage;