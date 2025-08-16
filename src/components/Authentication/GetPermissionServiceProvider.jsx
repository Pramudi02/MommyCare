import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, MapPin, FileText, Upload, CheckCircle, Phone, Mail, Store, Package } from 'lucide-react';
import './GetPermissionServiceProvider.css';

const GetPermissionServiceProvider = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    businessEmail: '',
    businessType: '',
    registrationNumber: '',
    taxId: '',
    yearsInBusiness: '',
    services: [],
    products: [],
    location: {
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    documents: {
      businessLicense: null,
      taxCertificate: null,
      idProof: null
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const businessTypes = [
    'Baby Products Store',
    'Maternity Wear',
    'Baby Care Services',
    'Lactation Consultant',
    'Childcare Services',
    'Pregnancy Wellness',
    'Nutrition Services',
    'Fitness & Yoga',
    'Photography',
    'Other'
  ];

  const availableServices = [
    'Baby Products',
    'Maternity Clothing',
    'Lactation Support',
    'Childcare',
    'Pregnancy Yoga',
    'Nutrition Counseling',
    'Photography',
    'Doula Services',
    'Breastfeeding Support',
    'Postpartum Care',
    'Baby Massage',
    'Parenting Classes'
  ];

  const productCategories = [
    'Baby Clothing',
    'Diapers & Wipes',
    'Baby Food',
    'Toys & Books',
    'Baby Gear',
    'Maternity Wear',
    'Breastfeeding Supplies',
    'Baby Care Products',
    'Nursery Items',
    'Health & Safety'
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

  const handleProductChange = (product) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.includes(product)
        ? prev.products.filter(p => p !== product)
        : [...prev.products, product]
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

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.businessAddress.trim()) {
      newErrors.businessAddress = 'Business address is required';
    }

    if (!formData.businessPhone.trim()) {
      newErrors.businessPhone = 'Business phone is required';
    }

    if (!formData.businessEmail.trim()) {
      newErrors.businessEmail = 'Business email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.businessEmail)) {
      newErrors.businessEmail = 'Please enter a valid email address';
    }

    if (!formData.businessType) {
      newErrors.businessType = 'Business type is required';
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Business registration number is required';
    }

    if (!formData.taxId.trim()) {
      newErrors.taxId = 'Tax ID is required';
    }

    if (!formData.yearsInBusiness) {
      newErrors.yearsInBusiness = 'Years in business is required';
    }

    if (formData.services.length === 0) {
      newErrors.services = 'Please select at least one service';
    }

    if (formData.products.length === 0) {
      newErrors.products = 'Please select at least one product category';
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

    if (!formData.documents.businessLicense) {
      newErrors.businessLicense = 'Business license is required';
    }

    if (!formData.documents.taxCertificate) {
      newErrors.taxCertificate = 'Tax certificate is required';
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
      const response = await fetch('http://localhost:5000/api/service-provider/permission-request', {
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
          navigate('/service-provider');
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
          <h1>Service Provider Registration</h1>
          <p>Complete your business profile to get admin approval</p>
        </div>

        <form onSubmit={handleSubmit} className="permission-form">
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          <div className="form-section">
            <h3>Business Information</h3>
            
            <div className="form-group">
              <div className="input-wrapper">
                <Store className="input-icon" />
                <input
                  type="text"
                  name="businessName"
                  placeholder="Business Name"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className={errors.businessName ? 'error' : ''}
                />
              </div>
              {errors.businessName && (
                <span className="field-error">{errors.businessName}</span>
              )}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <MapPin className="input-icon" />
                <input
                  type="text"
                  name="businessAddress"
                  placeholder="Business Address"
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                  className={errors.businessAddress ? 'error' : ''}
                />
              </div>
              {errors.businessAddress && (
                <span className="field-error">{errors.businessAddress}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="input-wrapper">
                  <Phone className="input-icon" />
                  <input
                    type="tel"
                    name="businessPhone"
                    placeholder="Business Phone"
                    value={formData.businessPhone}
                    onChange={handleInputChange}
                    className={errors.businessPhone ? 'error' : ''}
                  />
                </div>
                {errors.businessPhone && (
                  <span className="field-error">{errors.businessPhone}</span>
                )}
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    name="businessEmail"
                    placeholder="Business Email"
                    value={formData.businessEmail}
                    onChange={handleInputChange}
                    className={errors.businessEmail ? 'error' : ''}
                  />
                </div>
                {errors.businessEmail && (
                  <span className="field-error">{errors.businessEmail}</span>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Business Details</h3>
            
            <div className="form-group">
              <label className="select-label">Business Type</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className={errors.businessType ? 'error' : ''}
              >
                <option value="">Select Business Type</option>
                {businessTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.businessType && (
                <span className="field-error">{errors.businessType}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="input-wrapper">
                  <FileText className="input-icon" />
                  <input
                    type="text"
                    name="registrationNumber"
                    placeholder="Business Registration Number"
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
                    name="taxId"
                    placeholder="Tax ID"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    className={errors.taxId ? 'error' : ''}
                  />
                </div>
                {errors.taxId && (
                  <span className="field-error">{errors.taxId}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="select-label">Years in Business</label>
              <select
                name="yearsInBusiness"
                value={formData.yearsInBusiness}
                onChange={handleInputChange}
                className={errors.yearsInBusiness ? 'error' : ''}
              >
                <option value="">Select Experience</option>
                <option value="0-1">0-1 years</option>
                <option value="2-3">2-3 years</option>
                <option value="4-5">4-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="11-15">11-15 years</option>
                <option value="16-20">16-20 years</option>
                <option value="20+">20+ years</option>
              </select>
              {errors.yearsInBusiness && (
                <span className="field-error">{errors.yearsInBusiness}</span>
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
            <h3>Product Categories</h3>
            <div className="services-grid">
              {productCategories.map(product => (
                <label key={product} className="service-option">
                  <input
                    type="checkbox"
                    checked={formData.products.includes(product)}
                    onChange={() => handleProductChange(product)}
                  />
                  <span className="service-label">{product}</span>
                </label>
              ))}
            </div>
            {errors.products && (
              <span className="field-error">{errors.products}</span>
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
                  <span>Business License</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'businessLicense')}
                    className="file-input"
                  />
                </label>
                {formData.documents.businessLicense && (
                  <span className="file-name">{formData.documents.businessLicense.name}</span>
                )}
                {errors.businessLicense && (
                  <span className="field-error">{errors.businessLicense}</span>
                )}
              </div>

              <div className="upload-group">
                <label className="upload-label">
                  <Upload className="upload-icon" />
                  <span>Tax Certificate</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'taxCertificate')}
                    className="file-input"
                  />
                </label>
                {formData.documents.taxCertificate && (
                  <span className="file-name">{formData.documents.taxCertificate.name}</span>
                )}
                {errors.taxCertificate && (
                  <span className="field-error">{errors.taxCertificate}</span>
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

export default GetPermissionServiceProvider;
