import React, { useState } from 'react';
import { FiUsers, FiCalendar, FiHeart, FiAlertTriangle, FiPlus, FiFileText, FiBookOpen, FiPhone, FiMail, FiMapPin, FiEdit, FiSave, FiX, FiHome, FiTrendingUp, FiBell, FiBarChart2, FiUser, FiClipboard } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const [isEditingContacts, setIsEditingContacts] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: 'Emergency Services', role: 'Emergency', phone: '911' },
    { id: 2, name: 'Hospital Emergency', role: 'Hospital', phone: '(555) 123-4567' },
    { id: 3, name: 'OB/GYN On-Call', role: 'Doctor', phone: '(555) 234-5678' },
    { id: 4, name: 'Ambulance Service', role: 'Ambulance', phone: '(555) 345-6789' }
  ]);

  const [editingContact, setEditingContact] = useState(null);

  // Stats based on actual data from other pages
  const stats = [
    { title: 'Total Moms', value: 24, change: '+2 this week', color: 'blue', icon: FiUsers },
    { title: 'Active Pregnancies', value: 20, change: '+1 this month', color: 'purple', icon: FiHeart },
    { title: 'Today\'s Appointments', value: 8, change: '+3 vs yesterday', color: 'green', icon: FiCalendar },
    { title: 'Emergency Alerts (24h)', value: 2, change: 'stable', color: 'red', icon: FiAlertTriangle }
  ];

  // Quick actions based on actual page functionality
  const quickActions = [
    { title: 'Manage Moms', icon: FiUser, color: 'blue', action: 'moms-list' },
    { title: 'Schedule Appointment', icon: FiCalendar, color: 'green', action: 'appointments' },
    { title: 'Medical Records', icon: FiFileText, color: 'purple', action: 'medical-records' },
    { title: 'Emergency Alerts', icon: FiBell, color: 'red', action: 'emergency' }
  ];

  // Recent activities based on actual functionality
  const recentActivities = [
    { type: 'Appointment', description: 'Emma Wilson - Prenatal checkup completed', time: '1 hour ago', status: 'completed' },
    { type: 'Medical Record', description: 'Sarah Davis - BP and weight logged', time: '3 hours ago', status: 'updated' },
    { type: 'Emergency', description: 'Maria Garcia - Dizziness reported (advised hydration)', time: '5 hours ago', status: 'resolved' },
    { type: 'Education', description: 'Shared: First trimester nutrition guide', time: 'Yesterday', status: 'published' },
    { type: 'Analytics', description: 'Monthly health metrics report generated', time: '2 days ago', status: 'completed' }
  ];

  // Pregnancy stages based on actual moms data
  const pregnancyStages = [
    { stage: 'First Trimester', count: 6, percentage: 30 },
    { stage: 'Second Trimester', count: 10, percentage: 50 },
    { stage: 'Third Trimester', count: 4, percentage: 20 }
  ];

  // Upcoming appointments based on actual appointments page
  const upcomingAppointments = [
    { name: 'Jennifer Lee', time: '09:00 AM', type: 'Prenatal Checkup' },
    { name: 'Maria Garcia', time: '11:30 AM', type: 'Ultrasound' },
    { name: 'Emma Wilson', time: '02:15 PM', type: 'Weight Check' }
  ];

  // Emergency alerts based on actual emergency page
  const emergencyAlerts = [
    { momName: 'Sarah Davis', priority: 'High', time: '14:30', note: 'Strong contractions, 2 minutes apart' },
    { momName: 'Maria Garcia', priority: 'Critical', time: '15:45', note: 'Severe bleeding, feeling dizzy' }
  ];

  // Analytics summary based on actual analytics page
  const analyticsSummary = {
    totalAppointments: 156,
    completed: 142,
    cancelled: 8,
    pending: 6,
    averageAge: 28.5,
    mostCommonBloodType: "O+"
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'moms-list':
        console.log('Navigate to moms list');
        break;
      case 'appointments':
        console.log('Navigate to appointments');
        break;
      case 'medical-records':
        console.log('Navigate to medical records');
        break;
      case 'emergency':
        console.log('Navigate to emergency page');
        break;
      default:
        break;
    }
  };

  const handleEditContact = (contact) => {
    setEditingContact({ ...contact });
  };

  const handleSaveContact = () => {
    if (editingContact) {
      setEmergencyContacts(prev => 
        prev.map(contact => 
          contact.id === editingContact.id ? editingContact : contact
        )
      );
      setEditingContact(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
  };

  const handleContactChange = (field, value) => {
    setEditingContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="midwife-dashboard-page">
      <div className="midwife-dashboard-container">
        <div className="midwife-dashboard">
          <div className="midwife-dashboard__header">
            <div className="midwife-dashboard__header-icon">
              <FiUsers className="w-6 h-6" />
            </div>
            <div className="midwife-dashboard__welcome">
              <h1>Welcome back, Sarah</h1>
              <p>Here's what's happening with your moms today</p>
            </div>
          </div>

          <div className="midwife-dashboard__stats">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className={`midwife-stat-card midwife-stat-card--${stat.color}`}>
                  <div className="midwife-stat-card__icon">
                    <IconComponent size={24} />
                  </div>
                  <div className="midwife-stat-card__content">
                    <h3 className="midwife-stat-card__title">{stat.title}</h3>
                    <div className="midwife-stat-card__value">{stat.value}</div>
                    <div className={`midwife-stat-card__change midwife-stat-card__change--${stat.change.includes('+') ? 'positive' : stat.change.includes('-') ? 'negative' : 'neutral'}`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="midwife-dashboard__main-content">
            <div className="midwife-dashboard__left">
              <div className="midwife-dashboard__section">
                <h2>Recent Activities</h2>
                <div className="midwife-activities-list">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className={`midwife-activity-item midwife-activity-item--${activity.status}`}>
                      <div className="midwife-activity-item__icon">
                        {activity.type === 'Appointment' && <FiCalendar size={16} />}
                        {activity.type === 'Medical Record' && <FiFileText size={16} />}
                        {activity.type === 'Emergency' && <FiAlertTriangle size={16} />}
                        {activity.type === 'Education' && <FiBookOpen size={16} />}
                        {activity.type === 'Analytics' && <FiBarChart2 size={16} />}
                      </div>
                      <div className="midwife-activity-item__content">
                        <p className="midwife-activity-item__description">{activity.description}</p>
                        <span className="midwife-activity-item__time">{activity.time}</span>
                      </div>
                      <div className={`midwife-activity-item__status midwife-activity-item__status--${activity.status}`}>
                        {activity.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="midwife-dashboard__section">
                <h2>Pregnancy Stages Overview</h2>
                <div className="midwife-pregnancy-stages">
                  {pregnancyStages.map((stage, index) => (
                    <div key={index} className="midwife-pregnancy-stage">
                      <div className="midwife-pregnancy-stage__header">
                        <h3>{stage.stage}</h3>
                        <span className="midwife-pregnancy-stage__count">{stage.count} moms</span>
                      </div>
                      <div className="midwife-pregnancy-stage__progress">
                        <div 
                          className="midwife-pregnancy-stage__bar" 
                          style={{ width: `${stage.percentage}%` }}
                        ></div>
                      </div>
                      <span className="midwife-pregnancy-stage__percentage">{stage.percentage}%</span>
                    </div>
                  ))}
                </div>
                
                <div className="midwife-dashboard-summary">
                  <h3>Analytics Summary</h3>
                  <div className="midwife-summary-stats">
                    <div className="midwife-summary-stat">
                      <div className="midwife-summary-stat__value">{analyticsSummary.totalAppointments}</div>
                      <div className="midwife-summary-stat__label">Total Appointments</div>
                    </div>
                    <div className="midwife-summary-stat">
                      <div className="midwife-summary-stat__value">{analyticsSummary.completed}</div>
                      <div className="midwife-summary-stat__label">Completed</div>
                    </div>
                    <div className="midwife-summary-stat">
                      <div className="midwife-summary-stat__value">{analyticsSummary.pending}</div>
                      <div className="midwife-summary-stat__label">Pending</div>
                    </div>
                    <div className="midwife-summary-stat">
                      <div className="midwife-summary-stat__value">{analyticsSummary.mostCommonBloodType}</div>
                      <div className="midwife-summary-stat__label">Most Common Blood Type</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="midwife-dashboard__right">
              <div className="midwife-dashboard__section">
                <h2>Quick Actions</h2>
                <div className="midwife-quick-actions">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <button 
                        key={index} 
                        className={`midwife-quick-action midwife-quick-action--${action.color}`}
                        onClick={() => handleQuickAction(action.action)}
                      >
                        <div className="midwife-quick-action__icon">
                          <IconComponent size={20} />
                        </div>
                        <span className="midwife-quick-action__title">{action.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="midwife-dashboard__section">
                <h2>Upcoming Appointments</h2>
                <div className="midwife-appointments-list">
                  {upcomingAppointments.map((appointment, index) => (
                    <div key={index} className="midwife-appointment-item">
                      <div className="midwife-appointment-item__time">{appointment.time}</div>
                      <div className="midwife-appointment-item__content">
                        <h4 className="midwife-appointment-item__name">{appointment.name}</h4>
                        <p className="midwife-appointment-item__type">{appointment.type}</p>
                      </div>
                      <button className="midwife-appointment-item__action">View</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="midwife-dashboard__section">
                <h2>Emergency Alerts</h2>
                <div className="midwife-emergency-alerts">
                  {emergencyAlerts.map((alert, index) => (
                    <div key={index} className="midwife-emergency-alert">
                      <div className="midwife-emergency-alert__info">
                        <h4 className="midwife-emergency-alert__name">{alert.momName}</h4>
                        <p className="midwife-emergency-alert__note">{alert.note}</p>
                        <p className="midwife-emergency-alert__time">{alert.time}</p>
                      </div>
                      <div className={`midwife-emergency-alert__priority midwife-emergency-alert__priority--${alert.priority.toLowerCase()}`}>
                        {alert.priority}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="midwife-dashboard__section">
                <div className="midwife-emergency-contacts-header">
                  <h2>Emergency Contacts</h2>
                  <button 
                    className="midwife-edit-contacts-btn"
                    onClick={() => setIsEditingContacts(!isEditingContacts)}
                  >
                    {isEditingContacts ? <FiSave size={16} /> : <FiEdit size={16} />}
                  </button>
                </div>
                <div className="midwife-emergency-contacts">
                  {emergencyContacts.map((contact, index) => (
                    <div key={contact.id} className="midwife-emergency-contact">
                      <div className="midwife-emergency-contact__info">
                        {editingContact && editingContact.id === contact.id ? (
                          <div className="midwife-contact-edit-form">
                            <input
                              type="text"
                              value={editingContact.name}
                              onChange={(e) => handleContactChange('name', e.target.value)}
                              className="midwife-contact-edit-input"
                            />
                            <input
                              type="text"
                              value={editingContact.role}
                              onChange={(e) => handleContactChange('role', e.target.value)}
                              className="midwife-contact-edit-input"
                            />
                            <input
                              type="text"
                              value={editingContact.phone}
                              onChange={(e) => handleContactChange('phone', e.target.value)}
                              className="midwife-contact-edit-input"
                            />
                          </div>
                        ) : (
                          <>
                            <h4 className="midwife-emergency-contact__name">{contact.name}</h4>
                            <p className="midwife-emergency-contact__role">{contact.role}</p>
                            <p className="midwife-emergency-contact__phone">{contact.phone}</p>
                          </>
                        )}
                      </div>
                      <div className="midwife-emergency-contact__actions">
                        {isEditingContacts && !editingContact && (
                          <button 
                            className="midwife-contact-edit-btn"
                            onClick={() => handleEditContact(contact)}
                          >
                            <FiEdit size={14} />
                          </button>
                        )}
                        {editingContact && editingContact.id === contact.id && (
                          <>
                            <button 
                              className="midwife-contact-save-btn"
                              onClick={handleSaveContact}
                            >
                              <FiSave size={14} />
                            </button>
                            <button 
                              className="midwife-contact-cancel-btn"
                              onClick={handleCancelEdit}
                            >
                              <FiX size={14} />
                            </button>
                          </>
                        )}
                        {!isEditingContacts && (
                          <button className="midwife-emergency-contact__call">
                            <FiPhone size={16} />
                          </button>
                        )}
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

export default Dashboard; 