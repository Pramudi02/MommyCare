const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');

// @desc    Get all products for a service provider
// @route   GET /api/service-provider/products
// @access  Private (Service Provider)
const getServiceProviderProducts = asyncHandler(async (req, res) => {
  const { status, category, page = 1, limit = 10 } = req.query;
  const serviceProviderId = req.user.id;

  console.log('Service Provider Products Request:', {
    serviceProviderId,
    user: req.user,
    query: req.query
  });

  // Build query
  const query = { serviceProvider: serviceProviderId };
  if (status) {
    query.status = status;
  }
  if (category) {
    query.category = category;
  }

  console.log('Database query:', query);

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Get products with pagination
  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  console.log('Found products:', products.length, products);

  // Get total count for pagination
  const total = await Product.countDocuments(query);

  console.log('Total products count:', total);

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    }
  });
});

// @desc    Get all active products (for public/mom view)
// @route   GET /api/products
// @access  Public
const getActiveProducts = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 12 } = req.query;

  // Build query
  const query = { status: 'active' };
  if (category) {
    query.category = category;
  }
  if (search) {
    query.$text = { $search: search };
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Get products with pagination
  const products = await Product.find(query)
    .populate('serviceProvider', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  // Get total count for pagination
  const total = await Product.countDocuments(query);

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    }
  });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('serviceProvider', 'name email')
    .populate('review.reviewedBy', 'name email');

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.json({
    success: true,
    data: product
  });
});

// @desc    Create new product
// @route   POST /api/service-provider/products
// @access  Private (Service Provider)
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    price,
    description,
    externalLink,
    tags
  } = req.body;

  // Check if image was uploaded
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Product image is required'
    });
  }

  // Create product data
  const productData = {
    serviceProvider: req.user.id,
    name,
    category,
    price: parseFloat(price),
    description,
    externalLink,
    image: req.file.filename, // Store the filename
    tags: tags ? tags.split(',').map(tag => tag.trim()) : []
  };

  const product = await Product.create(productData);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/service-provider/products/:id
// @access  Private (Service Provider)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Check if user owns this product
  if (product.serviceProvider.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this product'
    });
  }

  const {
    name,
    category,
    price,
    description,
    externalLink,
    tags
  } = req.body;

  // Update product data
  const updateData = {
    name,
    category,
    price: parseFloat(price),
    description,
    externalLink,
    tags: tags ? tags.split(',').map(tag => tag.trim()) : []
  };

  // If new image was uploaded, update image and delete old one
  if (req.file) {
    // Delete old image if it exists
    if (product.image) {
      const oldImagePath = path.join(__dirname, '../../uploads', product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    updateData.image = req.file.filename;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: updatedProduct
  });
});

// @desc    Delete product
// @route   DELETE /api/service-provider/products/:id
// @access  Private (Service Provider)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Check if user owns this product
  if (product.serviceProvider.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this product'
    });
  }

  // Delete product image if it exists
  if (product.image) {
    const imagePath = path.join(__dirname, '../../uploads', product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await Product.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// @desc    Track product click
// @route   POST /api/products/:id/click
// @access  Public
const trackProductClick = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Increment click count
  await Product.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });

  res.json({
    success: true,
    message: 'Click tracked successfully',
    data: {
      externalLink: product.externalLink
    }
  });
});

// @desc    Get product statistics for service provider
// @route   GET /api/service-provider/products/stats
// @access  Private (Service Provider)
const getProductStats = asyncHandler(async (req, res) => {
  const serviceProviderId = req.user.id;

  const stats = await Product.aggregate([
    { $match: { serviceProvider: serviceProviderId } },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        activeProducts: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        pendingProducts: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        totalViews: { $sum: '$views' },
        totalClicks: { $sum: '$clicks' }
      }
    }
  ]);

  const categoryStats = await Product.aggregate([
    { $match: { serviceProvider: serviceProviderId } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.json({
    success: true,
    data: {
      overview: stats[0] || {
        totalProducts: 0,
        activeProducts: 0,
        pendingProducts: 0,
        totalViews: 0,
        totalClicks: 0
      },
      categoryBreakdown: categoryStats
    }
  });
});

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
const getProductCategories = asyncHandler(async (req, res) => {
  console.log('Getting product categories...');
  
  // Get all unique categories from all products (not just active ones)
  const categories = await Product.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  console.log('Found categories:', categories);

  res.json({
    success: true,
    data: categories.map(cat => cat._id) // Return just the category names
  });
});

module.exports = {
  getServiceProviderProducts,
  getActiveProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  trackProductClick,
  getProductStats,
  getProductCategories
};
