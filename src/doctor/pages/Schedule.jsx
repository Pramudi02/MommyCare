import React, { useState } from 'react';
import './Schedule.css';

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'week', 'month', 'day'
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Sample schedule data
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

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - currentDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
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

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return scheduleData[dateStr] || [];
  };

  const getAppointmentForTimeSlot = (date, time) => {
    const appointments = getAppointmentsForDate(date);
    return appointments.find(apt => apt.time === time);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  const handleTimeSlotClick = (date, time) => {
    const appointment = getAppointmentForTimeSlot(date, time);
    if (appointment) {
      setSelectedTimeSlot({ date, time, appointment });
    } else {
      setShowScheduleModal(true);
    }
  };

  const closeModals = () => {
    setSelectedTimeSlot(null);
    setShowScheduleModal(false);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  return (
    <div className="schedule-page">
      <div className="schedule-header">
        <div className="schedule-header__left">
          <h1>Schedule Management</h1>
          <p>Manage your daily schedule and appointments</p>
        </div>
        <div className="schedule-header__right">
          <button className="new-appointment-btn">
            <span>➕</span>
            New Appointment
          </button>
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'day' ? 'active' : ''}`}
              onClick={() => setViewMode('day')}
            >
              Day
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="schedule-navigation">
        <button className="nav-btn" onClick={() => navigateDate(-1)}>‹</button>
        <h2>
          {viewMode === 'day' && currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
          {viewMode === 'week' && `Week of ${getWeekDays()[0].toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })} - ${getWeekDays()[6].toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}`}
          {viewMode === 'month' && currentDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </h2>
        <button className="nav-btn" onClick={() => navigateDate(1)}>›</button>
      </div>

      {/* Schedule View */}
      <div className="schedule-view">
        {viewMode === 'day' && (
          <div className="day-view">
            <div className="time-column">
              {timeSlots.map(time => (
                <div key={time} className="time-slot-header">
                  {formatTime(time)}
                </div>
              ))}
            </div>
            <div className="schedule-grid">
              {timeSlots.map(time => {
                const appointment = getAppointmentForTimeSlot(currentDate, time);
                return (
                  <div 
                    key={time} 
                    className={`schedule-cell ${appointment ? 'has-appointment' : 'empty'}`}
                    onClick={() => handleTimeSlotClick(currentDate, time)}
                  >
                    {appointment && (
                      <div className="appointment-item" style={{ borderLeftColor: getStatusColor(appointment.status) }}>
                        <div className="appointment-time">{formatTime(appointment.time)}</div>
                        <div className="appointment-patient">{appointment.patient}</div>
                        <div className="appointment-type">{appointment.type}</div>
                        <div className="appointment-status" style={{ backgroundColor: getStatusColor(appointment.status) }}>
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

        {viewMode === 'week' && (
          <div className="week-view">
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
                        <div className="appointment-item" style={{ borderLeftColor: getStatusColor(appointment.status) }}>
                          <div className="appointment-patient">{appointment.patient}</div>
                          <div className="appointment-type">{appointment.type}</div>
                          <div className="appointment-status" style={{ backgroundColor: getStatusColor(appointment.status) }}>
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

        {viewMode === 'month' && (
          <div className="month-view">
            <div className="month-weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="month-weekday">{day}</div>
              ))}
            </div>
            <div className="month-grid">
              {getMonthDays().map((day, index) => {
                const appointments = getAppointmentsForDate(day);
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

      {/* Appointment Details Modal */}
      {selectedTimeSlot && (
        <div className="schedule-modal-overlay" onClick={closeModals}>
          <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
            <div className="schedule-modal__header">
              <h2>Appointment Details</h2>
              <button className="close-btn" onClick={closeModals}>✕</button>
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
        <div className="schedule-modal-overlay" onClick={closeModals}>
          <div className="schedule-modal new-appointment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="schedule-modal__header">
              <h2>Schedule New Appointment</h2>
              <button className="close-btn" onClick={closeModals}>✕</button>
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
              <button className="btn btn-outline" onClick={closeModals}>Cancel</button>
              <button className="btn btn-primary">Schedule Appointment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule; 