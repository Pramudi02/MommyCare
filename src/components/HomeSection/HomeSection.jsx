import React from 'react';
import './HomeSection.css';

const HomeSection = () => {
  const pregnancyWeeks = [
    { week: 2, icon: '🔬', color: '#FFE4B5', description: 'Fertilization' },
    { week: 3, icon: '⚫', color: '#FFE4E1', description: 'Blastocyst' },
    { week: 4, icon: '🫘', color: '#E6E6FA', description: 'Poppy seed' },
    { week: 5, icon: '🫘', color: '#F0F8FF', description: 'Sesame seed' },
    { week: 6, icon: '🫘', color: '#FFFACD', description: 'Lentil' },
    { week: 7, icon: '🫘', color: '#E0F6FF', description: 'Blueberry' },
    { week: 8, icon: '🫘', color: '#FFE4E1', description: 'Kidney bean' },
    { week: 9, icon: '🫘', color: '#F0FFF0', description: 'Grape' },
    { week: 10, icon: '🫘', color: '#FFE4E1', description: 'Kumquat' }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "New Mother",
      text: "Momy Care made my pregnancy journey so much easier. The tracker helped me stay on top of everything, and the vaccination reminders were a lifesaver!"
    },
    {
      id: 2,
      name: "Emily Davis",
      role: "Expecting Mother", 
      text: "The pregnancy tracker and appointment manager are incredible! I never miss any important check-ups now."
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      role: "New Mother",
      text: "The communication feature with healthcare providers is amazing. I get answers to all my questions quickly!"
    }
  ];

  return (
    <div className="home-section">
      {/* Pregnancy Week Tracker */}
      <div className="pregnancy-tracker">
        <h2 className="tracker-title">My pregnancy week by week</h2>
        <div className="weeks-container">
          {pregnancyWeeks.map((week) => (
            <div key={week.week} className="week-card" style={{ backgroundColor: week.color }}>
              <div className="week-number">{week.week}</div>
              <div className="week-label">weeks pregnant</div>
              <div className="week-icon">{week.icon}</div>
              <div className="week-description">{week.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <div className="testimonials-background">
          <div className="testimonials-content">
            <div className="testimonials-text">
              <h2 className="testimonials-title">What Mothers Say About Us</h2>
              <div className="testimonials-list">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="testimonial-card">
                    <div className="testimonial-text">
                      "{testimonial.text}"
                    </div>
                    <div className="testimonial-author">
                      <div className="author-avatar">
                        <div className="avatar-icon">👩</div>
                      </div>
                      <div className="author-info">
                        <div className="author-name">{testimonial.name}</div>
                        <div className="author-role">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;