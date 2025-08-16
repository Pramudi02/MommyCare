import React from 'react';
import { FiUsers, FiCalendar, FiHeart, FiAlertTriangle, FiPlus, FiFileText, FiBookOpen, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const stats = [
    { title: 'Active Moms', value: 24, change: '+3 from last week', color: 'blue', icon: FiUsers },
    { title: "Today's Appointments", value: 8, change: '+2 from last week', color: 'purple', icon: FiCalendar },
    { title: 'Due This Week', value: 3, change: '0 from last week', color: 'pink', icon: FiHeart },
    { title: 'Emergency Cases', value: 1, change: '-1 from last week', color: 'red', icon: FiAlertTriangle }
  ];

  const quickActions = [
    { title: 'Schedule Appointment', icon: FiPlus, color: 'blue' },
    { title: 'Add Medical Record', icon: FiFileText, color: 'green' },
    { title: 'Create Education Content', icon: FiBookOpen, color: 'purple' },
    { title: 'Emergency Contact', icon: FiPhone, color: 'red' }
  ];

  const recentActivities = [
    { type: 'Appointment', description: 'Emma Wilson - Prenatal Checkup', time: '2 hours ago', status: 'completed' },
    { type: 'Medical Record', description: 'Sarah Davis - Weight Update', time: '4 hours ago', status: 'updated' },
    { type: 'Emergency', description: 'Jennifer Lee - Urgent Call', time: '6 hours ago', status: 'resolved' },
    { type: 'Education', description: 'New Content Published', time: '1 day ago', status: 'published' }
  ];

  const pregnancyStages = [
    { stage: 'First Trimester', count: 8, percentage: 33 },
    { stage: 'Second Trimester', count: 12, percentage: 50 },
    { stage: 'Third Trimester', count: 4, percentage: 17 }
  ];

  const upcomingAppointments = [
    { name: 'Emma Wilson', time: '10:00 AM', type: 'Prenatal Checkup' },
    { name: 'Sarah Davis', time: '2:30 PM', type: 'Ultrasound' },
    { name: 'Jennifer Lee', time: '4:00 PM', type: 'Weight Check' }
  ];

  const emergencyContacts = [
    { name: 'Dr. Johnson', role: 'Gynecologist', phone: '+1 (555) 123-4567' },
    { name: 'Dr. Smith', role: 'Pediatrician', phone: '+1 (555) 234-5678' },
    { name: 'Emergency Hotline', role: '24/7 Support', phone: '+1 (555) 911-0000' }
  ];

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
        <div className="midwife-dashboard__filter">
          <select defaultValue="this-week">
            <option value="this-week">This Week</option>
            <option value="last-week">Last Week</option>
            <option value="this-month">This Month</option>
          </select>
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
              <h3>Weekly Summary</h3>
              <div className="midwife-summary-stats">
                <div className="midwife-summary-stat">
                  <div className="midwife-summary-stat__value">12</div>
                  <div className="midwife-summary-stat__label">New Appointments</div>
                </div>
                <div className="midwife-summary-stat">
                  <div className="midwife-summary-stat__value">8</div>
                  <div className="midwife-summary-stat__label">Completed Visits</div>
                </div>
                <div className="midwife-summary-stat">
                  <div className="midwife-summary-stat__value">3</div>
                  <div className="midwife-summary-stat__label">Emergency Calls</div>
                </div>
                <div className="midwife-summary-stat">
                  <div className="midwife-summary-stat__value">95%</div>
                  <div className="midwife-summary-stat__label">Satisfaction Rate</div>
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
                  <button key={index} className={`midwife-quick-action midwife-quick-action--${action.color}`}>
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
            <h2>Emergency Contacts</h2>
            <div className="midwife-emergency-contacts">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="midwife-emergency-contact">
                  <div className="midwife-emergency-contact__info">
                    <h4 className="midwife-emergency-contact__name">{contact.name}</h4>
                    <p className="midwife-emergency-contact__role">{contact.role}</p>
                    <p className="midwife-emergency-contact__phone">{contact.phone}</p>
                  </div>
                  <button className="midwife-emergency-contact__call">
                    <FiPhone size={16} />
                  </button>
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