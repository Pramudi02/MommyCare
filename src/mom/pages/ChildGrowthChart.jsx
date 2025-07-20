import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Scatter } from 'recharts';
import { Calculator, TrendingUp, Activity, AlertCircle, BarChart3 } from 'lucide-react';
import './ChildGrowthChart.css';

// Sample growth data for different percentiles (WHO standards)
const growthData = [
  { age: 0, p3: 2.5, p10: 2.9, p25: 3.2, p50: 3.5, p75: 3.9, p90: 4.2, p97: 4.6 },
  { age: 1, p3: 3.4, p10: 3.9, p25: 4.3, p50: 4.7, p75: 5.2, p90: 5.6, p97: 6.1 },
  { age: 2, p3: 4.3, p10: 4.9, p25: 5.4, p50: 5.9, p75: 6.5, p90: 7.0, p97: 7.6 },
  { age: 3, p3: 5.0, p10: 5.7, p25: 6.2, p50: 6.8, p75: 7.5, p90: 8.1, p97: 8.8 },
  { age: 4, p3: 5.6, p10: 6.3, p25: 6.9, p50: 7.6, p75: 8.3, p90: 9.0, p97: 9.8 },
  { age: 5, p3: 6.1, p10: 6.9, p25: 7.5, p50: 8.2, p75: 9.0, p90: 9.8, p97: 10.6 },
  { age: 6, p3: 6.5, p10: 7.3, p25: 8.0, p50: 8.8, p75: 9.6, p90: 10.4, p97: 11.3 },
  { age: 7, p3: 6.9, p10: 7.7, p25: 8.4, p50: 9.2, p75: 10.1, p90: 11.0, p97: 12.0 },
  { age: 8, p3: 7.2, p10: 8.1, p25: 8.8, p50: 9.6, p75: 10.6, p90: 11.5, p97: 12.5 },
  { age: 9, p3: 7.5, p10: 8.4, p25: 9.2, p50: 10.0, p75: 11.0, p90: 12.0, p97: 13.1 },
  { age: 10, p3: 7.8, p10: 8.7, p25: 9.5, p50: 10.4, p75: 11.4, p90: 12.4, p97: 13.6 },
  { age: 11, p3: 8.1, p10: 9.0, p25: 9.8, p50: 10.7, p75: 11.8, p90: 12.8, p97: 14.0 },
  { age: 12, p3: 8.3, p10: 9.2, p25: 10.1, p50: 11.0, p75: 12.1, p90: 13.2, p97: 14.5 }
];

