import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BabyToolsHeader.css';

const BabyToolsHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const toolsData = [
    {
      id: 'baby-costs-calculator',
      title: 'Baby Costs Calculator',
      path: '/mom/baby-costs-calculator',
      icon: '/images/1.png'
    },
    {
      id: 'maternal-health-hub',
      title: 'Maternal Health Hub',
      path: '/mom/maternal-health-hub',
      icon: '/images/2.png'
    },
    {
      id: 'child-growth-chart',
      title: 'Child Growth Chart',
      path: '/mom/child-growth-chart',
      icon: '/images/3.png'
    },
    {
      id: 'feeding-solutions',
      title: 'Solutions to feeding problems and Meal plan',
      path: '/mom/feeding-solutions',
      icon: '/images/4.png'
    },
    {
      id: 'doctor-visits-guide',
      title: 'Doctor Visits Guide',
      path: '/mom/doctor-visits-guide',
      icon: '/images/5.png'
    }
  ];

  const handleToolClick = (tool) => {
    navigate(tool.path);
  };

  const isActive = (toolPath) => {
    return location.pathname === toolPath;
  };

  return (
    <div className="baby-tools-header">
      <div className="baby-tools-container">
        <h2 className="baby-tools-title">Baby tools</h2>
        <div className="baby-tools-grid">
          {toolsData.map((tool) => (
            <div
              key={tool.id}
              className={`baby-tool-card ${isActive(tool.path) ? 'active' : ''}`}
              onClick={() => handleToolClick(tool)}
            >
              <div className="tool-icon">
                <img src={tool.icon} alt={tool.title} />
              </div>
              <h3 className="tool-title">{tool.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BabyToolsHeader;