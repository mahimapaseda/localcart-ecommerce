// Script to update existing products with real images
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');

const imageMap = {
    'Wireless Bluetooth Headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    'Smart Watch Pro': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    '4K Ultra HD Action Camera': 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80',
    'Premium Leather Jacket': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
    'Running Sneakers Elite': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    'Designer Sunglasses': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
    'Modern Coffee Table': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    'Smart LED Desk Lamp': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80'
};

const updateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        for (const [name, imageUrl] of Object.entries(imageMap)) {
            const result = await Product.updateOne(
                { name },
                {
                    $set: {
                        images: [imageUrl],
                        isFeatured: true
                    }
                }
            );
            if (result.modifiedCount > 0) {
                console.log(`✓ Updated: ${name}`);
            } else {
                console.log(`- Skipped (not found): ${name}`);
            }
        }

        console.log('\n✓ All product images updated!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

updateImages();
