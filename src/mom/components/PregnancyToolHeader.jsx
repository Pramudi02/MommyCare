import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PregnancyToolHeader.css';

const PregnancyToolHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pregnancyTools = [
    { 
      id: 'due-date-calculator',
      title: 'Due Date Calculator', 
      path: '/mom/pregnancy-tracker/due-date-calculator',
      icon: '/images/6.png'
    },
    { 
      id: 'baby-name-finder',
      title: 'Baby Names Finder', 
      path: '/mom/pregnancy-tracker/baby-name-finder',
      icon:'/images/7.png'
    },
    { 
      id: 'weight-gain-calculator',
      title: 'Pregnancy Weight Gain Calculator', 
      path: '/mom/pregnancy-tracker/weight-gain-calculator',
      icon: '/images/8.png'
    },
    { 
      id: 'birth-plan-worksheet',
      title: 'Birth Plan Worksheet', 
      path: '/mom/pregnancy-tracker/birth-plan-worksheet',
      icon:'/images/9.png'
    },
    { 
      id: 'chinese-gender-predictor',
      title: 'Chinese Gender Predictor', 
      path: '/mom/pregnancy-tracker/chinese-gender-predictor',
      icon: '/images/10.png'
    },
    { 
      id: 'registry',
      title: 'Registry', 
      path: '/mom/pregnancy-tracker/registry',
      icon: '/images/11.png'
    }
  ];

  const handleToolClick = (tool) => {
    navigate(tool.path);
  };

  const isActive = (toolPath) => {
    return location.pathname === toolPath;
  };

  return (
    <div className="pregnancy-tools-header">
      <div className="pregnancy-tools-container">
        <h2 className="pregnancy-tools-title">Pregnancy tools</h2>
        <div className="pregnancy-tools-grid">
          {pregnancyTools.map((tool) => (
            <div
              key={tool.id}
              className={`pregnancy-tool-card ${isActive(tool.path) ? 'active' : ''}`}
              onClick={() => handleToolClick(tool)}
            >
              <div className="tool-icon">
                {tool.icon.startsWith('/images') ? (
                  <img src={tool.icon} alt={tool.title} className="tool-image" />
                ) : (
                  <span className="tool-emoji">{tool.icon}</span>
                )}
              </div>
              <h3 className="tool-title">{tool.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PregnancyToolHeader;
