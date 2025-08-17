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

      console.log('Fetching healthcare providers data...');

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
      console.log('API Response:', data);
      
      if (data.status === 'success') {
        // Filter and transform user data to provider format
        const allProviders = data.data.users
          .filter(user => user.role === 'doctor' || user.role === 'midwife')
          .map(user => ({
            id: user.id,
            name: user.name,
            type: user.role,
            specialization: user.specialization || (user.role === 'doctor' ? 'General Practitioner' : 'Community Midwife'),
            email: user.email,
            phone: user.phone || 'Not specified',
            clinic: user.clinic || 'Not specified',
            location: user.location || 'Not specified',
            patients: user.patients || Math.floor(Math.random() * 50) + 10, // Random for demo
            status: user.isActive ? 'verified' : 'pending',
            joinDate: user.joinDate,
            rating: user.rating || (Math.random() * 1 + 4).toFixed(1), // Random for demo
            completedAppointments: user.completedAppointments || Math.floor(Math.random() * 200) + 50, // Random for demo
            verificationStatus: user.isActive ? 'approved' : 'pending',
            experience: user.experience || `${Math.floor(Math.random() * 15) + 2} years`, // Random for demo
            qualifications: user.qualifications || (user.role === 'doctor' ? 'MBBS' : 'Diploma in Midwifery'),
            availability: user.availability || 'Monday-Friday',
            lastActive: user.lastLogin || 'Never'
          }));

        console.log('Transformed providers:', allProviders);
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

  // Filter providers based on active view
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

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      verified: { color: 'status-verified', text: 'Verified', icon: CheckCircle },
      pending: { color: 'status-pending', text: 'Pending', icon: Clock },
      rejected: { color: 'status-rejected', text: 'Rejected', icon: AlertCircle }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`status-badge ${config.color}`}>
        <Icon className="status-icon" />
        {config.text}
      </span>
    );
  };

  const ProviderCard = ({ provider }) => (
    <div className="provider-card">
      <div className="provider-header">
        <div className="provider-info">
          <div className={`provider-avatar ${provider.type === 'doctor' ? 'doctor' : 'midwife'}`}>
            {provider.type === 'doctor' ? 
              <Stethoscope className="provider-avatar-icon" /> : 
              <Heart className="provider-avatar-icon" />
            }
          </div>
          <div className="provider-details">
            <h3 className="provider-name">{provider.name}</h3>
            <p className="provider-specialization">{provider.specialization}</p>
            <p className="provider-experience">{provider.experience} experience</p>
          </div>
        </div>
        <div className="provider-actions">
          <StatusBadge status={provider.status} />
          <button className="more-btn">
            <MoreVertical className="more-icon" />
          </button>
        </div>
      </div>
      
      <div className="provider-contact">
        <div className="contact-item">
          <Mail className="contact-icon" />
          {provider.email}
        </div>
        <div className="contact-item">
          <Phone className="contact-icon" />
          {provider.phone}
        </div>
        <div className="contact-item">
          <Building className="contact-icon" />
          {provider.clinic}
        </div>
        <div className="contact-item">
          <MapPin className="contact-icon" />
          {provider.location}
        </div>
        <div className="contact-item">
          <Award className="contact-icon" />
          {provider.qualifications}
        </div>
        <div className="contact-item">
          <Calendar className="contact-icon" />
          {provider.availability}
        </div>
      </div>
      
      <div className="provider-stats">
        <div className="stat-item">
          <p className="stat-value">{provider.patients}</p>
          <p className="stat-label">Patients</p>
        </div>
        <div className="stat-item">
          <div className="rating-container">
            <Star className="rating-star" />
            <p className="stat-value">{provider.rating}</p>
          </div>
          <p className="stat-label">Rating</p>
        </div>
        <div className="stat-item">
          <p className="stat-value">{provider.completedAppointments}</p>
          <p className="stat-label">Completed</p>
        </div>
      </div>
      
      <div className="provider-actions-bottom">
        <a
          href={`/admin/users/${provider.id}`}
          className="action-btn view"
        >
          <Eye className="action-icon" />
          View Profile
        </a>
        <a
          href={`/admin/users/${provider.id}/edit`}
          className="action-btn edit"
        >
          <Edit className="action-icon" />
          Edit
        </a>
      </div>
      
      <div className="provider-footer">
        <div className="footer-info">
          <span className="footer-text">Last active: {provider.lastActive}</span>
          <span className="footer-text">Joined: {provider.joinDate}</span>
        </div>
      </div>
    </div>
  );

  const currentStats = {
    total: currentProviders.length,
    verified: currentProviders.filter(p => p.status === 'verified').length,
    pending: currentProviders.filter(p => p.status === 'pending').length,
    totalPatients: currentProviders.reduce((sum, p) => sum + p.patients, 0),
    avgRating: currentProviders.length > 0 ? 
      (currentProviders.reduce((sum, p) => sum + parseFloat(p.rating), 0) / currentProviders.length).toFixed(1) : '0.0'
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

  const currentProviders = providers.filter(provider => provider.type === activeView);
  const currentStats = {
    total: currentProviders.length,
    verified: currentProviders.filter(p => p.status === 'verified').length,
    pending: currentProviders.filter(p => p.status === 'pending').length,
    totalPatients: currentProviders.reduce((sum, p) => sum + p.patients, 0),
    avgRating: currentProviders.length > 0 
      ? (currentProviders.reduce((sum, p) => sum + parseFloat(p.rating), 0) / currentProviders.length).toFixed(1)
      : '0.0'
  };

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
            <option value="General Practitioner">General Practitioner</option>
            <option value="Community Midwife">Community Midwife</option>
            <option value="Obstetrician">Obstetrician</option>
            <option value="Gynecologist">Gynecologist</option>
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

      {/* Providers Grid */}
      <div className="providers-grid">
        {currentProviders.length > 0 ? (
          currentProviders.map((provider) => (
            <div key={provider.id} className="providers-card">
              <div className="providers-card-header">
                <div className={`providers-avatar ${provider.type}`}>
                  {provider.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="providers-info">
                  <div className="providers-name">{provider.name}</div>
                  <div className="providers-type">{provider.type.toUpperCase()}</div>
                  <div className="providers-specialization">{provider.specialization}</div>
                </div>
              </div>

              <div className="providers-card-content">
                <div className="providers-detail-group">
                  <div className="providers-detail-label">Contact</div>
                  <div className="providers-contact-info">
                    <a href={`mailto:${provider.email}`} className="providers-contact-email">
                      {provider.email}
                    </a>
                    <div className="providers-contact-phone">{provider.phone}</div>
                  </div>
                </div>

                <div className="providers-detail-group">
                  <div className="providers-detail-label">Location</div>
                  <div className="providers-detail-value">{provider.location}</div>
                </div>

                <div className="providers-detail-group">
                  <div className="providers-detail-label">Experience</div>
                  <div className="providers-detail-value">{provider.experience}</div>
                </div>

                <div className="providers-detail-group">
                  <div className="providers-detail-label">Qualifications</div>
                  <div className="providers-detail-value">{provider.qualifications}</div>
                </div>
              </div>

              <div className="providers-stats">
                <div className="providers-stat-item">
                  <div className="providers-stat-number">{provider.patients}</div>
                  <div className="providers-stat-label">Patients</div>
                </div>
                <div className="providers-stat-item">
                  <div className="providers-stat-number">{provider.completedAppointments}</div>
                  <div className="providers-stat-label">Appointments</div>
                </div>
                <div className="providers-stat-item">
                  <div className="providers-stat-number">{provider.rating}</div>
                  <div className="providers-stat-label">Rating</div>
                </div>
              </div>

              <div className={`providers-status-badge ${provider.status}`}>
                {provider.status === 'verified' ? 'Verified' : 'Pending Verification'}
              </div>

              <div className="providers-card-actions">
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
            </div>
          ))
        ) : (
          <div className="providers-empty-state">
            <div className="providers-empty-content">
              <Stethoscope className="providers-empty-icon" />
              <h3 className="providers-empty-title">No {activeView} found</h3>
              <p className="providers-empty-description">
                Try adjusting your search or filter criteria to find {activeView}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default HealthcareProviders; 