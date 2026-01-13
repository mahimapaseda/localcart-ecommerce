import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import api from '../services/api';
import './Wishlist.css';

const Wishlist = () => {
    const { user, isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        }
    }, [isAuthenticated]);

    const fetchWishlist = async () => {
        try {
            // For now, get wishlist from user profile
            const { data } = await api.get('/auth/profile');
            if (data.wishlist && data.wishlist.length > 0) {
                // Fetch product details for wishlist items
                const products = await Promise.all(
                    data.wishlist.map(async (productId) => {
                        try {
                            const res = await api.get(`/products/${productId}`);
                            return res.data;
                        } catch {
                            return null;
                        }
                    })
                );
                setWishlist(products.filter(p => p !== null));
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await api.put('/auth/profile', {
                wishlist: wishlist.filter(p => p._id !== productId).map(p => p._id)
            });
            setWishlist(prev => prev.filter(p => p._id !== productId));
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const handleAddToCart = async (product) => {
        await addToCart(product);
    };

    if (loading) {
        return (
            <div className="wishlist-page">
                <div className="container">
                    <div className="loader"><div className="spinner"></div></div>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <div className="container">
                <h1>My Wishlist</h1>

                {wishlist.length === 0 ? (
                    <div className="empty-wishlist">
                        <FiHeart className="empty-icon" />
                        <h2>Your wishlist is empty</h2>
                        <p>Save items you love by clicking the heart icon on products.</p>
                        <Link to="/products" className="btn btn-primary">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="wishlist-grid">
                        {wishlist.map((product) => (
                            <div key={product._id} className="wishlist-card">
                                <Link to={`/products/${product._id}`} className="product-image">
                                    <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} />
                                </Link>
                                <div className="product-info">
                                    <Link to={`/products/${product._id}`} className="product-name">
                                        {product.name}
                                    </Link>
                                    <span className="product-category">{product.category?.name}</span>
                                    <div className="product-price">
                                        <span className="current-price">{formatPrice(product.price)}</span>
                                        {product.comparePrice > product.price && (
                                            <span className="original-price">{formatPrice(product.comparePrice)}</span>
                                        )}
                                    </div>
                                    <div className="product-actions">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            <FiShoppingCart /> Add to Cart
                                        </button>
                                        <button
                                            className="btn btn-secondary remove-btn"
                                            onClick={() => removeFromWishlist(product._id)}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
