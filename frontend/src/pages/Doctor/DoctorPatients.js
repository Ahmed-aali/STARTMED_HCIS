import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { appointmentService } from '../../services/apiService';

const DoctorPatients = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await appointmentService.getMyAppointments();
      setAppointments(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const getUniquePatients = () => {
    const patientMap = new Map();
    appointments.forEach((apt) => {
      if (apt.patientId && !patientMap.has(apt.patientId._id)) {
        patientMap.set(apt.patientId._id, {
          ...apt.patientId,
          appointmentCount: 0,
          lastVisit: apt.appointmentDate,
        });
      }
      if (apt.patientId && patientMap.has(apt.patientId._id)) {
        const patient = patientMap.get(apt.patientId._id);
        patient.appointmentCount += 1;
        if (new Date(apt.appointmentDate) > new Date(patient.lastVisit)) {
          patient.lastVisit = apt.appointmentDate;
        }
      }
    });
    return Array.from(patientMap.values());
  };

  const patients = getUniquePatients();

  const filteredPatients = patients.filter((patient) => {
    const name = `${patient.userId?.firstName || ''} ${patient.userId?.lastName || ''}`.toLowerCase();
    const email = (patient.userId?.email || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  if (loading) return <LoadingSpinner />;

  const cardStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1, padding: '28px' }}>
          <h1 style={{ color: '#1a1a2e', marginBottom: '24px' }}>My Patients</h1>
          <Alert type="error" message={error} />

          <div style={{ ...cardStyle, marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '20px' }}>🔍</span>
              <input
                type="text"
                placeholder="Search patients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: "'Inter', sans-serif",
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#667eea'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px', color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
            {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} found
          </div>

          {filteredPatients.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <div className="empty-state-text">No patients found</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {filteredPatients.map((patient) => (
                <div
                  key={patient._id}
                  style={cardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '16px',
                    }}>
                      {(patient.userId?.firstName?.charAt(0) || '') + (patient.userId?.lastName?.charAt(0) || '')}
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e' }}>
                        {patient.userId?.firstName} {patient.userId?.lastName}
                      </div>
                      <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                        {patient.userId?.email}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Blood Group
                      </div>
                      <div style={{ fontSize: '14px', color: '#334155', fontWeight: '600', marginTop: '4px' }}>
                        {patient.bloodGroup || '—'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Visits
                      </div>
                      <div style={{ fontSize: '14px', color: '#334155', fontWeight: '600', marginTop: '4px' }}>
                        {patient.appointmentCount}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Last Visit
                      </div>
                      <div style={{ fontSize: '14px', color: '#334155', fontWeight: '600', marginTop: '4px' }}>
                        {new Date(patient.lastVisit).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorPatients;
