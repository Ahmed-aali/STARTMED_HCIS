import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/apiService';
import Alert from '../../components/Alert';

const PatientRegisterProfile = () => {
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: 'A+',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    allergies: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
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
        allergies: formData.allergies.split(',').map(a => a.trim()).filter(a => a),
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relation: formData.emergencyContactRelation,
        },
      };
      // Remove flat emergency contact fields (they're now nested above)
      delete data.emergencyContactName;
      delete data.emergencyContactPhone;
      delete data.emergencyContactRelation;
      
      await patientService.register(data);
      navigate('/patient');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

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
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
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
          <h1 style={titleStyle}>Complete Your Profile</h1>
          <p style={subtitleStyle}>Please provide your health information</p>
        </div>

        <Alert type="error" message={error} />
        
        <form onSubmit={handleSubmit}>
          <div style={formRowStyle}>
            <div className="form-group">
              <label>Date of Birth *</label>
              <input 
                type="date" 
                name="dateOfBirth" 
                value={formData.dateOfBirth} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Blood Group *</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>
          
          <div style={formRowStyle}>
            <div className="form-group">
              <label>Address *</label>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                placeholder="Street address"
                required 
              />
            </div>
            <div className="form-group">
              <label>City *</label>
              <input 
                type="text" 
                name="city" 
                value={formData.city} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>State *</label>
              <input 
                type="text" 
                name="state" 
                value={formData.state} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Zip Code *</label>
              <input 
                type="text" 
                name="zipCode" 
                value={formData.zipCode} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Allergies (comma separated)</label>
            <input 
              type="text" 
              name="allergies" 
              value={formData.allergies} 
              onChange={handleChange} 
              placeholder="e.g., Penicillin, Pollen, Shellfish" 
            />
          </div>
          
          <h3 style={sectionTitleStyle}>Emergency Contact Information</h3>
          
          <div style={formRowStyle}>
            <div className="form-group">
              <label>Name *</label>
              <input 
                type="text" 
                name="emergencyContactName" 
                value={formData.emergencyContactName} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input 
                type="tel" 
                name="emergencyContactPhone" 
                value={formData.emergencyContactPhone} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Relation *</label>
              <input 
                type="text" 
                name="emergencyContactRelation" 
                value={formData.emergencyContactRelation} 
                onChange={handleChange} 
                placeholder="e.g., Mother, Brother"
                required 
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '30px', padding: '12px' }} 
            disabled={loading}
          >
            {loading ? 'Saving Profile...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientRegisterProfile;