// src/pages/PatientDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiUser, FiMail, FiPhone, FiCalendar, FiClock, FiFileText, FiArrowLeft,
  FiEdit, FiMessageCircle, FiActivity, FiMapPin, FiHeart, FiDroplet,
  FiTrendingUp, FiAlertTriangle, FiCheckCircle, FiXCircle
} from 'react-icons/fi';
import { doctorAPI } from '../../services/api';
import './PatientDetails.css';

const PatientDetails = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (patientId) {
      fetchPatientDetails();
    }
  }, [patientId]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await doctorAPI.getPatientDetails(patientId);
      if (response.status === 'success') {
        setPatient(response.data);
      } else {
        setError('Failed to fetch patient details');
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
      setError('Failed to fetch patient details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) + ' ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskLevelColor = (isHighRisk) => {
    return isHighRisk ? '#ef4444' : '#10b981';
  };

  const getRiskLevelText = (isHighRisk) => {
    return isHighRisk ? 'High Risk' : 'Low Risk';
  };

  if (loading) {
    return (
      <div className="doctor-dashboard-page">
        <div className="doctor-dashboard-container">
          <div className="doctor-dashboard">
            <div className="loading-state">
              <FiUser className="loading-icon" />
              <p>Loading patient details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="doctor-dashboard-page">
        <div className="doctor-dashboard-container">
          <div className="doctor-dashboard">
            <div className="error-state">
              <FiUser className="error-icon" />
              <p>{error || 'Patient not found'}</p>
              <button onClick={() => navigate('/doctor/patients')} className="retry-btn">
                Back to Patients
              </button>
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
          {/* Header */}
          <div className="doctor-dashboard__header">
            <div className="doctor-dashboard__header-icon">
              <FiUser />
            </div>
            <div className="doctor-dashboard__welcome">
              <h1>Patient Details</h1>
              <p>Comprehensive view of {patient.name}'s health information</p>
            </div>
          </div>

          {/* Back Button */}
          <div className="doctor-dashboard__section">
            <button className="back-btn" onClick={() => navigate('/doctor/patients')}>
              <FiArrowLeft />
              Back to Patients
            </button>
          </div>

          {/* Patient Overview Card */}
          <div className="doctor-dashboard__section">
            <div className="patient-overview-card">
              <div className="patient-avatar-large">
                <FiUser />
              </div>
              <div className="patient-overview-info">
                <h2>{patient.name}</h2>
                <p className="patient-email">{patient.email}</p>
                <div className="patient-stats">
                  <div className="stat-item">
                    <FiCalendar />
                    <span>Total Appointments: {patient.appointments?.total || 0}</span>
                  </div>
                  <div className="stat-item">
                    <FiCheckCircle />
                    <span>Completed: {patient.appointments?.completed || 0}</span>
                  </div>
                  <div className="stat-item">
                    <FiClock />
                    <span>Upcoming: {patient.appointments?.upcoming || 0}</span>
                  </div>
                </div>
              </div>
              <div className="patient-actions-overview">
                <button className="action-btn edit-btn">
                  <FiEdit />
                  Edit
                </button>
                <button className="action-btn message-btn">
                  <FiMessageCircle />
                  Message
                </button>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="doctor-dashboard__section">
            <div className="tabs-navigation">
              <button
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <FiUser />
                Overview
              </button>
              <button
                className={`tab-btn ${activeTab === 'medical' ? 'active' : ''}`}
                onClick={() => setActiveTab('medical')}
              >
                <FiHeart />
                Medical Details
              </button>
              <button
                className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
                onClick={() => setActiveTab('appointments')}
              >
                <FiCalendar />
                Appointments
              </button>
              <button
                className={`tab-btn ${activeTab === 'pregnancy' ? 'active' : ''}`}
                onClick={() => setActiveTab('pregnancy')}
              >
                <FiTrendingUp />
                Pregnancy Info
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="doctor-dashboard__section">
            {activeTab === 'overview' && (
              <div className="overview-content">
                <div className="info-grid">
                  <div className="info-card">
                    <h3><FiMail /> Contact Information</h3>
                    <div className="info-item">
                      <strong>Email:</strong> {patient.email}
                    </div>
                    <div className="info-item">
                      <strong>Phone:</strong> {patient.phone || 'N/A'}
                    </div>
                    <div className="info-item">
                      <strong>Age:</strong> {patient.age || 'N/A'} years
                    </div>
                    <div className="info-item">
                      <strong>Blood Group:</strong> {patient.bloodGroup || 'N/A'}
                    </div>
                  </div>

                  <div className="info-card">
                    <h3><FiActivity /> Health Summary</h3>
                    <div className="info-item">
                      <strong>Height:</strong> {patient.height?.value || 'N/A'} {patient.height?.unit || ''}
                    </div>
                    <div className="info-item">
                      <strong>Weight:</strong> {patient.weight?.value || 'N/A'} {patient.weight?.unit || ''}
                    </div>
                    <div className="info-item">
                      <strong>Current BMI:</strong> {patient.currentBMI || 'N/A'}
                    </div>
                    <div className="info-item">
                      <strong>Risk Level:</strong> 
                      <span style={{ color: getRiskLevelColor(patient.currentPregnancy?.isHighRisk) }}>
                        {getRiskLevelText(patient.currentPregnancy?.isHighRisk)}
                      </span>
                    </div>
                  </div>

                  <div className="info-card">
                    <h3><FiMapPin /> Location Information</h3>
                    <div className="info-item">
                      <strong>MOH Area:</strong> {patient.mohArea || 'N/A'}
                    </div>
                    <div className="info-item">
                      <strong>PHM Area:</strong> {patient.phmArea || 'N/A'}
                    </div>
                    <div className="info-item">
                      <strong>Field Clinic:</strong> {patient.fieldClinic || 'N/A'}
                    </div>
                    <div className="info-item">
                      <strong>Hospital/Clinic:</strong> {patient.hospitalClinic || 'N/A'}
                    </div>
                  </div>

                  <div className="info-card">
                    <h3><FiUser /> Emergency Contact</h3>
                    <div className="info-item">
                      <strong>Name:</strong> {patient.emergencyContact?.name || 'N/A'}
                    </div>
                    <div className="info-item">
                      <strong>Phone:</strong> {patient.emergencyContact?.phone || 'N/A'}
                    </div>
                    <div className="info-item">
                      <strong>Relationship:</strong> {patient.emergencyContact?.relationship || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'medical' && (
              <div className="medical-content">
                <div className="info-grid">
                  <div className="info-card">
                    <h3><FiHeart /> Medical History</h3>
                    <div className="info-item">
                      <strong>Previous Pregnancies:</strong> {patient.medicalHistory?.previousPregnancies || 0}
                    </div>
                    <div className="info-item">
                      <strong>Allergies:</strong> 
                      {patient.medicalHistory?.allergies?.length > 0 ? 
                        patient.medicalHistory.allergies.join(', ') : 'None'
                      }
                    </div>
                    <div className="info-item">
                      <strong>Chronic Conditions:</strong>
                      {patient.medicalHistory?.chronicConditions?.length > 0 ? 
                        patient.medicalHistory.chronicConditions.join(', ') : 'None'
                      }
                    </div>
                    <div className="info-item">
                      <strong>Complications:</strong>
                      {patient.medicalHistory?.complications?.length > 0 ? 
                        patient.medicalHistory.complications.join(', ') : 'None'
                      }
                    </div>
                  </div>

                  <div className="info-card">
                    <h3><FiDroplet /> Vital Signs</h3>
                    <div className="info-item">
                      <strong>Blood Group:</strong> {patient.bloodGroup || 'N/A'}
                    </div>
                    <div className="info-item">
                      <strong>Height:</strong> {patient.height?.value || 'N/A'} {patient.height?.unit || ''}
                    </div>
                    <div className="info-item">
                      <strong>Weight:</strong> {patient.weight?.value || 'N/A'} {patient.weight?.unit || ''}
                    </div>
                    <div className="info-item">
                      <strong>BMI:</strong> {patient.currentBMI || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="appointments-content">
                <h3>Appointment History</h3>
                {patient.appointments?.history?.length > 0 ? (
                  <div className="appointments-list">
                    {patient.appointments.history.map((appointment) => (
                      <div key={appointment._id} className="appointment-item">
                        <div className="appointment-header">
                          <h4>{appointment.title}</h4>
                          <span className={`status-badge status-${appointment.status}`}>
                            {appointment.status}
                          </span>
                        </div>
                        <div className="appointment-details">
                          <div className="detail-row">
                            <FiCalendar />
                            <span>{formatDateTime(appointment.startTime)}</span>
                          </div>
                          <div className="detail-row">
                            <FiClock />
                            <span>Duration: {appointment.duration} minutes</span>
                          </div>
                          <div className="detail-row">
                            <FiActivity />
                            <span>Type: {appointment.type}</span>
                          </div>
                          {appointment.notes && (
                            <div className="detail-row">
                              <FiFileText />
                              <span>Notes: {appointment.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-data">
                    <FiCalendar />
                    <p>No appointments found for this patient.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'pregnancy' && (
              <div className="pregnancy-content">
                <div className="info-grid">
                  <div className="info-card">
                    <h3><FiTrendingUp /> Current Pregnancy</h3>
                    <div className="info-item">
                      <strong>Week:</strong> {patient.currentPregnancy?.week || 'N/A'}
                    </div>
                    <div className="info-item">
                      <strong>Trimester:</strong> {patient.currentPregnancy?.trimester || 'N/A'}
                    </div>
                    <div className="info-item">
                      <strong>Risk Level:</strong> 
                      <span style={{ color: getRiskLevelColor(patient.currentPregnancy?.isHighRisk) }}>
                        {getRiskLevelText(patient.currentPregnancy?.isHighRisk)}
                      </span>
                    </div>
                    <div className="info-item">
                      <strong>Risk Factors:</strong>
                      {patient.currentPregnancy?.riskFactors?.length > 0 ? 
                        patient.currentPregnancy.riskFactors.join(', ') : 'None'
                      }
                    </div>
                  </div>

                  <div className="info-card">
                    <h3><FiCalendar /> Important Dates</h3>
                    <div className="info-item">
                      <strong>Last Menstrual Period (LMP):</strong> {formatDate(patient.lmp)}
                    </div>
                    <div className="info-item">
                      <strong>Expected Due Date (EDD):</strong> {formatDate(patient.edd)}
                    </div>
                    <div className="info-item">
                      <strong>Next Clinic Date:</strong> {formatDate(patient.nextClinicDate)}
                    </div>
                  </div>

                  <div className="info-card">
                    <h3><FiUser /> Obstetrician</h3>
                    <div className="info-item">
                      <strong>Consultant:</strong> {patient.consultantObstetrician || 'N/A'}
                    </div>
                    <div className="info-item">
                      <strong>Grama Niladhari Division:</strong> {patient.gramaNiladhariDivision || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
