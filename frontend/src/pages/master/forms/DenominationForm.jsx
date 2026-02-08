import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

const DenominationForm = ({ onSave, denomination }) => {
  const [denominations, setDenominations] = useState([{ value: '' }]);

  useEffect(() => {
    if (denomination) {
      setDenominations([{ value: denomination.denomination }]);
    }
  }, [denomination]);

  const handleChange = (index, e) => {
    const newDenominations = [...denominations];
    newDenominations[index].value = e.target.value;
    setDenominations(newDenominations);
  };

  const addRow = () => {
    setDenominations([...denominations, { value: '' }]);
  };

  const removeRow = (index) => {
    const newDenominations = denominations.filter((_, i) => i !== index);
    setDenominations(newDenominations);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    denominations.forEach(d => {
      if (d.value) {
        onSave({ denomination: d.value });
      }
    });
    setDenominations([{ value: '' }]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Denomination</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-2">
          {denominations.map((d, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="space-y-1 flex-grow">
                <Label>Denomination *</Label>
                <Input name="denomination" type="number" value={d.value} onChange={(e) => handleChange(index, e)} required />
              </div>
              {denominations.length > 1 && (
                <Button type="button" variant="destructive" size="icon" onClick={() => removeRow(index)}><Trash2 className="h-4 w-4" /></Button>
              )}
              {index === denominations.length - 1 && (
                <Button type="button" size="icon" variant="ghost" onClick={addRow}><PlusCircle className="text-blue-500 h-6 w-6"/></Button>
              )}
            </div>
          ))}
          <div className="flex justify-end">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Save</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DenominationForm;