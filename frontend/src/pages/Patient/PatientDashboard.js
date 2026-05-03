import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { patientService } from '../../services/apiService';

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await patientService.getMyProfile();
      setProfile(res.data.data);
    } catch (err) {
      // If 404 or no profile, redirect to profile registration
      if (err.response?.status === 404) {
        navigate('/patient/register-profile');
      } else {
        setError(err.response?.data?.message || 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const dashboardStyle = {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  };

  const statGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: '30px',
  };

  const statCardStyle = {
    backgroundColor: '#f0f4ff',
    padding: '20px',
    borderRadius: '8px',
    borderLeft: '5px solid #667eea',
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1, padding: '30px', ...dashboardStyle }}>
          <h1 style={{ color: '#333', marginBottom: '30px' }}>Patient Dashboard</h1>
          <Alert type="error" message={error} />
          
          {profile ? (
            <>
              <div style={cardStyle}>
                <h2 style={{ color: '#333', marginTop: 0 }}>Welcome, {profile.userId?.firstName}! 👋</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>Here's your health profile summary</p>
                
                <div style={statGridStyle}>
                  <div style={statCardStyle}>
                    <div style={{ fontSize: '12px', color: '#667eea', fontWeight: '600', marginBottom: '5px' }}>EMAIL</div>
                    <div style={{ fontSize: '14px', color: '#333' }}>{profile.userId?.email}</div>
                  </div>
                  <div style={statCardStyle}>
                    <div style={{ fontSize: '12px', color: '#667eea', fontWeight: '600', marginBottom: '5px' }}>PHONE</div>
                    <div style={{ fontSize: '14px', color: '#333' }}>{profile.userId?.phone}</div>
                  </div>
                  <div style={statCardStyle}>
                    <div style={{ fontSize: '12px', color: '#667eea', fontWeight: '600', marginBottom: '5px' }}>BLOOD GROUP</div>
                    <div style={{ fontSize: '14px', color: '#333', fontWeight: '600' }}>{profile.bloodGroup}</div>
                  </div>
                  <div style={statCardStyle}>
                    <div style={{ fontSize: '12px', color: '#667eea', fontWeight: '600', marginBottom: '5px' }}>LOCATION</div>
                    <div style={{ fontSize: '14px', color: '#333' }}>{profile.city}, {profile.state}</div>
                  </div>
                </div>
              </div>

              <div style={cardStyle}>
                <h3 style={{ color: '#333', marginTop: 0 }}>📍 Address Details</h3>
                <p style={{ color: '#666', margin: 0 }}>{profile.address}, {profile.city}, {profile.state} - {profile.zipCode}</p>
              </div>
            </>
          ) : (
            <div style={cardStyle}>
              <p style={{ color: '#666', marginBottom: '20px' }}>Your profile is incomplete. Please complete your profile to get started.</p>
              <button
                onClick={() => navigate('/patient/register-profile')}
                style={{
                  padding: '10px 30px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Complete Your Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
