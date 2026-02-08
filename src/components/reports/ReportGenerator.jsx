import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Printer, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

const ReportGenerator = ({ title, headers, data, organization, dateRange }) => {
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
        <div className="bg-white">
            {/* Professional Header Section */}
            <div className="flex items-center justify-between p-6 border-b">
                {/* Left: Company Logo */}
                <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        SHVF
                    </div>
                </div>

                {/* Center: Company Details */}
                <div className="text-center flex-1 mx-8">
                    <h1 className="text-xl font-bold text-gray-800 mb-1">
                        {organization?.firmName || 'MS SHREE HARSH VALLABH FUELS'}
                    </h1>
                    <p className="text-sm text-gray-600 mb-1">
                        {organization?.address || 'VILLAGE DELAURA SAJANPUR BYPASS'}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                        {organization?.bunkDetails || 'SATNA MP'}
                    </p>
                    <p className="text-sm text-gray-600">
                        {organization?.gstNo || '23AJAPD5363N1ZA'}
                    </p>
                    <p className="text-sm text-gray-600">
                        {organization?.contactNo || '9981440065'}
                    </p>
                </div>

                {/* Right: Small Logo */}
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                        <span className="text-xs font-bold">PETRO</span>
                    </div>
                </div>
            </div>

            {/* Report Title and Export Section */}
            <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                    {dateRange && (
                        <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded border">
                            Date Range: {format(dateRange.from, 'dd-MMM-yyyy')} To {format(dateRange.to, 'dd-MMM-yyyy')}
                        </div>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={exportToExcel}
                        className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    >
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Excel
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={generatePdf}
                        className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                    >
                        <FileText className="mr-2 h-4 w-4" />
                        PDF
                    </Button>
                </div>
            </div>

            {/* Professional Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-purple-100">
                            {headers.map((header, index) => (
                                <th
                                    key={header.key}
                                    className="p-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-200"
                                    style={{ minWidth: index === 0 ? '60px' : '100px' }}
                                >
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr
                                key={index}
                                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                            >
                                {headers.map((header) => (
                                    <td
                                        key={header.key}
                                        className="p-3 text-sm text-gray-800 border-b border-gray-100"
                                    >
                                        {typeof row[header.key] === 'number'
                                            ? row[header.key].toLocaleString('en-IN', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                              })
                                            : row[header.key]
                                        }
                                    </td>
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