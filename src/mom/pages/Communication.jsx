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
    <div className="communication-container">
      {/* Hero Section */}
      <div className="heros-section">
        <div className="heros-content w-full flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="text-blue-500" size={32} />
            <h1 className="text-center">The Communication module ensures smooth, secure, and real-time communication between mothers, doctors, and midwives. This feature helps bridge the gap between home care and professional medical guidance, offering instant support and updates when they matter the most.</h1>
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
            <button
              className="bg-blue-200 hover:bg-blue-300 text-black font-semibold px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition-all text-lg"
              onClick={() => scrollToSection('find-doctor-section')}
            >
              Find Your Perfect Doctor <ArrowDown size={20} />
            </button>
            <button
              className="bg-yellow-100 hover:bg-yellow-200 text-black font-semibold px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition-all text-lg"
              onClick={() => scrollToSection('announcements-section')}
            >
              Announcements <ArrowDown size={20} />
            </button>
          </div>
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
      <div className="find-doctor-section" id="find-doctor-section">
        <div className="find-doctor-header flex items-center gap-2">
          <SearchIcon className="text-blue-400" size={20} />
          <h2>Find Your Perfect Doctor</h2>
        </div>
        <p>Discover trusted healthcare professionals for your motherhood journey</p>
        <div className="search-container flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Search doctors by name, specialty, or location..."
            className="search-input"
          />
          <button className="search-button flex items-center"><SearchIcon size={16} /></button>
        </div>
        <div className="specialties-filter">
          {specialties.map((specialty, index) => (
            <button key={index} className="specialty-tag flex items-center gap-1">
              <Stethoscope className="text-purple-400" size={14} /> {specialty}
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
  );
};

export default Communication;