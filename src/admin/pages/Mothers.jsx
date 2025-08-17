import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye, 
  Edit, 
  MoreVertical, 
  User, 
  MapPin, 
  BarChart3, 
  MessageSquare,
  Loader2,
  AlertCircle as AlertCircleIcon
} from 'lucide-react';
import './Mothers.css';

const Mothers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMothers, setSelectedMothers] = useState([]);
  const [mothers, setMothers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    highRisk: 0,
    dueThisMonth: 0
  });

  // Fetch mothers data from backend
  const fetchMothers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('No admin token found');
      }

      console.log('Fetching mothers data...');
      
      // Fetch users with role 'mom'
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users?role=mom&limit=100`,
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          window.location.href = '/admin/login';
          return;
        }
        throw new Error('Failed to fetch mothers data');
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.status === 'success') {
        // Transform user data to mother format
        const transformedMothers = data.data.users.map(user => ({
          id: user.id,
          name: user.name,
          age: user.age || 'N/A',
          location: user.location || 'Not specified',
          pregnancyStatus: 'Active', // Default for mothers
          weeksPregnant: user.weeksPregnant || 'N/A',
          dueDate: user.dueDate || 'Not specified',
          riskLevel: user.riskLevel || 'Low',
          assignedProvider: user.assignedProvider || 'Not assigned',
          lastVisit: user.lastVisit || 'Never',
          status: user.status,
          email: user.email,
          phone: user.phone || 'Not specified',
          joinDate: user.joinDate
        }));

        console.log('Transformed mothers:', transformedMothers);
        setMothers(transformedMothers);
        
        // Calculate stats
        const total = data.data.stats.mothers || transformedMothers.length;
        const active = transformedMothers.filter(m => m.status === 'Active').length;
        const inactive = transformedMothers.filter(m => m.status === 'Inactive').length;
        const highRisk = transformedMothers.filter(m => m.riskLevel === 'High').length;
        const dueThisMonth = transformedMothers.filter(m => {
          if (!m.dueDate || m.dueDate === 'Not specified') return false;
          const dueDate = new Date(m.dueDate);
          const now = new Date();
          return dueDate.getMonth() === now.getMonth() && dueDate.getFullYear() === now.getFullYear();
        }).length;

        console.log('Calculated stats:', { total, active, inactive, highRisk, dueThisMonth });
        setStats({ total, active, inactive, highRisk, dueThisMonth });
      } else {
        throw new Error(data.message || 'Failed to fetch mothers data');
      }
    } catch (error) {
      console.error('Error fetching mothers:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchMothers();
  }, []);

  const filteredMothers = mothers.filter(mother => {
    const matchesSearch = mother.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mother.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mother.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || mother.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectMother = (motherId) => {
    if (selectedMothers.includes(motherId)) {
      setSelectedMothers(selectedMothers.filter(id => id !== motherId));
    } else {
      setSelectedMothers([...selectedMothers, motherId]);
    }
  };

  const getRiskBadge = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <main className="mothers-dashboard-main">
        <div className="mothers-loading-container">
          <Loader2 className="mothers-loading-spinner" />
          <p>Loading mothers data...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mothers-dashboard-main">
        <div className="mothers-error-container">
          <AlertCircleIcon className="mothers-error-icon" />
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <button onClick={fetchMothers} className="mothers-retry-btn">
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mothers-dashboard-main">
      {/* Stats Cards */}
      <div className="mothers-stats-grid">
        <div className="mothers-stat-card">
          <div className="mothers-stat-icon-container pink">
            <Heart className="mothers-stat-icon" />
          </div>
          <div className="mothers-stat-content">
            <p className="mothers-stat-label">Total Mothers</p>
            <p className="mothers-stat-value">{stats.total}</p>
          </div>
        </div>
        <div className="mothers-stat-card">
          <div className="mothers-stat-icon-container green">
            <CheckCircle2 className="mothers-stat-icon" />
          </div>
          <div className="mothers-stat-content">
            <p className="mothers-stat-label">Active Mothers</p>
            <p className="mothers-stat-value">{stats.active}</p>
          </div>
        </div>
        <div className="mothers-stat-card">
          <div className="mothers-stat-icon-container red">
            <AlertCircle className="mothers-stat-icon" />
          </div>
          <div className="mothers-stat-content">
            <p className="mothers-stat-label">High Risk</p>
            <p className="mothers-stat-value">{stats.highRisk}</p>
          </div>
        </div>
        <div className="mothers-stat-card">
          <div className="mothers-stat-icon-container blue">
            <Calendar className="mothers-stat-icon" />
          </div>
          <div className="mothers-stat-content">
            <p className="mothers-stat-label">Due This Month</p>
            <p className="mothers-stat-value">{stats.dueThisMonth}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mothers-filters-card">
        <div className="mothers-filters-container">
          <div className="mothers-search-filters">
            <div className="mothers-search-container">
              <Search className="mothers-search-icon" />
              <input
                type="text"
                placeholder="Search mothers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mothers-search-input"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mothers-status-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="mothers-filter-btn">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
            <button className="mothers-export-btn">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
          <div className="action-buttons">
            {selectedMothers.length > 0 && (
              <button className="mothers-bulk-action-btn">
                Bulk Actions ({selectedMothers.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mothers Table */}
      <div className="mothers-table-card">
        <div className="mothers-table-container">
          <table className="mothers-table">
            <thead className="mothers-table-header">
              <tr className="mothers-table-header-row">
                <th className="mothers-checkbox-cell">
                  <input
                    type="checkbox"
                    className="mothers-checkbox-input"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMothers(filteredMothers.map(m => m.id));
                      } else {
                        setSelectedMothers([]);
                      }
                    }}
                  />
                </th>
                <th className="mothers-table-header-cell">Mother Details</th>
                <th className="mothers-table-header-cell">Contact Info</th>
                <th className="mothers-table-header-cell">Risk Level</th>
                <th className="mothers-table-header-cell">Assigned Provider</th>
                <th className="mothers-table-header-cell">Last Visit</th>
                <th className="mothers-table-header-cell">Status</th>
                <th className="mothers-table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="mothers-table-body">
              {filteredMothers.length > 0 ? (
                filteredMothers.map((mother) => (
                <tr key={mother.id} className="mothers-table-row">
                  <td className="mothers-checkbox-cell">
                    <input
                      type="checkbox"
                      className="mothers-checkbox-input"
                      checked={selectedMothers.includes(mother.id)}
                      onChange={() => handleSelectMother(mother.id)}
                    />
                  </td>
                  <td className="mothers-details-cell">
                    <div className="mothers-info">
                      <div className="mothers-avatar">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="mothers-details">
                        <div className="mothers-name">{mother.name}</div>
                        <div className="mothers-age">Age: {mother.age}</div>
                        <div className="mothers-location">
                          <MapPin className="h-3 w-3 mr-1" />
                          {mother.location}
                        </div>
                      </div>
                    </div>
                  </td>
                    <td className="mothers-contact-cell">
                      <div className="mothers-contact-info">
                        <div className="mothers-contact-email">{mother.email}</div>
                        <div className="mothers-contact-phone">{mother.phone}</div>
                    </div>
                  </td>
                  <td className="mothers-risk-level-cell">
                    <span className={`mothers-risk-badge ${getRiskBadge(mother.riskLevel)}`}>
                      {mother.riskLevel} Risk
                    </span>
                  </td>
                  <td className="mothers-provider-cell">
                    {mother.assignedProvider}
                  </td>
                  <td className="mothers-last-visit-cell">
                    {mother.lastVisit}
                  </td>
                  <td className="mothers-status-cell">
                    <span className={`mothers-status-badge ${getStatusBadge(mother.status)}`}>
                      {mother.status}
                    </span>
                  </td>
                  <td className="mothers-actions-cell">
                    <div className="mothers-action-buttons">
                      <a
                          href={`/admin/users/${mother.id}`}
                        className="mothers-action-btn view"
                        title="View Profile"
                      >
                        <Eye className="mothers-action-icon" />
                      </a>
                      <a
                          href={`/admin/users/${mother.id}/edit`}
                        className="mothers-action-btn edit"
                        title="Edit"
                      >
                        <Edit className="mothers-action-icon" />
                      </a>
                      <button className="mothers-action-btn more">
                        <MoreVertical className="mothers-action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="mothers-empty-state">
                    <div className="mothers-empty-content">
                      <Heart className="mothers-empty-icon" />
                      <h3 className="mothers-empty-title">No mothers found</h3>
                      <p className="mothers-empty-description">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mothers-pagination-container">
          <div className="mothers-pagination-content">
            <div className="mothers-pagination-info">
              <p className="mothers-pagination-text">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredMothers.length}</span> of{' '}
                <span className="font-medium">{filteredMothers.length}</span> results
              </p>
            </div>
            <div className="mothers-pagination-nav">
              <button className="mothers-pagination-btn" disabled>Previous</button>
              <button className="mothers-pagination-btn active">1</button>
              <button className="mothers-pagination-btn" disabled>Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mothers-quick-actions-grid">
        <a href="/admin/users/add" className="mothers-quick-action-card">
          <div className="mothers-quick-action-content">
            <Plus className="mothers-quick-action-icon blue" />
            <div className="mothers-quick-action-text">
              <p className="mothers-quick-action-title">Add New Mother</p>
              <p className="mothers-quick-action-description">Register a new mother in the system</p>
            </div>
          </div>
        </a>
        <a href="/admin/reports/mothers" className="mothers-quick-action-card">
          <div className="mothers-quick-action-content">
            <BarChart3 className="mothers-quick-action-icon green" />
            <div className="mothers-quick-action-text">
              <p className="mothers-quick-action-title">Generate Report</p>
              <p className="mothers-quick-action-description">Create mothers analytics report</p>
            </div>
          </div>
        </a>
        <a href="/admin/announcements/mothers" className="mothers-quick-action-card">
          <div className="mothers-quick-action-content">
            <MessageSquare className="mothers-quick-action-icon purple" />
            <div className="mothers-quick-action-text">
              <p className="mothers-quick-action-title">Send Announcement</p>
              <p className="mothers-quick-action-description">Broadcast to all mothers</p>
            </div>
          </div>
        </a>
      </div>
    </main>
  );
};

export default Mothers;
