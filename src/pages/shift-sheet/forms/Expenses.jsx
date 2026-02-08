import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, PlusCircle, Edit, Save } from 'lucide-react';

const ExpenseEntryForm = ({ onSave, onRemove, item, expenseTypes, employees }) => {
  const [formData, setFormData] = useState(item);
  const [isEditing, setIsEditing] = useState(!item.expenseTypeName);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const isEmployeeRequired = useMemo(() => {
    if (!formData.expenseTypeId) return false;
    const selectedExpenseType = expenseTypes.find(et => et.id === formData.expenseTypeId);
    if (!selectedExpenseType || typeof selectedExpenseType.category !== 'string') return false;
    const typeName = selectedExpenseType.category.toLowerCase();
    return typeName === 'advance' || typeName === 'salary';
  }, [formData.expenseTypeId, expenseTypes]);

  const handleSaveClick = () => {
    const expenseType = expenseTypes.find(et => et.id === formData.expenseTypeId);
    const employee = employees.find(emp => emp.id === formData.employeeId);
    onSave({
        ...formData,
        expenseTypeName: expenseType ? expenseType.category : 'N/A',
        employeeName: employee ? employee.employeeName : null
    });
    setIsEditing(false);
  }

  return (
    <div className="border p-4 rounded-md space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div className="space-y-1">
          <Label>Expense Type</Label>
          <Select onValueChange={(v) => handleFormChange('expenseTypeId', v)} value={formData.expenseTypeId || ''} disabled={!isEditing}>
            <SelectTrigger><SelectValue placeholder="Choose Type" /></SelectTrigger>
            <SelectContent>{expenseTypes.map(et => <SelectItem key={et.id} value={et.id}>{et.category}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {isEmployeeRequired && (
          <div className="space-y-1">
            <Label>Employee</Label>
            <Select onValueChange={(v) => handleFormChange('employeeId', v)} value={formData.employeeId || ''} disabled={!isEditing}>
              <SelectTrigger><SelectValue placeholder="Select Employee" /></SelectTrigger>
              <SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id}>{e.employeeName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}
        <div className="space-y-1"><Label>Amount</Label><Input name="amount" type="number" value={formData.amount} onChange={(e) => handleFormChange('amount', e.target.value)} readOnly={!isEditing}/></div>
        <div className="space-y-1"><Label>Description</Label><Textarea name="description" value={formData.description} onChange={(e) => handleFormChange('description', e.target.value)} readOnly={!isEditing}/></div>
        <div className="space-y-1"><Label>Flow</Label><RadioGroup value={formData.flow} onValueChange={(v) => handleFormChange('flow', v)} className="flex"><div className="flex items-center space-x-2"><RadioGroupItem value="Cash Out" id={`cash_out_${formData.id}`} disabled={!isEditing}/><Label htmlFor={`cash_out_${formData.id}`}>Cash Out</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="Cash In" id={`cash_in_${formData.id}`} disabled={!isEditing}/><Label htmlFor={`cash_in_${formData.id}`}>Cash In</Label></div></RadioGroup></div>
        <div className="flex items-end space-x-2">
           {isEditing ? (
             <Button onClick={handleSaveClick}><Save className="mr-2 h-4 w-4"/>Save</Button>
           ) : (
             <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4 text-blue-500"/></Button>
           )}
           <Button variant="ghost" size="icon" onClick={() => onRemove(formData.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      </div>
    </div>
  );
};

const Expenses = ({ data, updateData, onSaveAndNext }) => {
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState([]);
  const { toast } = useToast();
  const [expenseTypes] = useLocalStorage('expenseTypes', []);
  const [employees] = useLocalStorage('employees', []);

  useEffect(() => {
    setItems(data?.items || []);
    if (data?.items?.length > 0) {
      setShowForm(true);
    }
  }, [data]);
  
  const handleUpdateItem = (updatedItem) => {
    const updatedItems = items.map(item => item.id === updatedItem.id ? updatedItem : item);
    setItems(updatedItems);
  };
  
  const handleAddItem = () => {
    setItems([...items, { id: uuidv4(), expenseTypeId: '', amount: '', description: '', flow: 'Cash Out', employeeId: '' }]);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const handleSaveAndNextClick = () => {
    const hasUnsaved = items.some(item => !item.expenseTypeName);
     if (hasUnsaved) {
      toast({variant: 'destructive', title: 'Unsaved Changes', description: 'Please save all expense entries before proceeding.'});
      return;
    }
    updateData({ ...data, items });
    onSaveAndNext();
    toast({ title: "Expenses Saved!", description: "Proceeding to next section." });
  };

  if (!showForm) {
    return (
      <Card>
        <CardHeader><CardTitle>Expenses</CardTitle></CardHeader>
        <CardContent className="flex items-center space-x-2">
          <Label>Any Expenses in this shift?</Label>
          <Switch checked={showForm} onCheckedChange={setShowForm} />
          <Button onClick={() => setShowForm(true)}>Yes</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Expense Entry</CardTitle>
        <Button variant="outline" onClick={() => setShowForm(!showForm)}>{showForm ? 'Hide Form' : 'Add New'}</Button>
      </CardHeader>
      <CardContent>
        {showForm && (
            <div className="space-y-4">
                {items.map(item => (
                    <ExpenseEntryForm key={item.id} item={item} onSave={handleUpdateItem} onRemove={handleRemoveItem} expenseTypes={expenseTypes} employees={employees}/>
                ))}
                 <Button variant="outline" size="sm" onClick={handleAddItem} className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" /> Add Expense
                </Button>
            </div>
        )}
        <div className="flex justify-end mt-4">
          <Button onClick={handleSaveAndNextClick} className="bg-green-600 hover:bg-green-700">Save and Next</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Expenses;