import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Trash2,
  MoveUp,
  MoveDown,
  RotateCcw,
  Settings,
  Grid3X3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignHorizontalJustifyStart,
  AlignVerticalJustifyEnd,
  AlignHorizontalJustifyEnd,
  Group,
  Ungroup,
  Merge,
  Split,
  Plus,
  Minus,
  Target,
  Ruler,
  Compass,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Move,
  Edit3,
  Palette,
  Type,
  Image,
  Shapes,
  Sparkles,
  Zap
} from 'lucide-react';

const LayerManager = ({ toolElements, setToolElements, styles, setStyles }) => {
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [showGrid, setShowGrid] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);

  const updateElement = (id, updates) => {
    setToolElements(prev =>
      prev.map(el => el.id === id ? { ...el, ...updates } : el)
    );
  };

  const deleteElement = (id) => {
    setToolElements(prev => prev.filter(el => el.id !== id));
    if (selectedLayer === id) setSelectedLayer(null);
  };

  const toggleElementVisibility = (id) => {
    updateElement(id, { visible: !toolElements.find(el => el.id === id)?.visible });
  };

  const toggleElementLock = (id) => {
    updateElement(id, { locked: !toolElements.find(el => el.id === id)?.locked });
  };

  const duplicateElement = (id) => {
    const element = toolElements.find(el => el.id === id);
    if (element) {
      const newElement = {
        ...element,
        id: `${element.type}-${Date.now()}`,
        x: element.x + 20,
        y: element.y + 20,
      };
      setToolElements(prev => [...prev, newElement]);
    }
  };

  const moveLayerUp = (id) => {
    setToolElements(prev => {
      const index = prev.findIndex(el => el.id === id);
      if (index > 0) {
        const newElements = [...prev];
        [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
        return newElements;
      }
      return prev;
    });
  };

  const moveLayerDown = (id) => {
    setToolElements(prev => {
      const index = prev.findIndex(el => el.id === id);
      if (index < prev.length - 1) {
        const newElements = [...prev];
        [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
        return newElements;
      }
      return prev;
    });
  };

  const groupElements = () => {
    const selectedElements = toolElements.filter(el => el.selected);
    if (selectedElements.length > 1) {
      const groupId = `group-${Date.now()}`;
      const groupElement = {
        id: groupId,
        type: 'group',
        elements: selectedElements.map(el => el.id),
        x: Math.min(...selectedElements.map(el => el.x)),
        y: Math.min(...selectedElements.map(el => el.y)),
        width: Math.max(...selectedElements.map(el => el.x + (el.width || 0))) - Math.min(...selectedElements.map(el => el.x)),
        height: Math.max(...selectedElements.map(el => el.y + (el.height || 0))) - Math.min(...selectedElements.map(el => el.y)),
        visible: true,
        locked: false,
        layer: 1,
      };

      setToolElements(prev => [
        ...prev.filter(el => !selectedElements.find(sel => sel.id === el.id)),
        groupElement
      ]);
    }
  };

  const ungroupElements = (groupId) => {
    const group = toolElements.find(el => el.id === groupId);
    if (group && group.type === 'group') {
      // Restore individual elements (simplified for this example)
      setToolElements(prev => prev.filter(el => el.id !== groupId));
    }
  };

  const alignElements = (alignment) => {
    const selectedElements = toolElements.filter(el => el.selected);
    if (selectedElements.length < 2) return;

    const leftMost = Math.min(...selectedElements.map(el => el.x));
    const rightMost = Math.max(...selectedElements.map(el => el.x + (el.width || 0)));
    const topMost = Math.min(...selectedElements.map(el => el.y));
    const bottomMost = Math.max(...selectedElements.map(el => el.y + (el.height || 0)));
    const centerX = (leftMost + rightMost) / 2;
    const centerY = (topMost + bottomMost) / 2;

    setToolElements(prev =>
      prev.map(el => {
        if (!selectedElements.find(sel => sel.id === el.id)) return el;

        switch (alignment) {
          case 'left':
            return { ...el, x: leftMost };
          case 'right':
            return { ...el, x: rightMost - (el.width || 0) };
          case 'top':
            return { ...el, y: topMost };
          case 'bottom':
            return { ...el, y: bottomMost - (el.height || 0) };
          case 'center-h':
            return { ...el, x: centerX - (el.width || 0) / 2 };
          case 'center-v':
            return { ...el, y: centerY - (el.height || 0) / 2 };
          default:
            return el;
        }
      })
    );
  };

  const distributeElements = (direction) => {
    const selectedElements = toolElements.filter(el => el.selected).sort((a, b) => {
      if (direction === 'horizontal') return a.x - b.x;
      return a.y - b.y;
    });

    if (selectedElements.length < 3) return;

    const first = selectedElements[0];
    const last = selectedElements[selectedElements.length - 1];
    const totalSpace = direction === 'horizontal'
      ? (last.x + (last.width || 0)) - first.x
      : (last.y + (last.height || 0)) - first.y;

    const elementSpace = selectedElements.length - 1;
    const spacing = totalSpace / elementSpace;

    setToolElements(prev =>
      prev.map(el => {
        const index = selectedElements.findIndex(sel => sel.id === el.id);
        if (index === -1) return el;

        if (direction === 'horizontal') {
          return { ...el, x: first.x + index * spacing };
        } else {
          return { ...el, y: first.y + index * spacing };
        }
      })
    );
  };

  const getElementIcon = (element) => {
    switch (element.type) {
      case 'wave': return <Zap className="w-4 h-4" />;
      case 'shape': return <Shapes className="w-4 h-4" />;
      case 'effect': return <Sparkles className="w-4 h-4" />;
      case 'advanced-shape': return <Shapes className="w-4 h-4" />;
      case 'drawing': return <Edit3 className="w-4 h-4" />;
      case 'text': return <Type className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'group': return <Layers className="w-4 h-4" />;
      default: return <Shapes className="w-4 h-4" />;
    }
  };

  const getElementName = (element) => {
    switch (element.type) {
      case 'wave': return `Wave (${element.pattern})`;
      case 'shape': return `Shape (${element.shape})`;
      case 'effect': return `Effect (${element.effect})`;
      case 'advanced-shape': return `Advanced Shape (${element.shape})`;
      case 'drawing': return `Drawing (${element.tool})`;
      case 'text': return 'Text Element';
      case 'image': return 'Image Element';
      case 'group': return `Group (${element.elements?.length || 0} items)`;
      default: return `${element.type} element`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Grid and Alignment Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5" />
            Grid & Alignment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Show Grid</Label>
            <Switch
              checked={showGrid}
              onCheckedChange={setShowGrid}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Snap to Grid</Label>
            <Switch
              checked={snapToGrid}
              onCheckedChange={setSnapToGrid}
            />
          </div>

          <div className="space-y-2">
            <Label>Grid Size: {gridSize}px</Label>
            <Slider
              value={[gridSize]}
              onValueChange={([value]) => setGridSize(value)}
              max={50}
              min={5}
              step={5}
              className="w-full"
            />
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alignElements('left')}
                className="flex flex-col items-center gap-1 h-12"
              >
                <AlignLeft className="w-4 h-4" />
                <span className="text-xs">Left</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => alignElements('center-h')}
                className="flex flex-col items-center gap-1 h-12"
              >
                <AlignHorizontalJustifyCenter className="w-4 h-4" />
                <span className="text-xs">Center H</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => alignElements('right')}
                className="flex flex-col items-center gap-1 h-12"
              >
                <AlignRight className="w-4 h-4" />
                <span className="text-xs">Right</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => alignElements('top')}
                className="flex flex-col items-center gap-1 h-12"
              >
                <AlignVerticalJustifyStart className="w-4 h-4" />
                <span className="text-xs">Top</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => alignElements('center-v')}
                className="flex flex-col items-center gap-1 h-12"
              >
                <AlignVerticalJustifyCenter className="w-4 h-4" />
                <span className="text-xs">Center V</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => alignElements('bottom')}
                className="flex flex-col items-center gap-1 h-12"
              >
                <AlignVerticalJustifyEnd className="w-4 h-4" />
                <span className="text-xs">Bottom</span>
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => distributeElements('horizontal')}
                className="flex items-center gap-2"
              >
                <AlignHorizontalJustifyStart className="w-4 h-4" />
                Distribute H
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => distributeElements('vertical')}
                className="flex items-center gap-2"
              >
                <AlignVerticalJustifyStart className="w-4 h-4" />
                Distribute V
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layer Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Layer Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          {toolElements.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No elements added yet. Use the tools to add design elements.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {toolElements.map((element, index) => (
                <div
                  key={element.id}
                  className={`flex items-center justify-between p-3 border rounded cursor-pointer transition-colors ${
                    selectedLayer === element.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedLayer(element.id)}
                >
                  <div className="flex items-center gap-3">
                    {getElementIcon(element)}
                    <div>
                      <div className="font-medium text-sm">{getElementName(element)}</div>
                      <div className="text-xs text-muted-foreground">
                        Layer {index + 1} • {element.visible ? 'Visible' : 'Hidden'} • {element.locked ? 'Locked' : 'Unlocked'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleElementVisibility(element.id);
                      }}
                    >
                      {element.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleElementLock(element.id);
                      }}
                    >
                      {element.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateElement(element.id);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLayerUp(element.id);
                      }}
                      disabled={index === 0}
                    >
                      <MoveUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLayerDown(element.id);
                      }}
                      disabled={index === toolElements.length - 1}
                    >
                      <MoveDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteElement(element.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={groupElements}
              disabled={toolElements.filter(el => el.selected).length < 2}
              className="flex items-center gap-2"
            >
              <Group className="w-4 h-4" />
              Group
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectedLayer && ungroupElements(selectedLayer)}
              disabled={!selectedLayer || toolElements.find(el => el.id === selectedLayer)?.type !== 'group'}
              className="flex items-center gap-2"
            >
              <Ungroup className="w-4 h-4" />
              Ungroup
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setToolElements(prev => prev.map(el => ({ ...el, selected: false })))}
              className="flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              Deselect All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setToolElements(prev => prev.filter(el => el.visible))}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Hide Hidden
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LayerManager;