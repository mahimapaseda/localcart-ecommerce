const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

const seedAdmin = async () => {
    try {
        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'admin@localcart.com' });

        if (!adminExists) {
            await User.create({
                name: 'Admin',
                email: 'admin@localcart.com',
                password: 'localcart',
                role: 'admin'
            });
            console.log('✓ Admin user created: admin@localcart.com / localcart');
        } else {
            console.log('✓ Admin user already exists');
        }
    } catch (error) {
        console.error('Error seeding admin:', error.message);
    }
};

const seedCategories = async () => {
    try {
        const count = await Category.countDocuments();
        if (count === 0) {
            const categoriesData = [
                { name: 'Electronics', description: 'Gadgets, devices and electronic accessories', image: '/images/categories/electronics.jpg' },
                { name: 'Fashion', description: 'Clothing, shoes and accessories', image: '/images/categories/fashion.jpg' },
                { name: 'Home & Living', description: 'Furniture, decor and home essentials', image: '/images/categories/home.jpg' },
                { name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear', image: '/images/categories/sports.jpg' },
                { name: 'Health & Beauty', description: 'Personal care and beauty products', image: '/images/categories/beauty.jpg' },
                { name: 'Books & Media', description: 'Books, music and entertainment', image: '/images/categories/books.jpg' }
            ];
            for (const cat of categoriesData) {
                await Category.create(cat);
            }
            console.log('✓ Categories seeded');
        }
    } catch (error) {
        console.error('Error seeding categories:', error.message);
    }
};

const seedProducts = async () => {
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            const electronics = await Category.findOne({ name: 'Electronics' });
            const fashion = await Category.findOne({ name: 'Fashion' });
            const home = await Category.findOne({ name: 'Home & Living' });

            if (!electronics || !fashion || !home) return;

            const products = [
                {
                    name: 'Wireless Bluetooth Headphones',
                    description: 'Premium noise-canceling wireless headphones with 30-hour battery life. Features deep bass, crystal-clear audio, and comfortable over-ear design.',
                    price: 79.99,
                    comparePrice: 129.99,
                    category: electronics._id,
                    brand: 'SoundMax',
                    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'],
                    stock: 50,
                    isFeatured: true,
                    tags: ['wireless', 'bluetooth', 'headphones', 'audio']
                },
                {
                    name: 'Smart Watch Pro',
                    description: 'Advanced smartwatch with heart rate monitor, GPS, and 7-day battery life. Water resistant and compatible with iOS and Android.',
                    price: 199.99,
                    comparePrice: 249.99,
                    category: electronics._id,
                    brand: 'TechWear',
                    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'],
                    stock: 35,
                    isFeatured: true,
                    tags: ['smartwatch', 'fitness', 'wearable']
                },
                {
                    name: '4K Ultra HD Action Camera',
                    description: 'Waterproof action camera with 4K video recording, image stabilization, and wide-angle lens. Perfect for adventures.',
                    price: 149.99,
                    comparePrice: 199.99,
                    category: electronics._id,
                    brand: 'AdventureCam',
                    images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80'],
                    stock: 25,
                    isFeatured: true,
                    tags: ['camera', '4k', 'waterproof', 'action']
                },
                {
                    name: 'Premium Leather Jacket',
                    description: 'Genuine leather jacket with classic design. Features multiple pockets, quilted lining, and premium stitching.',
                    price: 249.99,
                    comparePrice: 349.99,
                    category: fashion._id,
                    brand: 'UrbanStyle',
                    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80'],
                    stock: 20,
                    isFeatured: true,
                    tags: ['leather', 'jacket', 'mens', 'fashion']
                },
                {
                    name: 'Running Sneakers Elite',
                    description: 'Lightweight running shoes with advanced cushioning technology. Breathable mesh upper and responsive sole.',
                    price: 119.99,
                    comparePrice: 159.99,
                    category: fashion._id,
                    brand: 'SpeedRun',
                    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'],
                    stock: 60,
                    isFeatured: true,
                    tags: ['shoes', 'running', 'sneakers', 'sports']
                },
                {
                    name: 'Designer Sunglasses',
                    description: 'UV400 protection sunglasses with polarized lenses. Lightweight titanium frame with classic aviator style.',
                    price: 89.99,
                    comparePrice: 129.99,
                    category: fashion._id,
                    brand: 'SunVision',
                    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80'],
                    stock: 40,
                    isFeatured: true,
                    tags: ['sunglasses', 'accessories', 'fashion']
                },
                {
                    name: 'Modern Coffee Table',
                    description: 'Sleek mid-century modern coffee table with tempered glass top and solid wood legs. Perfect for any living room.',
                    price: 189.99,
                    comparePrice: 249.99,
                    category: home._id,
                    brand: 'HomeDecor',
                    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'],
                    stock: 15,
                    isFeatured: true,
                    tags: ['furniture', 'table', 'living room', 'modern']
                },
                {
                    name: 'Smart LED Desk Lamp',
                    description: 'Adjustable LED desk lamp with touch controls, multiple brightness levels, and USB charging port. Eye-care technology.',
                    price: 49.99,
                    comparePrice: 69.99,
                    category: home._id,
                    brand: 'LightTech',
                    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80'],
                    stock: 45,
                    isFeatured: true,
                    tags: ['lamp', 'led', 'desk', 'lighting']
                }
            ];

            for (const product of products) {
                await Product.create(product);
            }
            console.log('✓ Products seeded');
        }
    } catch (error) {
        console.error('Error seeding products:', error.message);
    }
};

