// src/pages/PatientDetails.jsx
import React from "react";
import "./PatientDetails.css";

const PatientDetails = () => {
  // Hardcoded single patient for now
  const patient = {
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
    image: "/images/1.png",
  };

  return (
    <div className="patient-details-page">
      <h1>Patient Details</h1>

      {/* Main Patient Info Card */}
      <div className="patient-header">
        <img
          src={patient.image}
          alt={patient.name}
        />
        <div>
          <h2>{patient.name}</h2>
          <p><strong>Age</strong> {patient.age}</p>
          <p><strong>Status</strong> <span className="status-active">{patient.status}</span></p>
          <p><strong>Condition</strong> {patient.condition}</p>
        </div>
      </div>

      {/* Contact & Basic Info Grid */}
      <div className="patient-info-grid">
        <div className="info-card">
          <h3>Contact Information</h3>
          <p><strong>Email</strong> {patient.email}</p>
          <p><strong>Phone</strong> {patient.phone}</p>
          <p><strong>Emergency Contact</strong> {patient.emergencyContact}</p>
        </div>

        <div className="info-card">
          <h3>Medical Information</h3>
          <p><strong>Blood Type</strong> {patient.bloodType}</p>
          <p><strong>Last Visit</strong> {patient.lastVisit}</p>
          <p><strong>Next Visit</strong> {patient.nextVisit}</p>
        </div>
      </div>

      {/* Medical History & Allergies Grid */}
      <div className="medical-info-grid">
        <div className="medical-card">
          <h3>Medical History</h3>
          <ul>
            {patient.medicalHistory.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="medical-card">
          <h3>Allergies</h3>
          <div className="allergies-list">
            {patient.allergies.join(", ")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;