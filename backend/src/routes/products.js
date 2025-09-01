const express = require('express');
const asyncHandler = require('express-async-handler');
const {
  getActiveProducts,
  getProductById,
  trackProductClick,
  getProductCategories
} = require('../controllers/productController');

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all active products (public)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
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
 *           default: 12
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 */
router.get('/', getActiveProducts);

/**
 * @swagger
 * /api/products/categories:
 *   get:
 *     summary: Get product categories with counts
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
router.get('/categories', getProductCategories);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /api/products/{id}/click:
 *   post:
 *     summary: Track product click (when user clicks external link)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Click tracked successfully
 *       404:
 *         description: Product not found
 */
router.post('/:id/click', trackProductClick);

module.exports = router;
