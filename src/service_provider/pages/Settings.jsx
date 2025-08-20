import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  User, 
  Globe, 
  Save,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Smartphone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [isSaving, setIsSaving] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState({
    newProductViews: true,
    externalLinkClicks: true,
    productApproval: true,
    weeklyReports: false,
    emailNotifications: true,
    pushNotifications: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    showContactInfo: true,
    showBusinessAddress: false,
    allowDirectMessages: true,
    showAnalytics: true
  });

  const [accountSettings, setAccountSettings] = useState({
    email: 'sarah@babycarestore.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield className="w-4 h-4" /> },
    { id: 'account', label: 'Account', icon: <User className="w-4 h-4" /> }
  ];

  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePrivacyChange = (setting) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleAccountChange = (field, value) => {
    setAccountSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle success
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="sp-settings-page">
      <div className="sp-settings-header">
        <div className="sp-settings-title">
          <h1>Settings</h1>
          <p>Manage your account preferences and notifications</p>
        </div>
        <div className="sp-settings-actions">
          <button 
            className="sp-btn sp-btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="sp-btn-icon" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="sp-settings-content">
        <div className="sp-settings-sidebar">
          <nav className="sp-settings-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`sp-nav-tab ${activeTab === tab.id ? 'sp-nav-tab-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="sp-settings-main">
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="sp-settings-section">
              <h2>Notification Preferences</h2>
              <p className="sp-section-description">
                Choose how you want to be notified about your product performance and platform updates.
              </p>

              <div className="sp-settings-group">
                <h3>Product Performance</h3>
                <div className="sp-setting-item">
                  <div className="sp-setting-info">
                    <h4>New Product Views</h4>
                    <p>Get notified when your products receive new views</p>
                  </div>
                  <label className="sp-toggle">
                    <input
                      type="checkbox"
                      checked={notificationSettings.newProductViews}
                      onChange={() => handleNotificationChange('newProductViews')}
                    />
                    <span className="sp-toggle-slider"></span>
                  </label>
                </div>

                <div className="sp-setting-item">
                  <div className="sp-setting-info">
                    <h4>External Link Clicks</h4>
                    <p>Receive notifications when customers click your product links</p>
                  </div>
                  <label className="sp-toggle">
                    <input
                      type="checkbox"
                      checked={notificationSettings.externalLinkClicks}
                      onChange={() => handleNotificationChange('externalLinkClicks')}
                    />
                    <span className="sp-toggle-slider"></span>
                  </label>
                </div>

                <div className="sp-setting-item">
                  <div className="sp-setting-info">
                    <h4>Product Approval Status</h4>
                    <p>Get notified when your products are approved or rejected</p>
                  </div>
                  <label className="sp-toggle">
                    <input
                      type="checkbox"
                      checked={notificationSettings.productApproval}
                      onChange={() => handleNotificationChange('productApproval')}
                    />
                    <span className="sp-toggle-slider"></span>
                  </label>
                </div>

                <div className="sp-setting-item">
                  <div className="sp-setting-info">
                    <h4>Weekly Performance Reports</h4>
                    <p>Receive weekly summaries of your product performance</p>
                  </div>
                  <label className="sp-toggle">
                    <input
                      type="checkbox"
                      checked={notificationSettings.weeklyReports}
                      onChange={() => handleNotificationChange('weeklyReports')}
                    />
                    <span className="sp-toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="sp-settings-group">
                <h3>Notification Methods</h3>
                <div className="sp-setting-item">
                  <div className="sp-setting-info">
                    <h4>Email Notifications</h4>
                    <p>Receive notifications via email</p>
                  </div>
                  <label className="sp-toggle">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={() => handleNotificationChange('emailNotifications')}
                    />
                    <span className="sp-toggle-slider"></span>
                  </label>
                </div>

                <div className="sp-setting-item">
                  <div className="sp-setting-info">
                    <h4>Push Notifications</h4>
                    <p>Receive notifications in your browser</p>
                  </div>
                  <label className="sp-toggle">
                    <input
                      type="checkbox"
                      checked={notificationSettings.pushNotifications}
                      onChange={() => handleNotificationChange('pushNotifications')}
                    />
                    <span className="sp-toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="sp-settings-section">
              <h2>Privacy Settings</h2>
              <p className="sp-section-description">
                Control what information is visible to customers and other users.
              </p>

              <div className="sp-settings-group">
                <h3>Profile Visibility</h3>
                <div className="sp-setting-item">
                  <div className="sp-setting-info">
                    <h4>Show Contact Information</h4>
                    <p>Display your email and phone number on your business profile</p>
                  </div>
                  <label className="sp-toggle">
                    <input
                      type="checkbox"
                      checked={privacySettings.showContactInfo}
                      onChange={() => handlePrivacyChange('showContactInfo')}
                    />
                    <span className="sp-toggle-slider"></span>
                  </label>
                </div>

                <div className="sp-setting-item">
                  <div className="sp-setting-info">
                    <h4>Show Business Address</h4>
                    <p>Display your business address on your profile</p>
                  </div>
                  <label className="sp-toggle">
                    <input
                      type="checkbox"
                      checked={privacySettings.showBusinessAddress}
                      onChange={() => handlePrivacyChange('showBusinessAddress')}
                    />
                    <span className="sp-toggle-slider"></span>
                  </label>
                </div>

                <div className="sp-setting-item">
                  <div className="sp-setting-info">
                    <h4>Allow Direct Messages</h4>
                    <p>Allow customers to send you direct messages</p>
                  </div>
                  <label className="sp-toggle">
                    <input
                      type="checkbox"
                      checked={privacySettings.allowDirectMessages}
                      onChange={() => handlePrivacyChange('allowDirectMessages')}
                    />
                    <span className="sp-toggle-slider"></span>
                  </label>
                </div>

                <div className="sp-setting-item">
                  <div className="sp-setting-info">
                    <h4>Show Analytics to Others</h4>
                    <p>Allow other service providers to see your performance metrics</p>
                  </div>
                  <label className="sp-toggle">
                    <input
                      type="checkbox"
                      checked={privacySettings.showAnalytics}
                      onChange={() => handlePrivacyChange('showAnalytics')}
                    />
                    <span className="sp-toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="sp-settings-section">
              <h2>Account Settings</h2>
              <p className="sp-section-description">
                Manage your account information and security settings.
              </p>

              <div className="sp-settings-group">
                <h3>Account Information</h3>
                <div className="sp-form-group">
                  <label className="sp-label">
                    <Mail className="sp-label-icon" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={accountSettings.email}
                    onChange={(e) => handleAccountChange('email', e.target.value)}
                    className="sp-input"
                  />
                </div>
              </div>

              <div className="sp-settings-group">
                <h3>Change Password</h3>
                <div className="sp-form-group">
                  <label className="sp-label">
                    <Lock className="sp-label-icon" />
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={accountSettings.currentPassword}
                    onChange={(e) => handleAccountChange('currentPassword', e.target.value)}
                    className="sp-input"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="sp-form-group">
                  <label className="sp-label">
                    <Lock className="sp-label-icon" />
                    New Password
                  </label>
                  <input
                    type="password"
                    value={accountSettings.newPassword}
                    onChange={(e) => handleAccountChange('newPassword', e.target.value)}
                    className="sp-input"
                    placeholder="Enter new password"
                  />
                </div>

                <div className="sp-form-group">
                  <label className="sp-label">
                    <Lock className="sp-label-icon" />
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={accountSettings.confirmPassword}
                    onChange={(e) => handleAccountChange('confirmPassword', e.target.value)}
                    className="sp-input"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="sp-settings-group">
                <h3>Account Actions</h3>
                <div className="sp-account-actions">
                  <button className="sp-btn sp-btn-secondary">
                    <Smartphone className="sp-btn-icon" />
                    Connect Mobile Device
                  </button>
                  <button className="sp-btn sp-btn-secondary">
                    <Globe className="sp-btn-icon" />
                    Export Data
                  </button>
                  <button className="sp-btn sp-btn-danger">
                    <AlertCircle className="sp-btn-icon" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
