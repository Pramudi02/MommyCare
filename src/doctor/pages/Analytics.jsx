import React, { useState } from 'react';
import './Analytics.css';
import { 
  FiUsers, 
  FiCalendar, 
  FiDollarSign, 
  FiBarChart2,
  FiTrendingUp,
  FiTrendingDown,
  FiDownload,
  FiFilter,
  FiActivity,
  FiHeart,
  FiAlertTriangle,
  FiFileText,
  FiEye,
  FiEdit3
} from 'react-icons/fi';

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
    return growth >= 0 ? <FiTrendingUp className="growth-icon" /> : <FiTrendingDown className="growth-icon" />;
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
                backgroundColor: item.color || '#3b82f6'
              }}
            />
            <span className="bar-label">{item.label}</span>
          </div>
        ))}
      </div>
    );
  };

  const generateReport = (type) => {
    console.log(`Generating ${type} report for ${timeRange}`);
    // In a real app, this would generate and download a report
  };

  return (
    <div className="analytics-page">
      <div className="analytics-container">
        <div className="analytics-content">
          {/* Header */}
          <div className="analytics-header">
            <div className="analytics-header-icon">
              <FiBarChart2 />
            </div>
            <div className="analytics-title">
              <h1>Practice Analytics</h1>
              <p>Comprehensive insights into your medical practice performance</p>
            </div>
            <div className="analytics-controls">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="analytics-date-selector"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="analytics-stats">
            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--blue">
                <FiUsers />
              </div>
              <div className="stat-card__content">
                <h3 className="stat-card__title">Total Patients</h3>
                <div className="stat-card__value">{analyticsData.patientStats.total}</div>
                <div className="stat-card__change stat-card__change--positive">
                  +{analyticsData.patientStats.newThisMonth} this month
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--purple">
                <FiCalendar />
              </div>
              <div className="stat-card__content">
                <h3 className="stat-card__title">Appointments</h3>
                <div className="stat-card__value">{analyticsData.appointmentStats.total}</div>
                <div className="stat-card__change stat-card__change--positive">
                  {analyticsData.appointmentStats.completed} completed
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--green">
                <FiDollarSign />
              </div>
              <div className="stat-card__content">
                <h3 className="stat-card__title">Revenue</h3>
                <div className="stat-card__value">{formatCurrency(analyticsData.revenueStats.total)}</div>
                <div className="stat-card__change" style={{ color: getGrowthColor(analyticsData.revenueStats.growth) }}>
                  {getGrowthIcon(analyticsData.revenueStats.growth)}
                  {analyticsData.revenueStats.growth}% vs last month
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--orange">
                <FiActivity />
              </div>
              <div className="stat-card__content">
                <h3 className="stat-card__title">Active Cases</h3>
                <div className="stat-card__value">{analyticsData.patientStats.active}</div>
                <div className="stat-card__change stat-card__change--neutral">
                  {analyticsData.patientStats.inactive} inactive
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="analytics-main-content">
            <div className="analytics-left">
              {/* Revenue Chart */}
              <div className="analytics-section">
                <div className="section-header">
                  <h2><FiTrendingUp className="section-icon" /> Monthly Revenue Trends</h2>
                  <button 
                    className="download-btn"
                    onClick={() => generateReport('revenue')}
                  >
                    <FiDownload />
                    Export
                  </button>
                </div>
                <div className="chart-container">
                  {renderBarChart(
                    analyticsData.monthlyTrends.map(item => ({
                      label: item.month,
                      value: item.revenue,
                      color: '#3b82f6'
                    }))
                  )}
                </div>
              </div>

              {/* Top Services */}
              <div className="analytics-section">
                <div className="section-header">
                  <h2><FiActivity className="section-icon" /> Top Services</h2>
                  <button 
                    className="download-btn"
                    onClick={() => generateReport('services')}
                  >
                    <FiDownload />
                    Export
                  </button>
                </div>
                <div className="services-list">
                  {analyticsData.topServices.map((service, index) => (
                    <div key={index} className="service-item">
                      <div className="service-info">
                        <span className="service-rank">#{index + 1}</span>
                        <span className="service-name">{service.name}</span>
                      </div>
                      <div className="service-stats">
                        <span className="service-count">{service.count} visits</span>
                        <span className="service-revenue">{formatCurrency(service.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="analytics-right">
              {/* Patient Demographics */}
              <div className="analytics-section">
                <div className="section-header">
                  <h2><FiUsers className="section-icon" /> Patient Demographics</h2>
                </div>
                <div className="demographics-content">
                  <div className="age-groups">
                    <h3>Age Distribution</h3>
                    {analyticsData.patientDemographics.ageGroups.map((group, index) => (
                      <div key={index} className="demographic-item">
                        <div className="demographic-label">
                          <span>{group.range}</span>
                          <span className="demographic-count">{group.count}</span>
                        </div>
                        <div className="demographic-bar">
                          <div 
                            className="demographic-bar-fill"
                            style={{ width: `${group.percentage}%` }}
                          />
                        </div>
                        <span className="demographic-percentage">{formatPercentage(group.percentage)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="conditions">
                    <h3>Medical Conditions</h3>
                    {analyticsData.patientDemographics.conditions.map((condition, index) => (
                      <div key={index} className="condition-item">
                        <div className="condition-info">
                          <span className="condition-name">{condition.name}</span>
                          <span className="condition-count">{condition.count}</span>
                        </div>
                        <div className="condition-bar">
                          <div 
                            className="condition-bar-fill"
                            style={{ width: `${condition.percentage}%` }}
                          />
                        </div>
                        <span className="condition-percentage">{formatPercentage(condition.percentage)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="analytics-section">
                <div className="section-header">
                  <h2><FiActivity className="section-icon" /> Quick Actions</h2>
                </div>
                <div className="quick-actions">
                  <button className="quick-action-btn">
                    <FiEye />
                    <span>View Detailed Report</span>
                  </button>
                  <button className="quick-action-btn">
                    <FiDownload />
                    <span>Export All Data</span>
                  </button>
                  <button className="quick-action-btn">
                    <FiEdit3 />
                    <span>Customize Dashboard</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
