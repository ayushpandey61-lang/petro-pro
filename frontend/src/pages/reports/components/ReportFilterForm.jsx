import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { useOrg } from '@/hooks/useOrg';

const ReportFilterForm = ({ title, fields, showTitle = true, onSubmit }) => {
  const [formState, setFormState] = useState({});
  const { toast } = useToast();
  const { orgDetails } = useOrg();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSubmit === 'function') {
      // Include organization details with form data
      const reportData = {
        ...formState,
        organization: {
          firmName: orgDetails.firmName,
          companyName: orgDetails.companyName,
          address: orgDetails.address,
          contactNo: orgDetails.contactNo,
          email: orgDetails.email,
          gstNo: orgDetails.gstNo,
          bunkDetails: orgDetails.bunkDetails,
          currencySymbol: orgDetails.currencySymbol
        }
      };
      onSubmit(reportData);
    } else {
        toast({
            title: "🚧 Feature in Progress",
            description: "This report isn't fully wired up yet, but the functionality is coming soon!",
            variant: "default",
        });
    }
  };

  const handleDateRangeChange = (fieldName, rangePart, date) => {
    setFormState(prev => ({
        ...prev, 
        [fieldName]: {
            ...prev[fieldName],
            [rangePart]: date
        }
    }));
  };

  const handleChange = (name, value) => {
    setFormState(prev => ({...prev, [name]: value}));
  }

  const renderField = (field) => {
    const value = formState[field.name];

    switch (field.type) {
      case 'dateRange':
        return (
          <div key={field.name} className="space-y-1">
            <Label>{field.label}</Label>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {value?.from ? format(value.from, "PPP") : <span>From Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={value?.from} onSelect={(date) => handleDateRangeChange(field.name, 'from', date)} /></PopoverContent>
              </Popover>
              <span>-</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {value?.to ? format(value.to, "PPP") : <span>To Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={value?.to} onSelect={(date) => handleDateRangeChange(field.name, 'to', date)}/></PopoverContent>
              </Popover>
            </div>
          </div>
        );
      case 'date':
         return (
          <div key={field.name} className="space-y-1">
             <Label>{field.label}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={value} onSelect={(date) => handleChange(field.name, date)} /></PopoverContent>
            </Popover>
           </div>
        );
      case 'select':
        return (
          <div key={field.name} className="space-y-1">
            <Label>{field.label}</Label>
            <Select onValueChange={(val) => handleChange(field.name, val)}>
              <SelectTrigger><SelectValue placeholder={`Select ${field.label}`} /></SelectTrigger>
              <SelectContent>{field.options?.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        );
      case 'checkbox':
        return (
          <div key={field.name} className="flex items-center space-x-2 pt-6">
            <Checkbox id={field.name} onCheckedChange={(checked) => handleChange(field.name, checked)} />
            <Label htmlFor={field.name}>{field.label}</Label>
          </div>
        );
      case 'radio':
        return (
            <div key={field.name} className="space-y-2">
                <Label>{field.label}</Label>
                <RadioGroup onValueChange={(val) => handleChange(field.name, val)} className="flex gap-4">
                    {field.options?.map(opt => (
                        <div key={opt.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt.value} id={`${field.name}-${opt.value}`} />
                            <Label htmlFor={`${field.name}-${opt.value}`}>{opt.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>
        );
      default:
        return (
          <div key={field.name} className="space-y-1">
            <Label>{field.label}</Label>
            <Input type={field.type} onChange={(e) => handleChange(field.name, e.target.value)} />
          </div>
        );
    }
  };

  return (
    <Card className="glass w-full">
      {showTitle && (
        <CardHeader className="p-4 border-b">
            <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            {fields.map(renderField)}
          </div>
          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportFilterForm;