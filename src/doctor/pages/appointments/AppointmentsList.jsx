import React from 'react';
import './AppointmentsList.css';

const AppointmentsList = ({
  appointments,
  getStatusColor,
  getPriorityColor,
  formatTime,
  onNewAppointment
}) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="appointments-section">
      <div className="appointments-section-header">
        <h2>All Appointments</h2>
        <button className="appointments-view-all-btn" onClick={onNewAppointment}>New Appointment</button>
      </div>
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
                      <button className="action-btn view-btn" title="View Details">👁️</button>
                      <button className="action-btn edit-btn" title="Edit Appointment">✏️</button>
                      <button className="action-btn delete-btn" title="Delete Appointment">🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="no-appointments">
            <div className="no-appointments-icon">📅</div>
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
    </div>
  );
};

export default AppointmentsList;


