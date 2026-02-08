import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/shared/Header';
import FloatingCalculator from '@/components/FloatingCalculator';
import { useTheme } from '@/hooks/useTheme';

const Layout = () => {
  const { theme } = useTheme();

  return (
    <div className={`${theme} font-sans h-screen flex flex-col`}>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50/50 via-white to-blue-50/50 dark:from-gray-900/50 dark:via-background dark:to-gray-900/50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <FloatingCalculator />
    </div>
  );
};

export default Layout;