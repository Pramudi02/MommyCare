

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
      icon: '📅'
    },
    { 
      id: 'baby-name-finder',
      title: 'Baby Names Finder', 
      path: '/mom/pregnancy-tracker/baby-name-finder',
      icon: '👶'
    },
    { 
      id: 'weight-gain-calculator',
      title: 'Pregnancy Weight Gain Calculator', 
      path: '/mom/pregnancy-tracker/weight-gain-calculator',
      icon: '📈'
    },
    { 
      id: 'birth-plan-worksheet',
      title: 'Birth Plan Worksheet', 
      path: '/mom/pregnancy-tracker/birth-plan-worksheet',
      icon: '📝'
    },
    { 
      id: 'chinese-gender-predictor',
      title: 'Chinese Gender Predictor', 
      path: '/mom/pregnancy-tracker/chinese-gender-predictor',
      icon: '🔮'
    },
    { 
      id: 'registry',
      title: 'Registry', 
      path: '/mom/pregnancy-tracker/registry',
      icon: '🎁'
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
                <span className="tool-emoji">{tool.icon}</span>
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