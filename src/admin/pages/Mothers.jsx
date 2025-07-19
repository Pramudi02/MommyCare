import React, { useState } from 'react';
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
  MessageSquare 
} from 'lucide-react';
import './Mothers.css';

const Mothers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMothers, setSelectedMothers] = useState([]);

  // Sample mothers data
  const mothers = [
    {
      id: 1,
      name: 'Priya Perera',
      age: 28,
      location: 'Colombo',
      pregnancyStatus: 'Active',
      weeksPregnant: 24,
      dueDate: '2024-06-15',
      riskLevel: 'Low',
      assignedProvider: 'Dr. Silva Fernando',
      lastVisit: '2024-01-20',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Anjali Patel',
      age: 32,
      location: 'Kandy',
      pregnancyStatus: 'Active',
      weeksPregnant: 18,
      dueDate: '2024-07-10',
      riskLevel: 'Medium',
      assignedProvider: 'Dr. Rajesh Kumar',
      lastVisit: '2024-01-18',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Samantha Johnson',
      age: 25,
      location: 'Galle',
      pregnancyStatus: 'Active',
      weeksPregnant: 32,
      dueDate: '2024-04-05',
      riskLevel: 'High',
      assignedProvider: 'Nurse Kamala Dias',
      lastVisit: '2024-01-15',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Nimali Fernando',
      age: 29,
      location: 'Jaffna',
      pregnancyStatus: 'Active',
      weeksPregnant: 12,
      dueDate: '2024-08-20',
      riskLevel: 'Low',
      assignedProvider: 'Dr. Silva Fernando',
      lastVisit: '2024-01-22',
      status: 'Active'
    },
    {
      id: 5,
      name: 'Kamala Dias',
      age: 35,
      location: 'Matara',
      pregnancyStatus: 'Active',
      weeksPregnant: 28,
      dueDate: '2024-05-12',
      riskLevel: 'Medium',
      assignedProvider: 'Dr. Rajesh Kumar',
      lastVisit: '2024-01-19',
      status: 'Active'
    }
  ];

  const filteredMothers = mothers.filter(mother => {
    const matchesSearch = mother.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mother.location.toLowerCase().includes(searchTerm.toLowerCase());
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

  return (
    <main className="dashboard-main">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-container pink">
            <Heart className="stat-icon" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Mothers</p>
            <p className="stat-value">456</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-container green">
            <CheckCircle2 className="stat-icon" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Pregnancies</p>
            <p className="stat-value">289</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-container red">
            <AlertCircle className="stat-icon" />
          </div>
          <div className="stat-content">
            <p className="stat-label">High Risk</p>
            <p className="stat-value">23</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-container blue">
            <Calendar className="stat-icon" />
          </div>
          <div className="stat-content">
            <p className="stat-label">Due This Month</p>
            <p className="stat-value">34</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-card">
        <div className="filters-container">
          <div className="search-filters">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search mothers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <button className="filter-btn">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
            <button className="export-btn">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
          <div className="action-buttons">
            {selectedMothers.length > 0 && (
              <button className="bulk-action-btn">
                Bulk Actions ({selectedMothers.length})
              </button>
            )}
            
          </div>
        </div>
      </div>

      {/* Mothers Table */}
      <div className="table-card">
        <div className="table-container">
          <table className="mothers-table">
            <thead className="table-header">
              <tr>
                <th className="checkbox-cell">
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMothers(filteredMothers.map(m => m.id));
                      } else {
                        setSelectedMothers([]);
                      }
                    }}
                  />
                </th>
                <th className="table-header-cell">Mother Details</th>
                <th className="table-header-cell">Pregnancy Status</th>
                <th className="table-header-cell">Risk Level</th>
                <th className="table-header-cell">Assigned Provider</th>
                <th className="table-header-cell">Last Visit</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredMothers.map((mother) => (
                <tr key={mother.id} className="table-row">
                  <td className="checkbox-cell">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      checked={selectedMothers.includes(mother.id)}
                      onChange={() => handleSelectMother(mother.id)}
                    />
                  </td>
                  <td className="mother-details-cell">
                    <div className="mother-info">
                      <div className="mother-avatar">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="mother-details">
                        <div className="mother-name">{mother.name}</div>
                        <div className="mother-age">Age: {mother.age}</div>
                        <div className="mother-location">
                          <MapPin className="h-3 w-3 mr-1" />
                          {mother.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="pregnancy-status-cell">
                    <div className="pregnancy-info">
                      <div className="pregnancy-status">{mother.pregnancyStatus}</div>
                      <div className="pregnancy-weeks">{mother.weeksPregnant} weeks</div>
                      <div className="pregnancy-due">Due: {mother.dueDate}</div>
                    </div>
                  </td>
                  <td className="risk-level-cell">
                    <span className={`risk-badge ${getRiskBadge(mother.riskLevel)}`}>
                      {mother.riskLevel} Risk
                    </span>
                  </td>
                  <td className="provider-cell">
                    {mother.assignedProvider}
                  </td>
                  <td className="last-visit-cell">
                    {mother.lastVisit}
                  </td>
                  <td className="status-cell">
                    <span className={`status-badge ${getStatusBadge(mother.status)}`}>
                      {mother.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <a
                        href={`/admin/users/mothers/${mother.id}`}
                        className="action-btn view"
                        title="View Profile"
                      >
                        <Eye className="action-icon" />
                      </a>
                      <a
                        href={`/admin/users/mothers/${mother.id}/edit`}
                        className="action-btn edit"
                        title="Edit"
                      >
                        <Edit className="action-icon" />
                      </a>
                      <button className="action-btn more">
                        <MoreVertical className="action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          <div className="pagination-content">
            <div className="pagination-info">
              <p className="pagination-text">
                Showing <span className="font-medium">1</span> to <span className="font-medium">2</span> of{' '}
                <span className="font-medium">{filteredMothers.length}</span> results
              </p>
            </div>
            <div className="pagination-nav">
              <button className="pagination-btn">Previous</button>
              <button className="pagination-btn active">1</button>
              <button className="pagination-btn">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="quick-actions-grid">
        <a href="/admin/users/mothers/add" className="quick-action-card">
          <div className="quick-action-content">
            <Plus className="quick-action-icon blue" />
            <div className="quick-action-text">
              <p className="quick-action-title">Add New Mother</p>
              <p className="quick-action-description">Register a new mother in the system</p>
            </div>
          </div>
        </a>
        <a href="/admin/reports/mothers" className="quick-action-card">
          <div className="quick-action-content">
            <BarChart3 className="quick-action-icon green" />
            <div className="quick-action-text">
              <p className="quick-action-title">Generate Report</p>
              <p className="quick-action-description">Create mothers analytics report</p>
            </div>
          </div>
        </a>
        <a href="/admin/announcements/mothers" className="quick-action-card">
          <div className="quick-action-content">
            <MessageSquare className="quick-action-icon purple" />
            <div className="quick-action-text">
              <p className="quick-action-title">Send Announcement</p>
              <p className="quick-action-description">Broadcast to all mothers</p>
            </div>
          </div>
        </a>
      </div>
    </main>
  );
};

export default Mothers; 