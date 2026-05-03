import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { doctorService } from '../../services/apiService';

const DoctorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await doctorService.getMyProfile();
      setProfile(res.data.data);
    } catch (err) {
      if (err.response?.status === 404) {
        navigate('/doctor/register-profile');
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
    padding: '30px',
  };

  const headerCardStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '30px',
    borderLeft: '5px solid #667eea',
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  };

  const statCardStyle = {
    backgroundColor: '#f0f4ff',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
  };

  const statNumberStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#667eea',
    margin: '10px 0',
  };

  const badgeStyle = {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content" style={dashboardStyle}>
          <h1 style={{ color: '#333', marginBottom: '30px' }}>Doctor Dashboard</h1>
          <Alert type="error" message={error} />
          
          {profile ? (
            <>
              <div style={headerCardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h2 style={{ marginTop: 0, color: '#333', marginBottom: '10px' }}>
                      Dr. {profile.userId?.firstName} {profile.userId?.lastName}
                    </h2>
                    <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>
                      {profile.specialization}
                    </p>
                  </div>
                  <span style={{
                    ...badgeStyle,
                    backgroundColor: profile.isVerified ? '#d4edda' : '#fff3cd',
                    color: profile.isVerified ? '#155724' : '#856404',
                  }}>
                    {profile.isVerified ? '✓ Verified' : 'Pending Verification'}
                  </span>
                </div>

                <div style={statsGridStyle}>
                  <div style={statCardStyle}>
                    <div style={{ fontSize: '12px', color: '#667eea', fontWeight: '600' }}>EXPERIENCE</div>
                    <div style={statNumberStyle}>{profile.experience}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Years</div>
                  </div>
                  <div style={statCardStyle}>
                    <div style={{ fontSize: '12px', color: '#667eea', fontWeight: '600' }}>CONSULTATION FEE</div>
                    <div style={statNumberStyle}>₹{profile.consultationFee}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Per Appointment</div>
                  </div>
                  <div style={statCardStyle}>
                    <div style={{ fontSize: '12px', color: '#667eea', fontWeight: '600' }}>LICENSE</div>
                    <div style={{ fontSize: '12px', color: '#333', fontWeight: '600', marginTop: '10px', wordBreak: 'break-all' }}>
                      {profile.licenseNumber}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                ...headerCardStyle,
                borderLeft: '5px solid #2ecc71',
              }}>
                <h3 style={{ marginTop: 0, color: '#333' }}>Professional Information</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px',
                  marginTop: '20px'
                }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '5px' }}>HOSPITAL</div>
                    <div style={{ fontSize: '16px', color: '#333', fontWeight: '600' }}>{profile.hospital}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '5px' }}>EMAIL</div>
                    <div style={{ fontSize: '14px', color: '#333' }}>{profile.userId?.email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '5px' }}>PHONE</div>
                    <div style={{ fontSize: '14px', color: '#333' }}>{profile.userId?.phone}</div>
                  </div>
                </div>

                {profile.qualifications && profile.qualifications.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '10px' }}>QUALIFICATIONS</div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {profile.qualifications.map((qual, idx) => (
                        <span key={idx} style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}>
                          {qual}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{
                ...headerCardStyle,
                borderLeft: '5px solid #3498db',
              }}>
                <h3 style={{ marginTop: 0, color: '#333' }}>Availability</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px',
                  marginTop: '20px'
                }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '5px' }}>WORKING DAYS</div>
                    <div style={{ fontSize: '14px', color: '#333' }}>
                      {profile.availabilityDays?.join(', ')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '5px' }}>WORKING HOURS</div>
                    <div style={{ fontSize: '14px', color: '#333' }}>
                      {profile.availabilityStartTime} - {profile.availabilityEndTime}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={headerCardStyle}>
              <p style={{ color: '#666', marginBottom: '20px' }}>Your profile is incomplete. Please complete your profile to get started.</p>
              <button
                onClick={() => navigate('/doctor/register-profile')}
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

export default DoctorDashboard;
