import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Save, Wallet as Bank, Contact, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useOrg } from '@/hooks/useOrg';

const ImageUploader = ({ label, name, value, onChange, preview }) => (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} type="file" accept="image/*" onChange={(e) => onChange(e, name)} />
      {preview && <img src={preview} alt={`${label} Preview`} className="mt-2 h-20 w-auto object-contain border p-1 rounded-md" />}
    </div>
  );

const OrganisationDetailsPage = () => {
    const { toast } = useToast();
    const { orgDetails, setOrgDetails } = useOrg();

    const [details, setDetails] = useState(orgDetails);
    const [firmLogoPreview, setFirmLogoPreview] = useState(orgDetails.firmLogo);
    const [companyLogoPreview, setCompanyLogoPreview] = useState(orgDetails.companyLogo);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, logoType) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                setDetails(prev => ({ ...prev, [logoType]: result }));
                if (logoType === 'firmLogo') setFirmLogoPreview(result);
                if (logoType === 'companyLogo') setCompanyLogoPreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setOrgDetails(details);
        toast({ title: "Success", description: "Organisation details saved successfully." });
    };

    return (
        <>
            <Helmet>
                <title>Organisation Details - PetroPro</title>
                <meta name="description" content="Manage your organisation's details." />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6"
            >
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Building /> Organisation Details</CardTitle>
                            <CardDescription>Update your bunk's information, branding, and other critical business details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            
                            <div className="space-y-4 p-4 border rounded-lg">
                                <h3 className="font-semibold text-lg flex items-center gap-2"><FileText className="w-5 h-5" /> Firm & Tax Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-2"><Label>Bunk/Firm Name</Label><Input name="firmName" value={details.firmName} onChange={handleChange} /></div>
                                    <div className="space-y-2"><Label>GST No.</Label><Input name="gstNo" value={details.gstNo} onChange={handleChange} /></div>
                                    <div className="space-y-2"><Label>TIN No.</Label><Input name="tinNo" value={details.tinNo} onChange={handleChange} /></div>
                                    <div className="space-y-2"><Label>RO Code</Label><Input name="roCode" value={details.roCode} onChange={handleChange} /></div>
                                    <div className="space-y-2"><Label>Firm Tagline</Label><Input name="tagline" value={details.tagline} onChange={handleChange} /></div>
                                    <div className="space-y-2"><Label>Bunk Activation Code</Label><Input name="activationCode" value={details.activationCode} onChange={handleChange} /></div>
                                    <div className="md:col-span-2 lg:col-span-3 space-y-2"><Label>Firm Address</Label><Textarea name="address" value={details.address} onChange={handleChange} /></div>
                                    <ImageUploader label="Firm Logo (Left)" name="firmLogo" value={details.firmLogo} onChange={handleFileChange} preview={firmLogoPreview} />
                                </div>
                            </div>
                            
                            <div className="space-y-4 p-4 border rounded-lg">
                                <h3 className="font-semibold text-lg flex items-center gap-2"><Building className="w-5 h-5" /> Company & System Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label>Company Name</Label>
                                        <Select name="companyName" onValueChange={(v) => handleSelectChange('companyName', v)} value={details.companyName}>
                                            <SelectTrigger><SelectValue placeholder="Select Company" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="BPCL">BPCL</SelectItem>
                                                <SelectItem value="IOCL">IOCL</SelectItem>
                                                <SelectItem value="HPCL">HPCL</SelectItem>
                                                <SelectItem value="NYARA">NYARA</SelectItem>
                                                <SelectItem value="ESSAR">ESSAR</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2"><Label>Company Short Name</Label><Input name="companyShortName" value={details.companyShortName} onChange={handleChange} /></div>
                                    <ImageUploader label="Company Logo (Right)" name="companyLogo" value={details.companyLogo} onChange={handleFileChange} preview={companyLogoPreview} />
                                    <div className="space-y-2">
                                        <Label>Number Format</Label>
                                        <Select name="numberFormat" onValueChange={(v) => handleSelectChange('numberFormat', v)} value={details.numberFormat}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Indian">Indian (Lakhs, Crores)</SelectItem>
                                                <SelectItem value="International">International (Millions, Billions)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2"><Label>Currency Symbol</Label><Input name="currencySymbol" value={details.currencySymbol} onChange={handleChange} /></div>
                                    <div className="space-y-2 col-span-full"><Label>Bunk Details/Description</Label><Textarea name="bunkDetails" value={details.bunkDetails} onChange={handleChange} /></div>
                                </div>
                            </div>

                            <div className="space-y-4 p-4 border rounded-lg">
                                <h3 className="font-semibold text-lg flex items-center gap-2"><Contact className="w-5 h-5" /> Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2"><Label>Primary Contact No.</Label><Input name="contactNo" value={details.contactNo} onChange={handleChange} /></div>
                                    <div className="space-y-2"><Label>Alternative Contact No.</Label><Input name="altContactNo" value={details.altContactNo} onChange={handleChange} /></div>
                                    <div className="space-y-2"><Label>Email ID</Label><Input type="email" name="email" value={details.email} onChange={handleChange} /></div>
                                </div>
                            </div>
                            
                            <div className="space-y-4 p-4 border rounded-lg">
                                <h3 className="font-semibold text-lg flex items-center gap-2"><Bank className="w-5 h-5" /> Bank Account Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-2"><Label>Account Holder Name</Label><Input name="accountHolder" value={details.accountHolder} onChange={handleChange} /></div>
                                    <div className="space-y-2"><Label>Account No.</Label><Input name="accountNo" value={details.accountNo} onChange={handleChange} /></div>
                                    <div className="space-y-2"><Label>IFSC Code</Label><Input name="ifsc" value={details.ifsc} onChange={handleChange} /></div>
                                    <div className="space-y-2"><Label>Bank Name</Label><Input name="bankName" value={details.bankName} onChange={handleChange} /></div>
                                    <div className="md:col-span-2 space-y-2"><Label>Branch Address</Label><Input name="branchAddress" value={details.branchAddress} onChange={handleChange} /></div>
                                </div>
                            </div>

                        </CardContent>
                        <div className="flex justify-end p-6 border-t">
                            <Button type="submit"><Save className="mr-2 h-4 w-4" />Save All Details</Button>
                        </div>
                    </Card>
                </form>
            </motion.div>
        </>
    );
};

export default OrganisationDetailsPage;