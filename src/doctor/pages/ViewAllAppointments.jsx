import React, { useState, useEffect } from 'react';
import { FiEye, FiEdit3, FiTrash2, FiArrowLeft, FiCalendar, FiClock, FiUser, FiFileText, FiPlus, FiX, FiCheck } from 'react-icons/fi';
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
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

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
    setEditingAppointment(appointment);
  };

  const handleDeleteAppointment = (appointment) => {
    setDeleteConfirmation(appointment);
  };

  const confirmDelete = async () => {
    try {
      await doctorAPI.deleteAppointment(deleteConfirmation.id);
      console.log('Appointment deleted successfully');
      setDeleteConfirmation(null);
      setSuccessMessage('Appointment deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchAppointments();
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      alert('Failed to delete appointment. Please try again.');
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const closeEditModal = () => {
    setEditingAppointment(null);
  };

  const saveEdit = async (updatedData) => {
    try {
      await doctorAPI.updateAppointment(editingAppointment.id, updatedData);
      console.log('Appointment updated successfully');
      setEditingAppointment(null);
      fetchAppointments();
    } catch (error) {
      console.error('Failed to update appointment:', error);
      alert('Failed to update appointment. Please try again.');
    }
  };

  const closeAppointmentDetails = () => {
    setSelectedAppointment(null);
  };

  const handleReschedule = (appointment) => {
    setRescheduleAppointment(appointment);
  };

  const closeRescheduleModal = () => {
    setRescheduleAppointment(null);
  };

  const saveReschedule = async (updatedData) => {
    try {
      await doctorAPI.updateAppointment(rescheduleAppointment.id, updatedData);
      console.log('Appointment rescheduled successfully');
      setRescheduleAppointment(null);
      setSuccessMessage('Appointment rescheduled successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchAppointments();
    } catch (error) {
      console.error('Failed to reschedule appointment:', error);
      alert('Failed to reschedule appointment. Please try again.');
    }
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
    <div className="doctor-dashboard-page">
      <div className="doctor-dashboard-container">
        <div className="doctor-dashboard">
          <div className="doctor-dashboard__header">
            <div className="doctor-dashboard__header-icon">
              <FiCalendar className="w-6 h-6" />
            </div>
            <div className="doctor-dashboard__welcome">
              <h1>All Appointments</h1>
              <p>View and manage all your appointments</p>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="success-message">
              <FiCheck size={20} />
              {successMessage}
            </div>
          )}

          <div className="doctor-dashboard__main-content">
            <div className="doctor-dashboard__section">
              <div className="section-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                  <FiArrowLeft size={16} />
                  Back to Appointments
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
                      <FiCalendar size={16} />
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
                          <div className="date-info">
                            <FiCalendar size={14} />
                            {formatDate(appointment.date)}
                          </div>
                          <div className="time-info">
                            <FiClock size={14} />
                            {formatTime(appointment.time)}
                          </div>
                          <div className="duration-info">({appointment.duration} min)</div>
                        </div>
                        <div className="table-cell patient-cell">
                          <div className="patient-avatar">
                            <img src={appointment.image} alt={appointment.patient} />
                          </div>
                          <div className="patient-details">
                            <div className="patient-name">
                              <FiUser size={14} />
                              {appointment.patient}
                            </div>
                            <div className="patient-id">ID: {appointment.patientId?.slice(-6)}</div>
                          </div>
                        </div>
                        <div className="table-cell type-cell">
                          <span className="appointment-type">
                            <FiFileText size={14} />
                            {appointment.type}
                          </span>
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
                              <FiEye size={16} />
                            </button>
                            <button 
                              className="action-btn edit-btn"
                              onClick={() => handleEditAppointment(appointment)}
                              title="Edit Appointment"
                            >
                              <FiEdit3 size={16} />
                            </button>
                            <button 
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteAppointment(appointment)}
                              title="Delete Appointment"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-appointments">
                    <div className="no-appointments-icon">
                      <FiCalendar size={48} />
                    </div>
                    <h3>No appointments found</h3>
                    <p>Try adjusting your filter criteria or create a new appointment.</p>
                    <button 
                      className="create-appointment-btn"
                      onClick={() => navigate('/doctor/appointments/new')}
                    >
                      <FiPlus size={16} />
                      Create New Appointment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="appointment-modal-overlay" onClick={closeAppointmentDetails}>
          <div className="appointment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="appointment-modal__header">
              <h2>Appointment Details</h2>
              <button className="close-btn" onClick={closeAppointmentDetails}>
                <FiX size={20} />
              </button>
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
                <FiEdit3 size={16} />
                Edit Appointment
              </button>
              <button className="btn btn-secondary" onClick={() => handleReschedule(selectedAppointment)}>
                <FiCalendar size={16} />
                Reschedule
              </button>
              <button className="btn btn-outline">Send Reminder</button>
              <button className="btn btn-danger" onClick={() => handleDeleteAppointment(selectedAppointment)}>
                <FiTrash2 size={16} />
                Delete Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="delete-modal-overlay" onClick={cancelDelete}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal__header">
              <h2>Delete Appointment</h2>
              <button className="close-btn" onClick={cancelDelete}>
                <FiX size={20} />
              </button>
            </div>
            
            <div className="delete-modal__content">
              <div className="delete-warning">
                <FiTrash2 size={48} className="delete-icon" />
                <h3>Are you sure you want to delete this appointment?</h3>
                <p>This action cannot be undone. The appointment will be permanently removed from the database.</p>
                
                <div className="appointment-summary">
                  <strong>Patient:</strong> {deleteConfirmation.patient}<br />
                  <strong>Date:</strong> {formatDate(deleteConfirmation.date)} at {formatTime(deleteConfirmation.time)}<br />
                  <strong>Type:</strong> {deleteConfirmation.type}
                </div>
              </div>
            </div>

            <div className="delete-modal__actions">
              <button className="btn btn-outline" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                <FiTrash2 size={16} />
                Delete Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {editingAppointment && (
        <div className="edit-modal-overlay" onClick={closeEditModal}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal__header">
              <h2>Edit Appointment</h2>
              <button className="close-btn" onClick={closeEditModal}>
                <FiX size={20} />
              </button>
            </div>
            
            <div className="edit-modal__content">
              <EditAppointmentForm 
                appointment={editingAppointment}
                onSave={saveEdit}
                onCancel={closeEditModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Appointment Modal */}
      {rescheduleAppointment && (
        <div className="reschedule-modal-overlay" onClick={closeRescheduleModal}>
          <div className="reschedule-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reschedule-modal__header">
              <h2>Reschedule Appointment</h2>
              <button className="close-btn" onClick={closeRescheduleModal}>
                <FiX size={20} />
              </button>
            </div>
            
            <div className="reschedule-modal__content">
              <RescheduleAppointmentForm 
                appointment={rescheduleAppointment}
                onSave={saveReschedule}
                onCancel={closeRescheduleModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Edit Appointment Form Component
const EditAppointmentForm = ({ appointment, onSave, onCancel }) => {
  const [form, setForm] = useState({
    date: appointment.date,
    time: appointment.time,
    duration: appointment.duration,
    type: appointment.type,
    status: appointment.status,
    notes: appointment.notes || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">
            <FiCalendar size={16} />
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">
            <FiClock size={16} />
            Time
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="duration">
            <FiClock size={16} />
            Duration (minutes)
          </label>
          <select
            id="duration"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>1 hour</option>
            <option value={90}>1.5 hours</option>
            <option value={120}>2 hours</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="type">
            <FiFileText size={16} />
            Type
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="consultation">Consultation</option>
            <option value="follow-up">Follow-up</option>
            <option value="emergency">Emergency</option>
            <option value="routine">Routine Check</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="status">
          <FiFileText size={16} />
          Status
        </label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleChange}
          required
          className="form-select"
        >
          <option value="scheduled">Scheduled</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="notes">
          <FiFileText size={16} />
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={4}
          placeholder="Add any additional notes..."
          className="form-textarea"
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          <FiEdit3 size={16} />
          Save Changes
        </button>
      </div>
    </form>
  );
};

// Reschedule Appointment Form Component
const RescheduleAppointmentForm = ({ appointment, onSave, onCancel }) => {
  const [form, setForm] = useState({
    date: appointment.date,
    time: appointment.time,
    duration: appointment.duration
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="reschedule-form">
      <div className="form-group">
        <label htmlFor="reschedule-date">
          <FiCalendar size={16} />
          New Date
        </label>
        <input
          type="date"
          id="reschedule-date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="reschedule-time">
          <FiClock size={16} />
          New Time
        </label>
        <input
          type="time"
          id="reschedule-time"
          name="time"
          value={form.time}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="reschedule-duration">
          <FiClock size={16} />
          Duration (minutes)
        </label>
        <select
          id="reschedule-duration"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          required
          className="form-select"
        >
          <option value={15}>15 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={45}>45 minutes</option>
          <option value={60}>1 hour</option>
          <option value={90}>1.5 hours</option>
          <option value={120}>2 hours</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          <FiCalendar size={16} />
          Reschedule Appointment
        </button>
      </div>
    </form>
  );
};

export default ViewAllAppointments;
