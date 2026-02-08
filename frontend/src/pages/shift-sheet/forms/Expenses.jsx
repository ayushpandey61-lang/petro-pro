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
    <div className="form-section border-l-4 border-l-green-500">
      <div className="form-grid">
        <div className="form-field">
          <Label className="form-label">Expense Type</Label>
          <Select onValueChange={(v) => handleFormChange('expenseTypeId', v)} value={formData.expenseTypeId || ''} disabled={!isEditing}>
            <SelectTrigger className="form-select">
              <SelectValue placeholder="Choose Type" />
            </SelectTrigger>
            <SelectContent>
              {expenseTypes.map(et => (
                <SelectItem key={et.id} value={et.id}>{et.category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {isEmployeeRequired && (
          <div className="form-field">
            <Label className="form-label">Employee</Label>
            <Select onValueChange={(v) => handleFormChange('employeeId', v)} value={formData.employeeId || ''} disabled={!isEditing}>
              <SelectTrigger className="form-select">
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(e => (
                  <SelectItem key={e.id} value={e.id}>{e.employeeName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="form-field">
          <Label className="form-label">Amount (₹)</Label>
          <Input
            name="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => handleFormChange('amount', e.target.value)}
            readOnly={!isEditing}
            className="form-input"
            placeholder="0.00"
          />
        </div>
        <div className="form-field">
          <Label className="form-label">Description</Label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={(e) => handleFormChange('description', e.target.value)}
            readOnly={!isEditing}
            className="form-textarea"
            placeholder="Enter description..."
            rows={2}
          />
        </div>
        <div className="form-field">
          <Label className="form-label">Flow Type</Label>
          <RadioGroup
            value={formData.flow}
            onValueChange={(v) => handleFormChange('flow', v)}
            className="flex gap-4 pt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Cash Out" id={`cash_out_${formData.id}`} disabled={!isEditing}/>
              <Label htmlFor={`cash_out_${formData.id}`} className="form-label cursor-pointer">Cash Out</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Cash In" id={`cash_in_${formData.id}`} disabled={!isEditing}/>
              <Label htmlFor={`cash_in_${formData.id}`} className="form-label cursor-pointer">Cash In</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex items-end space-x-2">
           {isEditing ? (
             <Button onClick={handleSaveClick} className="form-button-primary">
               <Save className="mr-2 h-4 w-4"/>Save
             </Button>
           ) : (
             <Button variant="outline" size="icon" onClick={() => setIsEditing(true)} className="form-button-outline">
               <Edit className="h-4 w-4"/>
             </Button>
           )}
           <Button variant="outline" size="icon" onClick={() => onRemove(formData.id)} className="border-red-500 text-red-600 hover:bg-red-50">
             <Trash2 className="h-4 w-4" />
           </Button>
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
      <div className="form-container premium-card">
        <div className="form-header">
          <div className="relative z-10">
            <h2 className="form-title">Expenses</h2>
            <p className="form-description mt-1 opacity-90">Record expenses for this shift</p>
          </div>
        </div>
        <div className="form-content">
          <div className="flex items-center justify-center space-x-4 py-8">
            <Label className="form-label text-lg">Any Expenses in this shift?</Label>
            <Switch checked={showForm} onCheckedChange={setShowForm} />
            <Button onClick={() => setShowForm(true)} className="form-button-primary">
              Yes, Add Expenses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container premium-card">
      <div className="form-header">
        <div className="relative z-10">
          <h2 className="form-title">Expense Entry</h2>
          <p className="form-description mt-1 opacity-90">Manage shift expenses</p>
        </div>
      </div>
      <div className="form-content">
        <div className="space-y-6">
          {items.map(item => (
            <ExpenseEntryForm
              key={item.id}
              item={item}
              onSave={handleUpdateItem}
              onRemove={handleRemoveItem}
              expenseTypes={expenseTypes}
              employees={employees}
            />
          ))}
          <div className="text-center">
            <Button variant="outline" onClick={handleAddItem} className="form-button-outline">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Expense Entry
            </Button>
          </div>
        </div>
        <div className="form-divider"></div>
        <div className="form-button-group">
          <Button variant="outline" onClick={() => setShowForm(false)} className="form-button-secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveAndNextClick} className="form-button-primary">
            Save and Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Expenses;