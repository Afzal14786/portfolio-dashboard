import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Fixed Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      {/* Main Content Area */}
      <div className="lg:ml-64 min-h-screen">
        {/* Fixed Header */}
        <Header onMenuToggle={toggleSidebar} />
        
        {/* Page Content */}
        <main className="pt-16 lg:pt-20">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;