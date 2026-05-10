import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();

  const patientLinks = [
    { path: '/patient', label: 'Dashboard', icon: '📊' },
    { path: '/patient/profile', label: 'My Profile', icon: '👤' },
    { path: '/patient/appointments', label: 'My Appointments', icon: '📅' },
    { path: '/patient/book-appointment', label: 'Book Appointment', icon: '➕' },
    { path: '/patient/medical-records', label: 'Medical Records', icon: '📋' },
    { path: '/patient/prescriptions', label: 'Prescriptions', icon: '💊' },
    { path: '/patient/services', label: 'Services & Payment', icon: '🏥' },
    { path: '/patient/bills', label: 'Bills & Payments', icon: '💳' },
  ];

  const doctorLinks = [
    { path: '/doctor', label: 'Dashboard', icon: '📊' },
    { path: '/doctor/appointments', label: 'Appointments', icon: '📅' },
    { path: '/doctor/patients', label: 'Patients', icon: '👥' },
    { path: '/doctor/add-record', label: 'Add Record', icon: '📝' },
    { path: '/doctor/prescriptions', label: 'Prescriptions', icon: '💊' },
  ];

  const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/appointments', label: 'Appointments', icon: '📅' },
    { path: '/admin/doctors', label: 'Manage Doctors', icon: '👨‍⚕️' },
    { path: '/admin/users', label: 'Manage Users', icon: '👥' },
    { path: '/admin/bills', label: 'Manage Bills', icon: '💰' },
    { path: '/admin/reports', label: 'Reports', icon: '📈' },
  ];

  const getLinks = () => {
    if (user?.role === 'patient') return patientLinks;
    if (user?.role === 'doctor') return doctorLinks;
    if (user?.role === 'admin') return adminLinks;
    return [];
  };

  const links = getLinks();

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {links.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              end={link.path === '/patient' || link.path === '/doctor' || link.path === '/admin'}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span className="menu-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
