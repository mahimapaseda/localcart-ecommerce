const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect, admin } = require('../middleware/auth');

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get store settings
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Store settings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Setting'
 */

/**
 * @swagger
 * /api/settings:
 *   put:
 *     summary: Update store settings (Admin only)
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               storeName:
 *                 type: string
 *               storeDescription:
 *                 type: string
 *               contactEmail:
 *                 type: string
 *               contactPhone:
 *                 type: string
 *               storeAddress:
 *                 type: string
 *               is24Hours:
 *                 type: boolean
 *               openingTime:
 *                 type: string
 *               closingTime:
 *                 type: string
 *               enableCOD:
 *                 type: boolean
 *               enableCards:
 *                 type: boolean
 *               enableBankTransfer:
 *                 type: boolean
 *               orderNotifications:
 *                 type: boolean
 *               lowStockAlerts:
 *                 type: boolean
 *               lowStockThreshold:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access required
 */
router.route('/')
    .get(getSettings)
    .put(protect, admin, updateSettings);

module.exports = router;
