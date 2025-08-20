import React from 'react';
import './AppointmentsCalendar.css';

const AppointmentsCalendar = ({
  appointments,
  selectedDate,
  setSelectedDate,
  navigateMonth,
  generateCalendarDays,
  getAppointmentsForDate,
  isToday,
  isSelected,
  getMonthName,
  getPriorityColor,
  formatTime,
  onNewAppointment
}) => {
  return (
    <div className="appointments-section">
      <div className="appointments-section-header">
        <h2>Calendar View</h2>
        <button className="appointments-view-all-btn" onClick={onNewAppointment}>New Appointment</button>
      </div>
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
              const inMonth = date.getMonth() === selectedDate.getMonth();
              return (
                <div
                  key={index}
                  className={`calendar-day ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''} ${!inMonth ? 'other-month' : ''}`}
                  onClick={() => setSelectedDate(date)}
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

        <div className="selected-date-appointments">
          <h3>Appointments for {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })}</h3>
          <div className="appointments-list">
            {getAppointmentsForDate(selectedDate).map(appointment => (
              <div key={appointment.id} className="appointment-item">
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


