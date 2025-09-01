import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiFileText, FiDownload, FiExternalLink } from 'react-icons/fi';
import { doctorAPI } from '../../services/api';
import './MedicalRecords.css';

const ViewMedicalRecords = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await doctorAPI.getMedicalRecordsByPatient(patientId);
        if (res.status === 'success') setReports(res.data);
      } catch (e) {
        console.error('Failed to load reports', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [patientId]);

  const handleDownload = async (report) => {
    // For now, generate a simple JSON download; can be replaced with server-side PDF
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-report-${report._id}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
              <h1>View Medical Records</h1>
              <p>Mom-submitted and doctor-submitted records</p>
            </div>
          </div>

          <div className="doctor-dashboard__section" style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="back-btn" onClick={() => navigate('/doctor/medical-records')}>
              <FiArrowLeft /> Back
            </button>
            <button className="new-record-btn" onClick={() => navigate(`/doctor/prescriptions`)}>
              <FiExternalLink /> Go to Prescriptions
            </button>
          </div>

          <div className="doctor-dashboard__section">
            {loading ? (
              <div className="no-records">
                <div className="no-records-icon"><FiFileText /></div>
                <h3>Loading...</h3>
              </div>
            ) : reports.length === 0 ? (
              <div className="no-records">
                <div className="no-records-icon"><FiFileText /></div>
                <h3>No records found</h3>
                <p>This patient does not have any records yet.</p>
              </div>
            ) : (
              <div className="medical-records-grid">
                {reports.map((r) => (
                  <div key={r._id} className="medical-record-card">
                    <div className="record-header">
                      <div className="patient-info">
                        <div className="patient-details">
                          <h3>{r.title || r.diagnosis?.condition || 'Medical Report'}</h3>
                          <p className="record-type">{new Date(r.createdAt).toLocaleString()}</p>
                          <p className="record-category">Doctor-submitted</p>
                        </div>
                      </div>
                    </div>
                    <div className="record-summary">
                      <p>{r.visitDetails?.reasonForVisit || r.notesRecommendations?.advice || r.description || '—'}</p>
                    </div>
                    <div className="record-actions">
                      <button className="action-btn download-btn" onClick={() => handleDownload(r)}>
                        <FiDownload /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMedicalRecords;


