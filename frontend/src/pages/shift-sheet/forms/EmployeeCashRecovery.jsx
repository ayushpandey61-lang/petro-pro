import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useDenomination } from '@/context/DenominationContext';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, Trash2, Edit, Save } from 'lucide-react';

const EmployeeCashRecovery = ({ data, updateData, onSaveAndNext }) => {
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [currentAmount, setCurrentAmount] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');
  const { openCalculator } = useDenomination();
  const { toast } = useToast();
  
  useEffect(() => {
    setItems(data?.items || []);
    if (data?.items?.length > 0) {
      setShowForm(true);
    }
  }, [data]);

  const handleAddItem = () => {
    if (!currentAmount) {
      toast({ variant: 'destructive', title: 'Error', description: 'Amount is required.' });
      return;
    }
    const newItem = { id: uuidv4(), amount: currentAmount, description: currentDescription };
    setItems([...items, newItem]);
    setCurrentAmount('');
    setCurrentDescription('');
  };
  
  const handleUpdateItem = () => {
    const updatedItems = items.map(item => 
      item.id === editingItemId ? { ...item, amount: currentAmount, description: currentDescription } : item
    );
    setItems(updatedItems);
    setEditingItemId(null);
    setCurrentAmount('');
    setCurrentDescription('');
    toast({ title: 'Updated', description: 'Entry updated successfully.' });
  };

  const handleEdit = (item) => {
    setEditingItemId(item.id);
    setCurrentAmount(item.amount);
    setCurrentDescription(item.description);
  };
  
  const handleRemove = (id) => {
    setItems(items.filter(item => item.id !== id));
  }

  const handleSave = () => {
    if (editingItemId) {
      toast({ variant: 'destructive', title: 'Unsaved Changes', description: 'Please save the currently editing item.' });
      return;
    }
    updateData({ ...data, items });
    toast({ title: "Success", description: "Cash handover data saved." });
    onSaveAndNext();
  };

  if (!showForm) {
    return (
      <Card>
        <CardHeader><CardTitle>Cash Handover</CardTitle></CardHeader>
        <CardContent className="flex items-center space-x-2">
          <Label>Any Cash Handover in this shift?</Label>
          <Switch checked={showForm} onCheckedChange={setShowForm} />
          <Button onClick={() => setShowForm(true)}>Yes</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cash Handover Entry</CardTitle>
        <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="space-y-1">
              <Label>Amount</Label>
              <div className="flex items-center gap-2">
                  <Input type="number" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} placeholder="Enter amount" />
                  <Button variant="outline" onClick={() => openCalculator(setCurrentAmount)}>Denomination</Button>
              </div>
          </div>
          <div className="space-y-1">
              <Label>Description</Label>
              <Textarea value={currentDescription} onChange={(e) => setCurrentDescription(e.target.value)} placeholder="Optional description" />
          </div>
        </div>
        <div className="flex justify-end">
          {editingItemId ? (
            <Button onClick={handleUpdateItem} className="bg-blue-600 hover:bg-blue-700"><Save className="mr-2 h-4 w-4" /> Update Entry</Button>
          ) : (
            <Button onClick={handleAddItem}><PlusCircle className="mr-2 h-4 w-4" /> Add Entry</Button>
          )}
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">Recorded Cash</h3>
          <ul className="list-disc pl-5 space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                <span>₹{item.amount} - {item.description || 'No description'}</span>
                <div className="space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit className="h-4 w-4 text-blue-500" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">Save and Next</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeCashRecovery;