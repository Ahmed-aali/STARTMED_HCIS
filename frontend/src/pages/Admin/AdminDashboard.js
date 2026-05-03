import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminService } from '../../services/apiService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await adminService.getDashboardStats();
      setStats(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const statStyle = {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '30px',
  };

  const statCardStyle = {
    flex: 1,
    minWidth: '150px',
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  };

  const statNumberStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#007bff',
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1 }}>
          <h1>Admin Dashboard</h1>
          <Alert type="error" message={error} />

          {stats && (
            <>
              <div style={statStyle}>
                <div style={statCardStyle}>
                  <h3>Total Patients</h3>
                  <div style={statNumberStyle}>{stats.totalPatients}</div>
                </div>
                <div style={statCardStyle}>
                  <h3>Total Doctors</h3>
                  <div style={statNumberStyle}>{stats.totalDoctors}</div>
                </div>
                <div style={statCardStyle}>
                  <h3>Total Appointments</h3>
                  <div style={statNumberStyle}>{stats.totalAppointments}</div>
                </div>
                <div style={statCardStyle}>
                  <h3>Total Bills</h3>
                  <div style={statNumberStyle}>{stats.totalBills}</div>
                </div>
              </div>

              <div style={statStyle}>
                <div style={statCardStyle}>
                  <h3>Total Revenue</h3>
                  <div style={statNumberStyle}>₹{stats.totalRevenue}</div>
                </div>
                <div style={statCardStyle}>
                  <h3>Pending Appointments</h3>
                  <div style={statNumberStyle}>{stats.pendingAppointments}</div>
                </div>
                <div style={statCardStyle}>
                  <h3>Completed Appointments</h3>
                  <div style={statNumberStyle}>{stats.completedAppointments}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
