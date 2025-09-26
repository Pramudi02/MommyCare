import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Filter,
  Search,
  Calendar,
  User,
  Building,
  Store,
  Heart
} from 'lucide-react';
import './PermissionManagement.css';

const PermissionManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchPermissionRequests();
    fetchStats();
  }, []);

  const fetchPermissionRequests = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/permission-requests`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Permission requests data:', data);
        setRequests(data.data.requests || []);
      } else {
        console.error('Failed to fetch permission requests:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching permission requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/permission-requests/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Stats data:', data);
        setStats(data.data);
      } else {
        console.error('Failed to fetch stats:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/permission-requests/${requestId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes: 'Approved by admin' })
      });

      if (response.ok) {
        fetchPermissionRequests();
        fetchStats();
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/permission-requests/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes: 'Rejected by admin' })
      });

      if (response.ok) {
        fetchPermissionRequests();
        fetchStats();
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'doctor':
        return <Building size={20} />;
      case 'midwife':
        return <Heart size={20} />;
      case 'service_provider':
        return <Store size={20} />;
      default:
        return <User size={20} />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge pending">Pending</span>;
      case 'approved':
        return <span className="status-badge approved">Approved</span>;
      case 'rejected':
        return <span className="status-badge rejected">Rejected</span>;
      default:
        return <span className="status-badge">Unknown</span>;
    }
  };

  const filteredRequests = requests.filter(request => {
    console.log('Processing request:', request);
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = request.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    console.log('Filter matches:', matchesFilter, 'Search matches:', matchesSearch);
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="permission-management">
        <div className="loading">Loading permission requests...</div>
      </div>
    );
  }

  return (
    <div className="permission-management">
      <div className="permission-header">
        <h1>Permission Request Management</h1>
        <p>Review and manage user permission requests</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Requests</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon approved">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.approved}</h3>
            <p>Approved</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon rejected">
            <XCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.rejected}</h3>
            <p>Rejected</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="controls">
        <div className="filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Requests List */}
      <div className="requests-list">
        {filteredRequests.length === 0 ? (
          <div className="no-requests">
            <p>No permission requests found</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div key={request._id} className="request-card">
              <div className="request-header">
                <div className="user-info">
                  <div className="user-avatar">
                    {getRoleIcon(request.userRole)}
                  </div>
                  <div className="user-details">
                    <h4>{request.user?.firstName} {request.user?.lastName}</h4>
                    <p>{request.user?.email}</p>
                    <span className="role-badge">{request.userRole}</span>
                  </div>
                </div>
                <div className="request-actions">
                  {getStatusBadge(request.status)}
                  {request.status === 'pending' && (
                    <div className="action-buttons">
                      <button
                        className="btn-approve"
                        onClick={() => handleApprove(request._id)}
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleReject(request._id)}
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  )}
                  <button
                    className="btn-view"
                    onClick={() => setSelectedRequest(request)}
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              </div>
              <div className="request-meta">
                <span>
                  <Calendar size={16} />
                  Submitted: {new Date(request.submittedAt).toLocaleDateString()}
                </span>
                {request.reviewedAt && (
                  <span>
                    Reviewed: {new Date(request.reviewedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Request Details</h2>
              <button onClick={() => setSelectedRequest(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="user-details-section">
                <h3>User Information</h3>
                <p><strong>Name:</strong> {selectedRequest.user?.firstName} {selectedRequest.user?.lastName}</p>
                <p><strong>Email:</strong> {selectedRequest.user?.email}</p>
                <p><strong>Role:</strong> {selectedRequest.userRole}</p>
                <p><strong>Status:</strong> {selectedRequest.status}</p>
                <p><strong>Submitted:</strong> {new Date(selectedRequest.submittedAt).toLocaleString()}</p>
              </div>

              <div className="request-details-section">
                <h3>Request Information</h3>
                {selectedRequest.userRole === 'doctor' && (
                  <>
                    <p><strong>Hospital:</strong> {selectedRequest.hospitalName}</p>
                    <p><strong>Specialization:</strong> {selectedRequest.doctorSpecialization}</p>
                    <p><strong>License Number:</strong> {selectedRequest.licenseNumber}</p>
                    <p><strong>Experience:</strong> {selectedRequest.yearsOfExperience} years</p>
                  </>
                )}
                {selectedRequest.userRole === 'midwife' && (
                  <>
                    <p><strong>License Number:</strong> {selectedRequest.midwifeLicenseNumber}</p>
                    <p><strong>Experience:</strong> {selectedRequest.midwifeExperience}</p>
                    <p><strong>PHM Area:</strong> {selectedRequest.phmArea}</p>
                    <p><strong>MOH Area:</strong> {selectedRequest.mohArea}</p>
                  </>
                )}
                {selectedRequest.userRole === 'service_provider' && (
                  <>
                    <p><strong>Business Name:</strong> {selectedRequest.businessName}</p>
                    <p><strong>Business Type:</strong> {selectedRequest.businessType}</p>
                    <p><strong>License:</strong> {selectedRequest.businessLicense}</p>
                    <p><strong>Services:</strong> {selectedRequest.serviceCategories?.join(', ')}</p>
                  </>
                )}
              </div>

              {selectedRequest.adminNotes && (
                <div className="admin-notes-section">
                  <h3>Admin Notes</h3>
                  <p>{selectedRequest.adminNotes}</p>
                </div>
              )}

              {selectedRequest.status === 'pending' && (
                <div className="modal-actions">
                  <button
                    className="btn-approve"
                    onClick={() => handleApprove(selectedRequest._id)}
                  >
                    <CheckCircle size={16} />
                    Approve Request
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleReject(selectedRequest._id)}
                  >
                    <XCircle size={16} />
                    Reject Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionManagement;
