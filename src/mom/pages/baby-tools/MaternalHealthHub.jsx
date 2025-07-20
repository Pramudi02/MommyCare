import React from 'react';
import './MaternalHealthHub.css';
import {
  Stethoscope,
  Brain,
  Dumbbell,
  Salad,
  Heart,
  Moon,
  Sparkles,
  Baby,
  User,
} from 'lucide-react';

const topics = [
  {
    icon: <Stethoscope color="#be185d" size={40} />, // Postpartum Recovery
    title: 'Postpartum Recovery',
    page: 'postpartum-recovery',
    milestones: [
      'Physical healing after delivery',
      'C-section recovery specifics',
      'Perineal care and healing',
      'Postpartum bleeding management',
      'Return to exercise timeline',
    ],
  },
  {
    icon: <Brain color="#a21caf" size={40} />, // Mental Health
    title: 'Mental Health & Emotional Wellness',
    page: 'mental-health',
    milestones: [
      'Postpartum depression signs',
      'Baby blues vs serious concerns',
      'Anxiety and overwhelm management',
      'Sleep deprivation coping',
      'Partner relationship changes',
    ],
  },
  {
    icon: <Dumbbell color="#2563eb" size={40} />, // Body Changes
    title: 'Body Changes & Physical Health',
    page: 'body-changes',
    milestones: [
      'Hormonal fluctuations',
      'Hair loss and skin changes',
      'Weight management postpartum',
      'Joint and back pain relief',
      'Abdominal muscle separation',
    ],
  },
  {
    icon: <Salad color="#059669" size={40} />, // Nutrition
    title: 'Nutrition & Energy',
    page: 'nutrition-energy',
    milestones: [
      'Postpartum nutrition needs',
      'Iron deficiency and fatigue',
      'Healthy meal planning with baby',
      'Supplement recommendations',
      'Hydration importance',
    ],
  },
  {
    icon: <Heart color="#be185d" size={40} fill="#be185d" />, // Intimate Health
    title: 'Intimate Health',
    page: 'intimate-health',
    milestones: [
      'Postpartum intimacy timeline',
      'Contraception options while nursing',
      'Vaginal dryness solutions',
      'Pelvic floor strengthening',
      'Return of menstrual cycle',
    ],
  },
  {
    icon: <Moon color="#6366f1" size={40} />, // Sleep & Rest
    title: 'Sleep & Rest',
    page: 'sleep-rest',
    milestones: [
      'Sleep strategies with newborn',
      'Creating rest opportunities',
      'Managing night wakings',
      'Sleep hygiene for new moms',
      'Napping techniques',
    ],
  },
  {
    icon: <Sparkles color="#f59e42" size={40} />, // Self-Care
    title: 'Self-Care & Identity',
    page: 'self-care',
    milestones: [
      'Finding time for personal care',
      'Maintaining friendships',
      'Work-life balance planning',
      'Identity beyond motherhood',
      'Setting healthy boundaries',
    ],
  },
  {
    icon: <Baby color="#0ea5e9" size={40} />, // Breastfeeding
    title: 'Breastfeeding Support',
    page: 'breastfeeding',
    milestones: [
      'Latch and positioning help',
      'Supply concerns and solutions',
      'Pumping and storage tips',
      'Common feeding challenges',
      'Weaning guidance',
    ],
  },
];

function MaternalHealthHub() {
  const navigateTo = (page) => {
    // Replace with your routing logic, e.g., useNavigate from react-router-dom
    alert('Would navigate to: ' + page + ' page');
  };

  return (
    <div className="container">
      <div className="header">
        <h1>
          <User className="header-icon" />
          Maternal Health Hub
        </h1>
        <p>Comprehensive support for your postpartum journey and ongoing wellness as a new mother</p>
      </div>

      <div className="topics-grid">
        {topics.map((topic) => (
          <div
            className="topic-card"
            key={topic.title}
            onClick={() => navigateTo(topic.page)}
            tabIndex={0}
            role="button"
            onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && navigateTo(topic.page)}
          >
            <div className="topic-icon">{topic.icon}</div>
            <h3>{topic.title}</h3>
            <ul className="milestone-list">
              {topic.milestones.map((milestone, i) => (
                <li key={i}>{milestone}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="cta-section">
        <h2>Need Immediate Support?</h2>
        <p>Access our 24/7 problem solver tool for instant guidance on urgent maternal health concerns</p>
        <a href="#" className="cta-button" onClick={() => navigateTo('emergency-support')}>Get Help Now</a>
      </div>
    </div>
  );
}

export default MaternalHealthHub; 