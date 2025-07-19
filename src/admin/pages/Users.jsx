import React, { useState } from 'react';
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
  Download
} from 'lucide-react';
import './Users.css';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Sample user data
  const users = [
    {
      id: 1,
      name: 'Priya Perera',
      email: 'priya.perera@email.com',
      role: 'Mother',
      status: 'Active',
      lastLogin: '2024-06-10',
      location: 'Colombo',
      phone: '+94 77 123 4567',
      joinDate: '2024-01-15',
      avatar: 'PP',
      avatarColor: 'pink'
    },
    {
      id: 2,
      name: 'Dr. Anura Silva',
      email: 'anura.silva@moh.lk',
      role: 'Doctor',
      status: 'Active',
      lastLogin: '2024-06-11',
      location: 'Kandy',
      phone: '+94 71 234 5678',
      joinDate: '2024-02-20',
      avatar: 'AS',
      avatarColor: 'blue'
    },
    {
      id: 3,
      name: 'Midwife Kumari Perera',
      email: 'kumari.perera@moh.lk',
      role: 'Midwife',
      status: 'Active',
      lastLogin: '2024-06-09',
      location: 'Gampaha',
      phone: '+94 75 345 6789',
      joinDate: '2024-03-10',
      avatar: 'KP',
      avatarColor: 'green'
    },
    {
      id: 4,
      name: 'Nimali Fernando',
      email: 'nimali.fernando@email.com',
      role: 'Mother',
      status: 'Inactive',
      lastLogin: '2024-05-28',
      location: 'Jaffna',
      phone: '+94 76 456 7890',
      joinDate: '2024-01-08',
      avatar: 'NF',
      avatarColor: 'orange'
    },
    {
      id: 5,
      name: 'Dr. Chaminda Perera',
      email: 'chaminda.perera@moh.lk',
      role: 'Doctor',
      status: 'Active',
      lastLogin: '2024-06-11',
      location: 'Matara',
      phone: '+94 77 567 8901',
      joinDate: '2024-02-15',
      avatar: 'CP',
      avatarColor: 'purple'
    }
  ];

  const getRoleIcon = (role) => {
    switch (role.toLowerCase()) {
      case 'mother':
        return Heart;
      case 'doctor':
        return Stethoscope;
      case 'midwife':
        return Baby;
      default:
        return Users;
    }
  };

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'mother':
        return 'pink';
      case 'doctor':
        return 'blue';
      case 'midwife':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'green' : 'red';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || user.status.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'Active').length,
    inactive: users.filter(u => u.status === 'Inactive').length,
    mothers: users.filter(u => u.role === 'Mother').length,
    doctors: users.filter(u => u.role === 'Doctor').length,
    midwives: users.filter(u => u.role === 'Midwife').length
  };

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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
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
            {filteredUsers.length > 0 && (
              <button className="bulk-action-btn">
                Bulk Actions ({filteredUsers.length})
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
        {filteredUsers.map(user => (
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
              <div className="user-joined">
                Member since {user.joinDate}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
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