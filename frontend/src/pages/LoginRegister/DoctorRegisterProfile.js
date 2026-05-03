import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/apiService';
import Alert from '../../components/Alert';

const DoctorRegisterProfile = () => {
  const [formData, setFormData] = useState({
    specialization: 'General Practice',
    licenseNumber: '',
    experience: '',
    qualifications: '',
    hospital: '',
    consultationFee: '',
    bio: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        experience: parseInt(formData.experience),
        consultationFee: parseFloat(formData.consultationFee),
        qualifications: formData.qualifications.split(',').map(q => q.trim()).filter(q => q),
      };
      
      await doctorService.register(data);
      navigate('/doctor');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  const specializations = [
    'General Practice',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'Surgery',
    'X-Ray',
    'Dentist',
    'ENT',
    'Neurological',
  ];

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  const cardStyle = {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '700px',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px',
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '8px',
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: '#999',
  };

  const formRowStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  };

  const sectionTitleStyle = {
    marginTop: '30px',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '2px solid #f0f0f0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Complete Your Doctor Profile</h1>
          <p style={subtitleStyle}>Please provide your professional information</p>
        </div>

        <Alert type="error" message={error} />
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Medical Specialization *</label>
            <select 
              name="specialization" 
              value={formData.specialization} 
              onChange={handleChange} 
              required
            >
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
          
          <div style={formRowStyle}>
            <div className="form-group">
              <label>License Number *</label>
              <input 
                type="text" 
                name="licenseNumber" 
                value={formData.licenseNumber} 
                onChange={handleChange} 
                placeholder="Your license number"
                required 
              />
            </div>
            <div className="form-group">
              <label>Years of Experience *</label>
              <input 
                type="number" 
                name="experience" 
                value={formData.experience} 
                onChange={handleChange} 
                required 
                min="0" 
                max="70"
              />
            </div>
            <div className="form-group">
              <label>Hospital/Clinic *</label>
              <input 
                type="text" 
                name="hospital" 
                value={formData.hospital} 
                onChange={handleChange} 
                placeholder="Hospital name"
                required 
              />
            </div>
            <div className="form-group">
              <label>Consultation Fee (₹) *</label>
              <input 
                type="number" 
                name="consultationFee" 
                value={formData.consultationFee} 
                onChange={handleChange} 
                required 
                min="0" 
                step="100"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Qualifications (comma separated) *</label>
            <input 
              type="text" 
              name="qualifications" 
              value={formData.qualifications} 
              onChange={handleChange} 
              placeholder="e.g., MBBS, MD, Board Certified" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Professional Bio</label>
            <textarea 
              name="bio" 
              value={formData.bio} 
              onChange={handleChange} 
              rows="4" 
              placeholder="Tell patients about your experience and expertise..."
              style={{
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                fontSize: '14px',
                resize: 'vertical',
              }}
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '30px', padding: '12px' }} 
            disabled={loading}
          >
            {loading ? 'Saving Profile...' : 'Complete Profile & Start'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegisterProfile;