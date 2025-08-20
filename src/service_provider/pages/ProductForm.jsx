import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  X, 
  Upload, 
  Link, 
  Tag, 
  DollarSign,
  Package,
  FileText,
  Globe,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import './ProductForm.css';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    externalLink: '',
    tags: [],
    status: 'pending',
    image: '👶'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');

  const categories = [
    'Feeding',
    'Comfort', 
    'Travel', 
    'Clothing', 
    'Safety', 
    'Toys', 
    'Health',
    'Bath & Care',
    'Sleep',
    'Development'
  ];

  const statusOptions = [
    { value: 'active', label: 'Active', icon: <CheckCircle className="w-4 h-4" /> },
    { value: 'pending', label: 'Pending Review', icon: <AlertCircle className="w-4 h-4" /> },
    { value: 'inactive', label: 'Inactive', icon: <X className="w-4 h-4" /> }
  ];

  const emojiOptions = [
    '👶', '🍼', '🛏️', '🚼', '👜', '🧸', '🛁', '👕', '🚪', '🎯',
    '🏥', '🌡️', '💊', '🧴', '🪑', '🚗', '🎨', '📚', '🎵', '🎪'
  ];

  useEffect(() => {
    if (isEditing) {
      // Load product data for editing
      // This would typically come from an API
      const mockProduct = {
        name: 'Premium Baby Carrier',
        category: 'Travel',
        price: '89.99',
        description: 'Ergonomic baby carrier with multiple carrying positions and adjustable straps for maximum comfort.',
        externalLink: 'https://example-store.com/baby-carrier',
        tags: ['Ergonomic', 'Adjustable', 'Comfortable'],
        status: 'active',
        image: '👶'
      };
      setFormData(mockProduct);
    }
  }, [isEditing]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.externalLink.trim()) {
      newErrors.externalLink = 'External link is required';
    } else if (!isValidUrl(formData.externalLink)) {
      newErrors.externalLink = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle success
      navigate('/service-provider/products');
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/service-provider/products');
  };

  return (
    <div className="sp-product-form-page">
      <div className="sp-form-header">
        <div className="sp-form-title">
          <h1>{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
          <p>{isEditing ? 'Update your product information' : 'Create a new product listing with external link'}</p>
        </div>
        <div className="sp-form-actions">
          <button 
            className="sp-btn sp-btn-secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <X className="sp-btn-icon" />
            Cancel
          </button>
          <button 
            className="sp-btn sp-btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Save className="sp-btn-icon" />
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="sp-product-form">
        <div className="sp-form-grid">
          {/* Basic Information */}
          <div className="sp-form-section">
            <h3 className="sp-section-title">
              <Package className="sp-section-icon" />
              Basic Information
            </h3>
            
            <div className="sp-form-row">
              <div className="sp-form-group">
                <label htmlFor="name" className="sp-label">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`sp-input ${errors.name ? 'sp-input-error' : ''}`}
                  placeholder="Enter product name"
                />
                {errors.name && <span className="sp-error">{errors.name}</span>}
              </div>
              
              <div className="sp-form-group">
                <label htmlFor="category" className="sp-label">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`sp-select ${errors.category ? 'sp-select-error' : ''}`}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <span className="sp-error">{errors.category}</span>}
              </div>
            </div>

            <div className="sp-form-row">
              <div className="sp-form-group">
                <label htmlFor="price" className="sp-label">
                  Price *
                </label>
                <div className="sp-price-input">
                  <DollarSign className="sp-price-icon" />
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`sp-input ${errors.price ? 'sp-input-error' : ''}`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.price && <span className="sp-error">{errors.price}</span>}
              </div>
              
              <div className="sp-form-group">
                <label htmlFor="status" className="sp-label">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="sp-select"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sp-form-group">
              <label htmlFor="description" className="sp-label">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`sp-textarea ${errors.description ? 'sp-textarea-error' : ''}`}
                placeholder="Describe your product..."
                rows="4"
              />
              {errors.description && <span className="sp-error">{errors.description}</span>}
            </div>
          </div>

          {/* External Link */}
          <div className="sp-form-section">
            <h3 className="sp-section-title">
              <Globe className="sp-section-icon" />
              External Link
            </h3>
            
            <div className="sp-form-group">
              <label htmlFor="externalLink" className="sp-label">
                Product URL *
              </label>
              <div className="sp-link-input">
                <Link className="sp-link-icon" />
                <input
                  type="url"
                  id="externalLink"
                  name="externalLink"
                  value={formData.externalLink}
                  onChange={handleInputChange}
                  className={`sp-input ${errors.externalLink ? 'sp-input-error' : ''}`}
                  placeholder="https://your-store.com/product"
                />
              </div>
              {errors.externalLink && <span className="sp-error">{errors.externalLink}</span>}
              <p className="sp-help-text">
                This is the link where customers will be redirected to purchase your product
              </p>
            </div>
          </div>

          {/* Product Image */}
          <div className="sp-form-section">
            <h3 className="sp-section-title">
              <Upload className="sp-section-icon" />
              Product Image
            </h3>
            
            <div className="sp-form-group">
              <label className="sp-label">Choose Emoji</label>
              <div className="sp-emoji-grid">
                {emojiOptions.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`sp-emoji-option ${formData.image === emoji ? 'sp-emoji-selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, image: emoji }))}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="sp-form-section">
            <h3 className="sp-section-title">
              <Tag className="sp-section-icon" />
              Tags
            </h3>
            
            <div className="sp-form-group">
              <label className="sp-label">Product Tags</label>
              <div className="sp-tag-input">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="sp-input"
                  placeholder="Add a tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <button
                  type="button"
                  className="sp-btn sp-btn-secondary"
                  onClick={handleAddTag}
                >
                  Add
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="sp-tags-list">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="sp-tag">
                      <Tag className="sp-tag-icon" />
                      {tag}
                      <button
                        type="button"
                        className="sp-tag-remove"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="sp-form-footer">
          <button 
            type="button"
            className="sp-btn sp-btn-secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="sp-btn sp-btn-primary"
            disabled={isSubmitting}
          >
            <Save className="sp-btn-icon" />
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
