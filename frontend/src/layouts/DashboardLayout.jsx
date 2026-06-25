import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = (value) => {
    setSidebarOpen(typeof value === 'boolean' ? value : !sidebarOpen);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-[#060b18] text-slate-700 dark:text-slate-300">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Toolbar */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-5 md:p-6 focus:outline-none">
          <div key={location.pathname} className="mx-auto max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
