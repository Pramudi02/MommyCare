import React from 'react';
import './AppointmentsSchedule.css';

const AppointmentsSchedule = ({
  scheduleViewMode,
  setScheduleViewMode,
  selectedDate,
  timeSlots,
  getWeekDays,
  getMonthDays,
  getAppointmentForTimeSlot,
  navigateSchedule,
  isToday,
  isCurrentMonth,
  getStatusColor,
  formatTime,
  onNewAppointment
}) => {
  return (
    <div className="appointments-section">
      <div className="appointments-section-header">
        <h2>Schedule View</h2>
        <button className="appointments-view-all-btn" onClick={onNewAppointment}>New Appointment</button>
      </div>
      <div className="schedule-view">
        <div className="schedule-header">
          <div className="schedule-view-toggle">
            <button className={`schedule-toggle-btn ${scheduleViewMode === 'day' ? 'active' : ''}`} onClick={() => setScheduleViewMode('day')}>Day</button>
            <button className={`schedule-toggle-btn ${scheduleViewMode === 'week' ? 'active' : ''}`} onClick={() => setScheduleViewMode('week')}>Week</button>
            <button className={`schedule-toggle-btn ${scheduleViewMode === 'month' ? 'active' : ''}`} onClick={() => setScheduleViewMode('month')}>Month</button>
          </div>
          <div className="schedule-navigation">
            <button className="schedule-nav-btn" onClick={() => navigateSchedule(-1)}>‹</button>
            <h3>
              {scheduleViewMode === 'day' && selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {scheduleViewMode === 'week' && `Week of ${getWeekDays()[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${getWeekDays()[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
              {scheduleViewMode === 'month' && selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button className="schedule-nav-btn" onClick={() => navigateSchedule(1)}>›</button>
          </div>
        </div>

        <div className="schedule-content">
          {scheduleViewMode === 'day' && (
            <div className="day-schedule">
              <div className="time-column">
                {timeSlots.map(time => (
                  <div key={time} className="time-slot-header">{formatTime(time)}</div>
                ))}
              </div>
              <div className="schedule-grid">
                {timeSlots.map(time => {
                  const appointment = getAppointmentForTimeSlot(selectedDate, time);
                  return (
                    <div key={time} className={`schedule-cell ${appointment ? 'has-appointment' : 'empty'}`}>
                      {appointment && (
                        <div className="schedule-appointment" style={{ borderLeftColor: getStatusColor(appointment.status) }}>
                          <div className="schedule-appointment-time">{formatTime(appointment.time)}</div>
                          <div className="schedule-appointment-patient">{appointment.patient}</div>
                          <div className="schedule-appointment-type">{appointment.type}</div>
                          <div className="schedule-appointment-status" style={{ backgroundColor: getStatusColor(appointment.status) }}>{appointment.status}</div>
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
                  <div key={time} className="time-slot-header">{formatTime(time)}</div>
                ))}
              </div>
              {getWeekDays().map(day => (
                <div key={day.toISOString()} className="day-column">
                  <div className="day-header">
                    <div className="day-name">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className={`day-date ${isToday(day) ? 'today' : ''}`}>{day.getDate()}</div>
                  </div>
                  {timeSlots.map(time => {
                    const appointment = getAppointmentForTimeSlot(day, time);
                    return (
                      <div key={time} className={`schedule-cell ${appointment ? 'has-appointment' : 'empty'}`}>
                        {appointment && (
                          <div className="schedule-appointment" style={{ borderLeftColor: getStatusColor(appointment.status) }}>
                            <div className="schedule-appointment-patient">{appointment.patient}</div>
                            <div className="schedule-appointment-type">{appointment.type}</div>
                            <div className="schedule-appointment-status" style={{ backgroundColor: getStatusColor(appointment.status) }}>{appointment.status}</div>
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
                  const aps = (getWeekDays(), []); // keep layout
                  return (
                    <div key={index} className={`month-day ${isToday(day) ? 'today' : ''} ${!isCurrentMonth(day) ? 'other-month' : ''}`}>
                      <div className="month-day-number">{day.getDate()}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsSchedule;


