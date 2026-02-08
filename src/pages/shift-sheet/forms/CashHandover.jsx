import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, Trash2, Edit, Save } from 'lucide-react';
import { useDenomination } from '@/context/DenominationContext';

const CashHandoverEntryForm = ({ onSave, onRemove, item }) => {
  const [formData, setFormData] = useState(item);
  const [isEditing, setIsEditing] = useState(!item.amount);
  const { openCalculator } = useDenomination();

  const handleValueChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSaveClick = () => {
    if (!formData.amount) {
      alert("Amount is mandatory.");
      return;
    }
    onSave(formData);
    setIsEditing(false);
  };

  return (
    <div className="border p-4 rounded-md space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
        <div className="space-y-1">
          <Label>Amount*</Label>
          <div className="flex items-center gap-2">
            <Input type="number" name="amount" value={formData.amount} onChange={(e) => handleValueChange('amount', e.target.value)} readOnly={!isEditing} />
            <Button variant="outline" onClick={() => openCalculator((val) => handleValueChange('amount', val))} disabled={!isEditing}>Denomination</Button>
          </div>
        </div>
        <div className="space-y-1"><Label>Description</Label><Textarea name="description" value={formData.description} onChange={(e) => handleValueChange('description', e.target.value)} readOnly={!isEditing} /></div>
        <div className="flex justify-end space-x-2 self-end">
          {isEditing ? (
            <Button onClick={handleSaveClick}><Save className="mr-2 h-4 w-4" /> Save</Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4" /></Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => onRemove(formData.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      </div>
    </div>
  );
};

const CashHandover = ({ data, updateData, onSaveAndNext }) => {
  const [items, setItems] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    setItems(data?.items || []);
  }, [data]);

  const handleAddItem = () => {
    setItems([...items, {
      id: uuidv4(),
      amount: '',
      description: '',
    }]);
  };

  const handleSaveItem = (savedItem) => {
    const newItems = items.map(i => i.id === savedItem.id ? savedItem : i);
    setItems(newItems);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSaveAndNextClick = () => {
    const hasUnsaved = items.some(item => !item.amount);
    if (hasUnsaved) {
      toast({ variant: 'destructive', title: 'Unsaved Changes', description: 'Please save all cash handover entries before proceeding.' });
      return;
    }
    updateData({ ...data, items });
    toast({ title: "Cash Handover Saved!", description: "Proceeding to next section." });
    onSaveAndNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Handover</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map(item => (
            <CashHandoverEntryForm
              key={item.id}
              item={item}
              onSave={handleSaveItem}
              onRemove={handleRemoveItem}
            />
          ))}
          <Button onClick={handleAddItem} variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Cash Handover</Button>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSaveAndNextClick} className="bg-green-600 hover:bg-green-700">Save and Next</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashHandover;