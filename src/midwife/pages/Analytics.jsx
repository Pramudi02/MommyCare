import React, { useState } from 'react';
import './Reports.css';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('month');

  const reportData = {
    overview: {
      totalMoms: 24,
      activePregnancies: 20,
      deliveriesThisMonth: 4,
      upcomingDeliveries: 3,
      averageAge: 28.5,
      mostCommonBloodType: "O+"
    },
    appointments: {
      totalAppointments: 156,
      completed: 142,
      cancelled: 8,
      pending: 6,
      averageDuration: 35,
      mostCommonType: "Prenatal Checkup"
    },
    healthMetrics: {
      averageWeightGain: 12.5,
      averageBloodPressure: "118/78",
      gestationalDiabetes: 2,
      preeclampsia: 1,
      normalDeliveries: 18,
      cSections: 2
    }
  };

  const generateReport = (type) => {
    console.log(`Generating ${type} report for ${dateRange}`);
    // In a real app, this would generate and download a report
  };

  const getReportIcon = (type) => {
    const icons = {
      overview: "📊",
      appointments: "📅",
      health: "🏥",
      deliveries: "👶",
      financial: "💰",
      emergency: "🚨"
    };
    return icons[type] || "📋";
  };

  const getReportTitle = (type) => {
    const titles = {
      overview: "Overview Report",
      appointments: "Appointments Report",
      health: "Health Metrics Report",
      deliveries: "Deliveries Report",
      financial: "Financial Report",
      emergency: "Emergency Cases Report"
    };
    return titles[type] || "Report";
  };

  const getReportDescription = (type) => {
    const descriptions = {
      overview: "Comprehensive overview of all patients and activities",
      appointments: "Detailed analysis of appointment scheduling and completion",
      health: "Health metrics and pregnancy progress tracking",
      deliveries: "Delivery statistics and outcomes analysis",
      financial: "Revenue and cost analysis for the practice",
      emergency: "Emergency cases and response time analysis"
    };
    return descriptions[type] || "Report description";
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div className="reports-title">
          <h1>Reports & Analytics 📈</h1>
          <p>Generate comprehensive reports and view healthcare analytics</p>
        </div>
        <div className="reports-controls">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="date-range-selector"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="reports-content">
        {/* Report Types */}
        <div className="report-types">
          <h3>Available Reports</h3>
          <div className="report-grid">
            {['overview', 'appointments', 'health', 'deliveries', 'financial', 'emergency'].map((type) => (
              <div 
                key={type}
                className={`report-card ${selectedReport === type ? 'active' : ''}`}
                onClick={() => setSelectedReport(type)}
              >
                <div className="report-icon">{getReportIcon(type)}</div>
                <div className="report-info">
                  <h4>{getReportTitle(type)}</h4>
                  <p>{getReportDescription(type)}</p>
                </div>
                <button 
                  className="generate-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    generateReport(type);
                  }}
                >
                  Generate
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Report Preview */}
        <div className="report-preview">
          <div className="preview-header">
            <h2>{getReportTitle(selectedReport)}</h2>
            <div className="preview-actions">
              <button className="action-btn">
                <span>📥</span>
                Download PDF
              </button>
              <button className="action-btn">
                <span>📊</span>
                Export Data
              </button>
              <button className="action-btn">
                <span>📧</span>
                Email Report
              </button>
            </div>
          </div>

          <div className="preview-content">
            {selectedReport === 'overview' && (
              <div className="overview-report">
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-icon">👩‍👶</div>
                    <div className="metric-content">
                      <h3>Total Patients</h3>
                      <div className="metric-value">{reportData.overview.totalMoms}</div>
                      <div className="metric-change">+3 from last month</div>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">🤱</div>
                    <div className="metric-content">
                      <h3>Active Pregnancies</h3>
                      <div className="metric-value">{reportData.overview.activePregnancies}</div>
                      <div className="metric-change">+2 from last month</div>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">👶</div>
                    <div className="metric-content">
                      <h3>Deliveries This Month</h3>
                      <div className="metric-value">{reportData.overview.deliveriesThisMonth}</div>
                      <div className="metric-change">+1 from last month</div>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">📅</div>
                    <div className="metric-content">
                      <h3>Upcoming Deliveries</h3>
                      <div className="metric-value">{reportData.overview.upcomingDeliveries}</div>
                      <div className="metric-change">Next 2 weeks</div>
                    </div>
                  </div>
                </div>

                <div className="charts-section">
                  <div className="chart-card">
                    <h4>Patient Demographics</h4>
                    <div className="chart-placeholder">
                      <div className="chart-bar" style={{ height: '60%', backgroundColor: '#667eea' }}>
                        <span>Age 25-30</span>
                      </div>
                      <div className="chart-bar" style={{ height: '40%', backgroundColor: '#764ba2' }}>
                        <span>Age 31-35</span>
                      </div>
                      <div className="chart-bar" style={{ height: '20%', backgroundColor: '#f093fb' }}>
                        <span>Age 36+</span>
                      </div>
                    </div>
                  </div>
                  <div className="chart-card">
                    <h4>Blood Type Distribution</h4>
                    <div className="pie-chart-placeholder">
                      <div className="pie-segment" style={{ transform: 'rotate(0deg)', backgroundColor: '#667eea' }}></div>
                      <div className="pie-segment" style={{ transform: 'rotate(120deg)', backgroundColor: '#764ba2' }}></div>
                      <div className="pie-segment" style={{ transform: 'rotate(240deg)', backgroundColor: '#f093fb' }}></div>
                      <div className="pie-center">O+</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedReport === 'appointments' && (
              <div className="appointments-report">
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-icon">📅</div>
                    <div className="metric-content">
                      <h3>Total Appointments</h3>
                      <div className="metric-value">{reportData.appointments.totalAppointments}</div>
                      <div className="metric-change">This month</div>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">✅</div>
                    <div className="metric-content">
                      <h3>Completed</h3>
                      <div className="metric-value">{reportData.appointments.completed}</div>
                      <div className="metric-change">91% completion rate</div>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">⏰</div>
                    <div className="metric-content">
                      <h3>Average Duration</h3>
                      <div className="metric-value">{reportData.appointments.averageDuration} min</div>
                      <div className="metric-change">Per appointment</div>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">🏥</div>
                    <div className="metric-content">
                      <h3>Most Common Type</h3>
                      <div className="metric-value">{reportData.appointments.mostCommonType}</div>
                      <div className="metric-change">45% of appointments</div>
                    </div>
                  </div>
                </div>

                <div className="appointment-timeline">
                  <h4>Appointment Trends</h4>
                  <div className="timeline-chart">
                    {[1, 2, 3, 4].map((week) => (
                      <div key={week} className="week-bar">
                        <div className="bar-label">Week {week}</div>
                        <div className="bar-container">
                          <div 
                            className="bar-fill" 
                            style={{ height: `${60 + Math.random() * 40}%` }}
                          ></div>
                        </div>
                        <div className="bar-value">{Math.floor(15 + Math.random() * 10)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedReport === 'health' && (
              <div className="health-report">
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-icon">⚖️</div>
                    <div className="metric-content">
                      <h3>Avg Weight Gain</h3>
                      <div className="metric-value">{reportData.healthMetrics.averageWeightGain} kg</div>
                      <div className="metric-change">Normal range</div>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">❤️</div>
                    <div className="metric-content">
                      <h3>Avg Blood Pressure</h3>
                      <div className="metric-value">{reportData.healthMetrics.averageBloodPressure}</div>
                      <div className="metric-change">Healthy range</div>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">👶</div>
                    <div className="metric-content">
                      <h3>Normal Deliveries</h3>
                      <div className="metric-value">{reportData.healthMetrics.normalDeliveries}</div>
                      <div className="metric-change">90% success rate</div>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">🏥</div>
                    <div className="metric-content">
                      <h3>C-Sections</h3>
                      <div className="metric-value">{reportData.healthMetrics.cSections}</div>
                      <div className="metric-change">10% of deliveries</div>
                    </div>
                  </div>
                </div>

                <div className="health-alerts">
                  <h4>Health Alerts</h4>
                  <div className="alerts-list">
                    <div className="alert-item warning">
                      <span className="alert-icon">⚠️</span>
                      <div className="alert-content">
                        <h5>Gestational Diabetes</h5>
                        <p>{reportData.healthMetrics.gestationalDiabetes} cases detected this month</p>
                      </div>
                    </div>
                    <div className="alert-item danger">
                      <span className="alert-icon">🚨</span>
                      <div className="alert-content">
                        <h5>Preeclampsia</h5>
                        <p>{reportData.healthMetrics.preeclampsia} case requiring immediate attention</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 