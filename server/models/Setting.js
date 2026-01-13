const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    storeName: {
        type: String,
        required: true,
        default: 'The Local Cart'
    },
    storeDescription: {
        type: String,
        default: 'Your one-stop shop for quality products'
    },
    contactEmail: {
        type: String,
        required: true,
        default: 'support@localcart.com'
    },
    contactPhone: {
        type: String,
        default: '+94 77 123 4567'
    },
    storeAddress: {
        type: String,
        default: '123 Main Street, Colombo, Sri Lanka'
    },

    // Business Hours
    is24Hours: {
        type: Boolean,
        default: false
    },
    openingTime: {
        type: String,
        default: '09:00'
    },
    closingTime: {
        type: String,
        default: '21:00'
    },

    // Payment Settings
    enableCOD: {
        type: Boolean,
        default: true
    },
    enableCards: {
        type: Boolean,
        default: true
    },
    enableBankTransfer: {
        type: Boolean,
        default: false
    },

    // Notifications
    orderNotifications: {
        type: Boolean,
        default: true
    },
    lowStockAlerts: {
        type: Boolean,
        default: true
    },
    lowStockThreshold: {
        type: Number,
        default: 5
    },


}, {
    timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema);
