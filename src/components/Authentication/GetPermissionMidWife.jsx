import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, MapPin, FileText, Upload, CheckCircle, Phone, Mail, Award } from 'lucide-react';
import './GetPermissionMidWife.css';

const GetPermissionMidWife = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clinicName: '',
    clinicAddress: '',
    clinicPhone: '',
    clinicEmail: '',
    midwifeSpecialization: '',
    certificationNumber: '',
    licenseNumber: '',
    yearsOfExperience: '',
    services: [],
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
    'Prenatal Care',
    'Labor & Delivery',
    'Postpartum Care',
    'Newborn Care',
    'Lactation Support',
    'Family Planning',
    'Gynecological Care',
    'Other'
  ];

  const availableServices = [
    'Home Births',
    'Hospital Births',
    'Birth Center Births',
    'Prenatal Visits',
    'Postpartum Visits',
    'Lactation Consultation',
    'Childbirth Education',
    'Doula Services',
    'Family Planning',
    'Well Woman Care'
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

  const handleServiceChange = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
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

    if (!formData.clinicName.trim()) {
      newErrors.clinicName = 'Clinic name is required';
    }

    if (!formData.clinicAddress.trim()) {
      newErrors.clinicAddress = 'Clinic address is required';
    }

    if (!formData.clinicPhone.trim()) {
      newErrors.clinicPhone = 'Clinic phone is required';
    }

    if (!formData.clinicEmail.trim()) {
      newErrors.clinicEmail = 'Clinic email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.clinicEmail)) {
      newErrors.clinicEmail = 'Please enter a valid email address';
    }

    if (!formData.midwifeSpecialization) {
      newErrors.midwifeSpecialization = 'Specialization is required';
    }

    if (!formData.certificationNumber.trim()) {
      newErrors.certificationNumber = 'Certification number is required';
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required';
    }

    if (!formData.yearsOfExperience) {
      newErrors.yearsOfExperience = 'Years of experience is required';
    }

    if (formData.services.length === 0) {
      newErrors.services = 'Please select at least one service';
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
      newErrors.license = 'Midwifery license is required';
    }

    if (!formData.documents.certificate) {
      newErrors.certificate = 'Certification document is required';
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
      const response = await fetch('http://localhost:5000/api/midwife/permission-request', {
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
          navigate('/midwife');
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
          <h1>Midwife Registration</h1>
          <p>Complete your profile to get admin approval</p>
        </div>

        <form onSubmit={handleSubmit} className="permission-form">
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          <div className="form-section">
            <h3>Clinic Information</h3>
            
            <div className="form-group">
              <div className="input-wrapper">
                <Building className="input-icon" />
                <input
                  type="text"
                  name="clinicName"
                  placeholder="Clinic/Practice Name"
                  value={formData.clinicName}
                  onChange={handleInputChange}
                  className={errors.clinicName ? 'error' : ''}
                />
              </div>
              {errors.clinicName && (
                <span className="field-error">{errors.clinicName}</span>
              )}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <MapPin className="input-icon" />
                <input
                  type="text"
                  name="clinicAddress"
                  placeholder="Clinic Address"
                  value={formData.clinicAddress}
                  onChange={handleInputChange}
                  className={errors.clinicAddress ? 'error' : ''}
                />
              </div>
              {errors.clinicAddress && (
                <span className="field-error">{errors.clinicAddress}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="input-wrapper">
                  <Phone className="input-icon" />
                  <input
                    type="tel"
                    name="clinicPhone"
                    placeholder="Clinic Phone"
                    value={formData.clinicPhone}
                    onChange={handleInputChange}
                    className={errors.clinicPhone ? 'error' : ''}
                  />
                </div>
                {errors.clinicPhone && (
                  <span className="field-error">{errors.clinicPhone}</span>
                )}
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    name="clinicEmail"
                    placeholder="Clinic Email"
                    value={formData.clinicEmail}
                    onChange={handleInputChange}
                    className={errors.clinicEmail ? 'error' : ''}
                  />
                </div>
                {errors.clinicEmail && (
                  <span className="field-error">{errors.clinicEmail}</span>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Professional Information</h3>
            
            <div className="form-group">
              <label className="select-label">Specialization</label>
              <select
                name="midwifeSpecialization"
                value={formData.midwifeSpecialization}
                onChange={handleInputChange}
                className={errors.midwifeSpecialization ? 'error' : ''}
              >
                <option value="">Select Specialization</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
              {errors.midwifeSpecialization && (
                <span className="field-error">{errors.midwifeSpecialization}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="input-wrapper">
                  <Award className="input-icon" />
                  <input
                    type="text"
                    name="certificationNumber"
                    placeholder="Midwifery Certification Number"
                    value={formData.certificationNumber}
                    onChange={handleInputChange}
                    className={errors.certificationNumber ? 'error' : ''}
                  />
                </div>
                {errors.certificationNumber && (
                  <span className="field-error">{errors.certificationNumber}</span>
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
            <h3>Services Offered</h3>
            <div className="services-grid">
              {availableServices.map(service => (
                <label key={service} className="service-option">
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service)}
                    onChange={() => handleServiceChange(service)}
                  />
                  <span className="service-label">{service}</span>
                </label>
              ))}
            </div>
            {errors.services && (
              <span className="field-error">{errors.services}</span>
            )}
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
                  <span>Midwifery License</span>
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
                  <span>Certification Document</span>
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

export default GetPermissionMidWife;
