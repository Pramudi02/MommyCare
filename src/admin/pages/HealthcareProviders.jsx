import React, { useState } from 'react';
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
  Baby
} from 'lucide-react';
import './HealthcareProviders.css';

const HealthcareProviders = () => {
  const [activeView, setActiveView] = useState('doctors'); // 'doctors' or 'midwives'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSpecialization, setFilterSpecialization] = useState('all');

  // Enhanced sample data
  const allProviders = [
    // Doctors
    {
      id: 1,
      name: 'Dr. Anura Silva',
      type: 'doctor',
      specialization: 'Gynecologist',
      email: 'anura.silva@moh.lk',
      phone: '+94 77 123 4567',
      clinic: 'Colombo General Hospital',
      location: 'Colombo',
      patients: 45,
      status: 'verified',
      joinDate: '2024-01-15',
      rating: 4.8,
      completedAppointments: 234,
      verificationStatus: 'approved',
      experience: '12 years',
      qualifications: 'MBBS, MD (Gynecology)',
      availability: 'Monday-Friday',
      lastActive: '2024-06-11'
    },
    {
      id: 2,
      name: 'Dr. Priya Jayawardena',
      type: 'doctor',
      specialization: 'Obstetrician',
      email: 'priya.jayawardena@moh.lk',
      phone: '+94 71 234 5678',
      clinic: 'Kandy Teaching Hospital',
      location: 'Kandy',
      patients: 38,
      status: 'verified',
      joinDate: '2024-02-20',
      rating: 4.9,
      completedAppointments: 189,
      verificationStatus: 'approved',
      experience: '8 years',
      qualifications: 'MBBS, MS (Obstetrics)',
      availability: 'Monday-Saturday',
      lastActive: '2024-06-10'
    },
    {
      id: 3,
      name: 'Dr. Nimal Fernando',
      type: 'doctor',
      specialization: 'Pediatrician',
      email: 'nimal.fernando@moh.lk',
      phone: '+94 76 345 6789',
      clinic: 'Galle District Hospital',
      location: 'Galle',
      patients: 52,
      status: 'pending',
      joinDate: '2024-06-10',
      rating: 4.7,
      completedAppointments: 156,
      verificationStatus: 'pending',
      experience: '15 years',
      qualifications: 'MBBS, DCH, MD (Pediatrics)',
      availability: 'Monday-Friday',
      lastActive: '2024-06-09'
    },
    {
      id: 4,
      name: 'Dr. Chaminda Perera',
      type: 'doctor',
      specialization: 'General Practitioner',
      email: 'chaminda.perera@moh.lk',
      phone: '+94 77 456 7890',
      clinic: 'Matara Base Hospital',
      location: 'Matara',
      patients: 41,
      status: 'verified',
      joinDate: '2024-03-12',
      rating: 4.6,
      completedAppointments: 203,
      verificationStatus: 'approved',
      experience: '10 years',
      qualifications: 'MBBS, Dip. Family Medicine',
      availability: 'Monday-Friday',
      lastActive: '2024-06-11'
    },
    // Midwives
    {
      id: 5,
      name: 'Midwife Kumari Perera',
      type: 'midwife',
      specialization: 'Community Midwife',
      email: 'kumari.perera@moh.lk',
      phone: '+94 71 987 6543',
      clinic: 'Gampaha MOH Office',
      location: 'Gampaha',
      patients: 28,
      status: 'verified',
      joinDate: '2024-02-10',
      rating: 4.6,
      completedAppointments: 156,
      verificationStatus: 'approved',
      experience: '6 years',
      qualifications: 'Diploma in Midwifery',
      availability: 'Monday-Saturday',
      lastActive: '2024-06-11'
    },
    {
      id: 6,
      name: 'Midwife Sandya Wickramasinghe',
      type: 'midwife',
      specialization: 'Hospital Midwife',
      email: 'sandya.wickrama@moh.lk',
      phone: '+94 75 876 5432',
      clinic: 'Negombo Base Hospital',
      location: 'Negombo',
      patients: 34,
      status: 'verified',
      joinDate: '2024-01-08',
      rating: 4.8,
      completedAppointments: 198,
      verificationStatus: 'approved',
      experience: '9 years',
      qualifications: 'Diploma in Midwifery, BSc Nursing',
      availability: 'Monday-Friday',
      lastActive: '2024-06-10'
    },
    {
      id: 7,
      name: 'Midwife Nilmini Rathnayake',
      type: 'midwife',
      specialization: 'Public Health Midwife',
      email: 'nilmini.rathnayake@moh.lk',
      phone: '+94 70 765 4321',
      clinic: 'Kurunegala MOH Office',
      location: 'Kurunegala',
      patients: 31,
      status: 'verified',
      joinDate: '2024-03-15',
      rating: 4.7,
      completedAppointments: 142,
      verificationStatus: 'approved',
      experience: '7 years',
      qualifications: 'Diploma in Midwifery, Certificate in Public Health',
      availability: 'Monday-Saturday',
      lastActive: '2024-06-11'
    },
    {
      id: 8,
      name: 'Midwife Dilani Senanayake',
      type: 'midwife',
      specialization: 'Community Midwife',
      email: 'dilani.senanayake@moh.lk',
      phone: '+94 72 654 3210',
      clinic: 'Ratnapura MOH Office',
      location: 'Ratnapura',
      patients: 26,
      status: 'pending',
      joinDate: '2024-05-22',
      rating: 4.5,
      completedAppointments: 89,
      verificationStatus: 'pending',
      experience: '4 years',
      qualifications: 'Diploma in Midwifery',
      availability: 'Monday-Friday',
      lastActive: '2024-06-08'
    }
  ];

  // Filter providers based on active view
  const currentProviders = allProviders.filter(provider => provider.type === activeView);

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
        <button className="action-btn view">
          <Eye className="action-icon" />
          View Profile
        </button>
        <button className="action-btn edit">
          <Edit className="action-icon" />
          Edit
        </button>
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
    avgRating: (currentProviders.reduce((sum, p) => sum + p.rating, 0) / currentProviders.length).toFixed(1)
  };

  return (
    <main className="dashboard-main">
      {/* Header */}
      <div className="page-header">
        <div className="breadcrumb">
          <span className="breadcrumb-item">User Management</span>
          <ChevronRight className="breadcrumb-icon" />
          <span className="breadcrumb-item">Healthcare Providers</span>
          <ChevronRight className="breadcrumb-icon" />
          <span className="breadcrumb-item active">
            {activeView === 'doctors' ? 'Doctors' : 'Midwives'}
          </span>
        </div>
        
        <div className="header-content">
          <div className="header-info">
            <h1 className="page-title">
              {activeView === 'doctors' ? 'Doctors Management' : 'Midwives Management'}
            </h1>
            <p className="page-description">
              {activeView === 'doctors' 
                ? 'Manage doctors and medical specialists' 
                : 'Manage midwives and maternal care providers'
              }
            </p>
          </div>
          
          <div className="header-actions">
            <button className="add-btn">
              <Plus className="add-icon" />
              Add {activeView === 'doctors' ? 'Doctor' : 'Midwife'}
            </button>
            <button className="export-btn">
              <Download className="export-icon" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Navigation */}
      <div className="toggle-card">
        <div className="toggle-header">
          <div className="toggle-buttons">
            <button
              onClick={() => setActiveView('doctors')}
              className={`toggle-btn ${activeView === 'doctors' ? 'active' : ''}`}
            >
              <Stethoscope className="toggle-icon" />
              Doctors ({allProviders.filter(p => p.type === 'doctor').length})
            </button>
            <button
              onClick={() => setActiveView('midwives')}
              className={`toggle-btn ${activeView === 'midwives' ? 'active' : ''}`}
            >
              <Heart className="toggle-icon" />
              Midwives ({allProviders.filter(p => p.type === 'midwife').length})
            </button>
          </div>
          
          <button className="back-btn">
            <ChevronRight className="back-icon" />
            Back to All Providers
          </button>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-controls">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder={`Search ${activeView}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Total {activeView === 'doctors' ? 'Doctors' : 'Midwives'}</p>
              <p className="stat-value">{currentStats.total}</p>
            </div>
            <Users className="stat-icon blue" />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Verified</p>
              <p className="stat-value green">{currentStats.verified}</p>
            </div>
            <CheckCircle className="stat-icon green" />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Pending</p>
              <p className="stat-value yellow">{currentStats.pending}</p>
            </div>
            <Clock className="stat-icon yellow" />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Total Patients</p>
              <p className="stat-value blue">{currentStats.totalPatients}</p>
            </div>
            <Baby className="stat-icon blue" />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <p className="stat-label">Avg Rating</p>
              <p className="stat-value purple">{currentStats.avgRating}</p>
            </div>
            <Star className="stat-icon purple" />
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="providers-container">
        <div className="providers-header">
          <h3 className="providers-title">
            {activeView === 'doctors' ? 'Doctors' : 'Midwives'} ({filteredProviders.length})
          </h3>
          <div className="providers-actions">
            <button className="filter-btn">
              <Filter className="filter-icon" />
            </button>
          </div>
        </div>
        
        <div className="providers-content">
          {filteredProviders.length > 0 ? (
            <div className="providers-grid">
              {filteredProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              {activeView === 'doctors' ? 
                <Stethoscope className="empty-icon" /> :
                <Heart className="empty-icon" />
              }
              <h3 className="empty-title">
                No {activeView} found
              </h3>
              <p className="empty-description">Try adjusting your search or filter criteria</p>
              <button className="empty-action-btn">
                Add First {activeView === 'doctors' ? 'Doctor' : 'Midwife'}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default HealthcareProviders; 