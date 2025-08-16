import React, { useState } from 'react';
import { 
  TrendingUp, 
  Package, 
  Users, 
  Calendar, 
  DollarSign, 
  Star, 
  Plus,
  Eye,
  Edit,
  Trash2,
  ShoppingCart,
  Clock,
  CheckCircle,
  AlertCircle,
  HandHeart,
  BarChart3,
  MessageSquare,
  Settings
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,450',
      change: '+12.5%',
      changeType: 'positive',
      icon: <DollarSign className="sp-stat-icon" />,
      color: 'sp-bg-green'
    },
    {
      title: 'Products Sold',
      value: '156',
      change: '+8.2%',
      changeType: 'positive',
      icon: <Package className="sp-stat-icon" />,
      color: 'sp-bg-blue'
    },
    {
      title: 'Active Customers',
      value: '89',
      change: '+5.7%',
      changeType: 'positive',
      icon: <Users className="sp-stat-icon" />,
      color: 'sp-bg-purple'
    },
    {
      title: 'Pending Orders',
      value: '23',
      change: '-2.1%',
      changeType: 'negative',
      icon: <ShoppingCart className="sp-stat-icon" />,
      color: 'sp-bg-orange'
    }
  ];

  const recentOrders = [
    {
      id: '#ORD-001',
      customer: 'Sarah Johnson',
      product: 'Baby Carrier',
      amount: '$89.99',
      status: 'completed',
      date: '2 hours ago'
    },
    {
      id: '#ORD-002',
      customer: 'Mike Chen',
      product: 'Diaper Bag',
      amount: '$45.50',
      status: 'processing',
      date: '4 hours ago'
    },
    {
      id: '#ORD-003',
      customer: 'Emily Davis',
      product: 'Breast Pump',
      amount: '$129.99',
      status: 'shipped',
      date: '6 hours ago'
    },
    {
      id: '#ORD-004',
      customer: 'David Wilson',
      product: 'Baby Stroller',
      amount: '$299.99',
      status: 'pending',
      date: '8 hours ago'
    }
  ];

  const topProducts = [
    {
      name: 'Baby Carrier',
      sales: 45,
      revenue: '$4,049.55',
      rating: 4.8,
      image: '👶'
    },
    {
      name: 'Diaper Bag',
      sales: 38,
      revenue: '$1,729.00',
      rating: 4.6,
      image: '👜'
    },
    {
      name: 'Breast Pump',
      sales: 32,
      revenue: '$4,159.68',
      rating: 4.9,
      image: '🍼'
    },
    {
      name: 'Baby Stroller',
      sales: 28,
      revenue: '$8,399.72',
      rating: 4.7,
      image: '🚼'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'Create and list new baby products',
      icon: <Plus className="sp-action-icon" />,
      action: 'add-product',
      color: 'sp-bg-blue'
    },
    {
      title: 'View Orders',
      description: 'Check and manage customer orders',
      icon: <ShoppingCart className="sp-action-icon" />,
      action: 'view-orders',
      color: 'sp-bg-green'
    },
    {
      title: 'Customer Support',
      description: 'Respond to customer inquiries',
      icon: <MessageSquare className="sp-action-icon" />,
      action: 'support',
      color: 'sp-bg-purple'
    },
    {
      title: 'Analytics Report',
      description: 'Generate detailed business reports',
      icon: <BarChart3 className="sp-action-icon" />,
      action: 'analytics',
      color: 'sp-bg-orange'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'sp-status-completed';
      case 'processing':
        return 'sp-status-processing';
      case 'shipped':
        return 'sp-status-shipped';
      case 'pending':
        return 'sp-status-pending';
      default:
        return 'sp-status-default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="sp-status-icon" />;
      case 'processing':
        return <Clock className="sp-status-icon" />;
      case 'shipped':
        return <Package className="sp-status-icon" />;
      case 'pending':
        return <AlertCircle className="sp-status-icon" />;
      default:
        return <Clock className="sp-status-icon" />;
    }
  };

  return (
    <div className="sp-dashboard-page">
      {/* Header */}
      <div className="sp-dashboard-header">
        <div className="sp-header-left">
          <h1 className="sp-welcome-title">Welcome back, Service Provider! <HandHeart className="sp-wave-icon" /></h1>
          <p className="sp-welcome-subtitle">Here's what's happening with your business today</p>
        </div>
        <div className="sp-header-right">
          <div className="sp-period-selector">
            <label htmlFor="period" className="sp-period-label">TIME PERIOD:</label>
            <select 
              id="period"
              className="sp-period-select"
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="sp-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="sp-stat-card">
            <div className={`sp-stat-icon-container ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="sp-stat-content">
              <h3 className="sp-stat-title">{stat.title}</h3>
              <div className="sp-stat-value">{stat.value}</div>
              <div className={`sp-stat-change ${stat.changeType}`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="sp-dashboard-content">
        {/* Recent Orders */}
        <div className="sp-content-card sp-orders-section">
          <div className="sp-card-header">
            <h2 className="sp-card-title">Recent Orders</h2>
            <button className="sp-view-all-btn">View All</button>
          </div>
          <div className="sp-orders-list">
            {recentOrders.map((order) => (
              <div key={order.id} className="sp-order-item">
                <div className="sp-order-left">
                  <div className="sp-order-id">{order.id}</div>
                  <div className="sp-order-customer">{order.customer}</div>
                  <div className="sp-order-product">{order.product}</div>
                </div>
                <div className="sp-order-right">
                  <div className="sp-order-amount">{order.amount}</div>
                  <div className={`sp-order-status ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </div>
                  <div className="sp-order-date">{order.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="sp-content-card sp-products-section">
          <div className="sp-card-header">
            <h2 className="sp-card-title">Top Performing Products</h2>
            <button className="sp-view-all-btn">View All</button>
          </div>
          <div className="sp-products-list">
            {topProducts.map((product, index) => (
              <div key={index} className="sp-product-item">
                <div className="sp-product-left">
                  <div className="sp-product-image">{product.image}</div>
                  <div className="sp-product-info">
                    <div className="sp-product-name">{product.name}</div>
                    <div className="sp-product-rating">
                      <Star className="sp-star-icon" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="sp-product-right">
                  <div className="sp-product-sales">{product.sales} sales</div>
                  <div className="sp-product-revenue">{product.revenue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="sp-quick-actions">
        <h2 className="sp-actions-title">Quick Actions</h2>
        <div className="sp-actions-grid">
          {quickActions.map((action, index) => (
            <div key={index} className="sp-action-card">
              <div className={`sp-action-icon-container ${action.color}`}>
                {action.icon}
              </div>
              <div className="sp-action-content">
                <h3 className="sp-action-title">{action.title}</h3>
                <p className="sp-action-description">{action.description}</p>
              </div>
              <button className="sp-action-btn">Go</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