const seedUsers = async () => {
    try {
        const count = await User.countDocuments({ role: 'user' });
        if (count < 5) {
            const users = [];
            for (let i = 1; i <= 10; i++) {
                users.push({
                    name: `User ${i}`,
                    email: `user${i}@example.com`,
                    password: 'password123',
                    role: 'user'
                });
            }

            for (const user of users) {
                const exists = await User.findOne({ email: user.email });
                if (!exists) {
                    await User.create(user);
                }
            }
            console.log('✓ Sample users seeded');
        }
    } catch (error) {
        console.error('Error seeding users:', error.message);
    }
};

const seedOrders = async () => {
    try {
        const count = await Order.countDocuments();
        if (count < 5) {
            const users = await User.find({ role: 'user' });
            const products = await Product.find();

            if (users.length === 0 || products.length === 0) return;

            const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

            for (let i = 0; i < 20; i++) {
                const user = users[Math.floor(Math.random() * users.length)];
                const product = products[Math.floor(Math.random() * products.length)];
                const quantity = Math.floor(Math.random() * 3) + 1;
                const itemsTotal = product.price * quantity;
                const shippingCost = 10;
                const tax = itemsTotal * 0.1;

                const status = statuses[Math.floor(Math.random() * statuses.length)];
                let paymentStatus = 'pending';

                if (status === 'delivered' || status === 'shipped') {
                    paymentStatus = 'paid';
                } else if (status === 'cancelled') {
                    paymentStatus = 'refunded'; // or failed
                } else if (Math.random() > 0.5) {
                    paymentStatus = 'paid'; // Randomly paid for other statuses
                }

                await Order.create({
                    user: user._id,
                    items: [{
                        product: product._id,
                        name: product.name,
                        image: product.images[0],
                        price: product.price,
                        quantity: quantity
                    }],
                    shippingAddress: {
                        fullName: user.name,
                        phone: '555-0100',
                        street: `${Math.floor(Math.random() * 100)} Main St`,
                        city: 'Colombo',
                        state: 'Western',
                        zipCode: '10000',
                        country: 'Sri Lanka'
                    },
                    paymentMethod: 'cod',
                    paymentStatus,
                    itemsTotal,
                    shippingCost,
                    tax,
                    totalAmount: itemsTotal + shippingCost + tax,
                    status
                });
            }
            console.log('✓ Sample orders seeded');
        }
    } catch (error) {
        console.error('Error seeding orders:', error.message);
    }
};

const seedDatabase = async () => {
    await seedAdmin();
    await seedUsers();
    await seedCategories();
    await seedProducts();
    await seedOrders();
};

module.exports = seedDatabase;
