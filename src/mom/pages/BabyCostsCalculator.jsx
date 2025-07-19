import React, { useState, useEffect } from 'react';
import { 
  Baby, 
  Droplets, 
  Shirt, 
  Bed, 
  Heart, 
  Car, 
  Calculator,
  DollarSign,
  TrendingUp,
  Lightbulb
} from 'lucide-react';
import './BabyCostsCalculator.css';

const BabyCostsCalculator = () => {
  const [currentAge, setCurrentAge] = useState('0-3months');
  const [itemCosts, setItemCosts] = useState({});

  // Data structure for baby costs by age group
  const babyCostData = {
    '0-3months': {
      feeding: [
        { name: 'Baby Formula', description: 'Monthly supply', cost: 150, priority: 'essential' },
        { name: 'Bottles & Nipples', description: '6-8 bottles set', cost: 60, priority: 'essential' },
        { name: 'Burp Cloths', description: 'Set of 10', cost: 25, priority: 'essential' },
        { name: 'Bottle Sterilizer', description: 'Electric sterilizer', cost: 80, priority: 'optional' }
      ],
      diapering: [
        { name: 'Newborn Diapers', description: 'Monthly supply (300 diapers)', cost: 120, priority: 'essential' },
        { name: 'Baby Wipes', description: 'Monthly supply', cost: 40, priority: 'essential' },
        { name: 'Diaper Bag', description: 'Multi-compartment bag', cost: 75, priority: 'essential' },
        { name: 'Changing Pad', description: 'Portable changing pad', cost: 35, priority: 'essential' }
      ],
      clothing: [
        { name: 'Onesies (0-3m)', description: '10-pack basic onesies', cost: 45, priority: 'essential' },
        { name: 'Sleepers (0-3m)', description: '6-pack sleep suits', cost: 60, priority: 'essential' },
        { name: 'Socks & Mittens', description: 'Essential accessories', cost: 25, priority: 'essential' },
        { name: 'Going Home Outfit', description: 'Special occasion wear', cost: 40, priority: 'optional' }
      ],
      sleep: [
        { name: 'Crib & Mattress', description: 'Standard crib with mattress', cost: 400, priority: 'essential' },
        { name: 'Crib Sheets', description: 'Set of 4 fitted sheets', cost: 50, priority: 'essential' },
        { name: 'Baby Monitor', description: 'Video baby monitor', cost: 150, priority: 'essential' },
        { name: 'Swaddle Blankets', description: 'Set of 4 swaddles', cost: 40, priority: 'essential' }
      ],
      health: [
        { name: 'Pediatric Checkups', description: 'First 3 months visits', cost: 300, priority: 'essential' },
        { name: 'Baby Thermometer', description: 'Digital thermometer', cost: 25, priority: 'essential' },
        { name: 'Baby Bath Set', description: 'Tub, soap, shampoo', cost: 45, priority: 'essential' },
        { name: 'First Aid Kit', description: 'Baby-specific supplies', cost: 35, priority: 'optional' }
      ],
      travel: [
        { name: 'Car Seat (Infant)', description: 'Rear-facing car seat', cost: 200, priority: 'essential' },
        { name: 'Stroller', description: 'Lightweight stroller', cost: 250, priority: 'essential' },
        { name: 'Baby Carrier', description: 'Front-facing carrier', cost: 80, priority: 'optional' }
      ]
    },
    '3-6months': {
      feeding: [
        { name: 'High Chair', description: 'Adjustable high chair', cost: 120, priority: 'essential' },
        { name: 'Baby Food Maker', description: 'Steam & blend food processor', cost: 100, priority: 'optional' },
        { name: 'Sippy Cups', description: 'Transition cups set', cost: 30, priority: 'essential' },
        { name: 'Baby Spoons & Bowls', description: 'Feeding utensils set', cost: 25, priority: 'essential' }
      ],
      clothing: [
        { name: 'Clothing (3-6m)', description: 'Size transition wardrobe', cost: 100, priority: 'essential' },
        { name: 'Bibs', description: 'Set of 8 feeding bibs', cost: 20, priority: 'essential' },
        { name: 'Seasonal Outerwear', description: 'Jacket/sweaters', cost: 60, priority: 'essential' }
      ],
      sleep: [
        { name: 'Sleep Training Tools', description: 'Noise machine, blackout curtains', cost: 80, priority: 'optional' }
      ],
      health: [
        { name: 'Vaccination Schedule', description: '3-6 month shots', cost: 200, priority: 'essential' },
        { name: 'Teething Toys', description: 'Safe teething relief', cost: 30, priority: 'essential' }
      ]
    },
    '6-12months': {
      feeding: [
        { name: 'Baby Food', description: 'Monthly solid food supply', cost: 80, priority: 'essential' },
        { name: 'Training Cups', description: 'Advanced sippy cups', cost: 35, priority: 'essential' }
      ],
      clothing: [
        { name: 'Clothing (6-12m)', description: 'Growing baby wardrobe', cost: 120, priority: 'essential' },
        { name: 'Shoes', description: 'First walking shoes', cost: 45, priority: 'essential' }
      ],
      sleep: [
        { name: 'Toddler Mattress', description: 'Firmer mattress upgrade', cost: 150, priority: 'optional' }
      ],
      health: [
        { name: 'Regular Checkups', description: '6-12 month visits', cost: 250, priority: 'essential' },
        { name: 'Baby Proofing', description: 'Safety gates, outlet covers', cost: 100, priority: 'essential' }
      ],
      travel: [
        { name: 'Convertible Car Seat', description: 'Forward-facing transition', cost: 300, priority: 'essential' }
      ]
    },
    '1-2years': {
      feeding: [
        { name: 'Toddler Meals', description: 'Monthly food costs', cost: 100, priority: 'essential' },
        { name: 'Toddler Utensils', description: 'Self-feeding tools', cost: 20, priority: 'essential' }
      ],
      clothing: [
        { name: 'Toddler Clothing', description: '12-24 month sizes', cost: 150, priority: 'essential' },
        { name: 'Winter Gear', description: 'Coat, boots, hat, gloves', cost: 80, priority: 'essential' }
      ],
      health: [
        { name: 'Annual Checkups', description: 'Toddler health visits', cost: 200, priority: 'essential' },
        { name: 'Dental Care', description: 'First dental visit', cost: 100, priority: 'essential' }
      ]
    },
    '2-3years': {
      feeding: [
        { name: 'Toddler Nutrition', description: 'Balanced meal planning', cost: 120, priority: 'essential' }
      ],
      clothing: [
        { name: 'Potty Training', description: 'Training pants, potty', cost: 60, priority: 'essential' },
        { name: 'Big Kid Clothes', description: '2T-3T wardrobe', cost: 130, priority: 'essential' }
      ],
      sleep: [
        { name: 'Toddler Bed', description: 'Transition from crib', cost: 200, priority: 'essential' }
      ],
      health: [
        { name: 'Preschool Prep', description: 'Health requirements', cost: 150, priority: 'essential' }
      ]
    }
  };

  const categoryIcons = {
    feeding: Droplets,
    diapering: Baby,
    clothing: Shirt,
    sleep: Bed,
    health: Heart,
    travel: Car
  };

  const ageTabs = [
    { id: '0-3months', label: '0-3 Months' },
    { id: '3-6months', label: '3-6 Months' },
    { id: '6-12months', label: '6-12 Months' },
    { id: '1-2years', label: '1-2 Years' },
    { id: '2-3years', label: '2-3 Years' }
  ];

  const handleAgeChange = (age) => {
    setCurrentAge(age);
  };

  const handleCostChange = (itemKey, value) => {
    setItemCosts(prev => ({
      ...prev,
      [itemKey]: parseFloat(value) || 0
    }));
  };

  const calculateTotals = () => {
    const data = babyCostData[currentAge];
    let totalCost = 0;
    const categoryTotals = {};

    Object.keys(data).forEach(categoryKey => {
      categoryTotals[categoryKey] = 0;
      data[categoryKey].forEach((item, index) => {
        const itemKey = `${currentAge}-${categoryKey}-${index}`;
        const cost = itemCosts[itemKey] || item.cost;
        categoryTotals[categoryKey] += cost;
        totalCost += cost;
      });
    });

    return { totalCost, categoryTotals };
  };

  const { totalCost, categoryTotals } = calculateTotals();

  return (
    <div className="container">
      <div className="header">
        <h1><Baby className="header-icon" /> Baby Cost Calculator</h1>
        <p>Plan your baby's expenses with our comprehensive cost tracker</p>
      </div>

      <div className="main-content">
        <div className="calculator-section">
          <div className="age-selector">
            <div className="age-tabs">
              {ageTabs.map(tab => (
                <div
                  key={tab.id}
                  className={`age-tab ${currentAge === tab.id ? 'active' : ''}`}
                  onClick={() => handleAgeChange(tab.id)}
                >
                  {tab.label}
                </div>
              ))}
            </div>
          </div>

          <div className="categories-grid">
            {Object.keys(babyCostData[currentAge]).map(categoryKey => {
              const category = babyCostData[currentAge][categoryKey];
              const IconComponent = categoryIcons[categoryKey];
              return (
                <div key={categoryKey} className={`category-card ${categoryKey}`}>
                  <div className="category-header">
                    <div className="category-icon">
                      <IconComponent className="category-icon-svg" />
                    </div>
                    <div className="category-title">
                      {categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}
                    </div>
                  </div>
                  <div className="item-list">
                    {category.map((item, index) => {
                      const itemKey = `${currentAge}-${categoryKey}-${index}`;
                      const currentCost = itemCosts[itemKey] || item.cost;
                      
                      return (
                        <div key={index} className="cost-item">
                          <div className="item-info">
                            <div className="item-name">{item.name}</div>
                            <div className="item-description">{item.description}</div>
                          </div>
                          <div className="item-controls">
                            <span className={`priority-badge priority-${item.priority}`}>
                              {item.priority}
                            </span>
                            <input
                              type="number"
                              className="cost-input"
                              value={currentCost}
                              onChange={(e) => handleCostChange(itemKey, e.target.value)}
                              min="0"
                              step="5"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="summary-panel">
          <h3 className="summary-title"><DollarSign className="summary-icon" /> Cost Summary</h3>
          
          <div className="total-cost">
            <div className="total-amount">${totalCost.toLocaleString()}</div>
            <div className="total-label">Total Estimated Cost</div>
          </div>

          <div className="breakdown-section">
            <h4 className="breakdown-title">Category Breakdown</h4>
            <div>
              {Object.keys(categoryTotals).map(category => (
                <div key={category} className="breakdown-item">
                  <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  <span>${categoryTotals[category].toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="savings-plan">
            <h4 className="savings-title"><Lightbulb className="savings-icon" /> Budget Planning</h4>
            <div className="monthly-savings">
              <div style={{ fontSize: '1.1rem', color: '#96ceb4', marginBottom: '10px' }}>
                <TrendingUp className="trending-icon" /> Total: {totalCost.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                Consider spreading purchases across pregnancy months
              </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '10px', opacity: 0.8, fontSize: '0.9rem' }}>
              Smart spending for new parents
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BabyCostsCalculator;
