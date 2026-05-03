import React from 'react';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <div>Not authenticated</div>;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <div>Not authorized</div>;
  }

  return children;
};

export default ProtectedRoute;
