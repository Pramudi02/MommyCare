import React, { useState } from 'react';
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
        { name: "Fetal Heartbeat", result: "150 bpm", normal: "Normal" }
      ],
      image: "/images/5.png"
    }
  ];

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = record.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || record.category.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
  };

  const closeRecordDetails = () => {
    setSelectedRecord(null);
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'pregnancy care': return '#10b981';
      case 'imaging': return '#3b82f6';
      case 'postpartum care': return '#8b5cf6';
      case 'emergency': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTestStatus = (result, normal) => {
    if (normal.toLowerCase() === 'normal') return 'normal';
    if (normal.toLowerCase() === 'abnormal') return 'abnormal';
    if (normal.toLowerCase() === 'elevated') return 'elevated';
    return 'normal';
  };

  return (
    <div className="medical-records-page">
      <div className="medical-records-header">
        <div className="medical-records-header__left">
          <h1>Medical Records</h1>
          <p>Access and manage patient medical records and test results</p>
        </div>
        <button className="new-record-btn">
          <span>📋</span>
          New Record
        </button>
      </div>

      {/* Search and Filters */}
      <div className="medical-records-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search records by patient, type, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="filters">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="pregnancy care">Pregnancy Care</option>
            <option value="imaging">Imaging</option>
            <option value="postpartum care">Postpartum Care</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
      </div>

      {/* Medical Records Grid */}
      <div className="medical-records-grid">
        {filteredRecords.map(record => (
          <div key={record.id} className="medical-record-card" onClick={() => handleRecordClick(record)}>
            <div className="medical-record-card__header">
              <img src={record.image} alt={record.patient} className="patient-avatar" />
              <div className="record-category" style={{ backgroundColor: getCategoryColor(record.category) }}>
                {record.category}
              </div>
            </div>
            
            <div className="medical-record-card__body">
              <h3>{record.patient}</h3>
              <p className="record-type">{record.type}</p>
              <p className="record-date">{record.date}</p>
              <p className="record-doctor">Dr. {record.doctor.split(' ').pop()}</p>
              <p className="record-summary">{record.summary}</p>
            </div>
            
            <div className="medical-record-card__footer">
              <button className="view-btn">View Details</button>
              <button className="download-btn">Download</button>
            </div>
          </div>
        ))}
      </div>

      {/* Medical Record Details Modal */}
      {selectedRecord && (
        <div className="medical-record-modal-overlay" onClick={closeRecordDetails}>
          <div className="medical-record-modal" onClick={(e) => e.stopPropagation()}>
            <div className="medical-record-modal__header">
              <h2>Medical Record Details</h2>
              <button className="close-btn" onClick={closeRecordDetails}>✕</button>
            </div>
            
            <div className="medical-record-modal__content">
              <div className="patient-info-section">
                <img src={selectedRecord.image} alt={selectedRecord.patient} />
                <div>
                  <h3>{selectedRecord.patient}</h3>
                  <p className="record-type">{selectedRecord.type}</p>
                  <p className="record-date">{selectedRecord.date}</p>
                  <p className="record-doctor">{selectedRecord.doctor}</p>
                </div>
              </div>

              <div className="record-details-section">
                <h3>Summary</h3>
                <p>{selectedRecord.summary}</p>
              </div>

              <div className="record-details-section">
                <h3>Clinical Findings</h3>
                <p>{selectedRecord.findings}</p>
              </div>

              <div className="record-details-section">
                <h3>Recommendations</h3>
                <p>{selectedRecord.recommendations}</p>
              </div>

              <div className="tests-section">
                <h3>Test Results</h3>
                <div className="tests-grid">
                  {selectedRecord.tests.map((test, index) => (
                    <div key={index} className={`test-item ${getTestStatus(test.result, test.normal)}`}>
                      <div className="test-name">{test.name}</div>
                      <div className="test-result">{test.result}</div>
                      <div className="test-status">{test.normal}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="medical-record-modal__actions">
              <button className="btn btn-primary">Edit Record</button>
              <button className="btn btn-secondary">Print Record</button>
              <button className="btn btn-outline">Share with Patient</button>
              <button className="btn btn-danger">Delete Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
