import React, { useState } from 'react';
import { 
  TrendingUp, 
  Package, 
  Eye, 
  Calendar, 
  Star, 
  Plus,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  HandHeart,
  BarChart3,
  MessageSquare,
  Settings,
  Baby,
  Briefcase,
  Droplets,
  Car,
  Link,
  Users
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const stats = [
    {
      title: 'Total Products',
      value: '24',
      change: '+3',
      changeType: 'positive',
      icon: <Package className="sp-stat-icon" />,
      color: 'sp-bg-blue'
    },
    {
      title: 'Product Views',
      value: '1,247',
      change: '+15.2%',
      changeType: 'positive',
      icon: <Eye className="sp-stat-icon" />,
      color: 'sp-bg-green'
    },
    {
      title: 'External Clicks',
      value: '89',
      change: '+8.7%',
      changeType: 'positive',
      icon: <ExternalLink className="sp-stat-icon" />,
      color: 'sp-bg-purple'
    },
    {
      title: 'Active Products',
      value: '22',
      change: '+2',
      changeType: 'positive',
      icon: <CheckCircle className="sp-stat-icon" />,
      color: 'sp-bg-orange'
    }
  ];

  const recentProducts = [
    {
      id: 1,
      name: 'Premium Baby Carrier',
      category: 'Travel',
      status: 'active',
      views: 156,
      clicks: 23,
      image: '👶',
      lastUpdated: '2 hours ago'
    },
    {
      id: 2,
      name: 'Organic Cotton Diaper Bag',
      category: 'Travel',
      status: 'active',
      views: 89,
      clicks: 12,
      image: '👜',
      lastUpdated: '4 hours ago'
    },
    {
      id: 3,
      name: 'Electric Breast Pump',
      category: 'Feeding',
      status: 'active',
      views: 67,
      clicks: 8,
      image: '🍼',
      lastUpdated: '6 hours ago'
    },
    {
      id: 4,
      name: 'Lightweight Baby Stroller',
      category: 'Travel',
      status: 'pending',
      views: 34,
      clicks: 5,
      image: '🚼',
      lastUpdated: '8 hours ago'
    }
  ];

  const topPerformingProducts = [
    {
      name: 'Premium Baby Carrier',
      views: 156,
      clicks: 23,
      clickRate: '14.7%',
      category: 'Travel'
    },
    {
      name: 'Organic Cotton Diaper Bag',
      views: 89,
      clicks: 12,
      clickRate: '13.5%',
      category: 'Travel'
    },
    {
      name: 'Electric Breast Pump',
      views: 67,
      clicks: 8,
      clickRate: '11.9%',
      category: 'Feeding'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'Post a new product with external link',
      icon: <Plus className="sp-action-icon" />,
      color: 'sp-bg-blue',
      link: '/service-provider/products/add'
    },
    {
      title: 'View Analytics',
      description: 'Check product performance',
      icon: <BarChart3 className="sp-action-icon" />,
      color: 'sp-bg-green',
      link: '/service-provider/products'
    },
    {
      title: 'Update Profile',
      description: 'Manage your business profile',
      icon: <Settings className="sp-action-icon" />,
      color: 'sp-bg-purple',
      link: '/service-provider/profile'
    }
  ];

  return (
    <div className="sp-dashboard">
      <div className="sp-dashboard-header">
        <div className="sp-dashboard-title">
          <h1>Service Provider Dashboard</h1>
          <p>Manage your product listings and track performance</p>
        </div>
        <div className="sp-dashboard-actions">
          <button className="sp-btn sp-btn-primary">
            <Plus className="sp-btn-icon" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="sp-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`sp-stat-card ${stat.color}`}>
            <div className="sp-stat-icon-wrapper">
              {stat.icon}
            </div>
            <div className="sp-stat-content">
              <h3 className="sp-stat-title">{stat.title}</h3>
              <p className="sp-stat-value">{stat.value}</p>
              <span className={`sp-stat-change sp-stat-change-${stat.changeType}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="sp-dashboard-content">
        <div className="sp-dashboard-main">
          {/* Recent Products */}
          <div className="sp-card">
            <div className="sp-card-header">
              <h3>Recent Products</h3>
              <a href="/service-provider/products" className="sp-link">View All</a>
            </div>
            <div className="sp-table-container">
              <table className="sp-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th>Clicks</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="sp-product-info">
                          <span className="sp-product-emoji">{product.image}</span>
                          <span className="sp-product-name">{product.name}</span>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td>
                        <span className={`sp-status sp-status-${product.status}`}>
                          {product.status}
                        </span>
                      </td>
                      <td>{product.views}</td>
                      <td>{product.clicks}</td>
                      <td>{product.lastUpdated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Performing Products */}
          <div className="sp-card">
            <div className="sp-card-header">
              <h3>Top Performing Products</h3>
            </div>
            <div className="sp-performance-list">
              {topPerformingProducts.map((product, index) => (
                <div key={index} className="sp-performance-item">
                  <div className="sp-performance-info">
                    <h4>{product.name}</h4>
                    <p className="sp-performance-category">{product.category}</p>
                  </div>
                  <div className="sp-performance-stats">
                    <div className="sp-performance-stat">
                      <span className="sp-stat-label">Views</span>
                      <span className="sp-stat-value">{product.views}</span>
                    </div>
                    <div className="sp-performance-stat">
                      <span className="sp-stat-label">Clicks</span>
                      <span className="sp-stat-value">{product.clicks}</span>
                    </div>
                    <div className="sp-performance-stat">
                      <span className="sp-stat-label">Click Rate</span>
                      <span className="sp-stat-value">{product.clickRate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sp-dashboard-sidebar">
          {/* Quick Actions */}
          <div className="sp-card">
            <div className="sp-card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="sp-quick-actions">
              {quickActions.map((action, index) => (
                <a key={index} href={action.link} className="sp-quick-action">
                  <div className={`sp-action-icon-wrapper ${action.color}`}>
                    {action.icon}
                  </div>
                  <div className="sp-action-content">
                    <h4>{action.title}</h4>
                    <p>{action.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="sp-card">
            <div className="sp-card-header">
              <h3>Recent Activity</h3>
            </div>
            <div className="sp-activity-list">
              <div className="sp-activity-item">
                <div className="sp-activity-icon sp-activity-success">
                  <CheckCircle />
                </div>
                <div className="sp-activity-content">
                  <p>New product "Baby Carrier" added</p>
                  <span>2 hours ago</span>
                </div>
              </div>
              <div className="sp-activity-item">
                <div className="sp-activity-icon sp-activity-info">
                  <Eye />
                </div>
                <div className="sp-activity-content">
                  <p>Product "Diaper Bag" received 12 views</p>
                  <span>4 hours ago</span>
                </div>
              </div>
              <div className="sp-activity-item">
                <div className="sp-activity-icon sp-activity-warning">
                  <ExternalLink />
                </div>
                <div className="sp-activity-content">
                  <p>External link clicked for "Breast Pump"</p>
                  <span>6 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
