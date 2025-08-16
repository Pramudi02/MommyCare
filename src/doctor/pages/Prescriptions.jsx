import React, { useState } from 'react';
import './Prescriptions.css';
import { 
  FaPills, 
  FaCheck, 
  FaClipboardList, 
  FaExclamationTriangle,
  FaSearch
} from 'react-icons/fa';

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
          name: "Aspirin",
          dosage: "81mg",
          frequency: "Once daily",
          duration: "Until delivery",
          instructions: "Take with food"
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
      type: "Prenatal Care",
      medications: [
        {
          name: "Folic Acid",
          dosage: "400mcg",
          frequency: "Once daily",
          duration: "Until delivery",
          instructions: "Take with food"
        }
      ],
      notes: "Standard folic acid supplementation for early pregnancy.",
      nextRefill: "2025-01-08",
      image: "/images/5.png"
    }
  ];

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || prescription.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return '#10b981';
      case 'completed': return '#6b7280';
      case 'expired': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handlePrescriptionClick = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const closePrescriptionDetails = () => {
    setSelectedPrescription(null);
  };

  const openNewPrescription = () => {
    setShowNewPrescription(true);
  };

  const closeNewPrescription = () => {
    setShowNewPrescription(false);
  };

  return (
    <div className="prescriptions-page">
      {/* Header - Matching dashboard exactly */}
      <div className="prescriptions-header">
        <h1>Prescription Management</h1>
        <p>Create and manage patient prescriptions</p>
        <div className="doctor-dashboard-header-decoration"></div>
      </div>

      {/* Statistics Cards - Matching dashboard exactly */}
      <div className="prescriptions-stats">
        <div className="prescription-stat-card" style={{ borderLeftColor: "#4CAF50" }}>
          <div className="prescription-stat-card-icon" style={{ backgroundColor: "#4CAF50" }}>
            <FaPills />
          </div>
          <div className="prescription-stat-card-content">
            <h3>{prescriptions.length}</h3>
            <p>Total Prescriptions</p>
          </div>
        </div>
        <div className="prescription-stat-card" style={{ borderLeftColor: "#2196F3" }}>
          <div className="prescription-stat-card-icon" style={{ backgroundColor: "#2196F3" }}>
            <FaCheck />
          </div>
          <div className="prescription-stat-card-content">
            <h3>{prescriptions.filter(p => p.status === 'Active').length}</h3>
            <p>Active</p>
          </div>
        </div>
        <div className="prescription-stat-card" style={{ borderLeftColor: "#FF9800" }}>
          <div className="prescription-stat-card-icon" style={{ backgroundColor: "#FF9800" }}>
            <FaClipboardList />
          </div>
          <div className="prescription-stat-card-content">
            <h3>{prescriptions.filter(p => p.status === 'Completed').length}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="prescription-stat-card" style={{ borderLeftColor: "#F44336" }}>
          <div className="prescription-stat-card-icon" style={{ backgroundColor: "#F44336" }}>
            <FaExclamationTriangle />
          </div>
          <div className="prescription-stat-card-content">
            <h3>{prescriptions.filter(p => p.status === 'Expired').length}</h3>
            <p>Expired</p>
          </div>
        </div>
      </div>

      <div className="prescriptions-content">
        {/* Left Column */}
        <div className="prescriptions-left">
          {/* Search and Filters Section */}
          <div className="prescriptions-section">
            <div className="prescriptions-section-header">
              <h2>Prescription Controls</h2>
              <button className="prescriptions-view-all-btn" onClick={openNewPrescription}>
                <FaPills /> New Prescription
              </button>
            </div>
            <div className="prescriptions-controls">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search prescriptions by patient or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="search-icon"><FaSearch /></span>
              </div>
              
              <div className="filters">
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>

          {/* Prescriptions Grid Section */}
          <div className="prescriptions-section">
            <div className="prescriptions-section-header">
              <h2>Prescriptions</h2>
              <span className="prescriptions-count">{filteredPrescriptions.length} prescriptions</span>
            </div>
            <div className="prescriptions-grid">
              {filteredPrescriptions.map(prescription => (
                <div key={prescription.id} className="prescription-card" onClick={() => handlePrescriptionClick(prescription)}>
                  <div className="prescription-card__header">
                    <img src={prescription.image} alt={prescription.patient} className="patient-avatar" />
                    <div className="prescription-status" style={{ backgroundColor: getStatusColor(prescription.status) }}>
                      {prescription.status}
                    </div>
                  </div>
                  
                  <div className="prescription-card__body">
                    <h3>{prescription.patient}</h3>
                    <p className="prescription-type">{prescription.type}</p>
                    <p className="prescription-date">Prescribed: {prescription.date}</p>
                    <p className="medication-count">{prescription.medications.length} medication(s)</p>
                    <p className="next-refill">Next Refill: {prescription.nextRefill}</p>
                  </div>
                  
                  <div className="prescription-card__footer">
                    <button className="view-btn">View Details</button>
                    <button className="refill-btn">Request Refill</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Empty for now */}
        <div className="prescriptions-right">
          {/* Empty right column - can be used for additional features later */}
        </div>
      </div>

      {/* Prescription Details Modal */}
      {selectedPrescription && (
        <div className="prescription-modal-overlay" onClick={closePrescriptionDetails}>
          <div className="prescription-modal" onClick={(e) => e.stopPropagation()}>
            <div className="prescription-modal__header">
              <h2>Prescription Details</h2>
              <button className="close-btn" onClick={closePrescriptionDetails}>✕</button>
            </div>
            
            <div className="prescription-modal__content">
              <div className="patient-info-section">
                <img src={selectedPrescription.image} alt={selectedPrescription.patient} />
                <div>
                  <h3>{selectedPrescription.patient}</h3>
                  <p className="prescription-type">{selectedPrescription.type}</p>
                  <p className="prescription-date">Prescribed: {selectedPrescription.date}</p>
                </div>
              </div>

              <div className="medications-section">
                <h3>Medications</h3>
                {selectedPrescription.medications.map((med, index) => (
                  <div key={index} className="medication-item">
                    <div className="medication-header">
                      <h4>{med.name}</h4>
                      <span className="dosage">{med.dosage}</span>
                    </div>
                    <div className="medication-details">
                      <p><strong>Frequency:</strong> {med.frequency}</p>
                      <p><strong>Duration:</strong> {med.duration}</p>
                      <p><strong>Instructions:</strong> {med.instructions}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="notes-section">
                <h3>Notes</h3>
                <p>{selectedPrescription.notes}</p>
              </div>

              <div className="refill-section">
                <h3>Refill Information</h3>
                <p><strong>Next Refill:</strong> {selectedPrescription.nextRefill}</p>
                <p><strong>Status:</strong> 
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedPrescription.status) }}
                  >
                    {selectedPrescription.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="prescription-modal__actions">
              <button className="btn btn-primary">Edit Prescription</button>
              <button className="btn btn-secondary">Request Refill</button>
              <button className="btn btn-outline">Print Prescription</button>
              <button className="btn btn-danger">Discontinue</button>
            </div>
          </div>
        </div>
      )}

      {/* New Prescription Modal */}
      {showNewPrescription && (
        <div className="prescription-modal-overlay" onClick={closeNewPrescription}>
          <div className="prescription-modal new-prescription-modal" onClick={(e) => e.stopPropagation()}>
            <div className="prescription-modal__header">
              <h2>Create New Prescription</h2>
              <button className="close-btn" onClick={closeNewPrescription}>✕</button>
            </div>
            
            <div className="prescription-modal__content">
              <div className="form-section">
                <h3>Patient Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Select Patient</label>
                    <select>
                      <option>Select a patient...</option>
                      <option>Emma Wilson</option>
                      <option>Sophia Rodriguez</option>
                      <option>Isabella Chen</option>
                      <option>Mia Johnson</option>
                      <option>Ava Thompson</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Prescription Type</label>
                    <select>
                      <option>Prenatal Care</option>
                      <option>Postpartum Care</option>
                      <option>Emergency Treatment</option>
                      <option>Follow-up Care</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Medications</h3>
                <div className="medication-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Medication Name</label>
                      <input type="text" placeholder="e.g., Folic Acid" />
                    </div>
                    <div className="form-group">
                      <label>Dosage</label>
                      <input type="text" placeholder="e.g., 400mcg" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Frequency</label>
                      <select>
                        <option>Once daily</option>
                        <option>Twice daily</option>
                        <option>Three times daily</option>
                        <option>As needed</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Duration</label>
                      <input type="text" placeholder="e.g., Until delivery" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Instructions</label>
                    <textarea placeholder="Special instructions for the patient..."></textarea>
                  </div>
                  <button className="add-medication-btn">+ Add Another Medication</button>
                </div>
              </div>

              <div className="form-section">
                <h3>Additional Information</h3>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea placeholder="Additional notes or instructions..."></textarea>
                </div>
                <div className="form-group">
                  <label>Next Refill Date</label>
                  <input type="date" />
                </div>
              </div>
            </div>

            <div className="prescription-modal__actions">
              <button className="btn btn-outline" onClick={closeNewPrescription}>Cancel</button>
              <button className="btn btn-primary">Create Prescription</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prescriptions; 