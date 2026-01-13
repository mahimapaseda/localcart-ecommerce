const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                price: product.price
            });
        }

        await cart.save();
        cart = await Cart.findById(cart._id).populate('items.product');

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === req.params.productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not in cart' });
        }

        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        cart = await Cart.findById(cart._id).populate('items.product');

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== req.params.productId
        );

        await cart.save();
        cart = await Cart.findById(cart._id).populate('items.product');

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Merge guest cart into user cart
// @route   POST /api/cart/merge
// @access  Private
const mergeCart = async (req, res) => {
    try {
        const { items } = req.body; // Items from guest cart

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(200).json({ message: 'No items to merge' });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        // Merge logic
        for (const guestItem of items) {
            const product = await Product.findById(guestItem.product._id);

            if (!product) continue; // Skip if product doesn't exist anymore

            const existingItemIndex = cart.items.findIndex(
                item => item.product.toString() === guestItem.product._id
            );

            if (existingItemIndex > -1) {
                // If item exists, add quantity, but don't exceed stock
                const newQuantity = cart.items[existingItemIndex].quantity + guestItem.quantity;
                cart.items[existingItemIndex].quantity = Math.min(newQuantity, product.stock);
            } else {
                // If item doesn't exist, check stock and add
                if (product.stock >= guestItem.quantity) {
                    cart.items.push({
                        product: guestItem.product._id,
                        quantity: guestItem.quantity,
                        price: product.price
                    });
                }
            }
        }

        await cart.save();
        cart = await Cart.findById(cart._id).populate('items.product');

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart, mergeCart };
