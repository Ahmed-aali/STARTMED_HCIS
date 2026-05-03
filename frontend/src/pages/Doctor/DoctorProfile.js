import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Alert from '../../components/Alert';
import LoadingSpinner from '../../components/LoadingSpinner';
import { doctorService, authService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

const DoctorProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    experience: '',
    hospital: '',
    consultationFee: '',
    qualifications: '',
    bio: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await doctorService.getMyProfile();
      const p = res.data.data;
      setProfile(p);
      setFormData({
        firstName: p.userId?.firstName || '',
        lastName: p.userId?.lastName || '',
        email: p.userId?.email || '',
        phone: p.userId?.phone || '',
        specialization: p.specialization || '',
        licenseNumber: p.licenseNumber || '',
        experience: p.experience || '',
        hospital: p.hospital || '',
        consultationFee: p.consultationFee || '',
        qualifications: (p.qualifications || []).join(', '),
        bio: p.bio || '',
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
      await authService.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });

      await doctorService.updateDoctor(profile._id, {
        specialization: formData.specialization,
        licenseNumber: formData.licenseNumber,
        experience: parseInt(formData.experience),
        hospital: formData.hospital,
        consultationFee: parseFloat(formData.consultationFee),
        qualifications: formData.qualifications.split(',').map((q) => q.trim()).filter((q) => q),
        bio: formData.bio,
      });

      setSuccess('Profile updated successfully!');
      setEditing(false);
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
    if (profile) {
      setFormData({
        firstName: profile.userId?.firstName || '',
        lastName: profile.userId?.lastName || '',
        email: profile.userId?.email || '',
        phone: profile.userId?.phone || '',
        specialization: profile.specialization || '',
        licenseNumber: profile.licenseNumber || '',
        experience: profile.experience || '',
        hospital: profile.hospital || '',
        consultationFee: profile.consultationFee || '',
        qualifications: (profile.qualifications || []).join(', '),
        bio: profile.bio || '',
      });
    }
  };

  if (loading) return <LoadingSpinner />;

  const cardStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
    marginBottom: '20px',
    border: '1px solid rgba(0, 0, 0, 0.04)',
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
    color: '#334155',
    fontWeight: '500',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#334155',
    boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif",
  };

  const sectionTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '2px solid #f1f5f9',
    marginTop: '0',
  };

  const renderField = (label, name, type = 'text') => (
    <div>
      <div style={fieldLabelStyle}>{label}</div>
      {editing ? (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          style={inputStyle}
          readOnly={name === 'email'}
        />
      ) : (
        <div style={fieldValueStyle}>{formData[name] || '—'}</div>
      )}
    </div>
  );

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1, padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <h1 style={{ color: '#1a1a2e', margin: 0 }}>My Profile</h1>
            {!editing ? (
              <button className="btn btn-primary" onClick={() => setEditing(true)}>
                ✏️ Edit Profile
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                <button className="btn btn-success" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : '💾 Save Changes'}
                </button>
              </div>
            )}
          </div>

          <Alert type="error" message={error} />
          {success && <Alert type="success" message={success} />}

          {profile ? (
            <>
              <div style={cardStyle}>
                <h3 style={sectionTitleStyle}>👤 Personal Information</h3>
                <div style={gridStyle}>
                  {renderField('First Name', 'firstName')}
                  {renderField('Last Name', 'lastName')}
                  {renderField('Email', 'email', 'email')}
                  {renderField('Phone', 'phone', 'tel')}
                </div>
              </div>

              <div style={cardStyle}>
                <h3 style={sectionTitleStyle}>🩺 Professional Information</h3>
                <div style={gridStyle}>
                  {renderField('Specialization', 'specialization')}
                  {renderField('License Number', 'licenseNumber')}
                  {renderField('Experience (Years)', 'experience', 'number')}
                  {renderField('Hospital', 'hospital')}
                  {renderField('Consultation Fee ($)', 'consultationFee', 'number')}
                </div>
              </div>

              <div style={cardStyle}>
                <h3 style={sectionTitleStyle}>🎓 Qualifications</h3>
                {editing ? (
                  <input
                    type="text"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    placeholder="Comma separated, e.g. MD, Board Certified"
                    style={inputStyle}
                  />
                ) : (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {profile.qualifications && profile.qualifications.length > 0 ? (
                      profile.qualifications.map((qual, idx) => (
                        <span
                          key={idx}
                          className="badge badge-primary"
                        >
                          {qual}
                        </span>
                      ))
                    ) : (
                      <span style={fieldValueStyle}>None listed</span>
                    )}
                  </div>
                )}
              </div>

              <div style={cardStyle}>
                <h3 style={sectionTitleStyle}>📝 Bio</h3>
                {editing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell patients about your experience..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                ) : (
                  <div style={fieldValueStyle}>{profile.bio || 'No bio provided'}</div>
                )}
              </div>
            </>
          ) : (
            <div style={cardStyle}>
              <p style={{ color: '#64748b' }}>Profile not found. Please complete your profile first.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
