import React, { useState } from 'react';
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Edit, 
  Save, 
  X,
  Camera,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Award
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    businessName: 'BabyCare Essentials Store',
    ownerName: 'Sarah Johnson',
    email: 'sarah@babycarestore.com',
    phone: '+1 (555) 123-4567',
    website: 'https://babycarestore.com',
    address: '123 Main Street, Suite 100',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    description: 'We specialize in premium baby products and accessories, offering a curated selection of safe, high-quality items for parents and their little ones.',
    businessType: 'Online Store',
    established: '2020',
    specialties: ['Baby Carriers', 'Feeding Products', 'Travel Gear', 'Safety Items'],
    certifications: ['Safe Sleep Certified', 'Organic Products Certified'],
    socialMedia: {
      facebook: 'https://facebook.com/babycarestore',
      instagram: 'https://instagram.com/babycarestore',
      twitter: 'https://twitter.com/babycarestore'
    }
  });

  const [formData, setFormData] = useState({ ...profileData });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfileData(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="sp-profile-page">
      <div className="sp-profile-container-wrapper">
        <div className="sp-profile-header">
          <div className="sp-profile-header-icon">
            <Building />
          </div>
          <div className="sp-profile-title">
            <h1>Business Profile</h1>
            <p>Manage your business information and settings</p>
          </div>
        </div>

                <div className="sp-profile-container">
          <div className="sp-profile-main">
            {/* Profile Actions */}
            <div className="sp-profile-section">
              <div className="sp-profile-actions">
                {!isEditing ? (
                  <button 
                    className="sp-btn sp-btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit />
                    Edit Profile
                  </button>
                ) : (
                  <div className="sp-edit-actions">
                    <button 
                      className="sp-btn sp-btn-secondary"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      <X />
                      Cancel
                    </button>
                    <button 
                      className="sp-btn sp-btn-primary"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      <Save />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Business Information */}
            <div className="sp-profile-section">
              <h3>
                <Building />
                Business Information
              </h3>
            
            <div className="sp-info-grid">
              <div className="sp-info-item">
                <label className="sp-info-label">Business Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="sp-input"
                  />
                ) : (
                  <span className="sp-info-value">{profileData.businessName}</span>
                )}
              </div>

              <div className="sp-info-item">
                <label className="sp-info-label">Owner Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    className="sp-input"
                  />
                ) : (
                  <span className="sp-info-value">{profileData.ownerName}</span>
                )}
              </div>

              <div className="sp-info-item">
                <label className="sp-info-label">Business Type</label>
                {isEditing ? (
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="sp-select"
                  >
                    <option value="Online Store">Online Store</option>
                    <option value="Physical Store">Physical Store</option>
                    <option value="Both">Both</option>
                    <option value="Manufacturer">Manufacturer</option>
                    <option value="Distributor">Distributor</option>
                  </select>
                ) : (
                  <span className="sp-info-value">{profileData.businessType}</span>
                )}
              </div>

              <div className="sp-info-item">
                <label className="sp-info-label">Established</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="established"
                    value={formData.established}
                    onChange={handleInputChange}
                    className="sp-input"
                    placeholder="Year"
                  />
                ) : (
                  <span className="sp-info-value">{profileData.established}</span>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="sp-profile-section">
            <div className="sp-section-header">
              <h3>
                <Mail className="sp-section-icon" />
                Contact Information
              </h3>
            </div>
            
            <div className="sp-info-grid">
              <div className="sp-info-item">
                <label className="sp-info-label">
                  <Mail className="sp-info-icon" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="sp-input"
                  />
                ) : (
                  <span className="sp-info-value">{profileData.email}</span>
                )}
              </div>

              <div className="sp-info-item">
                <label className="sp-info-label">
                  <Phone className="sp-info-icon" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="sp-input"
                  />
                ) : (
                  <span className="sp-info-value">{profileData.phone}</span>
                )}
              </div>

              <div className="sp-info-item">
                <label className="sp-info-label">
                  <Globe className="sp-info-icon" />
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="sp-input"
                  />
                ) : (
                  <a 
                    href={profileData.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="sp-info-link"
                  >
                    {profileData.website}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="sp-profile-section">
            <div className="sp-section-header">
              <h3>
                <MapPin className="sp-section-icon" />
                Address
              </h3>
            </div>
            
            <div className="sp-address-grid">
              <div className="sp-info-item sp-full-width">
                <label className="sp-info-label">Street Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="sp-input"
                  />
                ) : (
                  <span className="sp-info-value">{profileData.address}</span>
                )}
              </div>

              <div className="sp-info-item">
                <label className="sp-info-label">City</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="sp-input"
                  />
                ) : (
                  <span className="sp-info-value">{profileData.city}</span>
                )}
              </div>

              <div className="sp-info-item">
                <label className="sp-info-label">State</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="sp-input"
                  />
                ) : (
                  <span className="sp-info-value">{profileData.state}</span>
                )}
              </div>

              <div className="sp-info-item">
                <label className="sp-info-label">ZIP Code</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="sp-input"
                  />
                ) : (
                  <span className="sp-info-value">{profileData.zipCode}</span>
                )}
              </div>

              <div className="sp-info-item">
                <label className="sp-info-label">Country</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="sp-input"
                  />
                ) : (
                  <span className="sp-info-value">{profileData.country}</span>
                )}
              </div>
            </div>
          </div>

          {/* Business Description */}
          <div className="sp-profile-section">
            <div className="sp-section-header">
              <h3>
                <User className="sp-section-icon" />
                About Your Business
              </h3>
            </div>
            
            <div className="sp-info-item">
              <label className="sp-info-label">Description</label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="sp-textarea"
                  rows="4"
                  placeholder="Tell customers about your business..."
                />
              ) : (
                <p className="sp-info-description">{profileData.description}</p>
              )}
            </div>
          </div>

          {/* Social Media */}
          <div className="sp-profile-section">
            <div className="sp-section-header">
              <h3>
                <Globe className="sp-section-icon" />
                Social Media
              </h3>
            </div>
            
            <div className="sp-social-grid">
              <div className="sp-info-item">
                <label className="sp-info-label">Facebook</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.socialMedia.facebook}
                    onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                    className="sp-input"
                    placeholder="https://facebook.com/yourpage"
                  />
                ) : (
                  <a 
                    href={profileData.socialMedia.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="sp-info-link"
                  >
                    {profileData.socialMedia.facebook}
                  </a>
                )}
              </div>

              <div className="sp-info-item">
                <label className="sp-info-label">Instagram</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.socialMedia.instagram}
                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                    className="sp-input"
                    placeholder="https://instagram.com/yourpage"
                  />
                ) : (
                  <a 
                    href={profileData.socialMedia.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="sp-info-link"
                  >
                    {profileData.socialMedia.instagram}
                  </a>
                )}
              </div>

              <div className="sp-info-item">
                <label className="sp-info-label">Twitter</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.socialMedia.twitter}
                    onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                    className="sp-input"
                    placeholder="https://twitter.com/yourpage"
                  />
                ) : (
                  <a 
                    href={profileData.socialMedia.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="sp-info-link"
                  >
                    {profileData.socialMedia.twitter}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="sp-profile-sidebar">
          {/* Business Stats */}
          <div className="sp-sidebar-card">
            <div className="sp-sidebar-card-header">
              <h4>
                <BarChart3 />
                Business Statistics
              </h4>
            </div>
            <div className="sp-sidebar-card-body">
              <div className="sp-stats-grid">
                <div className="sp-stat-item">
                  <div className="sp-stat-value">24</div>
                  <div className="sp-stat-label">Products Listed</div>
                </div>
                <div className="sp-stat-item">
                  <div className="sp-stat-value">1,247</div>
                  <div className="sp-stat-label">Total Views</div>
                </div>
                <div className="sp-stat-item">
                  <div className="sp-stat-value">89</div>
                  <div className="sp-stat-label">External Clicks</div>
                </div>
                <div className="sp-stat-item">
                  <div className="sp-stat-value">22</div>
                  <div className="sp-stat-label">Active Products</div>
                </div>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="sp-sidebar-card">
            <div className="sp-sidebar-card-header">
              <h4>
                <Award />
                Specialties
              </h4>
            </div>
            <div className="sp-sidebar-card-body">
              <div className="sp-specialties-list">
                {profileData.specialties.map((specialty, index) => (
                  <span key={index} className="sp-specialty-tag">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="sp-sidebar-card">
            <div className="sp-sidebar-card-header">
              <h4>
                <CheckCircle />
                Certifications
              </h4>
            </div>
            <div className="sp-sidebar-card-body">
            <div className="sp-certifications-list">
              {profileData.certifications.map((cert, index) => (
                <div key={index} className="sp-certification-item">
                  <div className="sp-certification-icon">
                    <CheckCircle />
                  </div>
                  <div className="sp-certification-info">
                    <div className="sp-certification-name">{cert}</div>
                    <div className="sp-certification-date">Certified</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default Profile;
