import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { doctorService, adminService } from '../../services/apiService';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: 'General Practice',
    licenseNumber: '',
    experience: '',
    hospital: '',
    consultationFee: 500,
    qualifications: '',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await doctorService.getAllDoctors();
      setDoctors(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVerifyToggle = async (doctorId, currentStatus) => {
    try {
      await adminService.verifyDoctor(doctorId, { isVerified: !currentStatus });
      setSuccessMessage(`Doctor ${!currentStatus ? 'verified' : 'unverified'} successfully`);
      fetchDoctors();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update doctor status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const doctorData = {
        ...formData,
        qualifications: formData.qualifications.split(',').map(q => q.trim()),
        role: 'doctor',
      };
      // Here you would call an API to create a new doctor
      // For now, we'll just show a success message
      setSuccessMessage('Doctor added successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialization: 'General Practice',
        licenseNumber: '',
        experience: '',
        hospital: '',
        consultationFee: 500,
        qualifications: '',
      });
      setShowForm(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add doctor');
    }
  };

  if (loading) return <LoadingSpinner />;

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    borderLeft: '5px solid #667eea',
  };

  const specializations = [
    'General Practice',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'Surgery',
    'X-Ray',
    'Dentist',
    'ENT',
    'Neurological',
    'Other',
  ];

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1, padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#333', margin: 0 }}>Manage Doctors</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              {showForm ? 'Cancel' : '+ Add Doctor'}
            </button>
          </div>

          <Alert type="error" message={error} />
          {successMessage && <Alert type="success" message={successMessage} />}

          {showForm && (
            <div style={cardStyle}>
              <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Add New Doctor</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div className="form-group">
                    <label>Specialization *</label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                    >
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>License Number *</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div className="form-group">
                    <label>Experience (Years) *</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Hospital *</label>
                    <input
                      type="text"
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div className="form-group">
                    <label>Consultation Fee *</label>
                    <input
                      type="number"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Qualifications (comma-separated)</label>
                    <input
                      type="text"
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={handleChange}
                      placeholder="e.g., MBBS, MD"
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
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
                  Add Doctor
                </button>
              </form>
            </div>
          )}

          <div>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>Current Doctors ({doctors.length})</h2>
            {doctors.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {doctors.map((doctor) => (
                  <div key={doctor._id} style={cardStyle}>
                    <h3 style={{ marginTop: 0, color: '#333' }}>
                      {doctor.userId?.firstName} {doctor.userId?.lastName}
                    </h3>
                    <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
                      <div>
                        <strong>Specialization:</strong> {doctor.specialization}
                      </div>
                      <div>
                        <strong>Experience:</strong> {doctor.experience} years
                      </div>
                      <div>
                        <strong>Hospital:</strong> {doctor.hospital}
                      </div>
                      <div>
                        <strong>Fee:</strong> ₹{doctor.consultationFee}
                      </div>
                      <div>
                        <strong>Status:</strong>{' '}
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: doctor.isVerified ? '#d4edda' : '#fff3cd',
                            color: doctor.isVerified ? '#155724' : '#856404',
                            fontSize: '12px',
                            marginRight: '10px'
                          }}
                        >
                          {doctor.isVerified ? 'Verified' : 'Pending'}
                        </span>
                        
                        <button
                          onClick={() => handleVerifyToggle(doctor._id, doctor.isVerified)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: doctor.isVerified ? '#e53e3e' : '#38a169',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          {doctor.isVerified ? 'Revoke Verification' : 'Verify Doctor'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                <p>No doctors found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDoctors;
