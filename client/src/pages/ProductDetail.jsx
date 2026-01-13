import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FiShoppingCart,
    FiHeart,
    FiShare2,
    FiMinus,
    FiPlus,
    FiStar,
    FiTruck,
    FiShield,
    FiRefreshCw
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';
import api from '../services/api';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data } = await api.get(`/products/${id}`);
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        const result = await addToCart(product, quantity);
        if (result.success) {
            // Could show toast notification here
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setSubmitting(true);
        try {
            await api.post(`/products/${id}/reviews`, reviewForm);
            fetchProduct();
            setReviewForm({ rating: 5, comment: '' });
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="loader">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!product) return null;

    const discount = product.comparePrice > product.price
        ? Math.round((1 - product.price / product.comparePrice) * 100)
        : 0;

    return (
        <div className="product-detail">
            <div className="container">
                <div className="product-grid">
                    {/* Images */}
                    <div className="product-images">
                        <div className="main-image">
                            <img
                                src={product.images?.[activeImage] || '/placeholder.jpg'}
                                alt={product.name}
                            />
                            {discount > 0 && (
                                <span className="discount-badge">-{discount}%</span>
                            )}
                        </div>
                        {product.images?.length > 1 && (
                            <div className="image-thumbnails">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        className={`thumbnail ${activeImage === idx ? 'active' : ''}`}
                                        onClick={() => setActiveImage(idx)}
                                    >
                                        <img src={img} alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="product-info">
                        <span className="product-category">{product.category?.name}</span>
                        <h1 className="product-name">{product.name}</h1>

                        <div className="product-rating">
                            <div className="stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FiStar
                                        key={star}
                                        className={`star ${star <= Math.round(product.rating) ? 'filled' : ''}`}
                                    />
                                ))}
                            </div>
                            <span className="rating-text">
                                {product.rating} ({product.numReviews} reviews)
                            </span>
                        </div>

                        <div className="product-price">
                            <span className="current-price">{formatPrice(product.price)}</span>
                            {product.comparePrice > product.price && (
                                <>
                                    <span className="original-price">{formatPrice(product.comparePrice)}</span>
                                    <span className="discount-tag">Save {discount}%</span>
                                </>
                            )}
                        </div>

                        <p className="product-description">{product.description}</p>

                        {/* Stock Status */}
                        <div className="stock-status">
                            {product.stock > 10 ? (
                                <span className="in-stock">✓ In Stock</span>
                            ) : product.stock > 0 ? (
                                <span className="low-stock">Only {product.stock} left</span>
                            ) : (
                                <span className="out-of-stock">Out of Stock</span>
                            )}
                        </div>

                        {/* Quantity & Add to Cart */}
                        {product.stock > 0 && (
                            <div className="purchase-section">
                                <div className="quantity-control">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        <FiMinus />
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                        disabled={quantity >= product.stock}
                                    >
                                        <FiPlus />
                                    </button>
                                </div>

                                <div className="purchase-buttons">
                                    <button className="btn btn-buy-now btn-lg" onClick={async () => {
                                        await addToCart(product, quantity);
                                        navigate('/checkout', { state: { buyNow: true } });
                                    }}>
                                        Buy it Now
                                    </button>

                                    <button className="btn btn-primary btn-lg add-to-cart" onClick={handleAddToCart}>
                                        <FiShoppingCart /> Add to Cart
                                    </button>
                                </div>

                                <div className="secondary-actions">
                                    <button className="btn btn-secondary btn-icon wishlist-btn">
                                        <FiHeart />
                                    </button>

                                    <button className="btn btn-secondary btn-icon share-btn">
                                        <FiShare2 />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Features */}
                        <div className="product-features">
                            <div className="feature">
                                <FiTruck />
                                <span>Free shipping on orders over Rs. 10,000</span>
                            </div>
                            <div className="feature">
                                <FiShield />
                                <span>2-year warranty included</span>
                            </div>
                            <div className="feature">
                                <FiRefreshCw />
                                <span>30-day easy returns</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews-section">
                    <h2>Customer Reviews</h2>

                    {/* Review Form */}
                    <form className="review-form" onSubmit={handleReviewSubmit}>
                        <h3>Write a Review</h3>
                        <div className="rating-input">
                            <label>Rating:</label>
                            <div className="star-picker">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`star-btn ${star <= reviewForm.rating ? 'active' : ''}`}
                                        onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                                    >
                                        <FiStar />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <textarea
                            placeholder="Share your thoughts about this product..."
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                            className="form-input form-textarea"
                            required
                        />
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>

                    {/* Reviews List */}
                    <div className="reviews-list">
                        {product.reviews?.length > 0 ? (
                            product.reviews.map((review, idx) => (
                                <div key={idx} className="review-card">
                                    <div className="review-header">
                                        <span className="review-author">{review.name}</span>
                                        <div className="review-rating">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FiStar
                                                    key={star}
                                                    className={`star ${star <= review.rating ? 'filled' : ''}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="review-comment">{review.comment}</p>
                                    <span className="review-date">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="no-reviews">No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
