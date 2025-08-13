import React, { useState } from 'react';
import './Appointments.css';

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'

  // Sample appointments data
  const appointments = [
    {
      id: 1,
      patient: "Emma Wilson",
      patientId: 1,
      date: "2024-12-15",
      time: "09:00",
      duration: 30,
      type: "Prenatal Checkup",
      status: "Confirmed",
      notes: "Regular checkup, 24 weeks pregnant",
      priority: "Normal",
      image: "/images/1.png"
    },
    {
      id: 2,
      patient: "Sophia Rodriguez",
      patientId: 2,
      date: "2024-12-15",
      time: "10:30",
      duration: 45,
      type: "Ultrasound",
      status: "Confirmed",
      notes: "18-week anatomy scan",
      priority: "High",
      image: "/images/2.png"
    },
    {
      id: 3,
      patient: "Isabella Chen",
      patientId: 3,
      date: "2024-12-15",
      time: "14:00",
      duration: 30,
      type: "Follow-up",
      status: "Pending",
      notes: "Postpartum checkup, 6 weeks",
      priority: "Normal",
      image: "/images/3.png"
    },
    {
      id: 4,
      patient: "Mia Johnson",
      patientId: 4,
      date: "2024-12-15",
      time: "15:30",
      duration: 60,
      type: "Emergency",
      status: "Confirmed",
      notes: "Emergency consultation - preeclampsia symptoms",
      priority: "Urgent",
      image: "/images/4.png"
    },
    {
      id: 5,
      patient: "Ava Thompson",
      patientId: 5,
      date: "2024-12-16",
      time: "09:00",
      duration: 30,
      type: "Prenatal Checkup",
      status: "Confirmed",
      notes: "20-week checkup",
      priority: "Normal",
      image: "/images/5.png"
    },
    {
      id: 6,
      patient: "Charlotte Davis",
      patientId: 6,
      date: "2024-12-16",
      time: "11:00",
      duration: 45,
      type: "Ultrasound",
      status: "Confirmed",
      notes: "16-week scan",
      priority: "High",
      image: "/images/6.png"
    }
  ];

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
        <div className="appointments-header__left">
          <h1>Appointment Management</h1>
          <p>Schedule and manage patient appointments</p>
        </div>
        <div className="appointments-header__right">
          <button className="new-appointment-btn">
            <span>➕</span>
            New Appointment
          </button>
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
      </div>

      {viewMode === 'calendar' ? (
        /* Calendar View */
        <div className="calendar-view">
          <div className="calendar-header">
            <button className="calendar-nav-btn" onClick={() => navigateMonth(-1)}>‹</button>
            <h2>{getMonthName(selectedDate)}</h2>
            <button className="calendar-nav-btn" onClick={() => navigateMonth(1)}>›</button>
          </div>

          <div className="calendar-grid">
            <div className="calendar-weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>
            
            <div className="calendar-days">
              {generateCalendarDays().map((date, index) => {
                const dayAppointments = getAppointmentsForDate(date);
                const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                
                return (
                  <div 
                    key={index} 
                    className={`calendar-day ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''} ${!isCurrentMonth ? 'other-month' : ''}`}
                    onClick={() => handleDateClick(date)}
                  >
                    <span className="day-number">{date.getDate()}</span>
                    {dayAppointments.length > 0 && (
                      <div className="appointment-indicators">
                        {dayAppointments.slice(0, 3).map((apt, aptIndex) => (
                          <div 
                            key={aptIndex}
                            className="appointment-dot"
                            style={{ backgroundColor: getPriorityColor(apt.priority) }}
                            title={`${apt.patient} - ${apt.type}`}
                          />
                        ))}
                        {dayAppointments.length > 3 && (
                          <span className="more-appointments">+{dayAppointments.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Appointments */}
          <div className="selected-date-appointments">
            <h3>Appointments for {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</h3>
            
            <div className="appointments-list">
              {getAppointmentsForDate(selectedDate).map(appointment => (
                <div 
                  key={appointment.id} 
                  className="appointment-item"
                  onClick={() => handleAppointmentClick(appointment)}
                >
                  <div className="appointment-time">
                    {formatTime(appointment.time)}
                    <span className="duration">({appointment.duration} min)</span>
                  </div>
                  <div className="appointment-details">
                    <h4>{appointment.patient}</h4>
                    <p>{appointment.type}</p>
                    <p className="notes">{appointment.notes}</p>
                  </div>
                  <div className="appointment-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(appointment.status) }}
                    >
                      {appointment.status}
                    </span>
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(appointment.priority) }}
                    >
                      {appointment.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="list-view">
          <div className="list-controls">
            <div className="date-filter">
              <label>Filter by Date:</label>
              <input 
                type="date" 
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
              />
            </div>
          </div>

          <div className="appointments-table">
            <div className="table-header">
              <div className="header-cell">Time</div>
              <div className="header-cell">Patient</div>
              <div className="header-cell">Type</div>
              <div className="header-cell">Duration</div>
              <div className="header-cell">Status</div>
              <div className="header-cell">Priority</div>
              <div className="header-cell">Actions</div>
            </div>
            
            {appointments
              .filter(apt => apt.date === selectedDate.toISOString().split('T')[0])
              .sort((a, b) => a.time.localeCompare(b.time))
              .map(appointment => (
                <div key={appointment.id} className="table-row">
                  <div className="table-cell time-cell">
                    {formatTime(appointment.time)}
                    <span className="duration">({appointment.duration} min)</span>
                  </div>
                  <div className="table-cell patient-cell">
                    <img src={appointment.image} alt={appointment.patient} />
                    <span>{appointment.patient}</span>
                  </div>
                  <div className="table-cell">{appointment.type}</div>
                  <div className="table-cell">{appointment.duration} min</div>
                  <div className="table-cell">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(appointment.status) }}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  <div className="table-cell">
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(appointment.priority) }}
                    >
                      {appointment.priority}
                    </span>
                  </div>
                  <div className="table-cell actions-cell">
                    <button className="action-btn view-btn">👁️</button>
                    <button className="action-btn edit-btn">✏️</button>
                    <button className="action-btn delete-btn">🗑️</button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

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
