const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod, items, paymentStatus } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Calculate totals
        let itemsTotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.product} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }

            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.images[0] || '',
                price: product.price,
                quantity: item.quantity
            });

            itemsTotal += product.price * item.quantity;

            // Update stock
            product.stock -= item.quantity;
            product.sold += item.quantity;
            await product.save();
        }

        const shippingCost = itemsTotal > 100 ? 0 : 10;
        const totalAmount = itemsTotal + shippingCost;

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            paymentStatus: paymentStatus || 'pending',
            itemsTotal,
            shippingCost,
            tax: 0,
            totalAmount
        });

        // Clear user's cart
        await Cart.findOneAndUpdate(
            { user: req.user._id },
            { items: [], totalAmount: 0 }
        );

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            // Check if user owns order or is admin
            if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized' });
            }
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20, search } = req.query;

        let query = {};
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'shippingAddress.fullName': { $regex: search, $options: 'i' } }
            ];
        }

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Order.countDocuments(query);

        res.json({
            orders,
            page: Number(page),
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrder = async (req, res) => {
    try {
        const { status, trackingNumber, paymentStatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (order) {
            if (status) order.status = status;
            if (trackingNumber) order.trackingNumber = trackingNumber;
            if (paymentStatus) order.paymentStatus = paymentStatus;

            if (status === 'delivered') {
                order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order stats (admin)
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const processingOrders = await Order.countDocuments({ status: 'processing' });
        const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

        const revenueResult = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const totalRevenue = revenueResult[0]?.total || 0;

        // Recent orders
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalOrders,
            pendingOrders,
            processingOrders,
            deliveredOrders,
            totalRevenue,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrder,
    getOrders,
    updateOrder,
    getOrderStats
};
