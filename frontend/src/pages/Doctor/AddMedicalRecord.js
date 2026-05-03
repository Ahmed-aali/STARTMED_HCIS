import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import { medicalRecordService } from '../../services/apiService';

const AddMedicalRecord = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    patientId: '',
    diagnosis: '',
    symptoms: [],
    treatmentPlan: '',
  });

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

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1 }}>
          <h1>Add Medical Record</h1>
          <Alert type="error" message={error} />
          <Alert type="success" message={success} />

          <div className="card" style={{ maxWidth: '600px' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Patient ID:</label>
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Diagnosis:</label>
                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Treatment Plan:</label>
                <textarea
                  name="treatmentPlan"
                  value={formData.treatmentPlan}
                  onChange={handleChange}
                  rows="4"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Record'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMedicalRecord;
