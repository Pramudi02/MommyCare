import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiUser, FiCalendar, FiPhone, FiMapPin, FiEdit, FiEye, FiMessageCircle, FiX, FiCheck } from 'react-icons/fi';
import { doctorAPI } from '../../services/api';
import './Patients.css';

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [availableMoms, setAvailableMoms] = useState([]);
  const [assigningPatient, setAssigningPatient] = useState(false);

  const navigate = useNavigate();

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getMyPatients();
      if (response.status === 'success') {
        setPatients(response.data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableMoms = async () => {
    try {
      const response = await doctorAPI.getAvailableMoms();
      if (response.status === 'success') {
        setAvailableMoms(response.data);
      }
    } catch (error) {
      console.error('Error fetching available moms:', error);
    }
  };

  const handleAddPatientClick = async () => {
    setShowAddPatientModal(true);
    await fetchAvailableMoms();
  };

  const handleAssignPatient = async (momId) => {
    try {
      setAssigningPatient(true);
      const response = await doctorAPI.assignPatient(momId);
      if (response.status === 'success') {
        // Refresh patients list
        await fetchPatients();
        setShowAddPatientModal(false);
        // Remove the assigned mom from available moms
        setAvailableMoms(prev => prev.filter(mom => mom._id !== momId));
      }
    } catch (error) {
      console.error('Error assigning patient:', error);
    } finally {
      setAssigningPatient(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (patient.phone && patient.phone.includes(searchTerm));
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && patient.appointmentCount > 0) ||
                         (filterStatus === 'follow-up' && patient.nextAppointment) ||
                         (filterStatus === 'emergency' && patient.currentPregnancy?.isHighRisk);
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (patient) => {
    if (patient.currentPregnancy?.isHighRisk) return '#ef4444'; // Emergency/High Risk
    if (patient.nextAppointment) return '#f59e0b'; // Follow-up
    if (patient.appointmentCount > 0) return '#10b981'; // Active
    return '#6b7280'; // Default
  };

  const getStatusText = (patient) => {
    if (patient.currentPregnancy?.isHighRisk) return 'High Risk';
    if (patient.nextAppointment) return 'Follow-up';
    if (patient.appointmentCount > 0) return 'Active';
    return 'Inactive';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewPatient = (patientId) => {
    navigate(`/doctor/patient-details/${patientId}`);
  };

  if (loading) {
    return (
      <div className="doctor-patients-page">
        <div className="doctor-patients-container">
          <div className="doctor-patients">
            <div className="doctor-patients__header">
              <div className="doctor-patients__header-icon">
                <FiUser className="w-6 h-6" />
              </div>
              <div className="doctor-patients__welcome">
                <h1>Patient Management</h1>
                <p>Loading patients...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-patients-page">
      <div className="doctor-patients-container">
        <div className="doctor-patients">
          <div className="doctor-patients__header">
            <div className="doctor-patients__header-icon">
              <FiUser className="w-6 h-6" />
            </div>
            <div className="doctor-patients__welcome">
              <h1>Patient Management</h1>
              <p>Manage and monitor your patients' health records and appointments</p>
            </div>
          </div>

          <div className="doctor-patients__controls">
            <div className="doctor-patients__search">
              <div className="doctor-search-input">
                <FiSearch className="doctor-search-icon" />
                <input
                  type="text"
                  placeholder="Search patients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="doctor-search-field"
                />
              </div>
            </div>

            <div className="doctor-patients__filters">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="doctor-status-filter"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="follow-up">Follow-up</option>
                <option value="emergency">High Risk</option>
              </select>
            </div>

            <button 
              className="doctor-add-patient-btn"
              onClick={handleAddPatientClick}
            >
              <FiPlus size={16} />
              Add New Patient
            </button>
          </div>

          <div className="doctor-patients__content">
            <div className="doctor-patients-grid">
              {filteredPatients.map(patient => (
                <div key={patient._id} className="doctor-patient-card">
                  <div className="doctor-patient-card__header">
                    <div className="doctor-patient-card__avatar">
                      <img src={`/images/${Math.floor(Math.random() * 6) + 1}.png`} alt={patient.name} />
                    </div>
                    <div className="doctor-patient-card__status">
                      <span 
                        className="doctor-patient-status-badge"
                        style={{ backgroundColor: getStatusColor(patient) }}
                      >
                        {getStatusText(patient)}
                      </span>
                    </div>
                  </div>

                  <div className="doctor-patient-card__body">
                    <h3 className="doctor-patient-card__name">{patient.name}</h3>
                    <div className="doctor-patient-card__info">
                      <div className="doctor-patient-info-item">
                        <FiUser size={14} />
                        <span>{patient.age || 'N/A'} years old</span>
                      </div>
                      <div className="doctor-patient-info-item">
                        <FiCalendar size={14} />
                        <span>Appointments: {patient.appointmentCount || 0}</span>
                      </div>
                      <div className="doctor-patient-info-item">
                        <FiPhone size={14} />
                        <span>{patient.phone || 'N/A'}</span>
                      </div>
                      <div className="doctor-patient-info-item">
                        <FiMapPin size={14} />
                        <span>Pregnancy: {patient.currentPregnancy?.week || 'N/A'} weeks</span>
                      </div>
                    </div>
                  </div>

                  <div className="doctor-patient-card__actions">
                    <button 
                      className="doctor-patient-action-btn doctor-patient-action-btn--view"
                      onClick={() => handleViewPatient(patient._id)}
                    >
                      <FiEye size={14} />
                      View
                    </button>
                    <button className="doctor-patient-action-btn doctor-patient-action-btn--edit">
                      <FiEdit size={14} />
                      Edit
                    </button>
                    <button className="doctor-patient-action-btn doctor-patient-action-btn--message">
                      <FiMessageCircle size={14} />
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredPatients.length === 0 && (
              <div className="doctor-no-patients">
                <div className="doctor-no-patients-icon">
                  <FiUser size={48} />
                </div>
                <h3>No patients found</h3>
                <p>Try adjusting your search criteria or add a new patient.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Patient</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setShowAddPatientModal(false)}
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <p className="modal-description">
                Select a mom from the database to assign as your patient:
              </p>
              
              <div className="available-moms-list">
                {availableMoms.length === 0 ? (
                  <div className="no-moms-available">
                    <p>No available moms found. All moms in the system are already assigned to doctors.</p>
                  </div>
                ) : (
                  availableMoms.map(mom => (
                    <div key={mom._id} className="mom-item">
                      <div className="mom-info">
                        <h4>{mom.name}</h4>
                        <p>Age: {mom.age || 'N/A'} | Blood: {mom.bloodGroup || 'N/A'}</p>
                        <p>Phone: {mom.phone || 'N/A'} | Email: {mom.email}</p>
                        <p>Pregnancy: {mom.currentPregnancy?.week || 'N/A'} weeks | EDD: {formatDate(mom.edd)}</p>
                      </div>
                      <button
                        className="assign-patient-btn"
                        onClick={() => handleAssignPatient(mom._id)}
                        disabled={assigningPatient}
                      >
                        {assigningPatient ? (
                          <>
                            <FiCheck size={16} />
                            Assigning...
                          </>
                        ) : (
                          <>
                            <FiPlus size={16} />
                            Assign
                          </>
                        )}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;