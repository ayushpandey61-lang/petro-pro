import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { useTheme } from '@/hooks/useTheme';
import useAuth from '@/hooks/useAuth';

const Layout = () => {
  const { theme } = useTheme();
  const { user, loading, userRole } = useAuth();

  // Debug logging
  console.log('Layout - User:', user, 'Loading:', loading, 'Role:', userRole);

  return (
    <div className={`${theme} font-sans min-h-screen flex flex-col`}>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto theme-background p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;