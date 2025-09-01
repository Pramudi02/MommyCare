import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiTrash2, FiSave, FiEdit3 } from 'react-icons/fi';
import { doctorAPI } from '../../services/api';
import './MedicalRecords.css';

const SubmitMedicalRecord = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [existing, setExisting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    patientInformation: { fullName: '', age: '', gender: '', contactDetails: '', idNumber: '' },
    doctorInformation: { name: '', specialization: '', hospitalClinic: '' },
    visitDetails: { visitDate: '', reasonForVisit: '', symptoms: '' },
    examination: { vitalSigns: { bloodPressure: '', pulse: '', temperature: '' }, physicalFindings: '' },
    diagnosis: { condition: '', severity: '' },
    treatmentPlan: { medications: [], nonDrugTreatments: [] },
    labResults: { tests: [] },
    notesRecommendations: { advice: '', lifestyle: '', dietary: '' },
    followUp: { nextAppointmentDate: '', monitoringRequirements: '' },
    additionalFields: []
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await doctorAPI.getMedicalRecordsByPatient(patientId);
        if (res.status === 'success') setExisting(res.data);
      } catch (e) {
        console.error('Failed to load existing reports', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [patientId]);

  const update = (path, value) => {
    setForm(prev => {
      const next = { ...prev };
      let target = next;
      const keys = path.split('.');
      for (let i = 0; i < keys.length - 1; i++) {
        target[keys[i]] = { ...target[keys[i]] };
        target = target[keys[i]];
      }
      target[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const addAdditionalField = () => {
    setForm(prev => ({ ...prev, additionalFields: [...prev.additionalFields, { label: '', value: '' }] }));
  };
  const updateAdditionalField = (idx, key, value) => {
    setForm(prev => ({
      ...prev,
      additionalFields: prev.additionalFields.map((f, i) => i === idx ? { ...f, [key]: value } : f)
    }));
  };
  const removeAdditionalField = (idx) => {
    setForm(prev => ({ ...prev, additionalFields: prev.additionalFields.filter((_, i) => i !== idx) }));
  };

  const addMedication = () => {
    setForm(prev => ({
      ...prev,
      treatmentPlan: { ...prev.treatmentPlan, medications: [...prev.treatmentPlan.medications, { name: '', dosage: '', duration: '' }] }
    }));
  };
  const updateMedication = (idx, key, value) => {
    setForm(prev => ({
      ...prev,
      treatmentPlan: {
        ...prev.treatmentPlan,
        medications: prev.treatmentPlan.medications.map((m, i) => i === idx ? { ...m, [key]: value } : m)
      }
    }));
  };
  const removeMedication = (idx) => {
    setForm(prev => ({
      ...prev,
      treatmentPlan: { ...prev.treatmentPlan, medications: prev.treatmentPlan.medications.filter((_, i) => i !== idx) }
    }));
  };

  const addTest = () => {
    setForm(prev => ({ ...prev, labResults: { ...prev.labResults, tests: [...prev.labResults.tests, { name: '', result: '', summary: '' }] } }));
  };
  const updateTest = (idx, key, value) => {
    setForm(prev => ({
      ...prev,
      labResults: { ...prev.labResults, tests: prev.labResults.tests.map((t, i) => i === idx ? { ...t, [key]: value } : t) }
    }));
  };
  const removeTest = (idx) => {
    setForm(prev => ({ ...prev, labResults: { ...prev.labResults, tests: prev.labResults.tests.filter((_, i) => i !== idx) } }));
  };

  const save = async () => {
    try {
      setSaving(true);
      const payload = { ...form };
      // Convert dates
      if (payload.visitDetails.visitDate) payload.visitDetails.visitDate = new Date(payload.visitDetails.visitDate);
      if (payload.followUp.nextAppointmentDate) payload.followUp.nextAppointmentDate = new Date(payload.followUp.nextAppointmentDate);
      const res = await doctorAPI.createMedicalRecord(patientId, payload);
      if (res.status === 'success') {
        const refreshed = await doctorAPI.getMedicalRecordsByPatient(patientId);
        if (refreshed.status === 'success') setExisting(refreshed.data);
      }
    } catch (e) {
      console.error('Failed to save report', e);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    try {
      await doctorAPI.deleteMedicalRecord(id);
      setExisting(prev => prev.filter(r => r._id !== id));
    } catch (e) {
      console.error('Failed to delete', e);
    }
  };

  return (
    <div className="doctor-dashboard-page">
      <div className="doctor-dashboard-container">
        <div className="doctor-dashboard">
          <div className="doctor-dashboard__header">
            <div className="doctor-dashboard__header-icon">
              <FiEdit3 />
            </div>
            <div className="doctor-dashboard__welcome">
              <h1>Submit Medical Record</h1>
              <p>Create or manage doctor-submitted records</p>
            </div>
          </div>

          <div className="doctor-dashboard__section" style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="back-btn" onClick={() => navigate('/doctor/medical-records')}>
              <FiArrowLeft /> Back
            </button>
          </div>

          {/* Existing Reports */}
          <div className="doctor-dashboard__section">
            <h2 style={{ margin: '0 0 0.75rem 0' }}>Existing Reports</h2>
            {loading ? (
              <div className="no-records"><h3>Loading...</h3></div>
            ) : existing.length === 0 ? (
              <div className="no-records"><h3>No existing reports</h3></div>
            ) : (
              <div className="medical-records-grid">
                {existing.map(r => (
                  <div key={r._id} className="medical-record-card">
                    <div className="record-header">
                      <div className="patient-info">
                        <div className="patient-details">
                          <h3>{r.title || r.diagnosis?.condition || 'Medical Report'}</h3>
                          <p className="record-type">{new Date(r.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="record-actions">
                      <button className="action-btn edit-btn" onClick={() => navigate(`/doctor/patient-details/${patientId}`)}>
                        <FiEdit3 /> View Patient
                      </button>
                      <button className="action-btn download-btn" onClick={() => del(r._id)}>
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* New Report Form */}
          <div className="doctor-dashboard__section">
            <h2 style={{ margin: '0 0 0.75rem 0' }}>New Report</h2>
            <div className="medical-records-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="medical-record-card">
                <div className="record-summary" style={{ display: 'grid', gap: '0.75rem' }}>
                  <input placeholder="Patient Full Name" value={form.patientInformation.fullName} onChange={(e)=>update('patientInformation.fullName', e.target.value)} />
                  <input placeholder="Age" value={form.patientInformation.age} onChange={(e)=>update('patientInformation.age', e.target.value)} />
                  <input placeholder="Gender" value={form.patientInformation.gender} onChange={(e)=>update('patientInformation.gender', e.target.value)} />
                  <input placeholder="Contact details / ID number" value={form.patientInformation.contactDetails} onChange={(e)=>update('patientInformation.contactDetails', e.target.value)} />
                  <input placeholder="Doctor name" value={form.doctorInformation.name} onChange={(e)=>update('doctorInformation.name', e.target.value)} />
                  <input placeholder="Specialization" value={form.doctorInformation.specialization} onChange={(e)=>update('doctorInformation.specialization', e.target.value)} />
                  <input placeholder="Hospital/Clinic details" value={form.doctorInformation.hospitalClinic} onChange={(e)=>update('doctorInformation.hospitalClinic', e.target.value)} />
                  <input type="date" placeholder="Date of visit" value={form.visitDetails.visitDate} onChange={(e)=>update('visitDetails.visitDate', e.target.value)} />
                  <input placeholder="Reason for visit" value={form.visitDetails.reasonForVisit} onChange={(e)=>update('visitDetails.reasonForVisit', e.target.value)} />
                  <textarea placeholder="Symptoms described by patient" value={form.visitDetails.symptoms} onChange={(e)=>update('visitDetails.symptoms', e.target.value)} />
                  <input placeholder="Blood pressure" value={form.examination.vitalSigns.bloodPressure} onChange={(e)=>update('examination.vitalSigns.bloodPressure', e.target.value)} />
                  <input placeholder="Pulse" value={form.examination.vitalSigns.pulse} onChange={(e)=>update('examination.vitalSigns.pulse', e.target.value)} />
                  <input placeholder="Temperature" value={form.examination.vitalSigns.temperature} onChange={(e)=>update('examination.vitalSigns.temperature', e.target.value)} />
                  <textarea placeholder="Physical examination findings" value={form.examination.physicalFindings} onChange={(e)=>update('examination.physicalFindings', e.target.value)} />
                  <input placeholder="Diagnosis" value={form.diagnosis.condition} onChange={(e)=>update('diagnosis.condition', e.target.value)} />
                  <input placeholder="Severity/stage" value={form.diagnosis.severity} onChange={(e)=>update('diagnosis.severity', e.target.value)} />

                  {/* Medications */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>Medications</strong>
                      <button className="new-record-btn" onClick={addMedication}><FiPlus /> Add</button>
                    </div>
                    {form.treatmentPlan.medications.map((m, i) => (
                      <div key={i} style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: '1fr 1fr 1fr auto', alignItems: 'center', marginTop: '0.5rem' }}>
                        <input placeholder="Name" value={m.name} onChange={(e)=>updateMedication(i, 'name', e.target.value)} />
                        <input placeholder="Dosage" value={m.dosage} onChange={(e)=>updateMedication(i, 'dosage', e.target.value)} />
                        <input placeholder="Duration" value={m.duration} onChange={(e)=>updateMedication(i, 'duration', e.target.value)} />
                        <button className="action-btn download-btn" onClick={()=>removeMedication(i)}><FiTrash2 /> Remove</button>
                      </div>
                    ))}
                  </div>

                  {/* Tests */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>Lab / Test Results</strong>
                      <button className="new-record-btn" onClick={addTest}><FiPlus /> Add</button>
                    </div>
                    {form.labResults.tests.map((t, i) => (
                      <div key={i} style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: '1fr 1fr 1fr auto', alignItems: 'center', marginTop: '0.5rem' }}>
                        <input placeholder="Test name" value={t.name} onChange={(e)=>updateTest(i, 'name', e.target.value)} />
                        <input placeholder="Result" value={t.result} onChange={(e)=>updateTest(i, 'result', e.target.value)} />
                        <input placeholder="Summary" value={t.summary} onChange={(e)=>updateTest(i, 'summary', e.target.value)} />
                        <button className="action-btn download-btn" onClick={()=>removeTest(i)}><FiTrash2 /> Remove</button>
                      </div>
                    ))}
                  </div>

                  <textarea placeholder="Doctor’s advice" value={form.notesRecommendations.advice} onChange={(e)=>update('notesRecommendations.advice', e.target.value)} />
                  <textarea placeholder="Lifestyle recommendations" value={form.notesRecommendations.lifestyle} onChange={(e)=>update('notesRecommendations.lifestyle', e.target.value)} />
                  <textarea placeholder="Dietary recommendations" value={form.notesRecommendations.dietary} onChange={(e)=>update('notesRecommendations.dietary', e.target.value)} />
                  <input type="date" placeholder="Next appointment" value={form.followUp.nextAppointmentDate} onChange={(e)=>update('followUp.nextAppointmentDate', e.target.value)} />
                  <input placeholder="Monitoring requirements" value={form.followUp.monitoringRequirements} onChange={(e)=>update('followUp.monitoringRequirements', e.target.value)} />

                  {/* Additional Fields (max 10) */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>Additional Fields (up to 10)</strong>
                      <button className="new-record-btn" onClick={addAdditionalField}><FiPlus /> Add</button>
                    </div>
                    {form.additionalFields.map((f, i) => (
                      <div key={i} style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: '1fr 2fr auto', alignItems: 'center', marginTop: '0.5rem' }}>
                        <input placeholder="Label" value={f.label} onChange={(e)=>updateAdditionalField(i, 'label', e.target.value)} />
                        <input placeholder="Value" value={f.value} onChange={(e)=>updateAdditionalField(i, 'value', e.target.value)} />
                        <button className="action-btn download-btn" onClick={()=>removeAdditionalField(i)}><FiTrash2 /> Remove</button>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button className="new-record-btn" disabled={saving} onClick={save}><FiSave /> {saving ? 'Saving...' : 'Save Report'}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitMedicalRecord;


