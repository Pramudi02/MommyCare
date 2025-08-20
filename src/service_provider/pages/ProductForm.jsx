import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle,
  Image,
  Trash2,
  Camera
} from 'lucide-react';
import './ProductForm.css';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    externalLink: '',
    tags: [],
    status: 'pending',
    image: null,
    imagePreview: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [dragActive, setDragActive] = useState(false);

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
        image: null,
        imagePreview: null
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

    if (!formData.image && !formData.imagePreview) {
      newErrors.image = 'Product image is required';
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

  const handleImageUpload = (file) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file'
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);

      // Clear any previous image errors
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      <div className="sp-product-form-header">
        <div className="sp-product-form-header-icon">
          <Package />
        </div>
        <div className="sp-product-form-title">
          <h1>{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
          <p>{isEditing ? 'Update your product information' : 'Create a new product listing with external link'}</p>
        </div>
      </div>

      <div className="sp-product-form-container">
        <form onSubmit={handleSubmit} className="sp-form">
          {/* Basic Information */}
          <div className="sp-form-section">
            <h3>
              <Package />
              Basic Information
            </h3>
            
            <div className="sp-form-row">
              <div className="sp-form-group">
                <label htmlFor="name" className="sp-form-label required">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`sp-form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter product name"
                />
                {errors.name && <span className="sp-form-error">{errors.name}</span>}
              </div>
              
              <div className="sp-form-group">
                <label htmlFor="category" className="sp-form-label required">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`sp-form-input sp-form-select ${errors.category ? 'error' : ''}`}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <span className="sp-form-error">{errors.category}</span>}
              </div>
            </div>

            <div className="sp-form-row">
              <div className="sp-form-group">
                <label htmlFor="price" className="sp-form-label required">
                  Price
                </label>
                <div className="sp-price-input-wrapper">
                  <DollarSign className="sp-price-icon" />
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`sp-form-input ${errors.price ? 'error' : ''}`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.price && <span className="sp-form-error">{errors.price}</span>}
              </div>
              
              <div className="sp-form-group">
                <label htmlFor="status" className="sp-form-label">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="sp-form-input sp-form-select"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sp-form-group full-width">
              <label htmlFor="description" className="sp-form-label required">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`sp-form-input sp-form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Describe your product..."
                rows="4"
              />
              {errors.description && <span className="sp-form-error">{errors.description}</span>}
            </div>
          </div>

          {/* External Link */}
          <div className="sp-form-section">
            <h3>
              <Globe />
              External Link
            </h3>
            
            <div className="sp-form-group full-width">
              <label htmlFor="externalLink" className="sp-form-label required">
                Product URL
              </label>
              <div className="sp-link-input-wrapper">
                <Link className="sp-link-icon" />
                <input
                  type="url"
                  id="externalLink"
                  name="externalLink"
                  value={formData.externalLink}
                  onChange={handleInputChange}
                  className={`sp-form-input ${errors.externalLink ? 'error' : ''}`}
                  placeholder="https://your-store.com/product"
                />
              </div>
              {errors.externalLink && <span className="sp-form-error">{errors.externalLink}</span>}
              <p className="sp-help-text">
                This is the link where customers will be redirected to purchase your product
              </p>
            </div>
          </div>

          {/* Product Image */}
          <div className="sp-form-section">
            <h3>
              <Image />
              Product Image
            </h3>
            
            <div className="sp-form-group full-width">
              <label className="sp-form-label required">
                Upload Product Image
              </label>
              
              {formData.imagePreview ? (
                <div className="sp-image-preview-container">
                  <img 
                    src={formData.imagePreview} 
                    alt="Product preview" 
                    className="sp-image-preview"
                  />
                  <button
                    type="button"
                    className="sp-remove-image-btn"
                    onClick={removeImage}
                  >
                    <Trash2 />
                    Remove Image
                  </button>
                </div>
              ) : (
                <div 
                  className={`sp-image-upload-area ${dragActive ? 'drag-active' : ''} ${errors.image ? 'error' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="sp-file-input"
                  />
                  <div className="sp-upload-content">
                    <Camera className="sp-upload-icon" />
                    <h4>Click to upload or drag and drop</h4>
                    <p>PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
              )}
              
              {errors.image && <span className="sp-form-error">{errors.image}</span>}
            </div>
          </div>

          {/* Tags */}
          <div className="sp-form-section">
            <h3>
              <Tag />
              Tags
            </h3>
            
            <div className="sp-form-group full-width">
              <label className="sp-form-label">Product Tags</label>
              <div className="sp-tags-input-container">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="sp-form-input sp-tag-input"
                  placeholder="Add a tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <button
                  type="button"
                  className="sp-btn sp-btn-secondary sp-add-tag-btn"
                  onClick={handleAddTag}
                >
                  Add
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="sp-tags-container">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="sp-tag">
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

          {/* Form Actions */}
          <div className="sp-form-actions">
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
              {isSubmitting ? (
                <>
                  <div className="sp-loading"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save />
                  {isEditing ? 'Update Product' : 'Create Product'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
