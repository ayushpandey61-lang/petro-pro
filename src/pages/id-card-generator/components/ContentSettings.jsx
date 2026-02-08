import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format } from 'date-fns';

const ContentSettings = ({ content, setContent, employees, loadEmployeeData }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  const handleTermsChange = (index, value) => {
    const newTerms = [...content.terms];
    newTerms[index] = value;
    setContent(prev => ({ ...prev, terms: newTerms }));
  };
  
  const handleEmployeeSelect = (employeeId) => {
    const employee = employees.find(e => e.id === employeeId);
    if(employee) {
        loadEmployeeData(employee);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Content Settings</h3>
      <div className="space-y-2">
        <Label>Autofill from Employee</Label>
        <Select onValueChange={handleEmployeeSelect} value={employees.find(e => e.employeeNumber === content.employeeId || e.id === content.employeeId)?.id || null}>
          <SelectTrigger>
            <SelectValue placeholder="Select an employee..." />
          </SelectTrigger>
          <SelectContent>
            {employees.map(emp => (
              <SelectItem key={emp.id} value={emp.id}>{emp.employeeName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Accordion type="multiple" defaultValue={['employee-details', 'org-details']}>
        <AccordionItem value="employee-details">
          <AccordionTrigger>Employee Details</AccordionTrigger>
          <AccordionContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><Label>Full Name</Label><Input name="name" value={content.name} onChange={handleChange} /></div>
                <div className="space-y-1"><Label>Designation</Label><Input name="designation" value={content.designation} onChange={handleChange} /></div>
                <div className="space-y-1"><Label>Employee ID</Label><Input name="employeeId" value={content.employeeId} onChange={handleChange} /></div>
                <div className="space-y-1"><Label>Date of Birth</Label><Input name="dob" type="date" value={content.dob} onChange={handleChange} /></div>
                <div className="space-y-1"><Label>Joined Date</Label><Input name="joinedDate" type="date" value={content.joinedDate} onChange={handleChange} /></div>
                <div className="space-y-1"><Label>Blood Group</Label><Input name="bloodGroup" value={content.bloodGroup} onChange={handleChange} /></div>
                <div className="space-y-1"><Label>Phone Number</Label><Input name="phone" value={content.phone} onChange={handleChange} /></div>
                <div className="space-y-1"><Label>Email</Label><Input name="email" value={content.email} onChange={handleChange} /></div>
            </div>
            <div className="space-y-1"><Label>Address</Label><Textarea name="address" value={content.address} onChange={handleChange} rows={2}/></div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="org-details">
          <AccordionTrigger>Organisation Details</AccordionTrigger>
          <AccordionContent className="space-y-2">
            <div className="space-y-1"><Label>Organisation Name</Label><Input name="orgName" value={content.orgName} onChange={handleChange} /></div>
            <div className="space-y-1"><Label>Tagline</Label><Input name="orgTagline" value={content.orgTagline} onChange={handleChange} /></div>
            <div className="space-y-1"><Label>Company Name (Short)</Label><Input name="companyName" value={content.companyName} onChange={handleChange} /></div>
            <div className="space-y-1"><Label>RO Code</Label><Input name="roCode" value={content.roCode} onChange={handleChange} /></div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="terms-conditions">
          <AccordionTrigger>Terms & Conditions</AccordionTrigger>
          <AccordionContent className="space-y-2">
            {content.terms.map((term, index) => (
                <div className="space-y-1" key={index}>
                    <Label>Term {index + 1}</Label>
                    <Input value={term} onChange={(e) => handleTermsChange(index, e.target.value)} />
                </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="footer-content">
            <AccordionTrigger>Backside Content</AccordionTrigger>
            <AccordionContent className="space-y-2">
                <div className="space-y-1"><Label>Organisation Address</Label><Textarea name="orgAddress" value={content.orgAddress} onChange={handleChange} rows={2}/></div>
                <div className="space-y-1"><Label>Emergency Contact</Label><Input name="emergencyContact" value={content.emergencyContact} onChange={handleChange} /></div>
                 <div className="space-y-1"><Label>Footer Org Name</Label><Input name="footerOrgName" value={content.footerOrgName} onChange={handleChange} /></div>
            </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
};

export default ContentSettings;