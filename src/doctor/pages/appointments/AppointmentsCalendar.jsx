import React from 'react';
import './AppointmentsCalendar.css';
import { useNavigate } from 'react-router-dom';

const AppointmentsCalendar = ({
  selectedDate,
  appointments,
  onDateClick,
  onAppointmentClick,
  getAppointmentsForDate,
  generateCalendarDays,
  getMonthName,
  changeMonth
}) => {
  const navigate = useNavigate();
  
  // Helper functions
  const isToday = (date) => {
    try {
      if (!date) return false;
      const today = new Date();
      return date.toDateString() === today.toDateString();
    } catch (error) {
      console.error('Error checking if date is today:', error);
      return false;
    }
  };

  const isSelected = (date) => {
    try {
      if (!date || !selectedDate) return false;
      return date.toDateString() === selectedDate.toDateString();
    } catch (error) {
      console.error('Error checking if date is selected:', error);
      return false;
    }
  };

  const getPriorityColor = (priority) => {
    try {
      if (!priority) return '#6b7280';
      switch (priority.toLowerCase()) {
        case 'urgent': return '#ef4444';
        case 'high': return '#f59e0b';
        case 'normal': return '#10b981';
        default: return '#6b7280';
      }
    } catch (error) {
      console.error('Error getting priority color:', error);
      return '#6b7280';
    }
  };

  const formatTime = (time) => {
    if (!time) return '--:--';
    try {
      const [hour, minute] = time.split(':');
      const hourNum = parseInt(hour);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
      return `${displayHour}:${minute} ${ampm}`;
    } catch (error) {
      console.error('Error formatting time:', error, time);
      return '--:--';
    }
  };

  return (
    <div className="appointments-section">
      <div className="appointments-section-header">
        <h2>Calendar View</h2>
        <button className="appointments-view-all-btn" onClick={() => navigate('/doctor/appointments/new')}>New Appointment</button>
      </div>
      <div className="calendar-view">
        <div className="calendar-header">
          <button className="calendar-nav-btn" onClick={() => changeMonth(-1)}>‹</button>
          <h2>{getMonthName(selectedDate)}</h2>
          <button className="calendar-nav-btn" onClick={() => changeMonth(1)}>›</button>
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
              const inMonth = date.getMonth() === selectedDate.getMonth();
              return (
                <div
                  key={`date-${index}`}
                  className={`calendar-day ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''} ${!inMonth ? 'other-month' : ''}`}
                  onClick={() => onDateClick(date)}
                >
                  <span className="day-number">{date.getDate()}</span>
                  {dayAppointments.length > 0 && (
                    <div className="appointment-indicators">
                      {dayAppointments.slice(0, 3).map((apt, aptIndex) => (
                        <div
                          key={apt.id || `apt-${index}-${aptIndex}`}
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

        <div className="selected-date-appointments">
          <h3>Appointments for {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}</h3>
          <div className="appointments-list">
            {getAppointmentsForDate(selectedDate).map((appointment, index) => (
              <div key={appointment.id || `selected-apt-${index}`} className="appointment-item">
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
                  <span className="status-badge">{appointment.status}</span>
                  <span className="priority-badge" style={{ backgroundColor: getPriorityColor(appointment.priority) }}>{appointment.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsCalendar;


