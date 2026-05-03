import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { patientService, authService } from '../../services/apiService';

const PatientProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form data for editing
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    allergies: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await patientService.getMyProfile();
      const p = res.data.data;
      setProfile(p);
      setFormData({
        firstName: p.userId?.firstName || '',
        lastName: p.userId?.lastName || '',
        email: p.userId?.email || '',
        phone: p.userId?.phone || '',
        dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split('T')[0] : '',
        gender: p.gender || '',
        bloodGroup: p.bloodGroup || '',
        address: p.address || '',
        city: p.city || '',
        state: p.state || '',
        zipCode: p.zipCode || '',
        allergies: (p.allergies || []).join(', '),
        emergencyContactName: p.emergencyContact?.name || '',
        emergencyContactPhone: p.emergencyContact?.phone || '',
        emergencyContactRelation: p.emergencyContact?.relation || '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Update user info (name, phone)
      await authService.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });

      // Update patient info
      await patientService.updatePatient(profile._id, {
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        allergies: formData.allergies.split(',').map(a => a.trim()).filter(a => a),
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relation: formData.emergencyContactRelation,
        },
      });

      setSuccess('Profile updated successfully!');
      setEditing(false);
      // Re-fetch to get updated data
      await fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setError('');
    setSuccess('');
    // Reset form data to current profile
    if (profile) {
      setFormData({
        firstName: profile.userId?.firstName || '',
        lastName: profile.userId?.lastName || '',
        email: profile.userId?.email || '',
        phone: profile.userId?.phone || '',
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        gender: profile.gender || '',
        bloodGroup: profile.bloodGroup || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        zipCode: profile.zipCode || '',
        allergies: (profile.allergies || []).join(', '),
        emergencyContactName: profile.emergencyContact?.name || '',
        emergencyContactPhone: profile.emergencyContact?.phone || '',
        emergencyContactRelation: profile.emergencyContact?.relation || '',
      });
    }
  };

  if (loading) return <LoadingSpinner />;

  // --- Styles ---
  const pageStyle = {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  };

  const contentStyle = {
    flex: 1,
    padding: '30px',
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  };

  const headerRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  };

  const fieldLabelStyle = {
    fontSize: '12px',
    color: '#667eea',
    fontWeight: '600',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const fieldValueStyle = {
    fontSize: '15px',
    color: '#333',
    fontWeight: '500',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#333',
    boxSizing: 'border-box',
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: 'white',
  };

  const sectionTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '2px solid #f0f0f0',
    marginTop: '30px',
  };

  const btnPrimaryStyle = {
    padding: '10px 25px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  };

  const btnSecondaryStyle = {
    padding: '10px 25px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    marginRight: '10px',
  };

  const btnSuccessStyle = {
    padding: '10px 25px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  };

  // --- Render Field (view vs edit) ---
  const renderField = (label, name, type = 'text') => (
    <div>
      <div style={fieldLabelStyle}>{label}</div>
      {editing ? (
        type === 'select-gender' ? (
          <select name={name} value={formData[name]} onChange={handleChange} style={selectStyle}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        ) : type === 'select-blood' ? (
          <select name={name} value={formData[name]} onChange={handleChange} style={selectStyle}>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            style={inputStyle}
            readOnly={name === 'email'}
          />
        )
      ) : (
        <div style={fieldValueStyle}>{formData[name] || '—'}</div>
      )}
    </div>
  );

  return (
    <div style={pageStyle}>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content" style={contentStyle}>
          <div style={headerRowStyle}>
            <h1 style={{ color: '#333', margin: 0 }}>My Profile</h1>
            {!editing ? (
              <button style={btnPrimaryStyle} onClick={() => setEditing(true)}>
                ✏️ Edit Profile
              </button>
            ) : (
              <div>
                <button style={btnSecondaryStyle} onClick={handleCancel}>
                  Cancel
                </button>
                <button style={btnSuccessStyle} onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : '💾 Save Changes'}
                </button>
              </div>
            )}
          </div>

          <Alert type="error" message={error} />
          {success && <Alert type="success" message={success} />}

          {profile ? (
            <>
              {/* Personal Information */}
              <div style={cardStyle}>
                <h3 style={{ ...sectionTitleStyle, marginTop: 0 }}>👤 Personal Information</h3>
                <div style={gridStyle}>
                  {renderField('First Name', 'firstName')}
                  {renderField('Last Name', 'lastName')}
                  {renderField('Email', 'email', 'email')}
                  {renderField('Phone', 'phone', 'tel')}
                </div>
              </div>

              {/* Health Information */}
              <div style={cardStyle}>
                <h3 style={{ ...sectionTitleStyle, marginTop: 0 }}>🩺 Health Information</h3>
                <div style={gridStyle}>
                  {renderField('Date of Birth', 'dateOfBirth', 'date')}
                  {renderField('Gender', 'gender', 'select-gender')}
                  {renderField('Blood Group', 'bloodGroup', 'select-blood')}
                </div>
              </div>

              {/* Address */}
              <div style={cardStyle}>
                <h3 style={{ ...sectionTitleStyle, marginTop: 0 }}>📍 Address</h3>
                <div style={gridStyle}>
                  {renderField('Address', 'address')}
                  {renderField('City', 'city')}
                  {renderField('State', 'state')}
                  {renderField('Zip Code', 'zipCode')}
                </div>
              </div>

              {/* Allergies */}
              <div style={cardStyle}>
                <h3 style={{ ...sectionTitleStyle, marginTop: 0 }}>⚠️ Allergies</h3>
                {editing ? (
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="Comma separated, e.g. Penicillin, Pollen"
                    style={inputStyle}
                  />
                ) : (
                  <div style={fieldValueStyle}>
                    {profile.allergies && profile.allergies.length > 0
                      ? profile.allergies.join(', ')
                      : 'None reported'}
                  </div>
                )}
              </div>

              {/* Emergency Contact */}
              <div style={cardStyle}>
                <h3 style={{ ...sectionTitleStyle, marginTop: 0 }}>🚨 Emergency Contact</h3>
                <div style={gridStyle}>
                  {renderField('Name', 'emergencyContactName')}
                  {renderField('Phone', 'emergencyContactPhone', 'tel')}
                  {renderField('Relation', 'emergencyContactRelation')}
                </div>
              </div>
            </>
          ) : (
            <div style={cardStyle}>
              <p style={{ color: '#666' }}>Profile not found. Please complete your profile first.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