const ChildGrowthChart = () => {
  const [babyData, setBabyData] = useState({
    gender: 'male',
    birthDate: '',
    measurementDate: '',
    weight: '',
    height: '',
    headCircumference: ''
  });

  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('weight');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const calculateAge = (birthDate, measurementDate) => {
    const birth = new Date(birthDate);
    const measurement = new Date(measurementDate);
    const diffTime = Math.abs(measurement - birth);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
    return diffMonths;
  };

  const calculatePercentile = (value, ageMonths) => {
    const ageData = growthData.find(d => d.age === ageMonths) || growthData[growthData.length - 1];
    
    if (value <= ageData.p3) return 3;
    if (value <= ageData.p10) return 10;
    if (value <= ageData.p25) return 25;
    if (value <= ageData.p50) return 50;
    if (value <= ageData.p75) return 75;
    if (value <= ageData.p90) return 90;
    return 97;
  };

  const handleCalculate = () => {
    if (!babyData.birthDate || !babyData.measurementDate || !babyData.weight) {
      alert('Please fill in required fields');
      return;
    }

    const ageMonths = calculateAge(babyData.birthDate, babyData.measurementDate);
    const weightPercentile = calculatePercentile(parseFloat(babyData.weight), ageMonths);
    const heightPercentile = babyData.height ? calculatePercentile(parseFloat(babyData.height), ageMonths) : null;

    setResults({
      ageMonths,
      weightPercentile,
      heightPercentile,
      status: weightPercentile < 10 ? 'Below Average' : weightPercentile > 90 ? 'Above Average' : 'Normal Range'
    });
  };

  const faqs = [
    {
      question: "What do growth percentiles mean?",
      answer: "Growth percentiles compare your child's measurements to other children of the same age and gender. A 50th percentile means your child is average, while 90th percentile means they're larger than 90% of children their age."
    },
    {
      question: "Should I be worried if my baby is in a low percentile?",
      answer: "Not necessarily. What matters most is consistent growth along their own curve. Consult your pediatrician if there are sudden changes or concerns."
    },
    {
      question: "How often should I measure my baby's growth?",
      answer: "Regular pediatric visits typically include growth measurements. At home, monthly measurements can help track progress between visits."
    },
    {
      question: "How accurate are home measurements?",
      answer: "While helpful for tracking trends, professional measurements at your pediatrician's office are most accurate for medical decisions."
    },
    {
      question: "When should I contact my pediatrician about growth concerns?",
      answer: "Contact your pediatrician if growth suddenly slows, stops, or if your child drops significantly across percentile lines."
    },
    {
      question: "Why is head circumference important?",
      answer: "Head circumference reflects brain growth and development. Consistent tracking helps identify potential developmental concerns early."
    }
  ];

  return (
    <div className="child-growth-chart">
        {/* Header */}
      <div className="glass-header">
        <h1>
          <BarChart3 className="header-icon" style={"margin-right: 15px;"} />
          Baby Growth Chart & Percentile Calculator
        </h1>
        <p>Track your baby's growth with our comprehensive percentile calculator and interactive charts</p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="feature-card">
            <div className="flex items-center mb-4">
            <TrendingUp className="w-8 h-8 text-white mr-3" />
            <h3>Growth Tracking</h3>
          </div>
          <p>Monitor your baby's height, weight and head circumference against WHO standards to ensure healthy development patterns.</p>
          </div>

        <div className="feature-card">
            <div className="flex items-center mb-4">
            <Calculator className="w-8 h-8 text-white mr-3" />
            <h3>Percentile Analysis</h3>
          </div>
          <p>Understand where your baby stands compared to peers of the same age and gender with detailed percentile calculations.</p>
          </div>

        <div className="feature-card">
            <div className="flex items-center mb-4">
            <Activity className="w-8 h-8 text-white mr-3" />
            <h3>Medical Guidance</h3>
          </div>
          <p>Get best-practice regular pediatric guidance for comprehensive growth monitoring and milestone tracking.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Baby Information Form */}
          <div className="lg:col-span-1">
          <div className="glass-form">
            <h2>Baby Information</h2>
              
              <div className="space-y-4">
                <div>
                <label className="glass-label">Gender</label>
                  <select 
                    value={babyData.gender}
                    onChange={(e) => setBabyData({...babyData, gender: e.target.value})}
                  className="glass-select"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                <label className="glass-label">Date</label>
                  <input 
                    type="date"
                    value={babyData.birthDate}
                    onChange={(e) => setBabyData({...babyData, birthDate: e.target.value})}
                  className="glass-input"
                  />
                </div>

                <div>
                <label className="glass-label">Date of Measurement</label>
                  <input 
                    type="date"
                    value={babyData.measurementDate}
                    onChange={(e) => setBabyData({...babyData, measurementDate: e.target.value})}
                  className="glass-input"
                  />
                </div>

                <div>
                <label className="glass-label">Weight</label>
                  <div className="flex gap-2">
                    <input 
                      type="number"
                      step="0.1"
                      placeholder="Enter weight"
                      value={babyData.weight}
                      onChange={(e) => setBabyData({...babyData, weight: e.target.value})}
                    className="glass-input flex-1"
                    />
                  <select className="glass-select">
                      <option>Pounds</option>
                      <option>Ounces</option>
                    </select>
                  </div>
                </div>

                <div>
                <label className="glass-label">Height/Length (inches)</label>
                  <div className="flex gap-2">
                    <input 
                      type="number"
                      step="0.1"
                      placeholder="Enter height in inches"
                      value={babyData.height}
                      onChange={(e) => setBabyData({...babyData, height: e.target.value})}
                    className="glass-input flex-1"
                    />
                  <select className="glass-select">
                      <option>Feet and Inches</option>
                    </select>
                  </div>
                </div>

                <div>
                <label className="glass-label">Head Circumference (cm)</label>
                  <input 
                    type="number"
                    step="0.1"
                    placeholder="Enter head circumference in cm"
                    value={babyData.headCircumference}
                    onChange={(e) => setBabyData({...babyData, headCircumference: e.target.value})}
                  className="glass-input"
                  />
                </div>

                <button 
                  onClick={handleCalculate}
                className="glass-button"
                >
                  Calculate Percentiles
                </button>
              </div>

              {results && (
              <div className="results-card">
                <h3>Results</h3>
                <p>Age: {results.ageMonths} months</p>
                <p>Weight Percentile: {results.weightPercentile}%</p>
                  {results.heightPercentile && (
                  <p>Height Percentile: {results.heightPercentile}%</p>
                  )}
                <p className="font-medium mt-2">Status: {results.status}</p>
                </div>
              )}
            </div>
          </div>

          {/* Growth Chart */}
          <div className="lg:col-span-2">
          <div className="chart-container">
            <h2>Growth Chart Visualization</h2>
              
              {/* Chart Tab Navigation */}
              <div className="flex space-x-4 mb-6">
                <button 
                  onClick={() => setActiveTab('weight')}
                className={`tab-button ${activeTab === 'weight' ? 'active' : ''}`}
                >
                Weight For Age 
                </button>
                <button 
                  onClick={() => setActiveTab('height')}
                className={`tab-button ${activeTab === 'height' ? 'active' : ''}`}
                >
                  Height For Age
                </button>
              </div>

              {/* Growth Chart */}
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                    <XAxis 
                      dataKey="age" 
                      axisLine={false}
                      tickLine={false}
                    tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.8)' }}
                    label={{ value: 'Age (in months)', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontSize: 12, fill: 'rgba(255,255,255,0.8)' } }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                    tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.8)' }}
                    label={{ value: activeTab === 'weight' ? 'Weight (kg)' : 'Height (cm)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 12, fill: 'rgba(255,255,255,0.8)' } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                      backgroundColor: 'rgba(255,255,255,0.9)', 
                      border: '1px solid rgba(255,255,255,0.3)', 
                        borderRadius: '8px',
                      fontSize: '12px',
                      color: '#333'
                      }}
                    />
                    
                    {/* Percentile Lines */}
                    <Line type="monotone" dataKey="p3" stroke="#dc2626" strokeWidth={1} dot={false} name="3rd Percentile" />
                    <Line type="monotone" dataKey="p10" stroke="#ea580c" strokeWidth={1} dot={false} name="10th Percentile" />
                    <Line type="monotone" dataKey="p25" stroke="#ca8a04" strokeWidth={1} dot={false} name="25th Percentile" />
                    <Line type="monotone" dataKey="p50" stroke="#059669" strokeWidth={2} dot={false} name="50th Percentile" />
                    <Line type="monotone" dataKey="p75" stroke="#0891b2" strokeWidth={1} dot={false} name="75th Percentile" />
                    <Line type="monotone" dataKey="p90" stroke="#7c3aed" strokeWidth={1} dot={false} name="90th Percentile" />
                    <Line type="monotone" dataKey="p97" stroke="#be185d" strokeWidth={1} dot={false} name="97th Percentile" />

                  {/* User Data Point as Scatter */}
                  {results && (
                    <Scatter
                      data={[
                        {
                          age: results.ageMonths,
                          value: activeTab === 'weight' ? parseFloat(babyData.weight) : babyData.height ? parseFloat(babyData.height) : null
                        }
                      ]}
                      fill="#fff"
                      stroke="#059669"
                      strokeWidth={3}
                      shape="circle"
                      name="Your Baby"
                      {...(activeTab === 'weight' ? { yAxisId: 0, dataKey: 'value' } : { yAxisId: 0, dataKey: 'value' })}
                    />
                  )}
                    {results && (
                      <ReferenceLine 
                        x={results.ageMonths} 
                      stroke="rgba(255,255,255,0.8)" 
                        strokeDasharray="5 5" 
                      label={{ value: "Your Baby", position: "topRight", fill: "rgba(255,255,255,0.8)" }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
            <div className="chart-legend">
              <div className="legend-item"><div className="legend-color bg-red-600"></div>3rd Percentile</div>
              <div className="legend-item"><div className="legend-color bg-orange-600"></div>10th Percentile</div>
              <div className="legend-item"><div className="legend-color bg-yellow-600"></div>25th Percentile</div>
              <div className="legend-item"><div className="legend-color bg-green-600"></div>50th Percentile</div>
              <div className="legend-item"><div className="legend-color bg-cyan-600"></div>75th Percentile</div>
              <div className="legend-item"><div className="legend-color bg-purple-600"></div>90th Percentile</div>
              <div className="legend-item"><div className="legend-color bg-pink-600"></div>97th Percentile</div>
              <div className="legend-item"><div className="legend-color" style={{background:'#059669', border:'2px solid #fff'}}></div>Your Baby</div>
            </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                className="faq-question w-full flex justify-between items-center"
                >
                <span>{faq.question}</span>
                <span className="text-2xl">
                    {expandedFAQ === index ? '−' : '+'}
                  </span>
                </button>
                {expandedFAQ === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChildGrowthChart;