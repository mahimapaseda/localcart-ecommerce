import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/currency';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await addToCart(product);
    };

    const discount = product.comparePrice > product.price
        ? Math.round((1 - product.price / product.comparePrice) * 100)
        : 0;

    return (
        <Link to={`/products/${product._id}`} className="product-card-link">
            <motion.div
                className="product-card"
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="product-image-container">
                    <img
                        src={product.images?.[0] || '/placeholder.jpg'}
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                    />
                    {discount > 0 && (
                        <span className="product-badge discount">-{discount}%</span>
                    )}
                    {product.isFeatured && (
                        <span className="product-badge featured">Featured</span>
                    )}
                    <div className="product-actions">
                        <button
                            className="action-btn wishlist-btn"
                            onClick={(e) => e.preventDefault()}
                            aria-label="Add to wishlist"
                        >
                            <FiHeart />
                        </button>
                        <motion.button
                            className="action-btn cart-btn"
                            onClick={handleAddToCart}
                            aria-label="Add to cart"
                            whileTap={{ scale: 0.9 }}
                        >
                            <FiShoppingCart />
                        </motion.button>
                    </div>
                </div>

                <div className="product-info">
                    <span className="product-category">
                        {product.category?.name || 'General'}
                    </span>
                    <h3 className="product-name">{product.name}</h3>

                    <div className="product-rating">
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FiStar
                                    key={star}
                                    className={`star ${star <= Math.round(product.rating) ? 'filled' : ''}`}
                                />
                            ))}
                        </div>
                        <span className="rating-count">({product.numReviews})</span>
                    </div>

                    <div className="product-price">
                        <span className="current-price">{formatPrice(product.price)}</span>
                        {product.comparePrice > product.price && (
                            <span className="original-price">{formatPrice(product.comparePrice)}</span>
                        )}
                    </div>

                    {product.stock <= 5 && product.stock > 0 && (
                        <span className="stock-warning">Only {product.stock} left!</span>
                    )}
                    {product.stock === 0 && (
                        <span className="out-of-stock">Out of Stock</span>
                    )}
                </div>
            </motion.div>
        </Link>
    );
};

export default ProductCard;
