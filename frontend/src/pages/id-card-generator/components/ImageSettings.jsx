import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const ImageUploader = ({ label, name, value, setImages }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type="file" accept="image/*" onChange={handleImageChange} className="text-xs"/>
      {value && <img src={value} alt={`${label} preview`} className="mt-2 h-16 w-16 object-contain rounded-md border p-1"/>}
    </div>
  );
};

const ImageSettings = ({ images, setImages, content }) => {
  return (
    <div className="space-y-4">
       <h3 className="text-lg font-semibold">Image Settings</h3>
       <div className="grid grid-cols-2 gap-4">
        <ImageUploader label="Organisation Logo" name="orgLogo" value={images.orgLogo} setImages={setImages} />
        <ImageUploader label="Company Logo" name="companyLogo" value={images.companyLogo} setImages={setImages} />
        <ImageUploader label="Employee Photo" name="employeePhoto" value={images.employeePhoto} setImages={setImages} />
        <ImageUploader label="Issuer Signature" name="issuerSign" value={images.issuerSign} setImages={setImages} />
        <ImageUploader label="QR Code Image" name="qrCode" value={images.qrCode} setImages={setImages} />
        <ImageUploader label="Card Background" name="cardBackground" value={images.cardBackground} setImages={setImages} />
       </div>
    </div>
  );
};

export default ImageSettings;