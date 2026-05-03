import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { medicalRecordService } from '../../services/apiService';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await medicalRecordService.getMyRecords();
      setRecords(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1 }}>
          <h1>Medical Records</h1>
          <Alert type="error" message={error} />

          {records.length === 0 ? (
            <div className="card">
              <p>No medical records found.</p>
            </div>
          ) : (
            <div>
              {records.map((record) => (
                <div key={record._id} className="card">
                  <h3>Visit Date: {new Date(record.visitDate).toLocaleDateString()}</h3>
                  <p><strong>Doctor:</strong> {record.doctorId?.userId?.firstName}</p>
                  <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                  <p><strong>Treatment Plan:</strong> {record.treatmentPlan}</p>
                  <p><strong>Type:</strong> {record.recordType}</p>
                  {record.followUpDate && (
                    <p><strong>Follow-up Date:</strong> {new Date(record.followUpDate).toLocaleDateString()}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
