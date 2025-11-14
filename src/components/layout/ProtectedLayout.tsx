import React from 'react';
import Layout from './Layout';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default ProtectedLayout;