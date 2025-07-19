import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BabyToolsHeader.css';

const BabyToolsHeader = () => {
  const navigate = useNavigate();

  const toolsData = [
    {
      id: 'baby-costs-calculator',
      title: 'Baby Costs Calculator',
      path: '/mom/baby-costs-calculator',
      icon: '1.jpeg'
    },
    {
      id: 'maternal-health-hub',
      title: 'Maternal Health Hub',
      path: '/mom/maternal-health-hub',
      icon: '1.jpeg'
    },
    {
      id: 'child-growth-chart',
      title: 'Child Growth Chart',
      path: '/mom/child-growth-chart',
      icon: '1.jpeg'
    },
    {
      id: 'feeding-solutions',
      title: 'Solutions to feeding problems and Meal plan',
      path: '/mom/feeding-solutions',
      icon: '1.jpeg'
    },
    {
      id: 'doctor-visits-guide',
      title: 'Doctor Visits Guide',
      path: '/mom/doctor-visits-guide',
      icon: '1.jpeg'
    }
  ];

  const handleToolClick = (tool) => {
    navigate(tool.path);
  };

  return (
    <div className="baby-tools-header">
      <div className="baby-tools-container">
        <h2 className="baby-tools-title">Baby tools</h2>
        <div className="baby-tools-grid">
          {toolsData.map((tool) => (
            <div
              key={tool.id}
              className="baby-tool-card"
              onClick={() => handleToolClick(tool)}
            >
              <div className="tool-icon">
                <img src="/images/1.jpeg" alt={tool.title} />
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