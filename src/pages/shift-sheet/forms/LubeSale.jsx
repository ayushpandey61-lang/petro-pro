import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, Trash2, Edit, Save } from 'lucide-react';

const LubeSale = ({ data, updateData, onSaveAndNext }) => {
  const [showForm, setShowForm] = useState(false);
  const [lubricants] = useLocalStorage('lubricants', []);
  const [creditParties] = useLocalStorage('creditParties', []);
  const [items, setItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    setItems(data?.items || []);
  }, [data]);
  
  useEffect(() => {
    if ((data?.items?.length > 0) || items.length > 0) {
      setShowForm(true);
    }
  }, [data, items]);

  const handleAddItem = () => {
    const newItem = { id: uuidv4(), productId: '', qty: '', amount: '', saleType: 'Cash', creditPartyId: '' };
    setItems([...items, newItem]);
    setEditingItemId(newItem.id);
  };

  const handleItemChange = (id, field, value) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };
  
  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const handleEditItem = (id) => {
    setEditingItemId(id);
  };
  
  const handleSaveEdit = (id) => {
    setEditingItemId(null);
    updateParentData(true);
  }

  const updateParentData = (showToast = false) => {
    const itemsWithNames = items.map(item => {
        const product = lubricants.find(l => l.id === item.productId);
        const creditParty = creditParties.find(c => c.id === item.creditPartyId);
        return {
            ...item,
            productName: product?.productName || 'N/A',
            creditPartyName: creditParty?.organizationName || null,
        }
    });
    updateData({ ...data, items: itemsWithNames });
    if(showToast) {
        toast({ title: "Updated", description: "Lube sale entry saved." });
    }
  }

  const handleSaveAndNextClick = () => {
    if(editingItemId) {
        toast({ variant: 'destructive', title: 'Unsaved Changes', description: 'Please save the currently editing item.' });
        return;
    }
    updateParentData();
    toast({ title: "Success", description: "Lube sale data saved." });
    onSaveAndNext();
  };

  if (!showForm) {
    return (
      <Card>
        <CardHeader><CardTitle>Lube Sale</CardTitle></CardHeader>
        <CardContent className="flex items-center space-x-2">
          <Label>Any Lube Sale in this shift?</Label>
          <Switch checked={showForm} onCheckedChange={setShowForm} />
          <Button onClick={() => setShowForm(true)}>Yes</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lube Sale Entry</CardTitle>
        <Button variant="outline" onClick={() => setShowForm(!showForm)}>{showForm ? "Close Form" : "Add New"}</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
            <>
            {items.map((item) => {
              const isEditing = editingItemId === item.id;
              return (
                <div key={item.id} className="space-y-2 border-b pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div className="space-y-1">
                      <Label>Lube Item</Label>
                      <Select value={item.productId} onValueChange={v => handleItemChange(item.id, 'productId', v)} disabled={!isEditing}>
                          <SelectTrigger><SelectValue placeholder="Select Lube" /></SelectTrigger>
                          <SelectContent>{lubricants.map(l => <SelectItem key={l.id} value={l.id}>{l.productName}</SelectItem>)}</SelectContent>
                      </Select>
                      </div>
                      <div className="space-y-1"><Label>Quantity</Label><Input type="number" value={item.qty} onChange={e => handleItemChange(item.id, 'qty', e.target.value)} readOnly={!isEditing} /></div>
                      <div className="space-y-1"><Label>Amount</Label><Input type="number" value={item.amount} onChange={e => handleItemChange(item.id, 'amount', e.target.value)} readOnly={!isEditing} /></div>
                       <div className="flex items-end space-x-2">
                          <div className="space-y-1">
                              <Label>Sale Type</Label>
                              <RadioGroup value={item.saleType} onValueChange={(v) => handleItemChange(item.id, 'saleType', v)} className="flex items-center space-x-2">
                                  <div className="flex items-center space-x-1"><RadioGroupItem value="Cash" id={`cash-${item.id}`} disabled={!isEditing} /><Label htmlFor={`cash-${item.id}`}>Cash</Label></div>
                                  <div className="flex items-center space-x-1"><RadioGroupItem value="Credit" id={`credit-${item.id}`} disabled={!isEditing} /><Label htmlFor={`credit-${item.id}`}>Credit</Label></div>
                              </RadioGroup>
                          </div>
                          {isEditing ? (
                            <Button size="icon" variant="ghost" onClick={() => handleSaveEdit(item.id)}><Save className="h-4 w-4 text-green-500" /></Button>
                          ) : (
                            <Button size="icon" variant="ghost" onClick={() => handleEditItem(item.id)}><Edit className="h-4 w-4 text-blue-500" /></Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                      </div>
                  </div>
                  {item.saleType === 'Credit' && (
                      <div className="space-y-1">
                          <Label>Credit Customer</Label>
                           <Select value={item.creditPartyId || ''} onValueChange={v => handleItemChange(item.id, 'creditPartyId', v)} disabled={!isEditing}>
                              <SelectTrigger><SelectValue placeholder="Select Customer" /></SelectTrigger>
                              <SelectContent>{creditParties.map(c => <SelectItem key={c.id} value={c.id}>{c.organizationName}</SelectItem>)}</SelectContent>
                          </Select>
                      </div>
                  )}
                </div>
              )
            })}
            <Button variant="outline" size="sm" onClick={handleAddItem} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> Add Item
            </Button>
            </>
        )}
        <div className="flex justify-end">
          <Button onClick={handleSaveAndNextClick} className="bg-green-600 hover:bg-green-700">Save and Next</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LubeSale;