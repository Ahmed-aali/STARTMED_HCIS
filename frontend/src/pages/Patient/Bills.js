import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { billService } from '../../services/apiService';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await billService.getMyBills();
      setBills(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (billId, amount) => {
    try {
      await billService.recordPayment(billId, { paidAmount: amount });
      setSuccess('Payment recorded successfully!');
      fetchBills();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record payment');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1 }}>
          <h1>Bills</h1>
          <Alert type="error" message={error} />
          <Alert type="success" message={success} />

          {bills.length === 0 ? (
            <div className="card">
              <p>No bills found.</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Bill Number</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Remaining</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill._id}>
                    <td>{bill.billNumber}</td>
                    <td>₹{bill.totalAmount}</td>
                    <td>₹{bill.paidAmount}</td>
                    <td>₹{bill.remainingAmount}</td>
                    <td>
                      <span className={`badge badge-${bill.paymentStatus.toLowerCase()}`}>
                        {bill.paymentStatus}
                      </span>
                    </td>
                    <td>
                      {bill.remainingAmount > 0 && (
                        <button
                          className="btn btn-success"
                          onClick={() => {
                            const amount = prompt('Enter payment amount:');
                            if (amount) handlePayment(bill._id, parseFloat(amount));
                          }}
                        >
                          Pay
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bills;
