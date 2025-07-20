

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PregnancyToolHeader.css';

const PregnancyTools = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pregnancyTools = [
    { 
      emoji: '📅', 
      title: 'Due Date Calculator', 
      color: 'tool-orange',
      path: '/mom/pregnancy-tracker/due-date-calculator'
    },
    { 
      emoji: '👶', 
      title: 'Baby Names Finder', 
      color: 'tool-emerald',
      path: '/mom/pregnancy-tracker/baby-name-finder'
    },
    { 
      emoji: '📈', 
      title: 'Pregnancy Weight Gain Calculator', 
      color: 'tool-blue',
      path: '/mom/pregnancy-tracker/weight-gain-calculator'
    },
    { 
      emoji: '📝', 
      title: 'Birth Plan Worksheet', 
      color: 'tool-yellow',
      path: '/mom/pregnancy-tracker/birth-plan-worksheet'
    },
    { 
      emoji: '🔮', 
      title: 'Chinese Gender Predictor', 
      color: 'tool-pink',
      path: '/mom/pregnancy-tracker/chinese-gender-predictor'
    },
    { 
      emoji: '🎁', 
      title: 'Registry', 
      color: 'tool-green',
      path: '/mom/pregnancy-tracker/registry'
    }
  ];

  const handleToolClick = (tool) => {
    navigate(tool.path);
  };

  const isActive = (toolPath) => {
    return location.pathname === toolPath;
  };

  return (
    <div className="pregnancy-tools-section">
      <h2 className="section-title">Pregnancy tools</h2>
      <div className="tools-grid">
        {pregnancyTools.map((tool, index) => (
          <div 
            key={index} 
            className={`tool-card ${isActive(tool.path) ? 'active' : ''}`}
            onClick={() => handleToolClick(tool)}
            style={{ cursor: 'pointer' }}
          >
            <div className={`tool-icon ${tool.color}`}>
              <span className="tool-emoji">{tool.emoji}</span>
            </div>
            <span className="tool-title">{tool.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PregnancyTools;