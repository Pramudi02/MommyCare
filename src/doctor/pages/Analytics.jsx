import React, { useState } from 'react';
import './Analytics.css';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaDollarSign, 
  FaChartBar
} from 'react-icons/fa';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'quarter', 'year'

  // Sample analytics data
  const analyticsData = {
    patientStats: {
      total: 156,
      newThisMonth: 23,
      active: 142,
      inactive: 14
    },
    appointmentStats: {
      total: 89,
      completed: 76,
      cancelled: 8,
      noShow: 5
    },
    revenueStats: {
      total: 45600,
      thisMonth: 8900,
      lastMonth: 8200,
      growth: 8.5
    },
    topServices: [
      { name: "Prenatal Checkup", count: 45, revenue: 13500 },
      { name: "Ultrasound", count: 28, revenue: 16800 },
      { name: "Emergency Consultation", count: 12, revenue: 7200 },
      { name: "Postpartum Care", count: 8, revenue: 2400 },
      { name: "Follow-up", count: 15, revenue: 4500 }
    ],
    monthlyTrends: [
      { month: "Jan", patients: 12, appointments: 45, revenue: 7200 },
      { month: "Feb", patients: 15, appointments: 52, revenue: 7800 },
      { month: "Mar", patients: 18, appointments: 58, revenue: 8700 },
      { month: "Apr", patients: 22, appointments: 65, revenue: 9750 },
      { month: "May", patients: 25, appointments: 72, revenue: 10800 },
      { month: "Jun", patients: 28, appointments: 78, revenue: 11700 },
      { month: "Jul", patients: 30, appointments: 82, revenue: 12300 },
      { month: "Aug", patients: 32, appointments: 85, revenue: 12750 },
      { month: "Sep", patients: 35, appointments: 88, revenue: 13200 },
      { month: "Oct", patients: 38, appointments: 92, revenue: 13800 },
      { month: "Nov", patients: 40, appointments: 95, revenue: 14250 },
      { month: "Dec", patients: 42, appointments: 98, revenue: 14700 }
    ],
    patientDemographics: {
      ageGroups: [
        { range: "18-25", count: 35, percentage: 22.4 },
        { range: "26-30", count: 48, percentage: 30.8 },
        { range: "31-35", count: 42, percentage: 26.9 },
        { range: "36-40", count: 23, percentage: 14.7 },
        { range: "40+", count: 8, percentage: 5.1 }
      ],
      conditions: [
        { name: "Pregnancy", count: 89, percentage: 57.1 },
        { name: "Postpartum", count: 34, percentage: 21.8 },
        { name: "Gynecological", count: 18, percentage: 11.5 },
        { name: "Emergency", count: 15, percentage: 9.6 }
      ]
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? '#10b981' : '#ef4444';
  };

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? '↗️' : '↘️';
  };

  const renderBarChart = (data, height = 200) => {
    const maxValue = Math.max(...data.map(item => item.value));
    
    return (
      <div className="bar-chart" style={{ height }}>
        {data.map((item, index) => (
          <div key={index} className="bar-item">
            <div 
              className="bar" 
              style={{ 
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color 
              }}
            />
            <span className="bar-label">{item.label}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderPieChart = (data, size = 150) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return (
      <div className="pie-chart" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const x1 = size / 2 + (size / 2 - 10) * Math.cos(currentAngle * Math.PI / 180);
            const y1 = size / 2 + (size / 2 - 10) * Math.sin(currentAngle * Math.PI / 180);
            const x2 = size / 2 + (size / 2 - 10) * Math.cos((currentAngle + angle) * Math.PI / 180);
            const y2 = size / 2 + (size / 2 - 10) * Math.sin((currentAngle + angle) * Math.PI / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${size / 2} ${size / 2}`,
              `L ${x1} ${y1}`,
              `A ${size / 2 - 10} ${size / 2 - 10} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            currentAngle += angle;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="analytics-page">
      {/* Header - Matching dashboard exactly */}
      <div className="analytics-header">
        <h1>Practice Analytics</h1>
        <p>Comprehensive insights into your medical practice performance</p>
        <div className="doctor-dashboard-header-decoration"></div>
      </div>

      {/* Statistics Cards - Matching dashboard exactly */}
      <div className="analytics-stats">
        <div className="analytics-stat-card" style={{ borderLeftColor: "#4CAF50" }}>
          <div className="analytics-stat-card-icon" style={{ backgroundColor: "#4CAF50" }}>
            <FaUsers />
          </div>
          <div className="analytics-stat-card-content">
            <h3>{analyticsData.patientStats.total}</h3>
            <p>Total Patients</p>
            <span className="stat-change positive">+{analyticsData.patientStats.newThisMonth} this month</span>
          </div>
        </div>
        <div className="analytics-stat-card" style={{ borderLeftColor: "#2196F3" }}>
          <div className="analytics-stat-card-icon" style={{ backgroundColor: "#2196F3" }}>
            <FaCalendarAlt />
          </div>
          <div className="analytics-stat-card-content">
            <h3>{analyticsData.appointmentStats.total}</h3>
            <p>Total Appointments</p>
            <span className="stat-change positive">+{analyticsData.appointmentStats.completed} completed</span>
          </div>
        </div>
        <div className="analytics-stat-card" style={{ borderLeftColor: "#FF9800" }}>
          <div className="analytics-stat-card-icon" style={{ backgroundColor: "#FF9800" }}>
            <FaDollarSign />
          </div>
          <div className="analytics-stat-card-content">
            <h3>{formatCurrency(analyticsData.revenueStats.total)}</h3>
            <p>Total Revenue</p>
            <span className="stat-change" style={{ color: getGrowthColor(analyticsData.revenueStats.growth) }}>
              {getGrowthIcon(analyticsData.revenueStats.growth)} {analyticsData.revenueStats.growth}%
            </span>
          </div>
        </div>
        <div className="analytics-stat-card" style={{ borderLeftColor: "#F44336" }}>
          <div className="analytics-stat-card-icon" style={{ backgroundColor: "#F44336" }}>
            <FaChartBar />
          </div>
          <div className="analytics-stat-card-content">
            <h3>{formatPercentage(85.4)}</h3>
            <p>Patient Satisfaction</p>
            <span className="stat-change positive">+2.1% from last month</span>
          </div>
        </div>
      </div>

      <div className="analytics-content">
        {/* Left Column */}
        <div className="analytics-left">
          {/* Time Range Selector Section */}
          <div className="analytics-section">
            <div className="analytics-section-header">
              <h2>Analytics Controls</h2>
              <div className="time-range-selector">
                <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="analytics-section">
            <div className="analytics-section-header">
              <h2>Performance Charts</h2>
            </div>
            <div className="charts-section">
              <div className="chart-row">
                {/* Revenue Trend */}
                <div className="chart-card">
                  <h3>Revenue Trend</h3>
                  <div className="chart-content">
                    {renderBarChart(
                      analyticsData.monthlyTrends.slice(-6).map((item, index) => ({
                        label: item.month,
                        value: item.revenue,
                        color: '#4f46e5'
                      }))
                    )}
                  </div>
                </div>

                {/* Patient Demographics */}
                <div className="chart-card">
                  <h3>Patient Age Distribution</h3>
                  <div className="chart-content">
                    {renderPieChart(
                      analyticsData.patientDemographics.ageGroups.map((item, index) => ({
                        label: item.range,
                        value: item.count,
                        color: ['#4f46e5', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'][index]
                      }))
                    )}
                    <div className="pie-legend">
                      {analyticsData.patientDemographics.ageGroups.map((item, index) => (
                        <div key={index} className="legend-item">
                          <span 
                            className="legend-color" 
                            style={{ backgroundColor: ['#4f46e5', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'][index] }}
                          />
                          <span className="legend-label">{item.range}: {item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="chart-row">
                {/* Top Services */}
                <div className="chart-card">
                  <h3>Top Services by Revenue</h3>
                  <div className="chart-content">
                    <div className="services-list">
                      {analyticsData.topServices.map((service, index) => (
                        <div key={index} className="service-item">
                          <div className="service-info">
                            <span className="service-name">{service.name}</span>
                            <span className="service-count">{service.count} patients</span>
                          </div>
                          <span className="service-revenue">{formatCurrency(service.revenue)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Appointment Status */}
                <div className="chart-card">
                  <h3>Appointment Status</h3>
                  <div className="chart-content">
                    {renderPieChart(
                      [
                        { label: 'Completed', value: analyticsData.appointmentStats.completed, color: '#10b981' },
                        { label: 'Cancelled', value: analyticsData.appointmentStats.cancelled, color: '#ef4444' },
                        { label: 'No Show', value: analyticsData.appointmentStats.noShow, color: '#f59e0b' }
                      ]
                    )}
                    <div className="pie-legend">
                      <div className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: '#10b981' }} />
                        <span className="legend-label">Completed: {analyticsData.appointmentStats.completed}</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: '#ef4444' }} />
                        <span className="legend-label">Cancelled: {analyticsData.appointmentStats.cancelled}</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: '#f59e0b' }} />
                        <span className="legend-label">No Show: {analyticsData.appointmentStats.noShow}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="analytics-section">
            <div className="analytics-section-header">
              <h2>Detailed Statistics</h2>
            </div>
            <div className="detailed-stats">
              <div className="stats-card">
                <h3>Patient Conditions</h3>
                <div className="conditions-list">
                  {analyticsData.patientDemographics.conditions.map((condition, index) => (
                    <div key={index} className="condition-item">
                      <div className="condition-info">
                        <span className="condition-name">{condition.name}</span>
                        <span className="condition-percentage">{formatPercentage(condition.percentage)}</span>
                      </div>
                      <div className="condition-bar">
                        <div 
                          className="condition-progress" 
                          style={{ 
                            width: `${condition.percentage}%`,
                            backgroundColor: ['#4f46e5', '#8b5cf6', '#06b6d4', '#10b981'][index]
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="stats-card">
                <h3>Monthly Performance</h3>
                <div className="performance-table">
                  <div className="table-header">
                    <span>Month</span>
                    <span>Patients</span>
                    <span>Appointments</span>
                    <span>Revenue</span>
                  </div>
                  {analyticsData.monthlyTrends.slice(-6).map((item, index) => (
                    <div key={index} className="table-row">
                      <span>{item.month}</span>
                      <span>{item.patients}</span>
                      <span>{item.appointments}</span>
                      <span>{formatCurrency(item.revenue)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Empty for now */}
        <div className="analytics-right">
          {/* Empty right column - can be used for additional features later */}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
