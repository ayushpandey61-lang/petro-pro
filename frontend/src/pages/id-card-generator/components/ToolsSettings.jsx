import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Waves,
  Circle,
  Square,
  Triangle,
  Star,
  Heart,
  Zap,
  Sparkles,
  Palette,
  RotateCcw,
  Move,
  Copy,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

const ToolsSettings = ({ styles, setStyles, content, setContent, toolElements, setToolElements }) => {
  const [selectedTool, setSelectedTool] = useState(null);

  // Wave patterns
  const wavePatterns = [
    { id: 'sine', name: 'Sine Wave', icon: '～' },
    { id: 'square', name: 'Square Wave', icon: '▅' },
    { id: 'triangle', name: 'Triangle Wave', icon: '△' },
    { id: 'sawtooth', name: 'Sawtooth Wave', icon: '⧵' },
    { id: 'zigzag', name: 'Zigzag', icon: '⥮' },
  ];

  // Shape tools
  const shapeTools = [
    { id: 'circle', name: 'Circle', icon: Circle, color: '#3b82f6' },
    { id: 'square', name: 'Square', icon: Square, color: '#ef4444' },
    { id: 'triangle', name: 'Triangle', icon: Triangle, color: '#10b981' },
    { id: 'star', name: 'Star', icon: Star, color: '#f59e0b' },
    { id: 'heart', name: 'Heart', icon: Heart, color: '#ec4899' },
  ];

  // Effect tools
  const effectTools = [
    { id: 'sparkle', name: 'Sparkle', icon: Sparkles },
    { id: 'lightning', name: 'Lightning', icon: Zap },
    { id: 'glow', name: 'Glow Effect', icon: '✨' },
    { id: 'shadow', name: 'Drop Shadow', icon: '⬛' },
    { id: 'blur', name: 'Blur Effect', icon: '🌫️' },
  ];

  const addWaveElement = (pattern) => {
    const newElement = {
      id: `wave-${Date.now()}`,
      type: 'wave',
      pattern: pattern.id,
      x: 50,
      y: 50,
      width: 100,
      height: 20,
      color: styles.headerColor || '#0c2f6b',
      opacity: 0.7,
      visible: true,
    };
    setToolElements(prev => [...prev, newElement]);
  };

  const addShapeElement = (shape) => {
    const newElement = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      shape: shape.id,
      x: 100,
      y: 100,
      size: 30,
      color: shape.color,
      opacity: 1,
      visible: true,
    };
    setToolElements(prev => [...prev, newElement]);
  };

  const addEffectElement = (effect) => {
    const newElement = {
      id: `effect-${Date.now()}`,
      type: 'effect',
      effect: effect.id,
      x: 150,
      y: 150,
      intensity: 50,
      color: '#ffffff',
      visible: true,
    };
    setToolElements(prev => [...prev, newElement]);
  };

  const updateElement = (id, updates) => {
    setToolElements(prev =>
      prev.map(el => el.id === id ? { ...el, ...updates } : el)
    );
  };

  const deleteElement = (id) => {
    setToolElements(prev => prev.filter(el => el.id !== id));
  };

  const toggleElementVisibility = (id) => {
    setToolElements(prev =>
      prev.map(el =>
        el.id === id ? { ...el, visible: !el.visible } : el
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Wave Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="w-5 h-5" />
            Wave Patterns
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {wavePatterns.map((pattern) => (
              <Button
                key={pattern.id}
                variant="outline"
                size="sm"
                onClick={() => addWaveElement(pattern)}
                className="flex items-center gap-2"
              >
                <span className="text-lg">{pattern.icon}</span>
                {pattern.name}
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <Label>Wave Color</Label>
            <input
              type="color"
              value={styles.waveColor || '#0c2f6b'}
              onChange={(e) => setStyles(prev => ({ ...prev, waveColor: e.target.value }))}
              className="w-full h-8 rounded border"
            />
          </div>
        </CardContent>
      </Card>

      {/* Shape Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Circle className="w-5 h-5" />
            Shape Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {shapeTools.map((shape) => (
              <Button
                key={shape.id}
                variant="outline"
                size="sm"
                onClick={() => addShapeElement(shape)}
                className="flex flex-col items-center gap-1 h-16"
              >
                <shape.icon className="w-6 h-6" style={{ color: shape.color }} />
                <span className="text-xs">{shape.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Effect Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Effect Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {effectTools.map((effect) => (
              <Button
                key={effect.id}
                variant="outline"
                size="sm"
                onClick={() => addEffectElement(effect)}
                className="flex items-center gap-2"
              >
                {typeof effect.icon === 'string' ? (
                  <span className="text-lg">{effect.icon}</span>
                ) : (
                  <effect.icon className="w-4 h-4" />
                )}
                {effect.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Element Manager */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Move className="w-5 h-5" />
            Element Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          {toolElements.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No elements added yet. Use the tools above to add design elements.
            </p>
          ) : (
            <div className="space-y-2">
              {toolElements.map((element) => (
                <div key={element.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {element.type === 'wave' && <Waves className="w-3 h-3" />}
                      {element.type === 'shape' && <Circle className="w-3 h-3" />}
                      {element.type === 'effect' && <Sparkles className="w-3 h-3" />}
                      <span className="text-xs capitalize">{element.type}</span>
                    </Badge>
                    <span className="text-sm">
                      {element.type === 'wave' && `Wave (${element.pattern})`}
                      {element.type === 'shape' && `${element.shape}`}
                      {element.type === 'effect' && `${element.effect}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleElementVisibility(element.id)}
                    >
                      {element.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteElement(element.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Advanced Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Background Pattern</Label>
            <Select
              value={styles.backgroundPattern || 'none'}
              onValueChange={(value) => setStyles(prev => ({ ...prev, backgroundPattern: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="dots">Dots</SelectItem>
                <SelectItem value="lines">Lines</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="diagonal">Diagonal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Pattern Density: {styles.patternDensity || 20}%</Label>
            <Slider
              value={[styles.patternDensity || 20]}
              onValueChange={([value]) => setStyles(prev => ({ ...prev, patternDensity: value }))}
              max={100}
              min={5}
              step={5}
              className="w-full"
            />
          </div>

          <div className="border-t my-4"></div>

          <div className="space-y-2">
            <Label>Enable Gradient Background</Label>
            <Switch
              checked={styles.enableGradient || false}
              onCheckedChange={(checked) => setStyles(prev => ({ ...prev, enableGradient: checked }))}
            />
          </div>

          {styles.enableGradient && (
            <div className="space-y-2">
              <Label>Gradient Colors</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={styles.gradientStart || '#ffffff'}
                  onChange={(e) => setStyles(prev => ({ ...prev, gradientStart: e.target.value }))}
                  className="w-12 h-8 rounded border"
                />
                <span className="text-sm text-muted-foreground">to</span>
                <input
                  type="color"
                  value={styles.gradientEnd || '#f0f0f0'}
                  onChange={(e) => setStyles(prev => ({ ...prev, gradientEnd: e.target.value }))}
                  className="w-12 h-8 rounded border"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolsSettings;