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
  Users,
  ArrowUpRight,
  Clock
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
      icon: <Package className="sp-stat-card__icon" />,
      color: 'sp-stat-card--blue'
    },
    {
      title: 'Active Products',
      value: '22',
      change: '+2',
      changeType: 'positive',
      icon: <CheckCircle className="sp-stat-card__icon" />,
      color: 'sp-stat-card--orange'
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
      category: 'Travel',
      rank: 1
    },
    {
      name: 'Organic Cotton Diaper Bag',
      views: 89,
      clicks: 12,
      clickRate: '13.5%',
      category: 'Travel',
      rank: 2
    },
    {
      name: 'Electric Breast Pump',
      views: 67,
      clicks: 8,
      clickRate: '11.9%',
      category: 'Feeding',
      rank: 3
    }
  ];

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'Post a new product with external link',
      icon: <Plus className="sp-quick-action__icon" />,
      link: '/service-provider/products/add'
    },
    {
      title: 'View Analytics',
      description: 'Check product performance',
      icon: <BarChart3 className="sp-quick-action__icon" />,
      link: '/service-provider/products'
    },
    {
      title: 'Update Profile',
      description: 'Manage your business profile',
      icon: <Settings className="sp-quick-action__icon" />,
      link: '/service-provider/profile'
    }
  ];

  const recentActivities = [
    {
      type: 'completed',
      icon: <CheckCircle />,
      title: 'New product "Baby Carrier" added',
      time: '2 hours ago'
    },
    {
      type: 'updated',
      icon: <Eye />,
      title: 'Product "Diaper Bag" received 12 views',
      time: '4 hours ago'
    },
    {
      type: 'new',
      icon: <ExternalLink />,
      title: 'External link clicked for "Breast Pump"',
      time: '6 hours ago'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'sp-product-status--active';
      case 'pending':
        return 'sp-product-status--pending';
      case 'inactive':
        return 'sp-product-status--inactive';
      default:
        return 'sp-product-status--pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'inactive':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="sp-dashboard-page">
      <div className="sp-dashboard-container">
        <div className="sp-dashboard">
      {/* Header */}
          <div className="sp-dashboard__header">
            <div className="sp-dashboard__header-icon">
              <BarChart3 />
            </div>
            <div className="sp-dashboard__welcome">
              <h1>Service Provider Dashboard</h1>
              <p>Manage your product listings and track performance</p>
        </div>
            <div className="sp-dashboard__filter">
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
            </select>
        </div>
      </div>

          {/* Stats Cards */}
          <div className="sp-dashboard__stats">
        {stats.map((stat, index) => (
              <div key={index} className={`sp-stat-card ${stat.color}`}>
                <div className="sp-stat-card__icon">
              {stat.icon}
            </div>
                <div className="sp-stat-card__content">
                  <div className="sp-stat-card__title">{stat.title}</div>
                  <div className="sp-stat-card__value">{stat.value}</div>
                  <div className={`sp-stat-card__change sp-stat-card__change--${stat.changeType}`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

          {/* Quick Actions */}
          <div className="sp-quick-actions">
            {quickActions.map((action, index) => (
              <a key={index} href={action.link} className="sp-quick-action">
                <div className="sp-quick-action__icon">
                  {action.icon}
          </div>
                <div className="sp-quick-action__text">
                  {action.title}
                </div>
              </a>
            ))}
                  </div>

          <div className="sp-dashboard__main-content">
            {/* Recent Products */}
            <div className="sp-dashboard__section">
              <h2>Recent Products</h2>
              <div className="sp-recent-products">
                <div className="sp-recent-products__header">
                  <h3>Latest Product Activity</h3>
                </div>
                <table className="sp-recent-products__table">
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
                          <span className={`sp-product-status ${getStatusColor(product.status)}`}>
                            {getStatusIcon(product.status)}
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
            <div className="sp-dashboard__section">
              <h2>Top Performing Products</h2>
              <div className="sp-top-performing">
                <div className="sp-top-performing__header">
                  <h3>Best Performers</h3>
                </div>
                <div className="sp-top-performing__list">
                  {topPerformingProducts.map((product, index) => (
                    <div key={index} className="sp-top-performing__item">
                      <div className={`sp-top-performing__rank ${
                        index === 0 ? 'sp-top-performing__rank--gold' :
                        index === 1 ? 'sp-top-performing__rank--silver' :
                        'sp-top-performing__rank--bronze'
                      }`}>
                        {product.rank}
                      </div>
                      <div className="sp-top-performing__content">
                        <div className="sp-top-performing__name">{product.name}</div>
                        <div className="sp-top-performing__metrics">
                          <div className="sp-top-performing__metric">
                            <Eye className="w-3 h-3" />
                            {product.views}
          </div>
                          <div className="sp-top-performing__metric">
                            <ExternalLink className="w-3 h-3" />
                            {product.clicks}
                  </div>
                          <div className="sp-top-performing__metric">
                            <TrendingUp className="w-3 h-3" />
                            {product.clickRate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
                </div>
          </div>
        </div>
      </div>

          {/* Recent Activity */}
          <div className="sp-dashboard__section">
            <h2>Recent Activity</h2>
            <div className="sp-activities-list">
              {recentActivities.map((activity, index) => (
                <div key={index} className={`sp-activity-item sp-activity-item--${activity.type}`}>
                  <div className="sp-activity-item__icon">
                    {activity.icon}
              </div>
                  <div className="sp-activity-item__content">
                    <div className="sp-activity-item__title">{activity.title}</div>
                    <div className="sp-activity-item__time">{activity.time}</div>
              </div>
            </div>
          ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
