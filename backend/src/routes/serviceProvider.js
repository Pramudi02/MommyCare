const express = require('express');
const asyncHandler = require('express-async-handler');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/fileUpload');
const {
  getServiceProviderProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats
} = require('../controllers/productController');

const router = express.Router();

/**
 * @swagger
 * /api/service-provider/permission-request:
 *   post:
 *     summary: Submit service provider permission request
 *     tags: [Service Provider]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               businessName:
 *                 type: string
 *               businessAddress:
 *                 type: string
 *               businessPhone:
 *                 type: string
 *               businessEmail:
 *                 type: string
 *               businessType:
 *                 type: string
 *               registrationNumber:
 *                 type: string
 *               taxId:
 *                 type: string
 *               yearsInBusiness:
 *                 type: string
 *               services:
 *                 type: array
 *               products:
 *                 type: array
 *               location:
 *                 type: object
 *     responses:
 *       201:
 *         description: Permission request submitted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 */
router.post('/permission-request', protect, authorize('service_provider'), asyncHandler(async (req, res) => {
  // TODO: Implement permission request logic
  // For now, just return success
  res.status(201).json({
    status: 'success',
    message: 'Permission request submitted successfully'
  });
}));

/**
 * @swagger
 * /api/service-provider/dashboard:
 *   get:
 *     summary: Get service provider dashboard data
 *     tags: [Service Provider]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get('/dashboard', protect, authorize('service_provider'), asyncHandler(async (req, res) => {
  // TODO: Implement dashboard logic with product stats, orders, etc.
  res.json({ 
    status: 'success', 
    data: { 
      message: 'Service Provider dashboard endpoint',
      user: req.user
    } 
  });
}));

/**
 * @swagger
 * /api/service-provider/products:
 *   get:
 *     summary: Get all products for service provider
 *     tags: [Service Provider]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, pending, inactive, rejected]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       401:
 *         description: Not authorized
 *   post:
 *     summary: Create new product
 *     tags: [Service Provider]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *               - description
 *               - externalLink
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Feeding, Comfort, Travel, Clothing, Safety, Toys, Health, Bath & Care, Sleep, Development]
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               externalLink:
 *                 type: string
 *               tags:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 */
router.route('/products')
  .get(protect, authorize('service_provider'), getServiceProviderProducts)
  .post(protect, authorize('service_provider'), upload.single('image'), createProduct);

/**
 * @swagger
 * /api/service-provider/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Service Provider]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               externalLink:
 *                 type: string
 *               tags:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized to update this product
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Delete product
 *     tags: [Service Provider]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized to delete this product
 *       404:
 *         description: Product not found
 */
router.route('/products/:id')
  .put(protect, authorize('service_provider'), upload.single('image'), updateProduct)
  .delete(protect, authorize('service_provider'), deleteProduct);

/**
 * @swagger
 * /api/service-provider/products/stats:
 *   get:
 *     summary: Get product statistics for service provider
 *     tags: [Service Provider]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get('/products/stats', protect, authorize('service_provider'), getProductStats);

/**
 * @swagger
 * /api/service-provider/orders:
 *   get:
 *     summary: Get orders for service provider
 *     tags: [Service Provider]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get('/orders', protect, authorize('service_provider'), asyncHandler(async (req, res) => {
  // TODO: Implement orders logic
  res.json({ 
    status: 'success', 
    data: { 
      message: 'Orders endpoint - to be implemented',
      orders: []
    } 
  });
}));

module.exports = router;
