import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { appointmentService, doctorService } from '../../services/apiService';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
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

  const handleDoctorSelect = (doctorId) => {
    setFormData((prev) => ({
      ...prev,
      doctorId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.doctorId) {
      setError('Please select a doctor from the list first.');
      return;
    }
    setError('');
    setSuccess('');

    try {
      await appointmentService.book(formData);
      setSuccess('Appointment booked successfully!');
      setFormData({
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    }
  };

  if (loading) return <LoadingSpinner />;

  // Get unique specialties for filtering
  const specialties = ['All', ...new Set(doctors.map(d => d.specialization))];
  const filteredDoctors = selectedSpecialty === 'All' 
    ? doctors 
    : doctors.filter(d => d.specialization === selectedSpecialty);

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1, backgroundColor: '#f8fafc', padding: '30px' }}>
          <h1 style={{ color: '#0f172a', marginBottom: '30px' }}>Book Appointment</h1>
          <Alert type="error" message={error} />
          <Alert type="success" message={success} />

          {/* Step 1: Doctor Selection */}
          <div className="card" style={{ maxWidth: '900px', marginBottom: '24px', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: '#2563eb', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>1</span>
              Select a Doctor
            </h3>
            
            {/* Filter by Specialty */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
              {specialties.map(spec => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => setSelectedSpecialty(spec)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '24px',
                    border: 'none',
                    backgroundColor: selectedSpecialty === spec ? '#2563eb' : '#f1f5f9',
                    color: selectedSpecialty === spec ? 'white' : '#475569',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  {spec}
                </button>
              ))}
            </div>

            {/* Doctor Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '16px',
              maxHeight: '450px',
              overflowY: 'auto',
              padding: '4px'
            }}>
              {filteredDoctors.map(doctor => {
                const isSelected = formData.doctorId === doctor._id;
                const firstName = doctor.userId?.firstName || 'Dr.';
                const lastName = doctor.userId?.lastName || '';
                const profileImage = doctor.userId?.profileImage;
                
                return (
                  <div 
                    key={doctor._id}
                    onClick={() => handleDoctorSelect(doctor._id)}
                    style={{
                      border: `2px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
                      borderRadius: '16px',
                      padding: '20px 16px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      backgroundColor: isSelected ? '#eff6ff' : 'white',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 8px 16px rgba(37, 99, 235, 0.12)' : '0 2px 4px rgba(0,0,0,0.02)',
                      transform: isSelected ? 'translateY(-2px)' : 'none'
                    }}
                  >
                    <img 
                      src={profileImage || `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=${isSelected ? '2563eb' : 'f8fafc'}&color=${isSelected ? 'fff' : '475569'}&size=128&bold=true`} 
                      alt={`Dr. ${lastName}`}
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        marginBottom: '16px',
                        objectFit: 'cover',
                        border: isSelected ? '3px solid white' : 'none',
                        boxShadow: isSelected ? '0 0 0 2px #2563eb' : 'none'
                      }}
                    />
                    <h4 style={{ margin: '0 0 6px', fontSize: '16px', color: '#0f172a' }}>
                      Dr. {firstName} {lastName}
                    </h4>
                    <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#2563eb', fontWeight: '600' }}>
                      {doctor.specialization}
                    </p>
                    <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                      <span>⭐ {doctor.experience} yrs</span>
                      <span>💰 ${doctor.consultationFee}</span>
                    </div>
                  </div>
                );
              })}
              {filteredDoctors.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                  <span style={{ fontSize: '32px', display: 'block', marginBottom: '10px' }}>🏥</span>
                  No doctors found for the selected specialty.
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Appointment Details */}
          <div className="card" style={{ maxWidth: '900px', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', opacity: formData.doctorId ? 1 : 0.6, pointerEvents: formData.doctorId ? 'auto' : 'none', transition: 'all 0.3s' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: formData.doctorId ? '#2563eb' : '#94a3b8', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', transition: 'background 0.3s' }}>2</span>
              Appointment Details
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontWeight: '600', color: '#475569', display: 'block', marginBottom: '8px', fontSize: '14px' }}>Date:</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontWeight: '600', color: '#475569', display: 'block', marginBottom: '8px', fontSize: '14px' }}>Time:</label>
                  <input
                    type="time"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '20px', marginBottom: '24px' }}>
                <label style={{ fontWeight: '600', color: '#475569', display: 'block', marginBottom: '8px', fontSize: '14px' }}>Reason for Appointment:</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Please describe your symptoms or reason for visit..."
                  required
                  style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical', fontSize: '15px', fontFamily: 'inherit' }}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  fontSize: '16px', 
                  fontWeight: '700', 
                  borderRadius: '8px',
                  backgroundColor: formData.doctorId ? '#2563eb' : '#94a3b8',
                  border: 'none',
                  transition: 'all 0.3s'
                }}
                disabled={!formData.doctorId}
              >
                {!formData.doctorId ? 'Please Select a Doctor First' : 'Confirm & Book Appointment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
