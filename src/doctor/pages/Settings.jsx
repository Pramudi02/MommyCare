import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@mommycare.com",
    phone: "+1 (555) 123-4567",
    specialization: "Obstetrics & Gynecology",
    license: "MD-12345",
    experience: "15 years",
    education: "Harvard Medical School",
    bio: "Experienced OB/GYN specializing in maternal-fetal medicine and high-risk pregnancies."
  });

  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    workingHours: {
      monday: { start: "09:00", end: "17:00", active: true },
      tuesday: { start: "09:00", end: "17:00", active: true },
      wednesday: { start: "09:00", end: "17:00", active: true },
      thursday: { start: "09:00", end: "17:00", active: true },
      friday: { start: "09:00", end: "17:00", active: true },
      saturday: { start: "09:00", end: "13:00", active: false },
      sunday: { start: "09:00", end: "13:00", active: false }
    },
    appointmentDuration: 30,
    maxPatientsPerDay: 20
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordLastChanged: "2024-11-15"
  });

  const handleProfileUpdate = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceUpdate = (category, field, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleWorkingHoursUpdate = (day, field, value) => {
    setPreferences(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleSecurityUpdate = (field, value) => {
    setSecurity(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSettings = () => {
    // In a real app, this would save to the backend
    console.log('Settings saved:', { profileData, preferences, security });
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' }
  ];

  const renderProfileTab = () => (
    <div className="settings-section">
      <h3>Personal Information</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={profileData.firstName}
            onChange={(e) => handleProfileUpdate('firstName', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={profileData.lastName}
            onChange={(e) => handleProfileUpdate('lastName', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => handleProfileUpdate('email', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => handleProfileUpdate('phone', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Specialization</label>
          <input
            type="text"
            value={profileData.specialization}
            onChange={(e) => handleProfileUpdate('specialization', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>License Number</label>
          <input
            type="text"
            value={profileData.license}
            onChange={(e) => handleProfileUpdate('license', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Years of Experience</label>
          <input
            type="text"
            value={profileData.experience}
            onChange={(e) => handleProfileUpdate('experience', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Education</label>
          <input
            type="text"
            value={profileData.education}
            onChange={(e) => handleProfileUpdate('education', e.target.value)}
          />
        </div>
      </div>
      
      <div className="form-group">
        <label>Bio</label>
        <textarea
          value={profileData.bio}
          onChange={(e) => handleProfileUpdate('bio', e.target.value)}
          rows="4"
        />
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="settings-section">
      <h3>Working Hours</h3>
      <div className="working-hours">
        {Object.entries(preferences.workingHours).map(([day, hours]) => (
          <div key={day} className="working-day">
            <div className="day-header">
              <label className="day-checkbox">
                <input
                  type="checkbox"
                  checked={hours.active}
                  onChange={(e) => handleWorkingHoursUpdate(day, 'active', e.target.checked)}
                />
                <span className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
              </label>
            </div>
            {hours.active && (
              <div className="time-inputs">
                <input
                  type="time"
                  value={hours.start}
                  onChange={(e) => handleWorkingHoursUpdate(day, 'start', e.target.value)}
                />
                <span>to</span>
                <input
                  type="time"
                  value={hours.end}
                  onChange={(e) => handleWorkingHoursUpdate(day, 'end', e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <h3>Appointment Settings</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Default Appointment Duration (minutes)</label>
          <select
            value={preferences.appointmentDuration}
            onChange={(e) => handlePreferenceUpdate('appointmentDuration', null, parseInt(e.target.value))}
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>1 hour</option>
            <option value={90}>1.5 hours</option>
          </select>
        </div>
        <div className="form-group">
          <label>Maximum Patients Per Day</label>
          <input
            type="number"
            value={preferences.maxPatientsPerDay}
            onChange={(e) => handlePreferenceUpdate('maxPatientsPerDay', null, parseInt(e.target.value))}
            min="1"
            max="50"
          />
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="settings-section">
      <h3>Security Settings</h3>
      <div className="form-grid">
        <div className="form-group">
          <label>Two-Factor Authentication</label>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={security.twoFactorAuth}
              onChange={(e) => handleSecurityUpdate('twoFactorAuth', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="form-group">
          <label>Session Timeout (minutes)</label>
          <select
            value={security.sessionTimeout}
            onChange={(e) => handleSecurityUpdate('sessionTimeout', parseInt(e.target.value))}
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
          </select>
        </div>
        <div className="form-group">
          <label>Password Last Changed</label>
          <input
            type="date"
            value={security.passwordLastChanged}
            disabled
          />
        </div>
      </div>
      
      <div className="security-actions">
        <button className="btn btn-primary">Change Password</button>
        <button className="btn btn-outline">Update Security Questions</button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="settings-section">
      <h3>Notification Preferences</h3>
      <div className="notification-settings">
        <div className="notification-item">
          <div className="notification-info">
            <span className="notification-label">Email Notifications</span>
            <span className="notification-description">Receive notifications via email</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.notifications.email}
              onChange={(e) => handlePreferenceUpdate('notifications', 'email', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        
        <div className="notification-item">
          <div className="notification-info">
            <span className="notification-label">SMS Notifications</span>
            <span className="notification-description">Receive notifications via SMS</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.notifications.sms}
              onChange={(e) => handlePreferenceUpdate('notifications', 'sms', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        
        <div className="notification-item">
          <div className="notification-info">
            <span className="notification-label">Push Notifications</span>
            <span className="notification-description">Receive notifications in the app</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={preferences.notifications.push}
              onChange={(e) => handlePreferenceUpdate('notifications', 'push', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'preferences':
        return renderPreferencesTab();
      case 'security':
        return renderSecurityTab();
      case 'notifications':
        return renderNotificationsTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="settings-container">
        {/* Sidebar Navigation */}
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-name">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="settings-content">
          <div className="settings-header-tab">
            <h2>{tabs.find(tab => tab.id === activeTab)?.name}</h2>
            <button className="save-btn" onClick={saveSettings}>
              💾 Save Changes
            </button>
          </div>

          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
