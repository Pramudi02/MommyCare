import React, { useState } from 'react';
import { FiCalendar, FiPlus, FiMapPin, FiBell, FiX, FiCheck, FiClock, FiUser, FiActivity, FiPlay, FiUsers } from 'react-icons/fi';
import './Appointments.css';

const Appointments = () => {
  const [currentWeek, setCurrentWeek] = useState('May 11/05-17/05');
  const [viewMode, setViewMode] = useState('week');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Sample appointments data for the week matching the image
  const appointments = [
    {
      id: 1,
      day: 'monday',
      date: '11/05',
      startTime: '07:00',
      endTime: '07:30',
      type: 'Emergency visit',
      icon: 'stethoscope',
      location: 'West camp, Room 312',
      color: 'pink'
    },
    {
      id: 2,
      day: 'monday',
      date: '11/05',
      startTime: '07:30',
      endTime: '07:55',
      type: 'Diagnostic test',
      icon: 'medical',
      location: 'West camp, Room 312',
      color: 'light-blue'
    },
    {
      id: 3,
      day: 'monday',
      date: '11/05',
      startTime: '08:00',
      endTime: '09:00',
      type: 'Team planning',
      icon: 'team',
      location: 'East camp, Room 200',
      color: 'yellow',
      agenda: 'Agenda.pdf',
      participants: ['TY', 'AB', 'NR', 'SS', '+3']
    },
    {
      id: 4,
      day: 'monday',
      date: '11/05',
      startTime: '09:00',
      endTime: '09:30',
      type: 'Emergency visit',
      icon: 'stethoscope',
      location: 'West camp, Room 312',
      color: 'pink'
    },
    {
      id: 5,
      day: 'tuesday',
      date: '12/05',
      startTime: '07:00',
      endTime: '08:00',
      type: 'Online visit',
      icon: 'video',
      location: 'West camp, Room 312',
      color: 'pink',
      participants: ['TY'],
      joinButton: true
    },
    {
      id: 6,
      day: 'tuesday',
      date: '12/05',
      startTime: '08:00',
      endTime: '08:15',
      type: 'Diagnostic test',
      icon: 'medical',
      location: 'West camp, Room 312',
      color: 'light-blue'
    },
    {
      id: 7,
      day: 'tuesday',
      date: '12/05',
      startTime: '08:30',
      endTime: '09:30',
      type: 'Interns visit',
      icon: 'team',
      location: 'West camp, Conference room 404',
      color: 'blue',
      participants: ['TY', 'AB', 'NR', 'SS', '+12']
    },
    {
      id: 8,
      day: 'wednesday',
      date: '13/05',
      startTime: '09:00',
      endTime: '09:30',
      type: 'Follow-up',
      icon: 'stethoscope',
      location: 'West camp, Room 312',
      color: 'pink'
    },
    {
      id: 9,
      day: 'wednesday',
      date: '13/05',
      startTime: '09:40',
      endTime: '10:00',
      type: 'Emergency visit',
      icon: 'stethoscope',
      location: 'West camp, Room 312',
      color: 'pink'
    },
    {
      id: 10,
      day: 'thursday',
      date: '14/05',
      startTime: '07:00',
      endTime: '08:00',
      type: 'Online visit',
      icon: 'video',
      location: 'West camp, Room 312',
      color: 'pink',
      participants: ['TY', 'AB', 'NR', 'SS'],
      status: 'In progress...'
    },
    {
      id: 11,
      day: 'friday',
      date: '15/05',
      startTime: '07:00',
      endTime: '08:00',
      type: 'Team results',
      icon: 'team',
      location: 'East camp, Room 200',
      color: 'yellow',
      agenda: 'Agenda.pdf',
      participants: ['TY', 'AB', 'NR', 'SS', '+3']
    }
  ];

  // Sample appointment requests data
  const appointmentRequests = [
    {
      id: 1,
      date: '2024-05-15',
      time: '10:00 AM',
      mom: 'Jennifer Lee',
      type: 'Prenatal Checkup',
      description: 'First trimester visit',
      status: 'pending'
    },
    {
      id: 2,
      date: '2024-05-16',
      time: '1:30 PM',
      mom: 'Aisha Khan',
      type: 'Ultrasound',
      description: 'Follow-up scan',
      status: 'pending'
    },
    {
      id: 3,
      date: '2024-05-17',
      time: '3:00 PM',
      mom: 'Maria Garcia',
      type: 'Emergency Consultation',
      description: 'Severe morning sickness',
      status: 'pending'
    }
  ];

  const timeSlots = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const days = [
    { name: 'MONDAY', date: '11/05', key: 'monday' },
    { name: 'TUESDAY', date: '12/05', key: 'tuesday' },
    { name: 'WEDNESDAY', date: '13/05', key: 'wednesday' },
    { name: 'THU', date: '14/05', key: 'thursday', current: true },
    { name: 'FR', date: '15/05', key: 'friday' },
    { name: 'SA', date: '16/05', key: 'saturday', weekend: true },
    { name: 'SU', date: '17/05', key: 'sunday', weekend: true }
  ];

  // Month view data
  const monthDays = [
    [null, null, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 31, null, null]
  ];

  const getAppointmentsForTimeSlot = (day, time) => {
    return appointments.filter(apt => 
      apt.day === day && apt.startTime === time
    );
  };

  const getAppointmentsForDay = (day) => {
    return appointments.filter(apt => apt.day === day);
  };

  const getAppointmentsForDate = (date) => {
    // For month view - return appointments for a specific date
    return appointments.filter(apt => apt.date === date);
  };

  const getIconComponent = (iconType) => {
    switch (iconType) {
      case 'stethoscope':
        return <FiActivity size={16} />;
      case 'video':
        return <FiPlay size={16} />;
      case 'medical':
        return <FiActivity size={16} />;
      case 'team':
        return <FiUsers size={16} />;
      default:
        return <FiCalendar size={16} />;
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const currentTime = getCurrentTime();

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleAcceptRequest = (requestId) => {
    // Here you would typically update the backend
    console.log('Accepting request:', requestId);
  };

  const handleRemoveRequest = (requestId) => {
    // Here you would typically update the backend
    console.log('Removing request:', requestId);
  };

  const renderTodayView = () => {
    const todayAppointments = getAppointmentsForDay('thursday'); // Current day
    return (
      <div className="appointments-calendar__today-view">
        <div className="appointments-calendar__today-header">
          <h2>Today - Thursday, May 14</h2>
        </div>
        <div className="appointments-calendar__today-timeline">
          {timeSlots.map(time => {
            const timeAppointments = todayAppointments.filter(apt => apt.startTime === time);
            return (
              <div key={time} className="appointments-calendar__today-time-slot">
                <div className="appointments-calendar__today-time">{time}</div>
                <div className="appointments-calendar__today-events">
                  {timeAppointments.map(appointment => (
                    <div 
                      key={appointment.id} 
                      className={`appointments-calendar__today-event appointments-calendar__event--${appointment.color}`}
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                      <div className="appointments-calendar__today-event-time">
                        {appointment.startTime}-{appointment.endTime}
                      </div>
                      <div className="appointments-calendar__today-event-title">
                        {appointment.type}
                      </div>
                      <div className="appointments-calendar__today-event-location">
                        <FiMapPin size={12} />
                        {appointment.location}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    return (
      <div className="appointments-calendar__month-view">
        <div className="appointments-calendar__month-header">
          <h2>May 2024</h2>
        </div>
        <div className="appointments-calendar__month-grid">
          <div className="appointments-calendar__month-days-header">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="appointments-calendar__month-day-header">
                {day}
              </div>
            ))}
          </div>
          <div className="appointments-calendar__month-weeks">
            {monthDays.map((week, weekIndex) => (
              <div key={weekIndex} className="appointments-calendar__month-week">
                {week.map((day, dayIndex) => {
                  if (!day) return <div key={dayIndex} className="appointments-calendar__month-day-empty" />;
                  
                  const dateStr = `14/05`; // Simplified for demo
                  const dayAppointments = getAppointmentsForDate(dateStr);
                  const isToday = day === 14; // Current day
                  
                  return (
                    <div 
                      key={dayIndex} 
                      className={`appointments-calendar__month-day ${isToday ? 'today' : ''} ${dayAppointments.length > 0 ? 'has-appointments' : ''}`}
                    >
                      <span className="appointments-calendar__month-day-number">{day}</span>
                      {dayAppointments.length > 0 && (
                        <div className="appointments-calendar__month-day-indicator">
                          {dayAppointments.length}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    return (
      <>
        <div className="appointments-calendar__grid">
          <div className="appointments-calendar__time-column">
            <div className="appointments-calendar__time-header"></div>
            {timeSlots.map(time => (
              <div key={time} className="appointments-calendar__time-slot">
                {time}
              </div>
            ))}
          </div>

          {days.map(day => (
            <div key={day.key} className="appointments-calendar__day-column">
              <div className={`appointments-calendar__day-header ${day.current ? 'current' : ''} ${day.weekend ? 'weekend' : ''}`}>
                <div className="appointments-calendar__day-name">{day.name}</div>
                <div className="appointments-calendar__day-date">{day.date}</div>
              </div>
              
              {timeSlots.map(time => {
                const dayAppointments = getAppointmentsForTimeSlot(day.key, time);
                return (
                  <div key={time} className="appointments-calendar__time-cell">
                    {dayAppointments.map(appointment => (
                      <div 
                        key={appointment.id} 
                        className={`appointments-calendar__event appointments-calendar__event--${appointment.color}`}
                        style={{
                          gridRow: `span ${Math.ceil((parseInt(appointment.endTime.split(':')[1]) - parseInt(appointment.startTime.split(':')[1])) / 30)}`
                        }}
                        onClick={() => handleAppointmentClick(appointment)}
                      >
                        <div className="appointments-calendar__event-header">
                          <div className="appointments-calendar__event-icon">
                            {getIconComponent(appointment.icon)}
                          </div>
                          <div className="appointments-calendar__event-time">
                            {appointment.startTime}-{appointment.endTime}
                          </div>
                        </div>
                        
                        <div className="appointments-calendar__event-title">
                          {appointment.type}
                        </div>
                        
                        <div className="appointments-calendar__event-location">
                          <FiMapPin size={12} />
                          {appointment.location}
                        </div>
                        
                        {appointment.agenda && (
                          <div className="appointments-calendar__event-agenda">
                            <FiCalendar size={12} />
                            {appointment.agenda}
                          </div>
                        )}
                        
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
                        
                        {appointment.joinButton && (
                          <button className="appointments-calendar__event-join">
                            Join
                          </button>
                        )}
                        
                        {appointment.status && (
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
          ))}
        </div>

        {/* Current time indicator */}
        <div 
          className="appointments-calendar__current-time"
          style={{
            top: `${(parseInt(currentTime.split(':')[0]) - 7) * 60 + parseInt(currentTime.split(':')[1])}px`
          }}
        >
          <div className="appointments-calendar__current-time-line"></div>
          <div className="appointments-calendar__current-time-label">
            {currentTime}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="appointments-calendar">
      <div className="appointments-calendar__main">
        <div className="appointments-calendar__header">
          <div className="appointments-calendar__title">
            <h1>Stay up to date, Sarah</h1>
            <div className="appointments-calendar__week-selector">
              <button className="appointments-calendar__week-btn">
                {currentWeek}
                <FiCalendar size={16} />
              </button>
            </div>
          </div>
          
          <div className="appointments-calendar__actions">
            <button className="appointments-calendar__action-btn">
              <FiPlus size={16} />
              New Appointment
            </button>
            <button className="appointments-calendar__icon-btn">
              <FiBell size={16} />
            </button>
          </div>
        </div>

        <div className="appointments-calendar__view-toggles">
          <button 
            className={`appointments-calendar__view-btn ${viewMode === 'today' ? 'active' : ''}`}
            onClick={() => setViewMode('today')}
          >
            Today
          </button>
          <button 
            className={`appointments-calendar__view-btn ${viewMode === 'week' ? 'active' : ''}`}
            onClick={() => setViewMode('week')}
          >
            Week
          </button>
          <button 
            className={`appointments-calendar__view-btn ${viewMode === 'month' ? 'active' : ''}`}
            onClick={() => setViewMode('month')}
          >
            Month
          </button>
        </div>

        {viewMode === 'today' && renderTodayView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'month' && renderMonthView()}
      </div>

      {/* Appointment Requests Sidebar */}
      <div className="appointments-calendar__sidebar">
        <div className="appointments-calendar__requests-section">
          <h3>Appointment Requests</h3>
          <div className="appointments-calendar__requests-list">
            {appointmentRequests.map(request => (
              <div key={request.id} className="appointments-calendar__request-item">
                <div className="appointments-calendar__request-date">
                  {new Date(request.date).toLocaleDateString()}
                </div>
                <div className="appointments-calendar__request-content">
                  <h4 className="appointments-calendar__request-mom">{request.mom}</h4>
                  <p className="appointments-calendar__request-type">{request.type} • {request.time}</p>
                  <p className="appointments-calendar__request-description">{request.description}</p>
                </div>
                <div className="appointments-calendar__request-actions">
                  <button 
                    className="appointments-calendar__request-btn appointments-calendar__request-btn--accept"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    <FiCheck size={14} />
                    Accept
                  </button>
                  <button 
                    className="appointments-calendar__request-btn appointments-calendar__request-btn--remove"
                    onClick={() => handleRemoveRequest(request.id)}
                  >
                    <FiX size={14} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2>Appointment Details</h2>
              <button className="modal__close" onClick={() => setIsModalOpen(false)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="modal__content">
              <div className="modal__section">
                <h3>Appointment Information</h3>
                <div className="modal__grid">
                  <div className="modal__field">
                    <label>Date & Time</label>
                    <span>{selectedAppointment.date} at {selectedAppointment.startTime}-{selectedAppointment.endTime}</span>
                  </div>
                  <div className="modal__field">
                    <label>Type</label>
                    <span>{selectedAppointment.type}</span>
                  </div>
                  <div className="modal__field">
                    <label>Location</label>
                    <span>{selectedAppointment.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal__actions">
              <button className="modal__btn modal__btn--secondary">Reschedule</button>
              <button className="modal__btn modal__btn--primary">Mark Complete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
