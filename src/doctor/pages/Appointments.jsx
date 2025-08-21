import React, { useState, useEffect } from 'react';
import { FiCalendar, FiPlus, FiMapPin, FiBell, FiX, FiCheck, FiClock, FiUser, FiActivity, FiPlay, FiUsers, FiFileText, FiEye, FiChevronDown, FiList } from 'react-icons/fi';
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
    try {
      if (!date || !Array.isArray(appointments)) return [];
    const dateStr = date.toISOString().split('T')[0];
      return appointments.filter(apt => apt && apt.date === dateStr);
    } catch (error) {
      console.error('Error getting appointments for date:', error);
      return [];
    }
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
    try {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
      while (days.length < 42) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
    } catch (error) {
      console.error('Error generating calendar days:', error);
      return [];
    }
  };

  const getMonthName = (date) => {
    try {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch (error) {
      console.error('Error getting month name:', error);
      return 'Unknown Month';
    }
  };

  const changeMonth = (direction) => {
    try {
    const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() + direction);
      setSelectedDate(newDate);
    } catch (error) {
      console.error('Error changing month:', error);
    }
  };

  return (
    <div className="appointments-calendar">
      <div className="appointments-calendar-container">
        <div className="appointments-calendar-content">
          <div className="appointments-calendar__header">
            <div className="appointments-calendar__header-icon">
              <FiCalendar className="w-6 h-6" />
            </div>
            <div className="appointments-calendar__welcome">
        <h1>Appointment Management</h1>
              <p>Manage your appointments and patient schedules efficiently</p>
        </div>
      </div>

          <div className="appointments-calendar__content-wrapper">
            <div className="appointments-calendar__calendar-section">
              <div className="appointments-calendar__section-header">
              <h2>Appointment Views</h2>
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                onClick={() => setViewMode('calendar')}
              >
                    <FiCalendar size={16} />
                    Calendar
              </button>
              <button 
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                    <FiList size={16} />
                    List
              </button>
            </div>
          </div>

          {viewMode === 'calendar' && (
                <AppointmentsCalendar
                  selectedDate={selectedDate}
                  appointments={appointments}
                  onDateClick={handleDateClick}
                  onAppointmentClick={handleAppointmentClick}
                  getAppointmentsForDate={getAppointmentsForDate}
                  generateCalendarDays={generateCalendarDays}
                  getMonthName={getMonthName}
                  changeMonth={changeMonth}
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

            <div className="appointments-calendar__requests-section">
              <div className="appointments-calendar__section-header">
                <h3>Today's Appointments</h3>
                <button 
                  className="appointments-view-all-btn"
                  onClick={() => navigate('/doctor/appointments/view-all')}
                >
                  View All
                </button>
            </div>

              <div className="appointments-calendar__requests-list">
                {todayAppointments.length > 0 ? (
                  todayAppointments.map(appointment => (
                    <div key={appointment.id} className="appointments-calendar__request-item">
                      <div className="appointments-calendar__request-time">
                        <FiClock size={14} />
                        {formatTime(appointment.time)}
                      </div>
                      <div className="appointments-calendar__request-content">
                        <h4 className="appointments-calendar__request-name">{appointment.patient}</h4>
                        <p className="appointments-calendar__request-type">{appointment.type}</p>
                      </div>
                      <div className={`appointments-calendar__request-status appointments-calendar__request-status--${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </div>
                                </div>
                  ))
                ) : (
                  <div className="appointments-calendar__no-requests">
                    <div className="appointments-calendar__no-requests-icon">
                      <FiCalendar size={24} />
                    </div>
                    <p>No appointments scheduled for today</p>
        </div>
      )}
              </div>
            </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Appointments;
