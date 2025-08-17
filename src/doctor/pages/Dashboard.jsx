import React from 'react';
import './Dashboard.css';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaClipboardList, 
  FaExclamationTriangle,
  FaPlus,
  FaPills,
  FaChartBar
} from 'react-icons/fa';

const Dashboard = () => {
  // Sample data for the dashboard
  const stats = [
    { title: "Total Patients", value: "156", icon: <FaUsers />, color: "#4CAF50" },
    { title: "Today's Appointments", value: "8", icon: <FaCalendarAlt />, color: "#2196F3" },
    { title: "Pending Reports", value: "12", icon: <FaClipboardList />, color: "#FF9800" },
    { title: "Emergency Cases", value: "2", icon: <FaExclamationTriangle />, color: "#F44336" }
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
    { title: "Add New Patient", icon: <FaPlus />, action: "add-patient" },
    { title: "Schedule Appointment", icon: <FaCalendarAlt />, action: "schedule" },
    { title: "Write Prescription", icon: <FaPills />, action: "prescription" },
    { title: "View Reports", icon: <FaChartBar />, action: "reports" }
  ];

  return (
    <div className="doctor-dashboard-container">
     
      <div className="doctor-dashboard-header">
        <h1>Welcome back, Dr. Sarah Johnson</h1>
        <p>Here's what's happening today in your practice</p>
        <div className="doctor-dashboard-header-decoration"></div>
      </div>

      {/* Statistics Cards */}
      <div className="doctor-dashboard-stats">
        {stats.map((stat, index) => (
          <div key={index} className="doctor-stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="doctor-stat-card-icon" style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className="doctor-stat-card-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="doctor-dashboard-content">
        {/* Left Column */}
        <div className="doctor-dashboard-left">
          {/* Recent Appointments */}
          <div className="doctor-dashboard-section">
            <div className="doctor-section-header">
              <h2>Today's Appointments</h2>
              <button className="doctor-view-all-btn">View All</button>
            </div>
            <div className="doctor-appointments-list">
              {recentAppointments.map(appointment => (
                <div key={appointment.id} className="doctor-appointment-item">
                  <div className="doctor-appointment-time">{appointment.time}</div>
                  <div className="doctor-appointment-details">
                    <h4>{appointment.patient}</h4>
                    <p>{appointment.type}</p>
                  </div>
                  <div className={`doctor-appointment-status ${appointment.status.toLowerCase()}`}>
                    {appointment.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="doctor-dashboard-section">
            <h2>Quick Actions</h2>
            <div className="doctor-quick-actions">
              {quickActions.map((action, index) => (
                <button key={index} className="doctor-quick-action-btn">
                  <span className="doctor-quick-action-icon">{action.icon}</span>
                  <span>{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="doctor-dashboard-right">
          {/* Recent Patients */}
          <div className="doctor-dashboard-section">
            <div className="doctor-section-header">
              <h2>Recent Patients</h2>
              <button className="doctor-view-all-btn">View All</button>
            </div>
            <div className="doctor-patients-list">
              {recentPatients.map(patient => (
                <div key={patient.id} className="doctor-patient-item">
                  <div className="doctor-patient-avatar">
                    <img src={`/images/${patient.id}.png`} alt={patient.name} />
                  </div>
                  <div className="doctor-patient-info">
                    <h4>{patient.name}</h4>
                    <p className="doctor-patient-age">{patient.age} years old</p>
                    <p className="doctor-patient-condition">{patient.condition}</p>
                    <p className="doctor-patient-last-visit">Last visit: {patient.lastVisit}</p>
                  </div>
                  <button className="doctor-patient-action-btn">View</button>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="doctor-dashboard-section">
            <h2>This Week's Schedule</h2>
            <div className="doctor-calendar-widget">
              <div className="doctor-calendar-header">
                <button className="doctor-calendar-nav">‹</button>
                <span>December 2024</span>
                <button className="doctor-calendar-nav">›</button>
              </div>
              <div className="doctor-calendar-grid">
                {Array.from({ length: 7 }, (_, i) => (
                  <div key={i} className="doctor-calendar-day">
                    <span className="doctor-day-number">{i + 1}</span>
                    <div className="doctor-day-appointments">
                      {i === 0 && <span className="doctor-appointment-dot">3</span>}
                      {i === 2 && <span className="doctor-appointment-dot">2</span>}
                      {i === 4 && <span className="doctor-appointment-dot">1</span>}
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