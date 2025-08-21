import React, { useState } from 'react';
import { FiUsers, FiCalendar, FiFileText, FiSearch, FiFilter, FiPlus, FiEye, FiDownload, FiEdit3, FiUser, FiActivity, FiClipboard, FiX } from 'react-icons/fi';
import './MedicalRecords.css';

const MedicalRecords = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Sample medical records data
  const medicalRecords = [
    {
      id: 1,
      patient: "Emma Wilson",
      patientId: 1,
      date: "2024-12-15",
      type: "Prenatal Checkup",
      category: "Pregnancy Care",
      doctor: "Dr. Sarah Johnson",
      summary: "Regular prenatal checkup at 24 weeks. Blood pressure normal, weight gain appropriate.",
      findings: "Fetal heartbeat strong at 140 bpm. Fundal height measures 24cm, consistent with gestational age.",
      recommendations: "Continue prenatal vitamins. Schedule next appointment in 4 weeks. Monitor blood pressure.",
      tests: [
        { name: "Blood Pressure", result: "120/80 mmHg", normal: "Normal" },
        { name: "Weight", result: "68 kg", normal: "Normal" },
        { name: "Fundal Height", result: "24 cm", normal: "Normal" },
        { name: "Fetal Heartbeat", result: "140 bpm", normal: "Normal" }
      ],
      image: "/images/1.png"
    },
    {
      id: 2,
      patient: "Sophia Rodriguez",
      patientId: 2,
      date: "2024-12-10",
      type: "Ultrasound",
      category: "Imaging",
      doctor: "Dr. Sarah Johnson",
      summary: "18-week anatomy scan performed. All major structures visualized and appear normal.",
      findings: "Fetal measurements consistent with 18 weeks gestation. Brain, heart, spine, and limbs all normal.",
      recommendations: "Continue routine prenatal care. Next ultrasound scheduled for 32 weeks.",
      tests: [
        { name: "Biparietal Diameter", result: "4.2 cm", normal: "Normal" },
        { name: "Head Circumference", result: "15.8 cm", normal: "Normal" },
        { name: "Abdominal Circumference", result: "13.2 cm", normal: "Normal" },
        { name: "Femur Length", result: "2.8 cm", normal: "Normal" }
      ],
      image: "/images/2.png"
    },
    {
      id: 3,
      patient: "Isabella Chen",
      patientId: 3,
      date: "2024-12-12",
      type: "Postpartum Check",
      category: "Postpartum Care",
      doctor: "Dr. Sarah Johnson",
      summary: "6-week postpartum checkup. Patient recovering well from vaginal delivery.",
      findings: "Uterus well-involuted. Episiotomy healing properly. No signs of infection.",
      recommendations: "Continue iron supplements. Can resume normal activities. Schedule annual checkup.",
      tests: [
        { name: "Blood Pressure", result: "118/78 mmHg", normal: "Normal" },
        { name: "Hemoglobin", result: "12.5 g/dL", normal: "Normal" },
        { name: "Uterine Size", result: "Normal", normal: "Normal" },
        { name: "Episiotomy", result: "Healing well", normal: "Normal" }
      ],
      image: "/images/3.png"
    },
    {
      id: 4,
      patient: "Mia Johnson",
      patientId: 4,
      date: "2024-12-14",
      type: "Emergency Consultation",
      category: "Emergency",
      doctor: "Dr. Sarah Johnson",
      summary: "Emergency consultation for preeclampsia symptoms. Patient at 32 weeks gestation.",
      findings: "Blood pressure elevated at 160/100 mmHg. Proteinuria present. Fetal monitoring shows normal activity.",
      recommendations: "Immediate hospitalization for monitoring. Bed rest and antihypertensive medication.",
      tests: [
        { name: "Blood Pressure", result: "160/100 mmHg", normal: "Elevated" },
        { name: "Proteinuria", result: "2+", normal: "Abnormal" },
        { name: "Fetal Heartbeat", result: "145 bpm", normal: "Normal" },
        { name: "Liver Function", result: "Normal", normal: "Normal" }
      ],
      image: "/images/4.png"
    },
    {
      id: 5,
      patient: "Ava Thompson",
      patientId: 5,
      date: "2024-12-08",
      type: "Prenatal Checkup",
      category: "Pregnancy Care",
      doctor: "Dr. Sarah Johnson",
      summary: "20-week prenatal checkup. Patient reports feeling well with normal pregnancy symptoms.",
      findings: "All vital signs normal. Fetal movements felt regularly. Fundal height appropriate for dates.",
      recommendations: "Continue prenatal vitamins and healthy diet. Schedule anatomy scan.",
      tests: [
        { name: "Blood Pressure", result: "122/82 mmHg", normal: "Normal" },
        { name: "Weight", result: "65 kg", normal: "Normal" },
        { name: "Fundal Height", result: "20 cm", normal: "Normal" },
        { name: "Fetal Heartbeat", result: "142 bpm", normal: "Normal" }
      ],
      image: "/images/5.png"
    }
  ];

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = record.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || record.category === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
  };

  const handleCloseModal = () => {
    setSelectedRecord(null);
  };

  const handleDownloadRecord = (record) => {
    console.log('Downloading record:', record.id);
    // In a real app, this would generate and download a PDF
  };

  const handleEditRecord = (record) => {
    console.log('Editing record:', record.id);
    // In a real app, this would open an edit form
  };

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
                  placeholder="Search records by patient name, type, or category..."
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
                  <option value="all">All Categories</option>
                  <option value="Pregnancy Care">Pregnancy Care</option>
                  <option value="Imaging">Imaging</option>
                  <option value="Postpartum Care">Postpartum Care</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <button className="new-record-btn">
                <FiPlus />
                <span>New Record</span>
              </button>
            </div>
          </div>

          {/* Records Grid */}
          <div className="doctor-dashboard__section">
            <div className="medical-records-grid">
              {filteredRecords.map(record => (
                <div key={record.id} className="medical-record-card">
                  <div className="record-header">
                    <div className="patient-info">
                      <div className="patient-avatar">
                        <img src={record.image} alt={record.patient} />
                      </div>
                      <div className="patient-details">
                        <h3>{record.patient}</h3>
                        <p className="record-type">{record.type}</p>
                        <p className="record-category">{record.category}</p>
                      </div>
                    </div>
                    <div className="record-meta">
                      <span className="record-date">
                        <FiCalendar className="meta-icon" />
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                      <span className="record-doctor">
                        <FiUser className="meta-icon" />
                        {record.doctor}
                      </span>
                    </div>
                  </div>

                  <div className="record-summary">
                    <p>{record.summary}</p>
                  </div>

                  <div className="record-tests">
                    <h4><FiActivity className="test-icon" /> Key Tests</h4>
                    <div className="test-list">
                      {record.tests.slice(0, 3).map((test, index) => (
                        <div key={index} className="test-item">
                          <span className="test-name">{test.name}</span>
                          <span className={`test-result ${test.normal === 'Normal' ? 'normal' : 'abnormal'}`}>
                            {test.result}
                          </span>
                        </div>
                      ))}
                      {record.tests.length > 3 && (
                        <span className="more-tests">+{record.tests.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div className="record-actions">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => handleViewRecord(record)}
                    >
                      <FiEye />
                      View Details
                    </button>
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleEditRecord(record)}
                    >
                      <FiEdit3 />
                      Edit
                    </button>
                    <button 
                      className="action-btn download-btn"
                      onClick={() => handleDownloadRecord(record)}
                    >
                      <FiDownload />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredRecords.length === 0 && (
              <div className="no-records">
                <div className="no-records-icon">
                  <FiFileText />
                </div>
                <h3>No medical records found</h3>
                <p>Try adjusting your search criteria or create a new record.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="record-modal-overlay" onClick={handleCloseModal}>
          <div className="record-modal" onClick={(e) => e.stopPropagation()}>
            <div className="record-modal__header">
              <h2><FiFileText className="modal-icon" /> Medical Record Details</h2>
              <button className="close-btn" onClick={handleCloseModal}>
                <FiX />
              </button>
            </div>
            
            <div className="record-modal__content">
              <div className="record-detail-section">
                <h3><FiUser className="section-icon" /> Patient Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Patient Name:</label>
                    <span>{selectedRecord.patient}</span>
                  </div>
                  <div className="detail-item">
                    <label>Record Type:</label>
                    <span>{selectedRecord.type}</span>
                  </div>
                  <div className="detail-item">
                    <label>Category:</label>
                    <span>{selectedRecord.category}</span>
                  </div>
                  <div className="detail-item">
                    <label>Date:</label>
                    <span>{new Date(selectedRecord.date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Doctor:</label>
                    <span>{selectedRecord.doctor}</span>
                  </div>
                </div>
              </div>

              <div className="record-detail-section">
                <h3><FiClipboard className="section-icon" /> Summary</h3>
                <p>{selectedRecord.summary}</p>
              </div>

              <div className="record-detail-section">
                <h3><FiActivity className="section-icon" /> Findings</h3>
                <p>{selectedRecord.findings}</p>
              </div>

              <div className="record-detail-section">
                <h3><FiFileText className="section-icon" /> Recommendations</h3>
                <p>{selectedRecord.recommendations}</p>
              </div>

              <div className="record-detail-section">
                <h3><FiActivity className="section-icon" /> All Tests</h3>
                <div className="test-detail-list">
                  {selectedRecord.tests.map((test, index) => (
                    <div key={index} className="test-detail-item">
                      <div className="test-detail-header">
                        <span className="test-name">{test.name}</span>
                        <span className={`test-result ${test.normal === 'Normal' ? 'normal' : 'abnormal'}`}>
                          {test.result}
                        </span>
                      </div>
                      <span className="test-status">{test.normal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="record-modal__actions">
              <button className="btn btn-outline" onClick={handleCloseModal}>
                <FiX />
                Close
              </button>
              <button className="btn btn-primary" onClick={() => handleEditRecord(selectedRecord)}>
                <FiEdit3 />
                Edit Record
              </button>
              <button className="btn btn-primary" onClick={() => handleDownloadRecord(selectedRecord)}>
                <FiDownload />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
