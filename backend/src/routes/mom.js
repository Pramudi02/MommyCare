const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/mom/profile:
 *   get:
 *     summary: Get mom profile information
 *     tags: [Mom]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mom profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Not authorized
 */
router.get('/profile', (req, res) => {
	res.json({ status: 'success', data: { message: 'Mom profile endpoint (stub)' } });
});

router.get('/medical-records', (req, res) => {
	res.json({ status: 'success', data: [] });
});

router.get('/appointments', (req, res) => {
	res.json({ status: 'success', data: [] });
});

module.exports = router;
