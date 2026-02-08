import React, { createContext, useState, useEffect } from 'react';
import translations from '@/locales/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('petrosys-lang') || 'en');

  useEffect(() => {
    localStorage.setItem('petrosys-lang', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;