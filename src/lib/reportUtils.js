import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

const addHeader = (doc, orgDetails, title) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const safeOrgDetails = orgDetails || {};

    if (safeOrgDetails.firmLogo) { // Changed from leftLogo
        try {
            const img = new Image();
            img.src = safeOrgDetails.firmLogo;
            doc.addImage(img, 'PNG', 10, 5, 20, 20);
        } catch(e) {
            console.error("Error adding left logo to PDF", e);
        }
    }
    
    if (safeOrgDetails.brandLogo) { // Changed from rightLogo
        try {
            const img = new Image();
            img.src = safeOrgDetails.brandLogo;
            doc.addImage(img, 'PNG', pageWidth - 30, 5, 20, 20);
        } catch(e) {
            console.error("Error adding right logo to PDF", e);
        }
    }

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(safeOrgDetails.firmName || 'Organisation Name', pageWidth / 2, 10, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${safeOrgDetails.addressLine1 || ''} ${safeOrgDetails.addressLine2 || ''}`, pageWidth / 2, 16, { align: 'center' });
    doc.text(`Contact: ${safeOrgDetails.contactNumber || ''}`, pageWidth / 2, 20, { align: 'center' });
    doc.text(`GST: ${safeOrgDetails.taxInfo || ''}`, pageWidth / 2, 24, { align: 'center' });

    doc.setLineWidth(0.5);
    doc.line(10, 28, pageWidth - 10, 28);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, pageWidth / 2, 35, { align: 'center' });
};


export const generatePdf = ({ title, headers, data, orgDetails }) => {
    const doc = new jsPDF();
    addHeader(doc, orgDetails, title);
    
    doc.autoTable({
        head: [headers.map(h => h.label)],
        body: data,
        startY: 40,
        theme: 'grid',
        headStyles: { fillColor: [38, 43, 80] },
    });

    doc.save(`${title.replace(/ /g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const generateXlsx = ({ title, headers, data, orgDetails }) => {
    const safeOrgDetails = orgDetails || {};
    const header = [
        [safeOrgDetails.firmName || ''],
        [`${safeOrgDetails.addressLine1 || ''} ${safeOrgDetails.addressLine2 || ''}`],
        [`Contact: ${safeOrgDetails.contactNumber || ''}`, `GST: ${safeOrgDetails.taxInfo || ''}`],
        [],
        [title]
    ];
    
    const body = [headers.map(h => h.label), ...data];

    const ws = XLSX.utils.aoa_to_sheet([...header, ...body]);

    // Merging cells for header
    if (headers.length > 0) {
        ws['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }, // Bunk Name
            { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } }, // Address
            { s: { r: 4, c: 0 }, e: { r: 4, c: headers.length - 1 } }, // Report Title
        ];
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, `${title.replace(/ /g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};

export const generateCsv = ({ title, headers, data }) => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.map(h => h.label).join(","), ...data.map(row => row.join(","))].join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.replace(/ /g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};