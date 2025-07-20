import React from 'react';
import './cardiology.css';

const Cardiology = () => {
  const cardiologyDoctors = [
    {
      id: 1,
      initials: "DR",
      name: "Dr. Rajesh Kumar",
      specialty: "Senior Cardiologist & Interventional Specialist",
      hospital: "Colombo National Hospital",
      experience: "20+ Years Experience",
      qualifications: "MBBS, MD (Cardiology), FRCP",
      availability: "AVAILABLE TODAY",
      isAvailable: true,
      rating: 4.9,
      reviews: 456,
      image: "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg"
    },
    {
      id: 2,
      initials: "SM",
      name: "Dr. Sarah Mitchell",
      specialty: "Interventional Cardiologist",
      hospital: "Lanka Hospital, Colombo",
      experience: "15+ Years Experience",
      qualifications: "MBBS, MD, Fellowship Interventional",
      availability: "BUSY NOW",
      isAvailable: false,
      rating: 4.8,
      reviews: 342,
      image: "https://images.pexels.com/photos/4386468/pexels-photo-4386468.jpeg"
    },
    {
      id: 3,
      initials: "AP",
      name: "Dr. Ahmed Patel",
      specialty: "Cardiac Electrophysiologist",
      hospital: "Ajan Medical Hospital",
      experience: "18+ Years Experience",
      qualifications: "MBBS, MD, Fellowship EP",
      availability: "AVAILABLE TODAY",
      isAvailable: true,
      rating: 4.9,
      reviews: 289,
      image: "https://images.pexels.com/photos/4386469/pexels-photo-4386469.jpeg"
    },
    {
      id: 4,
      initials: "LW",
      name: "Dr. Lisa Wang",
      specialty: "Pediatric Cardiologist",
      hospital: "Colombo Children's Hospital",
      experience: "12+ Years Experience",
      qualifications: "MBBS, MD, Pediatric Cardiology",
      availability: "AVAILABLE TODAY",
      isAvailable: true,
      rating: 4.7,
      reviews: 198,
      image: "https://images.pexels.com/photos/4386470/pexels-photo-4386470.jpeg"
    },
    {
      id: 5,
      initials: "MJ",
      name: "Dr. Michael Johnson",
      specialty: "Heart Failure Specialist",
      hospital: "Colombo General Hospital",
      experience: "22+ Years Experience",
      qualifications: "MBBS, MD, Heart Failure Fellowship",
      availability: "BUSY NOW",
      isAvailable: false,
      rating: 4.8,
      reviews: 367,
      image: "https://images.pexels.com/photos/4386471/pexels-photo-4386471.jpeg"
    },
    {
      id: 6,
      initials: "EP",
      name: "Dr. Elena Petrov",
      specialty: "Cardiovascular Surgeon",
      hospital: "Lanka Hospital, Colombo",
      experience: "25+ Years Experience",
      qualifications: "MBBS, MS, Cardiovascular Surgery",
      availability: "AVAILABLE TODAY",
      isAvailable: true,
      rating: 4.9,
      reviews: 523,
      image: "https://images.pexels.com/photos/4386472/pexels-photo-4386472.jpeg"
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : 'empty'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="cardiology-container">
      <div className="cardiology-header">
        <div className="header-content">
          <h1>Cardiology Specialists</h1>
          <p>Find the best cardiologists in your area</p>
        </div>
      </div>

      <div className="doctors-grid">
        {cardiologyDoctors.map((doctor) => (
          <div key={doctor.id} className="doctor-card">
            <div className="doctor-avatar">
              <span>{doctor.initials}</span>
            </div>
            
            <div className="doctor-info">
              <h3>{doctor.name}</h3>
              <p className="specialty">{doctor.specialty}</p>
              
              <div className="doctor-details">
                <div className="detail-item">
                  <span className="icon">📍</span>
                  <span>{doctor.hospital}</span>
                </div>
                <div className="detail-item">
                  <span className="icon">⭐</span>
                  <span>{doctor.experience}</span>
                </div>
                <div className="detail-item">
                  <span className="icon">🎓</span>
                  <span>{doctor.qualifications}</span>
                </div>
                <div className="detail-item">
                  <span className={`status ${doctor.isAvailable ? 'available' : 'busy'}`}>
                    {doctor.availability}
                  </span>
                </div>
              </div>
              
              <div className="rating-section">
                <div className="stars">
                  {renderStars(doctor.rating)}
                </div>
                <span className="rating-text">
                  {doctor.rating} ({doctor.reviews} reviews)
                </span>
              </div>
              
              <div className="action-buttons">
                <button className="appointment-btn">Get Appointment</button>
                <button className="chat-btn">
                  <span>💬</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="see-more-section">
        <button className="see-more-btn">SEE MORE</button>
      </div>
    </div>
  );
};

export default Cardiology;