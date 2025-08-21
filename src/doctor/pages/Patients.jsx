import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiUser, FiCalendar, FiPhone, FiMapPin, FiEdit, FiEye, FiMessageCircle } from 'react-icons/fi';
import './Patients.css';

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const navigate = useNavigate();

  // Sample patient data
  const patients = [
    {
      id: 1,
      name: "Emma Wilson",
      age: 28,
      email: "emma.wilson@email.com",
      phone: "+1 (555) 123-4567",
      status: "Active",
      lastVisit: "2024-12-15",
      nextVisit: "2024-12-22",
      condition: "Pregnancy - 24 weeks",
      bloodType: "O+",
      emergencyContact: "John Wilson (Husband) - +1 (555) 987-6543",
      medicalHistory: ["Gestational diabetes", "Hypertension"],
      allergies: ["Penicillin"],
      image: "/images/1.png"
    },
    {
      id: 2,
      name: "Sophia Rodriguez",
      age: 32,
      email: "sophia.rodriguez@email.com",
      phone: "+1 (555) 234-5678",
      status: "Active",
      lastVisit: "2024-12-10",
      nextVisit: "2024-12-17",
      condition: "Pregnancy - 18 weeks",
      bloodType: "A+",
      emergencyContact: "Carlos Rodriguez (Husband) - +1 (555) 876-5432",
      medicalHistory: ["Previous C-section", "Asthma"],
      allergies: ["None"],
      image: "/images/2.png"
    },
    {
      id: 3,
      name: "Isabella Chen",
      age: 25,
      email: "isabella.chen@email.com",
      phone: "+1 (555) 345-6789",
      status: "Follow-up",
      lastVisit: "2024-12-12",
      nextVisit: "2024-12-19",
      condition: "Postpartum - 6 weeks",
      bloodType: "B+",
      emergencyContact: "Michael Chen (Husband) - +1 (555) 765-4321",
      medicalHistory: ["Vaginal delivery", "Postpartum depression"],
      allergies: ["Sulfa drugs"],
      image: "/images/3.png"
    },
    {
      id: 4,
      name: "Mia Johnson",
      age: 30,
      email: "mia.johnson@email.com",
      phone: "+1 (555) 456-7890",
      status: "Emergency",
      lastVisit: "2024-12-14",
      nextVisit: "2024-12-16",
      condition: "Pregnancy - 32 weeks",
      bloodType: "AB+",
      emergencyContact: "David Johnson (Husband) - +1 (555) 654-3210",
      medicalHistory: ["Preeclampsia", "Multiple pregnancies"],
      allergies: ["Latex"],
      image: "/images/4.png"
    },
    {
      id: 5,
      name: "Ava Thompson",
      age: 27,
      email: "ava.thompson@email.com",
      phone: "+1 (555) 567-8901",
      status: "Active",
      lastVisit: "2024-12-08",
      nextVisit: "2024-12-15",
      condition: "Pregnancy - 20 weeks",
      bloodType: "O-",
      emergencyContact: "James Thompson (Husband) - +1 (555) 543-2109",
      medicalHistory: ["Ectopic pregnancy", "Endometriosis"],
      allergies: ["Ibuprofen"],
      image: "/images/5.png"
    },
    {
      id: 6,
      name: "Charlotte Davis",
      age: 29,
      email: "charlotte.davis@email.com",
      phone: "+1 (555) 678-9012",
      status: "Active",
      lastVisit: "2024-12-06",
      nextVisit: "2024-12-13",
      condition: "Pregnancy - 16 weeks",
      bloodType: "A-",
      emergencyContact: "Robert Davis (Husband) - +1 (555) 432-1098",
      medicalHistory: ["Miscarriage", "PCOS"],
      allergies: ["None"],
      image: "/images/6.png"
    }
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || patient.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#10b981';
      case 'follow-up':
        return '#f59e0b';
      case 'emergency':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const handleViewPatient = (patientId) => {
    navigate(`/doctor/patients/PatientDetails?id=${patientId}`);
  };

  return (
    <div className="doctor-patients-page">
      <div className="doctor-patients-container">
        <div className="doctor-patients">
          <div className="doctor-patients__header">
            <div className="doctor-patients__header-icon">
              <FiUser className="w-6 h-6" />
            </div>
            <div className="doctor-patients__welcome">
              <h1>Patient Management</h1>
              <p>Manage and monitor your patients' health records and appointments</p>
            </div>
          </div>

          <div className="doctor-patients__controls">
            <div className="doctor-patients__search">
              <div className="doctor-search-input">
                <FiSearch className="doctor-search-icon" />
                <input
                  type="text"
                  placeholder="Search patients by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="doctor-search-field"
                />
              </div>
            </div>

            <div className="doctor-patients__filters">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="doctor-status-filter"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="follow-up">Follow-up</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <button className="doctor-add-patient-btn">
              <FiPlus size={16} />
              Add New Patient
            </button>
          </div>

          <div className="doctor-patients__content">
            <div className="doctor-patients-grid">
              {filteredPatients.map(patient => (
                <div key={patient.id} className="doctor-patient-card">
                  <div className="doctor-patient-card__header">
                    <div className="doctor-patient-card__avatar">
                      <img src={patient.image} alt={patient.name} />
                    </div>
                    <div className="doctor-patient-card__status">
                      <span 
                        className="doctor-patient-status-badge"
                        style={{ backgroundColor: getStatusColor(patient.status) }}
                      >
                        {patient.status}
                      </span>
                    </div>
                  </div>

                  <div className="doctor-patient-card__body">
                    <h3 className="doctor-patient-card__name">{patient.name}</h3>
                    <div className="doctor-patient-card__info">
                      <div className="doctor-patient-info-item">
                        <FiUser size={14} />
                        <span>{patient.age} years old</span>
                      </div>
                      <div className="doctor-patient-info-item">
                        <FiCalendar size={14} />
                        <span>Last visit: {patient.lastVisit}</span>
                      </div>
                      <div className="doctor-patient-info-item">
                        <FiPhone size={14} />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="doctor-patient-info-item">
                        <FiMapPin size={14} />
                        <span>{patient.condition}</span>
                      </div>
                    </div>
                  </div>

                  <div className="doctor-patient-card__actions">
                    <button 
                      className="doctor-patient-action-btn doctor-patient-action-btn--view"
                      onClick={() => handleViewPatient(patient.id)}
                    >
                      <FiEye size={14} />
                      View
                    </button>
                    <button className="doctor-patient-action-btn doctor-patient-action-btn--edit">
                      <FiEdit size={14} />
                      Edit
                    </button>
                    <button className="doctor-patient-action-btn doctor-patient-action-btn--message">
                      <FiMessageCircle size={14} />
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredPatients.length === 0 && (
              <div className="doctor-no-patients">
                <div className="doctor-no-patients-icon">
                  <FiUser size={48} />
                </div>
                <h3>No patients found</h3>
                <p>Try adjusting your search criteria or add a new patient.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;