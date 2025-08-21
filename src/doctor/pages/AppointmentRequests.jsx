import React, { useState, useEffect } from 'react';
import { FiUsers, FiCalendar, FiClock, FiUser, FiFileText, FiCheck, FiX, FiAlertTriangle, FiFilter, FiSearch, FiEye, FiMessageSquare, FiEdit3, FiCheckCircle, FiXCircle, FiClock as FiClockIcon } from 'react-icons/fi';
import './AppointmentRequests.css';
import { doctorAPI } from '../../services/api';

const AppointmentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseForm, setResponseForm] = useState({
    response: 'approved',
    notes: '',
    suggestedDate: '',
    suggestedTime: ''
  });

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await doctorAPI.getAppointmentRequests(filterStatus);
      const list = res?.data || [];
      setRequests(list);
    } catch (error) {
      console.error('Failed to fetch appointment requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (requestId) => {
    try {
      await doctorAPI.respondToRequest(requestId, responseForm);
      setSelectedRequest(null);
      setResponseForm({
        response: 'approved',
        notes: '',
        suggestedDate: '',
        suggestedTime: ''
      });
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Failed to respond to request:', error);
      alert('Failed to respond to request. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'rescheduled': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'normal': return '#10b981';
      case 'low': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';

    // Handle MongoDB ISO string or object with $date
    if (typeof timeStr === 'object' && timeStr.$date) {
      timeStr = timeStr.$date;
    }

    // If ISO string
    if (typeof timeStr === 'string' && timeStr.includes('T')) {
      try {
        const date = new Date(timeStr);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch {
        return 'Invalid Time';
      }
    }

    // If HH:mm string
    if (typeof timeStr === 'string' && timeStr.includes(':')) {
      const [hour, minute] = timeStr.split(':');
      const hourNum = parseInt(hour, 10);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
      return `${displayHour}:${minute} ${ampm}`;
    }

    return 'Invalid Time';
  };

  if (loading) {
    return (
      <div className="appointment-requests-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading appointment requests...</p>
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
              <FiUser />
            </div>
            <div className="doctor-dashboard__welcome">
              <h1>Appointment Requests</h1>
              <p>Review and respond to patient appointment requests</p>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="doctor-dashboard__section">
            <div className="filter-controls">
              <div className="filter-group">
                <label><FiFilter className="filter-icon" /> Filter by Status:</label>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Requests</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>
              </div>

              <div className="filter-summary">
                <span className="request-count">
                  <FiUsers className="count-icon" />
                  {requests.length} request{requests.length !== 1 ? 's' : ''}
                </span>
                {filterStatus !== 'all' && (
                  <span className="filter-info">
                    Showing {filterStatus} requests
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Requests List */}
          <div className="doctor-dashboard__section">
            {requests.length > 0 ? (
              <div className="requests-list">
                {requests.map(request => (
                  <div key={request._id} className="request-card">
                    <div className="request-header">
                      <div className="patient-info">
                        <div className="patient-avatar">
                          <FiUser />
                        </div>
                        <div className="patient-details">
                          <h3>{request.patient?.firstName} {request.patient?.lastName}</h3>
                          <p>{request.patient?.email}</p>
                        </div>
                      </div>
                      <div className="request-meta">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(request.status) }}
                        >
                          {request.status === 'pending' && <FiClock className="status-icon" />}
                          {request.status === 'approved' && <FiCheckCircle className="status-icon" />}
                          {request.status === 'rejected' && <FiXCircle className="status-icon" />}
                          {request.status === 'rescheduled' && <FiEdit3 className="status-icon" />}
                          {request.status}
                        </span>
                        <span 
                          className="urgency-badge"
                          style={{ backgroundColor: getUrgencyColor(request.urgency) }}
                        >
                          {request.urgency === 'urgent' && <FiAlertTriangle className="urgency-icon" />}
                          {request.urgency}
                        </span>
                      </div>
                    </div>

                    <div className="request-content">
                      <div className="request-details">
                        <div className="detail-row">
                          <label><FiCalendar className="detail-icon" /> Requested Date:</label>
                          <span>{formatDate(request.requestedDate)}</span>
                        </div>
                        <div className="detail-row">
                          <label><FiClockIcon className="detail-icon" /> Requested Time:</label>
                          <span>{formatTime(request.requestedTime)}</span>
                        </div>
                        <div className="detail-row">
                          <label><FiClock className="detail-icon" /> Duration:</label>
                          <span>{request.preferredDuration} minutes</span>
                        </div>
                        <div className="detail-row">
                          <label><FiFileText className="detail-icon" /> Type:</label>
                          <span>{request.type}</span>
                        </div>
                        <div className="detail-row">
                          <label><FiMessageSquare className="detail-icon" /> Reason:</label>
                          <span>{request.reason}</span>
                        </div>
                        {request.patientNotes && (
                          <div className="detail-row">
                            <label><FiMessageSquare className="detail-icon" /> Patient Notes:</label>
                            <span>{request.patientNotes}</span>
                          </div>
                        )}
                      </div>

                      {request.status === 'pending' && (
                        <div className="request-actions">
                          <button 
                            className="action-btn approve-btn"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <FiEye className="action-icon" />
                            Respond to Request
                          </button>
                        </div>
                      )}

                      {request.status !== 'pending' && request.doctorResponse && (
                        <div className="doctor-response">
                          <h4><FiCheck className="response-icon" /> Your Response:</h4>
                          <p><strong>Status:</strong> {request.doctorResponse.status}</p>
                          {request.doctorResponse.notes && (
                            <p><strong>Notes:</strong> {request.doctorResponse.notes}</p>
                          )}
                          {request.doctorResponse.suggestedDate && (
                            <p><strong>Suggested Date:</strong> {formatDate(request.doctorResponse.suggestedDate)}</p>
                          )}
                          {request.doctorResponse.suggestedTime && (
                            <p><strong>Suggested Time:</strong> {formatTime(request.doctorResponse.suggestedTime)}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-requests">
                <div className="no-requests-icon">
                  <FiFileText />
                </div>
                <h3>No appointment requests found</h3>
                <p>When patients request appointments, they will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Response Modal */}
      {selectedRequest && (
        <div className="response-modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="response-modal" onClick={(e) => e.stopPropagation()}>
            <div className="response-modal__header">
              <h2><FiMessageSquare className="modal-icon" /> Respond to Appointment Request</h2>
              <button className="close-btn" onClick={() => setSelectedRequest(null)}>
                <FiX />
              </button>
            </div>
            
            <div className="response-modal__content">
              <div className="form-group">
                <label><FiCheck className="form-icon" /> Response:</label>
                <select 
                  value={responseForm.response}
                  onChange={(e) => setResponseForm(prev => ({ ...prev, response: e.target.value }))}
                  className="form-select"
                >
                  <option value="approved">Approve</option>
                  <option value="rejected">Reject</option>
                  <option value="rescheduled">Reschedule</option>
                </select>
              </div>

              <div className="form-group">
                <label><FiMessageSquare className="form-icon" /> Notes:</label>
                <textarea
                  value={responseForm.notes}
                  onChange={(e) => setResponseForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes or instructions..."
                  className="form-textarea"
                  rows="3"
                />
              </div>

              {responseForm.response === 'rescheduled' && (
                <>
                  <div className="form-group">
                    <label><FiCalendar className="form-icon" /> Suggested Date:</label>
                    <input
                      type="date"
                      value={responseForm.suggestedDate}
                      onChange={(e) => setResponseForm(prev => ({ ...prev, suggestedDate: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label><FiClock className="form-icon" /> Suggested Time:</label>
                    <input
                      type="time"
                      value={responseForm.suggestedTime}
                      onChange={(e) => setResponseForm(prev => ({ ...prev, suggestedTime: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="response-modal__actions">
              <button 
                className="btn btn-outline" 
                onClick={() => setSelectedRequest(null)}
              >
                <FiX className="btn-icon" />
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => handleResponse(selectedRequest._id)}
              >
                <FiCheck className="btn-icon" />
                Submit Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentRequests;
