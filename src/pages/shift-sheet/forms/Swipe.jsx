import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, Trash2, Edit, Save } from 'lucide-react';

const SwipeEntryForm = ({ onSave, onRemove, item, swipeMachines }) => {
  const [formData, setFormData] = useState(item);
  const [isEditing, setIsEditing] = useState(!item.swipeMachineName);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSaveClick = () => {
      const machine = swipeMachines.find(m => m.id === formData.swipeMachineId);
      onSave({...formData, swipeMachineName: machine?.machineName || 'N/A'});
      setIsEditing(false);
  }

  return (
    <div className="border p-4 rounded-md space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="space-y-1">
          <Label>Swipe Machine</Label>
          <Select onValueChange={(v) => handleFormChange('swipeMachineId', v)} value={formData.swipeMachineId || ''} disabled={!isEditing}>
            <SelectTrigger><SelectValue placeholder="Choose Machine" /></SelectTrigger>
            <SelectContent>{swipeMachines.map(m => <SelectItem key={m.id} value={m.id}>{m.machineName}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1"><Label>Amount</Label><Input type="number" value={formData.amount} onChange={(e) => handleFormChange('amount', e.target.value)} readOnly={!isEditing} /></div>
        <div className="flex items-end space-x-2">
            {isEditing ? (
                <Button onClick={handleSaveClick}><Save className="mr-2 h-4 w-4"/>Save</Button>
            ) : (
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4 text-blue-500"/></Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => onRemove(formData.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
        </div>
      </div>
    </div>
  );
};

const Swipe = ({ data, updateData, onSaveAndNext }) => {
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState([]);
  const [swipeMachines] = useLocalStorage('swipeMachines', []);
  const { toast } = useToast();
  
  useEffect(() => {
    setItems(data?.items || []);
    if (data?.items?.length > 0) {
      setShowForm(true);
    }
  }, [data]);
  
  const handleAddItem = () => {
    setItems([...items, { id: uuidv4(), swipeMachineId: '', amount: '' }]);
  };

  const handleSaveItem = (savedItem) => {
    const newItems = items.map(i => i.id === savedItem.id ? savedItem : i);
    setItems(newItems);
  };
  
  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const handleSaveAndNextClick = () => {
    const hasUnsaved = items.some(item => !item.swipeMachineName);
     if (hasUnsaved) {
      toast({variant: 'destructive', title: 'Unsaved Changes', description: 'Please save all swipe entries before proceeding.'});
      return;
    }
    updateData({ ...data, items });
    toast({ title: "Swipe Data Saved!", description: "Proceeding to next section." });
    onSaveAndNext();
  };

  if (!showForm) {
    return (
      <Card>
        <CardHeader><CardTitle>Swipe Transactions</CardTitle></CardHeader>
        <CardContent className="flex items-center space-x-2">
          <Label>Any Swipe Transactions in this shift?</Label>
          <Switch checked={showForm} onCheckedChange={setShowForm} />
          <Button onClick={() => setShowForm(true)}>Yes</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Swipe Entry</CardTitle>
        <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {items.map(item => (
                <SwipeEntryForm key={item.id} item={item} onSave={handleSaveItem} onRemove={handleRemoveItem} swipeMachines={swipeMachines}/>
            ))}
            <Button onClick={handleAddItem} variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4"/> Add Swipe</Button>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSaveAndNextClick} className="bg-green-600 hover:bg-green-700">Save and Next</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Swipe;