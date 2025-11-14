import React from 'react';
import { useSmartNavigation } from '../../hooks/useSmartNavigation';
import { type LinkProps, useLocation } from 'react-router-dom';

interface SmartLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const SmartLink: React.FC<SmartLinkProps> = ({ 
  to, 
  children, 
  className = '', 
  onClick,
  ...props 
}) => {
  const smartNavigate = useSmartNavigation();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Call custom onClick handler if provided
    if (onClick) {
      onClick(e);
    }
    
    // Use smart navigation
    smartNavigate(to);
  };

  const isActive = location.pathname === to;

  return (
    <a
      href={to}
      className={`${className} ${isActive ? 'active' : ''}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
};

export default SmartLink;