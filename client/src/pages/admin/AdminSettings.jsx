import { useState, useEffect } from 'react';
import { FiSave, FiMail, FiPhone, FiMapPin, FiClock, FiCreditCard, FiBell } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import './AdminSettings.css';

const AdminSettings = () => {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        // Store Information
        storeName: '',
        storeDescription: '',
        contactEmail: '',
        contactPhone: '',
        storeAddress: '',

        // Business Hours
        is24Hours: false,
        openingTime: '09:00',
        closingTime: '21:00',

        // Payment Settings
        enableCOD: true,
        enableCards: true,
        enableBankTransfer: false,

        // Notifications
        orderNotifications: true,
        lowStockAlerts: true,

        lowStockThreshold: 5
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await api.get('/settings');
            if (data) {
                // Merge fetched data with default state structure to avoid undefined
                setSettings(prev => ({
                    ...prev,
                    ...data
                }));
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data } = await api.put('/settings', settings);
            setSettings(prev => ({ ...prev, ...data }));
            toast.success('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error(error.response?.data?.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading-settings">Loading...</div>;
    }

    return (
        <div className="admin-settings">
            <div className="settings-header">
                <h1>Settings</h1>
                <button
                    className="btn btn-primary save-btn"
                    onClick={handleSave}
                    disabled={saving}
                >
                    <FiSave />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="settings-grid">
                {/* Store Information */}
                <section className="settings-card">
                    <h2 className="card-title">
                        <FiMapPin className="title-icon" />
                        Store Information
                    </h2>
                    <div className="form-group">
                        <label>Store Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={settings.storeName}
                            onChange={(e) => handleChange('storeName', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Store Description</label>
                        <textarea
                            className="form-input form-textarea"
                            value={settings.storeDescription}
                            onChange={(e) => handleChange('storeDescription', e.target.value)}
                            rows={3}
                        />
                    </div>
                    <div className="form-group">
                        <label><FiMail className="input-icon" /> Contact Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={settings.contactEmail}
                            onChange={(e) => handleChange('contactEmail', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label><FiPhone className="input-icon" /> Contact Phone</label>
                        <input
                            type="tel"
                            className="form-input"
                            value={settings.contactPhone}
                            onChange={(e) => handleChange('contactPhone', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Store Address</label>
                        <textarea
                            className="form-input form-textarea"
                            value={settings.storeAddress}
                            onChange={(e) => handleChange('storeAddress', e.target.value)}
                            rows={2}
                        />
                    </div>
                </section>

                {/* Business Hours */}
                <section className="settings-card">
                    <h2 className="card-title">
                        <FiClock className="title-icon" />
                        Business Hours
                    </h2>
                    <div className="toggle-row">
                        <span className="toggle-label">Open 24/7</span>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.is24Hours}
                                onChange={(e) => handleChange('is24Hours', e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                    {!settings.is24Hours && (
                        <div className="hours-row">
                            <div className="form-group">
                                <label>Opening Time</label>
                                <input
                                    type="time"
                                    className="form-input"
                                    value={settings.openingTime}
                                    onChange={(e) => handleChange('openingTime', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Closing Time</label>
                                <input
                                    type="time"
                                    className="form-input"
                                    value={settings.closingTime}
                                    onChange={(e) => handleChange('closingTime', e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </section>

                {/* Payment Settings */}
                <section className="settings-card">
                    <h2 className="card-title">
                        <FiCreditCard className="title-icon" />
                        Payment Methods
                    </h2>
                    <div className="toggle-row">
                        <span className="toggle-label">Cash on Delivery (COD)</span>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.enableCOD}
                                onChange={(e) => handleChange('enableCOD', e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                    <div className="toggle-row">
                        <span className="toggle-label">Credit/Debit Cards</span>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.enableCards}
                                onChange={(e) => handleChange('enableCards', e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                    <div className="toggle-row">
                        <span className="toggle-label">Bank Transfer</span>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.enableBankTransfer}
                                onChange={(e) => handleChange('enableBankTransfer', e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </section>

                {/* Notifications */}
                <section className="settings-card">
                    <h2 className="card-title">
                        <FiBell className="title-icon" />
                        Notifications
                    </h2>
                    <div className="toggle-row">
                        <span className="toggle-label">New Order Notifications</span>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.orderNotifications}
                                onChange={(e) => handleChange('orderNotifications', e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                    <div className="toggle-row">
                        <span className="toggle-label">Low Stock Alerts</span>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.lowStockAlerts}
                                onChange={(e) => handleChange('lowStockAlerts', e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                    {settings.lowStockAlerts && (
                        <div className="form-group threshold-group">
                            <label>Alert when stock falls below</label>
                            <div className="threshold-input">
                                <input
                                    type="number"
                                    className="form-input"
                                    value={settings.lowStockThreshold}
                                    onChange={(e) => handleChange('lowStockThreshold', parseInt(e.target.value) || 0)}
                                    min={1}
                                />
                                <span className="threshold-unit">units</span>
                            </div>
                        </div>
                    )}
                </section>

                {/* Appearance */}

            </div>
        </div>
    );
};

export default AdminSettings;
