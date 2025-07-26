import React from 'react';
import { MessageCircle, Search as SearchIcon, Bell, User, Users, HeartPulse, Stethoscope, Baby, Megaphone, Filter, ArrowDown } from 'lucide-react';
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

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="communication-page bg-gray-50 p-4">
       <div className="communication-container">
      {/* Header */}
      <div className="headerCommunication ">
        <div className="headerCommunication-icon">
          <MessageCircle className="w-6 h-6" />
        </div>
        <h1 className="headerCommunication-title">Communication Hub</h1>
        <p className="headerCommunication-description">
          Connect seamlessly with healthcare providers, stay updated with announcements, and access real-time support for your maternal care journey.
        </p>
        
        {/* Action Buttons */}
        <div className="header-actions">
          <button
            className="header-action-btn primary"
            onClick={() => scrollToSection('find-doctor-section')}
          >
            Find Your Perfect Doctor <ArrowDown size={20} />
          </button>
          <button
            className="header-action-btn secondary"
            onClick={() => scrollToSection('announcements-section')}
          >
            View Announcements <ArrowDown size={20} />
          </button>
        </div>
      </div>

      {/* Doctors Section */}
      <div className="doctors-section">
        <div className="sections-header flex items-center gap-2">
          <Users className="text-purple-500" size={24} />
          <h2>Connect with your healthcare providers instantly</h2>
        </div>
        <div className="doctors-grid">
          {doctors.map(doctor => (
            <div key={doctor.id} className="doctor-card">
              <div className="doctor-avatar">
                <User className="text-white bg-blue-400 rounded-full p-1" size={32} />
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
                <button className="chat-button flex items-center gap-2">
                  <MessageCircle className="text-blue-400" size={18} />
                  Chat with {doctor.name.split(' ')[1]}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="sees-more-btn flex items-center gap-2"><Users size={16} />SEE MORE</button>
      </div>

      {/* Find Doctor Section */}
      <div className="doctor-search-hero" id="find-doctor-section">
        <div className="doctor-search-header flex items-center gap-2">
          <SearchIcon className="text-white  mr-2" size={28} />
          <h2>Find Your Perfect Doctor</h2>
        </div>
        <p className="text-white text-sm text-center mr-2">Discover trusted healthcare professionals for your motherhood journey</p>
        <div className="doctor-search-form flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Search doctors by name, specialty, or location..."
            className="doctor-search-input"
          />
          <button className="doctor-search-btn flex items-center"><SearchIcon size={16} /></button>
        </div>
        <div className="doctor-specialties">
          {specialties.map((specialty, index) => (
            <button key={index} className="doctor-specialty-chip flex items-center gap-1">
              <Stethoscope className="text-white-400" size={14} /> {specialty}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements Section */}
      <div className="announcements-section" id="announcements-section">
        <div className="announcements-header flex items-center gap-2">
          <Megaphone className="text-yellow-500" size={20} />
          <h2>Announcements</h2>
          <button className="filter-btn flex items-center gap-1"><Filter size={14} />Filter</button>
        </div>
        <div className="announcements-list">
          {announcements.map(announcement => (
            <div key={announcement.id} className={`announcement-card ${announcement.priority}`}>
              <div className="announcement-content">
                <div className="announcement-title-row flex items-center gap-2">
                  <Bell className="text-blue-400" size={16} />
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
    </div>
   
  );
};

export default Communication;