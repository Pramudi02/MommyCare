import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, Award, Save, X, Heart, BarChart3, CheckCircle } from 'lucide-react';
import './EditProfile.css';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    experience: '',
    education: '',
    certifications: '',
    specializations: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bio: '',
    languages: '',
    availability: ''
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
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@example.com',
      phone: '+1 (555) 987-6543',
      licenseNumber: 'CNM12345',
      experience: '12 years',
      education: 'Yale School of Nursing',
      certifications: 'Certified Nurse Midwife, Lactation Consultant, Neonatal Resuscitation',
      specializations: 'Natural Birth, High-Risk Pregnancy, Postpartum Care',
      address: '456 Midwife Center Blvd',
      city: 'New Haven',
      state: 'CT',
      zipCode: '06510',
      bio: 'Passionate certified nurse midwife with expertise in natural childbirth and comprehensive maternal care.',
      languages: 'English, Spanish',
      availability: 'Monday-Friday, 8AM-6PM, Emergency on-call 24/7'
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
    <div className="midwife-edit-profile-page">
      <div className="midwife-edit-profile-container-wrapper">
        {/* Header */}
        <div className="midwife-edit-profile-header">
          <div className="midwife-edit-profile-header-icon">
            <Heart />
          </div>
          <div className="midwife-edit-profile-title">
            <h1>Edit Profile</h1>
            <p>Update your professional information and personal details</p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {message.text && (
          <div className={`midwife-${message.type === 'success' ? 'success' : 'error'}-message`}>
            {message.type === 'success' ? (
              <CheckCircle />
            ) : (
              <X />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="midwife-edit-profile-container">
          {/* Main Content */}
          <div className="midwife-edit-profile-main">
            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="midwife-edit-profile-form">
              {/* Personal Information Section */}
              <div className="midwife-edit-profile-section">
                <h3>
                  <User />
                  Personal Information
                </h3>
                <div className="midwife-edit-profile-info-grid">
                  <div className="midwife-info-item">
                    <label className="midwife-form-label required">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="midwife-form-input"
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="midwife-info-item">
                    <label className="midwife-form-label required">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="midwife-form-input"
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="midwife-info-item">
                    <label className="midwife-form-label required">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="midwife-form-input"
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="midwife-info-item">
                    <label className="midwife-form-label">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="midwife-form-input"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div className="midwife-edit-profile-section">
                <h3>
                  <GraduationCap />
                  Professional Information
                </h3>
                <div className="midwife-edit-profile-info-grid">
                  <div className="midwife-info-item">
                    <label className="midwife-form-label required">License Number</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="midwife-form-input"
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className="midwife-info-item">
                    <label className="midwife-form-label">Years of Experience</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="midwife-form-input"
                      disabled={!isEditing}
                      placeholder="e.g., 12 years"
                    />
                  </div>
                  <div className="midwife-info-item">
                    <label className="midwife-form-label">Education</label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className="midwife-form-input"
                      disabled={!isEditing}
                      placeholder="e.g., Yale School of Nursing"
                    />
                  </div>
                  <div className="midwife-info-item">
                    <label className="midwife-form-label">Languages</label>
                    <input
                      type="text"
                      name="languages"
                      value={formData.languages}
                      onChange={handleInputChange}
                      className="midwife-form-input"
                      disabled={!isEditing}
                      placeholder="e.g., English, Spanish"
                    />
                  </div>
                  <div className="midwife-info-item full-width">
                    <label className="midwife-form-label">Certifications</label>
                    <textarea
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleInputChange}
                      className="midwife-form-textarea"
                      disabled={!isEditing}
                      placeholder="List your certifications and qualifications"
                      rows="3"
                    />
                  </div>
                  <div className="midwife-info-item full-width">
                    <label className="midwife-form-label">Specializations</label>
                    <textarea
                      name="specializations"
                      value={formData.specializations}
                      onChange={handleInputChange}
                      className="midwife-form-textarea"
                      disabled={!isEditing}
                      placeholder="List your areas of expertise"
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="midwife-edit-profile-section">
                <h3>
                  <MapPin />
                  Address Information
                </h3>
                <div className="midwife-edit-profile-info-grid">
                  <div className="midwife-info-item full-width">
                    <label className="midwife-form-label">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="midwife-form-input"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="midwife-info-item">
                    <label className="midwife-form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="midwife-form-input"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="midwife-info-item">
                    <label className="midwife-form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="midwife-form-input"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="midwife-info-item">
                    <label className="midwife-form-label">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="midwife-form-input"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {/* Availability Section */}
              <div className="midwife-edit-profile-section">
                <h3>
                  <Calendar />
                  Availability
                </h3>
                <div className="midwife-info-item full-width">
                  <label className="midwife-form-label">Availability</label>
                  <textarea
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="midwife-form-textarea"
                    disabled={!isEditing}
                    placeholder="Describe your working hours and availability..."
                    rows="3"
                  />
                </div>
              </div>

              {/* Bio Section */}
              <div className="midwife-edit-profile-section">
                <h3>
                  <Award />
                  Professional Bio
                </h3>
                <div className="midwife-info-item full-width">
                  <label className="midwife-form-label">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="midwife-form-textarea"
                    disabled={!isEditing}
                    placeholder="Tell families about your approach to midwifery care..."
                    rows="5"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="midwife-edit-profile-actions">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="midwife-btn midwife-btn-primary"
                  >
                    <User />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="midwife-btn midwife-btn-primary"
                    >
                      {isSubmitting ? (
                        <div className="midwife-loading"></div>
                      ) : (
                        <Save />
                      )}
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="midwife-btn midwife-btn-secondary"
                    >
                      <X />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="midwife-edit-profile-sidebar">
            {/* Business Stats */}
            <div className="midwife-sidebar-card">
              <div className="midwife-sidebar-card-header">
                <h4>
                  <BarChart3 />
                  Practice Stats
                </h4>
              </div>
              <div className="midwife-sidebar-card-body">
                <div className="midwife-stats-grid">
                  <div className="midwife-stat-item">
                    <div className="midwife-stat-value">12+</div>
                    <div className="midwife-stat-label">Years Experience</div>
                  </div>
                  <div className="midwife-stat-item">
                    <div className="midwife-stat-value">300+</div>
                    <div className="midwife-stat-label">Births Assisted</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="midwife-sidebar-card">
              <div className="midwife-sidebar-card-header">
                <h4>
                  <Award />
                  Specializations
                </h4>
              </div>
              <div className="midwife-sidebar-card-body">
                <div className="midwife-specialties-list">
                  <span className="midwife-specialty-tag">Natural Birth</span>
                  <span className="midwife-specialty-tag">High-Risk Pregnancy</span>
                  <span className="midwife-specialty-tag">Postpartum Care</span>
                  <span className="midwife-specialty-tag">Lactation Support</span>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="midwife-sidebar-card">
              <div className="midwife-sidebar-card-header">
                <h4>
                  <GraduationCap />
                  Certifications
                </h4>
              </div>
              <div className="midwife-sidebar-card-body">
                <div className="midwife-certifications-list">
                  <div className="midwife-certification-item">
                    <div className="midwife-certification-icon">
                      <CheckCircle />
                    </div>
                    <div className="midwife-certification-info">
                      <div className="midwife-certification-name">Certified Nurse Midwife</div>
                      <div className="midwife-certification-date">2012 - Present</div>
                    </div>
                  </div>
                  <div className="midwife-certification-item">
                    <div className="midwife-certification-icon">
                      <CheckCircle />
                    </div>
                    <div className="midwife-certification-info">
                      <div className="midwife-certification-name">Lactation Consultant</div>
                      <div className="midwife-certification-date">2014 - Present</div>
                    </div>
                  </div>
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
