import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { prescriptionService, patientService } from '../../services/apiService';

const CreatePrescription = () => {
  const [loading, setLoading] = useState(false);
  const [fetchingPatients, setFetchingPatients] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    medicines: [{ medicineName: '', dosage: '', frequency: '', duration: '' }],
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

  const handleMedicineChange = (index, field, value) => {
    const medicines = [...formData.medicines];
    medicines[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      medicines,
    }));
  };

  const addMedicine = () => {
    setFormData((prev) => ({
      ...prev,
      medicines: [...prev.medicines, { medicineName: '', dosage: '', frequency: '', duration: '' }],
    }));
  };

  const removeMedicine = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await prescriptionService.create(formData);
      setSuccess('Prescription created successfully!');
      setFormData({
        patientId: '',
        medicines: [{ medicineName: '', dosage: '', frequency: '', duration: '' }],
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
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
  const letterhead = {
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    padding: '30px 40px',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };
  const clinicInfo = { textAlign: 'right', fontSize: '14px', color: '#cbd5e1' };
  const formBody = { padding: '40px' };
  const sectionTitle = { fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #f1f5f9' };
  const gridRow = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' };
  const medicineCard = {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    position: 'relative',
    transition: 'all 0.3s ease'
  };
  const removeBtn = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: '#fee2e2',
    color: '#ef4444',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    transition: 'all 0.2s'
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
              <h1 style={{ color: '#0f172a', margin: '0 0 8px 0', fontSize: '28px', fontWeight: '800' }}>Clinical Prescription</h1>
              <p style={{ color: '#64748b', margin: 0 }}>Draft and issue digital prescriptions</p>
            </div>
          </div>

          <Alert type="error" message={error} />
          <Alert type="success" message={success} />

          <div style={formCard}>
            <div style={letterhead}>
              <div>
                <h2 style={{ margin: 0, fontSize: '32px', fontWeight: '800', letterSpacing: '1px', color: '#ffffff' }}>Rx</h2>
                <p style={{ margin: '4px 0 0 0', color: '#e2e8f0', fontSize: '14px', fontWeight: '500' }}>Start Med Health System</p>
              </div>
              <div style={clinicInfo}>
                <strong>E-Prescription Gateway</strong><br/>
                Date: {new Date().toLocaleDateString()}
              </div>
            </div>

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

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{...sectionTitle, borderBottom: 'none', marginBottom: '15px'}}>💊 Medication Protocol</h3>
                  </div>

                  {formData.medicines.map((medicine, index) => (
                    <div key={index} style={medicineCard}>
                      {formData.medicines.length > 1 && (
                        <button type="button" style={removeBtn} onClick={() => removeMedicine(index)} title="Remove Medicine">
                          ✕
                        </button>
                      )}
                      
                      <div style={{...gridRow, marginBottom: '20px'}}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Medicine Name *</label>
                          <input
                            type="text"
                            value={medicine.medicineName}
                            onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)}
                            placeholder="e.g. Amoxicillin 500mg"
                            required
                            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%', marginTop: '6px' }}
                          />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Dosage *</label>
                          <input
                            type="text"
                            value={medicine.dosage}
                            onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                            placeholder="e.g. 1 Tablet"
                            required
                            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%', marginTop: '6px' }}
                          />
                        </div>
                      </div>

                      <div style={gridRow}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Frequency *</label>
                          <input
                            type="text"
                            value={medicine.frequency}
                            onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                            placeholder="e.g. Twice a day after meals"
                            required
                            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%', marginTop: '6px' }}
                          />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>Duration *</label>
                          <input
                            type="text"
                            value={medicine.duration}
                            onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                            placeholder="e.g. 7 Days"
                            required
                            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%', marginTop: '6px' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button" 
                    onClick={addMedicine}
                    style={{ background: 'transparent', border: '2px dashed #cbd5e1', color: '#64748b', width: '100%', padding: '16px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', marginTop: '10px' }}
                  >
                    + Add Another Medication
                  </button>
                </div>

                <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={loading}
                    style={{ padding: '14px 32px', fontSize: '16px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
                  >
                    {loading ? 'Issuing Prescription...' : 'Issue Prescription →'}
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

export default CreatePrescription;
