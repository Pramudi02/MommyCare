import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Save, 
  X,
  Heart
} from 'lucide-react';
import { midwifeAPI } from '../../services/api';
import './EditProfile.css';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
    experience: '',
    phmArea: '',
    mohArea: '',
    certifications: ''
  });

  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Load existing profile data
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      setMessage({ type: '', text: '' });
      
      console.log('🔄 Loading midwife profile...');
      const response = await midwifeAPI.getProfile();
      console.log('📡 API Response:', response);
      
      if (response.status === 'success') {
        const profile = response.data;
        console.log('👤 Profile data received:', profile);
        
        setFormData({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
          licenseNumber: profile.licenseNumber || '',
          experience: profile.experience || '',
          phmArea: profile.phmArea || '',
          mohArea: profile.mohArea || '',
          certifications: profile.certifications || ''
        });
        setOriginalData(profile);
        console.log('✅ Form data set:', formData);
      } else {
        console.error('❌ API returned error status:', response);
        setMessage({ type: 'error', text: 'Failed to load profile data' });
      }
    } catch (error) {
      console.error('❌ Error loading profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('💾 Saving profile data:', formData);
      const response = await midwifeAPI.updateProfile(formData);
      console.log('📡 Save response:', response);
      
      if (response.status === 'success') {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setOriginalData(response.data);
        setIsEditing(false);
        console.log('✅ Profile saved successfully');
      } else {
        console.error('❌ Save failed:', response);
        setMessage({ type: 'error', text: response.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(originalData); // Reset to original data
    setMessage({ type: '', text: '' });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage({ type: '', text: '' });
  };

  if (isLoading) {
    return (
      <div className="midwife-profile-page">
        <div className="midwife-profile-container-wrapper">
          <div className="midwife-profile-header">
            <div className="midwife-profile-header-icon">
              <Heart />
            </div>
            <div className="midwife-profile-title">
              <h1>Edit Profile</h1>
              <p>Update your professional information and personal details</p>
            </div>
          </div>
          <div className="midwife-profile-container">
            <div className="midwife-profile-main">
              <div className="midwife-profile-section">
                <div className="loading-message">Loading profile data...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="midwife-profile-page">
      <div className="midwife-profile-container-wrapper">
        <div className="midwife-profile-header">
          <div className="midwife-profile-header-icon">
            <Heart />
          </div>
          <div className="midwife-profile-title">
            <h1>Edit Profile</h1>
            <p>Update your professional information and personal details</p>
          </div>
        </div>

        <div className="midwife-profile-container">
          <div className="midwife-profile-main">
            {/* Profile Actions */}
            <div className="midwife-profile-section">
              <div className="midwife-profile-actions">
                {!isEditing ? (
                  <button 
                    className="midwife-btn midwife-btn-primary"
                    onClick={handleEdit}
                  >
                    <User />
                    Edit Profile
                  </button>
                ) : (
                  <div className="midwife-edit-actions">
                    <button 
                      className="midwife-btn midwife-btn-secondary"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      <X />
                      Cancel
                    </button>
                    <button 
                      className="midwife-btn midwife-btn-primary"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      <Save />
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Success/Error Messages */}
            {message.text && (
              <div className={`midwife-message midwife-message--${message.type}`}>
                {message.type === 'success' ? (
                  <div className="midwife-message__icon">✓</div>
                ) : (
                  <div className="midwife-message__icon">⚠</div>
                )}
                <span>{message.text}</span>
              </div>
            )}





            {/* Personal Information */}
            <div className="midwife-profile-section">
              <h3>
                <User />
                Personal Information
              </h3>
            
              <div className="midwife-info-grid">
                <div className="midwife-info-item">
                  <label className="midwife-info-label">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="midwife-input"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.firstName || 'Not provided'}</span>
                  )}
                </div>

                <div className="midwife-info-item">
                  <label className="midwife-info-label">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="midwife-input"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.lastName || 'Not provided'}</span>
                  )}
                </div>

                <div className="midwife-info-item">
                  <label className="midwife-info-label">
                    <Mail className="midwife-info-icon" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="midwife-input"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.email || 'Not provided'}</span>
                  )}
                </div>
              </div>

              <div className="midwife-info-grid">
                <div className="midwife-info-item">
                  <label className="midwife-info-label">
                    <Phone className="midwife-info-icon" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="midwife-input"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.phone || 'Not provided'}</span>
                  )}
                </div>

                <div className="midwife-info-item">
                  <label className="midwife-info-label">
                    <MapPin className="midwife-info-icon" />
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="midwife-input"
                      placeholder="Enter your full address"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.address || 'Not provided'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="midwife-profile-section">
              <div className="midwife-section-header">
                <h3>
                  <GraduationCap className="midwife-section-icon" />
                  Professional Information
                </h3>
              </div>
              
              <div className="midwife-info-grid">
                <div className="midwife-info-item">
                  <label className="midwife-info-label">License Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="midwife-input"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.licenseNumber || 'Not provided'}</span>
                  )}
                </div>

                <div className="midwife-info-item">
                  <label className="midwife-info-label">Years of Experience</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="midwife-input"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.experience || 'Not provided'}</span>
                  )}
                </div>

                <div className="midwife-info-item">
                  <label className="midwife-info-label">PHM Area</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phmArea"
                      value={formData.phmArea}
                      onChange={handleInputChange}
                      className="midwife-input"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.phmArea || 'Not provided'}</span>
                  )}
                </div>
              </div>

              <div className="midwife-info-grid">
                <div className="midwife-info-item">
                  <label className="midwife-info-label">MOH Office</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="mohArea"
                      value={formData.mohArea}
                      onChange={handleInputChange}
                      className="midwife-input"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.mohArea || 'Not provided'}</span>
                  )}
                </div>

                <div className="midwife-info-item">
                  <label className="midwife-info-label">Certifications</label>
                  {isEditing ? (
                    <textarea
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleInputChange}
                      className="midwife-textarea"
                      rows="3"
                    />
                  ) : (
                    <p className="midwife-info-description">{formData.certifications || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
