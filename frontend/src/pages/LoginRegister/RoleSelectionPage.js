import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'patient',
      title: 'Patient',
      description: 'Book appointments, view medical records, and manage your health',
      icon: '👤',
      color: '#3498db',
    },
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'Manage appointments and patient records',
      icon: '👨‍⚕️',
      color: '#2ecc71',
    },
  ];

  return (
    <div className="role-selection-container">
      <div className="role-selection-content">
        <h1>Welcome to Start Med</h1>
        <p>Select your role to continue</p>
        
        <div className="role-cards">
          {roles.map((role) => (
            <div
              key={role.id}
              className="role-card"
              style={{ borderLeft: `5px solid ${role.color}` }}
              onClick={() => navigate(`/register/${role.id}`)}
            >
              <div className="role-icon">{role.icon}</div>
              <h2>{role.title}</h2>
              <p>{role.description}</p>
              <button className="role-btn" style={{ backgroundColor: role.color }}>
                Register as {role.title}
              </button>
            </div>
          ))}
        </div>

        <div className="login-link">
          <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
