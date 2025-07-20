

import React from 'react';
import './PregnancyToolHeader.css';

const PregnancyTools = () => {
  const pregnancyTools = [
    { 
      emoji: '📅', 
      title: 'Due Date Calculator', 
      color: 'tool-orange' 
    },
    { 
      emoji: '👶', 
      title: 'Baby Names Finder', 
      color: 'tool-emerald' 
    },
    { 
      emoji: '📈', 
      title: 'Pregnancy Weight Gain Calculator', 
      color: 'tool-blue' 
    },
    { 
      emoji: '📝', 
      title: 'Birth Plan Worksheet', 
      color: 'tool-yellow' 
    },
    { 
      emoji: '🔮', 
      title: 'Chinese Gender Predictor', 
      color: 'tool-pink' 
    },
    { 
      emoji: '🎁', 
      title: 'Registry', 
      color: 'tool-green' 
    }
  ];

  return (
    <div className="pregnancy-tools-section">
      <h2 className="section-title">Pregnancy tools</h2>
      <div className="tools-grid">
        {pregnancyTools.map((tool, index) => (
          <div key={index} className="tool-card">
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