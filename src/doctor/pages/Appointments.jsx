import React, { useState } from 'react';
import './Appointments.css';

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [viewMode, setViewMode] = useState('week'); // 'today', 'week', or 'month'
  const [showDateAppointmentsModal, setShowDateAppointmentsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Comprehensive sample data matching the image
  const [scheduledAppointments, setScheduledAppointments] = useState([
    // Monday appointments
    {
      id: 1,
      patient: "Emergency Patient",
      patientId: 1,
      date: "2024-05-11",
      time: "07:00",
      duration: 30,
      type: "Emergency visit",
      status: "Confirmed",
      notes: "West camp, Room 312",
      priority: "Urgent",
      image: "/images/1.png",
      icon: "🩺",
      color: "pink"
    },
    {
      id: 2,
      patient: "Diagnostic Patient",
      patientId: 2,
      date: "2024-05-11",
      time: "07:30",
      duration: 25,
      type: "Diagnostic test",
      status: "Confirmed",
      notes: "Blood work and analysis",
      priority: "Normal",
      image: "/images/2.png",
      icon: "💉",
      color: "white"
    },
    {
      id: 3,
      patient: "Team Planning",
      patientId: 3,
      date: "2024-05-11",
      time: "08:00",
      duration: 60,
      type: "Team planning",
      status: "Confirmed",
      notes: "East camp, Room 200 - Agenda.pdf",
      priority: "Normal",
      image: "/images/3.png",
      icon: "👥",
      color: "yellow",
      participants: ["TY", "AB", "NR", "SS", "+3"]
    },
    {
      id: 4,
      patient: "Emergency Patient 2",
      patientId: 4,
      date: "2024-05-11",
      time: "09:00",
      duration: 30,
      type: "Emergency visit",
      status: "Confirmed",
      notes: "West camp, Room 312",
      priority: "Urgent",
      image: "/images/4.png",
      icon: "🩺",
      color: "pink"
    },
    // Tuesday appointments
    {
      id: 5,
      patient: "Online Consultation",
      patientId: 5,
      date: "2024-05-12",
      time: "07:00",
      duration: 60,
      type: "Online visit",
      status: "Confirmed",
      notes: "West camp, Room 312 - Participants TY",
      priority: "Normal",
      image: "/images/5.png",
      icon: "📹",
      color: "gray",
      hasJoinButton: true
    },
    {
      id: 6,
      patient: "Diagnostic Patient 2",
      patientId: 6,
      date: "2024-05-12",
      time: "08:00",
      duration: 15,
      type: "Diagnostic test",
      status: "Confirmed",
      notes: "Routine checkup",
      priority: "Normal",
      image: "/images/6.png",
      icon: "💉",
      color: "white"
    },
    {
      id: 7,
      patient: "Health Systems Training",
      patientId: 7,
      date: "2024-05-12",
      time: "08:30",
      duration: 60,
      type: "Health systems training",
      status: "Confirmed",
      notes: "Clinical Immunology - Do you know how to optimally manage moderate to severe asthma in your patients?",
      priority: "High",
      image: "/images/7.png",
      icon: "📚",
      color: "white",
      tag: "Clinical Immunology"
    },
    // Wednesday appointments
    {
      id: 8,
      patient: "Follow-up Patient",
      patientId: 8,
      date: "2024-05-13",
      time: "09:00",
      duration: 30,
      type: "Follow-up",
      status: "Confirmed",
      notes: "West camp, Room 312",
      priority: "Normal",
      image: "/images/8.png",
      icon: "🩺",
      color: "pink"
    },
    {
      id: 9,
      patient: "Interns Training",
      patientId: 9,
      date: "2024-05-13",
      time: "08:30",
      duration: 60,
      type: "Interns visit",
      status: "Confirmed",
      notes: "West camp, Conference room 404",
      priority: "Normal",
      image: "/images/9.png",
      icon: "👥",
      color: "light-blue",
      participants: ["TY", "AB", "NR", "SS", "+12"]
    },
    {
      id: 10,
      patient: "Emergency Patient 3",
      patientId: 10,
      date: "2024-05-13",
      time: "09:40",
      duration: 20,
      type: "Emergency visit",
      status: "Confirmed",
      notes: "West camp, Room 312",
      priority: "Urgent",
      image: "/images/10.png",
      icon: "🩺",
      color: "pink"
    },
    // Thursday appointments (highlighted day)
    {
      id: 11,
      patient: "Online Consultation 2",
      patientId: 11,
      date: "2024-05-14",
      time: "07:00",
      duration: 60,
      type: "Online visit",
      status: "In progress",
      notes: "West camp, Room 312 - Participants TY",
      priority: "Normal",
      image: "/images/11.png",
      icon: "📹",
      color: "gray",
      hasJoinButton: true
    },
    {
      id: 12,
      patient: "Primary Care Training",
      patientId: 12,
      date: "2024-05-14",
      time: "08:00",
      duration: 60,
      type: "Primary Care",
      status: "Confirmed",
      notes: "What tools can you leverage to help maximize a co-management approach to caring for people with CKD",
      priority: "High",
      image: "/images/12.png",
      icon: "🏥",
      color: "white",
      tag: "Chronic Kidney Disease",
      hasJoinButton: true
    },
    {
      id: 13,
      patient: "Interns Training 2",
      patientId: 13,
      date: "2024-05-14",
      time: "09:00",
      duration: 60,
      type: "Interns visit",
      status: "Confirmed",
      notes: "West camp, Conference room 404",
      priority: "Normal",
      image: "/images/13.png",
      icon: "👥",
      color: "light-blue",
      participants: ["TY", "AD", "NR", "SS", "+12"]
    },
    // Friday appointments
    {
      id: 14,
      patient: "Team Results Meeting",
      patientId: 14,
      date: "2024-05-15",
      time: "07:00",
      duration: 60,
      type: "Team results",
      status: "Confirmed",
      notes: "East camp, Room 200 - Agenda.pdf",
      priority: "Normal",
      image: "/images/14.png",
      icon: "👥",
      color: "yellow",
      participants: ["TY", "AB", "NR", "SS", "+3"]
    },
    {
      id: 15,
      patient: "Emergency Patient 4",
      patientId: 15,
      date: "2024-05-15",
      time: "07:00",
      duration: 30,
      type: "Emergency visit",
      status: "Confirmed",
      notes: "West camp, Room 312",
      priority: "Urgent",
      image: "/images/15.png",
      icon: "🩺",
      color: "pink"
    },
    {
      id: 16,
      patient: "Diagnostic Patient 3",
      patientId: 16,
      date: "2024-05-15",
      time: "07:30",
      duration: 25,
      type: "Diagnostic test",
      status: "Confirmed",
      notes: "Routine screening",
      priority: "Normal",
      image: "/images/16.png",
      icon: "💉",
      color: "white"
    },
    {
      id: 17,
      patient: "Follow-up Patient 2",
      patientId: 17,
      date: "2024-05-15",
      time: "09:00",
      duration: 30,
      type: "Follow-up",
      status: "Confirmed",
      notes: "West camp, Room 312",
      priority: "Normal",
      image: "/images/17.png",
      icon: "🩺",
      color: "pink"
    },
    // Saturday appointments
    {
      id: 18,
      patient: "Online Consultation 3",
      patientId: 18,
      date: "2024-05-16",
      time: "07:00",
      duration: 60,
      type: "Online visit",
      status: "Confirmed",
      notes: "West camp, Room 312 - Participants TY",
      priority: "Normal",
      image: "/images/18.png",
      icon: "📹",
      color: "gray",
      hasJoinButton: true
    }
  ]);

  // Incoming requests from moms (frontend-only sample data)
  const [appointmentRequests, setAppointmentRequests] = useState([
    {
      id: 101,
      momName: 'Emma Wilson',
      momId: 1,
      preferredDate: '2024-05-20',
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
      preferredDate: '2024-05-21',
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
      preferredDate: '2024-05-22',
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
      case 'in progress': return '#ec4899';
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

  // Week-view helpers
  const workingHours = { start: 7, end: 19 };
  const timeSlots = [];
  for (let hour = workingHours.start; hour <= workingHours.end; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  const getTimeIndex = (time) => {
    const [h, m] = time.split(':').map(Number);
    return (h - workingHours.start) * 2 + (m >= 30 ? 2 : 1);
  };

  const getSpanFromDuration = (minutes) => {
    return Math.max(1, Math.ceil(minutes / 30));
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

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
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

  const getTodayAppointments = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    return scheduledAppointments.filter(apt => apt.date === todayStr);
  };

  const handleTodayClick = () => {
    setViewMode('today');
    setSelectedDate(new Date());
  };

  const handleWeekClick = () => {
    setViewMode('week');
  };

  const handleMonthClick = () => {
    setViewMode('month');
  };

  const getCurrentTimeSlot = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeIndex = (hours - workingHours.start) * 2 + (minutes >= 30 ? 2 : 1);
    return Math.max(1, Math.min(timeIndex, timeSlots.length));
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
              className={`toggle-btn ${viewMode === 'today' ? 'active' : ''}`}
              onClick={handleTodayClick}
            >
              Today
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={handleWeekClick}
            >
              Week
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'month' ? 'active' : ''}`} 
              onClick={handleMonthClick}
            >
              Month
            </button>
            
          </div>
        </div>
      </div>

      <div className="appointments-content"> 
        <div className="main-panel">
          {viewMode === 'today' && (
            <div className="appointments-calendar__today-view">
              <div className="appointments-calendar__today-header">
                <h2>Today - {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}</h2>
              </div>
              <div className="appointments-calendar__today-timeline">
                {timeSlots.map(time => {
                  const timeAppointments = getTodayAppointments().filter(apt => apt.time === time);
                  return (
                    <div key={time} className="appointments-calendar__today-time-slot">
                      <div className="appointments-calendar__today-time">{formatTime(time)}</div>
                      <div className="appointments-calendar__today-events">
                        {timeAppointments.map(appointment => (
                          <div 
                            key={appointment.id} 
                            className={`appointments-calendar__today-event appointments-calendar__event--${appointment.color || 'blue'}`}
                            onClick={() => handleAppointmentClick(appointment)}
                          >
                            <div className="appointments-calendar__today-event-time">
                              {formatTime(appointment.time)}-{formatTime(appointment.time.split(':').map((n, i) => i === 0 ? String(parseInt(n) + Math.floor(appointment.duration / 60)).padStart(2, '0') : i === 1 ? String((parseInt(n) + appointment.duration % 60) % 60).padStart(2, '0') : n).join(':'))}
                            </div>
                            <div className="appointments-calendar__today-event-title">
                              {appointment.type}
                            </div>
                            <div className="appointments-calendar__today-event-location">
                              📍 {appointment.notes}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === 'week' && (
            <>
              <div className="appointments-calendar__grid">
                <div className="appointments-calendar__time-column">
                  <div className="appointments-calendar__time-header"></div>
                  {timeSlots.map(time => (
                    <div key={time} className="appointments-calendar__time-slot">
                      {formatTime(time)}
                    </div>
                  ))}
                </div>

                {getWeekDays().map(day => {
                  const dayAppointments = getAppointmentsForDate(day);
                  const isCurrentDay = isToday(day);
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  
                  return (
                    <div key={day.toISOString()} className="appointments-calendar__day-column">
                      <div className={`appointments-calendar__day-header ${isCurrentDay ? 'current' : ''} ${isWeekend ? 'weekend' : ''}`}>
                        <div className="appointments-calendar__day-name">{day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</div>
                        <div className="appointments-calendar__day-date">{day.getDate()}</div>
                      </div>
                      
                      {timeSlots.map(time => {
                        const timeAppointments = dayAppointments.filter(apt => apt.time === time);
                        return (
                          <div key={time} className="appointments-calendar__time-cell">
                            {timeAppointments.map(appointment => (
                              <div 
                                key={appointment.id} 
                                className={`appointments-calendar__event appointments-calendar__event--${appointment.color || 'blue'}`}
                                style={{
                                  gridRow: `span ${Math.ceil(appointment.duration / 30)}`
                                }}
                                onClick={() => handleAppointmentClick(appointment)}
                              >
                                <div className="appointments-calendar__event-header">
                                  <div className="appointments-calendar__event-icon">
                                    {appointment.icon || '📅'}
                                  </div>
                                  <div className="appointments-calendar__event-time">
                                    {formatTime(appointment.time)}-{formatTime(appointment.time.split(':').map((n, i) => i === 0 ? String(parseInt(n) + Math.floor(appointment.duration / 60)).padStart(2, '0') : i === 1 ? String((parseInt(n) + appointment.duration % 60) % 60).padStart(2, '0') : n).join(':'))}
                                  </div>
                                </div>
                                
                                <div className="appointments-calendar__event-title">
                                  {appointment.type}
                                </div>
                                
                                <div className="appointments-calendar__event-location">
                                  📍 {appointment.notes}
                                </div>
                                
                                {appointment.participants && (
                                  <div className="appointments-calendar__event-participants">
                                    <div className="appointments-calendar__event-participants-label">
                                      Participants
                                    </div>
                                    <div className="appointments-calendar__event-participants-list">
                                      {appointment.participants.map((participant, index) => (
                                        <div key={index} className="appointments-calendar__event-participant">
                                          {participant}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {appointment.hasJoinButton && (
                                  <button className="appointments-calendar__event-join">
                                    {appointment.status === 'In progress' ? 'In progress...' : 'Join'}
                                  </button>
                                )}
                                
                                {appointment.status && appointment.status !== 'Confirmed' && (
                                  <div className="appointments-calendar__event-status">
                                    {appointment.status}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Current time indicator */}
              <div 
                className="appointments-calendar__current-time"
                style={{
                  top: `${(parseInt(new Date().getHours()) - 7) * 60 + parseInt(new Date().getMinutes())}px`
                }}
              >
                <div className="appointments-calendar__current-time-line"></div>
                <div className="appointments-calendar__current-time-label">
                  {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </>
          )}

          {viewMode === 'month' && (
            <div className="calendar-view month-mode">
              <div className="calendar-header">
                <button className="calendar-nav-btn" onClick={() => navigateMonth(-1)}>‹</button>
                <h2>{getMonthName(selectedDate)}</h2>
                <button className="calendar-nav-btn" onClick={() => navigateMonth(1)}>›</button>
              </div>

              <div className="month-calendar">
                <div className="month-weekdays">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="month-weekday">{day}</div>
                  ))}
                </div>
                
                <div className="month-days">
                  {generateCalendarDays().map((date, index) => {
                    const dayAppointments = getAppointmentsForDate(date);
                    const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                    
                    return (
                      <div 
                        key={index} 
                        className={`month-day ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''} ${!isCurrentMonth ? 'other-month' : ''}`}
                        onClick={() => handleDateClick(date)}
                      >
                        <span className="month-day-number">{date.getDate()}</span>
                        {dayAppointments.length > 0 && (
                          <div className="month-day-appointments">
                            {dayAppointments.slice(0, 2).map((apt) => (
                              <div 
                                key={apt.id}
                                className="month-apt-chip"
                                title={`${apt.patient} • ${apt.type} • ${formatTime(apt.time)}`}
                              >
                                <span className="month-chip-dot" style={{ backgroundColor: getStatusColor(apt.status) }}></span>
                                <span className="month-chip-time">{formatTime(apt.time)}</span>
                              </div>
                            ))}
                            {dayAppointments.length > 2 && (
                              <span className="month-more-appointments">+{dayAppointments.length - 2}</span>
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
