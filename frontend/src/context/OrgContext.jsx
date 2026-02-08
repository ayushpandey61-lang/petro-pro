import React, { createContext, useContext } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';

export const OrgContext = createContext();

export const OrgProvider = ({ children }) => {
    const [orgDetails, setOrgDetails] = useLocalStorage('orgDetails', {
      firmName: 'PetroPro',
      gstNo: '',
      tinNo: '',
      roCode: '',
      contactNo: '',
      altContactNo: '',
      email: '',
      companyName: '',
      companyShortName: '',
      companyLogo: '',
      firmLogo: '',
      address: '',
      tagline: '',
      accountNo: '',
      ifsc: '',
      bankName: '',
      accountHolder: '',
      branchAddress: '',
      bunkDetails: '',
      numberFormat: 'Indian',
      activationCode: '',
      currencySymbol: '₹',
      loginBackgroundUrl: '',
      loginHeader: '',
      loginFooter: '',
    });

    return (
        <OrgContext.Provider value={{ orgDetails, setOrgDetails }}>
            {children}
        </OrgContext.Provider>
    );
};