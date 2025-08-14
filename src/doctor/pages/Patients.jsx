import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      lastVisit: "2024-12-11",
      nextVisit: "2024-12-18",
      condition: "Pregnancy - 16 weeks",
      bloodType: "A-",
      emergencyContact: "Robert Davis (Husband) - +1 (555) 432-1098",
      medicalHistory: ["PCOS", "Thyroid disorder"],
      allergies: ["Shellfish"],
      image: "/images/6.png"
    }
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' || patient.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handlePatientClick = (patient) => {
    navigate(`/doctor/patients/PatientDetails`);
  };

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

  return (
    <div className="patients-page">
      <div className="patients-header">
        <div className="patients-header__left">
          <h1>Patient Management</h1>
          <p>Manage your patients and their medical records</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="patients-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search patients by name, email, or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filters">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="follow-up">Follow-up</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="patients-grid">
        {filteredPatients.map(patient => (
          <div key={patient.id} className="patient-card" onClick={() => handlePatientClick(patient)}>
            <div className="patient-card__header">
              <img src={patient.image} alt={patient.name} className="patient-avatar" />
              <div className="patient-status" style={{ backgroundColor: getStatusColor(patient.status) }}>
                {patient.status}
              </div>
            </div>

            <div className="patient-card__body">
              <h3>{patient.name}</h3>
              <p className="patient-age">{patient.age} years old</p>
              <p className="patient-condition">{patient.condition}</p>
              <p className="patient-contact">{patient.email}</p>
              <p className="patient-phone">{patient.phone}</p>
            </div>

            <div className="patient-card__footer">
              <span className="last-visit">Last: {patient.lastVisit}</span>
              <span className="next-visit">Next: {patient.nextVisit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Patients;
