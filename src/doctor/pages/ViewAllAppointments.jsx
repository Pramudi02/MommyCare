import React, { useState, useEffect } from 'react';
import './ViewAllAppointments.css';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from '../../services/api';

const ViewAllAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filterType, setFilterType] = useState('all'); // all, week, month, custom
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [appointments, filterType, customStartDate, customEndDate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await doctorAPI.getAppointments();
      const list = res?.data || [];
      if (Array.isArray(list) && list.length) {
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
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let filtered = [...appointments];
    const today = new Date();
    
    switch (filterType) {
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = appointments.filter(apt => new Date(apt.date) >= weekAgo);
        break;
      case '2weeks':
        const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
        filtered = appointments.filter(apt => new Date(apt.date) >= twoWeeksAgo);
        break;
      case '3weeks':
        const threeWeeksAgo = new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000);
        filtered = appointments.filter(apt => new Date(apt.date) >= threeWeeksAgo);
        break;
      case 'month':
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = appointments.filter(apt => new Date(apt.date) >= monthAgo);
        break;
      case '2months':
        const twoMonthsAgo = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000);
        filtered = appointments.filter(apt => new Date(apt.date) >= twoMonthsAgo);
        break;
      case '3months':
        const threeMonthsAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
        filtered = appointments.filter(apt => new Date(apt.date) >= threeMonthsAgo);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          filtered = appointments.filter(apt => 
            apt.date >= customStartDate && apt.date <= customEndDate
          );
        }
        break;
      default:
        // 'all' - no filtering
        break;
    }
    
    // Sort by date and time
    filtered.sort((a, b) => {
      if (a.date !== b.date) {
        return new Date(a.date) - new Date(b.date);
      }
      return a.time.localeCompare(b.time);
    });
    
    setFilteredAppointments(filtered);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
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

  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleEditAppointment = (appointment) => {
    // Navigate to edit page or open edit modal
    console.log('Edit appointment:', appointment);
  };

  const handleDeleteAppointment = async (appointment) => {
    if (window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      try {
        await doctorAPI.deleteAppointment(appointment.id);
        console.log('Appointment deleted successfully');
        // Refresh appointments
        fetchAppointments();
      } catch (error) {
        console.error('Failed to delete appointment:', error);
        alert('Failed to delete appointment. Please try again.');
      }
    }
  };

  const closeAppointmentDetails = () => {
    setSelectedAppointment(null);
  };

  if (loading) {
    return (
      <div className="view-all-appointments-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-all-appointments-page">
      <div className="view-all-header">
        <div className="header-content">
          <h1>All Appointments</h1>
          <p>View and manage all your appointments</p>
          <div className="doctor-dashboard-header-decoration"></div>
        </div>
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Appointments
        </button>
      </div>

      {/* Filter Controls */}
      <div className="filter-section">
        <div className="filter-controls">
          <div className="filter-group">
            <label>Filter by Time Period:</label>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Appointments</option>
              <option value="week">Last Week</option>
              <option value="2weeks">Last 2 Weeks</option>
              <option value="3weeks">Last 3 Weeks</option>
              <option value="month">Last Month</option>
              <option value="2months">Last 2 Months</option>
              <option value="3months">Last 3 Months</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {filterType === 'custom' && (
            <div className="custom-date-filters">
              <div className="date-input-group">
                <label>From:</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="date-input"
                />
              </div>
              <div className="date-input-group">
                <label>To:</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="date-input"
                />
              </div>
            </div>
          )}

          <div className="filter-summary">
            <span className="appointment-count">
              {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
            </span>
            {filterType !== 'all' && (
              <span className="filter-info">
                Showing {filterType === 'custom' ? 'custom range' : filterType.replace('2', '2 ').replace('3', '3 ')} appointments
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="appointments-container">
        {filteredAppointments.length > 0 ? (
          <div className="appointments-table">
            <div className="table-header">
              <div className="header-cell">Date & Time</div>
              <div className="header-cell">Patient</div>
              <div className="header-cell">Type</div>
              <div className="header-cell">Duration</div>
              <div className="header-cell">Status</div>
              <div className="header-cell">Priority</div>
              <div className="header-cell">Actions</div>
            </div>
            
            {filteredAppointments.map(appointment => (
              <div key={appointment.id} className="table-row">
                <div className="table-cell datetime-cell">
                  <div className="date-info">{formatDate(appointment.date)}</div>
                  <div className="time-info">{formatTime(appointment.time)}</div>
                  <div className="duration-info">({appointment.duration} min)</div>
                </div>
                <div className="table-cell patient-cell">
                  <div className="patient-avatar">
                    <img src={appointment.image} alt={appointment.patient} />
                  </div>
                  <div className="patient-details">
                    <div className="patient-name">{appointment.patient}</div>
                    <div className="patient-id">ID: {appointment.patientId?.slice(-6)}</div>
                  </div>
                </div>
                <div className="table-cell type-cell">
                  <span className="appointment-type">{appointment.type}</span>
                </div>
                <div className="table-cell duration-cell">
                  {appointment.duration} min
                </div>
                <div className="table-cell status-cell">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(appointment.status) }}
                  >
                    {appointment.status}
                  </span>
                </div>
                <div className="table-cell priority-cell">
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(appointment.priority) }}
                  >
                    {appointment.priority}
                  </span>
                </div>
                <div className="table-cell actions-cell">
                  <div className="action-buttons">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => handleViewAppointment(appointment)}
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleEditAppointment(appointment)}
                      title="Edit Appointment"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteAppointment(appointment)}
                      title="Delete Appointment"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-appointments">
            <div className="no-appointments-icon">📅</div>
            <h3>No appointments found</h3>
            <p>Try adjusting your filter criteria or create a new appointment.</p>
            <button 
              className="create-appointment-btn"
              onClick={() => navigate('/doctor/appointments/new')}
            >
              Create New Appointment
            </button>
          </div>
        )}
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
                  <span>{formatDate(selectedAppointment.date)} at {formatTime(selectedAppointment.time)}</span>
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
                  <span>{selectedAppointment.notes || 'No notes available'}</span>
                </div>
              </div>
            </div>

            <div className="appointment-modal__actions">
              <button className="btn btn-primary" onClick={() => handleEditAppointment(selectedAppointment)}>
                Edit Appointment
              </button>
              <button className="btn btn-secondary">Reschedule</button>
              <button className="btn btn-outline">Send Reminder</button>
              <button className="btn btn-danger" onClick={() => handleDeleteAppointment(selectedAppointment)}>
                Delete Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllAppointments;
