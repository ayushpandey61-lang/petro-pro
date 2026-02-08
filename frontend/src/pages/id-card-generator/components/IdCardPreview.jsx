import React from 'react';
import QRCode from 'qrcode.react';
import { Landmark, Building2, PhoneCall } from 'lucide-react';
import { format } from 'date-fns';

const IdCardPreview = React.forwardRef(({ side, content, images, styles }, ref) => {
    const cardStyle = {
        width: `${styles.cardWidth}in`,
        height: `${styles.cardHeight}in`,
        border: `${styles.borderWidth}px solid ${styles.borderColor}`,
        color: styles.mainTextColor,
        fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: images.cardBackground ? `url(${images.cardBackground})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };
    
    const watermarkStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-45deg)',
        fontSize: `${styles.watermarkSize}px`,
        color: styles.watermarkColor,
        opacity: styles.watermarkOpacity,
        fontWeight: 'bold',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        zIndex: 1,
    };

    const stripStyle = {
        height: `${styles.stripHeight}px`,
        backgroundColor: styles.stripColor,
        flexShrink: 0,
        zIndex: 10,
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'dd-MM-yyyy');
        } catch (error) {
            return dateString;
        }
    };


    const renderFront = () => (
        <div style={cardStyle} ref={ref} className="bg-white shadow-2xl flex flex-col rounded-xl">
            <div style={watermarkStyle}>{styles.watermarkText}</div>

            <header style={{ backgroundColor: styles.headerColor, color: styles.headerTextColor }} className="p-1.5 flex items-center justify-between relative z-10 rounded-t-xl">
                <div className="flex items-center gap-1.5">
                    {images.orgLogo ? <img src={images.orgLogo} alt="Org Logo" style={{ height: `${styles.orgLogoSize}px` }} className="object-contain"/> : <Landmark className="h-9 w-9 text-white/50"/>}
                    <div className="text-left flex flex-col justify-between h-full">
                        <h1 style={{ fontSize: `${styles.orgNameSize}px`, color: styles.orgNameColor }} className="font-bold leading-tight tracking-wide">{content.orgName}</h1>
                        <p style={{ fontSize: `${styles.taglineSize}px`, color: styles.taglineColor, textAlign: 'end' }} className="font-semibold leading-tight">{content.orgTagline}</p>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    {images.companyLogo ? <img src={images.companyLogo} alt="Company Logo" style={{ height: `${styles.companyLogoSize}px` }} className="object-contain"/> : <Building2 className="h-9 w-9 text-white/50"/>}
                    <p style={{ fontSize: `${styles.companyNameSize}px`, color: styles.companyNameColor }} className="font-bold tracking-widest">{content.companyName}</p>
                </div>
            </header>
            <div style={stripStyle}></div>

            <main className="flex-grow flex p-2.5 gap-2.5 relative z-10">
                <div style={{ width: `${styles.photoWidth}%`}} className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-full aspect-[4/5] bg-gray-200 border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                       {images.employeePhoto ? <img src={images.employeePhoto} alt="Employee" className="w-full h-full object-cover"/> : null}
                    </div>
                </div>
                <div style={{ width: `${100 - styles.photoWidth}%`}} className="flex flex-col justify-center text-[10px] leading-snug space-y-0.5">
                    <h2 className="font-bold leading-tight" style={{ color: styles.headerColor, fontSize: `${styles.nameSize}px` }}>{content.name || 'Employee Name'}</h2>
                    <p className="font-semibold" style={{ fontSize: `${styles.designationSize}px`, color: styles.designationColor, marginBottom: '0.2rem' }}>{content.designation || 'Designation'}</p>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[9px] font-medium">
                        <div className="space-y-0.5">
                            <p><strong>RO Code:</strong> {content.roCode}</p>
                            <p><strong>ID:</strong> {content.employeeId}</p>
                            <p><strong>Mobile:</strong> {content.phone}</p>
                        </div>
                        <div className="space-y-0.5">
                            <p><strong>DOB:</strong> {formatDate(content.dob)}</p>
                            <p><strong>Blood:</strong> {content.bloodGroup}</p>
                            <p><strong>Joined:</strong> {formatDate(content.joinedDate)}</p>
                        </div>
                    </div>
                    <div className="text-[9px] font-medium mt-1 space-y-0.5">
                        <div className="flex">
                            <strong className="mr-1">Email:</strong>
                            <span className="break-all">{content.email}</span>
                        </div>
                    </div>
                </div>
            </main>
            <div className="px-2.5 pb-1 text-[8px] flex items-start gap-1.5 mt-auto">
                <p className="font-bold leading-tight"><strong className="text-gray-600">Address:</strong> <span className="break-words">{content.address}</span></p>
            </div>
            
            <div style={stripStyle}></div>
            <footer style={{ backgroundColor: styles.frontFooterColor, color: styles.frontFooterTextColor }} className="p-1.5 text-[8px] text-center relative z-10 rounded-b-xl flex-shrink-0">
                <p className="font-bold">{content.footerOrgName}</p>
            </footer>
        </div>
    );

    const renderBack = () => (
        <div style={cardStyle} ref={ref} className="bg-white shadow-2xl flex flex-col text-[10px] leading-normal rounded-xl">
            <div style={watermarkStyle}>{styles.watermarkText}</div>

            <main className="flex-grow p-3 flex flex-col relative z-10">
                <div className="grid grid-cols-3 gap-3 flex-grow">
                    <div className="col-span-2 border-r pr-3 flex flex-col">
                        <h3 className="font-bold text-[10px] text-center mb-1" style={{color: styles.headerColor}}>Terms & Conditions:</h3>
                        <ul className="list-disc list-inside text-[7px] space-y-0.5 flex-grow">
                            {content.terms.filter(t => t.trim() !== '').map((term, index) => <li key={index}>{term}</li>)}
                        </ul>
                         <div className="mt-auto pt-2 text-center text-[8px]">
                            <p className="font-bold flex items-center justify-center gap-1"><PhoneCall className="w-2.5 h-2.5" /> Emergency Contact:</p>
                            <p className="font-semibold" style={{color: styles.headerColor}}>{content.emergencyContact}</p>
                        </div>
                    </div>
                     <div className="col-span-1 flex flex-col justify-start items-center">
                         <div className="text-center">
                            <h3 className="font-bold text-[8px] whitespace-nowrap mb-1" style={{color: styles.headerColor}}>Scan for Payment</h3>
                            <div className="flex justify-center">
                            {images.qrCode ? <img src={images.qrCode} alt="QR Code" className="w-16 h-16"/> : 
                             (content.email || content.phone) && <QRCode value={`Name: ${content.name}\nPhone: ${content.phone}\nEmail: ${content.email}`} size={64} level="H" />
                            }
                            </div>
                        </div>
                        <div className="flex flex-col items-center mt-auto">
                            {images.issuerSign ? <img src={images.issuerSign} alt="Signature" className="h-10"/> : <div className="h-10 w-full"></div>}
                            <p className="text-[7px] border-t-2 border-gray-400 w-full text-center mt-1 pt-0.5 font-bold">Issuer Signature</p>
                        </div>
                     </div>
                </div>
                 <div className="mt-auto pt-2 text-center text-[8px] font-semibold">
                    <p className="font-bold text-[9px]">ORGANISATION ADDRESS</p>
                    <p className="leading-tight">{content.orgAddress}</p>
                </div>
            </main>
           
            <div style={stripStyle}></div>
            <footer style={{ backgroundColor: styles.backFooterColor, color: styles.backFooterTextColor }} className="p-1.5 text-[8px] text-center z-10 rounded-b-xl">
                <p className="font-bold">{content.footerOrgName}</p>
            </footer>
        </div>
    );

    return side === 'front' ? renderFront() : renderBack();
});

export default IdCardPreview;