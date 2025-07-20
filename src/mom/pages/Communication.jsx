import React from 'react';
import './Communication.css';

const Communication = () => {
  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: 'Nov 12, 2024',
      time: '2:30 PM',
      type: 'Prenatal Checkup',
      status: 'Available'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Pediatrics',
      date: 'Nov 12, 2024',
      time: '11:00 AM',
      type: 'Baby Consultation',
      status: 'Available'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Obstetrics',
      date: 'Nov 14, 2024',
      time: '4:00 PM',
      type: 'Ultrasound Scan',
      status: 'Available'
    }
  ];

  const announcements = [
    {
      id: 1,
      title: 'Flu Vaccination Campaign',
      description: 'All pregnant mothers are encouraged to get their flu vaccination. Protect yourself and your baby during flu season.',
      category: 'Health',
      date: '2 days ago',
      priority: 'high'
    },
    {
      id: 2,
      title: 'New Prenatal Classes',
      description: 'We are launching new virtual prenatal classes every Saturday. Register now for childbirth preparation and breastfeeding guidance.',
      category: 'Education',
      date: '3 days ago',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Nutrition Workshop Success',
      description: 'Thank you to all mothers who attended our nutrition workshop. Recipe guides have been shared in your dashboard.',
      category: 'Success',
      date: '5 days ago',
      priority: 'low'
    },
    {
      id: 4,
      title: 'System Maintenance',
      description: 'Scheduled maintenance on Sunday 7 AM - 9 AM. Services may be temporarily unavailable.',
      category: 'System',
      date: '1 week ago',
      priority: 'medium'
    }
  ];

  const specialties = ['Cardiology', 'Obstetrics', 'Pediatrics', 'Gynecology', 'Radiology', 'Dental Health'];

  return (
    <div className="communication-container">
      {/* Hero Section */}
      <div className="heros-section">
        <div className="heros-content">
          <h1>The Communication module ensures smooth, secure, and real-time communication between mothers, doctors, and midwives. This feature helps bridge the gap between home care and professional medical guidance, offering instant support and updates when they matter the most.</h1>
        </div>
      </div>

      {/* Doctors Section */}
      <div className="doctors-section">
        <div className="sections-header">
          <h2>Connect with your healthcare providers instantly</h2>
        </div>
        <div className="doctors-grid">
          {doctors.map(doctor => (
            <div key={doctor.id} className="doctor-card">
              <div className="doctor-avatar">
                <span>{doctor.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div className="doctor-info">
                <h3>{doctor.name}</h3>
                <p className="specialty">{doctor.specialty}</p>
                <div className="appointment-details">
                  <div className="detail-row">
                    <span className="label">Date:</span>
                    <span className="value">{doctor.date}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Time:</span>
                    <span className="value">{doctor.time}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Type:</span>
                    <span className="value">{doctor.type}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Status:</span>
                    <span className="value status-available">{doctor.status}</span>
                  </div>
                </div>
                <button className="chat-button">
                  💬 Chat with {doctor.name.split(' ')[1]}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="sees-more-btn">SEE MORE</button>
      </div>

      {/* Find Doctor Section */}
      <div className="find-doctor-section">
        <div className="find-doctor-header">
          <h2>🔍 Find Your Perfect Doctor</h2>
          <p>Discover trusted healthcare professionals for your motherhood journey</p>
        </div>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search doctors by name, specialty, or location..."
            className="search-input"
          />
          <button className="search-button">🔍</button>
        </div>
        <div className="specialties-filter">
          {specialties.map((specialty, index) => (
            <button key={index} className="specialty-tag">
              {specialty}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements Section */}
      <div className="announcements-section">
        <div className="announcements-header">
          <h2>📢 Announcements</h2>
          <button className="filter-btn">Filter</button>
        </div>
        <div className="announcements-list">
          {announcements.map(announcement => (
            <div key={announcement.id} className={`announcement-card ${announcement.priority}`}>
              <div className="announcement-content">
                <div className="announcement-title-row">
                  <h3>{announcement.title}</h3>
                  <span className={`priority-badge ${announcement.priority}`}>
                    {announcement.category}
                  </span>
                </div>
                <p>{announcement.description}</p>
                <div className="announcement-footer">
                  <span className="announcement-date">{announcement.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Communication;