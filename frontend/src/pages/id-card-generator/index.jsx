import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Save, Printer } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useOrg } from '@/hooks/useOrg';
import IdCardPreview from '@/pages/id-card-generator/components/IdCardPreview';
import IdCardControls from '@/pages/id-card-generator/components/IdCardControls';
import { handleDownloadPdf, handlePrint } from '@/lib/idCardUtils';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const MAX_TEMPLATES = 5;

const IdCardGeneratorPage = () => {
    const { orgDetails } = useOrg();
    const location = useLocation();
    const { toast } = useToast();
    const [templates, setTemplates] = useLocalStorage('idCardTemplates_v2', []);
    const [employees] = useLocalStorage('employees', []);
    
    const getDefaultContent = () => ({
        employeeId: '', name: '', designation: '', dob: '', joinedDate: '',
        bloodGroup: '', phone: '', email: '', address: '',
        roCode: orgDetails.roCode || '',
        orgName: orgDetails.firmName || 'Your Firm Name',
        orgTagline: orgDetails.tagline || 'Your Tagline',
        companyName: orgDetails.companyShortName || 'COMP',
        orgAddress: orgDetails.address || 'Your Firm Address',
        footerOrgName: orgDetails.firmName || 'Your Firm Name',
        emergencyContact: orgDetails.contactNo || 'Emergency Contact',
        terms: [
          'This card is non-transferable.', 'Misuse of this card is a punishable offense.',
          'Card must be presented upon request.', 'Loss of card must be reported immediately.',
          'This card remains the property of the issuer.'
        ],
    });
    
    const getDefaultImages = () => ({
        orgLogo: orgDetails.firmLogo || '',
        companyLogo: orgDetails.companyLogo || '',
        employeePhoto: '', issuerSign: '', qrCode: '', cardBackground: '',
    });

    const [content, setContent] = useState(getDefaultContent());
    const [images, setImages] = useState(getDefaultImages());
    
    const defaultStyles = {
        headerColor: '#0c2f6b', headerTextColor: '#ffffff',
        frontFooterColor: '#0c2f6b', frontFooterTextColor: '#ffffff',
        backFooterColor: '#0c2f6b', backFooterTextColor: '#ffffff',
        mainTextColor: '#000000', borderColor: '#5a2d91', borderWidth: 2,
        stripColor: '#f7b500', stripHeight: 4, taglineColor: '#f7b500',
        taglineSize: 9, orgNameColor: '#ffffff', orgNameSize: 14,
        companyNameColor: '#ffffff', companyNameSize: 8, nameSize: 16,
        designationSize: 11, designationColor: '#555555', cardWidth: 3.375,
        cardHeight: 2.125, watermarkText: orgDetails.companyShortName || 'COMP',
        watermarkColor: '#000000', watermarkSize: 80, watermarkOpacity: 0.05,
        photoWidth: 30, orgLogoSize: 36, companyLogoSize: 36
    };

    const [styles, setStyles] = useState(defaultStyles);
    const [activeTemplate, setActiveTemplate] = useState(null);
    const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
    const [pendingTemplate, setPendingTemplate] = useState(null);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [templateName, setTemplateName] = useState('');

    const cardFrontRef = useRef(null);
    const cardBackRef = useRef(null);

    const loadEmployeeData = (employee) => {
        if (employee) {
            const currentEmployeeData = {
                employeeId: employee.employeeNumber || employee.id,
                name: employee.employeeName || '',
                designation: employee.designation || '',
                dob: employee.dob ? format(new Date(employee.dob), 'yyyy-MM-dd') : '',
                joinedDate: employee.joinDate ? format(new Date(employee.joinDate), 'yyyy-MM-dd') : '',
                bloodGroup: employee.bloodGroup || '',
                phone: employee.phone || '',
                email: employee.email || '',
                address: employee.address || '',
            };

            const currentEmployeeImage = {
                employeePhoto: employee.photo || '',
            };

            if (activeTemplate) {
                 setContent({
                    ...activeTemplate.content,
                    ...currentEmployeeData,
                });
                setImages({
                    ...activeTemplate.images,
                    ...currentEmployeeImage,
                });
                setStyles(activeTemplate.styles);
            } else {
                 setContent(prev => ({
                    ...getDefaultContent(),
                    ...currentEmployeeData,
                }));
                setImages(prev => ({
                    ...getDefaultImages(),
                    ...currentEmployeeImage
                }));
                setStyles(defaultStyles);
            }
            toast({ title: 'Employee Loaded!', description: `${employee.employeeName}'s data has been loaded.` });
        }
    };
    
    useEffect(() => {
        const employeeId = location.state?.employeeId;
        if (employeeId) {
            const employeeToLoad = employees.find(e => e.id === employeeId);
            if(employeeToLoad) loadEmployeeData(employeeToLoad);
        }
    }, [location.state, employees, activeTemplate]);
    
    useEffect(() => {
        if (!activeTemplate) {
            setContent(prev => ({
                ...prev,
                roCode: orgDetails.roCode || prev.roCode,
                orgName: orgDetails.firmName || prev.orgName,
                orgTagline: orgDetails.tagline || prev.orgTagline,
                companyName: orgDetails.companyShortName || prev.companyName,
                orgAddress: orgDetails.address || prev.orgAddress,
                footerOrgName: orgDetails.firmName || prev.footerOrgName,
                emergencyContact: orgDetails.contactNo || prev.emergencyContact,
            }));
            setImages(prev => ({
                ...prev,
                orgLogo: orgDetails.firmLogo || prev.orgLogo,
                companyLogo: orgDetails.companyLogo || prev.companyLogo,
            }));
            setStyles(prev => ({
                ...prev,
                watermarkText: orgDetails.companyShortName || prev.watermarkText,
            }));
        }
    }, [orgDetails, activeTemplate]);

    const onDownload = () => handleDownloadPdf(cardFrontRef.current, cardBackRef.current, styles, content.name, toast);
    const onPrint = () => handlePrint(cardFrontRef.current, cardBackRef.current, content.name);

    const handleSaveTemplate = () => {
        if (templateName) {
            const { employeeId, name, designation, dob, joinedDate, bloodGroup, phone, email, address, ...restContent } = content;
            const { employeePhoto, ...restImages } = images;

            const newTemplate = {
                name: templateName, id: `template-${Date.now()}`,
                content: restContent,
                images: restImages,
                styles,
            };

            if (templates.length >= MAX_TEMPLATES) {
                setPendingTemplate(newTemplate);
                setShowReplaceConfirm(true);
            } else {
                setTemplates(prev => [...prev, newTemplate]);
                toast({ title: 'Template Saved!', description: `Template "${templateName}" has been saved.` });
            }
            setTemplateName('');
            setShowSaveDialog(false);
        }
    };

    const handleConfirmReplace = () => {
        if (pendingTemplate) {
            setTemplates(prev => [...prev.slice(1), pendingTemplate]);
            toast({ title: 'Template Saved!', description: `Replaced the oldest template with "${pendingTemplate.name}".` });
            setPendingTemplate(null);
        }
        setShowReplaceConfirm(false);
    };

    const handleLoadTemplate = (template) => {
        setActiveTemplate(template);
        const currentEmployee = employees.find(e => e.id === content.employeeId);
        const employeeContent = currentEmployee ? {
            employeeId: currentEmployee.employeeNumber || currentEmployee.id,
            name: currentEmployee.employeeName || '',
            designation: currentEmployee.designation || '',
            dob: currentEmployee.dob ? format(new Date(currentEmployee.dob), 'yyyy-MM-dd') : '',
            joinedDate: currentEmployee.joinDate ? format(new Date(currentEmployee.joinDate), 'yyyy-MM-dd') : '',
            bloodGroup: currentEmployee.bloodGroup || '',
            phone: currentEmployee.phone || '',
            email: currentEmployee.email || '',
            address: currentEmployee.address || '',
        } : { 
            employeeId: '', name: '', designation: '', dob: '', joinedDate: '', bloodGroup: '', phone: '', email: '', address: '' 
        };

        const employeeImages = currentEmployee ? { employeePhoto: currentEmployee.photo || '' } : { employeePhoto: '' };

        setContent({ ...template.content, ...employeeContent });
        setImages({ ...template.images, ...employeeImages });
        setStyles(template.styles);
        toast({ title: 'Template Loaded!', description: `Template "${template.name}" has been loaded.` });
    };
  
    const handleDeleteTemplate = (templateId) => {
        if (activeTemplate && activeTemplate.id === templateId) {
            setActiveTemplate(null);
            setContent(getDefaultContent());
            setImages(getDefaultImages());
            setStyles(defaultStyles);
        }
        setTemplates(templates.filter(t => t.id !== templateId));
        toast({ title: 'Template Deleted!' });
    }

    return (
        <>
            <Helmet>
                <title>ID Card Generator - PetroPro</title>
                <meta name="description" content="Create and customize professional employee ID cards." />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto p-4"
            >
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold">ID Card Generator</h1>
                    <div className="flex flex-wrap items-center gap-2">
                        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                            <DialogTrigger asChild>
                                <Button><Save className="mr-2 h-4 w-4" /> Save Template</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Save Template</DialogTitle>
                                    <DialogDescription>
                                        Enter a name for your new template.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="template-name" className="text-right">
                                            Name
                                        </Label>
                                        <Input
                                            id="template-name"
                                            value={templateName}
                                            onChange={(e) => setTemplateName(e.target.value)}
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" onClick={handleSaveTemplate}>Save</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Button onClick={onPrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
                        <Button onClick={onDownload}><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <IdCardControls
                            content={content}
                            setContent={setContent}
                            images={images}
                            setImages={setImages}
                            styles={styles}
                            setStyles={setStyles}
                            templates={templates}
                            loadTemplate={handleLoadTemplate}
                            deleteTemplate={handleDeleteTemplate}
                            employees={employees}
                            loadEmployeeData={loadEmployeeData}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>ID Card Preview</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center gap-8 p-4 bg-muted/40 rounded-lg overflow-x-auto">
                                <IdCardPreview
                                    ref={cardFrontRef}
                                    side="front"
                                    content={content}
                                    images={images}
                                    styles={styles}
                                />
                                <IdCardPreview
                                    ref={cardBackRef}
                                    side="back"
                                    content={content}
                                    images={images}
                                    styles={styles}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </motion.div>
            <AlertDialog open={showReplaceConfirm} onOpenChange={setShowReplaceConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Maximum Templates Reached</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have reached the maximum of {MAX_TEMPLATES} saved templates. Do you want to replace the oldest one with your new template?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPendingTemplate(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmReplace}>Replace</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default IdCardGeneratorPage;