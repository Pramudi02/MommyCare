import React, { useState } from 'react';
import { FiEye, FiEdit3, FiTrash2, FiCalendar, FiClock, FiUser, FiFileText, FiX, FiCheck } from 'react-icons/fi';
import './AppointmentsList.css';

const AppointmentsList = ({
  appointments,
  getStatusColor,
  getPriorityColor,
  formatTime,
  onNewAppointment
}) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

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
      // This would need to be implemented with the actual API call
      console.log('Appointment deleted successfully');
      setDeleteConfirmation(null);
      setSuccessMessage('Appointment deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      // Refresh appointments list
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
      // This would need to be implemented with the actual API call
      console.log('Appointment updated successfully');
      setEditingAppointment(null);
      setSuccessMessage('Appointment updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      // Refresh appointments list
    } catch (error) {
      console.error('Failed to update appointment:', error);
      alert('Failed to update appointment. Please try again.');
    }
  };

  const closeAppointmentDetails = () => {
    setSelectedAppointment(null);
  };

  return (
    <div className="appointments-section">
      <div className="appointments-section-header">
        <h2>All Appointments</h2>
        <button className="appointments-view-all-btn" onClick={onNewAppointment}>New Appointment</button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          <FiCheck size={20} />
          {successMessage}
        </div>
      )}

      <div className="list-view">
        {appointments.length > 0 ? (
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
            
            {appointments
              .sort((a, b) => {
                if (a.date !== b.date) {
                  return new Date(a.date) - new Date(b.date);
                }
                return a.time.localeCompare(b.time);
              })
              .map((appointment, index) => (
                <div key={appointment.id || `list-apt-${index}`} className="table-row">
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
                        title="View Details"
                        onClick={() => handleViewAppointment(appointment)}
                      >
                        <FiEye size={16} />
                      </button>
                      <button 
                        className="action-btn edit-btn" 
                        title="Edit Appointment"
                        onClick={() => handleEditAppointment(appointment)}
                      >
                        <FiEdit3 size={16} />
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        title="Delete Appointment"
                        onClick={() => handleDeleteAppointment(appointment)}
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
            <p>Create your first appointment to get started.</p>
            <button 
              className="create-appointment-btn"
              onClick={onNewAppointment}
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
              </div>
            </div>

            <div className="appointment-modal__actions">
              <button className="btn btn-primary" onClick={() => handleEditAppointment(selectedAppointment)}>
                <FiEdit3 size={16} />
                Edit Appointment
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
                <p>This action cannot be undone. The appointment will be permanently removed.</p>
                
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
          <label htmlFor="edit-date">
            <FiCalendar size={16} />
            Date
          </label>
          <input
            type="date"
            id="edit-date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit-time">
            <FiClock size={16} />
            Time
          </label>
          <input
            type="time"
            id="edit-time"
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
          <label htmlFor="edit-duration">
            <FiClock size={16} />
            Duration (minutes)
          </label>
          <select
            id="edit-duration"
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
          <label htmlFor="edit-type">
            <FiFileText size={16} />
            Type
          </label>
          <select
            id="edit-type"
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
        <label htmlFor="edit-status">
          <FiFileText size={16} />
          Status
        </label>
        <select
          id="edit-status"
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
        <label htmlFor="edit-notes">
          <FiFileText size={16} />
          Notes
        </label>
        <textarea
          id="edit-notes"
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

export default AppointmentsList;


