import React, { useState } from 'react';
import { FiPhone, FiAlertTriangle, FiClipboard, FiBell } from 'react-icons/fi';
import './Emergency.css';

const Emergency = () => {
  const [activeTab, setActiveTab] = useState('alerts');
  const [emergencyType, setEmergencyType] = useState('all');

  const incomingAlerts = [
    { id: 1, momName: 'Maria Garcia', phone: '(555) 987-6543', priority: 'Critical', time: '14:30', note: 'Severe bleeding, feeling dizzy', location: 'Home' },
    { id: 2, momName: 'Sarah Davis', phone: '(555) 234-5678', priority: 'High', time: '15:45', note: 'Strong contractions, 2 minutes apart', location: 'Clinic B' },
  ];

  const emergencyProtocols = [
    { id: 1, title: 'Maternal Hemorrhage', type: 'critical', description: 'Emergency protocol for managing postpartum hemorrhage', steps: ['Call emergency services immediately', 'Assess vital signs and bleeding', 'Apply direct pressure to bleeding site', 'Administer IV fluids if available', 'Prepare for emergency transport'], icon: <FiAlertTriangle />, priority: 'High' },
    { id: 2, title: 'Eclampsia', type: 'critical', description: 'Emergency management of eclampsia and severe preeclampsia', steps: ['Ensure patient safety and airway', 'Administer magnesium sulfate', 'Monitor blood pressure and seizures', 'Prepare for emergency delivery', 'Coordinate with hospital team'], icon: <FiAlertTriangle />, priority: 'High' },
    { id: 3, title: 'Shoulder Dystocia', type: 'delivery', description: 'Emergency management of shoulder dystocia during delivery', steps: ['Stop pushing immediately', 'Apply McRoberts maneuver', 'Attempt suprapubic pressure', 'Consider episiotomy if needed', 'Prepare for emergency procedures'], icon: <FiAlertTriangle />, priority: 'High' },
  ];

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911', type: 'emergency' },
    { name: 'Hospital Emergency', number: '(555) 123-4567', type: 'hospital' },
    { name: 'OB/GYN On-Call', number: '(555) 234-5678', type: 'doctor' },
    { name: 'Ambulance Service', number: '(555) 345-6789', type: 'ambulance' },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#ef4444';
      case 'High': return '#f59e0b';
      case 'Medium': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'critical': return '#ef4444';
      case 'delivery': return '#f59e0b';
      case 'monitoring': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="emergency-page">
      <div className="emergency-header">
        <div className="emergency-header-icon">
          <FiAlertTriangle className="w-6 h-6" />
        </div>
        <div className="emergency-title">
          <h1>Emergency Management</h1>
          <p>Incoming alerts from moms and critical protocols</p>
        </div>
        <div className="emergency-status">
          <div className="status-indicator active">
            <span className="status-dot"></span>
            <span>Emergency System Active</span>
          </div>
        </div>
      </div>

      <div className="emergency-content">
        <div className="emergency-tabs">
          <button className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`} onClick={() => setActiveTab('alerts')}><FiBell /> Alerts</button>
          <button className={`tab-btn ${activeTab === 'protocols' ? 'active' : ''}`} onClick={() => setActiveTab('protocols')}><FiClipboard /> Protocols</button>
          <button className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => setActiveTab('contacts')}><FiPhone /> Contacts</button>
        </div>

        <div className="tab-content">
          {activeTab === 'alerts' && (
            <div>
              <div className="active-emergencies-alert">
                <div className="alert-header">
                  <h3>Incoming Emergency Alerts</h3>
                  <span className="emergency-count">{incomingAlerts.length}</span>
                </div>
                <div className="emergency-list">
                  {incomingAlerts.map((e) => (
                    <div key={e.id} className="emergency-item">
                      <div className="emergency-info">
                        <div className="patient-name">{e.momName}</div>
                        <div className="emergency-type">{e.location}</div>
                        <div className="emergency-location">{e.note}</div>
                      </div>
                      <div className="emergency-status-info">
                        <div className="status-badge">{e.time}</div>
                        <div className="priority-badge" style={{ backgroundColor: getPriorityColor(e.priority) }}>{e.priority}</div>
                      </div>
                      <a className="respond-btn" href={`tel:${e.phone.replace(/[^+\d]/g, '')}`}><FiPhone /> Call {e.phone}</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'protocols' && (
            <div className="protocols-content">
              <div className="protocols-header">
                <h2>Emergency Protocols</h2>
                <div className="filter-controls">
                  <select value={emergencyType} onChange={(e) => setEmergencyType(e.target.value)} className="type-filter">
                    <option value="all">All Types</option>
                    <option value="critical">Critical</option>
                    <option value="delivery">Delivery</option>
                    <option value="monitoring">Monitoring</option>
                  </select>
                </div>
              </div>
              <div className="protocols-grid">
                {emergencyProtocols
                  .filter(p => emergencyType === 'all' || p.type === emergencyType)
                  .map((protocol) => (
                    <div key={protocol.id} className="protocol-card">
                      <div className="protocol-header">
                        <div className="protocol-icon">{protocol.icon}</div>
                        <div className="protocol-meta">
                          <div className="type-badge" style={{ backgroundColor: getTypeColor(protocol.type) }}>{protocol.type}</div>
                          <div className="priority-badge" style={{ backgroundColor: getPriorityColor(protocol.priority) }}>{protocol.priority}</div>
                        </div>
                      </div>
                      <div className="protocol-content">
                        <h3 className="protocol-title">{protocol.title}</h3>
                        <p className="protocol-description">{protocol.description}</p>
                        <div className="protocol-steps">
                          <h4>Emergency Steps:</h4>
                          <ol>
                            {protocol.steps.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                      <div className="protocol-actions">
                        <button className="action-btn primary">View Full Protocol</button>
                        <button className="action-btn secondary">Print</button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="contacts-content">
              <div className="contacts-header">
                <h2>Emergency Contacts</h2>
                <button className="add-contact-btn">Add Contact</button>
              </div>
              <div className="contacts-grid">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="contact-card">
                    <div className="contact-icon"><FiPhone /></div>
                    <div className="contact-info">
                      <h3 className="contact-name">{contact.name}</h3>
                      <div className="contact-number">{contact.number}</div>
                    </div>
                    <div className="contact-actions">
                      <a className="call-btn" href={`tel:${contact.number.replace(/[^+\d]/g, '')}`}>Call</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="quick-actions">
        <div className="actions-header"><h3>Quick Emergency Actions</h3></div>
        <div className="actions-grid">
          <a className="quick-action-btn emergency" href="tel:911"><FiPhone /><span>Call 911</span></a>
          <a className="quick-action-btn" href="tel:(555)123-4567"><FiPhone /><span>Hospital Emergency</span></a>
          <a className="quick-action-btn" href="tel:(555)234-5678"><FiPhone /><span>OB/GYN On-Call</span></a>
          <a className="quick-action-btn" href="tel:(555)345-6789"><FiPhone /><span>Ambulance</span></a>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
