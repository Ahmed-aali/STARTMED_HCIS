import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { appointmentService } from '../../services/apiService';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await appointmentService.getAllAppointments();
      setAppointments(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: '#ffc107',
      Confirmed: '#28a745',
      Completed: '#007bff',
      Cancelled: '#dc3545',
    };
    return colors[status] || '#6c757d';
  };

  const filterAppointments = () => {
    const now = new Date();
    if (filter === 'upcoming') {
      return appointments.filter(apt => new Date(apt.appointmentDate) > now);
    } else if (filter === 'past') {
      return appointments.filter(apt => new Date(apt.appointmentDate) <= now);
    }
    return appointments;
  };

  if (loading) return <LoadingSpinner />;

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  const thStyle = {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    textAlign: 'left',
    fontWeight: '600',
    borderBottom: '2px solid #dee2e6',
    color: '#333',
  };

  const tdStyle = {
    padding: '15px',
    borderBottom: '1px solid #dee2e6',
  };

  const statusBadge = (status) => ({
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: getStatusColor(status),
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
  });

  const filteredAppointments = filterAppointments();

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1, padding: '30px' }}>
          <h1 style={{ marginBottom: '20px', color: '#333' }}>All Appointments</h1>
          <Alert type="error" message={error} />

          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '10px 20px',
                backgroundColor: filter === 'all' ? '#667eea' : '#ddd',
                color: filter === 'all' ? 'white' : '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              All ({appointments.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              style={{
                padding: '10px 20px',
                backgroundColor: filter === 'upcoming' ? '#667eea' : '#ddd',
                color: filter === 'upcoming' ? 'white' : '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              style={{
                padding: '10px 20px',
                backgroundColor: filter === 'past' ? '#667eea' : '#ddd',
                color: filter === 'past' ? 'white' : '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Past
            </button>
          </div>

          {filteredAppointments.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Patient</th>
                    <th style={thStyle}>Doctor</th>
                    <th style={thStyle}>Date & Time</th>
                    <th style={thStyle}>Reason</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt) => (
                    <tr key={apt._id}>
                      <td style={tdStyle}>
                        <strong>{apt.patientId?.userId?.firstName} {apt.patientId?.userId?.lastName}</strong>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {apt.patientId?.userId?.email}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <strong>{apt.doctorId?.userId?.firstName} {apt.doctorId?.userId?.lastName}</strong>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {apt.doctorId?.specialization}
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <div>
                          {new Date(apt.appointmentDate).toLocaleDateString()} {apt.appointmentTime}
                        </div>
                      </td>
                      <td style={tdStyle}>{apt.reason}</td>
                      <td style={tdStyle}>
                        <span style={statusBadge(apt.status)}>{apt.status}</span>
                      </td>
                      <td style={tdStyle}>₹{apt.consultationFee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                backgroundColor: 'white',
                borderRadius: '8px',
                color: '#666',
              }}
            >
              <p>No appointments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
