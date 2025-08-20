import React, { useEffect, useMemo, useState } from 'react';
import './Appointments.css';
import { doctorAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const NewAppointment = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    patientId: '',
    title: 'Appointment',
    type: 'consultation',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 30,
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await doctorAPI.searchPatients('');
        const list = res?.data || [];
        if (isMounted) setPatients(list);
      } catch (e) {}
    })();
    return () => { isMounted = false; };
  }, []);

  const filteredPatients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(p =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
      p._id?.toLowerCase().includes(q)
    );
  }, [patients, search]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const times = [];
  for (let h = 8; h <= 18; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      times.push(`${hh}:${mm}`);
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const startIso = new Date(`${form.date}T${form.time}:00`).toISOString();
      await doctorAPI.createAppointment({
        patientId: form.patientId,
        title: form.title,
        type: form.type,
        startTime: startIso,
        duration: Number(form.duration),
        notes: form.notes
      });
      navigate('/doctor/appointments');
    } catch (e) {
      setError(e?.message || 'Failed to create appointment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <h1>New Appointment</h1>
        <p>Create a new appointment</p>
        <div className="doctor-dashboard-header-decoration"></div>
      </div>

      <div className="appointments-section">
        <form className="new-appointment-form" onSubmit={onSubmit}>
          {error && <div className="error-banner">{error}</div>}
          <div className="form-row">
            <div className="form-group">
              <label>Search Patient</label>
              <input
                type="text"
                placeholder="Search by name or ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Patient</label>
              <select name="patientId" value={form.patientId} onChange={onChange} required>
                <option value="">Select a patient...</option>
                {filteredPatients.map(p => (
                  <option key={p._id} value={p._id}>{p.firstName} {p.lastName} ({p._id.slice(-6)})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input name="title" value={form.title} onChange={onChange} />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={form.type} onChange={onChange}>
                <option value="consultation">Consultation</option>
                <option value="checkup">Checkup</option>
                <option value="follow-up">Follow-up</option>
                <option value="emergency">Emergency</option>
                <option value="procedure">Procedure</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" value={form.date} onChange={onChange} required />
            </div>
            <div className="form-group">
              <label>Time</label>
              <select name="time" value={form.time} onChange={onChange}>
                {times.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Duration (minutes)</label>
              <select name="duration" value={form.duration} onChange={onChange}>
                {[15,30,45,60,90].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={onChange} placeholder="Additional notes or instructions..."></textarea>
          </div>

          <div className="schedule-modal__actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Creating...' : 'Create Appointment'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointment;



