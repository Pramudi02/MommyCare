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
    <div className="doctor-dashboard-page">
      <div className="doctor-dashboard-container">
        <div className="doctor-dashboard">
          <div className="doctor-dashboard__header">
            <div className="doctor-dashboard__header-icon">
              <FiCalendar className="w-6 h-6" />
            </div>
            <div className="doctor-dashboard__welcome">
              <h1>Create New Appointment</h1>
              <p>Schedule a new appointment with a patient</p>
            </div>
          </div>

          <div className="doctor-dashboard__main-content">
            <div className="doctor-dashboard__section">
              <div className="new-appointment__form-container">
                <div className="new-appointment__form-header">
                  <button 
                    className="back-button"
                    onClick={() => navigate('/doctor/appointments')}
                  >
                    <FiArrowLeft size={16} />
                    Back to Appointments
                  </button>
                </div>

                <form onSubmit={onSubmit} className="new-appointment__form">
                  {error && <div className="error-message">{error}</div>}
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="patientId">
                        <FiUser size={16} />
                        Patient
                      </label>
                      <div className="search-container">
                        <FiSearch size={16} className="search-icon" />
                        <input
                          type="text"
                          placeholder="Search patients..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="search-input"
                        />
                      </div>
                      <select
                        id="patientId"
                        name="patientId"
                        value={form.patientId}
                        onChange={onChange}
                        required
                        className="form-select"
                      >
                        <option value="">Select a patient</option>
                        {filteredPatients.map(patient => (
                          <option key={patient._id} value={patient._id}>
                            {patient.firstName} {patient.lastName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="title">
                        <FiFileText size={16} />
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={onChange}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="type">
                        <FiFileText size={16} />
                        Type
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={form.type}
                        onChange={onChange}
                        required
                        className="form-select"
                      >
                        <option value="consultation">Consultation</option>
                        <option value="follow-up">Follow-up</option>
                        <option value="emergency">Emergency</option>
                        <option value="routine">Routine Check</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="date">
                        <FiCalendar size={16} />
                        Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={form.date}
                        onChange={onChange}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="time">
                        <FiClock size={16} />
                        Time
                      </label>
                      <select
                        id="time"
                        name="time"
                        value={form.time}
                        onChange={onChange}
                        required
                        className="form-select"
                      >
                        {times.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="duration">
                        <FiClock size={16} />
                        Duration (minutes)
                      </label>
                      <select
                        id="duration"
                        name="duration"
                        value={form.duration}
                        onChange={onChange}
                        required
                        className="form-select"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1.5 hours</option>
                        <option value={120}>2 hours</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="notes">
                      <FiFileText size={16} />
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={form.notes}
                      onChange={onChange}
                      rows={4}
                      placeholder="Add any additional notes..."
                      className="form-textarea"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => navigate('/doctor/appointments')}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary"
                    >
                      {submitting ? 'Creating...' : (
                        <>
                          <FiPlus size={16} />
                          Create Appointment
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAppointment;



