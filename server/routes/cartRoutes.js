const express = require('express');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    mergeCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Not authorized
 */
router.get('/', protect, getCart);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: Product ID to add
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 default: 1
 *     responses:
 *       200:
 *         description: Item added to cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid product or out of stock
 *       401:
 *         description: Not authorized
 */
router.post('/', protect, addToCart);

/**
 * @swagger
 * /api/cart/merge:
 *   post:
 *     summary: Merge guest cart with user cart after login
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Carts merged successfully
 *       401:
 *         description: Not authorized
 */
router.post('/merge', protect, mergeCart);

/**
 * @swagger
 * /api/cart/{productId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Item not found in cart
 */
router.put('/:productId', protect, updateCartItem);

/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to remove
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       401:
 *         description: Not authorized
 */
router.delete('/:productId', protect, removeFromCart);

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear entire cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Not authorized
 */
router.delete('/', protect, clearCart);

module.exports = router;
