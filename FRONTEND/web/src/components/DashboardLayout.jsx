import React, { useState } from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} flex flex-col h-screen overflow-hidden`}>
        <main className="flex-1 overflow-y-auto pt-20 pb-20 px-4 md:p-10 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
