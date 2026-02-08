import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Pen,
  Brush,
  Eraser,
  Move,
  RotateCw,
  Scale,
  FlipHorizontal,
  FlipVertical,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Grid3X3,
  Palette,
  Type,
  Image,
  Filter,
  Sparkles,
  Zap,
  Droplets,
  Sun,
  Cloud,
  Snowflake,
  Flame,
  Target,
  Compass,
  Ruler,
  Settings,
  Layers,
  Copy,
  Scissors,
  RotateCcw,
  Maximize2,
  Minimize2,
  Move3D,
  Box,
  Hexagon,
  Pentagon,
  Octagon,
  Diamond,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  X,
  Check,
  Edit3,
  Bold,
  Italic,
  Underline,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignHorizontalJustifyStart,
  AlignVerticalJustifyEnd,
  AlignHorizontalJustifyEnd
} from 'lucide-react';

const AdvancedTools = ({ styles, setStyles, content, setContent, toolElements, setToolElements }) => {
  const [selectedTool, setSelectedTool] = useState('pen');
  const [selectedElement, setSelectedElement] = useState(null);

  // Advanced Shape Tools
  const advancedShapes = [
    { id: 'rectangle', name: 'Rectangle', icon: Box, color: '#3b82f6' },
    { id: 'hexagon', name: 'Hexagon', icon: Hexagon, color: '#ef4444' },
    { id: 'pentagon', name: 'Pentagon', icon: Pentagon, color: '#10b981' },
    { id: 'octagon', name: 'Octagon', icon: Octagon, color: '#f59e0b' },
    { id: 'diamond', name: 'Diamond', icon: Diamond, color: '#ec4899' },
    { id: 'arrow-right', name: 'Arrow Right', icon: ArrowRight, color: '#8b5cf6' },
    { id: 'arrow-left', name: 'Arrow Left', icon: ArrowLeft, color: '#06b6d4' },
    { id: 'arrow-up', name: 'Arrow Up', icon: ArrowUp, color: '#84cc16' },
    { id: 'arrow-down', name: 'Arrow Down', icon: ArrowDown, color: '#f97316' },
  ];

  // Drawing Tools
  const drawingTools = [
    { id: 'pen', name: 'Pen Tool', icon: Pen, color: '#000000' },
    { id: 'brush', name: 'Brush', icon: Brush, color: '#ff6b6b' },
    { id: 'eraser', name: 'Eraser', icon: Eraser, color: '#ffffff' },
    { id: 'fill', name: 'Fill Tool', icon: Droplets, color: '#4ecdc4' },
  ];

  // Transform Tools
  const transformTools = [
    { id: 'move', name: 'Move', icon: Move, action: 'move' },
    { id: 'rotate', name: 'Rotate', icon: RotateCw, action: 'rotate' },
    { id: 'scale', name: 'Scale', icon: Scale, action: 'scale' },
    { id: 'flip-h', name: 'Flip H', icon: FlipHorizontal, action: 'flipH' },
    { id: 'flip-v', name: 'Flip V', icon: FlipVertical, action: 'flipV' },
  ];

  // Text Tools
  const textTools = [
    { id: 'font-family', name: 'Font Family', type: 'select', options: ['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana', 'Courier New', 'Impact', 'Comic Sans MS'] },
    { id: 'font-size', name: 'Font Size', type: 'slider', min: 8, max: 72, step: 1 },
    { id: 'font-weight', name: 'Font Weight', type: 'select', options: ['Normal', 'Bold', 'Light', '100', '200', '300', '400', '500', '600', '700', '800', '900'] },
    { id: 'font-style', name: 'Font Style', type: 'select', options: ['Normal', 'Italic', 'Oblique'] },
    { id: 'text-decoration', name: 'Decoration', type: 'select', options: ['None', 'Underline', 'Line Through', 'Overline'] },
    { id: 'text-align', name: 'Text Align', type: 'select', options: ['Left', 'Center', 'Right', 'Justify'] },
    { id: 'text-color', name: 'Text Color', type: 'color' },
    { id: 'text-shadow', name: 'Text Shadow', type: 'switch' },
  ];

  // Advanced Effects
  const advancedEffects = [
    { id: 'blur', name: 'Blur', icon: Cloud, intensity: true },
    { id: 'brightness', name: 'Brightness', icon: Sun, intensity: true },
    { id: 'contrast', name: 'Contrast', icon: Settings, intensity: true },
    { id: 'saturation', name: 'Saturation', icon: Palette, intensity: true },
    { id: 'hue-rotate', name: 'Hue Rotate', icon: RotateCcw, intensity: true },
    { id: 'sepia', name: 'Sepia', icon: Image, intensity: true },
    { id: 'grayscale', name: 'Grayscale', icon: Snowflake, intensity: true },
    { id: 'invert', name: 'Invert', icon: FlipHorizontal, intensity: true },
    { id: 'opacity', name: 'Opacity', icon: Layers, intensity: true },
  ];

  const addAdvancedShape = (shape) => {
    const newElement = {
      id: `advanced-shape-${Date.now()}`,
      type: 'advanced-shape',
      shape: shape.id,
      x: 50,
      y: 50,
      width: 60,
      height: 60,
      color: shape.color,
      strokeColor: '#000000',
      strokeWidth: 2,
      fillOpacity: 1,
      strokeOpacity: 1,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      visible: true,
      locked: false,
      layer: 1,
    };
    setToolElements(prev => [...prev, newElement]);
  };

  const addDrawingElement = (tool) => {
    const newElement = {
      id: `drawing-${Date.now()}`,
      type: 'drawing',
      tool: tool.id,
      x: 100,
      y: 100,
      size: tool.id === 'eraser' ? 20 : 5,
      color: tool.color,
      opacity: 1,
      visible: true,
      locked: false,
      layer: 1,
    };
    setToolElements(prev => [...prev, newElement]);
  };

  const applyTransform = (elementId, transform) => {
    setToolElements(prev =>
      prev.map(el =>
        el.id === elementId ? { ...el, ...transform } : el
      )
    );
  };

  const applyTextEffect = (elementId, effect) => {
    setToolElements(prev =>
      prev.map(el =>
        el.id === elementId ? { ...el, textEffects: { ...el.textEffects, [effect]: !el.textEffects?.[effect] } } : el
      )
    );
  };

  const applyFilter = (elementId, filter, intensity = null) => {
    setToolElements(prev =>
      prev.map(el =>
        el.id === elementId ? {
          ...el,
          filters: {
            ...el.filters,
            [filter]: intensity !== null ? intensity : !el.filters?.[filter]
          }
        } : el
      )
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="shapes" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="shapes">Shapes</TabsTrigger>
          <TabsTrigger value="drawing">Drawing</TabsTrigger>
          <TabsTrigger value="transform">Transform</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
        </TabsList>

        <TabsContent value="shapes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="w-5 h-5" />
                Advanced Shapes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {advancedShapes.map((shape) => (
                  <Button
                    key={shape.id}
                    variant="outline"
                    size="sm"
                    onClick={() => addAdvancedShape(shape)}
                    className="flex flex-col items-center gap-2 h-20"
                  >
                    <shape.icon className="w-6 h-6" style={{ color: shape.color }} />
                    <span className="text-xs">{shape.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drawing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pen className="w-5 h-5" />
                Drawing Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {drawingTools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant={selectedTool === tool.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedTool(tool.id);
                      addDrawingElement(tool);
                    }}
                    className="flex items-center gap-2"
                  >
                    <tool.icon className="w-4 h-4" />
                    {tool.name}
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Brush Size: {styles.brushSize || 5}px</Label>
                <Slider
                  value={[styles.brushSize || 5]}
                  onValueChange={([value]) => setStyles(prev => ({ ...prev, brushSize: value }))}
                  max={50}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Drawing Color</Label>
                <input
                  type="color"
                  value={styles.drawingColor || '#000000'}
                  onChange={(e) => setStyles(prev => ({ ...prev, drawingColor: e.target.value }))}
                  className="w-full h-10 rounded border"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transform" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Move3D className="w-5 h-5" />
                Transform Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {transformTools.map((tool) => (
                  <Button
                    key={tool.id}
                    variant="outline"
                    size="sm"
                    onClick={() => selectedElement && applyTransform(selectedElement, { transformAction: tool.action })}
                    className="flex flex-col items-center gap-1 h-16"
                  >
                    <tool.icon className="w-5 h-5" />
                    <span className="text-xs">{tool.name}</span>
                  </Button>
                ))}
              </div>

              {selectedElement && (
                <div className="space-y-3 p-3 border rounded">
                  <h4 className="font-semibold">Transform Selected Element</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Rotation: {toolElements.find(el => el.id === selectedElement)?.rotation || 0}°</Label>
                      <Slider
                        value={[toolElements.find(el => el.id === selectedElement)?.rotation || 0]}
                        onValueChange={([value]) => applyTransform(selectedElement, { rotation: value })}
                        max={360}
                        min={-360}
                        step={15}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Scale X: {toolElements.find(el => el.id === selectedElement)?.scaleX || 1}</Label>
                      <Slider
                        value={[toolElements.find(el => el.id === selectedElement)?.scaleX || 1]}
                        onValueChange={([value]) => applyTransform(selectedElement, { scaleX: value })}
                        max={3}
                        min={0.1}
                        step={0.1}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Typography Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {textTools.map((tool) => (
                <div key={tool.id} className="space-y-2">
                  <Label>{tool.name}</Label>
                  {tool.type === 'select' && (
                    <Select
                      value={styles[tool.id] || tool.options[0]}
                      onValueChange={(value) => setStyles(prev => ({ ...prev, [tool.id]: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tool.options.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {tool.type === 'slider' && (
                    <Slider
                      value={[styles[tool.id] || tool.min]}
                      onValueChange={([value]) => setStyles(prev => ({ ...prev, [tool.id]: value }))}
                      max={tool.max}
                      min={tool.min}
                      step={tool.step}
                    />
                  )}
                  {tool.type === 'color' && (
                    <input
                      type="color"
                      value={styles[tool.id] || '#000000'}
                      onChange={(e) => setStyles(prev => ({ ...prev, [tool.id]: e.target.value }))}
                      className="w-full h-10 rounded border"
                    />
                  )}
                  {tool.type === 'switch' && (
                    <Switch
                      checked={styles[tool.id] || false}
                      onCheckedChange={(checked) => setStyles(prev => ({ ...prev, [tool.id]: checked }))}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="effects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Advanced Effects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {advancedEffects.map((effect) => (
                  <Button
                    key={effect.id}
                    variant="outline"
                    size="sm"
                    onClick={() => selectedElement && applyFilter(selectedElement, effect.id)}
                    className="flex flex-col items-center gap-1 h-16"
                  >
                    <effect.icon className="w-5 h-5" />
                    <span className="text-xs">{effect.name}</span>
                  </Button>
                ))}
              </div>

              {selectedElement && (
                <div className="space-y-3 p-3 border rounded">
                  <h4 className="font-semibold">Filter Intensity</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {advancedEffects.filter(e => e.intensity).map((effect) => (
                      <div key={effect.id} className="space-y-2">
                        <Label>{effect.name}: {toolElements.find(el => el.id === selectedElement)?.filters?.[effect.id] || 50}%</Label>
                        <Slider
                          value={[toolElements.find(el => el.id === selectedElement)?.filters?.[effect.id] || 50]}
                          onValueChange={([value]) => applyFilter(selectedElement, effect.id, value)}
                          max={100}
                          min={0}
                          step={10}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedTools;