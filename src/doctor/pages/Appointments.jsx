import React, { useState, useEffect } from 'react';
import './Appointments.css';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from '../../services/api';
import AppointmentsCalendar from './appointments/AppointmentsCalendar';
import AppointmentsList from './appointments/AppointmentsList';

const Appointments = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [appointments, setAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await doctorAPI.getAppointments();
        const list = res?.data || [];
        if (isMounted && Array.isArray(list) && list.length) {
          const mapped = list.map(a => ({
            id: a._id,
            patient: a.patient?.firstName ? `${a.patient.firstName} ${a.patient.lastName}` : 'Patient',
            patientId: a.patient?._id,
            date: new Date(a.startTime).toISOString().split('T')[0],
            time: new Date(a.startTime).toTimeString().slice(0,5),
            duration: a.duration || Math.round((new Date(a.endTime) - new Date(a.startTime))/60000),
            type: a.type || 'Consultation',
            status: a.status || 'Scheduled',
            notes: a.notes || '',
            priority: 'Normal',
            image: '/images/1.png'
          }));
          setAppointments(mapped);
          
          // Filter today's appointments
          const today = new Date().toISOString().split('T')[0];
          const todayList = mapped.filter(apt => apt.date === today);
          setTodayAppointments(todayList);
        }
      } catch (e) {}
    })();
    return () => { isMounted = false; };
  }, []);

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'normal': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const closeAppointmentDetails = () => {
    setSelectedAppointment(null);
  };

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= lastDay || days.length < 42) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <h1>Appointment Management</h1>
        <p>Schedule and manage patient appointments</p>
        <div className="doctor-dashboard-header-decoration"></div>
      </div>

      {/* Statistics Cards - Matching dashboard exactly */}
      <div className="appointments-stats">
        <div className="appointment-stat-card" style={{ borderLeftColor: "#4CAF50" }}>
          <div className="appointment-stat-card-icon" style={{ backgroundColor: "#4CAF50" }}>
            <span>📅</span>
          </div>
          <div className="appointment-stat-card-content">
            <h3>{appointments.length}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
        <div className="appointment-stat-card" style={{ borderLeftColor: "#2196F3" }}>
          <div className="appointment-stat-card-icon" style={{ backgroundColor: "#2196F3" }}>
            <span>✅</span>
          </div>
          <div className="appointment-stat-card-content">
            <h3>{appointments.filter(apt => apt.status === 'Confirmed').length}</h3>
            <p>Confirmed</p>
          </div>
        </div>
        <div className="appointment-stat-card" style={{ borderLeftColor: "#FF9800" }}>
          <div className="appointment-stat-card-icon" style={{ backgroundColor: "#FF9800" }}>
            <span>⏳</span>
          </div>
          <div className="appointment-stat-card-content">
            <h3>{appointments.filter(apt => apt.status === 'Pending').length}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="appointment-stat-card" style={{ borderLeftColor: "#F44336" }}>
          <div className="appointment-stat-card-icon" style={{ backgroundColor: "#F44336" }}>
            <span>🚨</span>
          </div>
          <div className="appointment-stat-card-content">
            <h3>{appointments.filter(apt => apt.priority === 'Urgent').length}</h3>
            <p>Urgent Cases</p>
          </div>
        </div>
      </div>

      <div className="appointments-content">
        {/* Left Column */}
        <div className="appointments-left">
          {/* View Toggle Controls */}
          <div className="appointments-section">
            <div className="appointments-section-header">
              <h2>Appointment Views</h2>
            </div>
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                onClick={() => setViewMode('calendar')}
              >
                📅 Calendar
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                📋 List
              </button>
            </div>
          </div>

          {viewMode === 'calendar' && (
            <AppointmentsCalendar
              appointments={appointments}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              navigateMonth={navigateMonth}
              generateCalendarDays={generateCalendarDays}
              getAppointmentsForDate={getAppointmentsForDate}
              isToday={isToday}
              isSelected={isSelected}
              getMonthName={getMonthName}
              getPriorityColor={getPriorityColor}
              formatTime={formatTime}
              onNewAppointment={() => navigate('/doctor/appointments/new')}
            />
          )}

          {viewMode === 'list' && (
            <AppointmentsList
              appointments={appointments}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
              formatTime={formatTime}
              onNewAppointment={() => navigate('/doctor/appointments/new')}
            />
          )}
        </div>

        {/* Right Column */}
        <div className="appointments-right">
          {/* Quick Actions */}
          <div className="appointments-section">
            <h2>Quick Actions</h2>
            <div className="doctor-quick-actions">
              <button className="doctor-quick-action-btn">
                <span className="doctor-quick-action-icon">➕</span>
                <span>Add New Patient</span>
              </button>
              <button className="doctor-quick-action-btn">
                <span className="doctor-quick-action-icon">📅</span>
                <span>Schedule Appointment</span>
              </button>
              <button className="doctor-quick-action-btn">
                <span className="doctor-quick-action-icon">💊</span>
                <span>Write Prescription</span>
              </button>
              <button className="doctor-quick-action-btn">
                <span className="doctor-quick-action-icon">📊</span>
                <span>View Reports</span>
              </button>
            </div>
          </div>

          {/* Today's Appointments Summary */}
          <div className="appointments-section">
            <div className="appointments-section-header">
              <h2>Today's Appointments</h2>
              <button className="appointments-view-all-btn" onClick={() => navigate('/doctor/appointments/view-all')}>View All</button>
            </div>
            <div className="doctor-appointments-list">
              {todayAppointments.length > 0 ? (
                todayAppointments.map(appointment => (
                  <div key={appointment.id} className="doctor-appointment-item">
                    <div className="doctor-appointment-time">{formatTime(appointment.time)}</div>
                    <div className="doctor-appointment-details">
                      <h4>{appointment.patient}</h4>
                      <p>{appointment.type}</p>
                    </div>
                    <div className={`doctor-appointment-status ${appointment.status.toLowerCase()}`}>
                      {appointment.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-appointments">
                  <p>No appointments scheduled for today</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="appointment-modal-overlay" onClick={closeAppointmentDetails}>
          <div className="appointment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="appointment-modal__header">
              <h2>Appointment Details</h2>
              <button className="close-btn" onClick={closeAppointmentDetails}>✕</button>
            </div>
            
            <div className="appointment-modal__content">
              <div className="appointment-info">
                <div className="info-row">
                  <label>Patient:</label>
                  <div className="patient-info">
                    <img src={selectedAppointment.image} alt={selectedAppointment.patient} />
                    <span>{selectedAppointment.patient}</span>
                  </div>
                </div>
                
                <div className="info-row">
                  <label>Date & Time:</label>
                  <span>{selectedAppointment.date} at {formatTime(selectedAppointment.time)}</span>
                </div>
                
                <div className="info-row">
                  <label>Duration:</label>
                  <span>{selectedAppointment.duration} minutes</span>
                </div>
                
                <div className="info-row">
                  <label>Type:</label>
                  <span>{selectedAppointment.type}</span>
                </div>
                
                <div className="info-row">
                  <label>Status:</label>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedAppointment.status) }}
                  >
                    {selectedAppointment.status}
                  </span>
                </div>
                
                <div className="info-row">
                  <label>Priority:</label>
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(selectedAppointment.priority) }}
                  >
                    {selectedAppointment.priority}
                  </span>
                </div>
                
                <div className="info-row">
                  <label>Notes:</label>
                  <span>{selectedAppointment.notes}</span>
                </div>
              </div>
            </div>

            <div className="appointment-modal__actions">
              <button className="btn btn-primary">Edit Appointment</button>
              <button className="btn btn-secondary">Reschedule</button>
              <button className="btn btn-outline">Send Reminder</button>
              <button className="btn btn-danger">Cancel Appointment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
