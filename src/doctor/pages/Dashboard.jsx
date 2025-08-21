import React, { useEffect, useState } from 'react';
import { FiUsers, FiCalendar, FiClipboard, FiAlertTriangle, FiPlus, FiPackage, FiBarChart2, FiFileText, FiUser, FiClock, FiMapPin } from 'react-icons/fi';
import './Dashboard.css';
import { doctorAPI } from '../../services/api';

const Dashboard = () => {
  const [doctorName, setDoctorName] = useState('');
  const [todayCount, setTodayCount] = useState(0);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await doctorAPI.getDashboard();
        const doc = res?.data?.doctor || res?.doctor;
        const upcomingAppointments = res?.data?.upcomingAppointments || [];
        if (isMounted) {
          if (doc) setDoctorName(`Dr. ${doc.firstName} ${doc.lastName}`);
          setUpcoming(upcomingAppointments);
          const today = new Date().toDateString();
          setTodayCount(upcomingAppointments.filter(a => new Date(a.startTime).toDateString() === today).length);
        }
      } catch (e) {}
    })();
    return () => { isMounted = false; };
  }, []);

  // Sample data for the dashboard
  const stats = [
    { title: "Total Patients", value: "-", icon: FiUsers, color: "blue" },
    { title: "Today's Appointments", value: String(todayCount), icon: FiCalendar, color: "purple" },
    { title: "Pending Reports", value: "12", icon: FiClipboard, color: "pink" },
    { title: "Emergency Cases", value: "2", icon: FiAlertTriangle, color: "red" }
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
    { title: "Add New Patient", icon: FiPlus, color: "blue", action: "add-patient" },
    { title: "Schedule Appointment", icon: FiCalendar, color: "green", action: "schedule" },
    { title: "Write Prescription", icon: FiPackage, color: "purple", action: "prescription" },
    { title: "View Reports", icon: FiBarChart2, color: "pink", action: "reports" }
  ];

  const handleQuickAction = (action) => {
    switch (action) {
      case 'add-patient':
        console.log('Navigate to add patient');
        break;
      case 'schedule':
        console.log('Navigate to schedule appointment');
        break;
      case 'prescription':
        console.log('Navigate to prescription');
        break;
      case 'reports':
        console.log('Navigate to reports');
        break;
      default:
        break;
    }
  };

  return (
    <div className="doctor-dashboard-page">
      <div className="doctor-dashboard-container">
        <div className="doctor-dashboard">
          <div className="doctor-dashboard__header">
            <div className="doctor-dashboard__header-icon">
              <FiUser className="w-6 h-6" />
            </div>
            <div className="doctor-dashboard__welcome">
              <h1>Welcome back, {doctorName || 'Doctor'}</h1>
              <p>Here's what's happening today in your practice</p>
            </div>
          </div>

          <div className="doctor-dashboard__stats">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className={`doctor-stat-card doctor-stat-card--${stat.color}`}>
                  <div className="doctor-stat-card__icon">
                    <IconComponent size={24} />
                  </div>
                  <div className="doctor-stat-card__content">
                    <h3 className="doctor-stat-card__title">{stat.title}</h3>
                    <div className="doctor-stat-card__value">{stat.value}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="doctor-dashboard__main-content">
            <div className="doctor-dashboard__left">
              <div className="doctor-dashboard__section">
                <h2>Today's Appointments</h2>
                <div className="doctor-appointments-list">
                  {(upcoming.length ? upcoming : recentAppointments).map((appointment, index) => (
                    <div key={appointment.id || `appointment-${index}`} className="doctor-appointment-item">
                      <div className="doctor-appointment-item__icon">
                        <FiClock size={16} />
                      </div>
                      <div className="doctor-appointment-item__content">
                        <div className="doctor-appointment-item__time">{appointment.time || new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="doctor-appointment-item__details">
                          <h4 className="doctor-appointment-item__name">{appointment.patient?.firstName ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : appointment.patient}</h4>
                          <p className="doctor-appointment-item__type">{appointment.type || 'Consultation'}</p>
                        </div>
                      </div>
                      <div className={`doctor-appointment-item__status doctor-appointment-item__status--${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="doctor-dashboard__section">
                <h2>Quick Actions</h2>
                <div className="doctor-quick-actions">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <button 
                        key={index} 
                        className={`doctor-quick-action doctor-quick-action--${action.color}`}
                        onClick={() => handleQuickAction(action.action)}
                      >
                        <div className="doctor-quick-action__icon">
                          <IconComponent size={20} />
                        </div>
                        <span className="doctor-quick-action__title">{action.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="doctor-dashboard__right">
              <div className="doctor-dashboard__section">
                <h2>Recent Patients</h2>
                <div className="doctor-patients-list">
                  {recentPatients.map(patient => (
                    <div key={patient.id} className="doctor-patient-item">
                      <div className="doctor-patient-item__avatar">
                        <img src={`/images/${patient.id}.png`} alt={patient.name} />
                      </div>
                      <div className="doctor-patient-item__info">
                        <h4 className="doctor-patient-item__name">{patient.name}</h4>
                        <p className="doctor-patient-item__age">{patient.age} years old</p>
                        <p className="doctor-patient-item__condition">{patient.condition}</p>
                        <p className="doctor-patient-item__last-visit">Last visit: {patient.lastVisit}</p>
                      </div>
                      <button className="doctor-patient-item__action">View</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="doctor-dashboard__section">
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
      </div>
    </div>
  );
};

export default Dashboard;