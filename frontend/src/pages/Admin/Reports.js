import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminService } from '../../services/apiService';

const Reports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await adminService.getReports();
      setReports(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reports');
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
          <h1>System Reports</h1>
          <Alert type="error" message={error} />

          {reports && (
            <>
              <div className="card">
                <h2>Appointments by Status</h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.appointmentsByStatus.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item._id}</td>
                        <td>{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="card">
                <h2>Revenue by Payment Status</h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Total Amount</th>
                      <th>Number of Bills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.revenueByPaymentStatus.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item._id}</td>
                        <td>₹{item.total}</td>
                        <td>{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
