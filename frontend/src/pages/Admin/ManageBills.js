import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { billService } from '../../services/apiService';

const ManageBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('All');
  const [receiptModal, setReceiptModal] = useState(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await billService.getAllBills();
      setBills(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (billId, action) => {
    try {
      setError('');
      await billService.verifyPayment(billId, { action });
      setSuccess(`Payment ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      fetchBills();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} payment`);
    }
  };

  const filteredBills = filter === 'All'
    ? bills
    : bills.filter((b) => b.paymentStatus === filter);

  const getStatusBadge = (status) => {
    const map = {
      'Paid': 'badge-success',
      'Unpaid': 'badge-danger',
      'Partial': 'badge-warning',
      'Pending Verification': 'badge-info',
    };
    return map[status] || 'badge-primary';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1 }}>
          <h1>Manage Bills</h1>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {['All', 'Pending Verification', 'Paid', 'Unpaid', 'Partial'].map((f) => (
              <button
                key={f}
                className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(f)}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                {f}
                {f === 'Pending Verification' && (
                  <span style={{
                    marginLeft: '6px',
                    background: 'rgba(255,255,255,0.3)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '11px',
                  }}>
                    {bills.filter(b => b.paymentStatus === 'Pending Verification').length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {filteredBills.length === 0 ? (
            <div className="card">
              <p>No bills found.</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Bill Number</th>
                  <th>Patient</th>
                  <th>Services</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Receipt</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill) => (
                  <tr key={bill._id}>
                    <td><strong>{bill.billNumber}</strong></td>
                    <td>{bill.patientId?.userId?.firstName} {bill.patientId?.userId?.lastName}</td>
                    <td>
                      <div style={{ maxWidth: '200px' }}>
                        {bill.items.map((item, idx) => (
                          <div key={idx} style={{ fontSize: '12px', color: '#64748b' }}>
                            {item.description} × {item.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td><strong>${bill.totalAmount?.toFixed(2)}</strong></td>
                    <td>${bill.paidAmount?.toFixed(2)}</td>
                    <td>{bill.paymentMethod || '—'}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(bill.paymentStatus)}`}>
                        {bill.paymentStatus}
                      </span>
                    </td>
                    <td>
                      {bill.paymentReceipt ? (
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => setReceiptModal(bill.paymentReceipt)}
                        >
                          📄 View
                        </button>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>None</span>
                      )}
                    </td>
                    <td>
                      {bill.paymentStatus === 'Pending Verification' && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="btn btn-success"
                            style={{ padding: '6px 14px', fontSize: '12px' }}
                            onClick={() => handleVerify(bill._id, 'approve')}
                          >
                            ✓ Approve
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '6px 14px', fontSize: '12px' }}
                            onClick={() => handleVerify(bill._id, 'reject')}
                          >
                            ✕ Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Receipt Modal */}
          {receiptModal && (
            <div
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
              }}
              onClick={() => setReceiptModal(null)}
            >
              <div
                style={{
                  background: 'white', borderRadius: '16px', padding: '24px',
                  maxWidth: '600px', maxHeight: '80vh', overflow: 'auto', position: 'relative',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{ marginBottom: '16px' }}>Payment Receipt</h3>
                <img
                  src={receiptModal}
                  alt="Payment receipt"
                  style={{ width: '100%', borderRadius: '8px' }}
                />
                <button
                  className="btn btn-secondary"
                  style={{ marginTop: '16px', width: '100%' }}
                  onClick={() => setReceiptModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBills;
