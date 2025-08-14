import React, { useState } from 'react';
import { 
  User, 
  Building, 
  Shield, 
  Bell, 
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Globe,
  Save,
  Edit,
  Camera
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'business', label: 'Business', icon: <Building className="w-5 h-5" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-5 h-5" /> }
  ];

  const profileData = {
    name: 'Service Provider Name',
    email: 'provider@email.com',
    phone: '+1 (555) 123-4567',
    avatar: '🏪',
    bio: 'Dedicated to providing high-quality baby products and exceptional customer service.',
    website: 'www.providerwebsite.com',
    address: '123 Business St, City, State 12345',
    businessHours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
    specialties: ['Feeding', 'Travel', 'Safety', 'Comfort']
  };

  const businessData = {
    businessName: 'Baby Care Provider',
    businessType: 'Retail Store',
    taxId: '12-3456789',
    licenseNumber: 'LIC-2024-001',
    establishedDate: '2020-01-15',
    employeeCount: 15,
    serviceAreas: ['City', 'Suburbs', 'Online'],
    certifications: ['Safety Certified', 'Quality Assured', 'Eco-Friendly']
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Settings saved');
    // Handle save logic here
  };

  const handleCancel = () => {
    setIsEditing(false);
    console.log('Changes cancelled');
    // Handle cancel logic here
  };

  const renderProfileTab = () => (
    <div className="settings-content">
      <div className="profile-section">
        <div className="profile-header">
          <div className="profile-avatar">
            {profileData.avatar}
            <button className="avatar-edit-btn">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="profile-info">
            <h3>{profileData.name}</h3>
            <p>{profileData.bio}</p>
          </div>
        </div>
        
        <div className="form-section">
          <h4>Personal Information</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                defaultValue={profileData.name}
                disabled={!isEditing}
                className={isEditing ? 'editable' : 'disabled'}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                defaultValue={profileData.email}
                disabled={!isEditing}
                className={isEditing ? 'editable' : 'disabled'}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input 
                type="tel" 
                defaultValue={profileData.phone}
                disabled={!isEditing}
                className={isEditing ? 'editable' : 'disabled'}
              />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input 
                type="url" 
                defaultValue={profileData.website}
                disabled={!isEditing}
                className={isEditing ? 'editable' : 'disabled'}
              />
            </div>
          </div>
          
          <div className="form-group full-width">
            <label>Bio</label>
            <textarea 
              defaultValue={profileData.bio}
              disabled={!isEditing}
              className={isEditing ? 'editable' : 'disabled'}
              rows={3}
            />
          </div>
          
          <div className="form-group full-width">
            <label>Address</label>
            <input 
              type="text" 
              defaultValue={profileData.address}
              disabled={!isEditing}
              className={isEditing ? 'editable' : 'disabled'}
            />
          </div>
          
          <div className="form-group full-width">
            <label>Business Hours</label>
            <input 
              type="text" 
              defaultValue={profileData.businessHours}
              disabled={!isEditing}
              className={isEditing ? 'editable' : 'disabled'}
            />
          </div>
          
          <div className="form-group full-width">
            <label>Specialties</label>
            <div className="specialties-tags">
              {profileData.specialties.map((specialty, index) => (
                <span key={index} className="specialty-tag">{specialty}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBusinessTab = () => (
    <div className="settings-content">
      <div className="business-section">
        <div className="form-section">
          <h4>Business Information</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Business Name</label>
              <input 
                type="text" 
                defaultValue={businessData.businessName}
                disabled={!isEditing}
                className={isEditing ? 'editable' : 'disabled'}
              />
            </div>
            <div className="form-group">
              <label>Business Type</label>
              <select 
                defaultValue={businessData.businessType}
                disabled={!isEditing}
                className={isEditing ? 'editable' : 'disabled'}
              >
                <option value="Retail Store">Retail Store</option>
                <option value="Online Store">Online Store</option>
                <option value="Both">Both</option>
                <option value="Wholesale">Wholesale</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tax ID</label>
              <input 
                type="text" 
                defaultValue={businessData.taxId}
                disabled={!isEditing}
                className={isEditing ? 'editable' : 'disabled'}
              />
            </div>
            <div className="form-group">
              <label>License Number</label>
              <input 
                type="text" 
                defaultValue={businessData.licenseNumber}
                disabled={!isEditing}
                className={isEditing ? 'editable' : 'disabled'}
              />
            </div>
            <div className="form-group">
              <label>Established Date</label>
              <input 
                type="date" 
                defaultValue={businessData.establishedDate}
                disabled={!isEditing}
                className={isEditing ? 'editable' : 'disabled'}
              />
            </div>
            <div className="form-group">
              <label>Employee Count</label>
              <input 
                type="number" 
                defaultValue={businessData.employeeCount}
                disabled={!isEditing}
                className={isEditing ? 'editable' : 'disabled'}
              />
            </div>
          </div>
          
          <div className="form-group full-width">
            <label>Service Areas</label>
            <div className="service-areas">
              {businessData.serviceAreas.map((area, index) => (
                <span key={index} className="service-area-tag">{area}</span>
              ))}
            </div>
          </div>
          
          <div className="form-group full-width">
            <label>Certifications</label>
            <div className="certifications">
              {businessData.certifications.map((cert, index) => (
                <span key={index} className="certification-tag">{cert}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="settings-content">
      <div className="security-section">
        <div className="form-section">
          <h4>Password & Security</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Current Password</label>
              <input 
                type="password" 
                placeholder="Enter current password"
                disabled={!isEditing}
                className={isEditing ? 'editable' : 'disabled'}
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                placeholder="Enter new password"
                disabled={!isEditing}
                className={isEditing ? 'editable' : 'disabled'}
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input 
                type="password" 
                placeholder="Confirm new password"
                disabled={!isEditing}
                className={isEditing ? 'editable' : 'disabled'}
              />
            </div>
          </div>
          
          <h4>Two-Factor Authentication</h4>
          <div className="two-factor-section">
            <div className="two-factor-status">
              <span className="status-label">Status:</span>
              <span className="status-value enabled">Enabled</span>
            </div>
            <button className="toggle-2fa-btn">Disable 2FA</button>
          </div>
          
          <h4>Login History</h4>
          <div className="login-history">
            <div className="login-item">
              <div className="login-info">
                <span className="login-time">Today, 2:30 PM</span>
                <span className="login-location">New York, NY</span>
              </div>
              <span className="login-status success">Successful</span>
            </div>
            <div className="login-item">
              <div className="login-info">
                <span className="login-time">Yesterday, 9:15 AM</span>
                <span className="login-location">New York, NY</span>
              </div>
              <span className="login-status success">Successful</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="settings-content">
      <div className="notifications-section">
        <div className="form-section">
          <h4>Email Notifications</h4>
          <div className="notification-settings">
            <div className="notification-item">
              <div className="notification-info">
                <span className="notification-label">Order Updates</span>
                <span className="notification-description">Get notified when orders are processed, shipped, or delivered</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="notification-item">
              <div className="notification-info">
                <span className="notification-label">Customer Messages</span>
                <span className="notification-description">Receive notifications for new customer inquiries and support requests</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="notification-item">
              <div className="notification-info">
                <span className="notification-label">Inventory Alerts</span>
                <span className="notification-description">Get notified when products are running low on stock</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="notification-item">
              <div className="notification-info">
                <span className="notification-label">Marketing Updates</span>
                <span className="notification-description">Receive updates about new features and promotional opportunities</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          
          <h4>Push Notifications</h4>
          <div className="notification-settings">
            <div className="notification-item">
              <div className="notification-info">
                <span className="notification-label">Mobile Notifications</span>
                <span className="notification-description">Receive push notifications on your mobile device</span>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="settings-content">
      <div className="billing-section">
        <div className="form-section">
          <h4>Billing Information</h4>
          <div className="billing-info">
            <div className="billing-card">
              <div className="card-header">
                <CreditCard className="w-6 h-6" />
                <span>Current Plan: Professional</span>
              </div>
              <div className="card-details">
                <div className="plan-price">$29.99/month</div>
                <div className="plan-features">
                  <span>• Up to 1000 products</span>
                  <span>• Advanced analytics</span>
                  <span>• Priority support</span>
                </div>
              </div>
              <button className="upgrade-btn">Upgrade Plan</button>
            </div>
          </div>
          
          <h4>Payment Method</h4>
          <div className="payment-method">
            <div className="payment-card">
              <div className="card-icon">💳</div>
              <div className="card-info">
                <span className="card-number">•••• •••• •••• 1234</span>
                <span className="card-expiry">Expires 12/25</span>
              </div>
              <button className="edit-payment-btn">Edit</button>
            </div>
          </div>
          
          <h4>Billing History</h4>
          <div className="billing-history">
            <div className="billing-item">
              <div className="billing-info">
                <span className="billing-date">January 2024</span>
                <span className="billing-amount">$29.99</span>
              </div>
              <span className="billing-status paid">Paid</span>
            </div>
            <div className="billing-item">
              <div className="billing-info">
                <span className="billing-date">December 2023</span>
                <span className="billing-amount">$29.99</span>
              </div>
              <span className="billing-status paid">Paid</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'business':
        return renderBusinessTab();
      case 'security':
        return renderSecurityTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'billing':
        return renderBillingTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <div className="settings-header__left">
          <h1>Settings ⚙️</h1>
          <p>Manage your account, business settings, and preferences</p>
        </div>
        <div className="settings-header__right">
          {!isEditing ? (
            <button className="edit-settings-btn" onClick={() => setIsEditing(true)}>
              <Edit className="w-5 h-5" />
              Edit Settings
            </button>
          ) : (
            <div className="edit-actions">
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSave}>
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Settings Content */}
      <div className="settings-container">
        {/* Sidebar */}
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="settings-main">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
