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

const RecoveryForm = ({ item, onSave, onRemove, creditParties, swipeMachines, banks }) => {
  const [formData, setFormData] = useState(item);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [isEditing, setIsEditing] = useState(!item.organizationName);

  useEffect(() => {
    if (formData.organizationId) {
      const party = creditParties.find(p => p.id === formData.organizationId);
      const partyPending = parseFloat(party?.creditBalance) || 0;
      setPendingAmount(partyPending);
      const recovered = parseFloat(formData.amount) || 0;
      setRemainingAmount(partyPending - recovered);
    } else {
      setPendingAmount(0);
      setRemainingAmount(0);
    }
  }, [formData.organizationId, formData.amount, creditParties]);

  const handleSaveClick = () => {
    const organization = creditParties.find(c => c.id === formData.organizationId);
    const swipeMachine = swipeMachines.find(s => s.id === formData.swipeMachineId);
    const bank = banks.find(b => b.id === formData.bankId);
    
    onSave({ 
      ...formData, 
      organizationName: organization?.organizationName,
      swipeMachineName: swipeMachine?.machineName,
      bankName: bank?.name
    });
    setIsEditing(false);
  };

  const handleValueChange = (field, value) => {
    const newFormData = {...formData, [field]: value};
    if (field === 'collectionMode') {
      newFormData.swipeMachineId = '';
      newFormData.bankId = '';
    }
    setFormData(newFormData);
  };

  return (
    <div className="border p-4 rounded-md space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
        <div className="space-y-1 col-span-1">
          <Label>Organization</Label>
          <Select onValueChange={v => handleValueChange('organizationId', v)} value={formData.organizationId || ''} disabled={!isEditing}>
            <SelectTrigger><SelectValue placeholder="Choose Organization" /></SelectTrigger>
            <SelectContent>{creditParties.map(c => <SelectItem key={c.id} value={c.id}>{c.organizationName}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1"><Label>Pending</Label><Input type="number" readOnly value={pendingAmount.toFixed(2)} className="bg-muted" /></div>
        <div className="space-y-1"><Label>Recovery</Label><Input type="number" value={formData.amount} onChange={e => handleValueChange('amount', e.target.value)} readOnly={!isEditing} /></div>
        <div className="space-y-1"><Label>Remaining</Label><Input type="number" readOnly value={remainingAmount.toFixed(2)} className="bg-muted" /></div>
        <div className="space-y-1">
          <Label>Mode</Label>
          <Select onValueChange={v => handleValueChange('collectionMode', v)} value={formData.collectionMode} disabled={!isEditing}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Swipe">Swipe</SelectItem>
              <SelectItem value="Bank">Bank</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {formData.collectionMode === 'Swipe' && (
          <div className="space-y-1 max-w-xs">
              <Label>Swipe Machine</Label>
              <Select onValueChange={v => handleValueChange('swipeMachineId', v)} value={formData.swipeMachineId || ''} disabled={!isEditing}>
                  <SelectTrigger><SelectValue placeholder="Select Machine"/></SelectTrigger>
                  <SelectContent>{swipeMachines.map(m => <SelectItem key={m.id} value={m.id}>{m.machineName}</SelectItem>)}</SelectContent>
              </Select>
          </div>
      )}
      {formData.collectionMode === 'Bank' && (
           <div className="space-y-1 max-w-xs">
              <Label>Bank</Label>
              <Select onValueChange={v => handleValueChange('bankId', v)} value={formData.bankId || ''} disabled={!isEditing}>
                  <SelectTrigger><SelectValue placeholder="Select Bank"/></SelectTrigger>
                  <SelectContent>{banks.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
              </Select>
          </div>
      )}
      <div className="flex justify-end space-x-2">
        {isEditing ? (
          <Button onClick={handleSaveClick}><Save className="mr-2 h-4 w-4" /> Save</Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4" /></Button>
        )}
        <Button variant="ghost" size="icon" onClick={() => onRemove(formData.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </div>
    </div>
  );
};

const Recovery = ({ data, updateData, onSaveAndNext }) => {
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState([]);
  const [creditParties] = useLocalStorage('creditParties', []);
  const [swipeMachines] = useLocalStorage('swipeMachines', []);
  const [banks] = useLocalStorage('banks', [
      { id: 'bank1', name: 'HDFC Bank' }, 
      { id: 'bank2', name: 'ICICI Bank' },
      { id: 'bank3', name: 'SBI' }
    ]);
  const { toast } = useToast();

  useEffect(() => {
    setItems(data?.items || []);
    if (data?.items?.length > 0) {
      setShowForm(true);
    }
  }, [data]);

  const handleAddItem = () => {
    setItems([...items, { id: uuidv4(), organizationId: '', amount: '', collectionMode: 'Cash' }]);
  };

  const handleSaveItem = (savedItem) => {
    const newItems = items.map(i => i.id === savedItem.id ? savedItem : i);
    setItems(newItems);
  };
  
  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const handleSaveAndNextClick = () => {
    const hasUnsaved = items.some(item => !item.organizationName);
    if (hasUnsaved) {
      toast({variant: 'destructive', title: 'Unsaved Changes', description: 'Please save all recovery entries before proceeding.'});
      return;
    }
    updateData({ ...data, items });
    toast({ title: "Success", description: "Recovery data saved." });
    onSaveAndNext();
  };

  if (!showForm) {
    return (
      <Card>
        <CardHeader><CardTitle>Recovery</CardTitle></CardHeader>
        <CardContent className="flex items-center space-x-2">
          <Label>Any Recovery in this shift?</Label>
          <Switch checked={showForm} onCheckedChange={setShowForm} />
          <Button onClick={() => setShowForm(true)}>Yes</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recovery Entry</CardTitle>
        <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map(item => (
          <RecoveryForm 
            key={item.id} 
            item={item} 
            onSave={handleSaveItem} 
            onRemove={handleRemoveItem}
            creditParties={creditParties}
            swipeMachines={swipeMachines}
            banks={banks}
          />
        ))}
        <Button onClick={handleAddItem} variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Recovery</Button>
        <div className="flex justify-end">
          <Button onClick={handleSaveAndNextClick} className="bg-green-600 hover:bg-green-700">Save and Next</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Recovery;