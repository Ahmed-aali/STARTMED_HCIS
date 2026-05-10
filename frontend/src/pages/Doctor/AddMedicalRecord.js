import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { medicalRecordService, patientService } from '../../services/apiService';

const AddMedicalRecord = () => {
  const [loading, setLoading] = useState(false);
  const [fetchingPatients, setFetchingPatients] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [patients, setPatients] = useState([]);
  const [symptomInput, setSymptomInput] = useState('');
  const [formData, setFormData] = useState({
    patientId: '',
    diagnosis: '',
    symptoms: [],
    treatmentPlan: '',
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await patientService.getAllPatients();
      setPatients(res.data.data);
    } catch (err) {
      setError('Failed to load patients list');
    } finally {
      setFetchingPatients(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await medicalRecordService.create(formData);
      setSuccess('Medical record added successfully!');
      setFormData({
        patientId: '',
        diagnosis: '',
        symptoms: [],
        treatmentPlan: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add medical record');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSymptom = (e) => {
    if (e.key === 'Enter' && symptomInput.trim()) {
      e.preventDefault();
      if (!formData.symptoms.includes(symptomInput.trim())) {
        setFormData(prev => ({
          ...prev,
          symptoms: [...prev.symptoms, symptomInput.trim()]
        }));
      }
      setSymptomInput('');
    }
  };

  const removeSymptom = (symptomToRemove) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter(s => s !== symptomToRemove)
    }));
  };

  // Premium Styles
  const pageContainer = { flex: 1, backgroundColor: '#f8fafc', padding: '40px' };
  const headerSection = { marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
  const formCard = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
    maxWidth: '800px',
    margin: '0 auto',
    overflow: 'hidden',
    border: '1px solid #e2e8f0'
  };
  const headerTape = { height: '8px', background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' };
  const formBody = { padding: '40px' };
  const sectionTitle = { fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #f1f5f9' };
  
  const tagStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    background: '#ecfdf5',
    color: '#059669',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    margin: '0 8px 8px 0',
    border: '1px solid #a7f3d0'
  };

  const tagRemoveBtn = {
    background: 'none',
    border: 'none',
    color: '#059669',
    marginLeft: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  if (fetchingPatients) return <LoadingSpinner />;

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content" style={pageContainer}>
          <div style={headerSection}>
            <div>
              <h1 style={{ color: '#0f172a', margin: '0 0 8px 0', fontSize: '28px', fontWeight: '800' }}>Clinical EHR Note</h1>
              <p style={{ color: '#64748b', margin: 0 }}>Document diagnoses, symptoms, and treatment plans</p>
            </div>
          </div>

          <Alert type="error" message={error} />
          <Alert type="success" message={success} />

          <div style={formCard}>
            <div style={headerTape} />
            <div style={formBody}>
              <form onSubmit={handleSubmit}>
                
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={sectionTitle}>👤 Patient Information</h3>
                  <div className="form-group">
                    <label style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748b', fontWeight: '700', letterSpacing: '0.5px' }}>
                      Select Patient *
                    </label>
                    <select
                      name="patientId"
                      value={formData.patientId}
                      onChange={handleChange}
                      required
                      className="form-control"
                      style={{ padding: '12px 16px', borderRadius: '8px', border: '2px solid #e2e8f0', width: '100%', fontSize: '15px' }}
                    >
                      <option value="">-- Select a patient --</option>
                      {patients.map(p => (
                        <option key={p._id} value={p._id}>
                          {p.userId?.firstName} {p.userId?.lastName} ({p.userId?.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <h3 style={sectionTitle}>🩺 Clinical Assessment</h3>
                  
                  <div className="form-group">
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Reported Symptoms</label>
                    <div style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%', minHeight: '50px', background: '#fff', cursor: 'text' }} onClick={() => document.getElementById('symptom-input').focus()}>
                      {formData.symptoms.map(symptom => (
                        <span key={symptom} style={tagStyle}>
                          {symptom}
                          <button type="button" style={tagRemoveBtn} onClick={(e) => { e.stopPropagation(); removeSymptom(symptom); }}>✕</button>
                        </span>
                      ))}
                      <input
                        id="symptom-input"
                        type="text"
                        value={symptomInput}
                        onChange={(e) => setSymptomInput(e.target.value)}
                        onKeyDown={handleAddSymptom}
                        placeholder={formData.symptoms.length === 0 ? "Type a symptom and press Enter..." : ""}
                        style={{ border: 'none', outline: 'none', background: 'transparent', minWidth: '200px', padding: '4px', fontSize: '14px' }}
                      />
                    </div>
                    <small style={{ color: '#94a3b8', fontSize: '12px', marginTop: '6px', display: 'block' }}>Type a symptom and press Enter to add it as a tag.</small>
                  </div>

                  <div className="form-group" style={{ marginTop: '20px' }}>
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Primary Diagnosis *</label>
                    <textarea
                      name="diagnosis"
                      value={formData.diagnosis}
                      onChange={handleChange}
                      rows="3"
                      required
                      placeholder="Enter detailed diagnosis..."
                      style={{ padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%', fontSize: '15px', resize: 'vertical' }}
                    ></textarea>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h3 style={sectionTitle}>📋 Treatment & Plan</h3>
                  <div className="form-group">
                    <label style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Treatment Plan *</label>
                    <textarea
                      name="treatmentPlan"
                      value={formData.treatmentPlan}
                      onChange={handleChange}
                      rows="4"
                      required
                      placeholder="Outline the recommended treatment, referrals, or next steps..."
                      style={{ padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%', fontSize: '15px', resize: 'vertical' }}
                    ></textarea>
                  </div>
                </div>

                <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={loading}
                    style={{ padding: '14px 32px', fontSize: '16px', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981, #059669)' }}
                  >
                    {loading ? 'Saving Record...' : 'Save Medical Record →'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMedicalRecord;
