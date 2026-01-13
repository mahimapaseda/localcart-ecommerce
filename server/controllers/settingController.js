const Setting = require('../models/Setting');

// @desc    Get store settings
// @route   GET /api/settings
// @access  Public (some fields might need to be restricted in future)
const getSettings = async (req, res) => {
    try {
        let settings = await Setting.findOne();

        // If no settings exist, create default
        if (!settings) {
            settings = await Setting.create({});
        }

        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update store settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        let settings = await Setting.findOne();

        if (!settings) {
            settings = await Setting.create(req.body);
        } else {
            settings = await Setting.findByIdAndUpdate(
                settings._id,
                req.body,
                { new: true, runValidators: true }
            );
        }

        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
