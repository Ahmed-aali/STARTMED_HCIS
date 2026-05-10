import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (!user) return '?';
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  };

  const getRolePath = () => {
    if (!user) return '/';
    return `/${user.role}`;
  };

  return (
    <nav className="navbar">
      <Link to={getRolePath()} style={{ textDecoration: 'none' }}>
        <div className="navbar-brand">Start Med</div>
      </Link>

      <div className="navbar-menu">
        {user && (
          <div className="navbar-user-info">
            <div>
              <div className="navbar-user-name">{user.firstName} {user.lastName}</div>
              <div className="navbar-user-role">{user.role}</div>
            </div>
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={`${user.firstName}'s avatar`} 
                className="navbar-avatar" 
                style={{ objectFit: 'cover', width: '40px', height: '40px', borderRadius: '50%', padding: 0 }} 
              />
            ) : (
              <div className="navbar-avatar">{getInitials()}</div>
            )}
          </div>
        )}
        <button className="navbar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
