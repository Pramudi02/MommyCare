import React, { useState } from 'react';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';
import './MedicalRecords.css';

const MedicalRecords = () => {
  const [selectedMom, setSelectedMom] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const moms = [
    {
      id: 1,
      name: 'Emma Wilson',
      age: 28,
      dueDate: '2024-03-15',
      pregnancyWeek: 32,
      bloodType: 'A+',
      height: '165 cm',
      prePregnancyWeight: '65 kg',
      currentWeight: '78 kg',
    },
    {
      id: 2,
      name: 'Sarah Davis',
      age: 31,
      dueDate: '2024-04-02',
      pregnancyWeek: 28,
      bloodType: 'O+',
      height: '170 cm',
      prePregnancyWeight: '68 kg',
      currentWeight: '75 kg',
    },
    {
      id: 3,
      name: 'Maria Garcia',
      age: 25,
      dueDate: '2024-02-28',
      pregnancyWeek: 38,
      bloodType: 'B+',
      height: '162 cm',
      prePregnancyWeight: '62 kg',
      currentWeight: '80 kg',
    },
  ];

  const [records, setRecords] = useState({
    1: {
      overview: {
        allergies: 'None',
        chronicConditions: 'None',
        medications: 'Prenatal vitamins',
        familyHistory: 'Mother had gestational diabetes',
        lifestyle: 'Non-smoker, occasional alcohol before pregnancy',
      },
      vitals: [
        { date: '2024-02-20', weight: 78, bloodPressure: '120/80', temperature: 36.8 },
        { date: '2024-02-13', weight: 77, bloodPressure: '118/78', temperature: 36.9 },
        { date: '2024-02-06', weight: 76, bloodPressure: '122/82', temperature: 36.7 },
      ],
      medications: [
        { name: 'Prenatal Vitamins', dosage: '1 tablet daily', startDate: '2024-01-01', status: 'Active' },
      ],
    },
  });

  const handleMomSelect = (mom) => {
    setSelectedMom(mom);
    setActiveTab('overview');
    setIsEditing(false);
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const updateOverviewField = (field, value) => {
    if (!selectedMom) return;
    setRecords((prev) => ({
      ...prev,
      [selectedMom.id]: {
        ...prev[selectedMom.id],
        overview: {
          ...((prev[selectedMom.id] && prev[selectedMom.id].overview) || {}),
          [field]: value,
        },
      },
    }));
  };

  const updateVitalsRow = (idx, field, value) => {
    if (!selectedMom) return;
    setRecords((prev) => {
      const prevVitals = (prev[selectedMom.id]?.vitals || []).slice();
      prevVitals[idx] = { ...prevVitals[idx], [field]: value };
      return { ...prev, [selectedMom.id]: { ...prev[selectedMom.id], vitals: prevVitals } };
    });
  };

  return (
    <div className="medical-records-page">
      <div className="medical-records-header">
        <div className="medical-records-title">
          <h1>Medical Records Management</h1>
          <p>Comprehensive patient medical history and pregnancy records</p>
        </div>
      </div>

      <div className="medical-records-content">
        {/* Moms Selection */}
        <div className="moms-selection">
          <h3>Select Patient</h3>
          <div className="moms-grid">
            {moms.map((mom) => (
              <div
                key={mom.id}
                className={`mom-card ${selectedMom?.id === mom.id ? 'active' : ''}`}
                onClick={() => handleMomSelect(mom)}
              >
                <div className="mom-avatar">{mom.name.charAt(0)}</div>
                <div className="mom-info">
                  <h4>{mom.name}</h4>
                  <p>Week {mom.pregnancyWeek} • Due: {formatDate(mom.dueDate)}</p>
                  <p>Blood Type: {mom.bloodType}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Records Display */}
        {selectedMom ? (
          <div className="records-display">
            <div className="records-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>{selectedMom.name}'s Medical Records</h2>
                <div className="patient-summary">
                  <span>Age: {selectedMom.age}</span>
                  <span>Blood Type: {selectedMom.bloodType}</span>
                  <span>Height: {selectedMom.height}</span>
                  <span>Current Weight: {selectedMom.currentWeight}</span>
                </div>
              </div>
              <div>
                {!isEditing ? (
                  <button className="action-btn primary" onClick={() => setIsEditing(true)}><FiEdit2 /> Edit</button>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="action-btn primary" onClick={() => setIsEditing(false)}><FiSave /> Save</button>
                    <button className="action-btn secondary" onClick={() => setIsEditing(false)}><FiX /> Cancel</button>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="records-tabs">
              <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                Overview
              </button>
              <button className={`tab-btn ${activeTab === 'pregnancy' ? 'active' : ''}`} onClick={() => setActiveTab('pregnancy')}>
                Pregnancy History
              </button>
              <button className={`tab-btn ${activeTab === 'vitals' ? 'active' : ''}`} onClick={() => setActiveTab('vitals')}>
                Vitals
              </button>
              <button className={`tab-btn ${activeTab === 'medications' ? 'active' : ''}`} onClick={() => setActiveTab('medications')}>
                Medications
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'overview' && (
                <div className="overview-content">
                  <div className="overview-grid">
                    {['allergies', 'chronicConditions', 'medications', 'familyHistory', 'lifestyle'].map((field) => (
                      <div key={field} className="overview-card">
                        <h4>{
                          field === 'chronicConditions' ? 'Chronic Conditions' :
                          field.charAt(0).toUpperCase() + field.slice(1)
                        }</h4>
                        {isEditing ? (
                          <textarea
                            className="form-input"
                            rows="3"
                            value={(records[selectedMom.id]?.overview?.[field]) || ''}
                            onChange={(e) => updateOverviewField(field, e.target.value)}
                          />
                        ) : (
                          <p>{records[selectedMom.id]?.overview?.[field] || 'None recorded'}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'pregnancy' && (
                <div className="pregnancy-content">
                  <div className="pregnancy-timeline">
                    {(records[selectedMom.id]?.pregnancyHistory || []).map((record, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-date">{formatDate(record.date)}</div>
                        <div className="timeline-content">
                          <h4>{record.type}</h4>
                          <div className="findings">
                            <strong>Findings:</strong>
                            <p>{record.findings}</p>
                          </div>
                          <div className="recommendations">
                            <strong>Recommendations:</strong>
                            <p>{record.recommendations}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'vitals' && (
                <div className="vitals-content">
                  <div className="vitals-chart">
                    <h4>Recorded Vitals</h4>
                    <div className="weight-chart">
                      {(records[selectedMom.id]?.vitals || []).map((vital, index) => (
                        <div key={index} className="vital-point">
                          {isEditing ? (
                            <>
                              <div className="vital-date" style={{ minWidth: 110 }}>{formatDate(vital.date)}</div>
                              <input className="form-input" style={{ width: 90 }} value={vital.weight} onChange={(e) => updateVitalsRow(index, 'weight', e.target.value)} />
                              <input className="form-input" style={{ width: 110 }} value={vital.bloodPressure} onChange={(e) => updateVitalsRow(index, 'bloodPressure', e.target.value)} />
                              <input className="form-input" style={{ width: 80 }} value={vital.temperature} onChange={(e) => updateVitalsRow(index, 'temperature', e.target.value)} />
                            </>
                          ) : (
                            <>
                              <div className="vital-date">{formatDate(vital.date)}</div>
                              <div className="vital-weight">{vital.weight} kg</div>
                              <div className="vital-bp">BP: {vital.bloodPressure}</div>
                              <div className="vital-temp">Temp: {vital.temperature}°C</div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'medications' && (
                <div className="medications-content">
                  <div className="medications-list">
                    {(records[selectedMom.id]?.medications || []).map((med, index) => (
                      <div key={index} className="medication-item">
                        <div className="med-info">
                          <h4>{med.name}</h4>
                          <p>Dosage: {med.dosage}</p>
                          <p>Started: {formatDate(med.startDate)}</p>
                        </div>
                        <div className={`med-status ${med.status.toLowerCase()}`}>
                          {med.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="no-selection">
            <div className="no-selection-icon">👩‍⚕️</div>
            <h3>Select a Patient</h3>
            <p>Choose a patient from the list above to view their medical records.</p>
          </div>
        )}
      </div>

      {/* Add Record Modal (unchanged) */}
      {showAddRecord && (
        <div className="modal-overlay" onClick={() => setShowAddRecord(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Medical Record</h2>
              <button className="close-btn" onClick={() => setShowAddRecord(false)}>✕</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Record Type</label>
                <select className="form-input">
                  <option value="">Select type...</option>
                  <option value="prenatal">Prenatal Checkup</option>
                  <option value="ultrasound">Ultrasound</option>
                  <option value="blood-test">Blood Test</option>
                  <option value="vitals">Vitals Check</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" className="form-input" />
              </div>
              <div className="form-group">
                <label>Findings</label>
                <textarea className="form-input" rows="4" placeholder="Enter medical findings..."></textarea>
              </div>
              <div className="form-group">
                <label>Recommendations</label>
                <textarea className="form-input" rows="3" placeholder="Enter recommendations..."></textarea>
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn secondary" onClick={() => setShowAddRecord(false)}>Cancel</button>
              <button className="modal-btn primary">Add Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
