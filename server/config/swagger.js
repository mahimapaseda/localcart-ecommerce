const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'The Local Cart API',
            version: '1.0.0',
            description: 'E-Commerce API for The Local Cart - A Sri Lankan online shopping platform',
            contact: {
                name: 'API Support',
                email: 'support@localcart.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                        name: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
                        phone: { type: 'string', example: '+94 77 123 4567' },
                        address: {
                            type: 'object',
                            properties: {
                                street: { type: 'string' },
                                city: { type: 'string' },
                                state: { type: 'string' },
                                zipCode: { type: 'string' },
                                country: { type: 'string' }
                            }
                        },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Product: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string', example: 'Premium Headphones' },
                        slug: { type: 'string', example: 'premium-headphones' },
                        description: { type: 'string' },
                        price: { type: 'number', example: 15000 },
                        comparePrice: { type: 'number', example: 20000 },
                        category: { type: 'string' },
                        brand: { type: 'string' },
                        images: { type: 'array', items: { type: 'string' } },
                        stock: { type: 'integer', example: 50 },
                        sold: { type: 'integer', example: 10 },
                        rating: { type: 'number', example: 4.5 },
                        numReviews: { type: 'integer', example: 25 },
                        isFeatured: { type: 'boolean' },
                        isActive: { type: 'boolean' },
                        tags: { type: 'array', items: { type: 'string' } },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Category: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string', example: 'Electronics' },
                        slug: { type: 'string', example: 'electronics' },
                        description: { type: 'string' },
                        image: { type: 'string' },
                        parent: { type: 'string' },
                        isActive: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                CartItem: {
                    type: 'object',
                    properties: {
                        product: { $ref: '#/components/schemas/Product' },
                        quantity: { type: 'integer', example: 2 },
                        price: { type: 'number', example: 15000 }
                    }
                },
                Cart: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        user: { type: 'string' },
                        items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
                        totalAmount: { type: 'number', example: 30000 },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Order: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        user: { type: 'string' },
                        orderNumber: { type: 'string', example: 'LC1234560001' },
                        items: { type: 'array', items: { type: 'object' } },
                        shippingAddress: {
                            type: 'object',
                            properties: {
                                fullName: { type: 'string' },
                                phone: { type: 'string' },
                                street: { type: 'string' },
                                city: { type: 'string' },
                                state: { type: 'string' },
                                zipCode: { type: 'string' },
                                country: { type: 'string' }
                            }
                        },
                        paymentMethod: { type: 'string', enum: ['cod', 'card', 'paypal'] },
                        paymentStatus: { type: 'string', enum: ['pending', 'paid', 'failed', 'refunded'] },
                        itemsTotal: { type: 'number' },
                        shippingCost: { type: 'number' },
                        tax: { type: 'number' },
                        totalAmount: { type: 'number' },
                        status: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
                        trackingNumber: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Setting: {
                    type: 'object',
                    properties: {
                        storeName: { type: 'string', example: 'The Local Cart' },
                        storeDescription: { type: 'string' },
                        contactEmail: { type: 'string', format: 'email' },
                        contactPhone: { type: 'string' },
                        storeAddress: { type: 'string' },
                        is24Hours: { type: 'boolean' },
                        openingTime: { type: 'string' },
                        closingTime: { type: 'string' },
                        enableCOD: { type: 'boolean' },
                        enableCards: { type: 'boolean' },
                        enableBankTransfer: { type: 'boolean' },
                        orderNotifications: { type: 'boolean' },
                        lowStockAlerts: { type: 'boolean' },
                        lowStockThreshold: { type: 'integer' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string' },
                        token: { type: 'string' }
                    }
                }
            }
        },
        tags: [
            { name: 'Auth', description: 'Authentication endpoints' },
            { name: 'Products', description: 'Product management' },
            { name: 'Categories', description: 'Category management' },
            { name: 'Cart', description: 'Shopping cart operations' },
            { name: 'Orders', description: 'Order management' },
            { name: 'Users', description: 'User management (Admin)' },
            { name: 'Settings', description: 'Store settings' }
        ]
    },
    apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
