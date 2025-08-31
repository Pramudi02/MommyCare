import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, User, Phone, Calendar, Heart, MapPin, Stethoscope, AlertCircle, CheckCircle } from 'lucide-react';
import { momProfileAPI } from '../../services/api';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    age: '',
    bloodGroup: '',
    height: { value: '', unit: 'cm' },
    weight: { value: '', unit: 'kg' },
    currentBMI: '',
    lmp: '',
    edd: '',
    consultantObstetrician: '',
    mohArea: '',
    phmArea: '',
    fieldClinic: '',
    gramaNiladhariDivision: '',
    hospitalClinic: '',
    nextClinicDate: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    medicalHistory: {
      allergies: [],
      chronicConditions: [],
      previousPregnancies: 0,
      complications: []
    },
    currentPregnancy: {
      week: '',
      trimester: '',
      isHighRisk: false,
      riskFactors: []
    }
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const trimesters = [1, 2, 3];

  useEffect(() => {
    console.log('Profile component mounted');
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile...');
      setLoading(true);
      const response = await momProfileAPI.getProfile();
      console.log('Profile response:', response);
      if (response.data) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data. You can still fill out the form.' });
      // Don't block the form if API fails
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayFieldChange = (parentField, field, value) => {
    setProfile(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      // Validate required fields
      const requiredFields = [
        'name', 'phone', 'age', 'bloodGroup', 
        'height.value', 'weight.value', 'currentBMI',
        'lmp', 'edd', 'consultantObstetrician',
        'mohArea', 'phmArea', 'fieldClinic',
        'gramaNiladhariDivision', 'hospitalClinic', 'nextClinicDate'
      ];

      const missingFields = requiredFields.filter(field => {
        const value = field.includes('.') 
          ? field.split('.').reduce((obj, key) => obj?.[key], profile)
          : profile[field];
        return !value;
      });

      if (missingFields.length > 0) {
        setMessage({ 
          type: 'error', 
          text: `Please fill in all required fields: ${missingFields.join(', ')}` 
        });
        return;
      }

      console.log('Saving profile:', profile);
      const response = await momProfileAPI.saveProfile(profile);
      
      if (response.status === 'success') {
        setMessage({ type: 'success', text: 'Profile saved successfully!' });
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to save profile' 
      });
    } finally {
      setSaving(false);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  console.log('Profile component rendering, loading:', loading);

  if (loading) {
    return (
      <div className="mom-profile-container">
        <div className="mom-profile-loading">
          <div className="mom-loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mom-profile-page">
      {message.text && (
        <div className={`mom-message ${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      <div className="mom-profile-content">
        <div className="mom-profile-main">
        {/* Personal Information Section */}
          <div className="mom-profile-section">
            <div className="mom-section-header">
              <h3>
                <User className="mom-section-icon" />
            Personal Information
              </h3>
            </div>
            <div className="mom-info-grid">
              <div className="mom-info-item">
                <label className="mom-info-label">Name *</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                  className="mom-input"
                required
              />
            </div>

              <div className="mom-info-item">
                <label className="mom-info-label">Phone *</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                  className="mom-input"
                required
              />
            </div>

              <div className="mom-info-item">
                <label className="mom-info-label">Age *</label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                placeholder="Enter age"
                min="13"
                max="100"
                  className="mom-input"
                required
              />
            </div>

              <div className="mom-info-item">
                <label className="mom-info-label">Blood Group *</label>
              <select
                value={profile.bloodGroup}
                onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                  className="mom-select"
                required
              >
                <option value="">Select blood group</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Physical Measurements Section */}
          <div className="mom-profile-section">
            <div className="mom-section-header">
              <h3>
                <Heart className="mom-section-icon" />
            Physical Measurements
              </h3>
            </div>
            <div className="mom-info-grid">
              <div className="mom-info-item">
                <label className="mom-info-label">Height *</label>
                <div className="mom-input-with-unit">
                <input
                  type="number"
                  value={profile.height.value}
                  onChange={(e) => handleInputChange('height.value', parseFloat(e.target.value))}
                  placeholder="Enter height"
                  min="100"
                  max="250"
                    className="mom-input"
                  required
                />
                <select
                  value={profile.height.unit}
                  onChange={(e) => handleInputChange('height.unit', e.target.value)}
                    className="mom-select-unit"
                >
                  <option value="cm">cm</option>
                  <option value="ft">ft</option>
                </select>
              </div>
            </div>

              <div className="mom-info-item">
                <label className="mom-info-label">Weight *</label>
                <div className="mom-input-with-unit">
                <input
                  type="number"
                  value={profile.weight.value}
                  onChange={(e) => handleInputChange('weight.value', parseFloat(e.target.value))}
                  placeholder="Enter weight"
                  min="30"
                  max="200"
                    className="mom-input"
                  required
                />
                <select
                  value={profile.weight.unit}
                  onChange={(e) => handleInputChange('weight.unit', e.target.value)}
                    className="mom-select-unit"
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>

              <div className="mom-info-item">
                <label className="mom-info-label">Current BMI *</label>
              <input
                type="number"
                value={profile.currentBMI}
                onChange={(e) => handleInputChange('currentBMI', parseFloat(e.target.value))}
                placeholder="Enter BMI"
                min="15"
                max="50"
                step="0.1"
                  className="mom-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Medical Information Section */}
          <div className="mom-profile-section">
            <div className="mom-section-header">
              <h3>
                <Calendar className="mom-section-icon" />
            Medical Information
              </h3>
            </div>
            <div className="mom-info-grid">
              <div className="mom-info-item">
                <label className="mom-info-label">Last Menstrual Period (LMP) *</label>
              <input
                type="date"
                value={formatDateForInput(profile.lmp)}
                onChange={(e) => handleInputChange('lmp', e.target.value)}
                  className="mom-input"
                required
              />
            </div>

              <div className="mom-info-item">
                <label className="mom-info-label">Expected Due Date (EDD) *</label>
              <input
                type="date"
                value={formatDateForInput(profile.edd)}
                onChange={(e) => handleInputChange('edd', e.target.value)}
                  className="mom-input"
                required
              />
            </div>

              <div className="mom-info-item">
                <label className="mom-info-label">Next Clinic Date *</label>
              <input
                type="date"
                value={formatDateForInput(profile.nextClinicDate)}
                onChange={(e) => handleInputChange('nextClinicDate', e.target.value)}
                  className="mom-input"
                required
              />
            </div>

              <div className="mom-info-item">
                <label className="mom-info-label">Consultant Obstetrician *</label>
              <input
                type="text"
                value={profile.consultantObstetrician}
                onChange={(e) => handleInputChange('consultantObstetrician', e.target.value)}
                placeholder="Enter consultant name"
                  className="mom-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Location Information Section */}
          <div className="mom-profile-section">
            <div className="mom-section-header">
              <h3>
                <MapPin className="mom-section-icon" />
            Location Information
              </h3>
            </div>
            <div className="mom-info-grid">
              <div className="mom-info-item">
                <label className="mom-info-label">MOH Area *</label>
              <input
                type="text"
                value={profile.mohArea}
                onChange={(e) => handleInputChange('mohArea', e.target.value)}
                placeholder="Enter MOH area"
                  className="mom-input"
                required
              />
            </div>

              <div className="mom-info-item">
                <label className="mom-info-label">PHM Area *</label>
              <input
                type="text"
                value={profile.phmArea}
                onChange={(e) => handleInputChange('phmArea', e.target.value)}
                placeholder="Enter PHM area"
                  className="mom-input"
                required
              />
            </div>

              <div className="mom-info-item">
                <label className="mom-info-label">Field Clinic *</label>
              <input
                type="text"
                value={profile.fieldClinic}
                onChange={(e) => handleInputChange('fieldClinic', e.target.value)}
                placeholder="Enter field clinic"
                  className="mom-input"
                required
              />
            </div>

              <div className="mom-info-item">
                <label className="mom-info-label">Grama Niladhari Division *</label>
              <input
                type="text"
                value={profile.gramaNiladhariDivision}
                onChange={(e) => handleInputChange('gramaNiladhariDivision', e.target.value)}
                placeholder="Enter GN division"
                  className="mom-input"
                required
              />
            </div>

              <div className="mom-info-item">
                <label className="mom-info-label">Hospital Clinic *</label>
              <input
                type="text"
                value={profile.hospitalClinic}
                onChange={(e) => handleInputChange('hospitalClinic', e.target.value)}
                placeholder="Enter hospital clinic"
                  className="mom-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact Section */}
          <div className="mom-profile-section">
            <div className="mom-section-header">
              <h3>
                <Phone className="mom-section-icon" />
            Emergency Contact
              </h3>
            </div>
            <div className="mom-info-grid">
              <div className="mom-info-item">
                <label className="mom-info-label">Emergency Contact Name</label>
              <input
                type="text"
                value={profile.emergencyContact.name}
                onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                placeholder="Enter emergency contact name"
                  className="mom-input"
              />
            </div>

              <div className="mom-info-item">
                <label className="mom-info-label">Emergency Contact Phone</label>
              <input
                type="tel"
                value={profile.emergencyContact.phone}
                onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                placeholder="Enter emergency contact phone"
                  className="mom-input"
              />
            </div>

              <div className="mom-info-item">
                <label className="mom-info-label">Relationship</label>
              <input
                type="text"
                value={profile.emergencyContact.relationship}
                onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                placeholder="Enter relationship"
                  className="mom-input"
              />
            </div>
          </div>
        </div>

        {/* Current Pregnancy Section */}
          <div className="mom-profile-section">
            <div className="mom-section-header">
              <h3>
                <Stethoscope className="mom-section-icon" />
            Current Pregnancy
              </h3>
            </div>
            <div className="mom-info-grid">
              <div className="mom-info-item">
                <label className="mom-info-label">Pregnancy Week</label>
              <input
                type="number"
                value={profile.currentPregnancy.week}
                onChange={(e) => handleInputChange('currentPregnancy.week', parseInt(e.target.value))}
                placeholder="Enter pregnancy week"
                min="1"
                max="42"
                  className="mom-input"
              />
            </div>

              <div className="mom-info-item">
                <label className="mom-info-label">Trimester</label>
              <select
                value={profile.currentPregnancy.trimester}
                onChange={(e) => handleInputChange('currentPregnancy.trimester', parseInt(e.target.value))}
                  className="mom-select"
              >
                <option value="">Select trimester</option>
                {trimesters.map(trimester => (
                  <option key={trimester} value={trimester}>{trimester}</option>
                ))}
              </select>
            </div>

              <div className="mom-info-item mom-checkbox-group">
                <label className="mom-checkbox-label">
                <input
                  type="checkbox"
                  checked={profile.currentPregnancy.isHighRisk}
                  onChange={(e) => handleInputChange('currentPregnancy.isHighRisk', e.target.checked)}
                />
                High Risk Pregnancy
              </label>
            </div>
          </div>
        </div>

        {/* Medical History Section */}
          <div className="mom-profile-section">
            <div className="mom-section-header">
              <h3>
                <Heart className="mom-section-icon" />
            Medical History
              </h3>
            </div>
            <div className="mom-info-grid">
              <div className="mom-info-item">
                <label className="mom-info-label">Previous Pregnancies</label>
              <input
                type="number"
                value={profile.medicalHistory.previousPregnancies}
                onChange={(e) => handleArrayFieldChange('medicalHistory', 'previousPregnancies', parseInt(e.target.value))}
                placeholder="Number of previous pregnancies"
                min="0"
                  className="mom-input"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
          <div className="mom-form-actions">
          <button
            type="button"
              className="mom-btn mom-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                  <div className="mom-loading-spinner-small"></div>
                Saving...
              </>
            ) : (
              <>
                  <Save className="mom-btn-icon" />
                Save Profile
              </>
            )}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 