import React, { useState } from 'react';
import { Calendar, Upload, Download, Eye, FileText, Activity, Stethoscope, X } from 'lucide-react';
import './MedicalReports.css';

const MedicalReports = () => {
  const [activeTab, setActiveTab] = useState('All Reports');
  const [selectedReport, setSelectedReport] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [testDate, setTestDate] = useState('');
  const [doctorLab, setDoctorLab] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const tabs = ['All Reports', 'Blood Tests', 'Ultrasounds', 'X-Rays', 'Other'];

  const reports = [
    {
      id: 1,
      type: 'BLOOD TEST',
      title: 'Complete Blood Count (CBC)',
      date: 'June 5, 2025',
      time: '10:30 AM',
      doctor: 'Dr. Sarah Johnson',
      department: 'Obstetrics & Gynecology',
      findings: 'Hemoglobin levels normal. Iron levels slightly low. Recommended iron supplements.',
      status: 'NEW',
      statusColor: 'badge-new'
    },
    {
      id: 2,
      type: 'ULTRASOUND',
      title: '20-Week Anatomy Scan',
      date: 'May 28, 2025',
      time: '2:15 PM',
      doctor: 'Dr. Michael Chen',
      department: 'Radiology Department',
      findings: 'Baby development is normal. Estimated weight: 340g. All major organs visible and developing well.',
      status: 'REVIEWED',
      statusColor: 'badge-reviewed'
    },
    {
      id: 3,
      type: 'LAB RESULTS',
      title: 'Glucose Tolerance Test',
      date: 'May 20, 2025',
      time: '8:00 AM',
      doctor: 'Dr. Sarah Johnson',
      department: 'Obstetrics & Gynecology',
      findings: 'Glucose levels within normal range. No signs of gestational diabetes.',
      status: 'REVIEWED',
      statusColor: 'badge-reviewed'
    }
  ];

  const getIconForType = (type) => {
    switch (type) {
      case 'BLOOD TEST':
        return <Activity className="w-4 h-4" />;
      case 'ULTRASOUND':
        return <Stethoscope className="w-4 h-4" />;
      case 'LAB RESULTS':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleUpload = () => {
    // Reset form
    setSelectedReport('');
    setReportTitle('');
    setTestDate('');
    setDoctorLab('');
    setAdditionalNotes('');
  };

  return (
    <div className="medical-reports-container">
      <div className="medical-reports-content">
        {/* Header */}
        <div className="header">
          <h1 className="header-title">Medical Reports</h1>
          <p className="header-description">View and manage all your medical records and test results</p>
        </div>

        <div className="main-grid">
          {/* Left Column - Reports List */}
          <div>
            {/* Navigation Tabs */}
            <div className="tabs-container">
              <div className="tabs-border">
                <nav className="tabs-nav">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`tab-button ${
                        activeTab === tab ? 'active' : 'inactive'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Reports List */}
            <div className="reports-list">
              {reports.map((report) => (
                <div key={report.id} className="report-card">
                  <div className="report-header">
                    <div className="report-badges">
                      <span className="badge badge-type">
                        {getIconForType(report.type)}
                        <span>{report.type}</span>
                      </span>
                      <span className={`badge ${report.statusColor}`}>
                        {report.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="report-title">{report.title}</h3>
                  
                  <div className="report-details">
                    <p><strong>Date:</strong> {report.date} | <strong>Time:</strong> {report.time}</p>
                    <p><strong>{report.doctor}</strong></p>
                    <p>{report.department}</p>
                  </div>

                  <div className="report-findings">
                    <p><strong>Key Findings:</strong> {report.findings}</p>
                  </div>

                  <div className="report-actions">
                    <button className="btn btn-primary">
                      <Eye className="w-4 h-4" />
                      <span>{report.type === 'ULTRASOUND' ? 'View Images' : 'View Report'}</span>
                    </button>
                    <button className="btn btn-secondary">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Upload External Reports */}
          <div>
            <div className="upload-section">
              <h2 className="upload-title">Upload External Reports</h2>
              
              <div className="upload-note">
                <p>
                  <strong>Note:</strong> Upload your external medical reports here for doctor reference during consultations. Please categorize reports accurately for better organization.
                </p>
              </div>

              <div>
                <div className="form-group">
                  <label className="form-label">
                    Report Type <span className="required">*</span>
                  </label>
                  <select 
                    value={selectedReport}
                    onChange={(e) => setSelectedReport(e.target.value)}
                    className="form-select"
                  >
                    <option value="" disabled hidden>Select report type</option>
                    <option value="blood-test">Blood Test</option>
                    <option value="ultrasound">Ultrasound</option>
                    <option value="xray">X-Ray</option>
                    <option value="mri">MRI</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Report Title <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="e.g., Blood Test Results"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Date of Test/Report <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    External Doctor/Lab (Optional)
                  </label>
                  <input
                    type="text"
                    value={doctorLab}
                    onChange={(e) => setDoctorLab(e.target.value)}
                    placeholder="Doctor name or Lab name"
                    className="form-input"
                  />
                </div>

                {/* Upload File Section */}
                <div className="form-group">
                  <label className="form-label">
                    Upload File <span className="required">*</span>
                  </label>
                  <div className="upload-area">
                    <Upload className="upload-icon" />
                    <p className="upload-text">Click to upload file</p>
                    <p className="upload-subtext">Supported: PDF, JPG, PNG (Max 10MB)</p>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Any additional information about this report..."
                    rows="3"
                    className="form-textarea"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleUpload}
                  className="btn-upload"
                >
                  Upload Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalReports;