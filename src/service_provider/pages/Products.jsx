import React, { useState } from 'react';
import { 
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
  Tag,
  X
} from 'lucide-react';
import './Products.css';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
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
      image: '/images/baby-carrier.jpg',
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
      image: '/images/diaper-bag.jpg',
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
      image: '/images/breast-pump.jpg',
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
      image: '/images/baby-stroller.jpg',
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
      image: '/images/sleep-sack.jpg',
      description: 'Soft and breathable sleep sack for safe and comfortable sleep.',
      externalLink: 'https://example-store.com/sleep-sack',
      tags: ['Soft', 'Breathable', 'Safe'],
      createdAt: '2024-01-08',
      lastUpdated: '2024-01-16'
    },
    {
      id: 6,
      name: 'Baby Monitor Camera',
      category: 'Safety',
      price: 79.99,
      status: 'active',
      rating: 4.4,
      views: 78,
      clicks: 15,
      clickRate: '19.2%',
      image: '/images/baby-monitor.jpg',
      description: 'HD baby monitor with night vision and two-way audio communication.',
      externalLink: 'https://example-store.com/baby-monitor',
      tags: ['HD', 'Night Vision', 'Two-way Audio'],
      createdAt: '2024-01-03',
      lastUpdated: '2024-01-21'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEditProduct = (product) => {
    // Navigate to edit page
    window.location.href = `/service-provider/products/edit/${product.id}`;
  };

  const handleDeleteProduct = (productId) => {
    // Handle delete logic here
    console.log('Delete product:', productId);
  };

  const handleExternalLink = (link) => {
    window.open(link, '_blank');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'sp-status-active';
      case 'pending':
        return 'sp-status-pending';
      case 'inactive':
        return 'sp-status-inactive';
      default:
        return 'sp-status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'inactive':
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="sp-products-page">
      <div className="sp-products-container-wrapper">

      <div className="sp-products-header">
        <div className="sp-products-header-icon">
          <Package />
          </div>
        <div className="sp-products-title">
          <h1>Product Listings</h1>
          <p>Manage your product listings with external links</p>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="sp-search-filters-section">
        <div className="sp-search-container">
          <div className="sp-search-box">
            <Search className="sp-search-icon" />
            <input
              type="text"
              placeholder="Search products by name, description, category, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sp-search-input"
            />
            {searchTerm && (
              <button 
                className="sp-clear-search"
                onClick={() => setSearchTerm('')}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="sp-filter-controls">
          <div className="sp-filter-group">
            <label className="sp-filter-label">Category</label>
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
          </div>
          
          <div className="sp-filter-group">
            <label className="sp-filter-label">Status</label>
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
      </div>

      {/* Products Grid */}
      <div className="sp-products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="sp-product-card">
            <div className="sp-product-image-container">
              <img 
                src={product.image} 
                alt={product.name}
                className="sp-product-image"
                onError={(e) => {
                  e.target.src = '/images/placeholder-product.jpg';
                  e.target.onerror = null;
                }}
              />
              <div className="sp-product-status-overlay">
                <span className={`sp-status-badge ${getStatusColor(product.status)}`}>
                  {getStatusIcon(product.status)}
                  {product.status}
                </span>
              </div>
            </div>
            
            <div className="sp-product-content">
              <div className="sp-product-header">
                <h3 className="sp-product-name">{product.name}</h3>
                <span className="sp-product-category">{product.category}</span>
              </div>
              
              <p className="sp-product-description">{product.description}</p>
              
              <div className="sp-product-price-rating">
                <div className="sp-product-price">
                  <span className="sp-price">${product.price}</span>
                </div>
                <div className="sp-rating">
                  <Star className="sp-star-icon" />
                  <span>{product.rating}</span>
                </div>
              </div>
              
              <div className="sp-product-stats">
                <div className="sp-stat">
                  <Eye className="sp-stat-icon" />
                  <span>{product.views}</span>
                </div>
                <div className="sp-stat">
                  <ExternalLink className="sp-stat-icon" />
                  <span>{product.clicks}</span>
                </div>
                <div className="sp-stat">
                  <TrendingUp className="sp-stat-icon" />
                  <span>{product.clickRate}</span>
                </div>
              </div>
              
              <div className="sp-product-tags">
                {product.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="sp-tag">
                    {tag}
                  </span>
                ))}
                {product.tags.length > 3 && (
                  <span className="sp-tag sp-tag-more">
                    +{product.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
            
            <div className="sp-product-actions">
              <button 
                className="sp-btn sp-btn-secondary sp-btn-view"
                onClick={() => handleViewProduct(product)}
              >
                <Eye className="sp-btn-icon" />
                View
              </button>
              <button 
                className="sp-btn sp-btn-primary sp-btn-visit"
                onClick={() => handleExternalLink(product.externalLink)}
              >
                <ExternalLink className="sp-btn-icon" />
                Visit Store
              </button>
              <button 
                className="sp-btn sp-btn-outline sp-btn-edit"
                onClick={() => handleEditProduct(product)}
              >
                <Edit className="sp-btn-icon" />
                Edit
              </button>
              <button 
                className="sp-btn sp-btn-danger sp-btn-delete"
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
        </div>
      )}

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <div className="sp-modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="sp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sp-modal-header">
              <h2>Product Details</h2>
              <button 
                className="sp-modal-close"
                onClick={() => setShowViewModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="sp-modal-content">
              <div className="sp-product-detail">
                <div className="sp-product-detail-header">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="sp-product-detail-image"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-product.jpg';
                      e.target.onerror = null;
                    }}
                  />
                  <div className="sp-product-detail-info">
                    <h3>{selectedProduct.name}</h3>
                    <p className="sp-product-detail-category">{selectedProduct.category}</p>
                    <div className="sp-product-detail-price">
                      <span className="sp-price">${selectedProduct.price}</span>
                      <div className="sp-rating">
                        <Star className="sp-star-icon" />
                      <span>{selectedProduct.rating}</span>
                    </div>
                  </div>
                </div>
                </div>
                
                <div className="sp-product-detail-stats">
                  <h4>Performance Metrics</h4>
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

      </div>
      
    </div>
  );
};

export default Products;
