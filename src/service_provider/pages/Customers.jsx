import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Star,
  User,
  Plus
} from 'lucide-react';
import './Customers.css';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const customers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, City, State 12345',
      joinDate: '2023-06-15',
      status: 'active',
      totalOrders: 8,
      totalSpent: 567.89,
      lastOrder: '2024-01-20',
      rating: 4.8,
      preferences: ['Feeding', 'Travel', 'Safety'],
      notes: 'Prefers eco-friendly products, responsive customer'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1 (555) 234-5678',
      address: '456 Oak Ave, Town, State 23456',
      joinDate: '2023-08-22',
      status: 'active',
      totalOrders: 12,
      totalSpent: 892.45,
      lastOrder: '2024-01-21',
      rating: 4.6,
      preferences: ['Comfort', 'Clothing', 'Toys'],
      notes: 'Loyal customer, often buys in bulk'
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 345-6789',
      address: '789 Pine Rd, Village, State 34567',
      joinDate: '2023-09-10',
      status: 'active',
      totalOrders: 5,
      totalSpent: 345.67,
      lastOrder: '2024-01-19',
      rating: 4.9,
      preferences: ['Feeding', 'Health'],
      notes: 'First-time parent, needs guidance on products'
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 (555) 456-7890',
      address: '321 Elm St, Borough, State 45678',
      joinDate: '2023-11-05',
      status: 'new',
      totalOrders: 2,
      totalSpent: 299.99,
      lastOrder: '2024-01-22',
      rating: 4.7,
      preferences: ['Travel', 'Safety'],
      notes: 'Recently moved to the area, exploring options'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      email: 'lisa.thompson@email.com',
      phone: '+1 (555) 567-8901',
      address: '654 Maple Dr, County, State 56789',
      joinDate: '2023-07-18',
      status: 'inactive',
      totalOrders: 3,
      totalSpent: 156.78,
      lastOrder: '2023-12-15',
      rating: 4.5,
      preferences: ['Comfort', 'Clothing'],
      notes: 'Haven\'t heard from in a while, consider re-engagement'
    }
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'new':
        return 'text-blue-600 bg-blue-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'vip':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  const handleAddCustomer = () => {
    console.log('Adding new customer...');
    // Handle add customer logic here
  };

  return (
    <div className="customers-page">
      {/* Header */}
      <div className="customers-header">
        <div className="customers-header__left">
          <h1>Customer Management 👥</h1>
          <p>Manage customer relationships, track preferences, and monitor engagement</p>
        </div>
        <div className="customers-header__right">
          <button className="add-customer-btn" onClick={handleAddCustomer}>
            <Plus className="w-5 h-5" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="customers-stats">
        <div className="stat-item">
          <div className="stat-icon">
            <User className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{customers.length}</div>
            <div className="stat-label">Total Customers</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{customers.reduce((sum, c) => sum + c.totalOrders, 0)}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <div className="stat-value">${customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <Star className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{(customers.reduce((sum, c) => sum + c.rating, 0) / customers.length).toFixed(1)}</div>
            <div className="stat-label">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="customers-controls">
        <div className="search-section">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search customers by name or email..."
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
              <option value="active">Active</option>
              <option value="new">New</option>
              <option value="inactive">Inactive</option>
              <option value="vip">VIP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="customers-grid">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="customer-card">
            <div className="customer-card__header">
              <div className="customer-avatar">
                {customer.name.charAt(0)}
              </div>
              <div className="customer-status">
                <span className={`status-badge ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
              </div>
            </div>
            
            <div className="customer-card__content">
              <h3 className="customer-name">{customer.name}</h3>
              <p className="customer-email">{customer.email}</p>
              
              <div className="customer-contact">
                <div className="contact-item">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="contact-item">
                  <MapPin className="w-4 h-4" />
                  <span>{customer.address}</span>
                </div>
              </div>
              
              <div className="customer-stats">
                <div className="stat">
                  <span className="stat-label">Orders:</span>
                  <span className="stat-value">{customer.totalOrders}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Spent:</span>
                  <span className="stat-value">${customer.totalSpent}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Rating:</span>
                  <span className="stat-value">{customer.rating}</span>
                </div>
              </div>
              
              <div className="customer-preferences">
                {customer.preferences.slice(0, 3).map((pref, index) => (
                  <span key={index} className="preference-tag">{pref}</span>
                ))}
                {customer.preferences.length > 3 && (
                  <span className="preference-more">+{customer.preferences.length - 3}</span>
                )}
              </div>
              
              <div className="customer-join-date">
                <Calendar className="w-4 h-4" />
                <span>Joined: {customer.joinDate}</span>
              </div>
            </div>
            
            <div className="customer-card__actions">
              <button 
                className="action-btn view-btn"
                onClick={() => handleViewCustomer(customer)}
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button className="action-btn edit-btn">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className="action-btn contact-btn">
                <Mail className="w-4 h-4" />
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Customer Modal */}
      {showViewModal && selectedCustomer && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Customer Details: {selectedCustomer.name}</h2>
              <button className="close-btn" onClick={() => setShowViewModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="customer-detail-view">
                <div className="customer-detail-header">
                  <div className="customer-detail-avatar">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div className="customer-detail-info">
                    <h3>{selectedCustomer.name}</h3>
                    <p className="customer-detail-email">{selectedCustomer.email}</p>
                    <div className="customer-detail-status">
                      <span className={`status-badge-large ${getStatusColor(selectedCustomer.status)}`}>
                        {selectedCustomer.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="customer-detail-sections">
                  <div className="detail-section">
                    <h4>Contact Information</h4>
                    <div className="contact-details">
                      <div className="detail-row">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{selectedCustomer.phone}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Address:</span>
                        <span className="detail-value">{selectedCustomer.address}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Join Date:</span>
                        <span className="detail-value">{selectedCustomer.joinDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Purchase History</h4>
                    <div className="purchase-stats">
                      <div className="stat-row">
                        <span className="stat-label">Total Orders:</span>
                        <span className="stat-value">{selectedCustomer.totalOrders}</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-label">Total Spent:</span>
                        <span className="stat-value">${selectedCustomer.totalSpent}</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-label">Last Order:</span>
                        <span className="stat-value">{selectedCustomer.lastOrder}</span>
                      </div>
                      <div className="stat-row">
                        <span className="stat-label">Rating:</span>
                        <span className="stat-value">{selectedCustomer.rating}/5</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Preferences</h4>
                    <div className="preferences-list">
                      {selectedCustomer.preferences.map((pref, index) => (
                        <span key={index} className="preference-tag-large">{pref}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Notes</h4>
                    <div className="customer-notes">
                      <p>{selectedCustomer.notes}</p>
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

export default Customers;
