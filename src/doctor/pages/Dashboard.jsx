import React, { useEffect, useState } from 'react';
import { FiUsers, FiCalendar, FiClipboard, FiAlertTriangle, FiPlus, FiPackage, FiBarChart2, FiFileText, FiUser, FiClock, FiMapPin, FiFilter, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import './Dashboard.css';
import { doctorAPI } from '../../services/api';

const Dashboard = () => {
  const [doctorName, setDoctorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState('today');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  
  // Dynamic data states
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    pendingReports: 0,
    emergencyCases: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [appointmentTrends, setAppointmentTrends] = useState({
    weekly: [],
    monthly: [],
    yearly: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, [dateFilter, customDateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch doctor info
      const doctorResponse = await doctorAPI.getDashboard();
      const doctor = doctorResponse?.data?.doctor || doctorResponse?.doctor;
      if (doctor) {
        setDoctorName(`Dr. ${doctor.firstName} ${doctor.lastName}`);
      }

      // Fetch patients with medical records
      

      // Fetch appointments based on date filter
      const appointmentsResponse = await doctorAPI.getAppointments();
      if (appointmentsResponse.status === 'success') {
        const filteredAppointments = filterAppointmentsByDate(appointmentsResponse.data || []);
        setAppointments(filteredAppointments);
        setStats(prev => ({ 
          ...prev, 
          totalAppointments: filteredAppointments.length,
          emergencyCases: filteredAppointments.filter(apt => apt.type === 'Emergency').length
        }));
      } else {
        setAppointments([]);
        setStats(prev => ({ 
          ...prev, 
          totalAppointments: 0,
          emergencyCases: 0
        }));
      }

      // Fetch medical reports count
 

      // Calculate trends
      calculateAppointmentTrends(appointmentsResponse?.data || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointmentsByDate = (appointments) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dateFilter) {
      case 'today':
        return appointments.filter(apt => {
          const aptDate = new Date(apt.startTime);
          return aptDate >= today && aptDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
        });
      
      case 'week':
        const weekStart = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
        return appointments.filter(apt => {
          const aptDate = new Date(apt.startTime);
          return aptDate >= weekStart && aptDate < weekEnd;
        });
      
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return appointments.filter(apt => {
          const aptDate = new Date(apt.startTime);
          return aptDate >= monthStart && aptDate < monthEnd;
        });
      
      case 'year':
        const yearStart = new Date(now.getFullYear(), 0, 1);
        const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
        return appointments.filter(apt => {
          const aptDate = new Date(apt.startTime);
          return aptDate >= yearStart && aptDate < yearEnd;
        });
      
      case 'custom':
        if (customDateRange.start && customDateRange.end) {
          const startDate = new Date(customDateRange.start);
          const endDate = new Date(customDateRange.end);
          return appointments.filter(apt => {
            const aptDate = new Date(apt.startTime);
            return aptDate >= startDate && aptDate <= endDate;
          });
        }
        return appointments;
      
      default:
        return appointments;
    }
  };

  const calculateAppointmentTrends = (allAppointments) => {
    if (!allAppointments || allAppointments.length === 0) {
      // Set default empty trends
      const weeklyData = [];
      const monthlyData = [];
      
      // Weekly trend (last 7 days)
      for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        weeklyData.push({ date: date.toLocaleDateString('en-US', { weekday: 'short' }), count: 0 });
      }
      
      // Monthly trend (last 12 months)
      for (let i = 11; i >= 0; i--) {
        const date = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
        monthlyData.push({ month: date.toLocaleDateString('en-US', { month: 'short' }), count: 0 });
      }
      
      setAppointmentTrends({ weekly: weeklyData, monthly: monthlyData });
      return;
    }
    
    const now = new Date();
    
    // Weekly trend (last 7 days)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const count = allAppointments.filter(apt => {
        const aptDate = new Date(apt.startTime);
        return aptDate.toDateString() === date.toDateString();
      }).length;
      weeklyData.push({ date: date.toLocaleDateString('en-US', { weekday: 'short' }), count });
    }
    
    // Monthly trend (last 12 months)
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const count = allAppointments.filter(apt => {
        const aptDate = new Date(apt.startTime);
        return aptDate.getMonth() === date.getMonth() && aptDate.getFullYear() === date.getFullYear();
      }).length;
      monthlyData.push({ month: date.toLocaleDateString('en-US', { month: 'short' }), count });
    }
    
    setAppointmentTrends({ weekly: weeklyData, monthly: monthlyData });
  };

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

  const getFilterLabel = () => {
    switch (dateFilter) {
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      case 'custom': return 'Custom Range';
      default: return 'Today';
    }
  };

  if (loading) {
    return (
      <div className="doctor-dashboard-page">
        <div className="doctor-dashboard-container">
          <div className="doctor-dashboard">
            <div className="loading-state">
              <FiUser className="loading-icon" />
              <p>Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doctor-dashboard-page">
        <div className="doctor-dashboard-container">
          <div className="doctor-dashboard">
            <div className="error-state">
              <FiUser className="error-icon" />
              <p>{error}</p>
              <button onClick={fetchDashboardData} className="retry-btn">Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const dashboardStats = [
    { title: "Total Patients", value: stats.totalPatients, icon: FiUsers, color: "blue" },
    { title: `${getFilterLabel()} Appointments`, value: stats.totalAppointments, icon: FiCalendar, color: "purple" },
    { title: "Pending Reports", value: stats.pendingReports, icon: FiClipboard, color: "pink" },
    { title: "Emergency Cases", value: stats.emergencyCases, icon: FiAlertTriangle, color: "red" }
  ];

  const quickActions = [
    { title: "Add New Patient", icon: FiPlus, color: "blue", action: "add-patient" },
    { title: "Schedule Appointment", icon: FiCalendar, color: "green", action: "schedule" },
    { title: "Write Prescription", icon: FiPackage, color: "purple", action: "prescription" },
    { title: "View Reports", icon: FiBarChart2, color: "pink", action: "reports" }
  ];

  return (
    <div className="doctor-dashboard-page">
      <div className="doctor-dashboard-container">
        <div className="doctor-dashboard">
          <div className="doctor-dashboard__header">
            <div className="doctor-dashboard__header-icon">
              <FiUser />
            </div>
            <div className="doctor-dashboard__welcome">
              <h1>Welcome back, {doctorName || 'Doctor'}</h1>
              <p>Here's what's happening {getFilterLabel().toLowerCase()} in your practice</p>
            </div>
          </div>

          {/* Date Filter Controls */}
          <div className="doctor-dashboard__section">
            <div className="date-filter-controls">
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${dateFilter === 'today' ? 'active' : ''}`}
                  onClick={() => setDateFilter('today')}
                >
                  Today
                </button>
                <button 
                  className={`filter-btn ${dateFilter === 'week' ? 'active' : ''}`}
                  onClick={() => setDateFilter('week')}
                >
                  This Week
                </button>
                <button 
                  className={`filter-btn ${dateFilter === 'month' ? 'active' : ''}`}
                  onClick={() => setDateFilter('month')}
                >
                  This Month
                </button>
                <button 
                  className={`filter-btn ${dateFilter === 'year' ? 'active' : ''}`}
                  onClick={() => setDateFilter('year')}
                >
                  This Year
                </button>
                <button 
                  className={`filter-btn ${dateFilter === 'custom' ? 'active' : ''}`}
                  onClick={() => setDateFilter('custom')}
                >
                  Custom
                </button>
              </div>
              
              {dateFilter === 'custom' && (
                <div className="custom-date-inputs">
                  <input
                    type="date"
                    value={customDateRange.start}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="date-input"
                  />
                  <span>to</span>
                  <input
                    type="date"
                    value={customDateRange.end}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="date-input"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="doctor-dashboard__stats">
            {dashboardStats.map((stat, index) => {
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
                <h2>{getFilterLabel()} Appointments</h2>
                <div className="doctor-appointments-list">
                  {appointments.length > 0 ? (
                    appointments.map((appointment, index) => (
                      <div key={appointment._id || `appointment-${index}`} className="doctor-appointment-item">
                      <div className="doctor-appointment-item__icon">
                        <FiClock size={16} />
                      </div>
                      <div className="doctor-appointment-item__content">
                          <div className="doctor-appointment-item__time">
                            {new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        <div className="doctor-appointment-item__details">
                            <h4 className="doctor-appointment-item__name">
                              {appointment.patient?.firstName ? 
                                `${appointment.patient.firstName} ${appointment.patient.lastName}` : 
                                'Unknown Patient'
                              }
                            </h4>
                          <p className="doctor-appointment-item__type">{appointment.type || 'Consultation'}</p>
                        </div>
                      </div>
                        <div className={`doctor-appointment-item__status doctor-appointment-item__status--${appointment.status?.toLowerCase() || 'pending'}`}>
                          {appointment.status || 'Pending'}
                      </div>
                    </div>
                    ))
                  ) : (
                    <div className="no-appointments">
                      <FiCalendar size={48} />
                      <p>No appointments found for {getFilterLabel().toLowerCase()}</p>
                    </div>
                  )}
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

              {/* Appointment Trends */}
              <div className="doctor-dashboard__section">
                <h2>Appointment Trends</h2>
                <div className="trends-container">
                  <div className="trend-chart">
                    <h4>Weekly Trend</h4>
                    <div className="trend-bars">
                      {appointmentTrends.weekly.map((item, index) => (
                        <div key={index} className="trend-bar">
                          <div className="bar-label">{item.date}</div>
                          <div className="bar-container">
                            <div 
                              className="bar-fill" 
                              style={{ height: `${Math.max(item.count * 20, 20)}px` }}
                            ></div>
                          </div>
                          <div className="bar-value">{item.count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="doctor-dashboard__right">
              <div className="doctor-dashboard__section">
                <h2>Recent Patients</h2>
                <div className="doctor-patients-list">
                  {recentPatients.length > 0 ? (
                    recentPatients.map(patient => (
                      <div key={patient._id} className="doctor-patient-item">
                      <div className="doctor-patient-item__avatar">
                          <FiUser />
                      </div>
                      <div className="doctor-patient-item__info">
                          <h4 className="doctor-patient-item__name">
                            {patient.firstName} {patient.lastName}
                          </h4>
                          <p className="doctor-patient-item__email">{patient.email}</p>
                          <p className="doctor-patient-item__appointments">
                            Appointments: {patient.appointmentCount || 0}
                          </p>
                      </div>
                      <button className="doctor-patient-item__action">View</button>
                    </div>
                    ))
                  ) : (
                    <div className="no-patients">
                      <FiUser size={48} />
                      <p>No patients found</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="doctor-dashboard__section">
                <h2>Monthly Overview</h2>
                <div className="monthly-overview">
                  <div className="monthly-stats">
                    <div className="monthly-stat">
                      <span className="stat-label">Total Appointments</span>
                      <span className="stat-value">{stats.totalAppointments}</span>
                  </div>
                    <div className="monthly-stat">
                      <span className="stat-label">New Patients</span>
                      <span className="stat-value">{stats.totalPatients}</span>
                        </div>
                  </div>
                  <div className="monthly-chart">
                    <h4>Monthly Trend</h4>
                    <div className="monthly-bars">
                      {appointmentTrends.monthly.slice(-6).map((item, index) => (
                        <div key={index} className="monthly-bar">
                          <div className="bar-label">{item.month}</div>
                          <div className="bar-container">
                            <div 
                              className="bar-fill monthly" 
                              style={{ height: `${Math.max(item.count * 15, 20)}px` }}
                            ></div>
                          </div>
                          <div className="bar-value">{item.count}</div>
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
    </div>
  );
};

export default Dashboard;

