import React, { useState } from 'react';
import { MessageCircle, Search as SearchIcon, Bell, User, Users, HeartPulse, Stethoscope, Baby, Megaphone, Filter, ArrowDown, X, Phone, Mail, MapPin, Star, Clock } from 'lucide-react';
import ChatBox from './chat';
import './Communication.css';

const Communication = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [showSpecialtyPopup, setShowSpecialtyPopup] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: 'Nov 12, 2024',
      time: '2:30 PM',
      type: 'Prenatal Checkup',
      status: 'Available',
      rating: 4.9,
      experience: '15+ years',
      location: 'Downtown Medical Center',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@mommycare.com',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Pediatrics',
      date: 'Nov 12, 2024',
      time: '11:00 AM',
      type: 'Baby Consultation',
      status: 'Available',
      rating: 4.8,
      experience: '12+ years',
      location: 'Children\'s Hospital',
      phone: '+1 (555) 234-5678',
      email: 'michael.chen@mommycare.com',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Obstetrics',
      date: 'Nov 14, 2024',
      time: '4:00 PM',
      type: 'Ultrasound Scan',
      status: 'Available',
      rating: 4.9,
      experience: '18+ years',
      location: 'Women\'s Health Clinic',
      phone: '+1 (555) 345-6789',
      email: 'emily.rodriguez@mommycare.com',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Dr. David Kim',
      specialty: 'Cardiology',
      date: 'Nov 15, 2024',
      time: '10:00 AM',
      type: 'Heart Health Check',
      status: 'Available',
      rating: 4.7,
      experience: '20+ years',
      location: 'Cardiac Care Institute',
      phone: '+1 (555) 456-7890',
      email: 'david.kim@mommycare.com',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 5,
      name: 'Dr. Lisa Thompson',
      specialty: 'Pediatrics',
      date: 'Nov 16, 2024',
      time: '3:00 PM',
      type: 'Vaccination',
      status: 'Available',
      rating: 4.8,
      experience: '14+ years',
      location: 'Family Care Center',
      phone: '+1 (555) 567-8901',
      email: 'lisa.thompson@mommycare.com',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 6,
      name: 'Dr. James Wilson',
      specialty: 'Obstetrics',
      date: 'Nov 17, 2024',
      time: '1:30 PM',
      type: 'Prenatal Visit',
      status: 'Available',
      rating: 4.9,
      experience: '16+ years',
      location: 'Maternity Care Center',
      phone: '+1 (555) 678-9012',
      email: 'james.wilson@mommycare.com',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 7,
      name: 'Dr. Maria Garcia',
      specialty: 'Gynecology',
      date: 'Nov 18, 2024',
      time: '2:00 PM',
      type: 'Annual Checkup',
      status: 'Available',
      rating: 4.8,
      experience: '13+ years',
      location: 'Women\'s Wellness Center',
      phone: '+1 (555) 789-0123',
      email: 'maria.garcia@mommycare.com',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 8,
      name: 'Dr. Robert Brown',
      specialty: 'Radiology',
      date: 'Nov 19, 2024',
      time: '9:00 AM',
      type: 'Ultrasound',
      status: 'Available',
      rating: 4.7,
      experience: '17+ years',
      location: 'Imaging Center',
      phone: '+1 (555) 890-1234',
      email: 'robert.brown@mommycare.com',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 9,
      name: 'Dr. Jennifer Lee',
      specialty: 'Dental Health',
      date: 'Nov 20, 2024',
      time: '11:30 AM',
      type: 'Dental Checkup',
      status: 'Available',
      rating: 4.8,
      experience: '11+ years',
      location: 'Family Dental Care',
      phone: '+1 (555) 901-2345',
      email: 'jennifer.lee@mommycare.com',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face'
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

  const handleSpecialtyClick = (specialty) => {
    setSelectedSpecialty(specialty);
    setShowSpecialtyPopup(true);
  };

  const closeSpecialtyPopup = () => {
    setShowSpecialtyPopup(false);
    setSelectedSpecialty(null);
  };

  const getDoctorsBySpecialty = (specialty) => {
    return doctors.filter(doctor => doctor.specialty === specialty);
  };

  const getSpecialtyIcon = (specialty) => {
    switch (specialty) {
      case 'Cardiology':
        return <HeartPulse className="w-6 h-6 text-red-500" />;
      case 'Obstetrics':
        return <Baby className="w-6 h-6 text-pink-500" />;
      case 'Pediatrics':
        return <Baby className="w-6 h-6 text-blue-500" />;
      case 'Gynecology':
        return <User className="w-6 h-6 text-purple-500" />;
      case 'Radiology':
        return <Stethoscope className="w-6 h-6 text-green-500" />;
      case 'Dental Health':
        return <Stethoscope className="w-6 h-6 text-teal-500" />;
      default:
        return <Stethoscope className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="communication-page bg-gray-50 p-4">
       <div className="comm-container">
      {/* Header */}
      <div className="comm-header ">
        <div className="comm-header-icon">
          <MessageCircle className="w-6 h-6" />
        </div>
        <h1 className="comm-header-title">Communication Hub</h1>
        <p className="comm-header-description">
          Connect seamlessly with healthcare providers, stay updated with announcements, and access real-time support for your maternal care journey.
        </p>
        
        {/* Action Buttons */}
        <div className="comm-header-actions">
          <button
            className="comm-header-action-btn primary"
            onClick={() => scrollToSection('find-doctor-section')}
          >
            Find Your Perfect Doctor <ArrowDown size={20} />
          </button>
          <button
            className="comm-header-action-btn secondary"
            onClick={() => scrollToSection('announcements-section')}
          >
            View Announcements <ArrowDown size={20} />
          </button>
        </div>
      </div>

      {/* Doctors Section */}
      <div className="comm-doctors-section">
        <div className="comm-sections-header flex items-center gap-2">
          <Users className="text-purple-500" size={24} />
          <h2>Connect with your healthcare providers instantly</h2>
        </div>
        <div className="comm-doctors-grid">
          {doctors.slice(0, 3).map(doctor => (
            <div key={doctor.id} className="comm-doctor-card">
              <div className="comm-doctor-avatar">
                <User className="text-white bg-blue-400 rounded-full p-1" size={32} />
              </div>
              <div className="comm-doctor-info">
                <h3>{doctor.name}</h3>
                <p className="comm-specialty">{doctor.specialty}</p>
                <div className="comm-appointment-details">
                  <div className="comm-detail-row">
                    <span className="label">Date:</span>
                    <span className="value">{doctor.date}</span>
                  </div>
                  <div className="comm-detail-row">
                    <span className="label">Time:</span>
                    <span className="value">{doctor.time}</span>
                  </div>
                  <div className="comm-detail-row">
                    <span className="label">Type:</span>
                    <span className="value">{doctor.type}</span>
                  </div>
                  <div className="comm-detail-row">
                    <span className="label">Status:</span>
                    <span className="value comm-status-available">{doctor.status}</span>
                  </div>
                </div>
                <button 
                  className="comm-chat-button flex items-center gap-2"
                  onClick={() => {
                    setSelectedProvider(doctor);
                    setShowChatBox(true);
                  }}
                >
                  <MessageCircle className="text-blue-400" size={18} />
                  Chat with {doctor.name.split(' ')[1]}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="comm-sees-more-btn flex items-center gap-2"><Users size={16} />SEE MORE</button>
      </div>

      {/* Find Doctor Section */}
      <div className="comm-doctor-search-hero" id="find-doctor-section">
        <div className="comm-doctor-search-header flex items-center gap-2">
          <SearchIcon className="text-white  mr-2" size={28} />
          <h2>Find Your Perfect Doctor</h2>
        </div>
        <p className="text-white text-sm text-center mr-2">Discover trusted healthcare professionals for your motherhood journey</p>
        <div className="comm-doctor-search-form flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Search doctors by name, specialty, or location..."
            className="comm-doctor-search-input"
          />
          <button className="comm-doctor-search-btn flex items-center"><SearchIcon size={16} /></button>
        </div>
        <div className="comm-doctor-specialties">
          {specialties.map((specialty, index) => (
            <button 
              key={index} 
              className="comm-doctor-specialty-chip flex items-center gap-1"
              onClick={() => handleSpecialtyClick(specialty)}
            >
              <Stethoscope className="text-white-400" size={14} /> {specialty}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements Section */}
      <div className="comm-announcements-section" id="announcements-section">
        <div className="comm-announcements-header flex items-center gap-2">
          <Megaphone className="text-yellow-500" size={20} />
          <h2>Announcements</h2>
          <button className="comm-filter-btn flex items-center gap-1"><Filter size={14} />Filter</button>
        </div>
        <div className="comm-announcements-list">
          {announcements.map(announcement => (
            <div key={announcement.id} className={`comm-announcement-card ${announcement.priority}`}>
              <div className="announcement-content">
                <div className="comm-announcement-title-row flex items-center gap-2">
                  <Bell className="text-blue-400" size={16} />
                  <h3>{announcement.title}</h3>
                  <span className={`comm-priority-badge ${announcement.priority}`}>
                    {announcement.category}
                  </span>
                </div>
                <p>{announcement.description}</p>
                <div className="comm-announcement-footer">
                  <span className="comm-announcement-date">{announcement.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialty Popup Modal */}
      {showSpecialtyPopup && selectedSpecialty && (
        <div className="comm-specialty-popup-overlay" onClick={closeSpecialtyPopup}>
          <div className="comm-specialty-popup-content" onClick={(e) => e.stopPropagation()}>
            {/* Popup Header */}
            <div className="comm-popup-header">
              <div className="comm-popup-title-section">
                {getSpecialtyIcon(selectedSpecialty)}
                <h2>{selectedSpecialty} Specialists</h2>
                <p>Find the perfect {selectedSpecialty.toLowerCase()} doctor for your needs</p>
              </div>
              <button className="comm-popup-close-btn" onClick={closeSpecialtyPopup}>
                <X size={24} />
              </button>
            </div>

            {/* Popup Body */}
            <div className="comm-popup-body">
              <div className="comm-popup-stats">
                <div className="comm-stat-item">
                  <span className="comm-stat-number">{getDoctorsBySpecialty(selectedSpecialty).length}</span>
                  <span className="comm-stat-label">Available Doctors</span>
                </div>
                <div className="comm-stat-item">
                  <span className="comm-stat-number">4.8+</span>
                  <span className="comm-stat-label">Average Rating</span>
                </div>
                <div className="comm-stat-item">
                  <span className="comm-stat-number">24/7</span>
                  <span className="comm-stat-label">Support Available</span>
                </div>
              </div>

              <div className="comm-popup-doctors-grid">
                {getDoctorsBySpecialty(selectedSpecialty).map(doctor => (
                  <div key={doctor.id} className="comm-popup-doctor-card">
                    <div className="comm-popup-doctor-header">
                      <div className="comm-popup-doctor-avatar">
                        <img src={doctor.image} alt={doctor.name} />
                        <div className="comm-online-indicator"></div>
                      </div>
                      <div className="comm-popup-doctor-info">
                        <h3>{doctor.name}</h3>
                        <p className="comm-popup-doctor-specialty">{doctor.specialty}</p>
                        <div className="comm-popup-doctor-rating">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{doctor.rating}</span>
                          <span className="experience">({doctor.experience})</span>
                        </div>
                      </div>
                    </div>

                                         <div className="comm-popup-doctor-details">
                       <div className="comm-detail-item">
                         <MapPin className="w-4 h-4 text-gray-500" />
                         <span>{doctor.location}</span>
                       </div>
                       <div className="comm-detail-item">
                         <Clock className="w-4 h-4 text-gray-500" />
                         <span>Next Available: {doctor.date} at {doctor.time}</span>
                       </div>
                     </div>

                     <div className="comm-popup-doctor-actions">
                       <button 
                         className="comm-popup-action-btn primary"
                         onClick={() => {
                           setSelectedProvider(doctor);
                           setShowChatBox(true);
                           setShowSpecialtyPopup(false);
                         }}
                       >
                         <MessageCircle size={16} />
                         Chat Now
                       </button>
                       <button className="comm-popup-action-btn secondary">
                         <Phone size={16} />
                         Call
                       </button>
                       <button className="comm-popup-action-btn secondary">
                         <Mail size={16} />
                         Email
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           </div>
         </div>
                )}

        {/* ChatBox Component */}
        <ChatBox 
          isOpen={showChatBox}
          onClose={() => {
            setShowChatBox(false);
            setSelectedProvider(null);
          }}
          selectedProvider={selectedProvider}
        />
      </div>
    </div>
   
  );
};

export default Communication;