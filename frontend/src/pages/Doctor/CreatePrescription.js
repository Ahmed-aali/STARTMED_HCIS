import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import { prescriptionService } from '../../services/apiService';

const CreatePrescription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    patientId: '',
    medicines: [{ medicineName: '', dosage: '', frequency: '', duration: '' }],
  });

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

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1 }}>
          <h1>Create Prescription</h1>
          <Alert type="error" message={error} />
          <Alert type="success" message={success} />

          <div className="card" style={{ maxWidth: '700px' }}>
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

              <h3>Medicines</h3>
              {formData.medicines.map((medicine, index) => (
                <div key={index} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '15px' }}>
                  <div className="form-group">
                    <label>Medicine Name:</label>
                    <input
                      type="text"
                      value={medicine.medicineName}
                      onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Dosage:</label>
                    <input
                      type="text"
                      value={medicine.dosage}
                      onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Frequency:</label>
                    <input
                      type="text"
                      value={medicine.frequency}
                      onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Duration:</label>
                    <input
                      type="text"
                      value={medicine.duration}
                      onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                      required
                    />
                  </div>

                  {formData.medicines.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeMedicine(index)}
                    >
                      Remove Medicine
                    </button>
                  )}
                </div>
              ))}

              <button type="button" className="btn btn-primary" onClick={addMedicine}>
                Add Medicine
              </button>

              <div style={{ marginTop: '20px' }}>
                <button type="submit" className="btn btn-success" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePrescription;
