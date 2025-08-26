import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, Award, Save, X } from 'lucide-react';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    experience: '',
    education: '',
    certifications: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bio: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Load existing profile data
    loadProfileData();
  }, []);

  const loadProfileData = () => {
    // Mock data - replace with actual API call
    const mockProfile = {
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 (555) 123-4567',
      specialization: 'Obstetrics & Gynecology',
      licenseNumber: 'MD12345',
      experience: '15 years',
      education: 'Harvard Medical School',
      certifications: 'Board Certified OB/GYN, Fetal Medicine Specialist',
      address: '123 Medical Center Dr',
      city: 'Boston',
      state: 'MA',
      zipCode: '02115',
      bio: 'Experienced obstetrician with expertise in high-risk pregnancies and maternal-fetal medicine.'
    };
    setFormData(mockProfile);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadProfileData(); // Reset to original data
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="doctor-edit-profile-page">
      <div className="doctor-edit-profile-container">
        {/* Header */}
        <div className="doctor-edit-profile-header">
          <div className="doctor-edit-profile-header-icon">
            <User />
          </div>
          <div className="doctor-edit-profile-title">
            <h1>Edit Profile</h1>
            <p>Update your professional information and personal details</p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {message.text && (
          <div className={`doctor-message doctor-message--${message.type}`}>
            {message.type === 'success' ? (
              <div className="doctor-message__icon">✓</div>
            ) : (
              <div className="doctor-message__icon">⚠</div>
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="doctor-profile-form">
          {/* Personal Information Section */}
          <div className="doctor-form-section">
            <h3>
              <User />
              Personal Information
            </h3>
            <div className="doctor-form-row">
              <div className="doctor-form-group">
                <label className="doctor-form-label required">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="doctor-form-input"
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="doctor-form-group">
                <label className="doctor-form-label required">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="doctor-form-input"
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>
            <div className="doctor-form-row">
              <div className="doctor-form-group">
                <label className="doctor-form-label required">Email</label>
                <div className="doctor-input-wrapper">
                  <Mail className="doctor-input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="doctor-form-input"
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>
              <div className="doctor-form-group">
                <label className="doctor-form-label">Phone</label>
                <div className="doctor-input-wrapper">
                  <Phone className="doctor-input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="doctor-form-input"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="doctor-form-section">
            <h3>
              <GraduationCap />
              Professional Information
            </h3>
            <div className="doctor-form-row">
              <div className="doctor-form-group">
                <label className="doctor-form-label required">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="doctor-form-input"
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="doctor-form-group">
                <label className="doctor-form-label required">License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className="doctor-form-input"
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>
            <div className="doctor-form-row">
              <div className="doctor-form-group">
                <label className="doctor-form-label">Years of Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="doctor-form-input"
                  disabled={!isEditing}
                  placeholder="e.g., 15 years"
                />
              </div>
              <div className="doctor-form-group">
                <label className="doctor-form-label">Education</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className="doctor-form-input"
                  disabled={!isEditing}
                  placeholder="e.g., Harvard Medical School"
                />
              </div>
            </div>
            <div className="doctor-form-group full-width">
              <label className="doctor-form-label">Certifications</label>
              <textarea
                name="certifications"
                value={formData.certifications}
                onChange={handleInputChange}
                className="doctor-form-textarea"
                disabled={!isEditing}
                placeholder="List your certifications and specializations"
                rows="3"
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="doctor-form-section">
            <h3>
              <MapPin />
              Address Information
            </h3>
            <div className="doctor-form-group full-width">
              <label className="doctor-form-label">Street Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="doctor-form-input"
                disabled={!isEditing}
              />
            </div>
            <div className="doctor-form-row">
              <div className="doctor-form-group">
                <label className="doctor-form-label">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="doctor-form-input"
                  disabled={!isEditing}
                />
              </div>
              <div className="doctor-form-group">
                <label className="doctor-form-label">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="doctor-form-input"
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="doctor-form-group">
              <label className="doctor-form-label">ZIP Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="doctor-form-input"
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Bio Section */}
          <div className="doctor-form-section">
            <h3>
              <Award />
              Professional Bio
            </h3>
            <div className="doctor-form-group full-width">
              <label className="doctor-form-label">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="doctor-form-textarea"
                disabled={!isEditing}
                placeholder="Tell patients about your expertise and approach to care..."
                rows="5"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="doctor-form-actions">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="doctor-btn doctor-btn-primary"
              >
                <User />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="doctor-btn doctor-btn-primary"
                >
                  {isSubmitting ? (
                    <div className="doctor-loading"></div>
                  ) : (
                    <Save />
                  )}
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="doctor-btn doctor-btn-secondary"
                >
                  <X />
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
