import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const DashboardPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar onToggleCollapse={setIsSidebarCollapsed} />
      {/* Dynamically adjust left margin based on sidebar state */}
      <div className={`flex-1 p-8 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <h1 className="text-2xl font-bold">Dashboard Content</h1>
        {/* This is where the content of the selected module will be rendered */}
      </div>
    </div>
  );
};

export default DashboardPage;