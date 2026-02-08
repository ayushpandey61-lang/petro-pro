import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';

const SamplePrintForm = ({ purchase, firmProfile }) => {
  const printRef = useRef();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (purchase) {
      const product = purchase.products[0] || {};
      setFormData({
        retailOutlet: firmProfile?.firmName || '',
        oilCompany: 'BPCL', // As per image
        product: product.productName || '',
        invoiceNo: purchase.invoiceNo || '',
        sourceOfSample: product.tankLorryNo || '',
        sampleDrawnDate: purchase.invoiceDate ? format(new Date(purchase.invoiceDate), 'dd-MM-yyyy') : '',
        sampleDrawnTime: '00:00:00', // As per image
        densityChallan: product.invoiceDensity || '',
        densityCollected: product.densityAt15C || '',
        decantedTankNos: product.decantedTankNo || '',
        aluminiumSeal: '',
        woodenSeal: '',
        dealerSignature: '',
        dealerName: firmProfile?.firmName || '',
        placeAndDate: `${firmProfile?.address1 || ''}, ${format(new Date(), 'dd-MM-yyyy')}`,
        driverSignature: '',
        driverName: '',
        transporterName: '',
      });
    }
  }, [purchase, firmProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrint = () => {
    const input = printRef.current;
    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const width = pdfWidth - 20;
      const height = width / ratio;
      pdf.addImage(imgData, 'PNG', 10, 10, width, height > pdfHeight - 20 ? pdfHeight - 20 : height);
      pdf.save(`sample-form-${formData.invoiceNo}.pdf`);
    });
  };

  const renderRow = (label, value, name, subLabel = null) => (
    <tr className="border-b border-gray-400">
      <td className="p-2 border-r border-gray-400 font-semibold align-top">{label}</td>
      {subLabel && <td className="p-2 border-r border-gray-400 align-top">{subLabel}</td>}
      <td className="p-2" colSpan={subLabel ? 1 : 2}>
        <Input
          name={name}
          value={value || ''}
          onChange={handleInputChange}
          className="border-none h-auto p-0 bg-transparent focus-visible:ring-0"
        />
      </td>
    </tr>
  );

  return (
    <>
      <div ref={printRef} className="p-4 bg-white text-black text-sm font-sans">
        <header className="flex items-start justify-between mb-4">
          <div className="w-20 h-20 flex items-center justify-center border border-black">
            {firmProfile?.leftLogo ? <img src={firmProfile.leftLogo} alt="logo" className="max-w-full max-h-full"/> : <span className="text-xs text-center">Company Logo</span>}
          </div>
          <div className="text-center">
            <p className="font-semibold">Location Division Office</p>
            <h1 className="font-bold text-base">TANK LORRY RETENTION SAMPLE DRAWN AT RETAIL OUTLET</h1>
          </div>
          <div className="w-20 h-20"></div>
        </header>

        <table className="w-full border-collapse border border-gray-400">
          <tbody>
            {renderRow('1. Name Of The Retail Outlet', formData.retailOutlet, 'retailOutlet')}
            {renderRow('2. Name Of The Oil Company', formData.oilCompany, 'oilCompany')}
            {renderRow('3. Product', formData.product, 'product')}
            {renderRow('4. Invoice No.', formData.invoiceNo, 'invoiceNo')}
            {renderRow('5. Source of Sample', formData.sourceOfSample, 'sourceOfSample')}
            <tr className="border-b border-gray-400">
              <td className="p-2 border-r border-gray-400 font-semibold align-top">6. Sample Drawn On</td>
              <td colSpan="2" className="p-2">
                <div className="flex items-center gap-2">
                  <Input name="sampleDrawnDate" value={formData.sampleDrawnDate || ''} onChange={handleInputChange} className="border-none h-auto p-0 bg-transparent focus-visible:ring-0 w-24" />
                  <span>At</span>
                  <Input name="sampleDrawnTime" value={formData.sampleDrawnTime || ''} onChange={handleInputChange} className="border-none h-auto p-0 bg-transparent focus-visible:ring-0 w-24" />
                </div>
              </td>
            </tr>
            {renderRow('7. Density At 15c', formData.densityChallan, 'densityChallan', 'A) As Recorded in Challan')}
            {renderRow('', formData.densityCollected, 'densityCollected', 'B) Sample Collected From Tank Lorry')}
            {renderRow('8. Product Decanted in Tank Nos', formData.decantedTankNos, 'decantedTankNos')}
            {renderRow('9. Plastic Seal No. of Aluminium Container', formData.aluminiumSeal, 'aluminiumSeal')}
            {renderRow('10. Plastic Seal No. of Wooden Box', formData.woodenSeal, 'woodenSeal')}
          </tbody>
        </table>

        <p className="my-4 text-xs">
          Certified the empty container have been rinsed with the product before drawing sample in my presence and the sample is retained after proper labelling and sealing
        </p>

        <table className="w-full border-collapse border border-gray-400 mt-4">
          <tbody>
            {renderRow('Signature of the Dealer/ Dealer representative', formData.dealerSignature, 'dealerSignature')}
            {renderRow('Name of the Dealer/ Dealer representative', formData.dealerName, 'dealerName')}
            <tr className="border-b border-gray-400"><td className="p-2 border-r border-gray-400 font-semibold">Seal / Rubber Stamp</td><td className="p-2 h-16"></td></tr>
            {renderRow('Place and Date', formData.placeAndDate, 'placeAndDate')}
            {renderRow('Signature of Tank Lorry Driver', formData.driverSignature, 'driverSignature')}
            {renderRow('Name of Tank Lorry Driver', formData.driverName, 'driverName')}
            {renderRow('Transporter\'s Name', formData.transporterName, 'transporterName')}
            {renderRow('Oil Company', formData.oilCompany, 'oilCompany')}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print/Download PDF</Button>
      </div>
    </>
  );
};

export default SamplePrintForm;