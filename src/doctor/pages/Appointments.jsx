import React, { useState } from 'react';
import './Appointments.css';

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar', 'list', or 'schedule'
  const [scheduleViewMode, setScheduleViewMode] = useState('week'); // 'day', 'week', 'month' for schedule view
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

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

  // Sample schedule data for schedule view
  const scheduleData = {
    "2024-12-15": [
      { id: 1, time: "09:00", duration: 30, patient: "Emma Wilson", type: "Prenatal Checkup", status: "Confirmed" },
      { id: 2, time: "10:30", duration: 45, patient: "Sophia Rodriguez", type: "Ultrasound", status: "Confirmed" },
      { id: 3, time: "14:00", duration: 30, patient: "Isabella Chen", type: "Follow-up", status: "Pending" },
      { id: 4, time: "15:30", duration: 60, patient: "Mia Johnson", type: "Emergency", status: "Confirmed" }
    ],
    "2024-12-16": [
      { id: 5, time: "09:00", duration: 30, patient: "Ava Thompson", type: "Prenatal Checkup", status: "Confirmed" },
      { id: 6, time: "11:00", duration: 45, patient: "Charlotte Davis", type: "Ultrasound", status: "Confirmed" }
    ],
    "2024-12-17": [
      { id: 7, time: "10:00", duration: 30, patient: "Emma Wilson", type: "Follow-up", status: "Confirmed" }
    ],
    "2024-12-18": [
      { id: 8, time: "14:00", duration: 45, patient: "Sophia Rodriguez", type: "Prenatal Checkup", status: "Confirmed" }
    ],
    "2024-12-19": [
      { id: 9, time: "09:30", duration: 30, patient: "Isabella Chen", type: "Postpartum Check", status: "Confirmed" }
    ]
  };

  const workingHours = {
    start: 8, // 8 AM
    end: 18   // 6 PM
  };

  const timeSlots = [];
  for (let hour = workingHours.start; hour < workingHours.end; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  const getScheduleAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return scheduleData[dateStr] || [];
  };

  const getAppointmentForTimeSlot = (date, time) => {
    const appointments = getScheduleAppointmentsForDate(date);
    return appointments.find(apt => apt.time === time);
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

  const handleTimeSlotClick = (date, time) => {
    const appointment = getAppointmentForTimeSlot(date, time);
    if (appointment) {
      setSelectedTimeSlot({ date, time, appointment });
    } else {
      setShowScheduleModal(true);
    }
  };

  const closeScheduleModals = () => {
    setSelectedTimeSlot(null);
    setShowScheduleModal(false);
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

  const navigateSchedule = (direction) => {
    const newDate = new Date(selectedDate);
    if (scheduleViewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else if (scheduleViewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (scheduleViewMode === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    }
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
            <button 
              className={`toggle-btn ${viewMode === 'schedule' ? 'active' : ''}`}
              onClick={() => setViewMode('schedule')}
            >
              ⏰ Schedule
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'calendar' && (
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
      )}

      {viewMode === 'list' && (
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

      {viewMode === 'schedule' && (
        /* Schedule View */
        <div className="schedule-view">
          <div className="schedule-header">
            <div className="schedule-view-toggle">
              <button 
                className={`schedule-toggle-btn ${scheduleViewMode === 'day' ? 'active' : ''}`}
                onClick={() => setScheduleViewMode('day')}
              >
                Day
              </button>
              <button 
                className={`schedule-toggle-btn ${scheduleViewMode === 'week' ? 'active' : ''}`}
                onClick={() => setScheduleViewMode('week')}
              >
                Week
              </button>
              <button 
                className={`schedule-toggle-btn ${scheduleViewMode === 'month' ? 'active' : ''}`}
                onClick={() => setScheduleViewMode('month')}
              >
                Month
              </button>
            </div>
            <div className="schedule-navigation">
              <button className="schedule-nav-btn" onClick={() => navigateSchedule(-1)}>‹</button>
              <h3>
                {scheduleViewMode === 'day' && selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
                {scheduleViewMode === 'week' && `Week of ${getWeekDays()[0].toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })} - ${getWeekDays()[6].toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}`}
                {scheduleViewMode === 'month' && selectedDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h3>
              <button className="schedule-nav-btn" onClick={() => navigateSchedule(1)}>›</button>
            </div>
          </div>

          {/* Schedule Content */}
          <div className="schedule-content">
            {scheduleViewMode === 'day' && (
              <div className="day-schedule">
                <div className="time-column">
                  {timeSlots.map(time => (
                    <div key={time} className="time-slot-header">
                      {formatTime(time)}
                    </div>
                  ))}
                </div>
                <div className="schedule-grid">
                  {timeSlots.map(time => {
                    const appointment = getAppointmentForTimeSlot(selectedDate, time);
                    return (
                      <div 
                        key={time} 
                        className={`schedule-cell ${appointment ? 'has-appointment' : 'empty'}`}
                        onClick={() => handleTimeSlotClick(selectedDate, time)}
                      >
                        {appointment && (
                          <div className="schedule-appointment" style={{ borderLeftColor: getStatusColor(appointment.status) }}>
                            <div className="schedule-appointment-time">{formatTime(appointment.time)}</div>
                            <div className="schedule-appointment-patient">{appointment.patient}</div>
                            <div className="schedule-appointment-type">{appointment.type}</div>
                            <div className="schedule-appointment-status" style={{ backgroundColor: getStatusColor(appointment.status) }}>
                              {appointment.status}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {scheduleViewMode === 'week' && (
              <div className="week-schedule">
                <div className="time-column">
                  <div className="time-header">Time</div>
                  {timeSlots.map(time => (
                    <div key={time} className="time-slot-header">
                      {formatTime(time)}
                    </div>
                  ))}
                </div>
                {getWeekDays().map(day => (
                  <div key={day.toISOString()} className="day-column">
                    <div className="day-header">
                      <div className="day-name">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className={`day-date ${isToday(day) ? 'today' : ''}`}>
                        {day.getDate()}
                      </div>
                    </div>
                    {timeSlots.map(time => {
                      const appointment = getAppointmentForTimeSlot(day, time);
                      return (
                        <div 
                          key={time} 
                          className={`schedule-cell ${appointment ? 'has-appointment' : 'empty'}`}
                          onClick={() => handleTimeSlotClick(day, time)}
                        >
                          {appointment && (
                            <div className="schedule-appointment" style={{ borderLeftColor: getStatusColor(appointment.status) }}>
                              <div className="schedule-appointment-patient">{appointment.patient}</div>
                              <div className="schedule-appointment-type">{appointment.type}</div>
                              <div className="schedule-appointment-status" style={{ backgroundColor: getStatusColor(appointment.status) }}>
                                {appointment.status}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {scheduleViewMode === 'month' && (
              <div className="month-schedule">
                <div className="month-weekdays">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="month-weekday">{day}</div>
                  ))}
                </div>
                <div className="month-grid">
                  {getMonthDays().map((day, index) => {
                    const appointments = getScheduleAppointmentsForDate(day);
                    return (
                      <div 
                        key={index} 
                        className={`month-day ${isToday(day) ? 'today' : ''} ${!isCurrentMonth(day) ? 'other-month' : ''}`}
                      >
                        <div className="month-day-number">{day.getDate()}</div>
                        {appointments.length > 0 && (
                          <div className="month-appointments">
                            {appointments.slice(0, 3).map((apt, aptIndex) => (
                              <div 
                                key={aptIndex}
                                className="month-appointment-dot"
                                style={{ backgroundColor: getStatusColor(apt.status) }}
                                title={`${apt.patient} - ${apt.type}`}
                              />
                            ))}
                            {appointments.length > 3 && (
                              <span className="more-appointments">+{appointments.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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

      {/* Schedule Appointment Details Modal */}
      {selectedTimeSlot && (
        <div className="schedule-modal-overlay" onClick={closeScheduleModals}>
          <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
            <div className="schedule-modal__header">
              <h2>Appointment Details</h2>
              <button className="close-btn" onClick={closeScheduleModals}>✕</button>
            </div>
            
            <div className="schedule-modal__content">
              <div className="appointment-details">
                <div className="detail-row">
                  <label>Date:</label>
                  <span>{formatDate(selectedTimeSlot.date)}</span>
                </div>
                <div className="detail-row">
                  <label>Time:</label>
                  <span>{formatTime(selectedTimeSlot.time)}</span>
                </div>
                <div className="detail-row">
                  <label>Patient:</label>
                  <span>{selectedTimeSlot.appointment.patient}</span>
                </div>
                <div className="detail-row">
                  <label>Type:</label>
                  <span>{selectedTimeSlot.appointment.type}</span>
                </div>
                <div className="detail-row">
                  <label>Duration:</label>
                  <span>{selectedTimeSlot.appointment.duration} minutes</span>
                </div>
                <div className="detail-row">
                  <label>Status:</label>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedTimeSlot.appointment.status) }}
                  >
                    {selectedTimeSlot.appointment.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="schedule-modal__actions">
              <button className="btn btn-primary">Edit Appointment</button>
              <button className="btn btn-secondary">Reschedule</button>
              <button className="btn btn-outline">Send Reminder</button>
              <button className="btn btn-danger">Cancel Appointment</button>
            </div>
          </div>
        </div>
      )}

      {/* New Appointment Modal */}
      {showScheduleModal && (
        <div className="schedule-modal-overlay" onClick={closeScheduleModals}>
          <div className="schedule-modal new-appointment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="schedule-modal__header">
              <h2>Schedule New Appointment</h2>
              <button className="close-btn" onClick={closeScheduleModals}>✕</button>
            </div>
            
            <div className="schedule-modal__content">
              <div className="form-section">
                <h3>Appointment Details</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Patient</label>
                    <select>
                      <option>Select a patient...</option>
                      <option>Emma Wilson</option>
                      <option>Sophia Rodriguez</option>
                      <option>Isabella Chen</option>
                      <option>Mia Johnson</option>
                      <option>Ava Thompson</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Appointment Type</label>
                    <select>
                      <option>Prenatal Checkup</option>
                      <option>Ultrasound</option>
                      <option>Follow-up</option>
                      <option>Emergency</option>
                      <option>Postpartum Check</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date" />
                  </div>
                  <div className="form-group">
                    <label>Time</label>
                    <select>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{formatTime(time)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <select>
                    <option>15</option>
                    <option>30</option>
                    <option>45</option>
                    <option>60</option>
                    <option>90</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea placeholder="Additional notes or instructions..."></textarea>
                </div>
              </div>
            </div>

            <div className="schedule-modal__actions">
              <button className="btn btn-outline" onClick={closeScheduleModals}>Cancel</button>
              <button className="btn btn-primary">Schedule Appointment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
