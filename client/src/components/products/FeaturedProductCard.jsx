import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/currency';
import './FeaturedProductCard.css';

const FeaturedProductCard = ({ product }) => {
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
        <Link to={`/products/${product._id}`} className="ebay-card">
            <div className="ebay-card-image">
                <img
                    src={product.images?.[0] || '/placeholder.jpg'}
                    alt={product.name}
                    loading="lazy"
                />
                <button
                    className="ebay-wishlist-btn"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    aria-label="Add to wishlist"
                >
                    <FiHeart />
                </button>
                {product.isFeatured && (
                    <span className="ebay-sponsored">SPONSORED</span>
                )}
            </div>

            <div className="ebay-card-info">
                <h3 className="ebay-card-title">{product.name}</h3>

                <div className="ebay-card-condition">
                    <span className="condition-tag">Brand New</span>
                </div>

                <div className="ebay-card-pricing">
                    <span className="ebay-price">{formatPrice(product.price)}</span>
                    {discount > 0 && (
                        <span className="ebay-original-price">{formatPrice(product.comparePrice)}</span>
                    )}
                </div>

                {discount > 0 && (
                    <span className="ebay-discount-tag">{discount}% OFF</span>
                )}

                <div className="ebay-card-shipping">
                    <span className="free-shipping">Free shipping</span>
                </div>

                {product.numReviews > 0 && (
                    <div className="ebay-card-sold">
                        <span>{product.numReviews * 12}+ sold</span>
                    </div>
                )}

                <button
                    className="ebay-buy-now-btn"
                    onClick={handleAddToCart}
                >
                    Buy it Now
                </button>
            </div>
        </Link>
    );
};

export default FeaturedProductCard;
