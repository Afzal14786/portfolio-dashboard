import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
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
      <div className="lg:ml-64 min-h-screen transition-all duration-300">
        {/* Fixed Header */}
        <Header onMenuToggle={toggleSidebar} />
        
        {/* Page Content */}
        <main className="pt-16 lg:pt-20 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;