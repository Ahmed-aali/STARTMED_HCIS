import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { doctorService, appointmentService } from '../../services/apiService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const DoctorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profileRes = await doctorService.getMyProfile();
      setProfile(profileRes.data.data);
      
      const aptRes = await appointmentService.getMyAppointments();
      setAppointments(aptRes.data.data || []);
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

  // Calculate dynamic stats
  const pendingAppointments = appointments.filter(a => a.status === 'Pending').length;
  const completedAppointments = appointments.filter(a => a.status === 'Completed').length;
  const uniquePatients = new Set(appointments.map(a => a.patientId?._id)).size;

  // Process data for AreaChart (appointments by date)
  const appointmentTrends = appointments.reduce((acc, app) => {
    const date = new Date(app.appointmentDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  
  const areaChartData = Object.keys(appointmentTrends).map(date => ({
    date,
    count: appointmentTrends[date]
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

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
                    <div style={{ fontSize: '12px', color: '#667eea', fontWeight: '600' }}>TOTAL PATIENTS</div>
                    <div style={statNumberStyle}>{uniquePatients}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Unique</div>
                  </div>
                  <div style={statCardStyle}>
                    <div style={{ fontSize: '12px', color: '#667eea', fontWeight: '600' }}>CONSULTATIONS</div>
                    <div style={statNumberStyle}>{completedAppointments}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Completed</div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
                <div style={{ flex: 2, minWidth: '400px', ...headerCardStyle, borderLeft: 'none', marginBottom: 0 }}>
                  <h3 style={{ marginTop: 0, color: '#333', marginBottom: '20px' }}>Appointment Trends</h3>
                  {areaChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={areaChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <RechartsTooltip />
                        <Area type="monotone" dataKey="count" stroke="#667eea" fillOpacity={1} fill="url(#colorCount)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '40px' }}>No appointment data available yet.</p>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: '250px', ...headerCardStyle, borderLeft: 'none', marginBottom: 0 }}>
                  <h3 style={{ marginTop: 0, color: '#333', marginBottom: '20px' }}>Status Overview</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Pending', value: pendingAppointments },
                          { name: 'Completed', value: completedAppointments },
                          { name: 'Other', value: appointments.length - (pendingAppointments + completedAppointments) }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#f59e0b" />
                        <Cell fill="#10b981" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
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
