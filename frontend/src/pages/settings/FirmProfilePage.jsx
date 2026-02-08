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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Building className="h-8 w-8" />
              </div>
              Firm Profile Management
            </h1>
            <p className="text-green-100 text-lg">Configure your business identity and banking details</p>
          </motion.div>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }}>
        <div className="space-y-8">
          {/* Firm Details Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="premium-card border-2 border-gradient">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <FileText className="h-6 w-6" />
                      </div>
                      Firm & Tax Details
                    </CardTitle>
                    <CardDescription className="text-blue-100 mt-1">
                      Essential business registration and tax information
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="form-grid">
                  <div className="form-field">
                    <Label className="form-label">Firm Name</Label>
                    <Input
                      id="firmName"
                      name="firmName"
                      value={profile.firmName}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your firm name"
                    />
                  </div>
                  <div className="form-field">
                    <Label className="form-label">GST Number</Label>
                    <Input
                      id="gstNo"
                      name="gstNo"
                      value={profile.gstNo}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="22AAAAA0000A1Z5"
                    />
                  </div>
                  <div className="form-field">
                    <Label className="form-label">TIN Number</Label>
                    <Input
                      id="tinNo"
                      name="tinNo"
                      value={profile.tinNo}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter TIN number"
                    />
                  </div>
                  <div className="form-field">
                    <Label className="form-label">RO Code</Label>
                    <Input
                      id="roCode"
                      name="roCode"
                      value={profile.roCode}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter RO code"
                    />
                  </div>
                  <div className="form-field">
                    <Label className="form-label">Firm Tagline</Label>
                    <Input
                      id="tagline"
                      name="tagline"
                      value={profile.tagline}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Your business tagline"
                    />
                  </div>
                  <div className="form-field md:col-span-3">
                    <Label className="form-label">Firm Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      className="form-textarea"
                      placeholder="Complete business address"
                      rows={3}
                    />
                  </div>
                  <div className="form-field">
                    <Label className="form-label">Firm Logo</Label>
                    <div className="space-y-3">
                      <Input
                        id="firmLogo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'firmLogo')}
                        className="hidden"
                      />
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                          {firmLogoPreview ?
                            <img src={firmLogoPreview} alt="Firm logo preview" className="w-full h-full object-cover" />
                            : <Building className="w-8 h-8 text-slate-400" />
                          }
                        </div>
                        <Button asChild variant="outline" className="form-button-outline">
                          <Label htmlFor="firmLogo" className="cursor-pointer">
                            Upload Logo
                          </Label>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Company Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="premium-card border-2 border-gradient">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Building className="h-6 w-6" />
                  </div>
                  Company Details
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Company branding and identification
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="form-grid">
                  <div className="form-field">
                    <Label className="form-label">Company Name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={profile.companyName}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="form-field">
                    <Label className="form-label">Company Short Name</Label>
                    <Input
                      id="companyShortName"
                      name="companyShortName"
                      value={profile.companyShortName}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Short name or acronym"
                    />
                  </div>
                  <div className="form-field">
                    <Label className="form-label">Company Logo</Label>
                    <div className="space-y-3">
                      <Input
                        id="companyLogo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'companyLogo')}
                        className="hidden"
                      />
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                          {companyLogoPreview ?
                            <img src={companyLogoPreview} alt="Company logo preview" className="w-full h-full object-cover" />
                            : <Building className="w-8 h-8 text-slate-400" />
                          }
                        </div>
                        <Button asChild variant="outline" className="form-button-outline">
                          <Label htmlFor="companyLogo" className="cursor-pointer">
                            Upload Logo
                          </Label>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="premium-card border-2 border-gradient">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Contact className="h-6 w-6" />
                  </div>
                  Contact Information
                </CardTitle>
                <CardDescription className="text-green-100">
                  Primary and alternative contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="form-grid">
                  <div className="form-field">
                    <Label className="form-label">Primary Contact</Label>
                    <Input
                      id="contactNo"
                      name="contactNo"
                      value={profile.contactNo}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div className="form-field">
                    <Label className="form-label">Alternative Contact</Label>
                    <Input
                      id="altContactNo"
                      name="altContactNo"
                      value={profile.altContactNo}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bank Account Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="premium-card border-2 border-gradient">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Bank className="h-6 w-6" />
                  </div>
                  Banking Information
                </CardTitle>
                <CardDescription className="text-amber-100">
                  Secure banking details for transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="form-grid">
                  <div className="form-field">
                    <Label className="form-label">Account Holder Name</Label>
                    <Input
                      id="accountHolder"
                      name="accountHolder"
                      value={profile.accountHolder}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Full name as per bank records"
                    />
                  </div>
                  <div className="form-field">
                    <Label className="form-label">Account Number</Label>
                    <Input
                      id="accountNo"
                      name="accountNo"
                      value={profile.accountNo}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Bank account number"
                    />
                  </div>
                  <div className="form-field">
                    <Label className="form-label">IFSC Code</Label>
                    <Input
                      id="ifsc"
                      name="ifsc"
                      value={profile.ifsc}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="ABCD0123456"
                    />
                  </div>
                  <div className="form-field">
                    <Label className="form-label">Bank Name</Label>
                    <Input
                      id="bankName"
                      name="bankName"
                      value={profile.bankName}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Name of the bank"
                    />
                  </div>
                  <div className="form-field md:col-span-2">
                    <Label className="form-label">Branch Address</Label>
                    <Input
                      id="branchAddress"
                      name="branchAddress"
                      value={profile.branchAddress}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Complete branch address"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="form-divider"></div>

          <div className="form-button-group">
            <Button
              type="submit"
              className="form-button-primary"
            >
              <Save className="mr-2 h-5 w-5" />Save All Changes
            </Button>
          </div>
        </div>
     </form>
   </motion.div>
 );
};

export default FirmProfilePage;