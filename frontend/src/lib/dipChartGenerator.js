import { jsPDF } from 'jspdf';
    import 'jspdf-autotable';
    import { format } from 'date-fns';
    import { getVolumeFromDip } from '@/lib/tankVolumeCalculator';

    export const generateDipChartPdf = async (tank, orgDetails) => {
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        let yPos = 10;

        const addImageSafely = (imageData, x, y, w, h) => {
            if (imageData) {
                try {
                    const img = new Image();
                    img.src = imageData;
                    doc.addImage(img, 'PNG', x, y, w, h);
                } catch (e) {
                    console.error("Error adding image to PDF:", e);
                }
            }
        };

        addImageSafely(orgDetails.firmLogo, 15, yPos, 20, 20);
        addImageSafely(orgDetails.companyLogo, pageWidth - 35, yPos, 20, 20);

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(orgDetails.firmName || 'Organisation Name', pageWidth / 2, yPos + 7, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(orgDetails.address || '', pageWidth / 2, yPos + 14, { align: 'center' });
        yPos += 25;

        doc.setLineWidth(0.5);
        doc.line(15, yPos, pageWidth - 15, yPos);
        yPos += 10;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Tank Dip Chart', pageWidth / 2, yPos, { align: 'center' });
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Tank Name: ${tank.tankName}`, 15, yPos);
        doc.text(`Date: ${format(new Date(), 'PPP')}`, pageWidth - 15, yPos, { align: 'right' });
        yPos += 5;
        doc.text(`Product: ${tank.productName || 'N/A'}`, 15, yPos);
        yPos += 5;
        doc.text(`Inside Diameter: ${tank.inside_diameter_m} M`, 15, yPos);
        doc.text(`Inside Length: ${tank.inside_length_m} M`, pageWidth - 15, yPos, { align: 'right' });
        yPos += 10;

        const chartData = [];
        const dipStepCm = 0.5;
        const maxDipCm = 200;

        for (let dipCm = 1; dipCm <= maxDipCm; dipCm += dipStepCm) {
            const currentVolume = getVolumeFromDip(tank, dipCm);
            const volumeAtPlus1mm = getVolumeFromDip(tank, dipCm + 0.1);
            const incrementPerMm = (volumeAtPlus1mm - currentVolume) * 10;

            chartData.push([
                dipCm.toFixed(2),
                currentVolume.toFixed(2),
                incrementPerMm.toFixed(4)
            ]);
        }
        
        doc.autoTable({
            head: [['Dip (cm)', 'Volume (Liters)', 'Increment/mm (Liters)']],
            body: chartData,
            startY: yPos,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            styles: { fontSize: 8 },
            columnStyles: {
                0: { halign: 'center' },
                1: { halign: 'right' },
                2: { halign: 'right' },
            },
        });

        doc.save(`DipChart_${tank.tankName}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    };