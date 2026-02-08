import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const EmployeeForm = ({ onSave, employee, onCancel }) => {
  const initialFormData = {
    joinDate: new Date(),
    dob: new Date(),
    employeeName: '',
    employeeNumber: '',
    phone: '',
    email: '',
    bloodGroup: '',
    idProof: '',
    designation: '',
    salary: '',
    salaryType: 'Per Duty',
    photo: '',
    address: '',
    description: '',
    providentFund: false,
    incomeTax: false,
    employeeStateInsurance: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (employee) {
      setFormData({
        ...initialFormData,
        ...employee,
        joinDate: employee.joinDate ? new Date(employee.joinDate) : new Date(),
        dob: employee.dob ? new Date(employee.dob) : new Date(),
      });
      if (employee.photo) {
        setPhotoPreview(employee.photo);
      }
    } else {
      setFormData(initialFormData);
      setPhotoPreview(null);
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({ ...prev, [name]: date }));
  };
  
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
        ...formData,
        joinDate: formData.joinDate ? format(formData.joinDate, 'yyyy-MM-dd') : null,
        dob: formData.dob ? format(formData.dob, 'yyyy-MM-dd') : null,
    });
    setFormData(initialFormData);
    setPhotoPreview(null);
  };
  
  const handleCancel = () => {
    setFormData(initialFormData);
    setPhotoPreview(null);
    if(onCancel) onCancel();
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>{employee ? 'Edit Employee' : 'Create Employee'}</CardTitle>
        <CardDescription>{employee ? 'Update the details of the existing employee.' : 'Add a new employee to your organization.'}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label>Employee Name*</Label>
              <Input name="employeeName" value={formData.employeeName} onChange={handleChange} required />
            </div>
            <div className="space-y-1">
              <Label>Employee Number</Label>
              <Input name="employeeNumber" value={formData.employeeNumber} onChange={handleChange} />
            </div>
             <div className="space-y-1">
              <Label>Designation*</Label>
              <Input name="designation" value={formData.designation} onChange={handleChange} required />
            </div>
            <div className="space-y-1">
              <Label>Phone No.</Label>
              <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
             <div className="space-y-1">
              <Label>Date of Birth</Label>
               <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.dob && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dob ? format(new Date(formData.dob), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={new Date(formData.dob)} onSelect={(d) => handleDateChange('dob', d)} initialFocus /></PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label>Blood Group</Label>
              <Input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <Label>Join Date*</Label>
               <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.joinDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.joinDate ? format(new Date(formData.joinDate), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={new Date(formData.joinDate)} onSelect={(d) => handleDateChange('joinDate', d)} initialFocus /></PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label>ID Proof No.</Label>
              <Input name="idProof" value={formData.idProof} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <Label>Salary</Label>
              <div className="flex gap-2">
                <Select onValueChange={(v) => handleSelectChange('salaryType', v)} value={formData.salaryType}>
                  <SelectTrigger className="w-1/2"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Per Duty">Per Duty</SelectItem><SelectItem value="Per Month">Per Month</SelectItem></SelectContent>
                </Select>
                <Input name="salary" type="number" className="w-1/2" value={formData.salary} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-1 lg:col-span-2">
              <Label>Address</Label>
              <Textarea name="address" value={formData.address} onChange={handleChange} rows={1} />
            </div>
             <div className="space-y-1">
              <Label>Upload Photo</Label>
              <Input name="photo" type="file" onChange={handlePhotoChange} className="text-xs"/>
            </div>
             {photoPreview && <img src={photoPreview} alt="preview" className="h-16 w-16 object-cover rounded-md border p-1"/>}
          </div>
          
          <div className="space-y-2">
              <Label>Benefits</Label>
              <div className="flex items-center flex-wrap gap-4">
                <div className="flex items-center space-x-2"><Checkbox id="providentFund" name="providentFund" checked={formData.providentFund} onCheckedChange={(c) => handleSelectChange('providentFund', c)} /><Label htmlFor="providentFund">Provident Fund</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="incomeTax" name="incomeTax" checked={formData.incomeTax} onCheckedChange={(c) => handleSelectChange('incomeTax', c)} /><Label htmlFor="incomeTax">Income Tax</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="employeeStateInsurance" name="employeeStateInsurance" checked={formData.employeeStateInsurance} onCheckedChange={(c) => handleSelectChange('employeeStateInsurance', c)} /><Label htmlFor="employeeStateInsurance">Employee State Insurance</Label></div>
              </div>
            </div>
            
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button type="submit"><Save className="mr-2 h-4 w-4" /> {employee ? 'Update Employee' : 'Save Employee'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployeeForm;