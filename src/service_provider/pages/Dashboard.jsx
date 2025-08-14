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
  AlertCircle
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
      icon: <DollarSign className="w-8 h-8" />,
      color: 'bg-green-500'
    },
    {
      title: 'Products Sold',
      value: '156',
      change: '+8.2%',
      changeType: 'positive',
      icon: <Package className="w-8 h-8" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Customers',
      value: '89',
      change: '+5.7%',
      changeType: 'positive',
      icon: <Users className="w-8 h-8" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Pending Orders',
      value: '23',
      change: '-2.1%',
      changeType: 'negative',
      icon: <ShoppingCart className="w-8 h-8" />,
      color: 'bg-orange-500'
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
      icon: <Plus className="w-6 h-6" />,
      action: 'add-product',
      color: 'bg-blue-500'
    },
    {
      title: 'View Orders',
      description: 'Check and manage customer orders',
      icon: <ShoppingCart className="w-6 h-6" />,
      action: 'view-orders',
      color: 'bg-green-500'
    },
    {
      title: 'Customer Support',
      description: 'Respond to customer inquiries',
      icon: <Users className="w-6 h-6" />,
      action: 'support',
      color: 'bg-purple-500'
    },
    {
      title: 'Analytics Report',
      description: 'Generate detailed business reports',
      icon: <TrendingUp className="w-6 h-6" />,
      action: 'analytics',
      color: 'bg-orange-500'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'pending':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'shipped':
        return <Package className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header__left">
          <h1>Welcome back, Service Provider! 👋</h1>
          <p>Here's what's happening with your business today</p>
        </div>
        <div className="dashboard-header__right">
          <div className="period-selector">
            <label htmlFor="period">Time Period:</label>
            <select
              id="period"
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
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card__icon" style={{ backgroundColor: stat.color.replace('bg-', '') }}>
              {stat.icon}
            </div>
            <div className="stat-card__content">
              <h3 className="stat-card__title">{stat.title}</h3>
              <div className="stat-card__value">{stat.value}</div>
              <div className={`stat-card__change ${stat.changeType}`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Recent Orders */}
        <div className="content-card orders-section">
          <div className="content-card__header">
            <h2>Recent Orders</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="orders-list">
            {recentOrders.map((order) => (
              <div key={order.id} className="order-item">
                <div className="order-item__left">
                  <div className="order-id">{order.id}</div>
                  <div className="order-customer">{order.customer}</div>
                  <div className="order-product">{order.product}</div>
                </div>
                <div className="order-item__right">
                  <div className="order-amount">{order.amount}</div>
                  <div className={`order-status ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </div>
                  <div className="order-date">{order.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="content-card products-section">
          <div className="content-card__header">
            <h2>Top Performing Products</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="products-list">
            {topProducts.map((product, index) => (
              <div key={index} className="product-item">
                <div className="product-item__left">
                  <div className="product-image">{product.image}</div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-rating">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="product-item__right">
                  <div className="product-sales">{product.sales} sales</div>
                  <div className="product-revenue">{product.revenue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <div key={index} className="action-card">
              <div className="action-card__icon" style={{ backgroundColor: action.color.replace('bg-', '') }}>
                {action.icon}
              </div>
              <div className="action-card__content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <button className="action-btn">Go</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
