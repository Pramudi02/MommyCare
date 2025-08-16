import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, MapPin, FileText, Upload, CheckCircle, Phone, Mail } from 'lucide-react';
import './GetPermissionDoctor.css';

const GetPermissionDoctor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hospitalName: '',
    hospitalAddress: '',
    hospitalPhone: '',
    hospitalEmail: '',
    doctorSpecialization: '',
    registrationNumber: '',
    licenseNumber: '',
    yearsOfExperience: '',
    location: {
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    documents: {
      license: null,
      certificate: null,
      idProof: null
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const specializations = [
    'Obstetrics & Gynecology',
    'Pediatrics',
    'Neonatology',
    'Maternal-Fetal Medicine',
    'Reproductive Endocrinology',
    'Gynecologic Oncology',
    'Family Medicine',
    'Internal Medicine',
    'Emergency Medicine',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: file
        }
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.hospitalName.trim()) {
      newErrors.hospitalName = 'Hospital name is required';
    }

    if (!formData.hospitalAddress.trim()) {
      newErrors.hospitalAddress = 'Hospital address is required';
    }

    if (!formData.hospitalPhone.trim()) {
      newErrors.hospitalPhone = 'Hospital phone is required';
    }

    if (!formData.hospitalEmail.trim()) {
      newErrors.hospitalEmail = 'Hospital email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.hospitalEmail)) {
      newErrors.hospitalEmail = 'Please enter a valid email address';
    }

    if (!formData.doctorSpecialization) {
      newErrors.doctorSpecialization = 'Specialization is required';
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required';
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required';
    }

    if (!formData.yearsOfExperience) {
      newErrors.yearsOfExperience = 'Years of experience is required';
    }

    if (!formData.location.city.trim()) {
      newErrors['location.city'] = 'City is required';
    }

    if (!formData.location.state.trim()) {
      newErrors['location.state'] = 'State is required';
    }

    if (!formData.location.country.trim()) {
      newErrors['location.country'] = 'Country is required';
    }

    if (!formData.documents.license) {
      newErrors.license = 'Medical license is required';
    }

    if (!formData.documents.certificate) {
      newErrors.certificate = 'Medical certificate is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch('http://localhost:5000/api/doctor/permission-request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          navigate('/doctor');
        }, 3000);
      } else {
        setErrors({ general: data.message || 'Submission failed' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="permission-success">
        <div className="success-content">
          <CheckCircle className="success-icon" />
          <h2>Request Submitted Successfully!</h2>
          <p>Your permission request has been submitted for admin review. You will be notified once your account is approved.</p>
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="permission-page">
      <div className="permission-container">
        <div className="permission-header">
          <h1>Doctor Registration</h1>
          <p>Complete your profile to get admin approval</p>
        </div>

        <form onSubmit={handleSubmit} className="permission-form">
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          <div className="form-section">
            <h3>Hospital Information</h3>
            
            <div className="form-group">
              <div className="input-wrapper">
                <Building className="input-icon" />
                <input
                  type="text"
                  name="hospitalName"
                  placeholder="Hospital/Clinic Name"
                  value={formData.hospitalName}
                  onChange={handleInputChange}
                  className={errors.hospitalName ? 'error' : ''}
                />
              </div>
              {errors.hospitalName && (
                <span className="field-error">{errors.hospitalName}</span>
              )}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <MapPin className="input-icon" />
                <input
                  type="text"
                  name="hospitalAddress"
                  placeholder="Hospital Address"
                  value={formData.hospitalAddress}
                  onChange={handleInputChange}
                  className={errors.hospitalAddress ? 'error' : ''}
                />
              </div>
              {errors.hospitalAddress && (
                <span className="field-error">{errors.hospitalAddress}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="input-wrapper">
                  <Phone className="input-icon" />
                  <input
                    type="tel"
                    name="hospitalPhone"
                    placeholder="Hospital Phone"
                    value={formData.hospitalPhone}
                    onChange={handleInputChange}
                    className={errors.hospitalPhone ? 'error' : ''}
                  />
                </div>
                {errors.hospitalPhone && (
                  <span className="field-error">{errors.hospitalPhone}</span>
                )}
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    name="hospitalEmail"
                    placeholder="Hospital Email"
                    value={formData.hospitalEmail}
                    onChange={handleInputChange}
                    className={errors.hospitalEmail ? 'error' : ''}
                  />
                </div>
                {errors.hospitalEmail && (
                  <span className="field-error">{errors.hospitalEmail}</span>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Professional Information</h3>
            
            <div className="form-group">
              <label className="select-label">Specialization</label>
              <select
                name="doctorSpecialization"
                value={formData.doctorSpecialization}
                onChange={handleInputChange}
                className={errors.doctorSpecialization ? 'error' : ''}
              >
                <option value="">Select Specialization</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
              {errors.doctorSpecialization && (
                <span className="field-error">{errors.doctorSpecialization}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="input-wrapper">
                  <FileText className="input-icon" />
                  <input
                    type="text"
                    name="registrationNumber"
                    placeholder="Medical Registration Number"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    className={errors.registrationNumber ? 'error' : ''}
                  />
                </div>
                {errors.registrationNumber && (
                  <span className="field-error">{errors.registrationNumber}</span>
                )}
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <FileText className="input-icon" />
                  <input
                    type="text"
                    name="licenseNumber"
                    placeholder="License Number"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className={errors.licenseNumber ? 'error' : ''}
                  />
                </div>
                {errors.licenseNumber && (
                  <span className="field-error">{errors.licenseNumber}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="select-label">Years of Experience</label>
              <select
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                className={errors.yearsOfExperience ? 'error' : ''}
              >
                <option value="">Select Experience</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="11-15">11-15 years</option>
                <option value="16-20">16-20 years</option>
                <option value="20+">20+ years</option>
              </select>
              {errors.yearsOfExperience && (
                <span className="field-error">{errors.yearsOfExperience}</span>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>Location Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="location.city"
                  placeholder="City"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  className={errors['location.city'] ? 'error' : ''}
                />
                {errors['location.city'] && (
                  <span className="field-error">{errors['location.city']}</span>
                )}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="location.state"
                  placeholder="State/Province"
                  value={formData.location.state}
                  onChange={handleInputChange}
                  className={errors['location.state'] ? 'error' : ''}
                />
                {errors['location.state'] && (
                  <span className="field-error">{errors['location.state']}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="location.country"
                  placeholder="Country"
                  value={formData.location.country}
                  onChange={handleInputChange}
                  className={errors['location.country'] ? 'error' : ''}
                />
                {errors['location.country'] && (
                  <span className="field-error">{errors['location.country']}</span>
                )}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="location.zipCode"
                  placeholder="ZIP/Postal Code"
                  value={formData.location.zipCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Required Documents</h3>
            
            <div className="document-upload">
              <div className="upload-group">
                <label className="upload-label">
                  <Upload className="upload-icon" />
                  <span>Medical License</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'license')}
                    className="file-input"
                  />
                </label>
                {formData.documents.license && (
                  <span className="file-name">{formData.documents.license.name}</span>
                )}
                {errors.license && (
                  <span className="field-error">{errors.license}</span>
                )}
              </div>

              <div className="upload-group">
                <label className="upload-label">
                  <Upload className="upload-icon" />
                  <span>Medical Certificate</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'certificate')}
                    className="file-input"
                  />
                </label>
                {formData.documents.certificate && (
                  <span className="file-name">{formData.documents.certificate.name}</span>
                )}
                {errors.certificate && (
                  <span className="field-error">{errors.certificate}</span>
                )}
              </div>

              <div className="upload-group">
                <label className="upload-label">
                  <Upload className="upload-icon" />
                  <span>ID Proof (Optional)</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'idProof')}
                    className="file-input"
                  />
                </label>
                {formData.documents.idProof && (
                  <span className="file-name">{formData.documents.idProof.name}</span>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GetPermissionDoctor;
