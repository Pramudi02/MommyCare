import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  User
} from 'lucide-react';
import './Orders.css';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      id: '#ORD-001',
      customer: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      products: [
        { name: 'Premium Baby Carrier', quantity: 1, price: 89.99 }
      ],
      total: 89.99,
      status: 'completed',
      orderDate: '2024-01-20',
      deliveryDate: '2024-01-22',
      shippingAddress: '123 Main St, City, State 12345',
      paymentMethod: 'Credit Card',
      trackingNumber: 'TRK123456789'
    },
    {
      id: '#ORD-002',
      customer: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1 (555) 234-5678',
      products: [
        { name: 'Organic Cotton Diaper Bag', quantity: 1, price: 45.50 },
        { name: 'Baby Sleep Sack', quantity: 2, price: 29.99 }
      ],
      total: 105.48,
      status: 'processing',
      orderDate: '2024-01-21',
      deliveryDate: '2024-01-25',
      shippingAddress: '456 Oak Ave, Town, State 23456',
      paymentMethod: 'PayPal',
      trackingNumber: 'TRK987654321'
    },
    {
      id: '#ORD-003',
      customer: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 345-6789',
      products: [
        { name: 'Electric Breast Pump', quantity: 1, price: 129.99 }
      ],
      total: 129.99,
      status: 'shipped',
      orderDate: '2024-01-19',
      deliveryDate: '2024-01-24',
      shippingAddress: '789 Pine Rd, Village, State 34567',
      paymentMethod: 'Credit Card',
      trackingNumber: 'TRK456789123'
    },
    {
      id: '#ORD-004',
      customer: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 (555) 456-7890',
      products: [
        { name: 'Lightweight Baby Stroller', quantity: 1, price: 299.99 }
      ],
      total: 299.99,
      status: 'pending',
      orderDate: '2024-01-22',
      deliveryDate: '2024-01-28',
      shippingAddress: '321 Elm St, Borough, State 45678',
      paymentMethod: 'Credit Card',
      trackingNumber: null
    }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

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
      case 'cancelled':
        return 'text-red-600 bg-red-100';
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
        return <Truck className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <Package className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    console.log('Updating order status:', orderId, 'to', newStatus);
    // Handle status update logic here
  };

  return (
    <div className="orders-page">
      {/* Header */}
      <div className="orders-header">
        <div className="orders-header__left">
          <h1>Order Management 📦</h1>
          <p>Track and manage customer orders, shipping, and delivery status</p>
        </div>
        <div className="orders-header__right">
          <div className="order-stats">
            <div className="stat-item">
              <div className="stat-value">{orders.length}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="orders-controls">
        <div className="search-section">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search orders by customer or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="filter-section">
          <div className="filter-group">
            <label>Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Date Range:</label>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        <div className="orders-table">
          <div className="table-header">
            <div className="header-cell">Order ID</div>
            <div className="header-cell">Customer</div>
            <div className="header-cell">Products</div>
            <div className="header-cell">Total</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Order Date</div>
            <div className="header-cell">Actions</div>
          </div>
          
          {filteredOrders.map((order) => (
            <div key={order.id} className="table-row">
              <div className="table-cell order-id">{order.id}</div>
              <div className="table-cell customer-info">
                <div className="customer-name">{order.customer}</div>
                <div className="customer-email">{order.email}</div>
              </div>
              <div className="table-cell products-info">
                {order.products.map((product, index) => (
                  <div key={index} className="product-item">
                    <span className="product-name">{product.name}</span>
                    <span className="product-quantity">x{product.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="table-cell order-total">${order.total}</div>
              <div className="table-cell order-status">
                <span className={`status-badge ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>
              <div className="table-cell order-date">{order.orderDate}</div>
              <div className="table-cell actions">
                <button 
                  className="action-btn view-btn"
                  onClick={() => handleViewOrder(order)}
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button 
                  className="action-btn edit-btn"
                  onClick={() => handleUpdateStatus(order.id, 'processing')}
                >
                  <Edit className="w-4 h-4" />
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Order Modal */}
      {showViewModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details: {selectedOrder.id}</h2>
              <button className="close-btn" onClick={() => setShowViewModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="order-detail-view">
                <div className="order-detail-header">
                  <div className="order-info">
                    <h3>{selectedOrder.id}</h3>
                    <div className="order-status-large">
                      <span className={`status-badge-large ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>
                  <div className="order-dates">
                    <div className="date-item">
                      <Calendar className="w-4 h-4" />
                      <span>Ordered: {selectedOrder.orderDate}</span>
                    </div>
                    <div className="date-item">
                      <Truck className="w-4 h-4" />
                      <span>Expected: {selectedOrder.deliveryDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="order-detail-sections">
                  <div className="detail-section">
                    <h4>Customer Information</h4>
                    <div className="customer-details">
                      <div className="detail-row">
                        <span className="detail-label">Name:</span>
                        <span className="detail-value">{selectedOrder.customer}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{selectedOrder.email}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{selectedOrder.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Shipping Address</h4>
                    <div className="shipping-address">
                      <p>{selectedOrder.shippingAddress}</p>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Order Items</h4>
                    <div className="order-items">
                      {selectedOrder.products.map((product, index) => (
                        <div key={index} className="order-item">
                          <div className="item-info">
                            <span className="item-name">{product.name}</span>
                            <span className="item-quantity">x{product.quantity}</span>
                          </div>
                          <div className="item-price">${product.price}</div>
                        </div>
                      ))}
                      <div className="order-total-row">
                        <span className="total-label">Total:</span>
                        <span className="total-value">${selectedOrder.total}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Payment & Shipping</h4>
                    <div className="payment-shipping">
                      <div className="detail-row">
                        <span className="detail-label">Payment Method:</span>
                        <span className="detail-value">{selectedOrder.paymentMethod}</span>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="detail-row">
                          <span className="detail-label">Tracking Number:</span>
                          <span className="detail-value">{selectedOrder.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
