import React from 'react';
import { useOrg } from '@/hooks/useOrg';
import { Building, Phone, Mail, FileText } from 'lucide-react';

const ReportHeader = ({ title }) => {
  const { orgDetails } = useOrg();

  return (
    <div className="bg-white border-b-4 border-blue-600 p-6 mb-6">
      <div className="flex items-center justify-between">
        {/* Left Corner - Organization Logo */}
        <div className="flex items-center space-x-4">
          {orgDetails.firmLogo ? (
            <img
              src={orgDetails.firmLogo}
              alt="Organization Logo"
              className="h-16 w-16 object-contain border-2 border-gray-200 rounded-lg p-1"
            />
          ) : (
            <div className="h-16 w-16 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center">
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          )}
        </div>

        {/* Center - Organization Details */}
        <div className="flex-1 text-center px-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {orgDetails.firmName || 'PetroPro'}
          </h1>
          <div className="space-y-1 text-sm text-gray-600">
            {orgDetails.address && (
              <p className="flex items-center justify-center space-x-2">
                <span>📍</span>
                <span>{orgDetails.address}</span>
              </p>
            )}
            <div className="flex items-center justify-center space-x-6">
              {orgDetails.gstNo && (
                <p className="flex items-center space-x-1">
                  <FileText className="h-4 w-4" />
                  <span>GST: {orgDetails.gstNo}</span>
                </p>
              )}
              {orgDetails.contactNo && (
                <p className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{orgDetails.contactNo}</span>
                </p>
              )}
            </div>
            {orgDetails.email && (
              <p className="flex items-center justify-center space-x-1 text-blue-600">
                <Mail className="h-4 w-4" />
                <span>{orgDetails.email}</span>
              </p>
            )}
          </div>
        </div>

        {/* Right Corner - Company Logo */}
        <div className="flex items-center space-x-4">
          {orgDetails.companyLogo ? (
            <img
              src={orgDetails.companyLogo}
              alt="Company Logo"
              className="h-16 w-16 object-contain border-2 border-gray-200 rounded-lg p-1"
            />
          ) : (
            <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-blue-300 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">LOGO</span>
            </div>
          )}
        </div>
      </div>

      {/* Report Title */}
      {title && (
        <div className="text-center mt-4">
          <h2 className="text-2xl font-semibold text-gray-700 border-t pt-3">
            {title}
          </h2>
        </div>
      )}
    </div>
  );
};

export default ReportHeader;