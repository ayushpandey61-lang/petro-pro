import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Printer, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

const ReportGenerator = ({ title, headers, data, organization }) => {
    const { toast } = useToast();

    const generatePdf = () => {
        const doc = new jsPDF();
        let yPosition = 15;

        // Add organization header if available
        if (organization) {
            doc.setFontSize(16);
            doc.text(organization.firmName || 'Organization Name', 14, yPosition);
            yPosition += 8;

            if (organization.address) {
                doc.setFontSize(10);
                doc.text(organization.address, 14, yPosition);
                yPosition += 5;
            }

            if (organization.contactNo || organization.email) {
                const contactInfo = [];
                if (organization.contactNo) contactInfo.push(`Phone: ${organization.contactNo}`);
                if (organization.email) contactInfo.push(`Email: ${organization.email}`);
                doc.text(contactInfo.join(' | '), 14, yPosition);
                yPosition += 5;
            }

            if (organization.gstNo || organization.bunkDetails) {
                const businessInfo = [];
                if (organization.gstNo) businessInfo.push(`GST: ${organization.gstNo}`);
                if (organization.bunkDetails) businessInfo.push(`Bunk: ${organization.bunkDetails}`);
                doc.text(businessInfo.join(' | '), 14, yPosition);
                yPosition += 10;
            }

            doc.text(`Report Date: ${format(new Date(), 'dd/MM/yyyy')}`, 14, yPosition);
            yPosition += 15;
        }

        // Add report title
        doc.setFontSize(14);
        doc.text(title, 14, yPosition);
        yPosition += 10;

        // Add table
        doc.autoTable({
            startY: yPosition,
            head: [headers.map(h => h.label)],
            body: data.map(row => headers.map(h => row[h.key])),
        });

        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        toast({ title: 'PDF Generated', description: 'Report is opening in a new tab.' });
    };
    
    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new();

        // Create organization info sheet if available
        if (organization) {
            const orgData = [
                { Field: 'Organization', Value: organization.firmName || 'N/A' },
                { Field: 'Address', Value: organization.address || 'N/A' },
                { Field: 'Contact', Value: organization.contactNo || 'N/A' },
                { Field: 'Email', Value: organization.email || 'N/A' },
                { Field: 'GST Number', Value: organization.gstNo || 'N/A' },
                { Field: 'Bunk Details', Value: organization.bunkDetails || 'N/A' },
                { Field: 'Report Date', Value: format(new Date(), 'dd/MM/yyyy') },
                { Field: '', Value: '' }, // Empty row
                { Field: 'Report Title', Value: title }
            ];
            const orgWorksheet = XLSX.utils.json_to_sheet(orgData);
            XLSX.utils.book_append_sheet(workbook, orgWorksheet, "Organization Info");
        }

        // Create main report data sheet
        const worksheet = XLSX.utils.json_to_sheet(data.map(row => {
            let newRow = {};
            headers.forEach(h => {
                newRow[h.label] = row[h.key];
            });
            return newRow;
        }));
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report Data");

        const fileName = `${title.replace(/ /g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
        XLSX.writeFile(workbook, fileName);
        toast({ title: 'Excel Exported', description: 'Report has been downloaded.' });
    };

    const handlePrint = () => {
        const doc = new jsPDF();
        let yPosition = 15;

        // Add organization header if available
        if (organization) {
            doc.setFontSize(16);
            doc.text(organization.firmName || 'Organization Name', 14, yPosition);
            yPosition += 8;

            if (organization.address) {
                doc.setFontSize(10);
                doc.text(organization.address, 14, yPosition);
                yPosition += 5;
            }

            if (organization.contactNo || organization.email) {
                const contactInfo = [];
                if (organization.contactNo) contactInfo.push(`Phone: ${organization.contactNo}`);
                if (organization.email) contactInfo.push(`Email: ${organization.email}`);
                doc.text(contactInfo.join(' | '), 14, yPosition);
                yPosition += 5;
            }

            if (organization.gstNo || organization.bunkDetails) {
                const businessInfo = [];
                if (organization.gstNo) businessInfo.push(`GST: ${organization.gstNo}`);
                if (organization.bunkDetails) businessInfo.push(`Bunk: ${organization.bunkDetails}`);
                doc.text(businessInfo.join(' | '), 14, yPosition);
                yPosition += 10;
            }

            doc.text(`Report Date: ${format(new Date(), 'dd/MM/yyyy')}`, 14, yPosition);
            yPosition += 15;
        }

        // Add report title
        doc.setFontSize(14);
        doc.text(title, 14, yPosition);
        yPosition += 10;

        // Add table
        doc.autoTable({
            startY: yPosition,
            head: [headers.map(h => h.label)],
            body: data.map(row => headers.map(h => row[h.key])),
        });
        doc.autoPrint();
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        toast({ title: 'Print Preview', description: 'Print dialog is opening in a new tab.' });
    };

    return (
        <div className="mt-6 p-4 border rounded-lg bg-card shadow-sm">
            {/* Organization Header */}
            {organization && (
                <div className="mb-4 p-3 bg-muted/50 rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 className="font-semibold text-base mb-2">{organization.firmName || 'Organization Name'}</h4>
                            {organization.address && <p className="text-muted-foreground">{organization.address}</p>}
                            <div className="flex gap-4 mt-1">
                                {organization.contactNo && <span>📞 {organization.contactNo}</span>}
                                {organization.email && <span>✉️ {organization.email}</span>}
                            </div>
                        </div>
                        <div className="text-right">
                            {organization.gstNo && <p><strong>GST:</strong> {organization.gstNo}</p>}
                            {organization.bunkDetails && <p><strong>Bunk:</strong> {organization.bunkDetails}</p>}
                            <p><strong>Report Date:</strong> {format(new Date(), 'dd/MM/yyyy')}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={generatePdf}><FileText className="mr-2 h-4 w-4" /> PDF</Button>
                    <Button variant="outline" size="sm" onClick={exportToExcel}><FileSpreadsheet className="mr-2 h-4 w-4" /> Excel</Button>
                    <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted">
                        <tr>
                            {headers.map((header) => (
                                <th key={header.key} className="p-2 font-semibold">{header.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={index} className="border-b">
                                {headers.map((header) => (
                                    <td key={header.key} className="p-2">{row[header.key]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportGenerator;