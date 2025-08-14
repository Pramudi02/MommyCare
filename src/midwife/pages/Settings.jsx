import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@midwifecare.com",
    phone: "(555) 123-4567",
    license: "MW-12345",
    specialization: "Prenatal Care",
    experience: "8 years",
    location: "City General Hospital",
    bio: "Experienced midwife specializing in prenatal care and natural childbirth. Committed to providing compassionate care to mothers and families."
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    emergencyAlerts: true,
    weeklyReports: false,
    patientUpdates: true
  });

  const [preferences, setPreferences] = useState({
    language: "English",
    timezone: "EST",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12-hour",
    theme: "Light",
    autoSave: true
  });

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field) => {
    setNotifications(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSettings = () => {
    console.log('Saving settings...');
    // In a real app, this would save to backend
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="settings-title">
          <h1>⚙️ Settings</h1>
          <p>Manage your profile, preferences, and system settings</p>
        </div>
        <button className="save-btn" onClick={saveSettings}>
          💾 Save Changes
        </button>
      </div>

      <div className="settings-content">
        {/* Settings Tabs */}
        <div className="settings-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            🔔 Notifications
          </button>
          <button 
            className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            🎨 Preferences
          </button>
          <button 
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🔒 Security
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'profile' && (
            <div className="profile-content">
              <div className="profile-header">
                <h2>Profile Information</h2>
                <p>Update your personal and professional information</p>
              </div>

              <div className="profile-section">
                <div className="profile-avatar">
                  <div className="avatar-placeholder">👩‍⚕️</div>
                  <button className="change-avatar-btn">Change Photo</button>
                </div>

                <div className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => handleProfileChange('name', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>License Number</label>
                      <input
                        type="text"
                        value={profileData.license}
                        onChange={(e) => handleProfileChange('license', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Specialization</label>
                      <input
                        type="text"
                        value={profileData.specialization}
                        onChange={(e) => handleProfileChange('specialization', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Years of Experience</label>
                      <input
                        type="text"
                        value={profileData.experience}
                        onChange={(e) => handleProfileChange('experience', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Work Location</label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleProfileChange('location', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                      className="form-input"
                      rows="4"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="notifications-content">
              <div className="notifications-header">
                <h2>Notification Settings</h2>
                <p>Choose how you want to receive notifications</p>
              </div>

              <div className="notifications-section">
                <div className="notification-group">
                  <h3>Communication Preferences</h3>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Email Notifications</h4>
                      <p>Receive updates and reports via email</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.emailNotifications}
                        onChange={() => handleNotificationChange('emailNotifications')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>SMS Notifications</h4>
                      <p>Receive urgent alerts via text message</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.smsNotifications}
                        onChange={() => handleNotificationChange('smsNotifications')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="notification-group">
                  <h3>Appointment & Patient Updates</h3>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Appointment Reminders</h4>
                      <p>Get reminded about upcoming appointments</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.appointmentReminders}
                        onChange={() => handleNotificationChange('appointmentReminders')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Patient Updates</h4>
                      <p>Receive updates about patient status changes</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.patientUpdates}
                        onChange={() => handleNotificationChange('patientUpdates')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="notification-group">
                  <h3>System & Reports</h3>
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Emergency Alerts</h4>
                      <p>Immediate notifications for emergency situations</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.emergencyAlerts}
                        onChange={() => handleNotificationChange('emergencyAlerts')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Weekly Reports</h4>
                      <p>Receive weekly summary reports</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications.weeklyReports}
                        onChange={() => handleNotificationChange('weeklyReports')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="preferences-content">
              <div className="preferences-header">
                <h2>System Preferences</h2>
                <p>Customize your application experience</p>
              </div>

              <div className="preferences-section">
                <div className="preference-group">
                  <h3>Display & Language</h3>
                  <div className="preference-item">
                    <label>Language</label>
                    <select
                      value={preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                      className="form-select"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  </div>

                  <div className="preference-item">
                    <label>Theme</label>
                    <select
                      value={preferences.theme}
                      onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                      className="form-select"
                    >
                      <option value="Light">Light</option>
                      <option value="Dark">Dark</option>
                      <option value="Auto">Auto</option>
                    </select>
                  </div>
                </div>

                <div className="preference-group">
                  <h3>Date & Time</h3>
                  <div className="preference-item">
                    <label>Timezone</label>
                    <select
                      value={preferences.timezone}
                      onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                      className="form-select"
                    >
                      <option value="EST">Eastern Time (EST)</option>
                      <option value="CST">Central Time (CST)</option>
                      <option value="MST">Mountain Time (MST)</option>
                      <option value="PST">Pacific Time (PST)</option>
                    </select>
                  </div>

                  <div className="preference-item">
                    <label>Date Format</label>
                    <select
                      value={preferences.dateFormat}
                      onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                      className="form-select"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="preference-item">
                    <label>Time Format</label>
                    <select
                      value={preferences.timeFormat}
                      onChange={(e) => handlePreferenceChange('timeFormat', e.target.value)}
                      className="form-select"
                    >
                      <option value="12-hour">12-hour</option>
                      <option value="24-hour">24-hour</option>
                    </select>
                  </div>
                </div>

                <div className="preference-group">
                  <h3>System Settings</h3>
                  <div className="preference-item">
                    <div className="preference-info">
                      <h4>Auto Save</h4>
                      <p>Automatically save changes as you work</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={preferences.autoSave}
                        onChange={() => handlePreferenceChange('autoSave', !preferences.autoSave)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="security-content">
              <div className="security-header">
                <h2>Security Settings</h2>
                <p>Manage your account security and privacy</p>
              </div>

              <div className="security-section">
                <div className="security-group">
                  <h3>Password & Authentication</h3>
                  <div className="security-item">
                    <div className="security-info">
                      <h4>Change Password</h4>
                      <p>Update your account password</p>
                    </div>
                    <button className="security-btn">Change Password</button>
                  </div>

                  <div className="security-item">
                    <div className="security-info">
                      <h4>Two-Factor Authentication</h4>
                      <p>Add an extra layer of security to your account</p>
                    </div>
                    <button className="security-btn">Enable 2FA</button>
                  </div>
                </div>

                <div className="security-group">
                  <h3>Session Management</h3>
                  <div className="security-item">
                    <div className="security-info">
                      <h4>Active Sessions</h4>
                      <p>View and manage your active login sessions</p>
                    </div>
                    <button className="security-btn">View Sessions</button>
                  </div>

                  <div className="security-item">
                    <div className="security-info">
                      <h4>Logout All Devices</h4>
                      <p>Sign out from all devices and browsers</p>
                    </div>
                    <button className="security-btn danger">Logout All</button>
                  </div>
                </div>

                <div className="security-group">
                  <h3>Privacy & Data</h3>
                  <div className="security-item">
                    <div className="security-info">
                      <h4>Data Export</h4>
                      <p>Download a copy of your data</p>
                    </div>
                    <button className="security-btn">Export Data</button>
                  </div>

                  <div className="security-item">
                    <div className="security-info">
                      <h4>Delete Account</h4>
                      <p>Permanently delete your account and all data</p>
                    </div>
                    <button className="security-btn danger">Delete Account</button>
                  </div>
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
