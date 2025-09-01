import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Save, 
  X,
  Heart,
  Building,
  Award,
  Calendar,
  Users,
  Star,
  Plus,
  Trash2
} from 'lucide-react';
import { doctorAPI } from '../../services/api';
import './EditProfile.css';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    hospitalInformation: {
      hospitalName: '',
      hospitalAddress: '',
      hospitalPhone: '',
      hospitalEmail: ''
    },
    professionalInformation: {
      specialization: [],
      medicalRegistrationNumber: '',
      licenseNumber: '',
      yearsOfExperience: '',
      education: '',
      certifications: []
    },
    locationDetails: {
      streetAddress: '',
      city: '',
      stateProvince: '',
      country: '',
      zipPostalCode: ''
    },
    businessStats: {
      yearsExperience: 0,
      patientsServed: 0
    }
  });

  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newCertification, setNewCertification] = useState('');
  const [permissionRequests, setPermissionRequests] = useState([]);
  const [permissionRequestsLoading, setPermissionRequestsLoading] = useState(false);

  const specializationOptions = [
    'Obstetrics & Gynecology',
    'Cardiology',
    'Pediatrics',
    'Radiology',
    'Dental Health',
    'General Medicine',
    'Surgery',
    'Psychiatry',
    'Neurology',
    'Oncology',
    'Emergency Medicine',
    'Family Medicine',
    'Internal Medicine',
    'Dermatology',
    'Orthopedics',
    'Anesthesiology',
    'Pathology',
    'Other'
  ];

  const experienceOptions = [
    'Less than 1 year',
    '1-2 years',
    '3-5 years',
    '6-10 years',
    '11-15 years',
    '16-20 years',
    '21-25 years',
    '26-30 years',
    'More than 30 years'
  ];

  useEffect(() => {
    loadProfileData();
    loadPermissionRequests();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      setMessage({ type: '', text: '' });
      
      console.log('🔄 Loading doctor profile...');
      const response = await doctorAPI.getProfile();
      console.log('📡 API Response:', response);
      
      if (response.status === 'success') {
        const profile = response.data;
        console.log('👤 Profile data received:', profile);
        
        setFormData({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          phone: profile.phone || '',
          age: profile.age || '',
          hospitalInformation: {
            hospitalName: profile.hospitalInformation?.hospitalName || '',
            hospitalAddress: profile.hospitalInformation?.hospitalAddress || '',
            hospitalPhone: profile.hospitalInformation?.hospitalPhone || '',
            hospitalEmail: profile.hospitalInformation?.hospitalEmail || ''
          },
          professionalInformation: {
            specialization: profile.professionalInformation?.specialization || [],
            medicalRegistrationNumber: profile.professionalInformation?.medicalRegistrationNumber || '',
            licenseNumber: profile.professionalInformation?.licenseNumber || '',
            yearsOfExperience: profile.professionalInformation?.yearsOfExperience || '',
            education: profile.professionalInformation?.education || '',
            certifications: profile.professionalInformation?.certifications || []
          },
          locationDetails: {
            streetAddress: profile.locationDetails?.streetAddress || '',
            city: profile.locationDetails?.city || '',
            stateProvince: profile.locationDetails?.stateProvince || '',
            country: profile.locationDetails?.country || '',
            zipPostalCode: profile.locationDetails?.zipPostalCode || ''
          },
          businessStats: {
            yearsExperience: profile.businessStats?.yearsExperience || 0,
            patientsServed: profile.businessStats?.patientsServed || 0
          }
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

  const loadPermissionRequests = async () => {
    try {
      setPermissionRequestsLoading(true);
      console.log('🔄 Loading permission requests...');
      const response = await doctorAPI.getPermissionRequests();
      console.log('📡 Permission requests response:', response);
      
      if (response.status === 'success') {
        setPermissionRequests(response.data || []);
        console.log('✅ Permission requests loaded:', response.data);
      } else {
        console.error('❌ Failed to load permission requests:', response);
      }
    } catch (error) {
      console.error('❌ Error loading permission requests:', error);
    } finally {
      setPermissionRequestsLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'info';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSpecializationChange = (specialization) => {
    setFormData(prev => ({
      ...prev,
      professionalInformation: {
        ...prev.professionalInformation,
        specialization: prev.professionalInformation.specialization.includes(specialization)
          ? prev.professionalInformation.specialization.filter(s => s !== specialization)
          : [...prev.professionalInformation.specialization, specialization]
      }
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData(prev => ({
        ...prev,
        professionalInformation: {
          ...prev.professionalInformation,
          certifications: [...prev.professionalInformation.certifications, newCertification.trim()]
        }
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      professionalInformation: {
        ...prev.professionalInformation,
        certifications: prev.professionalInformation.certifications.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // ✅ Clean and transform data before sending
      const payload = {
        ...formData,
        age: formData.age ? Number(formData.age) : undefined, // convert to Number
        hospitalInformation: {
          ...formData.hospitalInformation,
          hospitalPhone: formData.hospitalInformation.hospitalPhone || undefined,
          hospitalEmail: formData.hospitalInformation.hospitalEmail || undefined,
        },
        professionalInformation: {
          ...formData.professionalInformation,
          specialization: formData.professionalInformation.specialization.filter(Boolean), // remove empty strings
        },
        locationDetails: {
          ...formData.locationDetails,
          streetAddress: formData.locationDetails.streetAddress || undefined,
          city: formData.locationDetails.city || undefined,
          stateProvince: formData.locationDetails.stateProvince || undefined,
          country: formData.locationDetails.country || undefined,
          zipPostalCode: formData.locationDetails.zipPostalCode || undefined,
        },
      };

      console.log("💾 Sending cleaned payload:", payload);
      const response = await doctorAPI.updateProfile(payload);

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
    setFormData(originalData);
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
            <h1>Doctor Profile</h1>
            <p>Manage your professional information and personal details</p>
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

            {/* Business Stats */}
            <div className="midwife-profile-section">
              <h3>
                <Star />
                Business Stats
              </h3>
              <div className="midwife-info-grid">
                <div className="midwife-info-item">
                  <label className="midwife-info-label">
                    <Calendar />
                    Years Experience
                  </label>
                  <span className="midwife-info-value">{formData.businessStats.yearsExperience}+</span>
                </div>
                <div className="midwife-info-item">
                  <label className="midwife-info-label">
                    <Users />
                    Patients Served
                  </label>
                  <span className="midwife-info-value">{formData.businessStats.patientsServed}+</span>
                </div>
              </div>
            </div>

            {/* Professional Experience from Permission Requests */}
            <div className="midwife-profile-section">
              <h3>
                <Award />
                Professional Experience & Applications
              </h3>
              
              {permissionRequestsLoading ? (
                <div className="loading-message">Loading professional experience...</div>
              ) : permissionRequests.length > 0 ? (
                <div className="permission-requests-list">
                  {permissionRequests.map((request, index) => (
                    <div key={request._id || index} className="permission-request-card">
                      <div className="permission-request-header">
                        <div className="permission-request-title">
                          <h4>Professional Application #{index + 1}</h4>
                          <span className={`status-badge status-badge--${getStatusBadgeColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        <div className="permission-request-date">
                          Submitted: {formatDate(request.submittedAt)}
                        </div>
                      </div>
                      
                      <div className="permission-request-details">
                        <div className="permission-request-grid">
                          {request.hospitalName && (
                            <div className="permission-request-item">
                              <label className="permission-request-label">
                                <Building size={16} />
                                Hospital/Clinic
                              </label>
                              <span className="permission-request-value">{request.hospitalName}</span>
                            </div>
                          )}
                          
                          {request.doctorSpecialization && (
                            <div className="permission-request-item">
                              <label className="permission-request-label">
                                <GraduationCap size={16} />
                                Specialization
                              </label>
                              <span className="permission-request-value">{request.doctorSpecialization}</span>
                            </div>
                          )}
                          
                          {request.licenseNumber && (
                            <div className="permission-request-item">
                              <label className="permission-request-label">
                                <Award size={16} />
                                License Number
                              </label>
                              <span className="permission-request-value">{request.licenseNumber}</span>
                            </div>
                          )}
                          
                          {request.yearsOfExperience && (
                            <div className="permission-request-item">
                              <label className="permission-request-label">
                                <Calendar size={16} />
                                Years of Experience
                              </label>
                              <span className="permission-request-value">{request.yearsOfExperience} years</span>
                            </div>
                          )}
                        </div>
                        
                        {request.serviceCategories && request.serviceCategories.length > 0 && (
                          <div className="permission-request-item" style={{ gridColumn: '1 / -1' }}>
                            <label className="permission-request-label">Service Categories</label>
                            <div className="service-categories-tags">
                              {request.serviceCategories.map((category, catIndex) => (
                                <span key={catIndex} className="service-category-tag">{category}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-permission-requests">
                  <p>No professional experience applications found.</p>
                  <p className="text-muted">Your permission requests and professional applications will appear here.</p>
                </div>
              )}
            </div>

            {/* Personal Information */}
            <div className="midwife-profile-section">
              <h3>
                <User />
                Personal Information
              </h3>
            
              <div className="midwife-info-grid">
                <div className="midwife-info-item">
                  <label className="midwife-info-label">First Name *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="midwife-input"
                      placeholder="Enter your first name"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.firstName || 'Not provided'}</span>
                  )}
                </div>

                <div className="midwife-info-item">
                  <label className="midwife-info-label">Last Name *</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="midwife-input"
                      placeholder="Enter your last name"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.lastName || 'Not provided'}</span>
                  )}
                </div>

                <div className="midwife-info-item">
                  <label className="midwife-info-label">
                    <Mail className="midwife-info-icon" />
                    Email Address *
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="midwife-input"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.email || 'Not provided'}</span>
                  )}
                </div>

                <div className="midwife-info-item">
                  <label className="midwife-info-label">
                    <Phone className="midwife-info-icon" />
                    Phone Number *
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="midwife-input"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.phone || 'Not provided'}</span>
                  )}
                </div>

                <div className="midwife-info-item">
                  <label className="midwife-info-label">Age *</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="midwife-input"
                      placeholder="Enter your age"
                      min="25"
                      max="100"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.age || 'Not provided'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Hospital Information */}
            <div className="midwife-profile-section">
              <h3>
                <Building />
                Hospital Information
              </h3>
              
              <div className="midwife-info-grid">
                <div className="midwife-info-item">
                  <label className="midwife-info-label">Hospital/Clinic Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.hospitalInformation.hospitalName}
                      onChange={(e) => handleNestedInputChange('hospitalInformation', 'hospitalName', e.target.value)}
                      className="midwife-input"
                      placeholder="Enter hospital/clinic name"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.hospitalInformation.hospitalName || 'Not provided'}</span>
                  )}
                </div>

                <div className="midwife-info-item">
                  <label className="midwife-info-label">Hospital Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.hospitalInformation.hospitalAddress}
                      onChange={(e) => handleNestedInputChange('hospitalInformation', 'hospitalAddress', e.target.value)}
                      className="midwife-input"
                      placeholder="Enter hospital address"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.hospitalInformation.hospitalAddress || 'Not provided'}</span>
                  )}
                </div>

                <div className="midwife-info-item">
                  <label className="midwife-info-label">Hospital Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.hospitalInformation.hospitalPhone}
                      onChange={(e) => handleNestedInputChange('hospitalInformation', 'hospitalPhone', e.target.value)}
                      className="midwife-input"
                      placeholder="Enter hospital phone"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.hospitalInformation.hospitalPhone || 'Not provided'}</span>
                  )}
                </div>

                <div className="midwife-info-item">
                  <label className="midwife-info-label">Hospital Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.hospitalInformation.hospitalEmail}
                      onChange={(e) => handleNestedInputChange('hospitalInformation', 'hospitalEmail', e.target.value)}
                      className="midwife-input"
                      placeholder="Enter hospital email"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.hospitalInformation.hospitalEmail || 'Not provided'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="midwife-profile-section">
              <h3>
                <GraduationCap />
                Professional Information
              </h3>
              
              <div className="midwife-info-grid">
                <div className="midwife-info-item">
                  <label className="midwife-info-label">Medical Registration Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.professionalInformation.medicalRegistrationNumber}
                      onChange={(e) => handleNestedInputChange('professionalInformation', 'medicalRegistrationNumber', e.target.value)}
                      className="midwife-input"
                      placeholder="Enter medical registration number"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.professionalInformation.medicalRegistrationNumber || 'Not provided'}</span>
                  )}
                </div>

                <div className="midwife-info-item">
                  <label className="midwife-info-label">License Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.professionalInformation.licenseNumber}
                      onChange={(e) => handleNestedInputChange('professionalInformation', 'licenseNumber', e.target.value)}
                      className="midwife-input"
                      placeholder="Enter license number"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.professionalInformation.licenseNumber || 'Not provided'}</span>
                  )}
                </div>

                <div className="midwife-info-item">
                  <label className="midwife-info-label">Years of Experience</label>
                  {isEditing ? (
                    <select
                      value={formData.professionalInformation.yearsOfExperience}
                      onChange={(e) => handleNestedInputChange('professionalInformation', 'yearsOfExperience', e.target.value)}
                      className="midwife-input"
                    >
                      <option value="">Select Experience</option>
                      {experienceOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="midwife-info-value">{formData.professionalInformation.yearsOfExperience || 'Not provided'}</span>
                  )}
                </div>

                <div className="midwife-info-item">
                  <label className="midwife-info-label">Education</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.professionalInformation.education}
                      onChange={(e) => handleNestedInputChange('professionalInformation', 'education', e.target.value)}
                      className="midwife-input"
                      placeholder="Enter your education"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.professionalInformation.education || 'Not provided'}</span>
                  )}
                </div>
              </div>

              {/* Specialization */}
              <div className="midwife-info-item" style={{ gridColumn: '1 / -1' }}>
                <label className="midwife-info-label">Specialization</label>
                {isEditing ? (
                  <div className="specialization-grid">
                    {specializationOptions.map(spec => (
                      <label key={spec} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.professionalInformation.specialization.includes(spec)}
                          onChange={() => handleSpecializationChange(spec)}
                        />
                        <span>{spec}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="specialization-tags">
                    {formData.professionalInformation.specialization.length > 0 ? (
                      formData.professionalInformation.specialization.map(spec => (
                        <span key={spec} className="specialization-tag">{spec}</span>
                      ))
                    ) : (
                      <span className="midwife-info-value">No specializations selected</span>
                    )}
                  </div>
                )}
              </div>

              {/* Certifications */}
              <div className="midwife-info-item" style={{ gridColumn: '1 / -1' }}>
                <label className="midwife-info-label">
                  <Award />
                  Certifications
                </label>
                {isEditing ? (
                  <div className="certifications-section">
                    <div className="certifications-list">
                      {formData.professionalInformation.certifications.map((cert, index) => (
                        <div key={index} className="certification-item">
                          <span>{cert}</span>
                          <button
                            type="button"
                            onClick={() => removeCertification(index)}
                            className="remove-certification-btn"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="add-certification">
                      <input
                        type="text"
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        placeholder="Add new certification"
                        className="midwife-input"
                      />
                      <button
                        type="button"
                        onClick={addCertification}
                        className="midwife-btn midwife-btn-primary"
                        style={{ padding: '0.5rem 1rem' }}
                      >
                        <Plus size={16} />
                        Add
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="certifications-tags">
                    {formData.professionalInformation.certifications.length > 0 ? (
                      formData.professionalInformation.certifications.map((cert, index) => (
                        <span key={index} className="certification-tag">{cert}</span>
                      ))
                    ) : (
                      <span className="midwife-info-value">No certifications added</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Location Details */}
            <div className="midwife-profile-section">
              <h3>
                <MapPin />
                Location Details
              </h3>
              
              <div className="midwife-info-grid">
                <div className="midwife-info-item">
                  <label className="midwife-info-label">Street Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.locationDetails.streetAddress}
                      onChange={(e) => handleNestedInputChange('locationDetails', 'streetAddress', e.target.value)}
                      className="midwife-input"
                      placeholder="Enter street address"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.locationDetails.streetAddress || 'Not provided'}</span>
                  )}
                </div>

                <div className="midwife-info-item">
                  <label className="midwife-info-label">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.locationDetails.city}
                      onChange={(e) => handleNestedInputChange('locationDetails', 'city', e.target.value)}
                      className="midwife-input"
                      placeholder="Enter city"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.locationDetails.city || 'Not provided'}</span>
                  )}
                </div>

                <div className="midwife-info-item">
                  <label className="midwife-info-label">State/Province</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.locationDetails.stateProvince}
                      onChange={(e) => handleNestedInputChange('locationDetails', 'stateProvince', e.target.value)}
                      className="midwife-input"
                      placeholder="Enter state/province"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.locationDetails.stateProvince || 'Not provided'}</span>
                  )}
                </div>

                <div className="midwife-info-item">
                  <label className="midwife-info-label">Country</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.locationDetails.country}
                      onChange={(e) => handleNestedInputChange('locationDetails', 'country', e.target.value)}
                      className="midwife-input"
                      placeholder="Enter country"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.locationDetails.country || 'Not provided'}</span>
                  )}
                </div>

                <div className="midwife-info-item">
                  <label className="midwife-info-label">ZIP/Postal Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.locationDetails.zipPostalCode}
                      onChange={(e) => handleNestedInputChange('locationDetails', 'zipPostalCode', e.target.value)}
                      className="midwife-input"
                      placeholder="Enter ZIP/postal code"
                    />
                  ) : (
                    <span className="midwife-info-value">{formData.locationDetails.zipPostalCode || 'Not provided'}</span>
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
