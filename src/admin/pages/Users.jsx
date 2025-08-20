import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  UserCheck,
  UserX,
  Shield,
  Heart,
  Stethoscope,
  Baby,
  ChevronDown,
  Download,
  Loader2,
  AlertCircle
} from 'lucide-react';
import './Users.css';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    mothers: 0,
    doctors: 0,
    midwives: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Fetch users from API
  const fetchUsers = async (page = 1, search = '', filter = 'all') => {
    try {
      setLoading(true);
      setError('');
      
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('No admin token found');
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      if (search) params.append('search', search);
      if (filter !== 'all') params.append('status', filter);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid, redirect to login
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          window.location.href = '/admin/login';
          return;
        }
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        setUsers(data.data.users);
        setStats(data.data.stats);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update user status
  const updateUserStatus = async (userId, isActive) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('No admin token found');
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users/${userId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ isActive })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, status: isActive ? 'Active' : 'Inactive' }
            : user
        )
      );

      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        active: prevStats.active + (isActive ? 1 : -1),
        inactive: prevStats.inactive + (isActive ? -1 : 1)
      }));

    } catch (error) {
      console.error('Error updating user status:', error);
      setError(error.message);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('No admin token found');
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Remove user from local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      // Update stats
      setStats(prevStats => ({
        ...prevStats,
        total: prevStats.total - 1,
        active: prevStats.active - (users.find(u => u.id === userId)?.status === 'Active' ? 1 : 0),
        inactive: prevStats.inactive - (users.find(u => u.id === userId)?.status === 'Inactive' ? 1 : 0)
      }));

    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.message);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    
    // Debounce search
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchUsers(1, value, selectedFilter);
    }, 500);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilter(value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchUsers(1, searchTerm, value);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    fetchUsers(page, searchTerm, selectedFilter);
  };

  // Search timeout ref
  const searchTimeout = React.useRef(null);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  const getRoleIcon = (role) => {
    switch (role.toLowerCase()) {
      case 'mom':
        return Heart;
      case 'doctor':
        return Stethoscope;
      case 'midwife':
        return Baby;
      case 'service_provider':
        return Shield;
      default:
        return Users;
    }
  };

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'mom':
        return 'pink';
      case 'doctor':
        return 'blue';
      case 'midwife':
        return 'green';
      case 'service_provider':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'green' : 'red';
  };

  if (loading && users.length === 0) {
    return (
      <main className="dashboard-main">
        <div className="loading-container">
          <Loader2 className="loading-spinner" />
          <p>Loading users...</p>
        </div>
      </main>
    );
  }

  if (error && users.length === 0) {
    return (
      <main className="dashboard-main">
        <div className="error-container">
          <AlertCircle className="error-icon" />
          <h3>Error loading users</h3>
          <p>{error}</p>
          <button onClick={() => fetchUsers()} className="retry-btn">
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-main">
      {/* Header */}
      <div className="users-header">
        <div className="users-header-content">
          <div className="users-header-left">
            <h1 className="users-header-title">User Management</h1>
            <p className="users-header-description">Manage all users in the system</p>
          </div>
          <div className="users-header-actions">
            <button className="add-user-btn">
              <Plus className="add-user-icon" />
              Add User
            </button>
            <button className="export-users-btn">
              <Download className="export-users-icon" />
              Export Users
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Total Users</p>
              <p className="stat-value">{stats.total}</p>
            </div>
            <Users className="stat-icon blue" />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Active Users</p>
              <p className="stat-value">{stats.active}</p>
            </div>
            <UserCheck className="stat-icon green" />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Inactive Users</p>
              <p className="stat-value">{stats.inactive}</p>
            </div>
            <UserX className="stat-icon orange" />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Mothers</p>
              <p className="stat-value">{stats.mothers}</p>
            </div>
            <Heart className="stat-icon pink" />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Doctors</p>
              <p className="stat-value">{stats.doctors}</p>
            </div>
            <Stethoscope className="stat-icon blue" />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Midwives</p>
              <p className="stat-value">{stats.midwives}</p>
            </div>
            <Baby className="stat-icon green" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="filters-container">
          <div className="search-filters">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={handleFilterChange}
              className="status-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="filter-btn">
              <Filter className="filter-icon" />
              More Filters
            </button>
          </div>
          <div className="action-buttons">
            {users.length > 0 && (
              <button className="bulk-action-btn">
                Bulk Actions ({users.length})
              </button>
            )}
            <button className="export-btn">
              <Download className="export-icon" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-header">
              <div className="user-info">
                <div className={`user-avatar ${user.avatarColor}`}>
                  {user.avatar}
                </div>
                <div className="user-details">
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                  <div className="user-role">{user.role}</div>
                </div>
              </div>
              <div className="user-actions">
                <button className="action-btn view" title="View Profile">
                  <Eye className="action-icon" />
                </button>
                <button className="action-btn edit" title="Edit User">
                  <Edit className="action-icon" />
                </button>
                <button className="action-btn delete" title="Delete User">
                  <Trash2 className="action-icon" />
                </button>
              </div>
            </div>
            
            <div className="user-contact">
              <div className="contact-item">
                <Phone className="contact-icon" />
                {user.phone}
              </div>
              <div className="contact-item">
                <MapPin className="contact-icon" />
                {user.location}
              </div>
              <div className="contact-item">
                <Calendar className="contact-icon" />
                Joined: {user.joinDate}
              </div>
            </div>
            
            <div className="user-stats">
              <div className="stat-item">
                <div className="stat-value">{user.role}</div>
                <div className="stat-label">Role</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{user.status}</div>
                <div className="stat-label">Status</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{user.lastLogin}</div>
                <div className="stat-label">Last Login</div>
              </div>
            </div>
            
            <div className="user-footer">
              <div className="user-status">
                <div className={`status-dot ${user.status.toLowerCase()}`}></div>
                <span className="status-text">{user.status}</span>
              </div>
              <div className="user-actions-footer">
                <button
                  className={`status-toggle-btn ${user.status === 'Active' ? 'deactivate' : 'activate'}`}
                  onClick={() => updateUserStatus(user.id, user.status !== 'Active')}
                >
                  {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={!pagination.hasPrevPage}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
          >
            Previous
          </button>
          
          <div className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          
          <button
            className="pagination-btn"
            disabled={!pagination.hasNextPage}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

      {users.length === 0 && !loading && (
        <div className="empty-state">
          <Users className="empty-icon" />
          <h3 className="empty-title">No users found</h3>
          <p className="empty-description">Try adjusting your search or filter criteria</p>
          <button className="empty-action-btn">Add First User</button>
        </div>
      )}
    </main>
  );
};

export default UsersPage; 