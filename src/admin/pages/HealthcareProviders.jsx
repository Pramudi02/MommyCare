import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Heart, 
  Search, 
  Filter, 
  Plus, 
  Eye,
  Edit,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Award,
  CheckCircle,
  Clock,
  Building,
  Activity,
  Star,
  Download,
  MoreVertical,
  ChevronRight,
  Users,
  UserCheck,
  AlertCircle,
  TrendingUp,
  BookOpen,
  Shield,
  Baby,
  Loader2,
  MoreHorizontal
} from 'lucide-react';
import './HealthcareProviders.css';

const HealthcareProviders = () => {
  const [activeView, setActiveView] = useState('doctors'); // 'doctors' or 'midwives'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch healthcare providers data from backend
  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('No admin token found');
      }

      // Fetch users with roles 'doctor' or 'midwife'
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/users?limit=100`,
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
        throw new Error('Failed to fetch providers data');
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        // Filter and transform user data to provider format
        const allUsers = data.data.users;
        
        const doctorMidwifeUsers = allUsers.filter(user => user.role === 'doctor' || user.role === 'midwife');
        
        const allProviders = doctorMidwifeUsers.map(user => ({
          id: user.id,
          name: user.name,
          type: user.role,
          specialization: user.specialization || (user.role === 'doctor' ? 'General Practitioner' : 'Community Midwife'),
          email: user.email,
          phone: user.phone || 'Not specified',
          clinic: user.clinic || 'Not specified',
          location: user.location || 'Not specified',
          patients: user.patients || 0,
          status: user.status === 'Active' ? 'verified' : 'pending',
          joinDate: user.joinDate || 'Not specified',
          rating: user.rating || '0.0',
          completedAppointments: user.completedAppointments || 0,
          verificationStatus: user.status === 'Active' ? 'approved' : 'pending',
          experience: user.experience || 'Not specified',
          qualifications: user.qualifications || (user.role === 'doctor' ? 'MBBS' : 'Diploma in Midwifery'),
          availability: user.availability || 'Not specified',
          lastActive: user.lastLogin || 'Never',
          avatar: user.avatar || user.name.split(' ').map(n => n[0]).join('').toUpperCase(),
          avatarColor: user.avatarColor || (user.role === 'doctor' ? 'blue' : 'green')
        }));

        setProviders(allProviders);
      } else {
        throw new Error(data.message || 'Failed to fetch providers data');
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchProviders();
  }, []);

  // Get current providers based on active view
  const currentProviders = providers.filter(provider => provider.type === activeView);

  // Apply search and filters
  const filteredProviders = currentProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.clinic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || provider.status === filterStatus;
    const matchesSpecialization = filterSpecialization === 'all' || provider.specialization === filterSpecialization;
    
    return matchesSearch && matchesStatus && matchesSpecialization;
  });

  // Get unique specializations for current view
  const specializations = [...new Set(currentProviders.map(p => p.specialization))];

  // Calculate stats for current view
  const currentStats = {
    total: currentProviders.length,
    verified: currentProviders.filter(p => p.status === 'verified').length,
    pending: currentProviders.filter(p => p.status === 'pending').length,
    totalPatients: currentProviders.reduce((sum, p) => sum + (parseInt(p.patients) || 0), 0),
    avgRating: currentProviders.length > 0 
      ? (currentProviders.reduce((sum, p) => sum + (parseFloat(p.rating) || 0), 0) / currentProviders.length).toFixed(1)
      : '0.0'
  };

  if (loading) {
    return (
      <main className="providers-dashboard-main">
        <div className="providers-loading-container">
          <Loader2 className="providers-loading-spinner" />
          <p>Loading healthcare providers data...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="providers-dashboard-main">
        <div className="providers-error-container">
          <AlertCircle className="providers-error-icon" />
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <button onClick={fetchProviders} className="providers-retry-btn">
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="providers-dashboard-main">
      {/* Stats Cards */}
      <div className="providers-stats-grid">
        <div className="providers-stat-card">
          <div className="providers-stat-icon-container blue">
            <Stethoscope className="providers-stat-icon" />
          </div>
          <div className="providers-stat-content">
            <p className="providers-stat-label">Total {activeView === 'doctors' ? 'Doctors' : 'Midwives'}</p>
            <p className="providers-stat-value">{currentStats.total}</p>
          </div>
        </div>
        <div className="providers-stat-card">
          <div className="providers-stat-icon-container green">
            <UserCheck className="providers-stat-icon" />
          </div>
          <div className="providers-stat-content">
            <p className="providers-stat-label">Verified</p>
            <p className="providers-stat-value">{currentStats.verified}</p>
          </div>
        </div>
        <div className="providers-stat-card">
          <div className="providers-stat-icon-container orange">
            <Users className="providers-stat-icon" />
          </div>
          <div className="providers-stat-content">
            <p className="providers-stat-label">Total Patients</p>
            <p className="providers-stat-value">{currentStats.totalPatients}</p>
          </div>
        </div>
        <div className="providers-stat-card">
          <div className="providers-stat-icon-container purple">
            <Star className="providers-stat-icon" />
          </div>
          <div className="providers-stat-content">
            <p className="providers-stat-label">Avg Rating</p>
            <p className="providers-stat-value">{currentStats.avgRating}</p>
          </div>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="providers-toggle-container">
        <div className="providers-toggle-buttons">
          <button
            className={`providers-toggle-btn ${activeView === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveView('doctors')}
          >
            <Stethoscope className="h-4 w-4" />
            Doctors
            <span className="providers-toggle-count">
              {providers.filter(p => p.type === 'doctor').length}
            </span>
          </button>
          <button
            className={`providers-toggle-btn ${activeView === 'midwives' ? 'active' : ''}`}
            onClick={() => setActiveView('midwives')}
          >
            <Heart className="h-4 w-4" />
            Midwives
            <span className="providers-toggle-count">
              {providers.filter(p => p.type === 'midwife').length}
            </span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="providers-filters-card">
        <div className="providers-filters-container">
          <div className="providers-search-container">
            <Search className="providers-search-icon" />
            <input
              type="text"
              placeholder={`Search ${activeView}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="providers-search-input"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="providers-status-select"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={filterSpecialization}
            onChange={(e) => setFilterSpecialization(e.target.value)}
            className="providers-specialization-select"
          >
            <option value="all">All Specializations</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>

          <button className="providers-filter-btn">
            <Filter className="h-4 w-4" />
            More Filters
          </button>
          <button className="providers-export-btn">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Providers Table */}
      <div className="providers-table-card">
        <div className="providers-table-container">
          <table className="providers-table">
            <thead className="providers-table-header">
              <tr className="providers-table-header-row">
                <th className="providers-checkbox-cell">
                  <input
                    type="checkbox"
                    className="providers-checkbox-input"
                    onChange={(e) => {
                      // Handle select all
                    }}
                  />
                </th>
                <th className="providers-table-header-cell">Provider Details</th>
                <th className="providers-table-header-cell">Contact Info</th>
                <th className="providers-table-header-cell">Specialization</th>
                <th className="providers-table-header-cell">Experience</th>
                <th className="providers-table-header-cell">Statistics</th>
                <th className="providers-table-header-cell">Status</th>
                <th className="providers-table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="providers-table-body">
              {filteredProviders.length > 0 ? (
                filteredProviders.map((provider) => (
                  <tr key={provider.id} className="providers-table-row">
                    <td className="providers-checkbox-cell">
                      <input
                        type="checkbox"
                        className="providers-checkbox-input"
                      />
                    </td>
                    <td className="providers-details-cell">
                      <div className="providers-info">
                        <div className={`providers-avatar ${provider.type}`}>
                          {provider.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div className="providers-details">
                          <div className="providers-name">{provider.name}</div>
                          <div className="providers-type">{provider.type.toUpperCase()}</div>
                          <div className="providers-location">
                            <MapPin className="h-3 w-3 mr-1" />
                            {provider.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="providers-contact-cell">
                      <div className="providers-contact-info">
                        <a href={`mailto:${provider.email}`} className="providers-contact-email">
                          {provider.email}
                        </a>
                        <div className="providers-contact-phone">{provider.phone}</div>
                      </div>
                    </td>
                    <td className="providers-specialization-cell">
                      <div className="providers-specialization">{provider.specialization}</div>
                      <div className="providers-qualifications">{provider.qualifications}</div>
                    </td>
                    <td className="providers-experience-cell">
                      <div className="providers-experience">{provider.experience}</div>
                      <div className="providers-availability">{provider.availability}</div>
                    </td>
                    <td className="providers-stats-cell">
                      <div className="providers-stats-mini">
                        <div className="providers-stat-mini-item">
                          <div className="providers-stat-mini-number">{provider.patients || 0}</div>
                          <div className="providers-stat-mini-label">Patients</div>
                        </div>
                        <div className="providers-stat-mini-item">
                          <div className="providers-stat-mini-number">{provider.completedAppointments || 0}</div>
                          <div className="providers-stat-mini-label">Appointments</div>
                        </div>
                        <div className="providers-stat-mini-item">
                          <div className="providers-stat-mini-number">{provider.rating || '0.0'}</div>
                          <div className="providers-stat-mini-label">Rating</div>
                        </div>
                      </div>
                    </td>
                    <td className="providers-status-cell">
                      <span className={`providers-status-badge ${provider.status}`}>
                        {provider.status === 'verified' ? 'Verified' : 'Pending Verification'}
                      </span>
                    </td>
                    <td className="providers-actions-cell">
                      <div className="providers-action-buttons">
                        <a
                          href={`/admin/users/${provider.id}`}
                          className="providers-action-btn view"
                          title="View Profile"
                        >
                          <Eye className="providers-action-icon" />
                        </a>
                        <a
                          href={`/admin/users/${provider.id}/edit`}
                          className="providers-action-btn edit"
                          title="Edit"
                        >
                          <Edit className="providers-action-icon" />
                        </a>
                        <button className="providers-action-btn more">
                          <MoreHorizontal className="providers-action-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="providers-empty-state">
                    <div className="providers-empty-content">
                      <Stethoscope className="providers-empty-icon" />
                      <h3 className="providers-empty-title">No {activeView} found</h3>
                      <p className="providers-empty-description">
                        Try adjusting your search or filter criteria to find {activeView}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="providers-pagination-container">
          <div className="providers-pagination-content">
            <div className="providers-pagination-info">
              <p className="providers-pagination-text">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredProviders.length}</span> of{' '}
                <span className="font-medium">{filteredProviders.length}</span> results
              </p>
            </div>
            <div className="providers-pagination-nav">
              <button className="providers-pagination-btn" disabled>Previous</button>
              <button className="providers-pagination-btn active">1</button>
              <button className="providers-pagination-btn" disabled>Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="providers-quick-actions-grid">
        <a href="/admin/users/add" className="providers-quick-action-card">
          <div className="providers-quick-action-content">
            <Plus className="providers-quick-action-icon blue" />
            <div className="providers-quick-action-text">
              <p className="providers-quick-action-title">Add New Provider</p>
              <p className="providers-quick-action-description">Register a new healthcare provider</p>
            </div>
          </div>
        </a>
        <a href="/admin/reports/providers" className="providers-quick-action-card">
          <div className="providers-quick-action-content">
            <TrendingUp className="providers-quick-action-icon green" />
            <div className="providers-quick-action-text">
              <p className="providers-quick-action-title">Generate Report</p>
              <p className="providers-quick-action-description">Create providers analytics report</p>
            </div>
          </div>
        </a>
        <a href="/admin/announcements/providers" className="providers-quick-action-card">
          <div className="providers-quick-action-content">
            <Mail className="providers-quick-action-icon purple" />
            <div className="providers-quick-action-text">
              <p className="providers-quick-action-title">Send Announcement</p>
              <p className="providers-quick-action-description">Broadcast to all providers</p>
            </div>
          </div>
        </a>
      </div>
    </main>
  );
};

export default HealthcareProviders; 