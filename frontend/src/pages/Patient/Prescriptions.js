import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { prescriptionService } from '../../services/apiService';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await prescriptionService.getMyPrescriptions();
      setPrescriptions(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load prescriptions');
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
          <h1>Prescriptions</h1>
          <Alert type="error" message={error} />

          {prescriptions.length === 0 ? (
            <div className="card">
              <p>No prescriptions found.</p>
            </div>
          ) : (
            <div>
              {prescriptions.map((prescription) => (
                <div key={prescription._id} className="card">
                  <h3>Prescription from {prescription.doctorId?.userId?.firstName}</h3>
                  <p><strong>Issued Date:</strong> {new Date(prescription.issuedDate).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> <span className={`badge badge-${prescription.status.toLowerCase()}`}>{prescription.status}</span></p>
                  
                  <h4>Medicines:</h4>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Medicine</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescription.medicines.map((medicine, idx) => (
                        <tr key={idx}>
                          <td>{medicine.medicineName}</td>
                          <td>{medicine.dosage}</td>
                          <td>{medicine.frequency}</td>
                          <td>{medicine.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;
