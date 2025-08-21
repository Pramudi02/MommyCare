import React, { useEffect, useMemo, useState } from 'react';
import { FiCalendar, FiClock, FiUser, FiFileText, FiPlus, FiSearch, FiArrowLeft } from 'react-icons/fi';
import './NewAppointment.css';
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
    <div className="new-appointment-page">
      <div className="new-appointment-container">
        <div className="new-appointment">
          <div className="new-appointment__header">
            <div className="new-appointment__header-icon">
              <FiCalendar className="w-6 h-6" />
            </div>
            <div className="new-appointment__welcome">
              <h1>Create New Appointment</h1>
              <p>Schedule a new appointment with a patient</p>
            </div>
          </div>

          <div className="new-appointment__content">
            <div className="new-appointment__form-container">
              <div className="new-appointment__form-header">
                <button 
                  className="back-button"
                  onClick={() => navigate('/doctor/appointments')}
                >
                  <FiArrowLeft size={16} />
                  Back to Appointments
                </button>
                <h2>Appointment Details</h2>
              </div>

              <form className="new-appointment-form" onSubmit={onSubmit}>
                {error && <div className="error-banner">{error}</div>}
                
                <div className="form-section">
                  <h3>
                    <FiUser size={16} />
                    Patient Selection
                  </h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <FiSearch size={14} />
                        Search Patient
                      </label>
                      <input
                        type="text"
                        placeholder="Search by name or ID"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                      />
                    </div>
                  </div>
                  
                  {filteredPatients.length > 0 && (
                    <div className="patients-list">
                      {filteredPatients.map(patient => (
                        <div 
                          key={patient._id}
                          className={`patient-option ${form.patientId === patient._id ? 'selected' : ''}`}
                          onClick={() => setForm(prev => ({ ...prev, patientId: patient._id }))}
                        >
                          <div className="patient-info">
                            <h4>{patient.firstName} {patient.lastName}</h4>
                            <p>ID: {patient._id?.slice(-6)}</p>
                          </div>
                          <div className="patient-avatar">
                            <FiUser size={20} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-section">
                  <h3>
                    <FiCalendar size={16} />
                    Appointment Details
                  </h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={onChange}
                        placeholder="Appointment title"
                      />
                    </div>
                    <div className="form-group">
                      <label>Type</label>
                      <select name="type" value={form.type} onChange={onChange}>
                        <option value="consultation">Consultation</option>
                        <option value="checkup">Checkup</option>
                        <option value="emergency">Emergency</option>
                        <option value="followup">Follow-up</option>
                        <option value="ultrasound">Ultrasound</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <FiCalendar size={14} />
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={onChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <FiClock size={14} />
                        Time
                      </label>
                      <select name="time" value={form.time} onChange={onChange}>
                        {times.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Duration (minutes)</label>
                      <select name="duration" value={form.duration} onChange={onChange}>
                        <option value={15}>15</option>
                        <option value={30}>30</option>
                        <option value={45}>45</option>
                        <option value={60}>60</option>
                        <option value={90}>90</option>
                        <option value={120}>120</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>
                    <FiFileText size={16} />
                    Additional Information
                  </h3>
                  <div className="form-group">
                    <label>Notes</label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={onChange}
                      placeholder="Any additional notes or instructions..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => navigate('/doctor/appointments')}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submitting || !form.patientId}
                  >
                    <FiPlus size={16} />
                    {submitting ? 'Creating...' : 'Create Appointment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAppointment;



