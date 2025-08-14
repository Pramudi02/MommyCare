import React, { useState } from 'react';
import './Appointments.css';

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [showDateAppointmentsModal, setShowDateAppointmentsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Scheduled appointments (shown on the calendar/list)
  const [scheduledAppointments, setScheduledAppointments] = useState([
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
  ]);

  // Incoming requests from moms (frontend-only sample data)
  const [appointmentRequests, setAppointmentRequests] = useState([
    {
      id: 101,
      momName: 'Emma Wilson',
      momId: 1,
      preferredDate: '2024-12-17',
      preferredTime: '10:00',
      duration: 30,
      type: 'Follow-up',
      notes: 'Mild back pain, would like a quick check.',
      reason: 'Discomfort',
      priority: 'Normal',
      phone: '+1 202 555 0101',
      email: 'emma@example.com',
      image: '/images/1.png',
      status: 'pending'
    },
    {
      id: 102,
      momName: 'Lily Anderson',
      momId: 7,
      preferredDate: '2024-12-18',
      preferredTime: '13:30',
      duration: 45,
      type: 'Ultrasound',
      notes: 'Anatomy scan preferred in the afternoon.',
      reason: 'Anatomy scan',
      priority: 'High',
      phone: '+1 202 555 0150',
      email: 'lily@example.com',
      image: '/images/7.png',
      status: 'pending'
    },
    {
      id: 103,
      momName: 'Noah Smith',
      momId: 8,
      preferredDate: '2024-12-19',
      preferredTime: '09:30',
      duration: 30,
      type: 'Prenatal Checkup',
      notes: 'Routine checkup.',
      reason: 'Routine',
      priority: 'Normal',
      phone: '+1 202 555 0184',
      email: 'noah@example.com',
      image: '/images/8.png',
      status: 'pending'
    }
  ]);

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return scheduledAppointments.filter(apt => apt.date === dateStr);
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

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    const first = parts[0]?.[0] || '';
    const last = parts[1]?.[0] || '';
    return (first + last).toUpperCase();
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
    setShowDateAppointmentsModal(true);
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const closeAppointmentDetails = () => {
    setSelectedAppointment(null);
  };

  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
  };

  const handleAcceptRequest = () => {
    if (!selectedRequest) return;
    const newAppointment = {
      id: Date.now(),
      patient: selectedRequest.momName,
      patientId: selectedRequest.momId,
      date: selectedRequest.preferredDate,
      time: selectedRequest.preferredTime,
      duration: selectedRequest.duration,
      type: selectedRequest.type,
      status: 'Confirmed',
      notes: selectedRequest.notes,
      priority: selectedRequest.priority || 'Normal',
      image: selectedRequest.image || '/images/1.png'
    };
    setScheduledAppointments(prev => [...prev, newAppointment]);
    setAppointmentRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
    setSelectedRequest(null);
  };

  const handleDeclineRequest = () => {
    if (!selectedRequest) return;
    setAppointmentRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
    setSelectedRequest(null);
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

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(startOfWeek.getDate() - selectedDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getMonthDays = () => {
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

  const isCurrentMonth = (date) => {
    return date.getMonth() === selectedDate.getMonth();
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
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

      <div className="appointments-content">
        <div className="main-panel">
          {viewMode === 'calendar' && (
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
                          <div className="day-appointments">
                            {dayAppointments.slice(0, 3).map((apt) => (
                              <div 
                                key={apt.id}
                                className="apt-chip"
                                title={`${apt.patient} • ${apt.type} • ${formatTime(apt.time)}`}
                              >
                                <span className="chip-dot" style={{ backgroundColor: getStatusColor(apt.status) }}></span>
                                <span className="chip-time">{formatTime(apt.time)}</span>
                              </div>
                            ))}
                            {dayAppointments.length > 3 && (
                              <span className="more-appointments">+{dayAppointments.length - 3} more</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {viewMode === 'list' && (
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
                
                {scheduledAppointments
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
        </div>

        <aside className="sidebar">
          <h3>New Appointment Requests</h3>
          <div className="requests-list">
            {appointmentRequests.length === 0 && (
              <div className="requests-empty">No new requests</div>
            )}
            {appointmentRequests.map(req => (
              <div 
                key={req.id} 
                className={`request-item ${selectedRequest && selectedRequest.id === req.id ? 'selected' : ''}`}
                onClick={() => handleSelectRequest(req)}
              >
                <img src={req.image} alt={req.momName} />
                <div className="request-main">
                  <div className="request-name">{req.momName}</div>
                  <div className="request-meta">{req.type} • {new Date(req.preferredDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {formatTime(req.preferredTime)}</div>
                </div>
                <div className={`priority-dot ${req.priority?.toLowerCase()}`}></div>
              </div>
            ))}
          </div>

          {selectedRequest && (
            <div className="request-details">
              <div className="request-details-header">
                <img src={selectedRequest.image} alt={selectedRequest.momName} />
                <div>
                  <div className="request-name">{selectedRequest.momName}</div>
                  <div className="request-meta">{selectedRequest.type}</div>
                </div>
              </div>
              <div className="detail-row"><label>Date:</label><span>{selectedRequest.preferredDate}</span></div>
              <div className="detail-row"><label>Time:</label><span>{formatTime(selectedRequest.preferredTime)}</span></div>
              <div className="detail-row"><label>Duration:</label><span>{selectedRequest.duration} minutes</span></div>
              <div className="detail-row"><label>Priority:</label><span>{selectedRequest.priority}</span></div>
              <div className="detail-row"><label>Phone:</label><span>{selectedRequest.phone}</span></div>
              <div className="detail-row"><label>Email:</label><span>{selectedRequest.email}</span></div>
              <div className="detail-notes">
                <label>Notes</label>
                <p>{selectedRequest.notes}</p>
              </div>
              <div className="request-actions">
                <button className="btn btn-danger" onClick={handleDeclineRequest}>Decline</button>
                <button className="btn btn-primary" onClick={handleAcceptRequest}>Accept</button>
              </div>
            </div>
          )}
        </aside>
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


      {/* Date Appointments Modal */}
      {showDateAppointmentsModal && (
        <div className="appointment-modal-overlay" onClick={() => setShowDateAppointmentsModal(false)}>
          <div className="appointment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="appointment-modal__header">
              <h2>Scheduled Appointments</h2>
              <button className="close-btn" onClick={() => setShowDateAppointmentsModal(false)}>✕</button>
            </div>
            <div className="appointment-modal__content">
              <div className="appointments-list">
                {getAppointmentsForDate(selectedDate).length === 0 && (
                  <div className="requests-empty">No appointments for this date</div>
                )}
                {getAppointmentsForDate(selectedDate)
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(appointment => (
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
        </div>
      )}
    </div>
  );
};

export default Appointments;
