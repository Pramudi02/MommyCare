import React, { useState, useEffect } from 'react';
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
  X,
  Loader2
} from 'lucide-react';
import { productAPI } from '../../services/api';
import './Products.css';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All Categories']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load products and categories on component mount
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getServiceProviderProducts();
      console.log('Products API response:', response); // Debug log
      
      // Handle the correct response structure from backend
      let productsData = [];
      if (response && response.success && response.data && response.data.products) {
        productsData = response.data.products;
      } else if (Array.isArray(response)) {
        productsData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        productsData = response.data;
      }
      
      console.log('Products data to set:', productsData); // Debug log
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products. Please try again.');
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      console.log('Categories API response:', response); // Debug log
      
      // Handle the correct response structure from backend
      let categoriesData = [];
      if (response && response.success && response.data) {
        categoriesData = response.data;
      } else if (Array.isArray(response)) {
        categoriesData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        categoriesData = response.data;
      }
      
      console.log('Categories data to set:', categoriesData); // Debug log
      const categoryList = ['All Categories', ...(Array.isArray(categoriesData) ? categoriesData : [])];
      setCategories(categoryList);
    } catch (err) {
      console.error('Failed to load categories:', err);
      // Keep default categories if API fails
      setCategories(['All Categories', 'Feeding', 'Comfort', 'Travel', 'Clothing', 'Safety', 'Toys', 'Health']);
    }
  };



  const filteredProducts = (Array.isArray(products) ? products : []).filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
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
    window.location.href = `/service-provider/products/edit/${product._id}`;
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(productId);
        // Remove product from local state
        setProducts((Array.isArray(products) ? products : []).filter(p => p._id !== productId));
        // Close modal if viewing the deleted product
        if (selectedProduct && selectedProduct._id === productId) {
          setShowViewModal(false);
          setSelectedProduct(null);
        }
      } catch (err) {
        console.error('Failed to delete product:', err);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleExternalLink = async (product) => {
    try {
      // Track the click
      await productAPI.trackClick(product._id);
      // Open external link
      window.open(product.externalLink, '_blank');
      // Update local state to reflect the click
      setProducts((Array.isArray(products) ? products : []).map(p => 
        p._id === product._id 
          ? { ...p, clicks: (p.clicks || 0) + 1 }
          : p
      ));
    } catch (err) {
      console.error('Failed to track click:', err);
      // Still open the link even if tracking fails
      window.open(product.externalLink, '_blank');
    }
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

  const getProductImage = (product) => {
    // Map specific products to their baby product images
    if (product.name === 'bag') {
      return 'https://i.pinimg.com/1200x/be/0d/82/be0d828f021230cf1b4a6b2ffda76bf2.jpg';
    } else if (product.name === 'shirt') {
      return 'https://i.pinimg.com/1200x/a5/5c/24/a55c24a8437079e58ffbe708cb7b32a1.jpg';
    } else if (product.name === 'qqq') {
      return 'https://i.pinimg.com/1200x/a9/7d/a8/a97da8e25aae77c610de6c02171a378b.jpg';
    }
    
    // For other products, use the original logic
    if (product.image) {
      return product.image.startsWith('http') ? product.image : `http://localhost:5000/uploads/${product.image}`;
    }
    
    return '/images/placeholder-product.jpg';
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

  if (loading) {
    return (
      <div className="sp-products-page">
        <div className="sp-products-container-wrapper">
          <div className="sp-loading-container">
            <Loader2 className="sp-loading-spinner" />
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sp-products-page">
      <div className="sp-products-container-wrapper">

      <div className="sp-products-header">
        <div className="sp-products-header-content">
          <div className="sp-products-header-icon">
            <Package />
          </div>
          <div className="sp-products-title">
            <h1>Product Listings</h1>
            <p>Manage your product listings with external links</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="sp-error-message">
          <AlertCircle className="sp-error-icon" />
          <span>{error}</span>
          <button 
            className="sp-btn sp-btn-outline sp-btn-sm"
            onClick={loadProducts}
          >
            Retry
          </button>
        </div>
      )}

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
          <div key={product._id} className="sp-product-card">
            <div className="sp-product-image-container">
              <img 
                src={getProductImage(product)} 
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
                  <span>4.5</span>
                </div>
              </div>
              
              <div className="sp-product-stats">
                <div className="sp-stat">
                  <Eye className="sp-stat-icon" />
                  <span>{product.views || 0}</span>
                </div>
                <div className="sp-stat">
                  <ExternalLink className="sp-stat-icon" />
                  <span>{product.clicks || 0}</span>
                </div>
                <div className="sp-stat">
                  <TrendingUp className="sp-stat-icon" />
                  <span>{product.views && product.clicks ? ((product.clicks / product.views) * 100).toFixed(1) + '%' : '0%'}</span>
                </div>
              </div>
              
              <div className="sp-product-tags">
                {product.tags?.slice(0, 3).map((tag, index) => (
                  <span key={index} className="sp-tag">
                    {tag}
                  </span>
                ))}
                {product.tags?.length > 3 && (
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
                onClick={() => handleExternalLink(product)}
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
                onClick={() => handleDeleteProduct(product._id)}
              >
                <Trash2 className="sp-btn-icon" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && !loading && (
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
                    src={getProductImage(selectedProduct)} 
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
                      <span>4.5</span>
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
                        <span className="sp-stat-value">{selectedProduct.views || 0}</span>
                        <span className="sp-stat-label">Views</span>
                      </div>
                    </div>
                    <div className="sp-stat-item">
                      <ExternalLink className="sp-stat-icon" />
                      <div>
                        <span className="sp-stat-value">{selectedProduct.clicks || 0}</span>
                        <span className="sp-stat-label">Clicks</span>
                      </div>
                  </div>
                    <div className="sp-stat-item">
                      <TrendingUp className="sp-stat-icon" />
                      <div>
                        <span className="sp-stat-value">{selectedProduct.views && selectedProduct.clicks ? ((selectedProduct.clicks / selectedProduct.views) * 100).toFixed(1) + '%' : '0%'}</span>
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
                    {selectedProduct.tags?.map((tag, index) => (
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
                onClick={() => handleExternalLink(selectedProduct)}
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
