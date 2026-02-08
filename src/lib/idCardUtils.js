import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const handleDownloadPdf = async (cardFront, cardBack, styles, employeeName, toast) => {
  if (!cardFront || !cardBack) return;
  
  toast({ title: 'Generating PDF...', description: 'Please wait a moment.' });
  try {
    const canvasFront = await html2canvas(cardFront, { 
        scale: 4, 
        useCORS: true,
        backgroundColor: null
    });
    const canvasBack = await html2canvas(cardBack, { 
        scale: 4, 
        useCORS: true,
        backgroundColor: null
    });
    
    const cardWidth = styles.cardWidth * 72; // Convert inches to points
    const cardHeight = styles.cardHeight * 72;
    
    const pdf = new jsPDF({
      orientation: cardWidth > cardHeight ? 'landscape' : 'portrait',
      unit: 'pt',
      format: [cardWidth, cardHeight]
    });

    pdf.addImage(canvasFront.toDataURL('image/png'), 'PNG', 0, 0, cardWidth, cardHeight);
    pdf.addPage([cardWidth, cardHeight], cardWidth > cardHeight ? 'landscape' : 'portrait');
    pdf.addImage(canvasBack.toDataURL('image/png'), 'PNG', 0, 0, cardWidth, cardHeight);
    
    pdf.save(`${employeeName || 'employee'}-id-card.pdf`);
    toast({ title: 'Success!', description: 'ID Card PDF downloaded.' });
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate PDF. Check console for details.' });
  }
};

export const handlePrint = (cardFront, cardBack, employeeName) => {
    if (!cardFront || !cardBack) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert("Please allow popups for this website to print the ID card.");
        return;
    }

    const frontClone = cardFront.cloneNode(true);
    const backClone = cardBack.cloneNode(true);

    printWindow.document.write('<html><head><title>Print ID Card</title>');
    
    Array.from(document.styleSheets).forEach(styleSheet => {
        try {
            const cssRules = Array.from(styleSheet.cssRules).map(rule => rule.cssText).join('');
            const style = printWindow.document.createElement('style');
            style.appendChild(printWindow.document.createTextNode(cssRules));
            printWindow.document.head.appendChild(style);
        } catch (e) {
            console.warn("Cannot read cross-origin stylesheet", e);
            if (styleSheet.href) {
                const link = printWindow.document.createElement('link');
                link.rel = 'stylesheet';
                link.type = styleSheet.type;
                link.href = styleSheet.href;
                printWindow.document.head.appendChild(link);
            }
        }
    });

    printWindow.document.write(`
        <style>
            @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                @page { size: A4; margin: 10mm; }
                .card-container {
                    display: flex;
                    justify-content: flex-start;
                    align-items: flex-start;
                    gap: 10px;
                }
                .card-wrapper {
                    page-break-inside: avoid !important;
                    border: 1px dashed #ccc;
                    padding: 5px;
                    display: inline-block;
                }
            }
            body { margin: 0; padding: 20px; font-family: sans-serif; }
            .card-container {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            .card-wrapper {
                border: 1px dashed #ccc;
                padding: 5px;
                display: inline-block;
            }
        </style>
    `);
    printWindow.document.write('</head><body><div class="card-container">');
    printWindow.document.write('<div class="card-wrapper" id="front-card-wrapper"></div>');
    printWindow.document.write('<div class="card-wrapper" id="back-card-wrapper"></div>');
    printWindow.document.write('</div></body></html>');
    
    printWindow.document.getElementById('front-card-wrapper').appendChild(frontClone);
    printWindow.document.getElementById('back-card-wrapper').appendChild(backClone);

    printWindow.document.close();
    
    printWindow.onload = function() {
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };
};