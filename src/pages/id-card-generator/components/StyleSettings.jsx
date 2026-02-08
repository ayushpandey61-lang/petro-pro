import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';

const StyleInput = ({ label, type = 'color', name, value, onChange, ...props }) => {
  return (
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      <Input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-24 h-8"
        {...props}
      />
    </div>
  );
};

const StyleSlider = ({ label, name, value, onChange, ...props }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label>{label}</Label>
                <span className="text-sm text-muted-foreground">{value}{props.unit || ''}</span>
            </div>
            <Slider
                name={name}
                value={[value]}
                onValueChange={(val) => onChange({ target: { name, value: val[0] } })}
                {...props}
            />
        </div>
    );
};

const StyleSettings = ({ styles, setStyles }) => {
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setStyles(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Style Settings</h3>
      <Accordion type="multiple" defaultValue={['colors', 'dimensions', 'typography']}>
        <AccordionItem value="colors">
          <AccordionTrigger>Colors</AccordionTrigger>
          <AccordionContent className="space-y-2">
            <StyleInput label="Header Color" name="headerColor" value={styles.headerColor} onChange={handleChange} />
            <StyleInput label="Header Text" name="headerTextColor" value={styles.headerTextColor} onChange={handleChange} />
            <StyleInput label="Designation Text" name="designationColor" value={styles.designationColor} onChange={handleChange} />
            <StyleInput label="Front Footer Color" name="frontFooterColor" value={styles.frontFooterColor} onChange={handleChange} />
            <StyleInput label="Front Footer Text" name="frontFooterTextColor" value={styles.frontFooterTextColor} onChange={handleChange} />
            <StyleInput label="Back Footer Color" name="backFooterColor" value={styles.backFooterColor} onChange={handleChange} />
            <StyleInput label="Back Footer Text" name="backFooterTextColor" value={styles.backFooterTextColor} onChange={handleChange} />
            <StyleInput label="Main Text" name="mainTextColor" value={styles.mainTextColor} onChange={handleChange} />
            <StyleInput label="Border" name="borderColor" value={styles.borderColor} onChange={handleChange} />
            <StyleInput label="Strip" name="stripColor" value={styles.stripColor} onChange={handleChange} />
            <StyleInput label="Tagline" name="taglineColor" value={styles.taglineColor} onChange={handleChange} />
            <StyleInput label="Org Name" name="orgNameColor" value={styles.orgNameColor} onChange={handleChange} />
            <StyleInput label="Company Name" name="companyNameColor" value={styles.companyNameColor} onChange={handleChange} />
            <StyleInput label="Watermark" name="watermarkColor" value={styles.watermarkColor} onChange={handleChange} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="dimensions">
          <AccordionTrigger>Sizing & Dimensions</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <StyleSlider label="Org Logo Size" name="orgLogoSize" value={styles.orgLogoSize} onChange={handleChange} min={20} max={60} step={1} unit="px" />
            <StyleSlider label="Company Logo Size" name="companyLogoSize" value={styles.companyLogoSize} onChange={handleChange} min={20} max={60} step={1} unit="px" />
            <StyleSlider label="Border Width" name="borderWidth" value={styles.borderWidth} onChange={handleChange} min={0} max={10} step={1} unit="px" />
            <StyleSlider label="Strip Height" name="stripHeight" value={styles.stripHeight} onChange={handleChange} min={0} max={20} step={1} unit="px" />
            <StyleSlider label="Photo Width" name="photoWidth" value={styles.photoWidth} onChange={handleChange} min={20} max={50} step={1} unit="%" />
            <div className="grid grid-cols-2 gap-2 pt-4">
                <div className="space-y-1"><Label>Card Width (in)</Label><Input type="number" name="cardWidth" value={styles.cardWidth} onChange={handleChange} step={0.125} /></div>
                <div className="space-y-1"><Label>Card Height (in)</Label><Input type="number" name="cardHeight" value={styles.cardHeight} onChange={handleChange} step={0.125} /></div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="typography">
          <AccordionTrigger>Typography</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <StyleSlider label="Employee Name Size" name="nameSize" value={styles.nameSize} onChange={handleChange} min={10} max={28} step={1} unit="px" />
            <StyleSlider label="Designation Size" name="designationSize" value={styles.designationSize} onChange={handleChange} min={8} max={20} step={1} unit="px" />
            <StyleSlider label="Tagline Size" name="taglineSize" value={styles.taglineSize} onChange={handleChange} min={8} max={24} step={1} unit="px" />
            <StyleSlider label="Org Name Size" name="orgNameSize" value={styles.orgNameSize} onChange={handleChange} min={10} max={32} step={1} unit="px" />
            <StyleSlider label="Company Name Size" name="companyNameSize" value={styles.companyNameSize} onChange={handleChange} min={8} max={20} step={1} unit="px" />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="watermark">
            <AccordionTrigger>Watermark</AccordionTrigger>
            <AccordionContent className="space-y-4">
                <div className="space-y-1"><Label>Watermark Text</Label><Input name="watermarkText" value={styles.watermarkText} onChange={handleChange} /></div>
                <StyleSlider label="Watermark Size" name="watermarkSize" value={styles.watermarkSize} onChange={handleChange} min={20} max={150} step={2} unit="px" />
                <StyleSlider label="Watermark Opacity" name="watermarkOpacity" value={styles.watermarkOpacity} onChange={handleChange} min={0} max={1} step={0.01} />
            </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default StyleSettings;