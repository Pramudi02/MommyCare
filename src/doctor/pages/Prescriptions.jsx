import React, { useState } from 'react';
import { FiPackage, FiCheck, FiClipboard, FiAlertTriangle, FiSearch, FiPlus, FiUser, FiCalendar, FiClock, FiEdit, FiEye, FiTrash2, FiX } from 'react-icons/fi';
import './Prescriptions.css';

const Prescriptions = () => {
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showNewPrescription, setShowNewPrescription] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample prescriptions data
  const prescriptions = [
    {
      id: 1,
      patient: "Emma Wilson",
      patientId: 1,
      date: "2024-12-15",
      status: "Active",
      type: "Prenatal Vitamins",
      medications: [
        {
          name: "Folic Acid",
          dosage: "400mcg",
          frequency: "Once daily",
          duration: "Until delivery",
          instructions: "Take with food"
        },
        {
          name: "Iron Supplement",
          dosage: "30mg",
          frequency: "Once daily",
          duration: "Until delivery",
          instructions: "Take on empty stomach"
        }
      ],
      notes: "Continue prenatal vitamins as prescribed. Monitor iron levels.",
      nextRefill: "2025-01-15",
      image: "/images/1.png"
    },
    {
      id: 2,
      patient: "Sophia Rodriguez",
      patientId: 2,
      date: "2024-12-10",
      status: "Active",
      type: "Pregnancy Support",
      medications: [
        {
          name: "Prenatal Multivitamin",
          dosage: "1 tablet",
          frequency: "Once daily",
          duration: "Until delivery",
          instructions: "Take with breakfast"
        }
      ],
      notes: "Standard prenatal vitamin regimen. No special instructions.",
      nextRefill: "2025-01-10",
      image: "/images/2.png"
    },
    {
      id: 3,
      patient: "Isabella Chen",
      patientId: 3,
      date: "2024-12-12",
      status: "Completed",
      type: "Postpartum Care",
      medications: [
        {
          name: "Ibuprofen",
          dosage: "400mg",
          frequency: "Every 6 hours as needed",
          duration: "7 days",
          instructions: "Take with food, not on empty stomach"
        },
        {
          name: "Prenatal Vitamin",
          dosage: "1 tablet",
          frequency: "Once daily",
          duration: "Continue breastfeeding",
          instructions: "Take with food"
        }
      ],
      notes: "Pain management for postpartum recovery. Continue vitamins while breastfeeding.",
      nextRefill: "N/A",
      image: "/images/3.png"
    },
    {
      id: 4,
      patient: "Mia Johnson",
      patientId: 4,
      date: "2024-12-14",
      status: "Active",
      type: "Emergency Treatment",
      medications: [
        {
          name: "Labetalol",
          dosage: "200mg",
          frequency: "Twice daily",
          duration: "Until blood pressure stabilizes",
          instructions: "Take with or without food"
        },
        {
          name: "Magnesium Sulfate",
          dosage: "4g IV",
          frequency: "Loading dose then maintenance",
          duration: "24-48 hours",
          instructions: "Hospital administration only"
        }
      ],
      notes: "Emergency treatment for preeclampsia. Monitor blood pressure closely.",
      nextRefill: "2024-12-21",
      image: "/images/4.png"
    },
    {
      id: 5,
      patient: "Ava Thompson",
      patientId: 5,
      date: "2024-12-08",
      status: "Active",
      type: "Fertility Support",
      medications: [
        {
          name: "Clomiphene Citrate",
          dosage: "50mg",
          frequency: "Once daily",
          duration: "5 days",
          instructions: "Start on day 5 of menstrual cycle"
        },
        {
          name: "Folic Acid",
          dosage: "400mcg",
          frequency: "Once daily",
          duration: "Until pregnancy confirmed",
          instructions: "Take with food"
        }
      ],
      notes: "Fertility treatment cycle. Monitor for side effects and ovulation.",
      nextRefill: "2024-12-15",
      image: "/images/5.png"
    },
    {
      id: 6,
      patient: "Charlotte Davis",
      patientId: 6,
      date: "2024-12-06",
      status: "Active",
      type: "Pregnancy Management",
      medications: [
        {
          name: "Prenatal Multivitamin",
          dosage: "1 tablet",
          frequency: "Once daily",
          duration: "Until delivery",
          instructions: "Take with breakfast"
        },
        {
          name: "DHA Supplement",
          dosage: "200mg",
          frequency: "Once daily",
          duration: "Until delivery",
          instructions: "Take with food"
        }
      ],
      notes: "Standard prenatal care. Continue healthy diet and exercise.",
      nextRefill: "2025-01-06",
      image: "/images/6.png"
    }
  ];

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || prescription.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#10b981';
      case 'completed':
        return '#6b7280';
      case 'expired':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const closePrescriptionDetails = () => {
    setSelectedPrescription(null);
  };

  const handleEditPrescription = (prescription) => {
    console.log('Edit prescription:', prescription.id);
    // Add edit logic here
  };

  const handleDeletePrescription = (prescription) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      console.log('Delete prescription:', prescription.id);
      // Add delete logic here
    }
  };

  return (
    <div className="doctor-prescriptions-page">
      <div className="doctor-prescriptions-container">
        <div className="doctor-prescriptions">
          <div className="doctor-prescriptions__header">
            <div className="doctor-prescriptions__header-icon">
              <FiPackage className="w-6 h-6" />
            </div>
            <div className="doctor-prescriptions__welcome">
              <h1>Prescription Management</h1>
              <p>Manage and monitor patient prescriptions and medication orders</p>
            </div>
          </div>

          <div className="doctor-prescriptions__controls">
            <div className="doctor-prescriptions__search">
              <div className="doctor-search-input">
                <FiSearch className="doctor-search-icon" />
                <input
                  type="text"
                  placeholder="Search prescriptions by patient name or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="doctor-search-field"
                />
              </div>
            </div>

            <div className="doctor-prescriptions__filters">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="doctor-status-filter"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <button className="doctor-add-prescription-btn">
              <FiPlus size={16} />
              New Prescription
            </button>
          </div>

          <div className="doctor-prescriptions__content">
            <div className="doctor-prescriptions-grid">
              {filteredPrescriptions.map(prescription => (
                <div key={prescription.id} className="doctor-prescription-card">
                  <div className="doctor-prescription-card__header">
                    <div className="doctor-prescription-card__status">
                      <span 
                        className="doctor-prescription-status-badge"
                        style={{ backgroundColor: getStatusColor(prescription.status) }}
                      >
                        {prescription.status}
                      </span>
                    </div>
                  </div>

                  <div className="doctor-prescription-card__body">
                    <h3 className="doctor-prescription-card__name">{prescription.patient}</h3>
                    <div className="doctor-prescription-card__info">
                      <div className="doctor-prescription-info-item">
                        <FiPackage size={14} />
                        <span>{prescription.type}</span>
                      </div>
                      <div className="doctor-prescription-info-item">
                        <FiCalendar size={14} />
                        <span>Prescribed: {prescription.date}</span>
                      </div>
                      <div className="doctor-prescription-info-item">
                        <FiClock size={14} />
                        <span>Next refill: {prescription.nextRefill}</span>
                      </div>
                      <div className="doctor-prescription-info-item">
                        <FiUser size={14} />
                        <span>{prescription.medications.length} medications</span>
                      </div>
                    </div>
                  </div>

                  <div className="doctor-prescription-card__actions">
                    <button 
                      className="doctor-prescription-action-btn doctor-prescription-action-btn--view"
                      onClick={() => handleViewPrescription(prescription)}
                    >
                      <FiEye size={14} />
                      View
                    </button>
                    <button 
                      className="doctor-prescription-action-btn doctor-prescription-action-btn--edit"
                      onClick={() => handleEditPrescription(prescription)}
                    >
                      <FiEdit size={14} />
                      Edit
                    </button>
                    <button 
                      className="doctor-prescription-action-btn doctor-prescription-action-btn--delete"
                      onClick={() => handleDeletePrescription(prescription)}
                    >
                      <FiTrash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredPrescriptions.length === 0 && (
              <div className="doctor-no-prescriptions">
                <div className="doctor-no-prescriptions-icon">
                  <FiPackage size={48} />
                </div>
                <h3>No prescriptions found</h3>
                <p>Try adjusting your search criteria or create a new prescription.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prescription Details Modal */}
      {selectedPrescription && (
        <div className="prescription-modal-overlay" onClick={closePrescriptionDetails}>
          <div className="prescription-modal" onClick={(e) => e.stopPropagation()}>
            <div className="prescription-modal__header">
              <h2>Prescription Details</h2>
              <button className="close-btn" onClick={closePrescriptionDetails}>
                <FiX size={20} />
              </button>
            </div>
            
            <div className="prescription-modal__content">
              <div className="prescription-info">
                <div className="info-row">
                  <label>Patient:</label>
                  <div className="patient-info">
                    <span>{selectedPrescription.patient}</span>
                  </div>
                </div>
                
                <div className="info-row">
                  <label>Type:</label>
                  <span>{selectedPrescription.type}</span>
                </div>
                
                <div className="info-row">
                  <label>Date:</label>
                  <span>{selectedPrescription.date}</span>
                </div>
                
                <div className="info-row">
                  <label>Status:</label>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedPrescription.status) }}
                  >
                    {selectedPrescription.status}
                  </span>
                </div>
                
                <div className="info-row">
                  <label>Next Refill:</label>
                  <span>{selectedPrescription.nextRefill}</span>
                </div>
                
                <div className="info-row">
                  <label>Notes:</label>
                  <span>{selectedPrescription.notes}</span>
                </div>
              </div>

              <div className="medications-section">
                <h3>Medications</h3>
                {selectedPrescription.medications.map((med, index) => (
                  <div key={index} className="medication-item">
                    <div className="medication-header">
                      <h4>{med.name}</h4>
                      <span className="medication-dosage">{med.dosage}</span>
                    </div>
                    <div className="medication-details">
                      <p><strong>Frequency:</strong> {med.frequency}</p>
                      <p><strong>Duration:</strong> {med.duration}</p>
                      <p><strong>Instructions:</strong> {med.instructions}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="prescription-modal__actions">
              <button className="btn btn-primary">Edit Prescription</button>
              <button className="btn btn-secondary">Print Prescription</button>
              <button className="btn btn-outline">Send to Pharmacy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prescriptions; 