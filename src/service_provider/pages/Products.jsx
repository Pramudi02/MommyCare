import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  Package,
  TrendingUp,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Link,
  Globe,
  Calendar,
  Tag
} from 'lucide-react';
import './Products.css';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = ['All Categories', 'Feeding', 'Comfort', 'Travel', 'Clothing', 'Safety', 'Toys', 'Health'];

  const products = [
    {
      id: 1,
      name: 'Premium Baby Carrier',
      category: 'Travel',
      price: 89.99,
      status: 'active',
      rating: 4.8,
      views: 156,
      clicks: 23,
      clickRate: '14.7%',
      image: '👶',
      description: 'Ergonomic baby carrier with multiple carrying positions and adjustable straps for maximum comfort.',
      externalLink: 'https://example-store.com/baby-carrier',
      tags: ['Ergonomic', 'Adjustable', 'Comfortable'],
      createdAt: '2024-01-15',
      lastUpdated: '2024-01-20'
    },
    {
      id: 2,
      name: 'Organic Cotton Diaper Bag',
      category: 'Travel',
      price: 45.50,
      status: 'active',
      rating: 4.6,
      views: 89,
      clicks: 12,
      clickRate: '13.5%',
      image: '👜',
      description: 'Spacious diaper bag made from organic cotton with multiple compartments and changing pad.',
      externalLink: 'https://example-store.com/diaper-bag',
      tags: ['Organic', 'Spacious', 'Eco-friendly'],
      createdAt: '2024-01-10',
      lastUpdated: '2024-01-18'
    },
    {
      id: 3,
      name: 'Electric Breast Pump',
      category: 'Feeding',
      price: 129.99,
      status: 'active',
      rating: 4.9,
      views: 67,
      clicks: 8,
      clickRate: '11.9%',
      image: '🍼',
      description: 'Double electric breast pump with adjustable suction levels and comfortable breast shields.',
      externalLink: 'https://example-store.com/breast-pump',
      tags: ['Electric', 'Adjustable', 'Comfortable'],
      createdAt: '2024-01-05',
      lastUpdated: '2024-01-22'
    },
    {
      id: 4,
      name: 'Lightweight Baby Stroller',
      category: 'Travel',
      price: 299.99,
      status: 'pending',
      rating: 4.7,
      views: 34,
      clicks: 5,
      clickRate: '14.7%',
      image: '🚼',
      description: 'Ultra-lightweight stroller with one-hand fold mechanism and all-terrain wheels.',
      externalLink: 'https://example-store.com/baby-stroller',
      tags: ['Lightweight', 'Compact', 'Durable'],
      createdAt: '2024-01-12',
      lastUpdated: '2024-01-19'
    },
    {
      id: 5,
      name: 'Baby Sleep Sack',
      category: 'Comfort',
      price: 29.99,
      status: 'active',
      rating: 4.5,
      views: 45,
      clicks: 6,
      clickRate: '13.3%',
      image: '🛏️',
      description: 'Soft and breathable sleep sack for safe and comfortable sleep.',
      externalLink: 'https://example-store.com/sleep-sack',
      tags: ['Soft', 'Breathable', 'Safe'],
      createdAt: '2024-01-08',
      lastUpdated: '2024-01-16'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = (productId) => {
    // Handle delete logic here
    console.log('Delete product:', productId);
  };

  const handleExternalLink = (link) => {
    window.open(link, '_blank');
  };

  return (
    <div className="sp-products-page">
      <div className="sp-products-header">
        <div className="sp-products-title">
          <h1>Product Listings</h1>
          <p>Manage your product listings with external links</p>
        </div>
        <div className="sp-products-actions">
          <button 
            className="sp-btn sp-btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="sp-btn-icon" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="sp-filters-section">
        <div className="sp-search-box">
          <Search className="sp-search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sp-search-input"
          />
        </div>
        
        <div className="sp-filter-controls">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="sp-filter-select"
          >
            {categories.map(category => (
              <option key={category} value={category === 'All Categories' ? 'all' : category}>
                {category}
              </option>
            ))}
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="sp-filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="sp-products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="sp-product-card">
            <div className="sp-product-header">
              <div className="sp-product-image">
                <span className="sp-product-emoji">{product.image}</span>
              </div>
              <div className="sp-product-status">
                <span className={`sp-status-badge sp-status-${product.status}`}>
                  {product.status}
                </span>
              </div>
            </div>
            
            <div className="sp-product-content">
              <h3 className="sp-product-name">{product.name}</h3>
              <p className="sp-product-category">{product.category}</p>
              <p className="sp-product-description">{product.description}</p>
              
              <div className="sp-product-price">
                <span className="sp-price">${product.price}</span>
                <div className="sp-rating">
                  <Star className="sp-star-icon" />
                  <span>{product.rating}</span>
                </div>
              </div>
              
              <div className="sp-product-stats">
                <div className="sp-stat">
                  <Eye className="sp-stat-icon" />
                  <span>{product.views} views</span>
                </div>
                <div className="sp-stat">
                  <ExternalLink className="sp-stat-icon" />
                  <span>{product.clicks} clicks</span>
                </div>
                <div className="sp-stat">
                  <TrendingUp className="sp-stat-icon" />
                  <span>{product.clickRate}</span>
                </div>
              </div>
              
              <div className="sp-product-tags">
                {product.tags.map((tag, index) => (
                  <span key={index} className="sp-tag">
                    <Tag className="sp-tag-icon" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="sp-product-actions">
              <button 
                className="sp-btn sp-btn-secondary"
                onClick={() => handleViewProduct(product)}
              >
                <Eye className="sp-btn-icon" />
                View
              </button>
              <button 
                className="sp-btn sp-btn-primary"
                onClick={() => handleExternalLink(product.externalLink)}
              >
                <ExternalLink className="sp-btn-icon" />
                Visit Store
              </button>
              <button 
                className="sp-btn sp-btn-outline"
                onClick={() => handleEditProduct(product)}
              >
                <Edit className="sp-btn-icon" />
                Edit
              </button>
              <button 
                className="sp-btn sp-btn-danger"
                onClick={() => handleDeleteProduct(product.id)}
              >
                <Trash2 className="sp-btn-icon" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="sp-empty-state">
          <Package className="sp-empty-icon" />
          <h3>No products found</h3>
          <p>Try adjusting your search or filters to find what you're looking for.</p>
          <button 
            className="sp-btn sp-btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="sp-btn-icon" />
            Add Your First Product
          </button>
        </div>
      )}

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <div className="sp-modal-overlay">
          <div className="sp-modal">
            <div className="sp-modal-header">
              <h2>Product Details</h2>
              <button 
                className="sp-modal-close"
                onClick={() => setShowViewModal(false)}
              >
                ×
              </button>
            </div>
            <div className="sp-modal-content">
              <div className="sp-product-detail">
                <div className="sp-product-detail-header">
                  <span className="sp-product-detail-emoji">{selectedProduct.image}</span>
                  <div>
                    <h3>{selectedProduct.name}</h3>
                    <p className="sp-product-detail-category">{selectedProduct.category}</p>
                  </div>
                </div>
                
                <div className="sp-product-detail-info">
                  <div className="sp-detail-row">
                    <span className="sp-detail-label">Price:</span>
                    <span className="sp-detail-value">${selectedProduct.price}</span>
                  </div>
                  <div className="sp-detail-row">
                    <span className="sp-detail-label">Rating:</span>
                    <span className="sp-detail-value">
                      <Star className="sp-star-icon" />
                      {selectedProduct.rating}
                    </span>
                  </div>
                  <div className="sp-detail-row">
                    <span className="sp-detail-label">Status:</span>
                    <span className={`sp-status-badge sp-status-${selectedProduct.status}`}>
                      {selectedProduct.status}
                    </span>
                  </div>
                  <div className="sp-detail-row">
                    <span className="sp-detail-label">External Link:</span>
                    <a 
                      href={selectedProduct.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sp-external-link"
                    >
                      <Globe className="sp-link-icon" />
                      Visit Store
                    </a>
                  </div>
                </div>
                
                <div className="sp-product-detail-stats">
                  <h4>Performance</h4>
                  <div className="sp-stats-grid">
                    <div className="sp-stat-item">
                      <Eye className="sp-stat-icon" />
                      <div>
                        <span className="sp-stat-value">{selectedProduct.views}</span>
                        <span className="sp-stat-label">Views</span>
                      </div>
                    </div>
                    <div className="sp-stat-item">
                      <ExternalLink className="sp-stat-icon" />
                      <div>
                        <span className="sp-stat-value">{selectedProduct.clicks}</span>
                        <span className="sp-stat-label">Clicks</span>
                      </div>
                    </div>
                    <div className="sp-stat-item">
                      <TrendingUp className="sp-stat-icon" />
                      <div>
                        <span className="sp-stat-value">{selectedProduct.clickRate}</span>
                        <span className="sp-stat-label">Click Rate</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="sp-product-detail-description">
                  <h4>Description</h4>
                  <p>{selectedProduct.description}</p>
                </div>
                
                <div className="sp-product-detail-tags">
                  <h4>Tags</h4>
                  <div className="sp-tags-list">
                    {selectedProduct.tags.map((tag, index) => (
                      <span key={index} className="sp-tag">
                        <Tag className="sp-tag-icon" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="sp-modal-footer">
              <button 
                className="sp-btn sp-btn-secondary"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
              <button 
                className="sp-btn sp-btn-primary"
                onClick={() => handleExternalLink(selectedProduct.externalLink)}
              >
                <ExternalLink className="sp-btn-icon" />
                Visit Store
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal would go here */}
      {/* This would be a separate component for the form */}
    </div>
  );
};

export default Products;
