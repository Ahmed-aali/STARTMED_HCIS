import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { billService } from '../../services/apiService';
import './ServicePayment.css';

const ServicePayment = () => {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [step, setStep] = useState(1); // 1=browse, 2=checkout, 3=done
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [allServices, setAllServices] = useState([]);

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      const res = await billService.getServiceCatalog();
      setAllServices(res.data.data.services);
      setCategories(res.data.data.categories);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (service) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === service.id);
      if (exists) return prev;
      return [...prev, { ...service, quantity: 1 }];
    });
  };

  const removeFromCart = (serviceId) => {
    setCart((prev) => prev.filter((item) => item.id !== serviceId));
  };



  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + tax;

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Receipt file must be under 5MB');
        return;
      }
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setReceiptPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (cart.length === 0) {
      setError('Please select at least one service');
      return;
    }
    if (!receiptFile) {
      setError('Please upload your payment receipt');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const selectedServices = cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }));

      await billService.submitServicePayment({
        selectedServices,
        paymentReceipt: receiptPreview, // base64
        paymentMethod,
        notes,
      });

      setSuccess('Payment submitted successfully! The admin will verify your payment shortly.');
      setStep(3);
      setCart([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit payment');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredServices =
    activeCategory === 'All'
      ? allServices
      : allServices.filter((s) => s.category === activeCategory);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1 }}>
          <div className="sp-header">
            <h1>Services & Payment</h1>
            <p className="sp-subtitle">Choose your medical services, pay, and upload your receipt</p>
          </div>

          <Alert type="error" message={error} />
          <Alert type="success" message={success} />

          {/* Step indicator */}
          <div className="sp-steps">
            <div className={`sp-step ${step >= 1 ? 'active' : ''}`}>
              <div className="sp-step-number">1</div>
              <span>Select Services</span>
            </div>
            <div className="sp-step-line" />
            <div className={`sp-step ${step >= 2 ? 'active' : ''}`}>
              <div className="sp-step-number">2</div>
              <span>Payment & Upload</span>
            </div>
            <div className="sp-step-line" />
            <div className={`sp-step ${step >= 3 ? 'active' : ''}`}>
              <div className="sp-step-number">3</div>
              <span>Confirmation</span>
            </div>
          </div>

          {/* ===================== STEP 1: Browse Services ===================== */}
          {step === 1 && (
            <div className="sp-layout">
              <div className="sp-catalog">
                {/* Category Tabs */}
                <div className="sp-category-tabs">
                  <button
                    className={`sp-tab ${activeCategory === 'All' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('All')}
                  >
                    All
                  </button>
                  {Object.keys(categories).map((cat) => (
                    <button
                      key={cat}
                      className={`sp-tab ${activeCategory === cat ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Service Cards */}
                <div className="sp-services-grid">
                  {filteredServices.map((service) => {
                    const inCart = cart.find((c) => c.id === service.id);
                    return (
                      <div key={service.id} className={`sp-service-card ${inCart ? 'in-cart' : ''}`}>
                        <div className="sp-service-icon">{service.icon}</div>
                        <div className="sp-service-info">
                          <h4>{service.name}</h4>
                          <p className="sp-service-desc">{service.description}</p>
                          <span className="sp-service-category">{service.category}</span>
                        </div>
                        <div className="sp-service-price">${service.price}</div>
                        <button
                          className={`btn ${inCart ? 'btn-success' : 'btn-primary'} sp-add-btn`}
                          onClick={() => addToCart(service)}
                          disabled={!!inCart}
                        >
                          {inCart ? 'Added' : 'Add'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cart sidebar */}
              <div className="sp-cart">
                <div className="sp-cart-header">
                  <h3>🛒 Your Cart</h3>
                  <span className="sp-cart-count">{cart.length} items</span>
                </div>

                {cart.length === 0 ? (
                  <div className="sp-cart-empty">
                    <span>🏥</span>
                    <p>Select services to get started</p>
                  </div>
                ) : (
                  <>
                    <div className="sp-cart-items">
                      {cart.map((item) => (
                        <div key={item.id} className="sp-cart-item">
                          <div className="sp-cart-item-info">
                            <span className="sp-cart-item-icon">{item.icon}</span>
                            <div>
                              <h5>{item.name}</h5>
                            </div>
                          </div>
                          <div className="sp-cart-item-total">${item.price}</div>
                          <button className="sp-cart-remove" onClick={() => removeFromCart(item.id)}>✕</button>
                        </div>
                      ))}
                    </div>
                    <div className="sp-cart-summary">
                      <div className="sp-summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                      <div className="sp-summary-row"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
                      <div className="sp-summary-row sp-summary-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
                    </div>
                    <button className="btn btn-primary sp-checkout-btn" onClick={() => setStep(2)}>
                      Proceed to Payment →
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ===================== STEP 2: Payment & Upload ===================== */}
          {step === 2 && (
            <div className="sp-payment-layout">
              <div className="sp-payment-form card">
                <h2>Payment Details</h2>

                {/* Order Summary */}
                <div className="sp-order-summary">
                  <h4>Order Summary</h4>
                  {cart.map((item) => (
                    <div key={item.id} className="sp-order-item">
                      <span>{item.icon} {item.name}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="sp-order-divider" />
                  <div className="sp-order-item"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="sp-order-item"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
                  <div className="sp-order-item sp-order-total"><span>Total Due</span><span>${total.toFixed(2)}</span></div>
                </div>

                {/* Payment Method */}
                <div className="form-group">
                  <label>Payment Method</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Receipt Upload */}
                <div className="form-group">
                  <label>Upload Payment Receipt *</label>
                  <div className="sp-upload-area" onClick={() => document.getElementById('receiptInput').click()}>
                    {receiptPreview ? (
                      <img src={receiptPreview} alt="Receipt preview" className="sp-receipt-preview" />
                    ) : (
                      <div className="sp-upload-placeholder">
                        <span className="sp-upload-icon">📤</span>
                        <p>Click to upload your payment receipt</p>
                        <small>PNG, JPG, or PDF — max 5MB</small>
                      </div>
                    )}
                    <input
                      id="receiptInput"
                      type="file"
                      accept="image/*,.pdf"
                      style={{ display: 'none' }}
                      onChange={handleReceiptUpload}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="form-group">
                  <label>Notes (Optional)</label>
                  <textarea
                    placeholder="Any additional notes about your payment..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="3"
                  />
                </div>

                <div className="sp-payment-actions">
                  <button className="btn btn-secondary" onClick={() => setStep(1)}>
                    ← Back to Services
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : `Submit Payment ($${total.toFixed(2)})`}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================== STEP 3: Confirmation ===================== */}
          {step === 3 && (
            <div className="sp-confirmation card">
              <div className="sp-confirm-icon">✅</div>
              <h2>Payment Submitted!</h2>
              <p>Your payment of <strong>${total.toFixed(2)}</strong> has been submitted for verification.</p>
              <p className="sp-confirm-detail">The admin will review your receipt and approve the payment. You can track the status in your <strong>Bills & Payments</strong> section.</p>
              <div className="sp-confirm-actions">
                <button className="btn btn-primary" onClick={() => { setStep(1); setSuccess(''); setReceiptFile(null); setReceiptPreview(null); }}>
                  Book More Services
                </button>
                <button className="btn btn-secondary" onClick={() => window.location.href = '/patient/bills'}>
                  View My Bills
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicePayment;
