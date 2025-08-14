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
  DollarSign,
  ShoppingCart,
  AlertCircle,
  CheckCircle
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
      stock: 45,
      status: 'active',
      rating: 4.8,
      sales: 156,
      revenue: 14039.44,
      image: '👶',
      description: 'Ergonomic baby carrier with multiple carrying positions and adjustable straps for maximum comfort.',
      tags: ['Ergonomic', 'Adjustable', 'Comfortable'],
      createdAt: '2024-01-15',
      lastUpdated: '2024-01-20'
    },
    {
      id: 2,
      name: 'Organic Cotton Diaper Bag',
      category: 'Travel',
      price: 45.50,
      stock: 23,
      status: 'active',
      rating: 4.6,
      sales: 89,
      revenue: 4049.50,
      image: '👜',
      description: 'Spacious diaper bag made from organic cotton with multiple compartments and changing pad.',
      tags: ['Organic', 'Spacious', 'Eco-friendly'],
      createdAt: '2024-01-10',
      lastUpdated: '2024-01-18'
    },
    {
      id: 3,
      name: 'Electric Breast Pump',
      category: 'Feeding',
      price: 129.99,
      stock: 12,
      status: 'low-stock',
      rating: 4.9,
      sales: 67,
      revenue: 8709.33,
      image: '🍼',
      description: 'Double electric breast pump with adjustable suction levels and comfortable breast shields.',
      tags: ['Electric', 'Adjustable', 'Comfortable'],
      createdAt: '2024-01-05',
      lastUpdated: '2024-01-22'
    },
    {
      id: 4,
      name: 'Lightweight Baby Stroller',
      category: 'Travel',
      price: 299.99,
      stock: 8,
      status: 'low-stock',
      rating: 4.7,
      sales: 34,
      revenue: 10199.66,
      image: '🚼',
      description: 'Ultra-lightweight stroller with one-hand fold mechanism and all-terrain wheels.',
      tags: ['Lightweight', 'Compact', 'Durable'],
      createdAt: '2024-01-12',
      lastUpdated: '2024-01-19'
    },
    {
      id: 5,
      name: 'Baby Sleep Sack',
      category: 'Comfort',
      price: 29.99,
      stock: 67,
      status: 'active',
      rating: 4.5,
      sales: 123,
      revenue: 3688.77,
      image: '😴',
      description: 'Soft, breathable sleep sack with zipper closure and adjustable sizing.',
      tags: ['Soft', 'Breathable', 'Safe'],
      createdAt: '2024-01-08',
      lastUpdated: '2024-01-17'
    },
    {
      id: 6,
      name: 'Baby Safety Gate',
      category: 'Safety',
      price: 79.99,
      stock: 15,
      status: 'active',
      rating: 4.4,
      sales: 45,
      revenue: 3599.55,
      image: '🚪',
      description: 'Adjustable safety gate with easy installation and secure locking mechanism.',
      tags: ['Adjustable', 'Secure', 'Easy Install'],
      createdAt: '2024-01-14',
      lastUpdated: '2024-01-21'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'low-stock':
        return 'text-orange-600 bg-orange-100';
      case 'out-of-stock':
        return 'text-red-600 bg-red-100';
      case 'discontinued':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'low-stock':
        return <AlertCircle className="w-4 h-4" />;
      case 'out-of-stock':
        return <Package className="w-4 h-4" />;
      case 'discontinued':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      console.log('Deleting product:', productId);
      // Handle delete logic here
    }
  };

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-header">
        <div className="products-header__left">
          <h1>Product Management 🛍️</h1>
          <p>Manage your baby products inventory, pricing, and availability</p>
        </div>
        <div className="products-header__right">
          <button className="add-product-btn" onClick={handleAddProduct}>
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="products-stats">
        <div className="stat-item">
          <div className="stat-icon">
            <Package className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{products.length}</div>
            <div className="stat-label">Total Products</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{products.reduce((sum, p) => sum + p.sales, 0)}</div>
            <div className="stat-label">Total Sales</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <div className="stat-value">${products.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <div className="stat-value">{products.filter(p => p.status === 'active').length}</div>
            <div className="stat-label">Active Products</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="products-controls">
        <div className="search-section">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="filter-section">
          <div className="filter-group">
            <label>Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category === 'All Categories' ? 'all' : category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-card__header">
              <div className="product-image">{product.image}</div>
              <div className="product-status">
                <span className={`status-badge ${getStatusColor(product.status)}`}>
                  {getStatusIcon(product.status)}
                  {product.status.replace('-', ' ')}
                </span>
              </div>
            </div>
            
            <div className="product-card__content">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              
              <div className="product-meta">
                <div className="product-category">{product.category}</div>
                <div className="product-rating">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{product.rating}</span>
                </div>
              </div>
              
              <div className="product-stats">
                <div className="stat">
                  <span className="stat-label">Price:</span>
                  <span className="stat-value">${product.price}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Stock:</span>
                  <span className="stat-value">{product.stock}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Sales:</span>
                  <span className="stat-value">{product.sales}</span>
                </div>
              </div>
              
              <div className="product-tags">
                {product.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
            
            <div className="product-card__actions">
              <button 
                className="action-btn view-btn"
                onClick={() => handleViewProduct(product)}
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button 
                className="action-btn edit-btn"
                onClick={() => handleEditProduct(product)}
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button 
                className="action-btn delete-btn"
                onClick={() => handleDeleteProduct(product.id)}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Product</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <p>Add new product form will go here...</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Product: {selectedProduct.name}</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <p>Edit product form will go here...</p>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Product Details: {selectedProduct.name}</h2>
              <button className="close-btn" onClick={() => setShowViewModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="product-detail-view">
                <div className="product-detail-header">
                  <div className="product-detail-image">{selectedProduct.image}</div>
                  <div className="product-detail-info">
                    <h3>{selectedProduct.name}</h3>
                    <p className="product-detail-category">{selectedProduct.category}</p>
                    <div className="product-detail-rating">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{selectedProduct.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="product-detail-description">
                  <h4>Description</h4>
                  <p>{selectedProduct.description}</p>
                </div>
                
                <div className="product-detail-stats">
                  <div className="detail-stat">
                    <span className="detail-stat-label">Price:</span>
                    <span className="detail-stat-value">${selectedProduct.price}</span>
                  </div>
                  <div className="detail-stat">
                    <span className="detail-stat-label">Stock:</span>
                    <span className="detail-stat-value">{selectedProduct.stock}</span>
                  </div>
                  <div className="detail-stat">
                    <span className="detail-stat-label">Sales:</span>
                    <span className="detail-stat-value">{selectedProduct.sales}</span>
                  </div>
                  <div className="detail-stat">
                    <span className="detail-stat-label">Revenue:</span>
                    <span className="detail-stat-value">${selectedProduct.revenue.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="product-detail-tags">
                  <h4>Tags</h4>
                  <div className="tags-list">
                    {selectedProduct.tags.map((tag, index) => (
                      <span key={index} className="detail-tag">{tag}</span>
                    ))}
                  </div>
                </div>
                
                <div className="product-detail-dates">
                  <div className="detail-date">
                    <span className="detail-date-label">Created:</span>
                    <span className="detail-date-value">{selectedProduct.createdAt}</span>
                  </div>
                  <div className="detail-date">
                    <span className="detail-date-label">Last Updated:</span>
                    <span className="detail-date-value">{selectedProduct.lastUpdated}</span>
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

export default Products;
