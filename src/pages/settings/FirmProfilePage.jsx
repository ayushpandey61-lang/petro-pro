import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, Save, Wallet as Bank, Contact, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useOrg } from '@/hooks/useOrg';

const ImageUploader = ({ label, name, value, onChange, preview }) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Input id={name} type="file" accept="image/*" onChange={(e) => onChange(e, name)} />
    {preview && <img src={preview} alt={`${label} Preview`} className="mt-2 h-20 w-auto object-contain border p-1 rounded-md" />}
  </div>
);

const FirmProfilePage = () => {
  const { orgDetails, setOrgDetails } = useOrg();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState(orgDetails);
  const [firmLogoPreview, setFirmLogoPreview] = useState(orgDetails.firmLogo);
  const [companyLogoPreview, setCompanyLogoPreview] = useState(orgDetails.companyLogo);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, logoType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setProfile(prev => ({ ...prev, [logoType]: result }));
        if (logoType === 'firmLogo') {
          setFirmLogoPreview(result);
        } else if (logoType === 'companyLogo') {
          setCompanyLogoPreview(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    setOrgDetails(profile);
    toast({
      title: "Profile Saved!",
      description: "Your firm's profile has been successfully updated.",
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building /> Firm Profile</CardTitle>
            <CardDescription>Manage your firm's central details and branding. This information will be used across the application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Firm Details Section */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold text-lg flex items-center gap-2"><FileText className="w-5 h-5" /> Firm & Tax Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2"><Label htmlFor="firmName">Firm Name</Label><Input id="firmName" name="firmName" value={profile.firmName} onChange={handleChange} /></div>
                <div className="space-y-2"><Label htmlFor="gstNo">GST No.</Label><Input id="gstNo" name="gstNo" value={profile.gstNo} onChange={handleChange} /></div>
                <div className="space-y-2"><Label htmlFor="tinNo">TIN No.</Label><Input id="tinNo" name="tinNo" value={profile.tinNo} onChange={handleChange} /></div>
                <div className="space-y-2"><Label htmlFor="roCode">RO Code</Label><Input id="roCode" name="roCode" value={profile.roCode} onChange={handleChange} /></div>
                <div className="space-y-2"><Label htmlFor="tagline">Firm Tagline</Label><Input id="tagline" name="tagline" value={profile.tagline} onChange={handleChange} /></div>
                <div className="md:col-span-2 lg:col-span-3 space-y-2"><Label htmlFor="address">Firm Address</Label><Textarea id="address" name="address" value={profile.address} onChange={handleChange} /></div>
                <ImageUploader label="Firm Logo" name="firmLogo" value={profile.firmLogo} onChange={handleFileChange} preview={firmLogoPreview} />
              </div>
            </div>

            {/* Company Details Section */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold text-lg flex items-center gap-2"><Building className="w-5 h-5" /> Company Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2"><Label htmlFor="companyName">Company Name</Label><Input id="companyName" name="companyName" value={profile.companyName} onChange={handleChange} /></div>
                <div className="space-y-2"><Label htmlFor="companyShortName">Company Short Name</Label><Input id="companyShortName" name="companyShortName" value={profile.companyShortName} onChange={handleChange} /></div>
                <ImageUploader label="Company Logo" name="companyLogo" value={profile.companyLogo} onChange={handleFileChange} preview={companyLogoPreview} />
              </div>
            </div>

            {/* Contact Details Section */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold text-lg flex items-center gap-2"><Contact className="w-5 h-5" /> Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><Label htmlFor="contactNo">Contact No.</Label><Input id="contactNo" name="contactNo" value={profile.contactNo} onChange={handleChange} /></div>
                <div className="space-y-2"><Label htmlFor="altContactNo">Alternative Contact No.</Label><Input id="altContactNo" name="altContactNo" value={profile.altContactNo} onChange={handleChange} /></div>
              </div>
            </div>

            {/* Bank Account Details Section */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold text-lg flex items-center gap-2"><Bank className="w-5 h-5" /> Bank Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2"><Label htmlFor="accountHolder">Account Holder Name</Label><Input id="accountHolder" name="accountHolder" value={profile.accountHolder} onChange={handleChange} /></div>
                <div className="space-y-2"><Label htmlFor="accountNo">Account No.</Label><Input id="accountNo" name="accountNo" value={profile.accountNo} onChange={handleChange} /></div>
                <div className="space-y-2"><Label htmlFor="ifsc">IFSC Code</Label><Input id="ifsc" name="ifsc" value={profile.ifsc} onChange={handleChange} /></div>
                <div className="space-y-2"><Label htmlFor="bankName">Bank Name</Label><Input id="bankName" name="bankName" value={profile.bankName} onChange={handleChange} /></div>
                <div className="md:col-span-2 space-y-2"><Label htmlFor="branchAddress">Branch Address</Label><Input id="branchAddress" name="branchAddress" value={profile.branchAddress} onChange={handleChange} /></div>
              </div>
            </div>
          </CardContent>
          <div className="flex justify-end p-6 border-t">
            <Button type="submit"><Save className="mr-2 h-4 w-4" />Save All Changes</Button>
          </div>
        </Card>
      </form>
    </motion.div>
  );
};

export default FirmProfilePage;