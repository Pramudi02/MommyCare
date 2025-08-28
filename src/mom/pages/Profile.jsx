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
      <div className="profile-container">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button 
          className="back-button"
          onClick={() => navigate('/mom')}
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1 className="profile-title">
          <User size={24} />
          Edit Profile
        </h1>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      <div className="profile-form">
        {/* Personal Information Section */}
        <div className="form-section">
          <h2 className="section-title">
            <User size={20} />
            Personal Information
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input
                type="tel"
                id="phone"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age *</label>
              <input
                type="number"
                id="age"
                value={profile.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                placeholder="Enter age"
                min="13"
                max="100"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bloodGroup">Blood Group *</label>
              <select
                id="bloodGroup"
                value={profile.bloodGroup}
                onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
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
        <div className="form-section">
          <h2 className="section-title">
            <Heart size={20} />
            Physical Measurements
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="height">Height *</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  id="height"
                  value={profile.height.value}
                  onChange={(e) => handleInputChange('height.value', parseFloat(e.target.value))}
                  placeholder="Enter height"
                  min="100"
                  max="250"
                  required
                />
                <select
                  value={profile.height.unit}
                  onChange={(e) => handleInputChange('height.unit', e.target.value)}
                >
                  <option value="cm">cm</option>
                  <option value="ft">ft</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="weight">Weight *</label>
              <div className="input-with-unit">
                <input
                  type="number"
                  id="weight"
                  value={profile.weight.value}
                  onChange={(e) => handleInputChange('weight.value', parseFloat(e.target.value))}
                  placeholder="Enter weight"
                  min="30"
                  max="200"
                  required
                />
                <select
                  value={profile.weight.unit}
                  onChange={(e) => handleInputChange('weight.unit', e.target.value)}
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="currentBMI">Current BMI *</label>
              <input
                type="number"
                id="currentBMI"
                value={profile.currentBMI}
                onChange={(e) => handleInputChange('currentBMI', parseFloat(e.target.value))}
                placeholder="Enter BMI"
                min="15"
                max="50"
                step="0.1"
                required
              />
            </div>
          </div>
        </div>

        {/* Medical Information Section */}
        <div className="form-section">
          <h2 className="section-title">
            <Calendar size={20} />
            Medical Information
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="lmp">Last Menstrual Period (LMP) *</label>
              <input
                type="date"
                id="lmp"
                value={formatDateForInput(profile.lmp)}
                onChange={(e) => handleInputChange('lmp', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edd">Expected Due Date (EDD) *</label>
              <input
                type="date"
                id="edd"
                value={formatDateForInput(profile.edd)}
                onChange={(e) => handleInputChange('edd', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="nextClinicDate">Next Clinic Date *</label>
              <input
                type="date"
                id="nextClinicDate"
                value={formatDateForInput(profile.nextClinicDate)}
                onChange={(e) => handleInputChange('nextClinicDate', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="consultantObstetrician">Consultant Obstetrician *</label>
              <input
                type="text"
                id="consultantObstetrician"
                value={profile.consultantObstetrician}
                onChange={(e) => handleInputChange('consultantObstetrician', e.target.value)}
                placeholder="Enter consultant name"
                required
              />
            </div>
          </div>
        </div>

        {/* Location Information Section */}
        <div className="form-section">
          <h2 className="section-title">
            <MapPin size={20} />
            Location Information
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="mohArea">MOH Area *</label>
              <input
                type="text"
                id="mohArea"
                value={profile.mohArea}
                onChange={(e) => handleInputChange('mohArea', e.target.value)}
                placeholder="Enter MOH area"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phmArea">PHM Area *</label>
              <input
                type="text"
                id="phmArea"
                value={profile.phmArea}
                onChange={(e) => handleInputChange('phmArea', e.target.value)}
                placeholder="Enter PHM area"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fieldClinic">Field Clinic *</label>
              <input
                type="text"
                id="fieldClinic"
                value={profile.fieldClinic}
                onChange={(e) => handleInputChange('fieldClinic', e.target.value)}
                placeholder="Enter field clinic"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="gramaNiladhariDivision">Grama Niladhari Division *</label>
              <input
                type="text"
                id="gramaNiladhariDivision"
                value={profile.gramaNiladhariDivision}
                onChange={(e) => handleInputChange('gramaNiladhariDivision', e.target.value)}
                placeholder="Enter GN division"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="hospitalClinic">Hospital Clinic *</label>
              <input
                type="text"
                id="hospitalClinic"
                value={profile.hospitalClinic}
                onChange={(e) => handleInputChange('hospitalClinic', e.target.value)}
                placeholder="Enter hospital clinic"
                required
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="form-section">
          <h2 className="section-title">
            <Phone size={20} />
            Emergency Contact
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="emergencyName">Emergency Contact Name</label>
              <input
                type="text"
                id="emergencyName"
                value={profile.emergencyContact.name}
                onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                placeholder="Enter emergency contact name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="emergencyPhone">Emergency Contact Phone</label>
              <input
                type="tel"
                id="emergencyPhone"
                value={profile.emergencyContact.phone}
                onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                placeholder="Enter emergency contact phone"
              />
            </div>

            <div className="form-group">
              <label htmlFor="emergencyRelationship">Relationship</label>
              <input
                type="text"
                id="emergencyRelationship"
                value={profile.emergencyContact.relationship}
                onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                placeholder="Enter relationship"
              />
            </div>
          </div>
        </div>

        {/* Current Pregnancy Section */}
        <div className="form-section">
          <h2 className="section-title">
            <Stethoscope size={20} />
            Current Pregnancy
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="pregnancyWeek">Pregnancy Week</label>
              <input
                type="number"
                id="pregnancyWeek"
                value={profile.currentPregnancy.week}
                onChange={(e) => handleInputChange('currentPregnancy.week', parseInt(e.target.value))}
                placeholder="Enter pregnancy week"
                min="1"
                max="42"
              />
            </div>

            <div className="form-group">
              <label htmlFor="trimester">Trimester</label>
              <select
                id="trimester"
                value={profile.currentPregnancy.trimester}
                onChange={(e) => handleInputChange('currentPregnancy.trimester', parseInt(e.target.value))}
              >
                <option value="">Select trimester</option>
                {trimesters.map(trimester => (
                  <option key={trimester} value={trimester}>{trimester}</option>
                ))}
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
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
        <div className="form-section">
          <h2 className="section-title">
            <Heart size={20} />
            Medical History
          </h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="previousPregnancies">Previous Pregnancies</label>
              <input
                type="number"
                id="previousPregnancies"
                value={profile.medicalHistory.previousPregnancies}
                onChange={(e) => handleArrayFieldChange('medicalHistory', 'previousPregnancies', parseInt(e.target.value))}
                placeholder="Number of previous pregnancies"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="form-actions">
          <button
            type="button"
            className="save-button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="loading-spinner-small"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 