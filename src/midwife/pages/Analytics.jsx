import React, { useState } from 'react';
import { 
  FiUsers, 
  FiHeart, 
  FiCalendar, 
  FiAlertTriangle, 
  FiDownload, 
  FiBarChart2, 
  FiMail,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiHome,
  FiActivity,
  FiFileText,
  FiAlertCircle
} from 'react-icons/fi';
import './Analytics.css';

const Analytics = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [selectedBloodType, setSelectedBloodType] = useState('all');

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

  // Blood type distribution data with age ranges
  const bloodTypeData = {
    'O+': { total: 35, ageRanges: { '18-25': 12, '26-35': 15, '36+': 8 } },
    'A+': { total: 28, ageRanges: { '18-25': 10, '26-35': 12, '36+': 6 } },
    'B+': { total: 15, ageRanges: { '18-25': 5, '26-35': 7, '36+': 3 } },
    'AB+': { total: 8, ageRanges: { '18-25': 3, '26-35': 4, '36+': 1 } },
    'O-': { total: 7, ageRanges: { '18-25': 2, '26-35': 3, '36+': 2 } },
    'A-': { total: 4, ageRanges: { '18-25': 1, '26-35': 2, '36+': 1 } },
    'B-': { total: 2, ageRanges: { '18-25': 1, '26-35': 1, '36+': 0 } },
    'AB-': { total: 1, ageRanges: { '18-25': 0, '26-35': 1, '36+': 0 } }
  };

  const bloodTypes = ['all', 'O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];

  const generateReport = (type) => {
    console.log(`Generating ${type} report for ${dateRange}`);
    // In a real app, this would generate and download a report
  };

  const getReportIcon = (type) => {
    const icons = {
      overview: <FiBarChart2 />,
      appointments: <FiCalendar />,
      health: <FiHome />,
      deliveries: <FiHeart />,
      emergency: <FiAlertTriangle />
    };
    return icons[type] || <FiFileText />;
  };

  const getReportTitle = (type) => {
    const titles = {
      overview: "Overview Report",
      appointments: "Appointments Report",
      health: "Health Metrics Report",
      deliveries: "Deliveries Report",
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
      emergency: "Emergency cases and response time analysis"
    };
    return descriptions[type] || "Report description";
  };

  // Calculate blood type percentages for pie chart
  const getFilteredBloodTypeData = () => {
    if (selectedBloodType === 'all') {
      return Object.fromEntries(
        Object.entries(bloodTypeData).map(([type, data]) => [type, data.total])
      );
    }
    return { [selectedBloodType]: bloodTypeData[selectedBloodType]?.total || 0 };
  };

  const filteredBloodTypeData = getFilteredBloodTypeData();
  const totalBloodTypeCount = Object.values(filteredBloodTypeData).reduce((sum, count) => sum + count, 0);

  // Map blood type to CSS variable name
  const getBloodTypeColorVar = (type) => {
    const colorMap = {
      'O+': '--analytics-blood-type-Oplus',
      'O-': '--analytics-blood-type-Ominus',
      'A+': '--analytics-blood-type-Aplus',
      'A-': '--analytics-blood-type-Aminus',
      'B+': '--analytics-blood-type-Bplus',
      'B-': '--analytics-blood-type-Bminus',
      'AB+': '--analytics-blood-type-ABplus',
      'AB-': '--analytics-blood-type-ABminus'
    };
    return colorMap[type] || '--analytics-blood-type-Oplus';
  };

  return (
    <div className="analytics-page">
      <div className="analytics-container">
        <div className="analytics-content">
          <div className="analytics-header">
            <div className="analytics-header-icon">
              <FiBarChart2 style={{ fontSize: '1.5rem' }} />
            </div>
            <div className="analytics-title">
              <h1>Reports & Analytics</h1>
              <p>Generate comprehensive reports and view healthcare analytics</p>
            </div>
          </div>

          {/* Report Types */}
          <div className="analytics-report-types">
            <h3>Available Reports</h3>
            <div className="analytics-report-grid">
              {['overview', 'appointments', 'health', 'deliveries', 'emergency'].map((type) => (
                <div 
                  key={type}
                  className={`analytics-report-card ${selectedReport === type ? 'analytics-active' : ''}`}
                  onClick={() => setSelectedReport(type)}
                >
                  <div className="analytics-report-icon">{getReportIcon(type)}</div>
                  <div className="analytics-report-info">
                    <h4>{getReportTitle(type)}</h4>
                    <p>{getReportDescription(type)}</p>
                  </div>
                  <button 
                    className="analytics-generate-btn"
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
          <div className="analytics-report-preview">
            <div className="analytics-preview-header">
              <h2>{getReportTitle(selectedReport)}</h2>
              <div className="analytics-preview-actions">
                <button className="analytics-action-btn">
                  <FiDownload />
                  Download PDF
                </button>
                <button className="analytics-action-btn">
                  <FiBarChart2 />
                  Export Data
                </button>
                <button className="analytics-action-btn">
                  <FiMail />
                  Email Report
                </button>
              </div>
            </div>

            <div className="analytics-preview-content">
              {selectedReport === 'overview' && (
                <div className="analytics-overview-report">
                  <div className="analytics-metrics-grid">
                    <div className="analytics-metric-card analytics-metric-card--blue">
                      <div className="analytics-metric-icon analytics-metric-icon--blue">
                        <FiUsers />
                      </div>
                      <div className="analytics-metric-content">
                        <h3>Total Patients</h3>
                        <div className="analytics-metric-value">{reportData.overview.totalMoms}</div>
                        <div className="analytics-metric-change">+3 from last month</div>
                      </div>
                    </div>
                    <div className="analytics-metric-card analytics-metric-card--purple">
                      <div className="analytics-metric-icon analytics-metric-icon--purple">
                        <FiHeart />
                      </div>
                      <div className="analytics-metric-content">
                        <h3>Active Pregnancies</h3>
                        <div className="analytics-metric-value">{reportData.overview.activePregnancies}</div>
                        <div className="analytics-metric-change">+2 from last month</div>
                      </div>
                    </div>
                    <div className="analytics-metric-card analytics-metric-card--pink">
                      <div className="analytics-metric-icon analytics-metric-icon--pink">
                        <FiHeart />
                      </div>
                      <div className="analytics-metric-content">
                        <h3>Deliveries This Month</h3>
                        <div className="analytics-metric-value">{reportData.overview.deliveriesThisMonth}</div>
                        <div className="analytics-metric-change">+1 from last month</div>
                      </div>
                    </div>
                    <div className="analytics-metric-card analytics-metric-card--red">
                      <div className="analytics-metric-icon analytics-metric-icon--red">
                        <FiCalendar />
                      </div>
                      <div className="analytics-metric-content">
                        <h3>Upcoming Deliveries</h3>
                        <div className="analytics-metric-value">{reportData.overview.upcomingDeliveries}</div>
                        <div className="analytics-metric-change">Next 2 weeks</div>
                      </div>
                    </div>
                  </div>

                  <div className="analytics-charts-section">
                    <div className="analytics-chart-card">
                      <h4>Patient Demographics</h4>
                      <div className="analytics-chart-placeholder">
                        <div className="analytics-chart-bar" style={{ height: '60%', backgroundColor: '#667eea' }}>
                          <span>Age 25-30</span>
                        </div>
                        <div className="analytics-chart-bar" style={{ height: '40%', backgroundColor: '#764ba2' }}>
                          <span>Age 31-35</span>
                        </div>
                        <div className="analytics-chart-bar" style={{ height: '20%', backgroundColor: '#f093fb' }}>
                          <span>Age 36+</span>
                        </div>
                      </div>
                    </div>
                    <div className="analytics-chart-card">
                      <h4>Blood Type Distribution</h4>
                      <div className="analytics-blood-type-filter">
                        <select 
                          value={selectedBloodType} 
                          onChange={(e) => setSelectedBloodType(e.target.value)}
                          className="analytics-blood-type-selector"
                        >
                          {bloodTypes.map(type => (
                            <option key={type} value={type}>
                              {type === 'all' ? 'All Blood Types' : type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="analytics-pie-chart-placeholder">
                        {selectedBloodType === 'all' ? (
                          // Show all blood types when "All Blood Types" is selected
                          <div 
                            className="analytics-pie-chart"
                            style={{
                              background: `conic-gradient(
                                var(${getBloodTypeColorVar('O+')}) 0deg,
                                var(${getBloodTypeColorVar('O+')}) ${(bloodTypeData['O+']?.total / totalBloodTypeCount) * 360}deg,
                                var(${getBloodTypeColorVar('A+')}) ${(bloodTypeData['O+']?.total / totalBloodTypeCount) * 360}deg,
                                var(${getBloodTypeColorVar('A+')}) ${((bloodTypeData['O+']?.total + bloodTypeData['A+']?.total) / totalBloodTypeCount) * 360}deg,
                                var(${getBloodTypeColorVar('B+')}) ${((bloodTypeData['O+']?.total + bloodTypeData['A+']?.total) / totalBloodTypeCount) * 360}deg,
                                var(${getBloodTypeColorVar('B+')}) ${((bloodTypeData['O+']?.total + bloodTypeData['A+']?.total + bloodTypeData['B+']?.total) / totalBloodTypeCount) * 360}deg,
                                var(${getBloodTypeColorVar('AB+')}) ${((bloodTypeData['O+']?.total + bloodTypeData['A+']?.total + bloodTypeData['B+']?.total) / totalBloodTypeCount) * 360}deg,
                                var(${getBloodTypeColorVar('AB+')}) ${((bloodTypeData['O+']?.total + bloodTypeData['A+']?.total + bloodTypeData['B+']?.total + bloodTypeData['AB+']?.total) / totalBloodTypeCount) * 360}deg,
                                var(${getBloodTypeColorVar('O-')}) ${((bloodTypeData['O+']?.total + bloodTypeData['A+']?.total + bloodTypeData['B+']?.total + bloodTypeData['AB+']?.total) / totalBloodTypeCount) * 360}deg,
                                var(${getBloodTypeColorVar('O-')}) ${((bloodTypeData['O+']?.total + bloodTypeData['A+']?.total + bloodTypeData['B+']?.total + bloodTypeData['AB+']?.total + bloodTypeData['O-']?.total) / totalBloodTypeCount) * 360}deg,
                                var(${getBloodTypeColorVar('A-')}) ${((bloodTypeData['O+']?.total + bloodTypeData['A+']?.total + bloodTypeData['B+']?.total + bloodTypeData['AB+']?.total + bloodTypeData['O-']?.total) / totalBloodTypeCount) * 360}deg,
                                var(${getBloodTypeColorVar('A-')}) ${((bloodTypeData['O+']?.total + bloodTypeData['A+']?.total + bloodTypeData['B+']?.total + bloodTypeData['AB+']?.total + bloodTypeData['O-']?.total + bloodTypeData['A-']?.total) / totalBloodTypeCount) * 360}deg,
                                var(${getBloodTypeColorVar('B-')}) ${((bloodTypeData['O+']?.total + bloodTypeData['A+']?.total + bloodTypeData['B+']?.total + bloodTypeData['AB+']?.total + bloodTypeData['O-']?.total + bloodTypeData['A-']?.total) / totalBloodTypeCount) * 360}deg,
                                var(${getBloodTypeColorVar('B-')}) ${((bloodTypeData['O+']?.total + bloodTypeData['A+']?.total + bloodTypeData['B+']?.total + bloodTypeData['AB+']?.total + bloodTypeData['O-']?.total + bloodTypeData['A-']?.total + bloodTypeData['B-']?.total) / totalBloodTypeCount) * 360}deg,
                                var(${getBloodTypeColorVar('AB-')}) ${((bloodTypeData['O+']?.total + bloodTypeData['A+']?.total + bloodTypeData['B+']?.total + bloodTypeData['AB+']?.total + bloodTypeData['O-']?.total + bloodTypeData['A-']?.total + bloodTypeData['B-']?.total) / totalBloodTypeCount) * 360}deg,
                                var(${getBloodTypeColorVar('AB-')}) 360deg
                              )`
                            }}
                          ></div>
                        ) : (
                          // Show age range breakdown when specific blood type is selected
                          <div 
                            className="analytics-pie-chart"
                            style={{
                              background: `conic-gradient(
                                #60a5fa 0deg,
                                #60a5fa ${(bloodTypeData[selectedBloodType]?.ageRanges['18-25'] / bloodTypeData[selectedBloodType]?.total) * 360}deg,
                                #3b82f6 ${(bloodTypeData[selectedBloodType]?.ageRanges['18-25'] / bloodTypeData[selectedBloodType]?.total) * 360}deg,
                                #3b82f6 ${((bloodTypeData[selectedBloodType]?.ageRanges['18-25'] + bloodTypeData[selectedBloodType]?.ageRanges['26-35']) / bloodTypeData[selectedBloodType]?.total) * 360}deg,
                                #1d4ed8 ${((bloodTypeData[selectedBloodType]?.ageRanges['18-25'] + bloodTypeData[selectedBloodType]?.ageRanges['26-35']) / bloodTypeData[selectedBloodType]?.total) * 360}deg,
                                #1d4ed8 360deg
                              )`
                            }}
                          ></div>
                        )}
                        <div className="analytics-pie-center">
                          {selectedBloodType === 'all' ? 'Total' : selectedBloodType}
                        </div>
                      </div>
                      <div className="analytics-blood-type-legend">
                        {selectedBloodType === 'all' ? (
                          // Show all blood types legend
                          Object.entries(filteredBloodTypeData).map(([bloodType, count]) => (
                            <div key={bloodType} className="analytics-legend-item">
                              <div 
                                className="analytics-legend-color" 
                                style={{ backgroundColor: `var(${getBloodTypeColorVar(bloodType)})` }}
                              ></div>
                              <span>{bloodType}: {count}</span>
                            </div>
                          ))
                        ) : (
                          // Show age range breakdown legend
                          <>
                            <div className="analytics-legend-item">
                              <div 
                                className="analytics-legend-color" 
                                style={{ backgroundColor: '#60a5fa' }}
                              ></div>
                              <span>18-25: {bloodTypeData[selectedBloodType]?.ageRanges['18-25'] || 0}</span>
                            </div>
                            <div className="analytics-legend-item">
                              <div 
                                className="analytics-legend-color" 
                                style={{ backgroundColor: '#3b82f6' }}
                              ></div>
                              <span>26-35: {bloodTypeData[selectedBloodType]?.ageRanges['26-35'] || 0}</span>
                            </div>
                            <div className="analytics-legend-item">
                              <div 
                                className="analytics-legend-color" 
                                style={{ backgroundColor: '#1d4ed8' }}
                              ></div>
                              <span>36+: {bloodTypeData[selectedBloodType]?.ageRanges['36+'] || 0}</span>
                            </div>
                          </>
                        )}
                      </div>
                      {selectedBloodType !== 'all' && bloodTypeData[selectedBloodType] && (
                        <div className="analytics-age-range-breakdown">
                          <h5>Age Range Breakdown for {selectedBloodType}</h5>
                          <div className="analytics-age-range-chart">
                            {Object.entries(bloodTypeData[selectedBloodType].ageRanges).map(([ageRange, count]) => (
                              <div key={ageRange} className="analytics-age-range-bar">
                                <div className="analytics-age-range-label">{ageRange}</div>
                                <div className="analytics-age-range-bar-container">
                                  <div 
                                    className="analytics-age-range-bar-fill"
                                    style={{ 
                                      width: `${(count / bloodTypeData[selectedBloodType].total) * 100}%`,
                                      backgroundColor: `var(${getBloodTypeColorVar(selectedBloodType)})`
                                    }}
                                  ></div>
                                </div>
                                <div className="analytics-age-range-count">{count}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selectedReport === 'appointments' && (
                <div className="analytics-appointments-report">
                  <div className="analytics-metrics-grid">
                    <div className="analytics-metric-card">
                      <div className="analytics-metric-icon">
                        <FiCalendar />
                      </div>
                      <div className="analytics-metric-content">
                        <h3>Total Appointments</h3>
                        <div className="analytics-metric-value">{reportData.appointments.totalAppointments}</div>
                        <div className="analytics-metric-change">This month</div>
                      </div>
                    </div>
                    <div className="analytics-metric-card">
                      <div className="analytics-metric-icon">
                        <FiCheckCircle />
                      </div>
                      <div className="analytics-metric-content">
                        <h3>Completed</h3>
                        <div className="analytics-metric-value">{reportData.appointments.completed}</div>
                        <div className="analytics-metric-change">91% completion rate</div>
                      </div>
                    </div>
                    <div className="analytics-metric-card">
                      <div className="analytics-metric-icon">
                        <FiClock />
                      </div>
                      <div className="analytics-metric-content">
                        <h3>Average Duration</h3>
                        <div className="analytics-metric-value">{reportData.appointments.averageDuration} min</div>
                        <div className="analytics-metric-change">Per appointment</div>
                      </div>
                    </div>
                    <div className="analytics-metric-card">
                      <div className="analytics-metric-icon">
                        <FiHome />
                      </div>
                      <div className="analytics-metric-content">
                        <h3>Most Common Type</h3>
                        <div className="analytics-metric-value">{reportData.appointments.mostCommonType}</div>
                        <div className="analytics-metric-change">45% of appointments</div>
                      </div>
                    </div>
                  </div>

                  <div className="analytics-appointment-timeline">
                    <h4>Appointment Trends</h4>
                    <div className="analytics-timeline-chart">
                      {[1, 2, 3, 4].map((week) => (
                        <div key={week} className="analytics-week-bar">
                          <div className="analytics-bar-label">Week {week}</div>
                          <div className="analytics-bar-container">
                            <div 
                              className="analytics-bar-fill" 
                              style={{ height: `${60 + Math.random() * 40}%` }}
                            ></div>
                          </div>
                          <div className="analytics-bar-value">{Math.floor(15 + Math.random() * 10)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedReport === 'health' && (
                <div className="analytics-health-report">
                  <div className="analytics-metrics-grid">
                    <div className="analytics-metric-card">
                      <div className="analytics-metric-icon">
                        <FiActivity />
                      </div>
                      <div className="analytics-metric-content">
                        <h3>Avg Weight Gain</h3>
                        <div className="analytics-metric-value">{reportData.healthMetrics.averageWeightGain} kg</div>
                        <div className="analytics-metric-change">Normal range</div>
                      </div>
                    </div>
                    <div className="analytics-metric-card">
                      <div className="analytics-metric-icon">
                        <FiHeart />
                      </div>
                      <div className="analytics-metric-content">
                        <h3>Avg Blood Pressure</h3>
                        <div className="analytics-metric-value">{reportData.healthMetrics.averageBloodPressure}</div>
                        <div className="analytics-metric-change">Healthy range</div>
                      </div>
                    </div>
                    <div className="analytics-metric-card">
                      <div className="analytics-metric-icon">
                        <FiHeart />
                      </div>
                      <div className="analytics-metric-content">
                        <h3>Normal Deliveries</h3>
                        <div className="analytics-metric-value">{reportData.healthMetrics.normalDeliveries}</div>
                        <div className="analytics-metric-change">90% success rate</div>
                      </div>
                    </div>
                    <div className="analytics-metric-card">
                      <div className="analytics-metric-icon">
                        <FiHome />
                      </div>
                      <div className="analytics-metric-content">
                        <h3>C-Sections</h3>
                        <div className="analytics-metric-value">{reportData.healthMetrics.cSections}</div>
                        <div className="analytics-metric-change">10% of deliveries</div>
                      </div>
                    </div>
                  </div>

                  <div className="analytics-health-alerts">
                    <h4>Health Alerts</h4>
                    <div className="analytics-alerts-list">
                      <div className="analytics-alert-item analytics-alert-item--warning">
                        <FiAlertTriangle className="analytics-alert-icon" />
                        <div className="analytics-alert-content">
                          <h5>Gestational Diabetes</h5>
                          <p>{reportData.healthMetrics.gestationalDiabetes} cases detected this month</p>
                        </div>
                      </div>
                      <div className="analytics-alert-item analytics-alert-item--danger">
                        <FiAlertCircle className="analytics-alert-icon" />
                        <div className="analytics-alert-content">
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
    </div>
  );
};

export default Analytics; 