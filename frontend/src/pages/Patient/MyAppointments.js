import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { appointmentService } from '../../services/apiService';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await appointmentService.getMyAppointments();
      setAppointments(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.cancel(appointmentId);
        setAppointments((prev) =>
          prev.map((app) =>
            app._id === appointmentId ? { ...app, status: 'Cancelled' } : app
          )
        );
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to cancel appointment');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1 }}>
          <h1>My Appointments</h1>
          <Alert type="error" message={error} />

          {appointments.length === 0 ? (
            <div className="card">
              <p>No appointments found.</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((app) => (
                  <tr key={app._id}>
                    <td>{app.doctorId?.userId?.firstName} {app.doctorId?.userId?.lastName}</td>
                    <td>{new Date(app.appointmentDate).toLocaleDateString()}</td>
                    <td>{app.appointmentTime}</td>
                    <td>{app.reason}</td>
                    <td>
                      <span className={`badge badge-${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      {app.status === 'Pending' && (
                        <button
                          className="btn btn-danger"
                          onClick={() => handleCancel(app._id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
