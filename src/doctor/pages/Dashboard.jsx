import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  // Sample data for the dashboard
  const stats = [
    { title: "Total Patients", value: "156", icon: "👥", color: "#4CAF50" },
    { title: "Today's Appointments", value: "8", icon: "📅", color: "#2196F3" },
    { title: "Pending Reports", value: "12", icon: "📋", color: "#FF9800" },
    { title: "Emergency Cases", value: "2", icon: "🚨", color: "#F44336" }
  ];

  const recentAppointments = [
    { id: 1, patient: "Emma Wilson", time: "09:00 AM", type: "Prenatal Checkup", status: "Confirmed" },
    { id: 2, patient: "Sophia Rodriguez", time: "10:30 AM", type: "Ultrasound", status: "Confirmed" },
    { id: 3, patient: "Isabella Chen", time: "02:00 PM", type: "Follow-up", status: "Pending" },
    { id: 4, patient: "Mia Johnson", time: "03:30 PM", type: "Emergency", status: "Confirmed" }
  ];

  const recentPatients = [
    { id: 1, name: "Emma Wilson", age: 28, lastVisit: "2 days ago", condition: "Pregnancy - 24 weeks" },
    { id: 2, name: "Sophia Rodriguez", age: 32, lastVisit: "1 week ago", condition: "Pregnancy - 18 weeks" },
    { id: 3, name: "Isabella Chen", age: 25, lastVisit: "3 days ago", condition: "Postpartum - 6 weeks" },
    { id: 4, name: "Mia Johnson", age: 30, lastVisit: "Today", condition: "Pregnancy - 32 weeks" }
  ];

  const quickActions = [
    { title: "Add New Patient", icon: "➕", action: "add-patient" },
    { title: "Schedule Appointment", icon: "📅", action: "schedule" },
    { title: "Write Prescription", icon: "💊", action: "prescription" },
    { title: "View Reports", icon: "📊", action: "reports" }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>Welcome back, Dr. Sarah Johnson</h1>
        <p>Here's what's happening today in your practice</p>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard__stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-card__icon" style={{ backgroundColor: stat.color }}>
              <span>{stat.icon}</span>
            </div>
            <div className="stat-card__content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard__content">
        {/* Left Column */}
        <div className="dashboard__left">
          {/* Recent Appointments */}
          <div className="dashboard__section">
            <div className="section-header">
              <h2>Today's Appointments</h2>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="appointments-list">
              {recentAppointments.map(appointment => (
                <div key={appointment.id} className="appointment-item">
                  <div className="appointment-time">{appointment.time}</div>
                  <div className="appointment-details">
                    <h4>{appointment.patient}</h4>
                    <p>{appointment.type}</p>
                  </div>
                  <div className={`appointment-status ${appointment.status.toLowerCase()}`}>
                    {appointment.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard__section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              {quickActions.map((action, index) => (
                <button key={index} className="quick-action-btn">
                  <span className="quick-action-icon">{action.icon}</span>
                  <span>{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard__right">
          {/* Recent Patients */}
          <div className="dashboard__section">
            <div className="section-header">
              <h2>Recent Patients</h2>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="patients-list">
              {recentPatients.map(patient => (
                <div key={patient.id} className="patient-item">
                  <div className="patient-avatar">
                    <img src={`/images/${patient.id}.png`} alt={patient.name} />
                  </div>
                  <div className="patient-info">
                    <h4>{patient.name}</h4>
                    <p className="patient-age">{patient.age} years old</p>
                    <p className="patient-condition">{patient.condition}</p>
                    <p className="patient-last-visit">Last visit: {patient.lastVisit}</p>
                  </div>
                  <button className="patient-action-btn">View</button>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="dashboard__section">
            <h2>This Week's Schedule</h2>
            <div className="calendar-widget">
              <div className="calendar-header">
                <button className="calendar-nav">‹</button>
                <span>December 2024</span>
                <button className="calendar-nav">›</button>
              </div>
              <div className="calendar-grid">
                {Array.from({ length: 7 }, (_, i) => (
                  <div key={i} className="calendar-day">
                    <span className="day-number">{i + 1}</span>
                    <div className="day-appointments">
                      {i === 0 && <span className="appointment-dot">3</span>}
                      {i === 2 && <span className="appointment-dot">2</span>}
                      {i === 4 && <span className="appointment-dot">1</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
