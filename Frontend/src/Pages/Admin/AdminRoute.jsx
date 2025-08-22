import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const AdminRoute = ({ children }) => {
  const { user, initializing } = useAuth();
  if (initializing) return <div className="px-6 py-10 text-sm text-[var(--pv-text-dim)]">Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

export default AdminRoute;
