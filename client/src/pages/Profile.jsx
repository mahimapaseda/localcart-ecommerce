import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiCreditCard, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Profile.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        }
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: {
                    street: user.address?.street || '',
                    city: user.address?.city || '',
                    state: user.address?.state || '',
                    zipCode: user.address?.zipCode || '',
                    country: user.address?.country || ''
                }
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { data } = await api.put('/auth/profile', formData);
            updateUser(data);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setEditing(false);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [field]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-header">
                    <h1>My Profile</h1>
                    {!editing && (
                        <button className="btn btn-secondary" onClick={() => setEditing(true)}>
                            <FiEdit2 /> Edit Profile
                        </button>
                    )}
                </div>

                {message.text && (
                    <div className={`alert alert-${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="profile-content">
                    <div className="profile-card avatar-section">
                        <div className="avatar-large">
                            <FiUser />
                        </div>
                        <h2>{user?.name}</h2>
                        <p>{user?.email}</p>
                        <span className="badge badge-primary">{user?.role === 'admin' ? 'Administrator' : 'Customer'}</span>
                    </div>

                    <form className="profile-card info-section" onSubmit={handleSubmit}>
                        <h3>Personal Information</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label"><FiUser /> Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label"><FiMail /> Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    value={formData.email}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label"><FiPhone /> Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-input"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!editing}
                                placeholder="Enter phone number"
                            />
                        </div>

                        <h3><FiMapPin /> Address</h3>

                        <div className="form-group">
                            <label className="form-label">Street Address</label>
                            <input
                                type="text"
                                name="address.street"
                                className="form-input"
                                value={formData.address.street}
                                onChange={handleChange}
                                disabled={!editing}
                                placeholder="123 Main Street"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">City</label>
                                <input
                                    type="text"
                                    name="address.city"
                                    className="form-input"
                                    value={formData.address.city}
                                    onChange={handleChange}
                                    disabled={!editing}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">State</label>
                                <input
                                    type="text"
                                    name="address.state"
                                    className="form-input"
                                    value={formData.address.state}
                                    onChange={handleChange}
                                    disabled={!editing}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">ZIP Code</label>
                                <input
                                    type="text"
                                    name="address.zipCode"
                                    className="form-input"
                                    value={formData.address.zipCode}
                                    onChange={handleChange}
                                    disabled={!editing}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Country</label>
                                <input
                                    type="text"
                                    name="address.country"
                                    className="form-input"
                                    value={formData.address.country}
                                    onChange={handleChange}
                                    disabled={!editing}
                                />
                            </div>
                        </div>

                        <h3><FiCreditCard /> Saved Cards</h3>
                        <div className="saved-cards-list">
                            <div className="saved-card-item">
                                <div className="card-icon"><FiCreditCard /></div>
                                <div className="card-info">
                                    <div>
                                        <div className="card-last4">•••• •••• •••• 4242</div>
                                        <div className="card-expiry">Expires 12/26</div>
                                    </div>
                                    <button type="button" className="btn-icon text-danger" title="Remove Card">
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                            <div className="saved-card-item">
                                <div className="card-icon"><FiCreditCard /></div>
                                <div className="card-info">
                                    <div>
                                        <div className="card-last4">•••• •••• •••• 8888</div>
                                        <div className="card-expiry">Expires 09/25</div>
                                    </div>
                                    <button type="button" className="btn-icon text-danger" title="Remove Card">
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                            <button type="button" className="btn btn-outline btn-sm mt-3">
                                + Add New Card
                            </button>
                        </div>

                        {editing && (
                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
