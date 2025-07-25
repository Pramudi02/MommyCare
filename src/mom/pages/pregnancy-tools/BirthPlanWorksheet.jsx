import React, { useState } from 'react';
import { FileText, CheckCircle, Edit3, Save, Download } from 'lucide-react';
import './BirthPlanWorksheet.css';

const BirthPlanWorksheet = () => {
  const [birthPlan, setBirthPlan] = useState({
    laborPreferences: '',
    painManagement: '',
    deliveryPreferences: '',
    postpartumPreferences: '',
    specialRequests: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field, value) => {
    setBirthPlan(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to localStorage or backend
    console.log('Birth plan saved:', birthPlan);
  };

  const handleDownload = () => {
    // Create a downloadable version of the birth plan
    const content = `
Birth Plan Worksheet

Labor Preferences:
${birthPlan.laborPreferences}

Pain Management:
${birthPlan.painManagement}

Delivery Preferences:
${birthPlan.deliveryPreferences}

Postpartum Preferences:
${birthPlan.postpartumPreferences}

Special Requests:
${birthPlan.specialRequests}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'birth-plan.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bp-worksheet-wrapper">
      <div className="bp-worksheet-container">
        <header className="bp-main-header">
          <div className="bp-header-icon">📋</div>
          <h1>Birth Plan Worksheet</h1>
          <p>Create and customize your birth plan with our interactive worksheet to ensure your preferences are communicated clearly</p>
        </header>

        <div className="bp-content-grid">
          <div className="bp-worksheet-main">
            <div className="bp-section-title">
              <span className="bp-title-icon">📝</span>
              <h2>Your Birth Plan</h2>
            </div>

            <div className="bp-control-buttons">
              <button 
                className={`bp-control-btn ${isEditing ? 'active' : ''}`}
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit3 size={16} />
                {isEditing ? 'Cancel' : 'Edit Plan'}
              </button>
              
              {isEditing && (
                <button className="bp-control-btn bp-save-button" onClick={handleSave}>
                  <Save size={16} />
                  Save Plan
                </button>
              )}
              
              <button className="bp-control-btn bp-download-button" onClick={handleDownload}>
                <Download size={16} />
                Download Plan
              </button>
            </div>

            <div className="bp-form-sections">
              <div className="bp-form-group">
                <h3>Labor Preferences</h3>
                <textarea
                  className="bp-form-textarea"
                  placeholder="Describe your preferences for labor environment, positions, and support..."
                  value={birthPlan.laborPreferences}
                  onChange={(e) => handleInputChange('laborPreferences', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="bp-form-group">
                <h3>Pain Management</h3>
                <textarea
                  className="bp-form-textarea"
                  placeholder="What pain management options would you prefer? (epidural, natural methods, etc.)"
                  value={birthPlan.painManagement}
                  onChange={(e) => handleInputChange('painManagement', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="bp-form-group">
                <h3>Delivery Preferences</h3>
                <textarea
                  className="bp-form-textarea"
                  placeholder="Any specific preferences for the delivery process..."
                  value={birthPlan.deliveryPreferences}
                  onChange={(e) => handleInputChange('deliveryPreferences', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="bp-form-group">
                <h3>Postpartum Preferences</h3>
                <textarea
                  className="bp-form-textarea"
                  placeholder="Your preferences for immediate postpartum care..."
                  value={birthPlan.postpartumPreferences}
                  onChange={(e) => handleInputChange('postpartumPreferences', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="bp-form-group">
                <h3>Special Requests</h3>
                <textarea
                  className="bp-form-textarea"
                  placeholder="Any special requests or considerations..."
                  value={birthPlan.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div className="bp-sidebar-section">
            <div className="bp-tips-panel">
              <h3>Birth Plan Tips</h3>
              <ul className="bp-tips-listing">
                <li>Keep your plan flexible - birth can be unpredictable</li>
                <li>Discuss your plan with your healthcare provider</li>
                <li>Include your partner's role and preferences</li>
                <li>Consider what's most important to you</li>
                <li>Be specific but realistic about your expectations</li>
              </ul>
            </div>

            <div className="bp-checklist-panel">
              <h3>Birth Plan Checklist</h3>
              <div className="bp-checklist-items">
                <label className="bp-checklist-option">
                  <input type="checkbox" />
                  <span>Discuss with healthcare provider</span>
                </label>
                <label className="bp-checklist-option">
                  <input type="checkbox" />
                  <span>Share with birth partner</span>
                </label>
                <label className="bp-checklist-option">
                  <input type="checkbox" />
                  <span>Pack multiple copies</span>
                </label>
                <label className="bp-checklist-option">
                  <input type="checkbox" />
                  <span>Review and update regularly</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthPlanWorksheet;