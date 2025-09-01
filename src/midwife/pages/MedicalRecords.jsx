import React, { useState, useEffect } from 'react';
import { FiEdit2, FiSave, FiX, FiPlus, FiEdit } from 'react-icons/fi';
import { midwifeAPI } from '../../services/api';
import './MedicalRecords.css';

const MedicalRecords = () => {
  const [moms, setMoms] = useState([]);
  const [selectedMom, setSelectedMom] = useState(null);
  const [activeTab, setActiveTab] = useState('mom-overview');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Medical records data
  const [medicalRecord, setMedicalRecord] = useState(null);
  const [editingData, setEditingData] = useState({});

  // Load moms assigned to this midwife
  const fetchMoms = async (search = '') => {
    try {
      setLoading(true);
      setError('');
      const response = await midwifeAPI.getMomProfiles(search);
      if (response.status === 'success') {
        setMoms(response.data);
      } else {
        setError('Failed to fetch moms');
      }
    } catch (err) {
      console.error('Error fetching moms:', err);
      setError('Failed to fetch moms');
    } finally {
      setLoading(false);
    }
  };

  // Load medical records for selected mom
  const fetchMedicalRecords = async (momId) => {
    try {
      setLoading(true);
      const response = await midwifeAPI.getMedicalRecords(momId);
      if (response.status === 'success') {
        setMedicalRecord(response.data.record || {});
        setEditingData({});
      }
    } catch (err) {
      console.error('Error fetching medical records:', err);
      setError('Failed to fetch medical records');
    } finally {
      setLoading(false);
    }
  };



  // Save overview data
  const saveOverview = async () => {
    if (!selectedMom) return;

    try {
      setLoading(true);
      const response = await midwifeAPI.updateOverview(selectedMom._id, editingData);
      if (response.status === 'success') {
        setSelectedMom(response.data);
        setEditingData({});
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error saving overview:', err);
      setError('Failed to save overview data');
    } finally {
      setLoading(false);
    }
  };

  // Save pre-pregnancy data
  const savePrePregnancy = async () => {
    if (!selectedMom) return;

    try {
      setLoading(true);
      const response = await midwifeAPI.updatePrePregnancy(selectedMom._id, editingData);
      if (response.status === 'success') {
        setMedicalRecord(response.data);
        setEditingData({});
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error saving pre-pregnancy data:', err);
      setError('Failed to save pre-pregnancy data');
    } finally {
      setLoading(false);
    }
  };

  // Handle mom selection
  const handleMomSelect = (mom) => {
    setSelectedMom(mom);
    setActiveTab('mom-overview');
    setIsEditing(false);
    setEditingData({});
    fetchMedicalRecords(mom._id);
  };

  // Handle field changes
  const handleFieldChange = (field, value) => {
    setEditingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle save based on active tab
  const handleSave = () => {
    if (activeTab === 'mom-overview') {
      saveOverview();
    } else if (activeTab === 'mom-general') {
      savePrePregnancy();
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsEditing(false);
    setEditingData({});
  };

  // Load moms on component mount
  useEffect(() => {
    fetchMoms();
  }, []);

  // Search moms when query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMoms(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="medical-records-page">
      <div className="medical-records-container">
        <div className="medical-records-content">
          <div className="medical-records-header">
        <div className="medical-records-header-icon">
          <FiEdit2 className="w-6 h-6" />
        </div>
        <div className="medical-records-title">
            <h1>Medical Records</h1>
            <p>Manage and track patient medical history and pregnancy records</p>
        </div>
      </div>

        <div className="medical-records-filters">
            <div className="medical-records-search">
            <input
              type="text"
                placeholder="Search patients..."
              className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>

          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

        <div className="medical-records-main-content">
        {/* Moms Selection */}
        <div className="moms-selection">
          <h3>Select Patient</h3>
            {loading ? (
                <div className="loading">Loading moms...</div>
              ) : (
                <div className="moms-list">
                  {moms.length === 0 ? (
                    <div className="no-moms">
                      <p>No patients assigned yet.</p>
              </div>
            ) : (
                    moms.map((mom) => (
                <div
                        key={mom._id}
                        className={`mom-card ${selectedMom?._id === mom._id ? 'active' : ''}`}
                  onClick={() => handleMomSelect(mom)}
                >
                        <div className="mom-avatar">{mom.name?.charAt(0) || 'M'}</div>
                  <div className="mom-info">
                          <h4>{mom.name || 'Unknown'}</h4>
                          <p>Age: {mom.age || 'N/A'} • Phone: {mom.phone || 'N/A'}</p>
                          <p>PHM Area: {mom.phmArea || 'N/A'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
              )}
        </div>

        {/* Medical Records Display */}
        {selectedMom ? (
          <div className="records-display">
                <div className="records-header">
              <div>
                    <h2>{selectedMom.name || 'Unknown'}'s Medical Records</h2>
                <div className="patient-summary">
                      <span>Age: {selectedMom.age || 'N/A'}</span>
                      <span>Blood Type: {selectedMom.bloodGroup || 'N/A'}</span>
                      <span>Height: {selectedMom.height ? `${selectedMom.height.value} ${selectedMom.height.unit}` : 'N/A'}</span>
                      <span>Weight: {selectedMom.weight ? `${selectedMom.weight.value} ${selectedMom.weight.unit}` : 'N/A'}</span>
                </div>
              </div>
              <div>
                {!isEditing ? (
                      <button className="action-btn primary" onClick={() => setIsEditing(true)}>
                        <FiEdit2 /> Edit
                      </button>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                        <button className="action-btn primary" onClick={handleSave} disabled={loading}>
                          <FiSave /> Save
                        </button>
                        <button className="action-btn secondary" onClick={handleCancel}>
                          <FiX /> Cancel
                        </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="records-tabs">
              <div className="tab-group">
                <button 
                  className={`tab-btn ${activeTab.startsWith('mom') ? 'active' : ''}`}
                  onClick={() => setActiveTab('mom-overview')}
                >
                  Mom
                </button>
                <button 
                  className={`tab-btn ${activeTab.startsWith('baby') ? 'active' : ''}`}
                  onClick={() => setActiveTab('baby-care')}
                >
                  Baby
                </button>
              </div>

              {/* Mom Sub-tabs */}
              {activeTab.startsWith('mom') && (
                <div className="sub-tabs">
                  <button 
                    className={`sub-tab ${activeTab === 'mom-overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mom-overview')}
                  >
                Overview
              </button>
                  <button 
                    className={`sub-tab ${activeTab === 'mom-general' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mom-general')}
                  >
                Pre-pregnancy Data
                  </button>
                </div>
              )}
            </div>

            <div className="tab-content">
              {/* Mom Overview Tab */}
              {activeTab === 'mom-overview' && (
                <div className="overview-content">
                  <div className="overview-header">
                    <h3>Overview</h3>
                  </div>
                  <div className="overview-grid">
                    <div className="overview-field">
                      <label>Name</label>
                      <input 
                        type="text" 
                        className="overview-input" 
                            value={editingData.name !== undefined ? editingData.name : (selectedMom.name || '')} 
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="overview-field">
                      <label>Age</label>
                      <input 
                        type="number" 
                        className="overview-input" 
                            value={editingData.age !== undefined ? editingData.age : (selectedMom.age || '')} 
                            onChange={(e) => handleFieldChange('age', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="overview-field">
                      <label>Phone</label>
                      <input 
                        type="tel" 
                        className="overview-input" 
                            value={editingData.phone !== undefined ? editingData.phone : (selectedMom.phone || '')} 
                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="overview-field">
                      <label>Blood Group</label>
                      <input 
                        type="text" 
                        className="overview-input" 
                            value={editingData.bloodGroup !== undefined ? editingData.bloodGroup : (selectedMom.bloodGroup || '')} 
                            onChange={(e) => handleFieldChange('bloodGroup', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="overview-field">
                          <label>Height (cm)</label>
                      <input 
                            type="number" 
                        className="overview-input" 
                            value={editingData.height !== undefined ? editingData.height : (selectedMom.height?.value || '')} 
                            onChange={(e) => handleFieldChange('height', { value: e.target.value, unit: 'cm' })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="overview-field">
                          <label>Weight (kg)</label>
                      <input 
                            type="number" 
                        className="overview-input" 
                            value={editingData.weight !== undefined ? editingData.weight : (selectedMom.weight?.value || '')} 
                            onChange={(e) => handleFieldChange('weight', { value: e.target.value, unit: 'kg' })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="overview-field">
                      <label>Current BMI</label>
                      <input 
                        type="number" 
                        className="overview-input" 
                            value={editingData.currentBMI !== undefined ? editingData.currentBMI : (selectedMom.currentBMI || '')} 
                            onChange={(e) => handleFieldChange('currentBMI', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="overview-field">
                      <label>MOH Area</label>
                      <input 
                        type="text" 
                        className="overview-input" 
                            value={editingData.mohArea !== undefined ? editingData.mohArea : (selectedMom.mohArea || '')} 
                            onChange={(e) => handleFieldChange('mohArea', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="overview-field">
                      <label>PHM Area</label>
                      <input 
                        type="text" 
                        className="overview-input" 
                            value={editingData.phmArea !== undefined ? editingData.phmArea : (selectedMom.phmArea || '')} 
                            onChange={(e) => handleFieldChange('phmArea', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="overview-field">
                      <label>Field Clinic</label>
                      <input 
                        type="text" 
                        className="overview-input" 
                            value={editingData.fieldClinic !== undefined ? editingData.fieldClinic : (selectedMom.fieldClinic || '')} 
                            onChange={(e) => handleFieldChange('fieldClinic', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="overview-field">
                          <label>Grama Niladhari Division</label>
                          <input 
                            type="text" 
                            className="overview-input" 
                            value={editingData.gramaNiladhariDivision !== undefined ? editingData.gramaNiladhariDivision : (selectedMom.gramaNiladhariDivision || '')} 
                            onChange={(e) => handleFieldChange('gramaNiladhariDivision', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="overview-field">
                      <label>Hospital Clinic</label>
                      <input 
                        type="text" 
                        className="overview-input" 
                            value={editingData.hospitalClinic !== undefined ? editingData.hospitalClinic : (selectedMom.hospitalClinic || '')} 
                            onChange={(e) => handleFieldChange('hospitalClinic', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="overview-field">
                      <label>Consultant Obstetrician</label>
                      <input 
                        type="text" 
                        className="overview-input" 
                            value={editingData.consultantObstetrician !== undefined ? editingData.consultantObstetrician : (selectedMom.consultantObstetrician || '')} 
                            onChange={(e) => handleFieldChange('consultantObstetrician', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="overview-field">
                          <label>Next Clinic Date</label>
                          <input 
                            type="date" 
                            className="overview-input" 
                            value={editingData.nextClinicDate !== undefined ? editingData.nextClinicDate : (selectedMom.nextClinicDate ? new Date(selectedMom.nextClinicDate).toISOString().split('T')[0] : '')} 
                            onChange={(e) => handleFieldChange('nextClinicDate', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Mom Pre-pregnancy Data Tab */}
              {activeTab === 'mom-general' && (
                <div className="general-content">
                  <div className="general-header">
                    <h3>Pre-pregnancy Data</h3>
                  </div>
                  <div className="general-grid">
                    <div className="general-field">
                      <label>LMP (Last Menstrual Period)</label>
                      <input 
                        type="date" 
                        className="general-input" 
                            value={editingData.lmp !== undefined ? editingData.lmp : (medicalRecord?.prePregnancy?.lmp ? new Date(medicalRecord.prePregnancy.lmp).toISOString().split('T')[0] : '')} 
                            onChange={(e) => handleFieldChange('lmp', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="general-field">
                      <label>Date of Quickening</label>
                      <input 
                        type="date" 
                        className="general-input" 
                            value={editingData.quickening !== undefined ? editingData.quickening : (medicalRecord?.prePregnancy?.quickening ? new Date(medicalRecord.prePregnancy.quickening).toISOString().split('T')[0] : '')} 
                            onChange={(e) => handleFieldChange('quickening', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="general-field">
                      <label>Period of Amenorrhea at Registration</label>
                      <input 
                        type="text" 
                        className="general-input" 
                            value={editingData.amenorrheaAtRegistration !== undefined ? editingData.amenorrheaAtRegistration : (medicalRecord?.prePregnancy?.amenorrheaAtRegistration || '')} 
                            onChange={(e) => handleFieldChange('amenorrheaAtRegistration', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="general-field">
                      <label>Age of Youngest Child</label>
                      <input 
                        type="number" 
                        className="general-input" 
                            value={editingData.ageOfYoungestChild !== undefined ? editingData.ageOfYoungestChild : (medicalRecord?.prePregnancy?.ageOfYoungestChild || '')} 
                            onChange={(e) => handleFieldChange('ageOfYoungestChild', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="checklist-section">
                    <div className="checklist-grid">
                      <div className="checklist-item">
                        <label>Consanguinity</label>
                        <select 
                          className="checklist-input" 
                              value={editingData.consanguinity !== undefined ? (editingData.consanguinity ? 'yes' : 'no') : (medicalRecord?.prePregnancy?.consanguinity ? 'yes' : 'no')} 
                              onChange={(e) => handleFieldChange('consanguinity', e.target.value === 'yes')}
                          disabled={!isEditing}
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      <div className="checklist-item">
                        <label>Rubella Immunization</label>
                        <select 
                          className="checklist-input" 
                              value={editingData.rubellaImmunization !== undefined ? (editingData.rubellaImmunization ? 'yes' : 'no') : (medicalRecord?.prePregnancy?.rubellaImmunization ? 'yes' : 'no')} 
                              onChange={(e) => handleFieldChange('rubellaImmunization', e.target.value === 'yes')}
                          disabled={!isEditing}
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      <div className="checklist-item">
                        <label>Pre-pregnancy Screening Done</label>
                        <select 
                          className="checklist-input" 
                              value={editingData.prePregnancyScreening !== undefined ? (editingData.prePregnancyScreening ? 'yes' : 'no') : (medicalRecord?.prePregnancy?.prePregnancyScreening ? 'yes' : 'no')} 
                              onChange={(e) => handleFieldChange('prePregnancyScreening', e.target.value === 'yes')}
                          disabled={!isEditing}
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      <div className="checklist-item">
                        <label>Preconceptional Folic Acid</label>
                        <select 
                          className="checklist-input" 
                              value={editingData.preconceptionalFolicAcid !== undefined ? (editingData.preconceptionalFolicAcid ? 'yes' : 'no') : (medicalRecord?.prePregnancy?.preconceptionalFolicAcid ? 'yes' : 'no')} 
                              onChange={(e) => handleFieldChange('preconceptionalFolicAcid', e.target.value === 'yes')}
                          disabled={!isEditing}
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      <div className="checklist-item">
                        <label>History of Subfertility</label>
                        <select 
                          className="checklist-input" 
                              value={editingData.historyOfSubfertility !== undefined ? (editingData.historyOfSubfertility ? 'yes' : 'no') : (medicalRecord?.prePregnancy?.historyOfSubfertility ? 'yes' : 'no')} 
                              onChange={(e) => handleFieldChange('historyOfSubfertility', e.target.value === 'yes')}
                          disabled={!isEditing}
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      <div className="checklist-item">
                        <label>Planning Pregnancy</label>
                        <select 
                          className="checklist-input" 
                              value={editingData.planningPregnancy !== undefined ? (editingData.planningPregnancy ? 'yes' : 'no') : (medicalRecord?.prePregnancy?.planningPregnancy ? 'yes' : 'no')} 
                              onChange={(e) => handleFieldChange('planningPregnancy', e.target.value === 'yes')}
                          disabled={!isEditing}
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      <div className="checklist-item">
                        <label>Family Planning Method Last Used</label>
                        <select 
                          className="checklist-input" 
                              value={editingData.familyPlanningLastUsed !== undefined ? editingData.familyPlanningLastUsed : (medicalRecord?.prePregnancy?.familyPlanningLastUsed || '')} 
                              onChange={(e) => handleFieldChange('familyPlanningLastUsed', e.target.value)}
                          disabled={!isEditing}
                        >
                          <option value="">Select method...</option>
                          <option value="T">T</option>
                          <option value="L">L</option>
                          <option value="IP">IP</option>
                          <option value="N">N</option>
                          <option value="V">V</option>
                          <option value="C">C</option>
                        </select>
                      </div>
                    </div>
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
            </div>
            </div>

      
    </div>
  );
};

export default MedicalRecords;
