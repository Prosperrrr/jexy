import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-10 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
