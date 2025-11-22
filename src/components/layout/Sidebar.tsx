import React from 'react';
import { FileText, Briefcase, Award, Cpu, LayoutDashboard, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSmartNavigation } from '../../hooks/useSmartNavigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const smartNavigate = useSmartNavigation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: FileText, label: 'Blogs', href: '/admin/blogs' },
    { icon: Briefcase, label: 'Projects', href: '/projects' },
    { icon: Award, label: 'Certificates', href: '/certificates' },
    { icon: Cpu, label: 'Skills', href: '/skills' },
  ];

  const handleNavigation = (href: string) => {
    const didNavigate = smartNavigate(href);
    
    // Close sidebar on mobile regardless of navigation
    if (window.innerWidth < 1024) {
      onClose();
    }
    
    return didNavigate;
  };

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo and Close Button */}
        <div className="p-4 border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <img
                  src="/images/code.png"
                  alt="code icon"
                  className="w-9 h-9"
                />
              </div>
              <h1 className="text-xl font-bold text-gray-800">TerminalX</h1>
            </div>
            <button 
              onClick={onClose}
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {active && (
                  <span className="ml-auto text-xs text-blue-600 font-medium">●</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;