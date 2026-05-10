import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { appointmentService } from '../../services/apiService';

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchPatientId, setSearchPatientId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [showNoteForm, setShowNoteForm] = useState(false);

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

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await appointmentService.update(appointmentId, { status: newStatus });
      setSuccess('Appointment status updated!');
      setAppointments((prev) =>
        prev.map((app) =>
          app._id === appointmentId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update appointment');
    }
  };

  const handleSearchPatient = (patientId) => {
    const apt = appointments.find(app => app.patientId?._id === patientId);
    if (apt) {
      setSelectedPatient(apt.patientId);
      setSelectedAppointment(apt);
    } else {
      setError('Patient not found in your appointments');
    }
  };

  const handleAddNote = async (appointmentId) => {
    try {
      await appointmentService.update(appointmentId, {
        doctorNotes: doctorNotes,
        prescriptionDetails: prescriptions,
      });
      setSuccess('Notes and prescriptions saved successfully!');
      setShowNoteForm(false);
      setDoctorNotes('');
      setPrescriptions([]);
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save notes');
    }
  };

  if (loading) return <LoadingSpinner />;

  const cardStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  };

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

  const statusBadge = (status) => {
    const colors = {
      Pending: '#ffc107',
      Confirmed: '#28a745',
      Completed: '#007bff',
      Cancelled: '#dc3545',
    };
    return {
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '20px',
      backgroundColor: colors[status] || '#6c757d',
      color: 'white',
      fontSize: '12px',
      fontWeight: '600',
    };
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1, padding: '30px' }}>
          <h1 style={{ color: '#333', marginBottom: '30px' }}>My Appointments</h1>
          <Alert type="error" message={error} />
          <Alert type="success" message={success} />

          {/* Patient Lookup Section */}
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, color: '#333' }}>🔍 Search Patient Data</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>Enter patient ID to view their details and medical history</p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Enter Patient ID"
                value={searchPatientId}
                onChange={(e) => setSearchPatientId(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
              <button
                onClick={() => handleSearchPatient(searchPatientId)}
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
                Search
              </button>
            </div>

            {selectedPatient && (
              <div style={{ backgroundColor: '#f0f4ff', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
                <h3 style={{ marginTop: 0, color: '#333' }}>Patient Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <strong>Name:</strong> {selectedPatient.userId?.firstName} {selectedPatient.userId?.lastName}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedPatient.userId?.email}
                  </div>
                  <div>
                    <strong>Phone:</strong> {selectedPatient.userId?.phone}
                  </div>
                  <div>
                    <strong>Blood Group:</strong> {selectedPatient.bloodGroup}
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong>Address:</strong> {selectedPatient.address}, {selectedPatient.city}, {selectedPatient.state}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Appointments Table */}
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, color: '#333', marginBottom: '20px' }}>My Appointments</h2>
            {appointments.length === 0 ? (
              <p style={{ color: '#666' }}>No appointments found.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Patient</th>
                      <th style={thStyle}>Date</th>
                      <th style={thStyle}>Time</th>
                      <th style={thStyle}>Reason</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((app) => (
                      <tr key={app._id}>
                        <td style={tdStyle}>
                          <strong>{app.patientId?.userId?.firstName} {app.patientId?.userId?.lastName}</strong>
                          <div style={{ fontSize: '12px', color: '#666' }}>ID: {app.patientId?._id}</div>
                        </td>
                        <td style={tdStyle}>{new Date(app.appointmentDate).toLocaleDateString()}</td>
                        <td style={tdStyle}>{app.appointmentTime}</td>
                        <td style={tdStyle}>{app.reason}</td>
                        <td style={tdStyle}>
                          <span style={statusBadge(app.status)}>
                            {app.status}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {app.status === 'Pending' && (
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(app._id, 'Confirmed')}
                                  style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                  }}
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(app._id, 'Cancelled')}
                                  style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                  }}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {app.status === 'Confirmed' && (
                              <>
                                <button
                                  onClick={() => navigate(`/consultation/${app._id}?apt=${app._id}`)}
                                  style={{
                                    padding: '6px 12px',
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                  }}
                                >
                                  📹 Start Call
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedAppointment(app);
                                    setShowNoteForm(true);
                                  }}
                                  style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#667eea',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                  }}
                                >
                                  Add Note
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(app._id, 'Completed')}
                                  style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                  }}
                                >
                                  Complete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Add Notes Modal */}
          {showNoteForm && selectedAppointment && (
            <div style={cardStyle}>
              <h2 style={{ marginTop: 0, color: '#333' }}>Add Doctor Notes & Prescriptions</h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                  Doctor Notes:
                </label>
                <textarea
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="Enter your clinical notes here..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                    minHeight: '100px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                  Prescriptions:
                </label>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '6px',
                  marginBottom: '10px'
                }}>
                  <button
                    onClick={() => setPrescriptions([...prescriptions, { medicationName: '', dosage: '', frequency: '', duration: '' }])}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    + Add Prescription
                  </button>
                  {prescriptions.map((presc, idx) => (
                    <div key={idx} style={{ marginTop: '10px', backgroundColor: 'white', padding: '10px', borderRadius: '4px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                        <input
                          type="text"
                          placeholder="Medication Name"
                          value={presc.medicationName}
                          onChange={(e) => {
                            const newPrescriptions = [...prescriptions];
                            newPrescriptions[idx].medicationName = e.target.value;
                            setPrescriptions(newPrescriptions);
                          }}
                          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <input
                          type="text"
                          placeholder="Dosage (e.g., 500mg)"
                          value={presc.dosage}
                          onChange={(e) => {
                            const newPrescriptions = [...prescriptions];
                            newPrescriptions[idx].dosage = e.target.value;
                            setPrescriptions(newPrescriptions);
                          }}
                          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input
                          type="text"
                          placeholder="Frequency (e.g., 3 times daily)"
                          value={presc.frequency}
                          onChange={(e) => {
                            const newPrescriptions = [...prescriptions];
                            newPrescriptions[idx].frequency = e.target.value;
                            setPrescriptions(newPrescriptions);
                          }}
                          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                        <input
                          type="text"
                          placeholder="Duration (e.g., 7 days)"
                          value={presc.duration}
                          onChange={(e) => {
                            const newPrescriptions = [...prescriptions];
                            newPrescriptions[idx].duration = e.target.value;
                            setPrescriptions(newPrescriptions);
                          }}
                          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleAddNote(selectedAppointment._id)}
                  style={{
                    padding: '10px 30px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Save Notes & Prescriptions
                </button>
                <button
                  onClick={() => {
                    setShowNoteForm(false);
                    setDoctorNotes('');
                    setPrescriptions([]);
                  }}
                  style={{
                    padding: '10px 30px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
