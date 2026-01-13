// Quick script to reset categories and products for fresh seeding
const mongoose = require('mongoose');
require('dotenv').config();

const reset = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await mongoose.connection.db.collection('categories').drop();
        console.log('Categories dropped');

        await mongoose.connection.db.collection('products').drop();
        console.log('Products dropped');

        console.log('Done! Restart server to reseed.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

reset();
