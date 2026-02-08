import React, { createContext, useState, useEffect, useCallback } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';

const ThemeContext = createContext();

const defaultLightColors = {
  '--background': '0 0% 100%',
  '--foreground': '222.2 84% 4.9%',
  '--card': '0 0% 100%',
  '--card-foreground': '222.2 84% 4.9%',
  '--popover': '0 0% 100%',
  '--popover-foreground': '222.2 84% 4.9%',
  '--primary': '220 83.3% 57.8%',
  '--primary-foreground': '210 40% 98%',
  '--secondary': '210 40% 96.1%',
  '--secondary-foreground': '222.2 47.4% 11.2%',
  '--muted': '210 40% 96.1%',
  '--muted-foreground': '215.4 16.3% 46.9%',
  '--accent': '210 40% 96.1%',
  '--accent-foreground': '222.2 47.4% 11.2%',
  '--destructive': '0 84.2% 60.2%',
  '--destructive-foreground': '210 40% 98%',
  '--border': '214.3 31.8% 91.4%',
  '--input': '214.3 31.8% 91.4%',
  '--ring': '220 83.3% 57.8%',
};

const defaultDarkColors = {
  '--background': '222.2 84% 4.9%',
  '--foreground': '210 40% 98%',
  '--card': '222.2 84% 4.9%',
  '--card-foreground': '210 40% 98%',
  '--popover': '222.2 84% 4.9%',
  '--popover-foreground': '210 40% 98%',
  '--primary': '217 91.2% 59.8%',
  '--primary-foreground': '210 40% 98%',
  '--secondary': '217.2 32.6% 17.5%',
  '--secondary-foreground': '210 40% 98%',
  '--muted': '217.2 32.6% 17.5%',
  '--muted-foreground': '215 20.2% 65.1%',
  '--accent': '217.2 32.6% 17.5%',
  '--accent-foreground': '210 40% 98%',
  '--destructive': '0 62.8% 30.6%',
  '--destructive-foreground': '210 40% 98%',
  '--border': '217.2 32.6% 17.5%',
  '--input': '217.2 32.6% 17.5%',
  '--ring': '217 91.2% 59.8%',
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage('petropro-theme', 'dark');
  const [lightColors, setLightColors] = useLocalStorage('petropro-light-colors', defaultLightColors);
  const [darkColors, setDarkColors] = useLocalStorage('petropro-dark-colors', defaultDarkColors);

  const applyTheme = useCallback(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    const colors = theme === 'light' ? lightColors : darkColors;
    for (const [key, value] of Object.entries(colors)) {
      root.style.setProperty(key, value);
    }
  }, [theme, lightColors, darkColors]);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  const updateColors = (mode, newColors) => {
    if (mode === 'light') {
      setLightColors(newColors);
    } else {
      setDarkColors(newColors);
    }
  };

  const value = {
    theme,
    setTheme,
    colors: {
      light: lightColors,
      dark: darkColors,
    },
    updateColors,
    defaultLightColors,
    defaultDarkColors,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;