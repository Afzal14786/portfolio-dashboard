import React from 'react';
import { FileText, Briefcase, Award, Cpu, Settings, LayoutDashboard } from 'lucide-react';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
    { icon: FileText, label: 'Blogs', href: '/blogs' },
    { icon: Briefcase, label: 'Projects', href: '/projects' },
    { icon: Award, label: 'Certificates', href: '/certificates' },
    { icon: Cpu, label: 'Skills', href: '/skills' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
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
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 cursor-pointer ${
              item.active
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;