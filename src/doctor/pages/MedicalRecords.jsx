import React, { useState, useEffect } from 'react';
import { FiUsers, FiCalendar, FiFileText, FiSearch, FiFilter, FiPlus, FiEye, FiDownload, FiEdit3, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from '../../services/api';
import './MedicalRecords.css';

const MedicalRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await doctorAPI.getMedicalRecordPatients();
        if (res.status === 'success') setPatients(res.data);
      } catch (e) {
        console.error('Failed to load medical record patients', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = patients.filter(p => {
    const s = searchTerm.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(s) || p.email.toLowerCase().includes(s);
    // For now filterType is placeholder; categories can be added later
    const matchesFilter = filterType === 'all';
    return matchesSearch && matchesFilter;
  });

  const handleViewRecords = (patientId) => navigate(`/doctor/medical-records/view/${patientId}`);
  const handleSubmitRecord = (patientId) => navigate(`/doctor/medical-records/submit/${patientId}`);

  if (loading) {
    return (
      <div className="doctor-dashboard-page">
        <div className="doctor-dashboard-container">
          <div className="doctor-dashboard">
            <div className="no-records">
              <div className="no-records-icon">
                <FiFileText />
              </div>
              <h3>Loading medical records...</h3>
            </div>
          </div>
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
              <FiFileText />
            </div>
            <div className="doctor-dashboard__welcome">
              <h1>Medical Records</h1>
              <p>Manage and review patient medical records and documentation</p>
            </div>
          </div>

          {/* Controls Section */}
          <div className="doctor-dashboard__section">
            <div className="medical-records-controls">
              <div className="search-box">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search patients by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filters">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All</option>
                </select>
              </div>

              <button className="new-record-btn" onClick={() => navigate('/doctor/appointments/new')}>
                <FiPlus />
                <span>New Appointment</span>
              </button>
            </div>
          </div>

          {/* Records Grid */}
          <div className="doctor-dashboard__section">
            <div className="medical-records-grid">
              {filtered.map(patient => (
                <div key={patient._id} className="medical-record-card">
                  <div className="record-header">
                    <div className="patient-info">
                      <div className="patient-avatar">
                        <img src={`/images/${(Math.floor(Math.random()*6)+1)}.png`} alt={patient.name} />
                      </div>
                      <div className="patient-details">
                        <h3>{patient.name}</h3>
                        <p className="record-type">{patient.email}</p>
                        <p className="record-category">Role: {patient.role}</p>
                      </div>
                    </div>
                    <div className="record-meta">
                      <span className="record-date">
                        <FiCalendar className="meta-icon" />
                        Reports
                      </span>
                      <span className="record-doctor">
                        <FiUser className="meta-icon" />
                        {patient.reportCount} total
                      </span>
                    </div>
                  </div>

                  <div className="record-summary">
                    <p>View reports submitted by mom and doctor, or submit a new report for this patient.</p>
                  </div>

                  <div className="record-actions">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => handleViewRecords(patient._id)}
                    >
                      <FiEye />
                      View Records
                    </button>
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleSubmitRecord(patient._id)}
                    >
                      <FiEdit3 />
                      Submit Record
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="no-records">
                <div className="no-records-icon">
                  <FiFileText />
                </div>
                <h3>No patients found</h3>
                <p>Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
